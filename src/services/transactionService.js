// Mock data for development
const mockTransactions = [
  {
    id: 1,
    user_id: 1,
    type: 'expense',
    amount: '150.00',
    category_id: 1,
    category: { id: 1, name: 'Food & Dining', color: '#ef4444' },
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
    category: { id: 8, name: 'Salary', color: '#22c55e' },
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
    category: { id: 2, name: 'Transportation', color: '#3b82f6' },
    description: 'Gas station',
    transaction_date: '2024-01-12',
    created_at: '2024-01-12T08:15:00Z',
    updated_at: '2024-01-12T08:15:00Z'
  }
];

const mockDashboardStats = {
  totalIncome: '3000.00',
  totalExpenses: '1250.75',
  netIncome: '1749.25',
  transactionCount: 24,
  thisMonthIncome: '3000.00',
  thisMonthExpenses: '1250.75',
  avgDailySpending: '40.35'
};

const mockCategoryStats = [
  { category_id: 1, category_name: 'Food & Dining', total: '450.00', color: '#ef4444' },
  { category_id: 2, category_name: 'Transportation', total: '300.00', color: '#3b82f6' },
  { category_id: 3, category_name: 'Entertainment', total: '200.00', color: '#8b5cf6' }
];

const mockMonthlyStats = [
  { month: '2024-01', income: '3000.00', expenses: '1200.00' },
  { month: '2023-12', income: '3000.00', expenses: '1400.00' },
  { month: '2023-11', income: '3000.00', expenses: '1100.00' }
];

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class TransactionService {
  useMockData = true; // Set to false when Laravel backend is ready

  // Get all transactions with filters and pagination
  async getTransactions(filters = {}) {
    if (this.useMockData) {
      try {
        // Remove delay to avoid any timing issues
        // await delay(500); // Simulate network delay
      
      let filteredTransactions = [...mockTransactions];
      
      // Apply filters
      if (filters.type) {
        filteredTransactions = filteredTransactions.filter(t => t.type === filters.type);
      }
      
      if (filters.category_id) {
        filteredTransactions = filteredTransactions.filter(t => t.category_id === filters.category_id);
      }
      
      if (filters.search) {
        filteredTransactions = filteredTransactions.filter(t => 
          t.description.toLowerCase().includes(filters.search.toLowerCase())
        );
      }
      
      // Sort by date (newest first)
      filteredTransactions.sort((a, b) => 
        new Date(b.transaction_date).getTime() - new Date(a.transaction_date).getTime()
      );
      
        return {
          data: filteredTransactions,
          current_page: 1,
          last_page: 1,
          per_page: 15,
          total: filteredTransactions.length,
          from: 1,
          to: filteredTransactions.length
        };
      } catch (error) {
        console.error('Error in mock getTransactions:', error);
        throw new Error('Failed to get transactions');
      }
    }

    // Real API call would go here
    throw new Error('Backend not configured');
  }

  // Get single transaction
  async getTransaction(id) {
    if (this.useMockData) {
      await delay(300);
      const transaction = mockTransactions.find(t => t.id === id);
      if (!transaction) {
        throw new Error('Transaction not found');
      }
      return transaction;
    }

    throw new Error('Backend not configured');
  }

  // Create new transaction
  async createTransaction(data) {
    if (this.useMockData) {
      await delay(500);
      
      const newTransaction = {
        id: Math.max(...mockTransactions.map(t => t.id)) + 1,
        user_id: 1,
        type: data.type,
        amount: data.amount.toString(),
        category_id: data.category_id,
        category: { id: data.category_id, name: 'Category', color: '#6b7280' },
        description: data.description,
        transaction_date: data.transaction_date,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      
      mockTransactions.push(newTransaction);
      return newTransaction;
    }

    throw new Error('Backend not configured');
  }

  // Update transaction
  async updateTransaction(id, data) {
    if (this.useMockData) {
      await delay(500);
      
      const index = mockTransactions.findIndex(t => t.id === id);
      if (index === -1) {
        throw new Error('Transaction not found');
      }
      
      const updated = { ...mockTransactions[index], ...data, updated_at: new Date().toISOString() };
      mockTransactions[index] = updated;
      return updated;
    }

    throw new Error('Backend not configured');
  }

  // Delete transaction
  async deleteTransaction(id) {
    if (this.useMockData) {
      await delay(300);
      
      const index = mockTransactions.findIndex(t => t.id === id);
      if (index === -1) {
        throw new Error('Transaction not found');
      }
      
      mockTransactions.splice(index, 1);
      return;
    }

    throw new Error('Backend not configured');
  }

  // Get dashboard statistics
  async getDashboardStats() {
    if (this.useMockData) {
      try {
        // Remove delay to avoid any timing issues
        // await delay(400);
        return mockDashboardStats;
      } catch (error) {
        console.error('Error in mock getDashboardStats:', error);
        throw new Error('Failed to get dashboard stats');
      }
    }

    throw new Error('Backend not configured');
  }

  // Get spending by category
  async getCategoryStats(type = 'expense') {
    if (this.useMockData) {
      await delay(300);
      return mockCategoryStats;
    }

    throw new Error('Backend not configured');
  }

  // Get monthly spending trends
  async getMonthlyStats(months = 6) {
    if (this.useMockData) {
      await delay(400);
      return mockMonthlyStats;
    }

    throw new Error('Backend not configured');
  }
}

export const transactionService = new TransactionService();

// Export additional types/interfaces for JavaScript compatibility
export const TransactionFilters = {};