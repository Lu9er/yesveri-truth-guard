import { generateId } from './utils';

// Core interfaces
export interface SourceVerificationRequest {
  content: string;
  contentType: 'text' | 'url';
  focusRegion?: 'nigeria' | 'global';
  sourceTypes?: ('news' | 'government' | 'academic' | 'medical')[];
}

export interface SourceVerificationResult {
  verificationId: string;
  overallCredibility: number; // 0-100
  claimsVerified: VerifiedClaim[];
  sources: SourceDetails[];
  conflictingInformation: ConflictingInfo[];
  summary: string;
  confidence: number;
}

export interface VerifiedClaim {
  claim: string;
  verificationStatus: 'VERIFIED' | 'FALSE' | 'PARTIALLY_TRUE' | 'UNVERIFIED' | 'OPINION';
  confidence: number;
  sources: string[];
  evidence: string;
}

export interface SourceDetails {
  url: string;
  title: string;
  domain: string;
  credibilityScore: number;
  publicationDate?: string;
  relevantQuote: string;
  sourceType: 'news' | 'government' | 'academic' | 'social' | 'blog';
  isNigerianSource: boolean;
  accessDate: string;
}

export interface ConflictingInfo {
  claim: string;
  conflictingClaims: string[];
  sources: string[];
}

export class SourceVerificationEngine {
  private perplexityApiKey: string;
  private perplexityBaseUrl = 'https://api.perplexity.ai';

  constructor(apiKey?: string) {
    this.perplexityApiKey = apiKey || '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';
  }

  async verifyWithSources(request: SourceVerificationRequest): Promise<SourceVerificationResult> {
    try {
      console.log('🔍 Starting source verification for:', request.content.substring(0, 100) + '...');
      
      // Preprocess content to extract specific claims
      const processedClaims = this.extractFactualClaims(request.content);
      console.log('📋 Extracted claims:', processedClaims);
      
      // Run basic sanity checks first
      const sanityCheckResult = this.performSanityChecks(request.content);
      console.log('🧪 Sanity check result:', sanityCheckResult);
      
      let perplexityResult;
      
      // Try multiple verification approaches
      for (const claim of processedClaims.slice(0, 3)) { // Limit to 3 claims to avoid quota issues
        console.log(`🔍 Verifying claim: "${claim}"`);
        try {
          const prompt = this.buildTargetedVerificationPrompt(claim, request);
          console.log('📝 Generated prompt:', prompt.substring(0, 200) + '...');
          
          const response = await this.callPerplexityForSources(prompt, request);
          console.log('📡 Perplexity response status:', response ? 'Success' : 'Failed');
          console.log('📊 Response data:', JSON.stringify(response, null, 2));
          
          if (response && this.hasValidSources(response)) {
            perplexityResult = response;
            break; // Use first successful result
          }
        } catch (claimError) {
          console.warn(`⚠️ Failed to verify claim "${claim}":`, claimError.message);
          continue;
        }
      }
      
      if (!perplexityResult) {
        console.warn('⚠️ All verification attempts failed, using fallback');
        // If no API results, still provide analysis based on content
        return this.createFallbackResult(request, sanityCheckResult, processedClaims);
      }
      
      const result = this.processSourceVerificationResponse(perplexityResult, sanityCheckResult);
      console.log('✅ Final verification result:', {
        credibility: result.overallCredibility,
        sourcesFound: result.sources.length,
        claimsVerified: result.claimsVerified.length
      });
      
      return result;
    } catch (error) {
      console.error('❌ Source verification error:', error);
      
      return {
        verificationId: this.generateVerificationId(),
        overallCredibility: 0,
        claimsVerified: [],
        sources: [],
        conflictingInformation: [],
        summary: `Verification failed: ${error.message}. This may indicate network issues or invalid content.`,
        confidence: 0
      };
    }
  }

  private extractFactualClaims(content: string): string[] {
    // Extract specific factual claims from content
    const sentences = content.split(/[.!?]+/).filter(s => s.trim().length > 10);
    const factualClaims = [];
    
    for (const sentence of sentences) {
      const trimmed = sentence.trim();
      // Look for factual patterns
      if (this.isFactualClaim(trimmed)) {
        factualClaims.push(trimmed);
      }
    }
    
    return factualClaims.length > 0 ? factualClaims : [content.substring(0, 200)];
  }
  
  private isFactualClaim(sentence: string): boolean {
    const factualPatterns = [
      /\b(is|are|was|were|has|have|will|did|does)\b/i,
      /\b\d+/,  // Contains numbers
      /\b(according to|study|research|report|data)\b/i,
      /\b(president|minister|government|official)\b/i,
      /\b(country|city|state|nation)\b/i
    ];
    
    return factualPatterns.some(pattern => pattern.test(sentence));
  }
  
