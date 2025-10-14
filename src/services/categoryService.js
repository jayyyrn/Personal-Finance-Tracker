// Mock categories data
const mockCategories = [
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

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class CategoryService {
  useMockData = true; // Set to false when Laravel backend is ready

  // Get all categories
  async getCategories() {
    if (this.useMockData) {
      try {
        // Remove delay to avoid any timing issues
        // await delay(300);
        return mockCategories;
      } catch (error) {
        console.error('Error in mock getCategories:', error);
        throw new Error('Failed to get categories');
      }
    }

    throw new Error('Backend not configured');
  }

  // Get single category
  async getCategory(id) {
    if (this.useMockData) {
      await delay(200);
      const category = mockCategories.find(c => c.id === id);
      if (!category) {
        throw new Error('Category not found');
      }
      return category;
    }

    throw new Error('Backend not configured');
  }

  // Create new category
  async createCategory(data) {
    if (this.useMockData) {
      await delay(400);
      
      const newCategory = {
        id: Math.max(...mockCategories.map(c => c.id)) + 1,
        name: data.name,
        color: data.color,
        type: data.type,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      
      mockCategories.push(newCategory);
      return newCategory;
    }

    throw new Error('Backend not configured');
  }

  // Update category
  async updateCategory(id, data) {
    if (this.useMockData) {
      await delay(400);
      
      const index = mockCategories.findIndex(c => c.id === id);
      if (index === -1) {
        throw new Error('Category not found');
      }
      
      const updated = { ...mockCategories[index], ...data, updated_at: new Date().toISOString() };
      mockCategories[index] = updated;
      return updated;
    }

    throw new Error('Backend not configured');
  }

  // Delete category
  async deleteCategory(id) {
    if (this.useMockData) {
      await delay(300);
      
      const index = mockCategories.findIndex(c => c.id === id);
      if (index === -1) {
        throw new Error('Category not found');
      }
      
      mockCategories.splice(index, 1);
      return;
    }

    throw new Error('Backend not configured');
  }
}

export const categoryService = new CategoryService();