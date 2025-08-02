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
  sourceCount: number;
  verifiedClaims: VerifiedClaim[];
  sources: SourceDetails[];
  conflictingInformation: ConflictingInfo[];
  summary: string;
  processingTime: number;
  timestamp: string;
}

export interface VerifiedClaim {
  claimText: string;
  verdict: 'VERIFIED' | 'FALSE' | 'PARTIALLY_TRUE' | 'UNVERIFIED' | 'OPINION';
  confidence: number;
  supportingSources: string[]; // URLs
  contradictingSources: string[]; // URLs
  evidence: string;
  reasoning: string;
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
  topic: string;
  conflictingSources: Array<{
    url: string;
    position: string;
  }>;
  analysis: string;
}

// Remove mock data - all verification should use real APIs

export class SourceVerificationEngine {
  private perplexityApiKey: string;
  private perplexityBaseUrl = 'https://api.perplexity.ai';

  constructor(apiKey?: string) {
    this.perplexityApiKey = apiKey || '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';
  }

  async verifyWithSources(request: SourceVerificationRequest): Promise<SourceVerificationResult> {
    const startTime = Date.now();
    
    try {
      // Build specialized prompt for source verification
      const verificationPrompt = this.buildSourceVerificationPrompt(request);
      
      // Call Perplexity with source-focused parameters
      const perplexityResponse = await this.callPerplexityForSources(verificationPrompt, request);
      
      // Process and structure the response
      const result = await this.processSourceVerificationResponse(perplexityResponse);
      
      return {
        verificationId: this.generateVerificationId(),
        overallCredibility: result.overallCredibility || 50,
        sourceCount: result.sourceCount || 0,
        verifiedClaims: result.verifiedClaims || [],
        sources: result.sources || [],
        conflictingInformation: result.conflictingInformation || [],
        summary: result.summary || 'No sources found for verification',
        processingTime: Date.now() - startTime,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      console.error('Source verification failed:', error);
      // Return empty result instead of mock data
      return {
        verificationId: this.generateVerificationId(),
        overallCredibility: 0,
        sourceCount: 0,
        verifiedClaims: [],
        sources: [],
        conflictingInformation: [],
        summary: `Source verification failed: ${error.message}. No sources available for this content.`,
        processingTime: Date.now() - startTime,
        timestamp: new Date().toISOString()
      };
    }
  }

  private async callPerplexityForSources(prompt: string, request: SourceVerificationRequest) {
    const domainFilters = this.buildDomainFilters(request.focusRegion, request.sourceTypes);
    
    const response = await fetch(`${this.perplexityBaseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.perplexityApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
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
        search_domain_filter: domainFilters,
        search_recency_filter: "month"
      })
    });

    if (!response.ok) {
      throw new Error(`Perplexity API error: ${response.status} - ${response.statusText}`);
    }

    return await response.json();
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
  "sourceCount": number,
  "verificationSummary": "brief overall assessment",
  "verifiedClaims": [
    {
      "claimText": "exact claim from content",
      "verdict": "VERIFIED|FALSE|PARTIALLY_TRUE|UNVERIFIED|OPINION",
      "confidence": number (0-100),
      "evidence": "specific evidence found",
      "supportingSources": ["url1", "url2"],
      "contradictingSources": ["url3"],
      "reasoning": "explanation of verdict"
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
      "topic": "what the conflict is about",
      "conflictingSources": [
        {
          "url": "source1_url",
          "position": "what this source claims"
        },
        {
          "url": "source2_url", 
          "position": "conflicting claim"
        }
      ],
      "analysis": "explanation of the conflict"
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

  private async processSourceVerificationResponse(response: any): Promise<Partial<SourceVerificationResult>> {
    try {
      const content = response.choices[0].message.content;
      const automaticCitations = response.citations || [];
      
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('No valid JSON response from Perplexity');
      }
      
      const parsed = JSON.parse(jsonMatch[0]);
      
      const enhancedSources = this.enhanceSourcesWithCitations(parsed.sources, automaticCitations);
      
      return {
        overallCredibility: Math.min(100, Math.max(0, parsed.overallCredibility || 50)),
        sourceCount: enhancedSources.length,
        verifiedClaims: parsed.verifiedClaims || [],
        sources: enhancedSources,
        conflictingInformation: parsed.conflictingInformation || [],
        summary: parsed.verificationSummary || 'Verification completed'
      };
    } catch (error) {
      console.error('Error processing source verification response:', error);
      throw error;
    }
  }

  private enhanceSourcesWithCitations(parsedSources: any[], automaticCitations: any[]): SourceDetails[] {
    const sourceMap = new Map();
    
    (parsedSources || []).forEach(source => {
      sourceMap.set(source.url, {
        ...source,
        accessDate: new Date().toISOString().split('T')[0]
      });
    });
    
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
    
    return 60;
  }

  private inferSourceType(url: string): string {
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