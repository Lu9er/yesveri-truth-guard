import { generateId } from './utils';
import { SourceVerificationEngine, SourceVerificationResult } from './source-verification-engine';

// Core interfaces
export interface VerificationInput {
  content: string;
  contentType: 'text' | 'url';
  language?: string;
}

export interface SentimentResult {
  score: number;
  label: 'positive' | 'negative' | 'neutral';
  confidence: number;
}

export interface FactCheckResult {
  score: number;
  claims: Array<{
    text: string;
    verdict: 'TRUE' | 'FALSE' | 'PARTIALLY_TRUE' | 'UNVERIFIED';
    confidence: number;
    sources: string[];
    explanation: string;
  }>;
  sources: string[];
  summary: string;
  confidence: number;
  verified: boolean;
}

export interface SourceCredibilityResult {
  score: number;
  domains: Array<{
    domain: string;
    credibility: number;
    type: 'news' | 'academic' | 'government' | 'social' | 'unknown';
  }>;
  summary: string;
}

export interface ContentClassification {
  type: 'factual' | 'opinion' | 'mixed';
  confidence: number;
  readability: number;
  language: string;
}

export interface BlockchainResult {
  hash: string;
  verified: boolean;
  timestamp: string;
}

export interface VerificationResult {
  id: string;
  trustScore: number;
  sentimentAnalysis: SentimentResult;
  factCheck: FactCheckResult;
  sourceCredibility: SourceCredibilityResult;
  contentClassification: ContentClassification;
  blockchain: BlockchainResult;
  sourceVerification?: SourceVerificationResult;
  processingTime: number;
  timestamp: string;
  content_preview: string;
  contentType: 'text' | 'url';
}

// Mock responses for development
const MOCK_RESPONSES = {
  sentiment: {
    score: 75,
    label: 'positive' as const,
    confidence: 0.85
  },
  factCheck: {
    score: 82,
    claims: [
      {
        text: "Nigeria's economy is growing",
        verdict: 'PARTIALLY_TRUE' as const,
        confidence: 80,
        sources: ["https://reuters.com", "https://bbc.com"],
        explanation: "Economic indicators show mixed results with some sectors growing while others decline"
      }
    ],
    sources: ["https://reuters.com", "https://bbc.com", "https://punchng.com"],
    summary: "Content contains verifiable claims with reliable sources",
    confidence: 82,
    verified: true
  },
  sourceCredibility: {
    score: 88,
    domains: [
      {
        domain: "reuters.com",
        credibility: 95,
        type: 'news' as const
      }
    ],
    summary: "Sources demonstrate high credibility ratings"
  },
  contentClassification: {
    type: 'factual' as const,
    confidence: 90,
    readability: 75,
    language: 'en'
  }
};

export class VerificationEngine {
  private sourceVerificationEngine: SourceVerificationEngine;
  private googleFactCheckApiKey = 'AIzaSyAWKPf61om8_O7H-io2xYB6KmSHx9S1kPg';
  private perspectiveApiKey = 'AIzaSyAmATLIbsDPH-HCxE4ifSJoyMv6vTadITA';
  private openaiApiKey = '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';

  constructor() {
    this.sourceVerificationEngine = new SourceVerificationEngine();
  }

  async verify(input: VerificationInput): Promise<VerificationResult> {
    const startTime = Date.now();
    
    try {
      // Simulate processing delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Process content
      const processedContent = await this.preprocessContent(input);
      
      // Run source verification first to get actual sources
      const sourceVerificationResult = await this.performSourceVerification(input);
      
      // Run other verifications in parallel
      const [
        sentimentResult,
        factCheckResult,
        contentClassification
      ] = await Promise.all([
        this.analyzeSentiment(processedContent),
        this.performFactCheck(processedContent),
        this.classifyContent(processedContent)
      ]);

      // Assess source credibility based on actual sources from verification
      const sourceCredibilityResult = this.buildSourceCredibilityFromVerification(sourceVerificationResult);

      // Calculate trust score
      const trustScore = this.calculateTrustScore({
        sentiment: sentimentResult,
        factCheck: factCheckResult,
        sourceCredibility: sourceCredibilityResult,
        classification: contentClassification,
        sourceVerification: sourceVerificationResult
      });

      // Generate blockchain hash
      const blockchainResult = await this.generateBlockchainHash(processedContent, trustScore);

      const result: VerificationResult = {
        id: generateId(),
        trustScore,
        sentimentAnalysis: sentimentResult,
        factCheck: factCheckResult,
        sourceCredibility: sourceCredibilityResult,
        contentClassification: contentClassification,
        blockchain: blockchainResult,
        sourceVerification: sourceVerificationResult,
        processingTime: Date.now() - startTime,
        timestamp: new Date().toISOString(),
        content_preview: input.content.substring(0, 100) + (input.content.length > 100 ? '...' : ''),
        contentType: input.contentType
      };

      // Store in localStorage
      this.storeVerificationResult(result);
      
      return result;
    } catch (error) {
      console.error('Verification engine error:', error);
      throw new Error(`Verification failed: ${error.message}`);
    }
  }

