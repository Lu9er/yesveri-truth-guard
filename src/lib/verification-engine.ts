import { generateId } from './utils';

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
  async verify(input: VerificationInput): Promise<VerificationResult> {
    const startTime = Date.now();
    
    try {
      // Simulate processing delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Process content
      const processedContent = await this.preprocessContent(input);
      
      // Run parallel mock verifications
      const [
        sentimentResult,
        factCheckResult,
        sourceCredibilityResult,
        contentClassification
      ] = await Promise.all([
        this.analyzeSentiment(processedContent),
        this.performFactCheck(processedContent),
        this.assessSourceCredibility(processedContent),
        this.classifyContent(processedContent)
      ]);

      // Calculate trust score
      const trustScore = this.calculateTrustScore({
        sentiment: sentimentResult,
        factCheck: factCheckResult,
        sourceCredibility: sourceCredibilityResult,
        classification: contentClassification
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
      // Mock URL content extraction
      return `Extracted content from ${input.content}: Lorem ipsum dolor sit amet, consectetur adipiscing elit.`;
    }
    return input.content;
  }

  private async analyzeSentiment(content: string): Promise<SentimentResult> {
    // Add some variation to mock data
    const variations = [
      { score: 85, label: 'positive' as const, confidence: 0.9 },
      { score: 65, label: 'neutral' as const, confidence: 0.75 },
      { score: 45, label: 'negative' as const, confidence: 0.8 }
    ];
    return variations[Math.floor(Math.random() * variations.length)];
  }

  private async performFactCheck(content: string): Promise<FactCheckResult> {
    const scores = [75, 82, 68, 91, 55];
    const score = scores[Math.floor(Math.random() * scores.length)];
    
    return {
      ...MOCK_RESPONSES.factCheck,
      score,
      verified: score >= 70
    };
  }

  private async assessSourceCredibility(content: string): Promise<SourceCredibilityResult> {
    const scores = [88, 72, 95, 64, 81];
    return {
      ...MOCK_RESPONSES.sourceCredibility,
      score: scores[Math.floor(Math.random() * scores.length)]
    };
  }

  private async classifyContent(content: string): Promise<ContentClassification> {
    const types = ['factual', 'opinion', 'mixed'] as const;
    return {
      ...MOCK_RESPONSES.contentClassification,
      type: types[Math.floor(Math.random() * types.length)]
    };
  }

  private calculateTrustScore(data: {
    sentiment: SentimentResult;
    factCheck: FactCheckResult;
    sourceCredibility: SourceCredibilityResult;
    classification: ContentClassification;
  }): number {
    // Weighted calculation
    const weights = {
      factCheck: 0.4,
      sourceCredibility: 0.3,
      sentiment: 0.2,
      classification: 0.1
    };

    const sentimentScore = data.sentiment.score;
    const classificationScore = data.classification.confidence;

    const weighted = (
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
