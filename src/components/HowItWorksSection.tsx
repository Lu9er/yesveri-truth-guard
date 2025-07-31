import { Card, CardContent } from "@/components/ui/card";
import { Upload, Brain, CheckCircle } from "lucide-react";

const steps = [
  {
    step: 1,
    icon: Upload,
    title: "Submit Content",
    description: "Upload text, URLs, or documents for analysis. Our system supports multiple formats and languages.",
    color: "text-primary"
  },
  {
    step: 2,
    icon: Brain,
    title: "AI Analysis",
    description: "Advanced algorithms analyze sentiment, fact-check claims, and assess content credibility in real-time.",
    color: "text-trust"
  },
  {
    step: 3,
    icon: CheckCircle,
    title: "Get Results",
    description: "Receive detailed verification reports with trust scores, blockchain proof, and actionable insights.",
    color: "text-secondary"
  }
];

export const HowItWorksSection = () => {
  return (
    <section className="py-24 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            <span className="text-foreground">How</span>
            <span className="bg-gradient-primary bg-clip-text text-transparent"> Yesveri </span>
            <span className="text-foreground">Works</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Simple, fast, and reliable content verification in three easy steps
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
          {steps.map((step, index) => (
            <div 
              key={step.step}
              className="relative animate-fade-in"
              style={{ animationDelay: `${index * 0.2}s` }}
            >
              <Card className="text-center border-2 border-dashed border-border hover:border-primary/50 transition-all duration-300 bg-gradient-to-br from-background to-muted/20">
                <CardContent className="pt-8 pb-8">
                  {/* Step number */}
                  <div className="inline-flex w-16 h-16 items-center justify-center rounded-full bg-primary text-primary-foreground text-xl font-bold mb-6">
                    {step.step}
                  </div>
                  
                  {/* Icon */}
                  <div className={`inline-flex w-12 h-12 items-center justify-center rounded-lg bg-primary/10 mb-6`}>
                    <step.icon className={`w-6 h-6 ${step.color}`} />
                  </div>

                  {/* Content */}
                  <h3 className="text-xl font-semibold mb-4">{step.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {step.description}
                  </p>
                </CardContent>
              </Card>

              {/* Connecting arrow for desktop */}
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-1/2 -right-6 lg:-right-12 transform -translate-y-1/2">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-primary/40">
                    <path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center mt-16">
          <div className="inline-flex items-center space-x-2 bg-gradient-trust px-6 py-3 rounded-full text-sm font-medium">
            <CheckCircle className="w-4 h-4 text-primary" />
            <span>Ready to verify your content? Start now!</span>
          </div>
        </div>
      </div>
    </section>
  );
};