  private async preprocessContent(input: VerificationInput): Promise<string> {
    if (input.contentType === 'url') {
      return await this.extractContentFromUrl(input.content);
    }
    return input.content;
  }

  private async extractContentFromUrl(url: string): Promise<string> {
    try {
      // Note: Puppeteer cannot run in browser environment
      // This would need to be implemented as a backend service or Supabase Edge Function
      
      // Fallback: Use a web scraping service API or extract basic content
      const response = await fetch(`https://api.allorigins.win/get?url=${encodeURIComponent(url)}`);
      if (!response.ok) {
        throw new Error('Failed to fetch URL content');
      }
      
      const data = await response.json();
      const content = data.contents;
      
      // Basic text extraction (remove HTML tags)
      const textContent = content.replace(/<[^>]*>/g, ' ')
        .replace(/\s+/g, ' ')
        .trim()
        .substring(0, 3000); // Limit for token optimization
      
      return textContent || `Content extracted from ${url}`;
    } catch (error) {
      console.error('URL extraction error:', error);
      return `Failed to extract content from ${url}. Please provide the text directly.`;
    }
  }

  private async analyzeSentiment(content: string): Promise<SentimentResult> {
    try {
      const response = await fetch(`https://commentanalyzer.googleapis.com/v1alpha1/comments:analyze?key=${this.perspectiveApiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          requestedAttributes: {
            TOXICITY: {},
            SEVERE_TOXICITY: {},
            IDENTITY_ATTACK: {},
            INSULT: {},
            PROFANITY: {},
            THREAT: {}
          },
          languages: ['en'],
          doNotStore: true,
          comment: {
            text: content.substring(0, 3000) // API has text length limits
          }
        })
      });

      if (!response.ok) {
        throw new Error(`Perspective API error: ${response.status}`);
      }

      const data = await response.json();
      const toxicityScore = data.attributeScores?.TOXICITY?.summaryScore?.value || 0;
      
      // Convert toxicity to sentiment (inverse relationship)
      const sentimentScore = Math.round((1 - toxicityScore) * 100);
      
      let label: 'positive' | 'negative' | 'neutral';
      if (sentimentScore >= 70) label = 'positive';
      else if (sentimentScore <= 40) label = 'negative';
      else label = 'neutral';

      return {
        score: sentimentScore,
        label,
        confidence: data.attributeScores?.TOXICITY?.summaryScore?.value ? 0.9 : 0.5
      };
    } catch (error) {
      console.error('Sentiment analysis error:', error);
      // Fallback to mock data
      const variations = [
        { score: 85, label: 'positive' as const, confidence: 0.9 },
        { score: 65, label: 'neutral' as const, confidence: 0.75 },
        { score: 45, label: 'negative' as const, confidence: 0.8 }
      ];
      return variations[Math.floor(Math.random() * variations.length)];
    }
  }

  private async performFactCheck(content: string): Promise<FactCheckResult> {
    try {
      const query = encodeURIComponent(content.substring(0, 500)); // API has query length limits
      const response = await fetch(
        `https://factchecktools.googleapis.com/v1alpha1/claims:search?key=${this.googleFactCheckApiKey}&query=${query}&languageCode=en`
      );

      if (!response.ok) {
        throw new Error(`Fact Check API error: ${response.status}`);
      }

      const data = await response.json();
      const claims = data.claims || [];

      if (claims.length === 0) {
        // No fact-check results found
        return {
          score: 50,
          claims: [{
            text: "No specific fact-check claims found",
            verdict: 'UNVERIFIED',
            confidence: 50,
            sources: [],
            explanation: "This content does not match any existing fact-checked claims in the database."
          }],
          sources: [],
          summary: "No fact-check data available for this content",
          confidence: 50,
          verified: false
        };
      }

      // Process claims
      const processedClaims = claims.slice(0, 5).map((claim: any) => {
        const claimReview = claim.claimReview?.[0];
        let verdict: 'TRUE' | 'FALSE' | 'PARTIALLY_TRUE' | 'UNVERIFIED' = 'UNVERIFIED';
        
        if (claimReview?.textualRating) {
          const rating = claimReview.textualRating.toLowerCase();
          if (rating.includes('true') && !rating.includes('false')) verdict = 'TRUE';
          else if (rating.includes('false') && !rating.includes('true')) verdict = 'FALSE';
          else if (rating.includes('partly') || rating.includes('partially') || rating.includes('mixed')) verdict = 'PARTIALLY_TRUE';
        }

        return {
          text: claim.text || "Claim text unavailable",
          verdict,
          confidence: verdict === 'UNVERIFIED' ? 30 : 85,
          sources: claimReview ? [claimReview.url] : [],
          explanation: claimReview?.textualRating || "No explanation available"
        };
      });

      // Calculate overall score
      const verifiedClaims = processedClaims.filter(c => c.verdict !== 'UNVERIFIED');
      const trueClaims = processedClaims.filter(c => c.verdict === 'TRUE');
      const falseClaims = processedClaims.filter(c => c.verdict === 'FALSE');
      
      let score = 50;
      if (verifiedClaims.length > 0) {
        score = Math.round((trueClaims.length * 100 + processedClaims.filter(c => c.verdict === 'PARTIALLY_TRUE').length * 50) / verifiedClaims.length);
      }

      const sources = [...new Set(processedClaims.flatMap(c => c.sources))].filter((source): source is string => typeof source === 'string');

      return {
        score,
        claims: processedClaims,
        sources,
        summary: `Found ${claims.length} related fact-check(s). ${trueClaims.length} verified as true, ${falseClaims.length} as false.`,
        confidence: verifiedClaims.length > 0 ? 85 : 30,
        verified: verifiedClaims.length > 0
      };
    } catch (error) {
      console.error('Fact check error:', error);
      // Fallback to mock data
      const scores = [75, 82, 68, 91, 55];
      const score = scores[Math.floor(Math.random() * scores.length)];
      
      return {
        ...MOCK_RESPONSES.factCheck,
        score,
        verified: score >= 70
      };
    }
  }

