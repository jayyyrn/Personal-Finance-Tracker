import { mockBudgets, delay, mockCategories } from './mockData';

class BudgetService {
  useMockData = true;

  async getBudgets() {
    if (this.useMockData) {
      try {
        return mockBudgets;
      } catch (error) {
        console.error('Error in mock getBudgets:', error);
        throw new Error('Failed to get budgets');
      }
    }
    throw new Error('Backend not configured');
  }

  async getBudget(id) {
    if (this.useMockData) {
      await delay(200);
      const budget = mockBudgets.find(b => b.id === id);
      if (!budget) {
        throw new Error('Budget not found');
      }
      return budget;
    }
    throw new Error('Backend not configured');
  }

  async createBudget(data) {
    if (this.useMockData) {
      await delay(500);
      
      const newBudget = {
        id: Math.max(...mockBudgets.map(b => b.id)) + 1,
        user_id: 1,
        category_id: data.category_id,
        category: mockCategories.find(c => c.id === data.category_id),
        limit: data.limit.toString(),
        spent: '0.00',
        remaining: data.limit.toString(),
        period: data.period || 'monthly',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      
      mockBudgets.push(newBudget);
      return newBudget;
    }
    throw new Error('Backend not configured');
  }

  async updateBudget(id, data) {
    if (this.useMockData) {
      await delay(400);
      
      const index = mockBudgets.findIndex(b => b.id === id);
      if (index === -1) {
        throw new Error('Budget not found');
      }
      
      const budget = mockBudgets[index];
      const updatedBudget = { 
        ...budget, 
        ...data, 
        updated_at: new Date().toISOString()
      };
      
      // Recalculate remaining if limit changed
      if (data.limit) {
        updatedBudget.limit = data.limit.toString();
        updatedBudget.remaining = (parseFloat(data.limit) - parseFloat(budget.spent)).toString();
      }
      
      mockBudgets[index] = updatedBudget;
      return updatedBudget;
    }
    throw new Error('Backend not configured');
  }

  async deleteBudget(id) {
    if (this.useMockData) {
      await delay(300);
      
      const index = mockBudgets.findIndex(b => b.id === id);
      if (index === -1) {
        throw new Error('Budget not found');
      }
      
      mockBudgets.splice(index, 1);
      return;
    }
    throw new Error('Backend not configured');
  }
}

export const budgetService = new BudgetService();