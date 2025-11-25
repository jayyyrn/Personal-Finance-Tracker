import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { DollarSign, TrendingUp, TrendingDown, Wallet, PiggyBank } from "lucide-react";
import { DashboardStats } from "../types/api";
import { LoadingCard } from "./LoadingSpinner";
import { ErrorMessage } from "./ErrorBoundary";

export function SummaryCards({ stats, loading, error, onRetry }) {
  if (loading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <LoadingCard key={i} />
        ))}
      </div>
    );
  }

  if (error) {
    return <ErrorMessage error={error} onRetry={onRetry} />;
  }

  if (!stats) {
    return null;
  }

  const formatCurrency = (amount, currency = 'PHP') => {
    const currencies = {
      USD: { symbol: '$', code: 'USD' },
      PHP: { symbol: '₱', code: 'PHP' },
      EUR: { symbol: '€', code: 'EUR' },
      GBP: { symbol: '£', code: 'GBP' }
    };
    
    const selectedCurrency = currencies[currency] || currencies.PHP;
    
    // For PHP, we'll use custom formatting to ensure ₱ symbol is used
    if (currency === 'PHP') {
      return `₱${parseFloat(amount || 0).toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      })}`;
    }
    
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: selectedCurrency.code,
      currencyDisplay: 'symbol'
    }).format(parseFloat(amount || 0));
  };

  const netWorth = parseFloat(stats.totalIncome || 0) - parseFloat(stats.totalExpenses || 0);
  const savings = parseFloat(stats.netIncome || 0);

  const cards = [
    {
      title: "Net Worth",
      value: formatCurrency(netWorth.toString()),
      icon: Wallet,
      trend: netWorth >= 0 ? "positive" : "negative",
      description: "Total assets minus liabilities",
      color: netWorth >= 0 ? "text-green-600" : "text-red-600"
    },
    {
      title: "Monthly Income",
      value: formatCurrency(stats.thisMonthIncome),
      icon: TrendingUp,
      trend: "positive",
      description: "This month's earnings",
      color: "text-green-600"
    },
    {
      title: "Monthly Expenses",
      value: formatCurrency(stats.thisMonthExpenses),
      icon: TrendingDown,
      trend: "negative",
      description: "This month's spending",
      color: "text-red-600"
    },
    {
      title: "Savings",
      value: formatCurrency(savings.toString()),
      icon: PiggyBank,
      trend: savings >= 0 ? "positive" : "negative",
      description: "Available for goals",
      color: savings >= 0 ? "text-green-600" : "text-red-600"
    }
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {cards.map((card, index) => {
        const Icon = card.icon;
        
        return (
          <Card key={index} className="border-0 shadow-sm bg-card hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-medium text-muted-foreground">
                  {card.title}
                </p>
                <Icon className={`h-4 w-4 ${card.color}`} />
              </div>
              
              <div className="space-y-1">
                <p className={`text-2xl font-bold ${card.color}`}>
                  {card.value}
                </p>
                <p className="text-xs text-muted-foreground">
                  {card.description}
                </p>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}