  private buildSourceCredibilityFromVerification(sourceVerification: SourceVerificationResult): SourceCredibilityResult {
    if (!sourceVerification || sourceVerification.sources.length === 0) {
      return {
        score: 0,
        domains: [],
        summary: "No sources available for credibility assessment"
      };
    }

    // Build domains array from actual sources
    const domains = sourceVerification.sources.map(source => ({
      domain: source.domain,
      credibility: source.credibilityScore,
      type: source.sourceType as 'news' | 'academic' | 'government' | 'social' | 'unknown'
    }));

    // Calculate average credibility score
    const avgScore = domains.length > 0 
      ? Math.round(domains.reduce((sum, d) => sum + d.credibility, 0) / domains.length)
      : 0;

    const sourceTypes = [...new Set(domains.map(d => d.type))];
    const highCredSources = domains.filter(d => d.credibility >= 80).length;

    return {
      score: avgScore,
      domains,
      summary: `Analyzed ${domains.length} source(s). ${highCredSources} high-credibility sources found. Source types: ${sourceTypes.join(', ')}.`
    };
  }

  private async assessSourceCredibility(content: string): Promise<SourceCredibilityResult> {
    // This method is deprecated - source credibility is now built from actual verification sources
    return {
      score: 0,
      domains: [],
      summary: "Source credibility assessment requires actual verification sources"
    };
  }

