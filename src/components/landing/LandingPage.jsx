import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { ImageWithFallback } from '../figma/ImageWithFallback';
import { 
  Wallet, 
  TrendingUp, 
  Target, 
  BarChart3, 
  Shield,
  ArrowRight,
  Check
} from 'lucide-react';

export const LandingPage = ({ onGetStarted }) => {
  const features = [
    {
      icon: <Wallet className="h-8 w-8" />,
      title: "Track Expenses",
      description: "Easily monitor your income and expenses in one place"
    },
    {
      icon: <Target className="h-8 w-8" />,
      title: "Set Budgets",
      description: "Create budgets and stay on track with your spending goals"
    },
    {
      icon: <BarChart3 className="h-8 w-8" />,
      title: "View Analytics",
      description: "Understand your spending patterns with visual charts"
    },
    {
      icon: <TrendingUp className="h-8 w-8" />,
      title: "Reach Goals",
      description: "Set financial goals and track your progress over time"
    }
  ];

  const benefits = [
    "Free to get started",
    "Easy to use interface",
    "Secure & private",
    "No credit card required"
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary">
                <Wallet className="h-6 w-6 text-primary-foreground" />
              </div>
              <span className="font-semibold">Personal Finance Tracker</span>
            </div>
            
            <Button onClick={onGetStarted}>
              Get Started
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Take Control of Your{' '}
              <span className="text-primary">Finances</span>
            </h1>
            
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              A simple and powerful tool to track expenses, manage budgets, 
              and achieve your financial goals.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Button 
                size="lg" 
                onClick={onGetStarted}
                className="text-lg px-8 gap-2"
              >
                Start Free
                <ArrowRight className="h-5 w-5" />
              </Button>
            </div>

            {/* Benefits */}
            <div className="flex flex-wrap items-center justify-center gap-6 mb-16">
              {benefits.map((benefit, index) => (
                <div key={index} className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Check className="h-4 w-4 text-green-600" />
                  <span>{benefit}</span>
                </div>
              ))}
            </div>

            {/* Hero Image */}
            <div className="max-w-4xl mx-auto">
              <ImageWithFallback 
                src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080"
                alt="Finance Dashboard"
                className="rounded-xl shadow-2xl w-full border"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-muted/30">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Everything You Need
            </h2>
            <p className="text-lg text-muted-foreground">
              Simple tools to help you manage your money better
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <Card key={index} className="text-center">
                <CardHeader>
                  <div className="w-16 h-16 rounded-lg bg-primary/10 flex items-center justify-center text-primary mx-auto mb-4">
                    {feature.icon}
                  </div>
                  <CardTitle>{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="bg-primary text-primary-foreground rounded-2xl p-12 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary-foreground/10 mb-6">
              <Shield className="h-8 w-8" />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Ready to Get Started?
            </h2>
            <p className="text-lg opacity-90 mb-8 max-w-2xl mx-auto">
              Join thousands of users who are taking control of their finances. 
              Start tracking today, completely free.
            </p>
            <Button 
              size="lg" 
              variant="secondary"
              onClick={onGetStarted}
              className="text-lg px-8"
            >
              Create Your Account
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 border-t bg-card">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <Wallet className="h-5 w-5" />
              <span className="font-semibold">Personal Finance Tracker</span>
            </div>
            
            <p className="text-sm text-muted-foreground">
              &copy; 2025 Personal Finance Tracker. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};