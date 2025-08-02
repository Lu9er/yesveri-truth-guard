import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { VerificationEngine, VerificationResult, VerificationInput } from '@/lib/verification-engine';
import { CheckCircle, Shield, TrendingUp, Clock, FileText, Link, AlertCircle, Search } from 'lucide-react';
import SourceVerificationResults from '@/components/SourceVerificationResults';

export default function Verify() {
  const [input, setInput] = useState<VerificationInput>({ content: '', contentType: 'text' });
  const [isVerifying, setIsVerifying] = useState(false);
  const [result, setResult] = useState<VerificationResult | null>(null);
  const [progress, setProgress] = useState(0);

  const engine = new VerificationEngine();

  const handleVerify = async () => {
    if (!input.content.trim()) return;

    setIsVerifying(true);
    setProgress(0);
    setResult(null);

    // Simulate progress updates
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 90) {
          clearInterval(progressInterval);
          return 90;
        }
        return prev + Math.random() * 20;
      });
    }, 200);

    try {
      const verificationResult = await engine.verify(input);
      setResult(verificationResult);
      setProgress(100);
    } catch (error) {
      console.error('Verification failed:', error);
    } finally {
      setIsVerifying(false);
      clearInterval(progressInterval);
    }
  };

  const getTrustScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getTrustScoreBadge = (score: number) => {
    if (score >= 80) return 'bg-green-100 text-green-800';
    if (score >= 60) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-primary mb-4">Verify Content</h1>
            <p className="text-lg text-muted-foreground">
              Analyze any text or URL for trustworthiness using AI-powered verification
            </p>
          </div>

          <div className="grid gap-8 lg:grid-cols-2">
            {/* Input Section */}
            <Card className="h-fit">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Content Input
                </CardTitle>
                <CardDescription>
                  Enter text content or a URL to verify its trustworthiness
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Tabs 
                  value={input.contentType} 
                  onValueChange={(value) => setInput({...input, contentType: value as 'text' | 'url'})}
                >
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="text">Text Content</TabsTrigger>
                    <TabsTrigger value="url">URL</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="text" className="space-y-4">
                    <Textarea 
                      placeholder="Enter the text content you want to verify..."
                      value={input.content}
                      onChange={(e) => setInput({...input, content: e.target.value})}
                      className="min-h-[200px]"
                    />
                    <div className="text-sm text-muted-foreground">
                      {input.content.length}/5000 characters
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="url" className="space-y-4">
                    <Input 
                      type="url"
                      placeholder="https://example.com/article"
                      value={input.content}
                      onChange={(e) => setInput({...input, content: e.target.value})}
                    />
                    <div className="text-sm text-muted-foreground">
                      We'll extract and analyze the content from this URL
                    </div>
                  </TabsContent>
                </Tabs>

                <Button 
                  onClick={handleVerify}
                  disabled={!input.content.trim() || isVerifying}
                  className="w-full"
                  size="lg"
                >
                  {isVerifying ? (
                    <>
                      <Clock className="w-4 h-4 mr-2 animate-spin" />
                      Verifying...
                    </>
                  ) : (
                    <>
                      <Shield className="w-4 h-4 mr-2" />
                      Verify Content
                    </>
                  )}
                </Button>

                {isVerifying && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Processing...</span>
                      <span>{Math.round(progress)}%</span>
                    </div>
                    <Progress value={progress} className="h-2" />
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Results Section */}
            <div className="space-y-6">
              {result ? (
                <>
                  {/* Trust Score Card */}
                  <Card className="bg-gradient-to-r from-primary/5 to-secondary/5 border-primary/20">
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between">
                        <span className="flex items-center gap-2">
                          <Shield className="w-5 h-5 text-primary" />
                          Trust Score
                        </span>
                        <span className={`text-3xl font-bold ${getTrustScoreColor(result.trustScore)}`}>
                          {result.trustScore}%
                        </span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Progress value={result.trustScore} className="h-3 mb-4" />
                      <div className="flex items-center gap-2">
                        <Badge className={getTrustScoreBadge(result.trustScore)}>
                          {result.trustScore >= 80 ? 'High Trust' : 
                           result.trustScore >= 60 ? 'Medium Trust' : 'Low Trust'}
                        </Badge>
                        <span className="text-sm text-muted-foreground">
                          Processed in {result.processingTime}ms
                        </span>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Detailed Analysis Tabs */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Detailed Analysis</CardTitle>
                    </CardHeader>
                    <CardContent>
                       <Tabs defaultValue="overview" className="w-full">
                        <TabsList className="grid w-full grid-cols-3">
                          <TabsTrigger value="overview">Overview</TabsTrigger>
                          <TabsTrigger value="analysis">Analysis</TabsTrigger>
                          <TabsTrigger value="sources">Sources</TabsTrigger>
                        </TabsList>

                        <TabsContent value="overview" className="space-y-4 mt-6">
                          {/* Sentiment Analysis */}
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="text-sm font-medium flex items-center">
                                <TrendingUp className="w-4 h-4 mr-2 text-blue-600" />
                                Sentiment Analysis
                              </span>
                              <span className="text-sm font-bold">{result.sentimentAnalysis.score}%</span>
                            </div>
                            <Progress value={result.sentimentAnalysis.score} className="h-2" />
                            <div className="flex items-center gap-2">
                              <Badge variant="outline">
                                {result.sentimentAnalysis.label}
                              </Badge>
                              <span className="text-xs text-muted-foreground">
                                {Math.round(result.sentimentAnalysis.confidence * 100)}% confidence
                              </span>
                            </div>
                          </div>

                          {/* Fact Check Score */}
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="text-sm font-medium flex items-center">
                                <CheckCircle className="w-4 h-4 mr-2 text-primary" />
                                Fact Check Score
                              </span>
                              <span className="text-sm font-bold text-primary">{result.factCheck.score}%</span>
                            </div>
                            <Progress value={result.factCheck.score} className="h-2" />
                            <div className="text-xs text-muted-foreground">
                              {result.factCheck.summary}
                            </div>
                          </div>

                          {/* Source Credibility */}
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="text-sm font-medium flex items-center">
                                <Link className="w-4 h-4 mr-2 text-green-600" />
                                Source Credibility
                              </span>
                              <span className="text-sm font-bold text-green-600">{result.sourceCredibility.score}%</span>
                            </div>
                            <Progress value={result.sourceCredibility.score} className="h-2" />
                            <div className="text-xs text-muted-foreground">
                              {result.sourceCredibility.summary}
                            </div>
                          </div>

                          {/* Blockchain Verification */}
                          <div className="flex items-center justify-between p-3 bg-primary/5 rounded-lg">
                            <span className="text-sm font-medium flex items-center">
                              <Shield className="w-4 h-4 mr-2 text-primary" />
                              Blockchain Verified
                            </span>
                            <div className="flex items-center text-primary">
                              <CheckCircle className="w-4 h-4 mr-1" />
                              <span className="text-sm font-bold">Verified</span>
                            </div>
                          </div>

                          {/* Content Classification */}
                          <div className="pt-4 border-t">
                            <div className="grid grid-cols-2 gap-4 text-sm">
                              <div>
                                <span className="font-medium">Content Type:</span>
                                <Badge variant="outline" className="ml-2">
                                  {result.contentClassification.type}
                                </Badge>
                              </div>
                              <div>
                                <span className="font-medium">Language:</span>
                                <span className="ml-2">{result.contentClassification.language}</span>
                              </div>
                            </div>
                          </div>
                        </TabsContent>

                        <TabsContent value="analysis" className="space-y-6 mt-6">
                          {/* Sentiment Analysis */}
                          <Card>
                            <CardHeader>
                              <CardTitle className="flex items-center">
                                <TrendingUp className="w-5 h-5 mr-2" />
                                Sentiment Analysis
                              </CardTitle>
                              <CardDescription>Analysis of emotional tone and sentiment in the content</CardDescription>
                            </CardHeader>
                            <CardContent>
                              <div className="space-y-4">
                                <div className="flex justify-between items-center">
                                  <span className="font-medium">Sentiment Score</span>
                                  <Badge variant={result.sentimentAnalysis.score >= 70 ? "default" : result.sentimentAnalysis.score >= 40 ? "secondary" : "destructive"}>
                                    {result.sentimentAnalysis.score}%
                                  </Badge>
                                </div>
                                <Progress value={result.sentimentAnalysis.score} className="h-3" />
                                <div className="grid grid-cols-2 gap-4 text-sm">
                                  <div>
                                    <span className="font-medium">Label:</span>
                                    <span className="ml-2 capitalize">{result.sentimentAnalysis.label}</span>
                                  </div>
                                  <div>
                                    <span className="font-medium">Confidence:</span>
                                    <span className="ml-2">{Math.round(result.sentimentAnalysis.confidence * 100)}%</span>
                                  </div>
                                </div>
                              </div>
                            </CardContent>
                          </Card>

                          {/* Fact Check Analysis */}
                          <Card>
                            <CardHeader>
                              <CardTitle className="flex items-center">
                                <CheckCircle className="w-5 h-5 mr-2" />
                                Fact Check Analysis
                              </CardTitle>
                              <CardDescription>Verification of factual claims in the content</CardDescription>
                            </CardHeader>
                            <CardContent>
                              <div className="space-y-4">
                                <div className="flex justify-between items-center">
                                  <span className="font-medium">Fact Check Score</span>
                                  <Badge variant={result.factCheck.score >= 80 ? "default" : result.factCheck.score >= 60 ? "secondary" : "destructive"}>
                                    {result.factCheck.score}%
                                  </Badge>
                                </div>
                                <Progress value={result.factCheck.score} className="h-3" />
                                
                                <div className="space-y-3">
                                  <h4 className="font-medium">Claims Analysis</h4>
                                  {result.factCheck.claims.map((claim, index) => (
                                    <div key={index} className="p-3 bg-muted rounded-lg">
                                      <div className="flex justify-between items-start mb-2">
                                        <p className="text-sm font-medium">{claim.text}</p>
                                        <Badge variant={claim.verdict === 'TRUE' ? "default" : claim.verdict === 'PARTIALLY_TRUE' ? "secondary" : "destructive"}>
                                          {claim.verdict}
                                        </Badge>
                                      </div>
                                      <p className="text-xs text-muted-foreground">{claim.explanation}</p>
                                      <div className="mt-2 text-xs">
                                        <span className="font-medium">Sources:</span> {claim.sources.join(', ')}
                                      </div>
                                    </div>
                                  ))}
                                </div>
                                
                                <div className="p-3 bg-muted rounded-lg">
                                  <p className="text-sm">{result.factCheck.summary}</p>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        </TabsContent>

                        <TabsContent value="sources" className="space-y-6 mt-6">
                          {/* Source Credibility */}
                          <Card>
                            <CardHeader>
                              <CardTitle>Source Credibility</CardTitle>
                              <CardDescription>Analysis of content sources and their reliability</CardDescription>
                            </CardHeader>
                            <CardContent>
                              <div className="space-y-4">
                                <div className="flex justify-between items-center">
                                  <span className="font-medium">Overall Credibility Score</span>
                                  <Badge variant={result.sourceCredibility.score >= 80 ? "default" : result.sourceCredibility.score >= 60 ? "secondary" : "destructive"}>
                                    {result.sourceCredibility.score}%
                                  </Badge>
                                </div>
                                
                                <div className="space-y-3">
                                  <h4 className="font-medium">Domain Analysis</h4>
                                  {result.sourceCredibility.domains.map((domain, index) => (
                                    <div key={index} className="flex justify-between items-center p-3 bg-muted rounded-lg">
                                      <div>
                                        <div className="font-medium">{domain.domain}</div>
                                        <div className="text-sm text-muted-foreground capitalize">{domain.type} source</div>
                                      </div>
                                      <Badge variant={domain.credibility >= 80 ? "default" : domain.credibility >= 60 ? "secondary" : "destructive"}>
                                        {domain.credibility}%
                                      </Badge>
                                    </div>
                                  ))}
                                </div>
                                
                                <div className="p-3 bg-muted rounded-lg">
                                  <p className="text-sm">{result.sourceCredibility.summary}</p>
                                </div>
                              </div>
                            </CardContent>
                          </Card>

                          {/* Source Verification */}
                          {result.sourceVerification ? (
                            <SourceVerificationResults verification={result.sourceVerification} />
                          ) : (
                            <Card>
                              <CardHeader>
                                <CardTitle className="flex items-center">
                                  <Search className="w-5 h-5 mr-2" />
                                  Source Verification
                                </CardTitle>
                                <CardDescription>Detailed source-based fact verification analysis</CardDescription>
                              </CardHeader>
                              <CardContent>
                                <p className="text-muted-foreground">Source verification data not available.</p>
                              </CardContent>
                            </Card>
                          )}
                        </TabsContent>
                      </Tabs>
                    </CardContent>
                  </Card>
                </>
              ) : (
                <Card className="border-dashed">
                  <CardContent className="flex flex-col items-center justify-center py-12">
                    <AlertCircle className="w-12 h-12 text-muted-foreground mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No Analysis Yet</h3>
                    <p className="text-muted-foreground text-center">
                      Enter content and click "Verify Content" to see detailed analysis results
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}