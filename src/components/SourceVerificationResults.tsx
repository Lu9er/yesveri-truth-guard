import { useState } from 'react';
import { ExternalLink, CheckCircle, XCircle, AlertCircle, Eye } from 'lucide-react';
import type { SourceVerificationResult, VerifiedClaim, SourceDetails, ConflictingInfo } from '../lib/source-verification-engine';

interface SourceVerificationResultsProps {
  verification: SourceVerificationResult;
}

export default function SourceVerificationResults({ verification }: SourceVerificationResultsProps) {
  const [activeTab, setActiveTab] = useState<'claims' | 'sources' | 'conflicts'>('claims');

  return (
    <div className="bg-background rounded-lg border shadow-lg p-6">
      {/* Overall Score */}
      <div className="mb-6 text-center">
        <div className={`text-4xl font-bold mb-2 ${
          verification.overallCredibility >= 80 ? 'text-positive' :
          verification.overallCredibility >= 60 ? 'text-warning' :
          'text-destructive'
        }`}>
          {verification.overallCredibility}%
        </div>
        <div className="text-muted-foreground">Source-Verified Credibility</div>
        <div className="text-sm text-muted-foreground mt-1">
          Based on {verification.sources.length} sources • Confidence: {verification.confidence}%
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b mb-6">
        <button
          onClick={() => setActiveTab('claims')}
          className={`px-4 py-2 font-medium transition-colors ${
            activeTab === 'claims' 
              ? 'border-b-2 border-primary text-primary' 
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          Verified Claims ({verification.claimsVerified.length})
        </button>
        <button
          onClick={() => setActiveTab('sources')}
          className={`px-4 py-2 font-medium transition-colors ${
            activeTab === 'sources' 
              ? 'border-b-2 border-primary text-primary' 
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          Sources ({verification.sources.length})
        </button>
        {verification.conflictingInformation.length > 0 && (
          <button
            onClick={() => setActiveTab('conflicts')}
            className={`px-4 py-2 font-medium transition-colors ${
              activeTab === 'conflicts' 
                ? 'border-b-2 border-primary text-primary' 
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Conflicts ({verification.conflictingInformation.length})
          </button>
        )}
      </div>

      {/* Tab Content */}
      {activeTab === 'claims' && <ClaimsTab claims={verification.claimsVerified} />}
      {activeTab === 'sources' && <SourcesTab sources={verification.sources} />}
      {activeTab === 'conflicts' && <ConflictsTab conflicts={verification.conflictingInformation} />}

      {/* Summary */}
      <div className="mt-6 p-4 bg-muted rounded-lg">
        <h4 className="font-semibold mb-2">Verification Summary</h4>
        <p className="text-muted-foreground">{verification.summary}</p>
      </div>
    </div>
  );
}

function ClaimsTab({ claims }: { claims: VerifiedClaim[] }) {
  return (
    <div className="space-y-4">
      {claims.map((claim, index) => (
        <div key={index} className="border rounded-lg p-4">
          <div className="flex items-start justify-between mb-3">
            <div className="flex-1">
              <p className="font-medium text-foreground">{claim.claim}</p>
              <p className="text-sm text-muted-foreground mt-1">{claim.evidence}</p>
            </div>
            <div className="ml-4 flex items-center space-x-2">
              <VerdictIcon verdict={claim.verificationStatus} />
              <span className={`text-sm font-medium ${getVerdictColor(claim.verificationStatus)}`}>
                {claim.verificationStatus}
              </span>
            </div>
          </div>
          
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>Confidence: {claim.confidence}%</span>
            <div className="flex space-x-4">
              {claim.sources.length > 0 && (
                <span className="text-positive">
                  {claim.sources.length} sources
                </span>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function SourcesTab({ sources }: { sources: SourceDetails[] }) {
  return (
    <div className="space-y-3">
      {sources
        .sort((a, b) => b.credibilityScore - a.credibilityScore)
        .map((source, index) => (
        <div key={index} className="border rounded-lg p-4 hover:bg-muted/50 transition-colors">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-2">
                <a 
                  href={source.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="font-medium text-primary hover:text-primary/80 flex items-center transition-colors"
                >
                  {source.title}
                  <ExternalLink className="w-4 h-4 ml-1" />
                </a>
                {source.isNigerianSource && (
                  <span className="px-2 py-1 bg-positive/10 text-positive text-xs rounded">
                    Nigerian Source
                  </span>
                )}
              </div>
              
              <p className="text-sm text-muted-foreground mb-2">
                {source.domain} • {source.sourceType}
                {source.publicationDate && ` • ${source.publicationDate}`}
              </p>
              
              {source.relevantQuote && (
                <blockquote className="text-sm italic text-muted-foreground pl-3 border-l-2 border-border">
                  "{source.relevantQuote}"
                </blockquote>
              )}
            </div>
            
            <div className="ml-4 text-right">
              <div className={`text-lg font-bold ${
                source.credibilityScore >= 80 ? 'text-positive' :
                source.credibilityScore >= 60 ? 'text-warning' :
                'text-destructive'
              }`}>
                {source.credibilityScore}%
              </div>
              <div className="text-xs text-muted-foreground">credibility</div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function ConflictsTab({ conflicts }: { conflicts: ConflictingInfo[] }) {
  return (
    <div className="space-y-4">
      {conflicts.map((conflict, index) => (
        <div key={index} className="border border-warning/20 rounded-lg p-4 bg-warning/5">
          <h4 className="font-semibold text-warning mb-2 flex items-center">
            <AlertCircle className="w-5 h-5 mr-2" />
            Conflicting Information: {conflict.claim}
          </h4>
          
          <div className="space-y-3 mb-3">
            {conflict.conflictingClaims.map((claim, idx) => (
              <div key={idx} className="bg-background p-3 rounded border-l-4 border-warning">
                <div className="text-foreground">{claim}</div>
              </div>
            ))}
          </div>
          
          <div className="text-sm text-muted-foreground">
            Sources: {conflict.sources.join(', ')}
          </div>
        </div>
      ))}
    </div>
  );
}

function VerdictIcon({ verdict }: { verdict: string }) {
  switch (verdict) {
    case 'VERIFIED': return <CheckCircle className="w-5 h-5 text-positive" />;
    case 'FALSE': return <XCircle className="w-5 h-5 text-destructive" />;
    case 'PARTIALLY_TRUE': return <AlertCircle className="w-5 h-5 text-warning" />;
    case 'UNVERIFIED': return <Eye className="w-5 h-5 text-muted-foreground" />;
    default: return <AlertCircle className="w-5 h-5 text-muted-foreground" />;
  }
}

function getVerdictColor(verdict: string): string {
  switch (verdict) {
    case 'VERIFIED': return 'text-positive';
    case 'FALSE': return 'text-destructive';
    case 'PARTIALLY_TRUE': return 'text-warning';
    case 'UNVERIFIED': return 'text-muted-foreground';
    case 'OPINION': return 'text-primary';
    default: return 'text-muted-foreground';
  }
}