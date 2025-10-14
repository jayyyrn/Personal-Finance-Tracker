// Mock budgets data
const mockBudgets = [
  {
    id: 1,
    user_id: 1,
    category_id: 1,
    category: { id: 1, name: 'Food & Dining', color: '#ef4444' },
    limit: '500.00',
    spent: '450.00',
    remaining: '50.00',
    period: 'monthly',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-15T10:30:00Z'
  },
  {
    id: 2,
    user_id: 1,
    category_id: 2,
    category: { id: 2, name: 'Transportation', color: '#3b82f6' },
    limit: '400.00',
    spent: '300.00',
    remaining: '100.00',
    period: 'monthly',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-12T08:15:00Z'
  },
  {
    id: 3,
    user_id: 1,
    category_id: 3,
    category: { id: 3, name: 'Entertainment', color: '#8b5cf6' },
    limit: '250.00',
    spent: '200.00',
    remaining: '50.00',
    period: 'monthly',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-10T19:45:00Z'
  }
];

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class BudgetService {
  useMockData = true; // Set to false when Laravel backend is ready

  // Get all budgets
  async getBudgets() {
    if (this.useMockData) {
      try {
        // Remove delay to avoid any timing issues
        // await delay(400);
        return mockBudgets;
      } catch (error) {
        console.error('Error in mock getBudgets:', error);
        throw new Error('Failed to get budgets');
      }
    }

    throw new Error('Backend not configured');
  }

  // Get single budget
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

  // Create new budget
  async createBudget(data) {
    if (this.useMockData) {
      await delay(500);
      
      const newBudget = {
        id: Math.max(...mockBudgets.map(b => b.id)) + 1,
        user_id: 1,
        category_id: data.category_id,
        category: { id: data.category_id, name: 'Category', color: '#6b7280' },
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

  // Update budget
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

  // Delete budget
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

  // Get budget summary
  async getBudgetSummary() {
    if (this.useMockData) {
      await delay(300);
      
      const totalBudget = mockBudgets.reduce((sum, budget) => sum + parseFloat(budget.limit), 0);
      const totalSpent = mockBudgets.reduce((sum, budget) => sum + parseFloat(budget.spent), 0);
      const totalRemaining = totalBudget - totalSpent;
      
      return {
        totalBudget: totalBudget.toString(),
        totalSpent: totalSpent.toString(),
        totalRemaining: totalRemaining.toString(),
        budgetCount: mockBudgets.length,
        overBudgetCount: mockBudgets.filter(b => parseFloat(b.spent) > parseFloat(b.limit)).length
      };
    }

    throw new Error('Backend not configured');
  }
}

export const budgetService = new BudgetService();