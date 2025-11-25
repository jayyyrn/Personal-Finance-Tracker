// Mock categories data
export const mockCategories = [
  { id: 1, name: 'Food & Dining', color: '#ef4444', type: 'expense' },
  { id: 2, name: 'Transportation', color: '#3b82f6', type: 'expense' },
  { id: 3, name: 'Entertainment', color: '#8b5cf6', type: 'expense' },
  { id: 4, name: 'Shopping', color: '#f59e0b', type: 'expense' },
  { id: 5, name: 'Bills & Utilities', color: '#10b981', type: 'expense' },
  { id: 6, name: 'Healthcare', color: '#ec4899', type: 'expense' },
  { id: 7, name: 'Education', color: '#14b8a6', type: 'expense' },
  { id: 8, name: 'Salary', color: '#22c55e', type: 'income' },
  { id: 9, name: 'Freelance', color: '#06b6d4', type: 'income' },
  { id: 10, name: 'Investments', color: '#8b5cf6', type: 'income' }
];

// Mock transactions
export const mockTransactions = [
  {
    id: 1,
    user_id: 1,
    type: 'expense',
    amount: '150.00',
    category_id: 1,
    category: mockCategories[0],
    description: 'Grocery shopping',
    transaction_date: '2024-01-15',
    created_at: '2024-01-15T10:30:00Z',
    updated_at: '2024-01-15T10:30:00Z'
  },
  {
    id: 2,
    user_id: 1,
    type: 'income',
    amount: '3000.00',
    category_id: 8,
    category: mockCategories[7],
    description: 'Monthly salary',
    transaction_date: '2024-01-01',
    created_at: '2024-01-01T09:00:00Z',
    updated_at: '2024-01-01T09:00:00Z'
  },
  {
    id: 3,
    user_id: 1,
    type: 'expense',
    amount: '85.50',
    category_id: 2,
    category: mockCategories[1],
    description: 'Gas station',
    transaction_date: '2024-01-12',
    created_at: '2024-01-12T08:15:00Z',
    updated_at: '2024-01-12T08:15:00Z'
  },
  {
    id: 4,
    user_id: 1,
    type: 'expense',
    amount: '120.00',
    category_id: 3,
    category: mockCategories[2],
    description: 'Movie tickets',
    transaction_date: '2024-01-10',
    created_at: '2024-01-10T19:45:00Z',
    updated_at: '2024-01-10T19:45:00Z'
  },
  {
    id: 5,
    user_id: 1,
    type: 'expense',
    amount: '75.25',
    category_id: 4,
    category: mockCategories[3],
    description: 'Clothing purchase',
    transaction_date: '2024-01-08',
    created_at: '2024-01-08T14:20:00Z',
    updated_at: '2024-01-08T14:20:00Z'
  }
];

// Mock dashboard stats
export const mockDashboardStats = {
  totalIncome: '3000.00',
  totalExpenses: '430.75',
  netIncome: '2569.25',
  transactionCount: 5,
  thisMonthIncome: '3000.00',
  thisMonthExpenses: '430.75',
  avgDailySpending: '14.36'
};

// Mock category stats - CORRECTED to match SpendingChart expectations
export const mockCategoryStats = [
  { 
    category_id: 1, 
    category_name: 'Food & Dining', 
    total_amount: '150.00',  // Changed from 'total' to 'total_amount'
    category_color: '#ef4444',
    transaction_count: 1
  },
  { 
    category_id: 2, 
    category_name: 'Transportation', 
    total_amount: '85.50',
    category_color: '#3b82f6',
    transaction_count: 1
  },
  { 
    category_id: 3, 
    category_name: 'Entertainment', 
    total_amount: '120.00',
    category_color: '#8b5cf6',
    transaction_count: 1
  },
  { 
    category_id: 4, 
    category_name: 'Shopping', 
    total_amount: '75.25',
    category_color: '#f59e0b',
    transaction_count: 1
  }
];

// Mock monthly stats - CORRECTED to match SpendingChart expectations
export const mockMonthlyStats = [
  { month: '2024-01', income: '3000.00', expenses: '430.75', net: '2569.25' },
  { month: '2023-12', income: '3000.00', expenses: '1200.00', net: '1800.00' },
  { month: '2023-11', income: '2800.00', expenses: '950.00', net: '1850.00' },
  { month: '2023-10', income: '3000.00', expenses: '1100.00', net: '1900.00' },
  { month: '2023-09', income: '2900.00', expenses: '1300.00', net: '1600.00' },
  { month: '2023-08', income: '3000.00', expenses: '1250.00', net: '1750.00' }
];

// Mock budgets
export const mockBudgets = [
  {
    id: 1,
    user_id: 1,
    category_id: 1,
    category: mockCategories[0],
    limit: '500.00',
    spent: '150.00',
    remaining: '350.00',
    period: 'monthly',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-15T10:30:00Z'
  },
  {
    id: 2,
    user_id: 1,
    category_id: 2,
    category: mockCategories[1],
    limit: '400.00',
    spent: '85.50',
    remaining: '314.50',
    period: 'monthly',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-12T08:15:00Z'
  },
  {
    id: 3,
    user_id: 1,
    category_id: 3,
    category: mockCategories[2],
    limit: '250.00',
    spent: '120.00',
    remaining: '130.00',
    period: 'monthly',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-10T19:45:00Z'
  }
];

// Helper function to simulate API delay
export const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));