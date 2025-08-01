import { Button } from "@/components/ui/button";
import { TrustDashboard } from "./TrustDashboard";
import { ArrowRight, PlayCircle } from "lucide-react";
import { Link } from "react-router-dom";

export const HeroSection = () => {
  return (
    <section className="relative min-h-[600px] bg-gradient-hero py-16 sm:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-5 gap-12 items-center">
          {/* Left Content - 60% */}
          <div className="lg:col-span-3 space-y-8 animate-fade-in">
            <div className="space-y-6">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight">
                <span className="text-foreground">Verify Content with</span>
                <br />
                <span className="bg-gradient-primary bg-clip-text text-transparent">
                  Confidence
                </span>
              </h1>
              
              <p className="text-xl text-muted-foreground max-w-2xl leading-relaxed">
                A powerful AI-driven platform that analyzes content for trustworthiness using 
                sentiment analysis, fact-checking, and blockchain verification.
              </p>
            </div>

            {/* Feature highlights */}
            <div className="flex flex-wrap gap-4 text-sm">
              <div className="flex items-center space-x-2 bg-primary/10 px-3 py-2 rounded-full">
                <div className="w-2 h-2 bg-primary rounded-full"></div>
                <span>Multi-language Support</span>
              </div>
              <div className="flex items-center space-x-2 bg-accent/10 px-3 py-2 rounded-full">
                <div className="w-2 h-2 bg-accent rounded-full"></div>
                <span>Blockchain Verified</span>
              </div>
              <div className="flex items-center space-x-2 bg-secondary/10 px-3 py-2 rounded-full">
                <div className="w-2 h-2 bg-secondary rounded-full"></div>
                <span>Real-time Analysis</span>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="text-base font-semibold" asChild>
                <Link to="/verify">
                  Get Started
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
              </Button>
              <Button variant="outline" size="lg" className="text-base font-semibold">
                <PlayCircle className="mr-2 w-5 h-5" />
                Learn More
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-8 pt-8 border-t border-border/50">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">99.7%</div>
                <div className="text-sm text-muted-foreground">Accuracy Rate</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-accent">1M+</div>
                <div className="text-sm text-muted-foreground">Content Verified</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-secondary">4</div>
                <div className="text-sm text-muted-foreground">Languages</div>
              </div>
            </div>
          </div>

          {/* Right Content - 40% */}
          <div className="lg:col-span-2 flex justify-center lg:justify-end">
            <TrustDashboard />
          </div>
        </div>
      </div>

      {/* Background decoration */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-20 right-20 w-72 h-72 bg-primary/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-20 w-96 h-96 bg-accent/5 rounded-full blur-3xl"></div>
      </div>
    </section>
  );
};