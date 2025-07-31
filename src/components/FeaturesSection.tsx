import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Brain, Shield, Globe, Zap, CheckCircle, TrendingUp } from "lucide-react";

const features = [
  {
    icon: Brain,
    title: "AI-Powered Analysis",
    description: "Advanced sentiment analysis and natural language processing to understand content context and emotional tone.",
    color: "text-primary"
  },
  {
    icon: Shield,
    title: "Blockchain Verification",
    description: "Immutable verification records stored on blockchain for complete transparency and tamper-proof results.",
    color: "text-accent"
  },
  {
    icon: Globe,
    title: "Multi-Language Support",
    description: "Native support for English, Yoruba, Hausa, and Igbo languages with cultural context awareness.",
    color: "text-secondary"
  },
  {
    icon: Zap,
    title: "Real-Time Processing",
    description: "Lightning-fast content analysis with results delivered in seconds, not minutes.",
    color: "text-primary"
  },
  {
    icon: CheckCircle,
    title: "Fact Verification",
    description: "Cross-reference claims against multiple authoritative sources for comprehensive fact-checking.",
    color: "text-accent"
  },
  {
    icon: TrendingUp,
    title: "Trust Scoring",
    description: "Comprehensive trust scores based on multiple verification metrics and credibility indicators.",
    color: "text-secondary"
  }
];

export const FeaturesSection = () => {
  return (
    <section className="py-24 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            <span className="text-foreground">Powerful Features for</span>
            <br />
            <span className="bg-gradient-primary bg-clip-text text-transparent">
              Content Verification
            </span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Comprehensive tools and AI capabilities designed to verify content accuracy, 
            detect misinformation, and provide trustworthy analysis.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card 
              key={feature.title}
              className="relative bg-background border-border hover:shadow-lg transition-all duration-300 hover:-translate-y-1 animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <CardHeader className="pb-4">
                <div className={`inline-flex w-12 h-12 items-center justify-center rounded-lg bg-primary/10 mb-4`}>
                  <feature.icon className={`w-6 h-6 ${feature.color}`} />
                </div>
                <CardTitle className="text-xl font-semibold">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </CardContent>
              
              {/* Subtle gradient overlay */}
              <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-transparent via-transparent to-primary/5 pointer-events-none"></div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};