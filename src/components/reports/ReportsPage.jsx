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
  DollarSign,
  PieChart,
  BarChart3
} from 'lucide-react';
import { toast } from "sonner";
import { 
  mockTransactions, 
  mockBudgets, 
  mockCategories, 
  mockDashboardStats,
  delay 
} from '../../services/mockData';
import jsPDF from 'jspdf';

// PDF Generator using jsPDF
const generatePDFReport = async (reportData, dateRange) => {
  return new Promise((resolve) => {
    try {
      const { totals, transactions, budgets } = reportData;
      const categoryBreakdown = calculateCategoryBreakdown(transactions);
      
      // Create new PDF document
      const doc = new jsPDF();
      
      // Set initial y position
      let yPosition = 20;
      
      // Add header
      doc.setFontSize(20);
      doc.setTextColor(59, 130, 246); // Blue color
      doc.text('Financial Report', 20, yPosition);
      
      doc.setFontSize(10);
      doc.setTextColor(100, 100, 100);
      yPosition += 10;
      doc.text(`Period: ${formatPDFDate(dateRange.from)} - ${formatPDFDate(dateRange.to)}`, 20, yPosition);
      yPosition += 6;
      doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 20, yPosition);
      
      yPosition += 15;
      
      // Financial Summary Section
      doc.setFontSize(16);
      doc.setTextColor(0, 0, 0);
      doc.text('Financial Summary', 20, yPosition);
      yPosition += 10;
      
      doc.setFontSize(10);
      const summaryData = [
<<<<<<< HEAD
        ['Total Income', `₱${totals.income.toLocaleString()}`, [16, 185, 129]], // Green
        ['Total Expenses', `₱${totals.expenses.toLocaleString()}`, [239, 68, 68]], // Red
        ['Net Balance', `₱${totals.netBalance.toLocaleString()}`, [59, 130, 246]], // Blue
=======
        ['Total Income', `$${totals.income.toLocaleString()}`, [16, 185, 129]], // Green
        ['Total Expenses', `$${totals.expenses.toLocaleString()}`, [239, 68, 68]], // Red
        ['Net Balance', `$${totals.netBalance.toLocaleString()}`, [59, 130, 246]], // Blue
>>>>>>> d56f293ff91bb66bb44c0cdac2a7bc01ed81fe96
        ['Total Transactions', totals.transactionCount.toString(), [100, 100, 100]] // Gray
      ];
      
      summaryData.forEach(([label, value, color]) => {
        doc.setTextColor(100, 100, 100);
        doc.text(label, 20, yPosition);
        doc.setTextColor(color[0], color[1], color[2]);
        doc.text(value, 80, yPosition);
        yPosition += 8;
      });
      
      yPosition += 10;
      
      // Check if we need a new page
      if (yPosition > 250) {
        doc.addPage();
        yPosition = 20;
      }
      
      // Expense Breakdown by Category Section
      doc.setFontSize(16);
      doc.setTextColor(0, 0, 0);
      doc.text('Expense Breakdown by Category', 20, yPosition);
      yPosition += 10;
      
      // Table header
      doc.setFontSize(8);
      doc.setTextColor(255, 255, 255);
      doc.setFillColor(59, 130, 246);
      doc.rect(20, yPosition, 170, 8, 'F');
      doc.text('Category', 22, yPosition + 6);
      doc.text('Amount', 100, yPosition + 6);
      doc.text('Percentage', 140, yPosition + 6);
      
      yPosition += 12;
      doc.setTextColor(0, 0, 0);
      
      // Table rows
      categoryBreakdown.slice(0, 8).forEach(item => {
        if (yPosition > 270) {
          doc.addPage();
          yPosition = 20;
          // Add header again for new page
          doc.setFontSize(8);
          doc.setTextColor(255, 255, 255);
          doc.setFillColor(59, 130, 246);
          doc.rect(20, yPosition, 170, 8, 'F');
          doc.text('Category', 22, yPosition + 6);
          doc.text('Amount', 100, yPosition + 6);
          doc.text('Percentage', 140, yPosition + 6);
          yPosition += 12;
          doc.setTextColor(0, 0, 0);
        }
        
        doc.text(item.category.substring(0, 20), 22, yPosition); // Limit category name length
<<<<<<< HEAD
        doc.text(`₱${item.amount.toFixed(2)}`, 100, yPosition);
=======
        doc.text(`$${item.amount.toFixed(2)}`, 100, yPosition);
>>>>>>> d56f293ff91bb66bb44c0cdac2a7bc01ed81fe96
        doc.text(`${item.percentage.toFixed(1)}%`, 140, yPosition);
        yPosition += 8;
      });
      
      yPosition += 10;
      
      // Budget Performance Section
      if (yPosition > 220) {
        doc.addPage();
        yPosition = 20;
      }
      
      doc.setFontSize(16);
      doc.text('Budget Performance', 20, yPosition);
      yPosition += 10;
      
      // Budget table header
      doc.setFontSize(8);
      doc.setTextColor(255, 255, 255);
      doc.setFillColor(16, 185, 129); // Green
      doc.rect(20, yPosition, 170, 8, 'F');
      doc.text('Category', 22, yPosition + 6);
      doc.text('Spent/Limit', 80, yPosition + 6);
      doc.text('Usage', 120, yPosition + 6);
      doc.text('Status', 150, yPosition + 6);
      
      yPosition += 12;
      doc.setTextColor(0, 0, 0);
      
      // Budget table rows
      budgets.slice(0, 10).forEach(budget => {
        if (yPosition > 270) {
          doc.addPage();
          yPosition = 20;
          // Add header again for new page
          doc.setFontSize(8);
          doc.setTextColor(255, 255, 255);
          doc.setFillColor(16, 185, 129);
          doc.rect(20, yPosition, 170, 8, 'F');
          doc.text('Category', 22, yPosition + 6);
          doc.text('Spent/Limit', 80, yPosition + 6);
          doc.text('Usage', 120, yPosition + 6);
          doc.text('Status', 150, yPosition + 6);
          yPosition += 12;
          doc.setTextColor(0, 0, 0);
        }
        
        const spent = parseFloat(budget.spent || 0);
        const limit = parseFloat(budget.limit || 0);
        const percentage = limit > 0 ? (spent / limit) * 100 : 0;
        const status = spent > limit ? 'Over Budget' : 'Within Budget';
        const categoryName = getCategoryName(budget);
        
        doc.text(categoryName.substring(0, 20), 22, yPosition);
<<<<<<< HEAD
        doc.text(`₱${spent.toFixed(2)} / ₱${limit.toFixed(2)}`, 80, yPosition);
=======
        doc.text(`$${spent.toFixed(2)} / $${limit.toFixed(2)}`, 80, yPosition);
>>>>>>> d56f293ff91bb66bb44c0cdac2a7bc01ed81fe96
        doc.text(`${percentage.toFixed(1)}%`, 120, yPosition);
        
        // Color code status
        if (spent > limit) {
          doc.setTextColor(239, 68, 68); // Red
        } else {
          doc.setTextColor(16, 185, 129); // Green
        }
        doc.text(status, 150, yPosition);
        doc.setTextColor(0, 0, 0);
        
        yPosition += 8;
      });
      
      yPosition += 10;
      
      // Recent Transactions Section
      if (yPosition > 200) {
        doc.addPage();
        yPosition = 20;
      }
      
      doc.setFontSize(16);
      doc.setTextColor(0, 0, 0);
      doc.text('Recent Transactions', 20, yPosition);
      yPosition += 10;
      
      // Transactions table header
      doc.setFontSize(7);
      doc.setTextColor(255, 255, 255);
      doc.setFillColor(100, 100, 100); // Gray
      doc.rect(20, yPosition, 170, 8, 'F');
      doc.text('Date', 22, yPosition + 6);
      doc.text('Description', 45, yPosition + 6);
      doc.text('Category', 100, yPosition + 6);
      doc.text('Type', 130, yPosition + 6);
      doc.text('Amount', 160, yPosition + 6);
      
      yPosition += 12;
      doc.setTextColor(0, 0, 0);
      
      // Transactions table rows
      transactions.slice(0, 15).forEach(transaction => {
        if (yPosition > 270) {
          doc.addPage();
          yPosition = 20;
          // Add header again for new page
          doc.setFontSize(7);
          doc.setTextColor(255, 255, 255);
          doc.setFillColor(100, 100, 100);
          doc.rect(20, yPosition, 170, 8, 'F');
          doc.text('Date', 22, yPosition + 6);
          doc.text('Description', 45, yPosition + 6);
          doc.text('Category', 100, yPosition + 6);
          doc.text('Type', 130, yPosition + 6);
          doc.text('Amount', 160, yPosition + 6);
          yPosition += 12;
          doc.setTextColor(0, 0, 0);
        }
        
        const date = formatPDFDate(new Date(transaction.transaction_date));
        const description = transaction.description.substring(0, 15);
        const category = (transaction.category?.name || 'Uncategorized').substring(0, 10);
        const type = transaction.type;
        const amount = parseFloat(transaction.amount).toFixed(2);
        
        doc.text(date, 22, yPosition);
        doc.text(description, 45, yPosition);
        doc.text(category, 100, yPosition);
        doc.text(type, 130, yPosition);
        
        // Color code amount based on type
        if (transaction.type === 'income') {
          doc.setTextColor(16, 185, 129); // Green
<<<<<<< HEAD
          doc.text(`+₱${amount}`, 160, yPosition);
        } else {
          doc.setTextColor(239, 68, 68); // Red
          doc.text(`-₱${amount}`, 160, yPosition);
=======
          doc.text(`+$${amount}`, 160, yPosition);
        } else {
          doc.setTextColor(239, 68, 68); // Red
          doc.text(`-$${amount}`, 160, yPosition);
>>>>>>> d56f293ff91bb66bb44c0cdac2a7bc01ed81fe96
        }
        doc.setTextColor(0, 0, 0);
        
        yPosition += 8;
      });
      
      // Add page numbers and footer
      const pageCount = doc.internal.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.setTextColor(100, 100, 100);
        doc.text('Generated by Personal Finance Tracker', 20, 285);
        doc.text(`Page ${i} of ${pageCount}`, 180, 285, { align: 'right' });
      }
      
      // Create blob and resolve
      const pdfBlob = doc.output('blob');
      resolve(pdfBlob);
      
    } catch (error) {
      console.error('PDF generation error:', error);
      throw error;
    }
  });
};

