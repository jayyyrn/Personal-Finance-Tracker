import { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Calendar } from '../ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { Progress } from '../ui/progress';
import { Badge } from '../ui/badge';
import { 
  Download, 
  FileText, 
  TrendingUp, 
  TrendingDown, 
  Calendar as CalendarIcon,
  Filter,
  DollarSign,
  PieChart,
  BarChart3
} from 'lucide-react';
import { format } from '../../utils/dateUtils';
import { toast } from "sonner@2.0.3";
import { transactionService } from '../../services/transactionService';
import { categoryService } from '../../services/categoryService';
import { budgetService } from '../../services/budgetService';
import { generatePDFReport, generateCSVReport, generateBudgetReport } from '../../utils/reportGenerator';

export const ReportsPage = () => {
  const [dateRange, setDateRange] = useState({
    from: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
    to: new Date()
  });
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);

  useEffect(() => {
    loadReportData();
  }, [dateRange, selectedPeriod]);

  const loadReportData = async () => {
    setLoading(true);
    try {
      const [transactions, dashboardStats, budgets, categories] = await Promise.all([
        transactionService.getTransactions({
          date_from: format(dateRange.from, 'yyyy-MM-dd'),
          date_to: format(dateRange.to, 'yyyy-MM-dd')
        }),
        transactionService.getDashboardStats(),
        budgetService.getBudgets(),
        categoryService.getCategories()
      ]);

      setReportData({
        transactions: transactions.data,
        stats: dashboardStats,
        budgets,
        categories
      });
    } catch (error) {
      toast.error('Failed to load report data');
    } finally {
      setLoading(false);
    }
  };

  const handlePeriodChange = (period) => {
    setSelectedPeriod(period);
    const now = new Date();
    
    switch (period) {
      case 'week':
        setDateRange({
          from: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000),
          to: now
        });
        break;
      case 'month':
        setDateRange({
          from: new Date(now.getFullYear(), now.getMonth(), 1),
          to: now
        });
        break;
      case 'quarter':
        const quarterStart = new Date(now.getFullYear(), Math.floor(now.getMonth() / 3) * 3, 1);
        setDateRange({
          from: quarterStart,
          to: now
        });
        break;
      case 'year':
        setDateRange({
          from: new Date(now.getFullYear(), 0, 1),
          to: now
        });
        break;
    }
  };

  const handleDownloadPDF = async () => {
    if (!reportData) return;
    
    try {
      const blob = await generatePDFReport(reportData, dateRange);
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `financial-report-${format(dateRange.from, 'yyyy-MM-dd')}-to-${format(dateRange.to, 'yyyy-MM-dd')}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      toast.success('PDF report downloaded successfully!');
    } catch (error) {
      toast.error('Failed to generate PDF report');
    }
  };

  const handleDownloadCSV = async () => {
    if (!reportData) return;
    
    try {
      const csvContent = generateCSVReport(reportData.transactions);
      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `transactions-${format(dateRange.from, 'yyyy-MM-dd')}-to-${format(dateRange.to, 'yyyy-MM-dd')}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      toast.success('CSV report downloaded successfully!');
    } catch (error) {
      toast.error('Failed to generate CSV report');
    }
  };

  const handleDownloadBudgetReport = async () => {
    if (!reportData) return;
    
    try {
      const blob = await generateBudgetReport(reportData.budgets, reportData.categories, dateRange);
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `budget-analysis-${format(dateRange.from, 'yyyy-MM-dd')}-to-${format(dateRange.to, 'yyyy-MM-dd')}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      toast.success('Budget report downloaded successfully!');
    } catch (error) {
      toast.error('Failed to generate budget report');
    }
  };

  const calculateCategoryBreakdown = () => {
    if (!reportData) return [];
    
    const breakdown = {};
    reportData.transactions.forEach(transaction => {
      if (transaction.type === 'expense') {
        const category = transaction.category?.name || 'Uncategorized';
        const amount = parseFloat(transaction.amount);
        breakdown[category] = (breakdown[category] || 0) + amount;
      }
    });
    
    const total = Object.values(breakdown).reduce((sum, amount) => sum + amount, 0);
    return Object.entries(breakdown)
      .map(([category, amount]) => ({
        category,
        amount,
        percentage: total > 0 ? (amount / total) * 100 : 0
      }))
      .sort((a, b) => b.amount - a.amount);
  };

  const getInsights = () => {
    if (!reportData) return [];
    
    const insights = [];
    const income = parseFloat(reportData.stats.monthly_income || 0);
    const expenses = parseFloat(reportData.stats.monthly_expenses || 0);
    const savingsRate = income > 0 ? ((income - expenses) / income) * 100 : 0;
    
    // Savings rate insight
    if (savingsRate > 20) {
      insights.push({
        type: 'positive',
        text: `Excellent savings rate of ${savingsRate.toFixed(1)}%! You're saving more than recommended.`
      });
    } else if (savingsRate < 10) {
      insights.push({
        type: 'warning',
        text: `Low savings rate of ${savingsRate.toFixed(1)}%. Consider reducing expenses or increasing income.`
      });
    }
    
    // Budget insights
    const overBudgetCategories = reportData.budgets.filter(budget => budget.is_over_budget);
    if (overBudgetCategories.length > 0) {
      insights.push({
        type: 'warning',
        text: `You're over budget in ${overBudgetCategories.length} ${overBudgetCategories.length === 1 ? 'category' : 'categories'}.`
      });
    }
    
    return insights;
  };

  const categoryBreakdown = calculateCategoryBreakdown();
  const insights = getInsights();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        <div>
          <h1 className="text-2xl font-semibold">Financial Reports</h1>
          <p className="text-muted-foreground">Generate and download detailed financial reports</p>
        </div>
        
        <div className="flex flex-wrap gap-2">
          <Select value={selectedPeriod} onValueChange={handlePeriodChange}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week">This Week</SelectItem>
              <SelectItem value="month">This Month</SelectItem>
              <SelectItem value="quarter">This Quarter</SelectItem>
              <SelectItem value="year">This Year</SelectItem>
              <SelectItem value="custom">Custom Range</SelectItem>
            </SelectContent>
          </Select>
          
          <Popover open={showDatePicker} onOpenChange={setShowDatePicker}>
            <PopoverTrigger asChild>
              <Button variant="outline">
                <CalendarIcon className="mr-2 h-4 w-4" />
                {dateRange.from && dateRange.to 
                  ? `${format(dateRange.from, 'MMM dd')} - ${format(dateRange.to, 'MMM dd')}`
                  : 'Select dates'
                }
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="end">
              <Calendar
                mode="range"
                selected={dateRange}
                onSelect={setDateRange}
                numberOfMonths={2}
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>

      {/* Quick Stats */}
      {reportData && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <DollarSign className="h-8 w-8 text-green-600" />
                <div>
                  <p className="text-sm text-muted-foreground">Total Income</p>
                  <p className="text-lg font-semibold text-green-600">
                    ${parseFloat(reportData.stats.monthly_income || 0).toLocaleString()}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <TrendingDown className="h-8 w-8 text-red-600" />
                <div>
                  <p className="text-sm text-muted-foreground">Total Expenses</p>
                  <p className="text-lg font-semibold text-red-600">
                    ${parseFloat(reportData.stats.monthly_expenses || 0).toLocaleString()}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-8 w-8 text-blue-600" />
                <div>
                  <p className="text-sm text-muted-foreground">Net Balance</p>
                  <p className="text-lg font-semibold text-blue-600">
                    ${parseFloat(reportData.stats.current_balance || 0).toLocaleString()}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <BarChart3 className="h-8 w-8 text-purple-600" />
                <div>
                  <p className="text-sm text-muted-foreground">Transactions</p>
                  <p className="text-lg font-semibold">
                    {reportData.transactions.length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="breakdown">Category Breakdown</TabsTrigger>
          <TabsTrigger value="budgets">Budget Analysis</TabsTrigger>
          <TabsTrigger value="downloads">Downloads</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Insights Card */}
          {insights.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Financial Insights</CardTitle>
                <CardDescription>Key observations about your financial health</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {insights.map((insight, index) => (
                  <div 
                    key={index}
                    className={`p-4 rounded-lg border ${
                      insight.type === 'positive' 
                        ? 'bg-green-50 border-green-200 text-green-800' 
                        : 'bg-yellow-50 border-yellow-200 text-yellow-800'
                    }`}
                  >
                    {insight.text}
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Income vs Expenses</CardTitle>
              </CardHeader>
              <CardContent>
                {reportData && (
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span>Income</span>
                      <span className="font-semibold text-green-600">
                        ${parseFloat(reportData.stats.monthly_income || 0).toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Expenses</span>
                      <span className="font-semibold text-red-600">
                        ${parseFloat(reportData.stats.monthly_expenses || 0).toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between items-center pt-2 border-t">
                      <span className="font-semibold">Net</span>
                      <span className="font-semibold">
                        ${(parseFloat(reportData.stats.monthly_income || 0) - parseFloat(reportData.stats.monthly_expenses || 0)).toLocaleString()}
                      </span>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Savings Rate</CardTitle>
              </CardHeader>
              <CardContent>
                {reportData && (
                  <div className="space-y-4">
                    {(() => {
                      const income = parseFloat(reportData.stats.monthly_income || 0);
                      const expenses = parseFloat(reportData.stats.monthly_expenses || 0);
                      const savingsRate = income > 0 ? ((income - expenses) / income) * 100 : 0;
                      
                      return (
                        <>
                          <div className="text-center">
                            <div className="text-3xl font-bold">
                              {savingsRate.toFixed(1)}%
                            </div>
                            <p className="text-muted-foreground">of income saved</p>
                          </div>
                          <Progress value={Math.min(savingsRate, 100)} className="h-3" />
                          <div className="text-sm text-muted-foreground text-center">
                            Target: 20% or higher
                          </div>
                        </>
                      );
                    })()}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="breakdown" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PieChart className="h-5 w-5" />
                Expense Breakdown by Category
              </CardTitle>
              <CardDescription>
                See where your money is going during the selected period
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {categoryBreakdown.map((item, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">{item.category}</span>
                      <div className="text-right">
                        <div className="font-semibold">${item.amount.toLocaleString()}</div>
                        <div className="text-sm text-muted-foreground">
                          {item.percentage.toFixed(1)}%
                        </div>
                      </div>
                    </div>
                    <Progress value={item.percentage} className="h-2" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="budgets" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Budget Performance</CardTitle>
              <CardDescription>
                See how well you're sticking to your budgets
              </CardDescription>
            </CardHeader>
            <CardContent>
              {reportData && (
                <div className="space-y-4">
                  {reportData.budgets.map((budget) => (
                    <div key={budget.id} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{budget.category?.name}</span>
                          {budget.is_over_budget && (
                            <Badge variant="destructive">Over Budget</Badge>
                          )}
                        </div>
                        <div className="text-right">
                          <div className="font-semibold">
                            ${parseFloat(budget.spent).toLocaleString()} / ${parseFloat(budget.limit).toLocaleString()}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {budget.percentage.toFixed(1)}% used
                          </div>
                        </div>
                      </div>
                      <Progress 
                        value={Math.min(budget.percentage, 100)} 
                        className={`h-2 ${budget.is_over_budget ? 'bg-red-100' : ''}`} 
                      />
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="downloads" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Financial Summary
                </CardTitle>
                <CardDescription>
                  Comprehensive PDF report with all financial data
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button onClick={handleDownloadPDF} className="w-full" disabled={loading}>
                  <Download className="mr-2 h-4 w-4" />
                  Download PDF Report
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Transaction Data
                </CardTitle>
                <CardDescription>
                  Raw transaction data in CSV format for analysis
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button onClick={handleDownloadCSV} className="w-full" disabled={loading}>
                  <Download className="mr-2 h-4 w-4" />
                  Download CSV Data
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PieChart className="h-5 w-5" />
                  Budget Analysis
                </CardTitle>
                <CardDescription>
                  Detailed budget performance and recommendations
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button onClick={handleDownloadBudgetReport} className="w-full" disabled={loading}>
                  <Download className="mr-2 h-4 w-4" />
                  Download Budget Report
                </Button>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Report Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm text-muted-foreground">
                <p><strong>Date Range:</strong> {format(dateRange.from, 'MMMM dd, yyyy')} - {format(dateRange.to, 'MMMM dd, yyyy')}</p>
                <p><strong>Transactions:</strong> {reportData?.transactions.length || 0} records</p>
                <p><strong>Categories:</strong> {reportData?.categories.length || 0} categories</p>
                <p><strong>Budgets:</strong> {reportData?.budgets.length || 0} active budgets</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};