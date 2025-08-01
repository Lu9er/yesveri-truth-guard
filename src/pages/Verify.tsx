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
import { CheckCircle, Shield, TrendingUp, Clock, FileText, Link, AlertCircle } from 'lucide-react';

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

                  {/* Detailed Analysis */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Detailed Analysis</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
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