const generateBudgetReport = async (budgets, categories, dateRange) => {
  return new Promise((resolve) => {
    try {
      const totalBudget = budgets.reduce((sum, budget) => sum + parseFloat(budget.limit || 0), 0);
      const totalSpent = budgets.reduce((sum, budget) => sum + parseFloat(budget.spent || 0), 0);
      const overallUsage = totalBudget > 0 ? (totalSpent / totalBudget) * 100 : 0;

      // Create new PDF document
      const doc = new jsPDF();
      let yPosition = 20;

      // Header
      doc.setFontSize(20);
      doc.setTextColor(16, 185, 129); // Green
      doc.text('Budget Analysis Report', 20, yPosition);
      
      doc.setFontSize(10);
      doc.setTextColor(100, 100, 100);
      yPosition += 10;
      doc.text(`Period: ${formatPDFDate(dateRange.from)} - ${formatPDFDate(dateRange.to)}`, 20, yPosition);
      yPosition += 15;

      // Budget Overview
      doc.setFontSize(16);
      doc.setTextColor(0, 0, 0);
      doc.text('Budget Overview', 20, yPosition);
      yPosition += 10;

      doc.setFontSize(10);
      const overviewData = [
<<<<<<< HEAD
        ['Total Budget', `₱${totalBudget.toFixed(2)}`],
        ['Total Spent', `₱${totalSpent.toFixed(2)}`],
        ['Remaining', `₱${(totalBudget - totalSpent).toFixed(2)}`],
=======
        ['Total Budget', `$${totalBudget.toFixed(2)}`],
        ['Total Spent', `$${totalSpent.toFixed(2)}`],
        ['Remaining', `$${(totalBudget - totalSpent).toFixed(2)}`],
>>>>>>> d56f293ff91bb66bb44c0cdac2a7bc01ed81fe96
        ['Overall Usage', `${overallUsage.toFixed(1)}%`]
      ];

      overviewData.forEach(([label, value]) => {
        doc.setTextColor(100, 100, 100);
        doc.text(label, 20, yPosition);
        doc.setTextColor(16, 185, 129); // Green
        doc.text(value, 80, yPosition);
        yPosition += 8;
      });

      yPosition += 10;

      // Detailed Budget Performance
      if (yPosition > 220) {
        doc.addPage();
        yPosition = 20;
      }

      doc.setFontSize(16);
      doc.setTextColor(0, 0, 0);
      doc.text('Detailed Budget Performance', 20, yPosition);
      yPosition += 10;

      // Budget table header
      doc.setFontSize(8);
      doc.setTextColor(255, 255, 255);
      doc.setFillColor(16, 185, 129);
      doc.rect(20, yPosition, 170, 8, 'F');
      doc.text('Category', 22, yPosition + 6);
      doc.text('Budget', 80, yPosition + 6);
      doc.text('Spent', 110, yPosition + 6);
      doc.text('Remaining', 130, yPosition + 6);
      doc.text('Usage', 160, yPosition + 6);
      doc.text('Status', 180, yPosition + 6);

      yPosition += 12;
      doc.setTextColor(0, 0, 0);

      // Budget table rows
      budgets.forEach(budget => {
        if (yPosition > 270) {
          doc.addPage();
          yPosition = 20;
          // Add header again for new page
          doc.setFontSize(8);
          doc.setTextColor(255, 255, 255);
          doc.setFillColor(16, 185, 129);
          doc.rect(20, yPosition, 170, 8, 'F');
          doc.text('Category', 22, yPosition + 6);
          doc.text('Budget', 80, yPosition + 6);
          doc.text('Spent', 110, yPosition + 6);
          doc.text('Remaining', 130, yPosition + 6);
          doc.text('Usage', 160, yPosition + 6);
          doc.text('Status', 180, yPosition + 6);
          yPosition += 12;
          doc.setTextColor(0, 0, 0);
        }

        const spent = parseFloat(budget.spent || 0);
        const limit = parseFloat(budget.limit || 0);
        const remaining = limit - spent;
        const percentage = limit > 0 ? (spent / limit) * 100 : 0;
        let status = 'Good';
        
        if (spent > limit) {
          status = 'Over Budget';
        } else if (percentage > 80) {
          status = 'Warning';
        }

        const categoryName = getCategoryName(budget);
        
        doc.text(categoryName.substring(0, 20), 22, yPosition);
<<<<<<< HEAD
        doc.text(`₱${limit.toFixed(2)}`, 80, yPosition);
        doc.text(`₱${spent.toFixed(2)}`, 110, yPosition);
        doc.text(`₱${remaining.toFixed(2)}`, 130, yPosition);
=======
        doc.text(`$${limit.toFixed(2)}`, 80, yPosition);
        doc.text(`$${spent.toFixed(2)}`, 110, yPosition);
        doc.text(`$${remaining.toFixed(2)}`, 130, yPosition);
>>>>>>> d56f293ff91bb66bb44c0cdac2a7bc01ed81fe96
        doc.text(`${percentage.toFixed(1)}%`, 160, yPosition);
        
        // Color code status
        if (status === 'Over Budget') {
          doc.setTextColor(239, 68, 68); // Red
        } else if (status === 'Warning') {
          doc.setTextColor(245, 158, 11); // Orange
        } else {
          doc.setTextColor(16, 185, 129); // Green
        }
        doc.text(status, 180, yPosition);
        doc.setTextColor(0, 0, 0);
        
        yPosition += 8;
      });

      // Budget Recommendations Section
      yPosition += 10;
      if (yPosition > 240) {
        doc.addPage();
        yPosition = 20;
      }

      doc.setFontSize(16);
      doc.setTextColor(0, 0, 0);
      doc.text('Budget Recommendations', 20, yPosition);
      yPosition += 10;

      doc.setFontSize(9);
      doc.setTextColor(100, 100, 100);
      
      const recommendations = getBudgetRecommendationsText(budgets);
      recommendations.forEach(rec => {
        if (yPosition > 270) {
          doc.addPage();
          yPosition = 20;
        }
        doc.text('• ' + rec, 20, yPosition, { maxWidth: 170 });
        yPosition += 8;
      });

      // Add page numbers and footer
      const pageCount = doc.internal.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.setTextColor(100, 100, 100);
        doc.text('Budget Analysis Report - Personal Finance Tracker', 20, 285);
        doc.text(`Page ${i} of ${pageCount}`, 180, 285, { align: 'right' });
      }

      const pdfBlob = doc.output('blob');
      resolve(pdfBlob);
    } catch (error) {
      console.error('Budget PDF generation error:', error);
      throw error;
    }
  });
};