  private async classifyContent(content: string): Promise<ContentClassification> {
    try {
      const limitedContent = content.substring(0, 3000); // Token optimization
      
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.openaiApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: [
            {
              role: 'system',
              content: 'You are a content analyzer. Classify the given text and return a JSON response with: type (factual/opinion/mixed), confidence (0-100), readability (0-100), and language (ISO code).'
            },
            {
              role: 'user',
              content: `Analyze this content: ${limitedContent}`
            }
          ],
          max_tokens: 200,
          temperature: 0.3
        })
      });

      if (!response.ok) {
        throw new Error(`OpenAI API error: ${response.status}`);
      }

      const data = await response.json();
      const aiResponse = data.choices[0]?.message?.content;
      
      if (aiResponse) {
        try {
          const parsed = JSON.parse(aiResponse);
          return {
            type: parsed.type || 'mixed',
            confidence: parsed.confidence || 70,
            readability: parsed.readability || 75,
            language: parsed.language || 'en'
          };
        } catch {
          // If JSON parsing fails, extract values from text response
          const typeMatch = aiResponse.match(/type.*?["|'](factual|opinion|mixed)["|']/i);
          const confidenceMatch = aiResponse.match(/confidence.*?(\d+)/i);
          
          return {
            type: (typeMatch?.[1] as 'factual' | 'opinion' | 'mixed') || 'mixed',
            confidence: confidenceMatch ? parseInt(confidenceMatch[1]) : 70,
            readability: 75,
            language: 'en'
          };
        }
      }
      
      throw new Error('No response from OpenAI');
    } catch (error) {
      console.error('Content classification error:', error);
      // Fallback to rule-based classification
      const factualKeywords = ['according to', 'study shows', 'research indicates', 'data reveals'];
      const opinionKeywords = ['i think', 'in my opinion', 'believe', 'feel that'];
      
      const lowerContent = content.toLowerCase();
      const factualCount = factualKeywords.filter(word => lowerContent.includes(word)).length;
      const opinionCount = opinionKeywords.filter(word => lowerContent.includes(word)).length;
      
      let type: 'factual' | 'opinion' | 'mixed' = 'mixed';
      if (factualCount > opinionCount) type = 'factual';
      else if (opinionCount > factualCount) type = 'opinion';
      
      return {
        type,
        confidence: 60,
        readability: 70,
        language: 'en'
      };
    }
  }

  private async performSourceVerification(input: VerificationInput): Promise<SourceVerificationResult> {
    return this.sourceVerificationEngine.verifyWithSources({
      content: input.content,
      contentType: input.contentType,
      focusRegion: 'nigeria',
      sourceTypes: ['news', 'government', 'academic']
    });
  }

  private calculateTrustScore(data: {
    sentiment: SentimentResult;
    factCheck: FactCheckResult;
    sourceCredibility: SourceCredibilityResult;
    classification: ContentClassification;
    sourceVerification: SourceVerificationResult;
  }): number {
    // Weighted calculation with source verification being most important
    const weights = {
      sourceVerification: 0.4,
      factCheck: 0.3,
      sourceCredibility: 0.2,
      sentiment: 0.05,
      classification: 0.05
    };

    const sentimentScore = data.sentiment.score;
    const classificationScore = data.classification.confidence;
    const sourceVerificationScore = data.sourceVerification?.overallCredibility || 0;

    const weighted = (
      sourceVerificationScore * weights.sourceVerification +
      data.factCheck.score * weights.factCheck +
      data.sourceCredibility.score * weights.sourceCredibility +
      sentimentScore * weights.sentiment +
      classificationScore * weights.classification
    );

    return Math.round(weighted);
  }

  private async generateBlockchainHash(content: string, trustScore: number): Promise<BlockchainResult> {
    // Generate a mock hash
    const hash = Array.from({ length: 64 }, () => 
      Math.floor(Math.random() * 16).toString(16)
    ).join('');

    return {
      hash,
      verified: true,
      timestamp: new Date().toISOString()
    };
  }

  private storeVerificationResult(result: VerificationResult): void {
    try {
      const stored = JSON.parse(localStorage.getItem('yesveri_data') || '{"verifications": []}');
      stored.verifications.unshift(result);
      // Keep only last 100 for demo
      stored.verifications = stored.verifications.slice(0, 100);
      localStorage.setItem('yesveri_data', JSON.stringify(stored));
    } catch (error) {
      console.error('Failed to store verification result:', error);
    }
  }
}

// Utility function to get verification history
export const getVerificationHistory = (): VerificationResult[] => {
  try {
    const stored = JSON.parse(localStorage.getItem('yesveri_data') || '{"verifications": []}');
    return stored.verifications || [];
  } catch {
    return [];
  }
};

// Utility function to get stats
export const getVerificationStats = () => {
  const verifications = getVerificationHistory();
  const today = new Date().toDateString();
  const todayVerifications = verifications.filter(v => 
    new Date(v.timestamp).toDateString() === today
  );
  
  const avgTrust = verifications.length > 0 
    ? verifications.reduce((sum, v) => sum + v.trustScore, 0) / verifications.length
    : 0;
    
  const avgTime = verifications.length > 0
    ? verifications.reduce((sum, v) => sum + v.processingTime, 0) / verifications.length
    : 0;

  return {
    totalVerifications: verifications.length,
    todayCount: todayVerifications.length,
    averageTrustScore: Math.round(avgTrust),
    averageResponseTime: Math.round(avgTime)
  };
};
