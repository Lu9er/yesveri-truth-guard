import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, Shield, Search, Users, Github, Code } from "lucide-react";
import { Link } from "react-router-dom";

const About = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            About Yesveri
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            An advanced AI-powered content verification platform designed to combat misinformation 
            and promote truthful, fact-based information in the digital age.
          </p>
          <Button size="lg" asChild>
            <Link to="/verify">Try Verification Tool</Link>
          </Button>
        </div>

        {/* How It Works */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-12">How Yesveri Works</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Card>
              <CardHeader>
                <Search className="w-12 h-12 text-primary mb-4" />
                <CardTitle>AI-Powered Analysis</CardTitle>
                <CardDescription>
                  Our advanced AI engines analyze content using multiple verification methods including 
                  sentiment analysis, fact-checking, and source credibility assessment.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <Shield className="w-12 h-12 text-primary mb-4" />
                <CardTitle>Source Verification</CardTitle>
                <CardDescription>
                  We cross-reference claims with credible sources, prioritizing established news outlets, 
                  government sources, and academic institutions for accurate verification.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <CheckCircle className="w-12 h-12 text-primary mb-4" />
                <CardTitle>Trust Score</CardTitle>
                <CardDescription>
                  Get an instant trust score (0-100%) based on comprehensive analysis, helping you 
                  make informed decisions about the content you consume and share.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </section>

        {/* Content Verification Features */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-12">Content Verification Features</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <CheckCircle className="w-6 h-6 text-green-600 mt-1" />
                <div>
                  <h3 className="font-semibold mb-2">Multi-Source Fact Checking</h3>
                  <p className="text-muted-foreground">
                    Cross-reference claims against multiple credible sources including Nigerian and international news outlets.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <CheckCircle className="w-6 h-6 text-green-600 mt-1" />
                <div>
                  <h3 className="font-semibold mb-2">Sentiment Analysis</h3>
                  <p className="text-muted-foreground">
                    Detect emotional bias, manipulation tactics, and inflammatory language patterns in content.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <CheckCircle className="w-6 h-6 text-green-600 mt-1" />
                <div>
                  <h3 className="font-semibold mb-2">Source Credibility Assessment</h3>
                  <p className="text-muted-foreground">
                    Evaluate the reliability and track record of content sources and publishers.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <CheckCircle className="w-6 h-6 text-green-600 mt-1" />
                <div>
                  <h3 className="font-semibold mb-2">Real-time Processing</h3>
                  <p className="text-muted-foreground">
                    Get instant verification results with detailed breakdowns and supporting evidence.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-primary/10 to-secondary/10 rounded-lg p-8">
              <h3 className="text-2xl font-bold mb-4">Nigerian Context Focus</h3>
              <p className="text-muted-foreground mb-6">
                Yesveri is specifically designed with Nigerian context in mind, prioritizing local news sources 
                and understanding cultural nuances while maintaining global verification standards.
              </p>
              <ul className="space-y-2">
                <li className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span className="text-sm">Local news source integration</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span className="text-sm">Cultural context awareness</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span className="text-sm">Regional misinformation patterns</span>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* Open Source Section */}
        <section className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-6">Open Source & Transparent</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Yesveri is built as an open-source project, ensuring transparency, community contribution, 
              and continuous improvement in the fight against misinformation.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <Card>
              <CardHeader>
                <Code className="w-12 h-12 text-primary mb-4" />
                <CardTitle>Open Source Benefits</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  <li className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <span>Complete transparency in verification algorithms</span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <span>Community-driven improvements and features</span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <span>Auditable code for security and accuracy</span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <span>Free access to basic verification tools</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Users className="w-12 h-12 text-primary mb-4" />
                <CardTitle>Community Contribution</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  Join our community of developers, researchers, and fact-checkers working together 
                  to improve content verification technology.
                </p>
                <Button variant="outline" asChild>
                  <a href="https://github.com/Lu9er/yesveri.online" target="_blank" rel="noopener noreferrer">
                    <Github className="w-4 h-4 mr-2" />
                    View on GitHub
                  </a>
                </Button>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Mission Section */}
        <section className="text-center">
          <div className="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-lg p-12">
            <h2 className="text-3xl font-bold mb-6">Our Mission</h2>
            <p className="text-xl text-muted-foreground max-w-4xl mx-auto mb-8">
              To democratize access to reliable information verification tools, empowering individuals 
              and organizations to make informed decisions based on factual, verified content. 
              We believe that everyone deserves access to truth in an age of information overload.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild>
                <Link to="/verify">Start Verifying Content</Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link to="/pricing">View Pricing Plans</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default About;