// Helper functions
const formatPDFDate = (date) => {
  return date.toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric' 
  });
};

const calculateCategoryBreakdown = (transactions) => {
  const breakdown = {};
  transactions.forEach(transaction => {
    if (transaction.type === 'expense') {
      const category = transaction.category?.name || 'Uncategorized';
      const amount = parseFloat(transaction.amount || 0);
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

const getBudgetRecommendationsText = (budgets) => {
  const overBudget = budgets.filter(budget => parseFloat(budget.spent) > parseFloat(budget.limit));
  const nearBudget = budgets.filter(budget => {
    const percentage = parseFloat(budget.spent) / parseFloat(budget.limit);
    return percentage > 0.8 && percentage <= 1;
  });

  let recommendations = [];

  if (overBudget.length > 0) {
    recommendations.push(`You are over budget in ${overBudget.length} categories. Consider reviewing your spending in these areas.`);
    overBudget.forEach(budget => {
      recommendations.push(`${budget.category?.name}: Consider reducing spending or increasing your budget limit.`);
    });
  }

  if (nearBudget.length > 0) {
    recommendations.push(`You are approaching your budget limit in ${nearBudget.length} categories. Monitor these closely.`);
  }

  if (overBudget.length === 0 && nearBudget.length === 0) {
    recommendations.push('Great job! You are within your budget across all categories.');
  }

  recommendations.push('Consider setting up alerts for when you reach 80% of your budget.');
  recommendations.push('Review your budget limits monthly based on your actual spending patterns.');

  return recommendations;
};

const getCategoryName = (budget) => {
  return budget?.category?.name || 'Uncategorized';
};

export const ReportsPage = () => {
  const [dateRange, setDateRange] = useState({
    from: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
    to: new Date()
  });
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);

  useEffect(() => {
    loadReportData();
  }, [dateRange, selectedPeriod]);

  const loadReportData = async () => {
    setLoading(true);
    try {
      await delay(500);
      
      const totals = calculateTotals(mockTransactions);
      
      setReportData({
        transactions: mockTransactions,
        stats: mockDashboardStats,
        budgets: mockBudgets,
        categories: mockCategories,
        totals
      });
    } catch (error) {
      console.error('Failed to load report data:', error);
      toast.error('Failed to load report data');
    } finally {
      setLoading(false);
    }
  };

  const calculateTotals = (transactions) => {
    const totals = {
      income: 0,
      expenses: 0,
      netBalance: 0,
      transactionCount: transactions.length
    };

    transactions.forEach(transaction => {
      const amount = parseFloat(transaction.amount);
      if (transaction.type === 'income') {
        totals.income += amount;
      } else {
        totals.expenses += amount;
      }
    });

    totals.netBalance = totals.income - totals.expenses;
    return totals;
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

  const handleDownloadCSV = async () => {
    if (!reportData) return;
    
    try {
      const headers = ['Date', 'Description', 'Category', 'Type', 'Amount'];
      const csvContent = [
        headers.join(','),
        ...reportData.transactions.map(transaction => [
          transaction.transaction_date,
          `"${transaction.description}"`,
          transaction.category?.name || 'Uncategorized',
          transaction.type,
          transaction.amount
        ].join(','))
      ].join('\n');
      
      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `transactions-${formatDate(dateRange.from, 'yyyy-MM-dd')}-to-${formatDate(dateRange.to, 'yyyy-MM-dd')}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      toast.success('CSV report downloaded successfully!');
    } catch (error) {
      toast.error('Failed to generate CSV report');
    }
  };

  const handleDownloadPDF = async () => {
    if (!reportData) return;
    
    try {
      setDownloading(true);
      const blob = await generatePDFReport(reportData, dateRange);
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `financial-report-${formatDate(dateRange.from, 'yyyy-MM-dd')}-to-${formatDate(dateRange.to, 'yyyy-MM-dd')}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      toast.success('Financial PDF report downloaded successfully!');
    } catch (error) {
      console.error('PDF generation error:', error);
      toast.error('Failed to generate financial report');
    } finally {
      setDownloading(false);
    }
  };

  const handleDownloadBudgetReport = async () => {
    if (!reportData) return;
    
    try {
      setDownloading(true);
      const blob = await generateBudgetReport(reportData.budgets, reportData.categories, dateRange);
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `budget-analysis-${formatDate(dateRange.from, 'yyyy-MM-dd')}-to-${formatDate(dateRange.to, 'yyyy-MM-dd')}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      toast.success('Budget PDF report downloaded successfully!');
    } catch (error) {
      console.error('Budget report generation error:', error);
      toast.error('Failed to generate budget report');
    } finally {
      setDownloading(false);
    }
  };

  const calculateCategoryBreakdown = () => {
    if (!reportData) return [];
    
    const breakdown = {};
    reportData.transactions.forEach(transaction => {
      if (transaction.type === 'expense') {
        const category = transaction.category?.name || 'Uncategorized';
        const amount = parseFloat(transaction.amount || 0);
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
    const income = parseFloat(reportData.stats.totalIncome || 0);
    const expenses = parseFloat(reportData.stats.totalExpenses || 0);
    const savingsRate = income > 0 ? ((income - expenses) / income) * 100 : 0;
    
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
    
    const overBudgetCategories = reportData.budgets.filter(budget => {
      const spent = parseFloat(budget.spent || 0);
      const limit = parseFloat(budget.limit || 0);
      return spent > limit;
    });
    
    if (overBudgetCategories.length > 0) {
      insights.push({
        type: 'warning',
        text: `You're over budget in ${overBudgetCategories.length} ${overBudgetCategories.length === 1 ? 'category' : 'categories'}.`
      });
    }
    
    return insights;
  };

  const getBudgetPercentage = (budget) => {
    const spent = parseFloat(budget.spent || 0);
    const limit = parseFloat(budget.limit || 0);
    return limit > 0 ? (spent / limit) * 100 : 0;
  };

  const getBudgetSpent = (budget) => parseFloat(budget.spent || 0);
  const getBudgetLimit = (budget) => parseFloat(budget.limit || 0);
  const getIsOverBudget = (budget) => getBudgetSpent(budget) > getBudgetLimit(budget);
  const getCategoryName = (budget) => budget?.category?.name || 'Uncategorized';

  const formatDate = (date, formatStr = 'MMM dd') => {
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      ...(formatStr.includes('yyyy') && { year: 'numeric' }),
      ...(formatStr.includes('MMMM') && { month: 'long' })
    });
  };

  const categoryBreakdown = reportData ? calculateCategoryBreakdown() : [];
  const insights = reportData ? getInsights() : [];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Loading reports...</div>
      </div>
    );
  }

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
                  ? `${formatDate(dateRange.from)} - ${formatDate(dateRange.to)}`
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
<<<<<<< HEAD
                    ₱{reportData.totals.income.toLocaleString()}
