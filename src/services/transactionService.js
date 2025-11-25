import { mockTransactions, mockDashboardStats, mockCategoryStats, mockMonthlyStats, mockCategories, delay } from './mockData';

class TransactionService {
  useMockData = true;

  async getTransactions(filters = {}) {
    if (this.useMockData) {
      try {
        let filteredTransactions = [...mockTransactions];
      
        // Apply filters
        if (filters.type) {
          filteredTransactions = filteredTransactions.filter(t => t.type === filters.type);
        }
        
        if (filters.category_id) {
          filteredTransactions = filteredTransactions.filter(t => t.category_id === parseInt(filters.category_id));
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
    throw new Error('Backend not configured');
  }

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

  async createTransaction(data) {
    if (this.useMockData) {
      await delay(500);
      
      const newTransaction = {
        id: Math.max(...mockTransactions.map(t => t.id)) + 1,
        user_id: 1,
        type: data.type,
        amount: data.amount.toString(),
        category_id: data.category_id,
        category: mockCategories.find(c => c.id === data.category_id) || { id: data.category_id, name: 'Category', color: '#6b7280' },
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

  async getDashboardStats() {
    if (this.useMockData) {
      try {
        return mockDashboardStats;
      } catch (error) {
        console.error('Error in mock getDashboardStats:', error);
        throw new Error('Failed to get dashboard stats');
      }
    }
    throw new Error('Backend not configured');
  }

  async getCategoryStats(type = 'expense') {
    if (this.useMockData) {
      await delay(300);
      // Filter by type if specified
      if (type) {
        return mockCategoryStats.filter(stat => {
          const category = mockCategories.find(c => c.id === stat.category_id);
          return category && category.type === type;
        });
      }
      return mockCategoryStats;
    }
    throw new Error('Backend not configured');
  }

  async getMonthlyStats(months = 6) {
    if (this.useMockData) {
      await delay(400);
      return mockMonthlyStats.slice(0, months);
    }
    throw new Error('Backend not configured');
  }
}

export const transactionService = new TransactionService();