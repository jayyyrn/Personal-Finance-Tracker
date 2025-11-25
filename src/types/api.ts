// Laravel API Response Types
export interface ApiResponse<T> {
  data: T;
  message?: string;
  status: 'success' | 'error';
}

export interface PaginatedResponse<T> {
  data: T[];
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
  from: number;
  to: number;
}

export interface User {
  id: number;
  name: string;
  email: string;
  email_verified_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface ValidationError {
  message: string;
  errors: Record<string, string[]>;
}

// Updated Transaction type for Laravel
export interface Transaction {
  id: number;
  user_id: number;
  type: 'income' | 'expense';
  amount: string; // Laravel returns decimals as strings
  category_id: number;
  category?: Category;
  description: string;
  transaction_date: string; // Laravel date format
  created_at: string;
  updated_at: string;
}

// Updated Budget type for Laravel
export interface Budget {
  id: number;
  user_id: number;
  category_id: number;
  category?: Category;
  limit: string; // Laravel returns decimals as strings
  spent?: string; // Calculated field
  created_at: string;
  updated_at: string;
}

// Category type for Laravel
export interface Category {
  id: number;
  name: string;
  type: 'income' | 'expense';
  color: string;
  icon?: string;
  created_at: string;
  updated_at: string;
}

export interface DashboardStats {
  total_income: string;
  total_expenses: string;
  current_balance: string;
  monthly_income: string;
  monthly_expenses: string;
  transactions_count: number;
}

export interface CategoryStats {
  category_id: number;
  category_name: string;
  category_color: string;
  total_amount: string;
  transaction_count: number;
}

export interface MonthlyStats {
  month: string;
  year: number;
  income: string;
  expenses: string;
  net: string;
}