  private performSanityChecks(content: string): { isSane: boolean; issues: string[]; confidence: number } {
    const issues = [];
    const lowerContent = content.toLowerCase();
    
    // Check for geographic impossibilities
    if (lowerContent.includes('nigeria') && lowerContent.includes('snow')) {
      issues.push('Geographic impossibility: Nigeria does not experience snow');
    }
    
    // Check for timeline contradictions
    const currentYear = new Date().getFullYear();
    const yearMatches = content.match(/\b(19|20)\d{2}\b/g);
    if (yearMatches) {
      for (const year of yearMatches) {
        const yearNum = parseInt(year);
        if (yearNum > currentYear) {
          issues.push(`Timeline error: Year ${year} is in the future`);
        }
      }
    }
    
    // Check for obvious falsehoods
    const obviousFalsehoods = [
      'earth is flat',
      'sun orbits earth',
      'gravity does not exist'
    ];
    
    for (const falsehood of obviousFalsehoods) {
      if (lowerContent.includes(falsehood)) {
        issues.push(`Scientifically false claim: ${falsehood}`);
      }
    }
    
    return {
      isSane: issues.length === 0,
      issues,
      confidence: issues.length === 0 ? 90 : Math.max(10, 90 - (issues.length * 20))
    };
  }
  
  private buildTargetedVerificationPrompt(claim: string, request: SourceVerificationRequest): string {
    return `
FACT-CHECK THIS SPECIFIC CLAIM:
"${claim}"

Please verify this claim and provide:
1. Whether this claim is TRUE, FALSE, or PARTIALLY TRUE
2. Credible sources that support or refute this claim
3. Any conflicting information from different sources

Focus on finding authoritative sources and be specific about the verification status.
${request.focusRegion === 'nigeria' ? 'Pay special attention to Nigerian sources and context.' : ''}

Return your response in a structured format with clear citations.
`;
  }
  
  private hasValidSources(response: any): boolean {
    return response && 
           response.citations && 
           Array.isArray(response.citations) && 
           response.citations.length > 0;
  }
  
  private createFallbackResult(request: SourceVerificationRequest, sanityCheck: any, claims: string[]): SourceVerificationResult {
    const baseCredibility = sanityCheck.isSane ? 30 : 5; // Low credibility for unverified content
    
    return {
      verificationId: this.generateVerificationId(),
      overallCredibility: baseCredibility,
      claimsVerified: claims.map(claim => ({
        claim,
        verificationStatus: sanityCheck.isSane ? 'UNVERIFIED' : 'FALSE',
        confidence: sanityCheck.confidence,
        sources: [],
        evidence: sanityCheck.issues.length > 0 ? sanityCheck.issues.join('; ') : 'No sources available for verification'
      })),
      sources: [],
      conflictingInformation: sanityCheck.issues.map(issue => ({
        claim: 'Content analysis',
        conflictingClaims: [issue],
        sources: ['Internal validation']
      })),
      summary: sanityCheck.issues.length > 0 
        ? `Content failed basic verification checks: ${sanityCheck.issues.join(', ')}`
        : 'No sources found to verify this content. Treat with caution.',
      confidence: sanityCheck.confidence
    };
  }

