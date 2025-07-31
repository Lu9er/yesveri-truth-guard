import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { CheckCircle, Shield, TrendingUp } from "lucide-react";

export const TrustDashboard = () => {
  return (
    <Card className="w-full max-w-md bg-gradient-trust border-none shadow-lg animate-slide-in-right">
      <CardHeader className="pb-4">
        <div className="flex items-center space-x-2">
          <Shield className="w-5 h-5 text-primary" />
          <CardTitle className="text-lg font-semibold">Trust Score Dashboard</CardTitle>
        </div>
        <p className="text-sm text-muted-foreground">
          Verify content accuracy and sentiment
        </p>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Sentiment Analysis */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium flex items-center">
              <TrendingUp className="w-4 h-4 mr-2 text-accent" />
              Sentiment Analysis
            </span>
            <span className="text-sm font-bold text-accent">87%</span>
          </div>
          <Progress value={87} className="h-2" />
        </div>

        {/* Fact Check Score */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium flex items-center">
              <CheckCircle className="w-4 h-4 mr-2 text-primary" />
              Fact Check Score
            </span>
            <span className="text-sm font-bold text-primary">92%</span>
          </div>
          <Progress value={92} className="h-2" />
        </div>

        {/* Blockchain Verification */}
        <div className="flex items-center justify-between p-3 bg-accent/10 rounded-lg">
          <span className="text-sm font-medium flex items-center">
            <Shield className="w-4 h-4 mr-2 text-accent" />
            Blockchain Verified
          </span>
          <div className="flex items-center text-accent">
            <CheckCircle className="w-4 h-4 mr-1" />
            <span className="text-sm font-bold">Verified</span>
          </div>
        </div>

        {/* Overall Trust Score */}
        <div className="pt-2 border-t border-border">
          <div className="flex items-center justify-between mb-2">
            <span className="font-semibold">Overall Trust Score</span>
            <span className="text-2xl font-bold text-primary">89%</span>
          </div>
          <div className="text-xs text-muted-foreground">
            Last updated: 2 minutes ago
          </div>
        </div>
      </CardContent>
    </Card>
  );
};