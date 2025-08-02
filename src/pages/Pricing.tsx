import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Star, Building, Users } from "lucide-react";
import { Link } from "react-router-dom";

const Pricing = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Choose Your Plan
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Select the perfect plan for your content verification needs. From individual users to large enterprises, 
            we have solutions that scale with your requirements.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-16">
          {/* Free Plan */}
          <Card className="relative">
            <CardHeader className="text-center pb-2">
              <Users className="w-12 h-12 text-primary mx-auto mb-4" />
              <CardTitle className="text-2xl">Free</CardTitle>
              <div className="text-4xl font-bold mt-4">$0</div>
              <CardDescription>Perfect for casual users</CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <ul className="space-y-3 mb-8">
                <li className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span>Basic content verification</span>
                </li>
                <li className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span>Trust score analysis</span>
                </li>
                <li className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span>Source credibility check</span>
                </li>
                <li className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span>Up to 10 verifications/day</span>
                </li>
                <li className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span>Community support</span>
                </li>
              </ul>
              <Button className="w-full" variant="outline" asChild>
                <Link to="/verify">Get Started Free</Link>
              </Button>
            </CardContent>
          </Card>

          {/* Premium Plan */}
          <Card className="relative border-primary shadow-lg">
            <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary">Most Popular</Badge>
            <CardHeader className="text-center pb-2">
              <Star className="w-12 h-12 text-primary mx-auto mb-4" />
              <CardTitle className="text-2xl">Premium</CardTitle>
              <div className="text-4xl font-bold mt-4">$10<span className="text-lg font-normal text-muted-foreground">/month</span></div>
              <div className="text-sm text-muted-foreground">or $120/year (2 months free)</div>
              <CardDescription>For power users and professionals</CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <ul className="space-y-3 mb-8">
                <li className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span><strong>Everything in Free</strong></span>
                </li>
                <li className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span>Yesveri AI Agent</span>
                </li>
                <li className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span>Advanced analytics dashboard</span>
                </li>
                <li className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span>Personal verification profile</span>
                </li>
                <li className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span>Unlimited verifications</span>
                </li>
                <li className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span>Priority support</span>
                </li>
                <li className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span>API access (coming soon)</span>
                </li>
              </ul>
              <Button className="w-full">Choose Premium</Button>
            </CardContent>
          </Card>

          {/* Enterprise Plan */}
          <Card className="relative">
            <CardHeader className="text-center pb-2">
              <Building className="w-12 h-12 text-primary mx-auto mb-4" />
              <CardTitle className="text-2xl">Enterprise</CardTitle>
              <div className="text-4xl font-bold mt-4">$100<span className="text-lg font-normal text-muted-foreground">/month</span></div>
              <div className="text-sm text-muted-foreground">or $95/month billed annually (5% discount)</div>
              <CardDescription>For organizations and teams</CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <ul className="space-y-3 mb-8">
                <li className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span><strong>Everything in Premium</strong></span>
                </li>
                <li className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span>Custom verification workflows</span>
                </li>
                <li className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span>White-label solutions</span>
                </li>
                <li className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span>Team management dashboard</span>
                </li>
                <li className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span>Advanced API integration</span>
                </li>
                <li className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span>Dedicated account manager</span>
                </li>
                <li className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span>Custom training & onboarding</span>
                </li>
              </ul>
              <Button className="w-full" variant="outline">Contact Sales</Button>
            </CardContent>
          </Card>
        </div>

        {/* Features Comparison */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-12">Feature Comparison</h2>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-border rounded-lg">
              <thead>
                <tr className="bg-muted">
                  <th className="text-left p-4 border border-border">Features</th>
                  <th className="text-center p-4 border border-border">Free</th>
                  <th className="text-center p-4 border border-border">Premium</th>
                  <th className="text-center p-4 border border-border">Enterprise</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="p-4 border border-border font-medium">Daily Verifications</td>
                  <td className="text-center p-4 border border-border">10</td>
                  <td className="text-center p-4 border border-border">Unlimited</td>
                  <td className="text-center p-4 border border-border">Unlimited</td>
                </tr>
                <tr className="bg-muted/50">
                  <td className="p-4 border border-border font-medium">Trust Score Analysis</td>
                  <td className="text-center p-4 border border-border">✓</td>
                  <td className="text-center p-4 border border-border">✓</td>
                  <td className="text-center p-4 border border-border">✓</td>
                </tr>
                <tr>
                  <td className="p-4 border border-border font-medium">Source Verification</td>
                  <td className="text-center p-4 border border-border">✓</td>
                  <td className="text-center p-4 border border-border">✓</td>
                  <td className="text-center p-4 border border-border">✓</td>
                </tr>
                <tr className="bg-muted/50">
                  <td className="p-4 border border-border font-medium">Yesveri AI Agent</td>
                  <td className="text-center p-4 border border-border">-</td>
                  <td className="text-center p-4 border border-border">✓</td>
                  <td className="text-center p-4 border border-border">✓</td>
                </tr>
                <tr>
                  <td className="p-4 border border-border font-medium">Analytics Dashboard</td>
                  <td className="text-center p-4 border border-border">-</td>
                  <td className="text-center p-4 border border-border">✓</td>
                  <td className="text-center p-4 border border-border">✓</td>
                </tr>
                <tr className="bg-muted/50">
                  <td className="p-4 border border-border font-medium">API Access</td>
                  <td className="text-center p-4 border border-border">-</td>
                  <td className="text-center p-4 border border-border">Basic</td>
                  <td className="text-center p-4 border border-border">Advanced</td>
                </tr>
                <tr>
                  <td className="p-4 border border-border font-medium">Support</td>
                  <td className="text-center p-4 border border-border">Community</td>
                  <td className="text-center p-4 border border-border">Priority</td>
                  <td className="text-center p-4 border border-border">Dedicated</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-12">Frequently Asked Questions</h2>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div>
              <h3 className="font-semibold mb-2">Can I change plans anytime?</h3>
              <p className="text-muted-foreground">Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately.</p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Is there a free trial for premium plans?</h3>
              <p className="text-muted-foreground">We offer a comprehensive free tier. For premium features, contact us for a personalized demo.</p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">What payment methods do you accept?</h3>
              <p className="text-muted-foreground">We accept all major credit cards, PayPal, and bank transfers for annual plans.</p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Do you offer custom enterprise solutions?</h3>
              <p className="text-muted-foreground">Yes, our enterprise plan can be customized to meet specific organizational needs.</p>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="text-center">
          <div className="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-lg p-12">
            <h2 className="text-3xl font-bold mb-6">Ready to Start Verifying?</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
              Join thousands of users who trust Yesveri for accurate content verification. 
              Start with our free tier and upgrade as your needs grow.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild>
                <Link to="/verify">Start Free Verification</Link>
              </Button>
              <Button size="lg" variant="outline">
                Contact Sales
              </Button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Pricing;