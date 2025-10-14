import { apiService } from './api.js';

class AuthService {
  // Mock data for development
  useMockData = true;

  // Login user
  async login(credentials) {
    if (this.useMockData) {
      // Mock login for development
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (credentials.email === 'demo@example.com' && credentials.password === 'password') {
        const mockResponse = {
          user: {
            id: 1,
            name: 'Demo User',
            email: 'demo@example.com',
            email_verified_at: new Date().toISOString(),
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            avatar: null,
            phone: '+1 (555) 123-4567',
            bio: 'Finance enthusiast and budgeting expert'
          },
          token: 'mock-jwt-token-12345',
          expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
        };
        
        // Store token
        localStorage.setItem('auth_token', mockResponse.token);
        localStorage.setItem('user', JSON.stringify(mockResponse.user));
        
        return mockResponse;
      } else if (credentials.email === 'google.user@gmail.com' && credentials.password === 'google-oauth-token') {
        // Handle Google OAuth user
        const mockResponse = {
          user: {
            id: 2,
            name: 'Google User',
            email: 'google.user@gmail.com',
            email_verified_at: new Date().toISOString(),
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            avatar: 'https://lh3.googleusercontent.com/a/default-user=s96-c',
            phone: '',
            bio: 'Signed in with Google'
          },
          token: 'mock-google-jwt-token-67890',
          expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
        };
        
        // Store token
        localStorage.setItem('auth_token', mockResponse.token);
        localStorage.setItem('user', JSON.stringify(mockResponse.user));
        
        return mockResponse;
      } else {
        throw new Error('Invalid credentials');
      }
    }

    // Real API calls only when not using mock data
    const response = await apiService.post('/auth/login', credentials);
    
    // Store token
    apiService.setToken(response.data.token);
    localStorage.setItem('user', JSON.stringify(response.data.user));
    
    return response.data;
  }

  // Register new user
  async register(data) {
    if (this.useMockData) {
      // Mock registration for development
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const mockResponse = {
        user: {
          id: 1,
          name: data.name,
          email: data.email,
          email_verified_at: new Date().toISOString(),
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          avatar: null,
          phone: '',
          bio: ''
        },
        token: 'mock-jwt-token-12345',
        expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
      };
      
      // Store token
      localStorage.setItem('auth_token', mockResponse.token);
      localStorage.setItem('user', JSON.stringify(mockResponse.user));
      
      return mockResponse;
    }

    // Real API calls only when not using mock data
    const response = await apiService.post('/auth/register', data);
    
    // Store token
    apiService.setToken(response.data.token);
    localStorage.setItem('user', JSON.stringify(response.data.user));
    
    return response.data;
  }

  // Logout user
  async logout() {
    if (this.useMockData) {
      // Mock logout
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user');
      return;
    }

    // Real API calls only when not using mock data
    try {
      await apiService.post('/auth/logout', {});
    } finally {
      // Always remove token, even if API call fails
      apiService.removeToken();
      localStorage.removeItem('user');
    }
  }

  // Get current user
  async getCurrentUser() {
    if (this.useMockData) {
      const userStr = localStorage.getItem('user');
      if (userStr) {
        return JSON.parse(userStr);
      }
      throw new Error('User not found');
    }

    // Real API calls only when not using mock data
    const response = await apiService.get('/auth/user');
    return response.data;
  }

  // Update user profile
  async updateProfile(data) {
    if (this.useMockData) {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
      const updatedUser = {
        ...currentUser,
        ...data,
        updated_at: new Date().toISOString()
      };
      
      localStorage.setItem('user', JSON.stringify(updatedUser));
      return updatedUser;
    }

    // Real API calls only when not using mock data
    const response = await apiService.put('/auth/profile', data);
    localStorage.setItem('user', JSON.stringify(response.data));
    return response.data;
  }

  // Refresh token
  async refreshToken() {
    if (this.useMockData) {
      const mockResponse = {
        user: JSON.parse(localStorage.getItem('user') || '{}'),
        token: 'mock-refreshed-jwt-token-12345',
        expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
      };
      
      localStorage.setItem('auth_token', mockResponse.token);
      return mockResponse;
    }

    // Real API calls only when not using mock data
    const response = await apiService.post('/auth/refresh', {});
    
    // Update token
    apiService.setToken(response.data.token);
    
    return response.data;
  }

  // Check if user is authenticated
  isAuthenticated() {
    return localStorage.getItem('auth_token') !== null;
  }

  // Send password reset email
  async forgotPassword(email) {
    if (this.useMockData) {
      await new Promise(resolve => setTimeout(resolve, 1000));
      // Mock successful response
      return;
    }

    // Real API calls only when not using mock data
    await apiService.post('/auth/forgot-password', { email });
  }

  // Reset password
  async resetPassword(data) {
    if (this.useMockData) {
      await new Promise(resolve => setTimeout(resolve, 1000));
      return;
    }

    // Real API calls only when not using mock data
    await apiService.post('/auth/reset-password', data);
  }

  // Update password
  async updatePassword(data) {
    if (this.useMockData) {
      await new Promise(resolve => setTimeout(resolve, 1000));
      return;
    }

    // Real API calls only when not using mock data
    await apiService.put('/auth/password', data);
  }

  // Update notification preferences
  async updateNotificationPreferences(preferences) {
    if (this.useMockData) {
      await new Promise(resolve => setTimeout(resolve, 500));
      return preferences;
    }

    // Real API calls only when not using mock data
    const response = await apiService.put('/auth/notification-preferences', preferences);
    return response.data;
  }

  // Delete account
  async deleteAccount() {
    if (this.useMockData) {
      await new Promise(resolve => setTimeout(resolve, 1000));
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user');
      return;
    }

    // Real API calls only when not using mock data
    await apiService.delete('/auth/account');
    this.logout();
  }
}

export const authService = new AuthService();