=======
                    ${reportData.totals.income.toLocaleString()}
>>>>>>> d56f293ff91bb66bb44c0cdac2a7bc01ed81fe96
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
<<<<<<< HEAD
                    ₱{reportData.totals.expenses.toLocaleString()}
=======
                    ${reportData.totals.expenses.toLocaleString()}
>>>>>>> d56f293ff91bb66bb44c0cdac2a7bc01ed81fe96
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
<<<<<<< HEAD
                    ₱{reportData.totals.netBalance.toLocaleString()}
=======
                    ${reportData.totals.netBalance.toLocaleString()}
>>>>>>> d56f293ff91bb66bb44c0cdac2a7bc01ed81fe96
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
                    {reportData.totals.transactionCount}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {reportData && (
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
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span>Income</span>
                      <span className="font-semibold text-green-600">
<<<<<<< HEAD
                        ₱{reportData.totals.income.toLocaleString()}
=======
                        ${reportData.totals.income.toLocaleString()}
>>>>>>> d56f293ff91bb66bb44c0cdac2a7bc01ed81fe96
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Expenses</span>
                      <span className="font-semibold text-red-600">
<<<<<<< HEAD
                        ₱{reportData.totals.expenses.toLocaleString()}
=======
                        ${reportData.totals.expenses.toLocaleString()}
>>>>>>> d56f293ff91bb66bb44c0cdac2a7bc01ed81fe96
                      </span>
                    </div>
                    <div className="flex justify-between items-center pt-2 border-t">
                      <span className="font-semibold">Net</span>
                      <span className="font-semibold">
<<<<<<< HEAD
                        ₱{reportData.totals.netBalance.toLocaleString()}
=======
                        ${reportData.totals.netBalance.toLocaleString()}
>>>>>>> d56f293ff91bb66bb44c0cdac2a7bc01ed81fe96
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Savings Rate</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {(() => {
                      const income = reportData.totals.income;
                      const expenses = reportData.totals.expenses;
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
<<<<<<< HEAD
                          <div className="font-semibold">₱{item.amount.toFixed(2)}</div>
=======
                          <div className="font-semibold">${item.amount.toFixed(2)}</div>
>>>>>>> d56f293ff91bb66bb44c0cdac2a7bc01ed81fe96
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
                <div className="space-y-4">
                  {reportData.budgets.map((budget) => (
                    <div key={budget.id} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{getCategoryName(budget)}</span>
                          {getIsOverBudget(budget) && (
                            <Badge variant="destructive">Over Budget</Badge>
                          )}
                        </div>
                        <div className="text-right">
                          <div className="font-semibold">
<<<<<<< HEAD
                            ₱{getBudgetSpent(budget).toFixed(2)} / ₱{getBudgetLimit(budget).toFixed(2)}
=======
                            ${getBudgetSpent(budget).toFixed(2)} / ${getBudgetLimit(budget).toFixed(2)}
>>>>>>> d56f293ff91bb66bb44c0cdac2a7bc01ed81fe96
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {getBudgetPercentage(budget).toFixed(1)}% used
                          </div>
                        </div>
                      </div>
                      <Progress 
                        value={Math.min(getBudgetPercentage(budget), 100)} 
                        className={`h-2 ${getIsOverBudget(budget) ? 'bg-red-100' : ''}`} 
                      />
                    </div>
                  ))}
                </div>
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
                  <Button 
                    onClick={handleDownloadPDF} 
                    className="w-full"
                    disabled={downloading}
                  >
                    <Download className="mr-2 h-4 w-4" />
                    {downloading ? 'Generating...' : 'Download PDF Report'}
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
                  <Button onClick={handleDownloadCSV} className="w-full">
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
                    Detailed budget performance and recommendations in PDF
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button 
                    onClick={handleDownloadBudgetReport} 
                    className="w-full"
                    disabled={downloading}
                  >
                    <Download className="mr-2 h-4 w-4" />
                    {downloading ? 'Generating...' : 'Download Budget PDF'}
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
                  <p><strong>Date Range:</strong> {formatDate(dateRange.from, 'MMMM dd, yyyy')} - {formatDate(dateRange.to, 'MMMM dd, yyyy')}</p>
                  <p><strong>Transactions:</strong> {reportData.transactions.length} records</p>
                  <p><strong>Categories:</strong> {reportData.categories.length} categories</p>
                  <p><strong>Budgets:</strong> {reportData.budgets.length} active budgets</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
};