  private async callPerplexityForSources(prompt: string, request: SourceVerificationRequest) {
    const domainFilters = this.buildDomainFilters(request.focusRegion, request.sourceTypes);
    
    const requestBody = {
      model: 'llama-3.1-sonar-large-128k-online',
      messages: [
        {
          role: 'system',
          content: this.getSourceVerificationSystemPrompt()
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      max_tokens: 3000,
      temperature: 0.1,
      top_p: 0.9,
      return_citations: true,
      search_domain_filter: domainFilters.length > 0 ? domainFilters : undefined,
      search_recency_filter: "month",
      frequency_penalty: 1,
      presence_penalty: 0
    };
    
    console.log('📡 Perplexity API request:', {
      url: `${this.perplexityBaseUrl}/chat/completions`,
      model: requestBody.model,
      promptLength: prompt.length,
      domainFilters,
      hasApiKey: !!this.perplexityApiKey
    });
    
    const response = await fetch(`${this.perplexityBaseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.perplexityApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody)
    });

    console.log('📡 Perplexity API response status:', response.status, response.statusText);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Perplexity API error details:', errorText);
      throw new Error(`Perplexity API error: ${response.status} - ${response.statusText}. Details: ${errorText}`);
    }

    const result = await response.json();
    console.log('📊 Perplexity API response size:', JSON.stringify(result).length, 'chars');
    return result;
  }

  private buildSourceVerificationPrompt(request: SourceVerificationRequest): string {
    const focusContext = request.focusRegion === 'nigeria' 
      ? "Pay special attention to Nigerian context, culture, and local sources."
      : "Focus on international credible sources.";

    return `
SOURCE-BASED FACT VERIFICATION ANALYSIS

Content to verify: "${request.content}"

${focusContext}

TASK: Perform comprehensive source-based verification following these steps:

1. **IDENTIFY ALL FACTUAL CLAIMS**
   - Extract every verifiable statement from the content
   - Distinguish facts from opinions and subjective statements

2. **SEARCH FOR EVIDENCE**
   - Find credible sources that support or refute each claim
   - Prioritize recent, authoritative sources
   - Cross-reference multiple sources for each claim

3. **ANALYZE SOURCE CREDIBILITY**
   - Evaluate the reliability of each source found
   - Consider publication date, author credentials, domain authority
   - Identify potential bias or conflicts of interest

4. **VERIFY CLAIMS WITH EVIDENCE**
   - Match specific evidence from sources to each claim
   - Note any conflicting information between sources
   - Highlight claims that lack sufficient evidence

**REQUIRED JSON OUTPUT FORMAT:**
{
  "overallCredibility": number (0-100),
  "claimsVerified": [
    {
      "claim": "exact claim from content",
      "verificationStatus": "VERIFIED|FALSE|PARTIALLY_TRUE|UNVERIFIED|OPINION",
      "confidence": number (0-100),
      "evidence": "specific evidence found",
      "sources": ["url1", "url2"]
    }
  ],
  "sources": [
    {
      "url": "full URL",
      "title": "article/page title",
      "domain": "domain.com",
      "credibilityScore": number (0-100),
      "publicationDate": "YYYY-MM-DD or null",
      "relevantQuote": "specific text supporting/refuting claims",
      "sourceType": "news|government|academic|social|blog",
      "isNigerianSource": boolean
    }
  ],
  "conflictingInformation": [
    {
      "claim": "what the conflict is about",
      "conflictingClaims": ["different positions taken"],
      "sources": ["source1_url", "source2_url"]
    }
  ]
}
`;
  }

  private getSourceVerificationSystemPrompt(): string {
    return `You are an expert fact-checker and source verification specialist. Your job is to:

1. Find and verify information using only credible, citable sources
2. Provide exact URLs and relevant quotes for every claim verification
3. Assess source credibility based on domain authority, publication standards, and expertise
4. Identify conflicts between sources and explain them
5. Distinguish between factual claims and opinions
6. Focus on Nigerian context when relevant, using local credible sources

ALWAYS prioritize:
- Government and official sources for policy/statistics
- Established news organizations with editorial standards  
- Academic and research institutions for scientific claims
- Primary sources over secondary reporting
- Recent information over outdated sources`;
  }

  private buildDomainFilters(region?: string, sourceTypes?: string[]): string[] {
    const baseDomains = [
      'bbc.com', 'reuters.com', 'ap.org', 'cnn.com', 'theguardian.com',
      'nytimes.com', 'washingtonpost.com', 'npr.org'
    ];

    const nigerianDomains = [
      'punchng.com', 'thenationonlineng.net', 'premiumtimesng.com',
      'thisday.ng', 'vanguardngr.com', 'dailytrust.com', 'channelstv.com',
      'saharareporters.com', 'leadership.ng'
    ];

    const governmentDomains = [
      'gov.ng', 'who.int', 'un.org', 'worldbank.org', 'imf.org',
      'cdc.gov', 'fda.gov'
    ];

    const academicDomains = [
      'scholar.google.com', 'pubmed.ncbi.nlm.nih.gov', 'nature.com',
      'science.org', 'jstor.org'
    ];

    let domains = [...baseDomains];

    if (region === 'nigeria') {
      domains = [...nigerianDomains, ...baseDomains];
    }

    if (sourceTypes?.includes('government')) {
      domains.push(...governmentDomains);
    }

    if (sourceTypes?.includes('academic')) {
      domains.push(...academicDomains);
    }

    return domains;
  }

  private processSourceVerificationResponse(response: any, sanityCheck?: any): SourceVerificationResult {
    try {
      const content = response.choices[0].message.content;
      const automaticCitations = response.citations || [];
      
      console.log('🔍 Processing response content:', content.substring(0, 300) + '...');
      console.log('📎 Automatic citations found:', automaticCitations.length);
      
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        console.warn('⚠️ No valid JSON response from Perplexity, creating fallback result');
        return this.createFallbackFromText(content, automaticCitations, sanityCheck);
      }
      
      const parsed = JSON.parse(jsonMatch[0]);
      const enhancedSources = this.enhanceSourcesWithCitations(parsed.sources || [], automaticCitations);
      
      // Apply sanity check penalties
      let credibilityPenalty = 0;
      if (sanityCheck && !sanityCheck.isSane) {
        credibilityPenalty = 50; // Heavy penalty for failed sanity checks
      }
      
      const finalCredibility = Math.max(0, (parsed.overallCredibility || 50) - credibilityPenalty);
      
      return {
        verificationId: this.generateVerificationId(),
        overallCredibility: finalCredibility,
        claimsVerified: parsed.claimsVerified || [],
        sources: enhancedSources,
        conflictingInformation: parsed.conflictingInformation || [],
        summary: parsed.summary || `Verification completed with ${enhancedSources.length} sources found`,
        confidence: parsed.confidence || (enhancedSources.length > 0 ? 80 : 30)
      };
    } catch (error) {
      console.error('❌ Error processing source verification response:', error);
      // Create minimal result from citations if available
      return this.createFallbackFromCitations(response.citations || [], sanityCheck);
    }
  }

  private createFallbackFromText(content: string, citations: any[], sanityCheck?: any): SourceVerificationResult {
    // Extract basic info from text response if JSON parsing fails
    const enhancedSources = this.enhanceSourcesWithCitations([], citations);
    const hasCredibleSources = enhancedSources.some(s => s.credibilityScore >= 80);
    
    return {
      verificationId: this.generateVerificationId(),
      overallCredibility: hasCredibleSources ? 60 : 30,
      claimsVerified: [{
        claim: 'General content verification',
        verificationStatus: 'UNVERIFIED',
        confidence: 50,
        sources: citations.map(c => c.url).slice(0, 3),
        evidence: content.substring(0, 200)
      }],
      sources: enhancedSources,
      conflictingInformation: [],
      summary: `Basic verification completed with ${enhancedSources.length} sources`,
      confidence: hasCredibleSources ? 60 : 30
    };
  }

  private createFallbackFromCitations(citations: any[], sanityCheck?: any): SourceVerificationResult {
    const enhancedSources = this.enhanceSourcesWithCitations([], citations);
    const credibility = sanityCheck && !sanityCheck.isSane ? 5 : (enhancedSources.length > 0 ? 40 : 10);
    
    return {
      verificationId: this.generateVerificationId(),
      overallCredibility: credibility,
      claimsVerified: [],
      sources: enhancedSources,
      conflictingInformation: sanityCheck?.issues?.map(issue => ({
        claim: 'Content analysis',
        conflictingClaims: [issue],
        sources: ['Internal validation']
      })) || [],
      summary: sanityCheck?.issues?.length > 0 
        ? `Verification failed basic checks: ${sanityCheck.issues.join(', ')}`
        : 'Minimal verification completed',
      confidence: credibility
    };
  }

  private enhanceSourcesWithCitations(parsedSources: any[], automaticCitations: any[]): SourceDetails[] {
    const sourceMap = new Map();
    
    // Add parsed sources first
    (parsedSources || []).forEach(source => {
      sourceMap.set(source.url, {
        ...source,
        accessDate: new Date().toISOString().split('T')[0]
      });
    });
    
    // Add automatic citations
    automaticCitations.forEach(citation => {
      if (!sourceMap.has(citation.url)) {
        sourceMap.set(citation.url, {
          url: citation.url,
          title: citation.title || 'Source',
          domain: new URL(citation.url).hostname,
          credibilityScore: this.assessDomainCredibility(citation.url),
          relevantQuote: citation.text?.substring(0, 300) || '',
          sourceType: this.inferSourceType(citation.url),
          isNigerianSource: this.isNigerianSource(citation.url),
          accessDate: new Date().toISOString().split('T')[0]
        });
      }
    });
    
    return Array.from(sourceMap.values());
  }

  private assessDomainCredibility(url: string): number {
    const credibilityMap = {
      'bbc.com': 95, 'reuters.com': 95, 'ap.org': 94,
      'punchng.com': 85, 'premiumtimesng.com': 85, 'thenationonlineng.net': 82,
      'gov.ng': 90, 'who.int': 95, 'un.org': 90,
      'nature.com': 95, 'science.org': 94
    };
    
    for (const [domain, score] of Object.entries(credibilityMap)) {
      if (url.includes(domain)) return score;
    }
    
    return 60; // Default credibility for unknown domains
  }

  private inferSourceType(url: string): 'news' | 'government' | 'academic' | 'social' | 'blog' {
    if (url.includes('.gov') || url.includes('who.int') || url.includes('un.org')) return 'government';
    if (url.includes('scholar.google') || url.includes('pubmed') || url.includes('.edu')) return 'academic';
    if (url.includes('facebook.com') || url.includes('twitter.com') || url.includes('instagram.com')) return 'social';
    return 'news';
  }

  private isNigerianSource(url: string): boolean {
    const nigerianDomains = ['punchng.com', 'thenationonlineng.net', 'premiumtimesng.com', 'thisday.ng', 'vanguardngr.com', 'gov.ng'];
    return nigerianDomains.some(domain => url.includes(domain));
  }

  private generateVerificationId(): string {
    return `verify_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}