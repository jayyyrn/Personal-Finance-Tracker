import { format } from './dateUtils';

// Mock PDF generation (replace with actual PDF library like jsPDF or pdfmake)
export const generatePDFReport = async (reportData, dateRange) => {
  // This is a mock implementation. In a real app, you'd use a PDF library
  const content = `
    PERSONAL FINANCE REPORT
    Period: ${format(dateRange.from, 'MMMM dd, yyyy')} - ${format(dateRange.to, 'MMMM dd, yyyy')}
    
    SUMMARY
    Total Income: $${parseFloat(reportData.stats.monthly_income || 0).toLocaleString()}
    Total Expenses: $${parseFloat(reportData.stats.monthly_expenses || 0).toLocaleString()}
    Net Balance: $${parseFloat(reportData.stats.current_balance || 0).toLocaleString()}
    
    TRANSACTIONS (${reportData.transactions.length} total)
    ${reportData.transactions.map(t => 
      `${format(new Date(t.transaction_date), 'MM/dd/yyyy')} - ${t.type.toUpperCase()}: $${parseFloat(t.amount).toLocaleString()} (${t.category?.name || 'Uncategorized'}) - ${t.description}`
    ).join('\n')}
    
    BUDGET ANALYSIS
    ${reportData.budgets.map(b => 
      `${b.category?.name}: $${parseFloat(b.spent).toLocaleString()} / $${parseFloat(b.limit).toLocaleString()} (${b.percentage.toFixed(1)}% used)${b.is_over_budget ? ' - OVER BUDGET' : ''}`
    ).join('\n')}
  `;
  
  // Convert to blob (in real implementation, use proper PDF library)
  return new Blob([content], { type: 'application/pdf' });
};

export const generateCSVReport = (transactions) => {
  const headers = ['Date', 'Type', 'Amount', 'Category', 'Description'];
  const rows = transactions.map(transaction => [
    format(new Date(transaction.transaction_date), 'MM/dd/yyyy'),
    transaction.type,
    parseFloat(transaction.amount).toFixed(2),
    transaction.category?.name || 'Uncategorized',
    `"${transaction.description.replace(/"/g, '""')}"`
  ]);
  
  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.join(','))
  ].join('\n');
  
  return csvContent;
};

export const generateBudgetReport = async (budgets, categories, dateRange) => {
  const content = `
    BUDGET ANALYSIS REPORT
    Period: ${format(dateRange.from, 'MMMM dd, yyyy')} - ${format(dateRange.to, 'MMMM dd, yyyy')}
    
    BUDGET PERFORMANCE
    ${budgets.map(budget => {
      const utilizationRate = budget.percentage;
      let status = 'On Track';
      if (budget.is_over_budget) status = 'Over Budget';
      else if (utilizationRate > 80) status = 'Near Limit';
      
      return `
      Category: ${budget.category?.name}
      Budget Limit: $${parseFloat(budget.limit).toLocaleString()}
      Amount Spent: $${parseFloat(budget.spent).toLocaleString()}
      Remaining: $${parseFloat(budget.remaining).toLocaleString()}
      Utilization: ${utilizationRate.toFixed(1)}%
      Status: ${status}
      `;
    }).join('\n')}
    
    RECOMMENDATIONS
    ${budgets.map(budget => {
      if (budget.is_over_budget) {
        return `• ${budget.category?.name}: Consider reducing spending or increasing budget limit`;
      } else if (budget.percentage > 80) {
        return `• ${budget.category?.name}: Monitor closely - approaching budget limit`;
      } else if (budget.percentage < 50) {
        return `• ${budget.category?.name}: Room for additional spending or budget reallocation`;
      }
      return null;
    }).filter(Boolean).join('\n')}
  `;
  
  return new Blob([content], { type: 'application/pdf' });
};