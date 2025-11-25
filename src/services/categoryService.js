import { mockCategories, delay } from './mockData';

class CategoryService {
  useMockData = true;

  async getCategories() {
    if (this.useMockData) {
      try {
        return mockCategories;
      } catch (error) {
        console.error('Error in mock getCategories:', error);
        throw new Error('Failed to get categories');
      }
    }
    throw new Error('Backend not configured');
  }

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