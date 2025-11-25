// API Types - Actual exports for JavaScript

/**
 * @typedef {Object} ApiResponse
 * @property {*} data
 * @property {string} [message]
 * @property {'success'|'error'} status
 */

// Export actual objects that can be imported
export const DatabaseStatus = {
  ONLINE: 'online',
  OFFLINE: 'offline',
  MAINTENANCE: 'maintenance'
};

export const DashboardStats = {
  total_income: '',
  total_expenses: '',
  current_balance: '',
  monthly_income: '',
  monthly_expenses: '',
  transactions_count: 0
};

export const ApiResponse = {
  data: null,
  message: '',
  status: 'success'
};

export const PaginatedResponse = {
  data: [],
  current_page: 1,
  last_page: 1,
  per_page: 10,
  total: 0,
  from: 0,
  to: 0
};

export const User = {
  id: 0,
  name: '',
  email: '',
  email_verified_at: null,
  created_at: '',
  updated_at: '',
  avatar: null,
  phone: '',
  bio: ''
};

export const Transaction = {
  id: 0,
  user_id: 0,
  type: 'expense',
  amount: '',
  category_id: 0,
  description: '',
  transaction_date: '',
  created_at: '',
  updated_at: ''
};

export const Budget = {
  id: 0,
  user_id: 0,
  category_id: 0,
  limit: '',
  spent: '',
  created_at: '',
  updated_at: ''
};

export const Category = {
  id: 0,
  name: '',
  type: 'expense',
  color: '',
  icon: '',
  created_at: '',
  updated_at: ''
};

// Keep JSDoc comments for documentation
/**
 * @typedef {Object} ValidationError
 * @property {string} message
 * @property {Object.<string, Array<string>>} errors
 */

/**
 * @typedef {Object} CategoryStats
 * @property {number} category_id
 * @property {string} category_name
 * @property {string} category_color
 * @property {string} total_amount
 * @property {number} transaction_count
 */

/**
 * @typedef {Object} MonthlyStats
 * @property {string} month
 * @property {number} year
 * @property {string} income
 * @property {string} expenses
 * @property {string} net
 */

/**
 * @typedef {Object} LoginCredentials
 * @property {string} email
 * @property {string} password
 */

/**
 * @typedef {Object} RegisterData
 * @property {string} name
 * @property {string} email
 * @property {string} password
 * @property {string} password_confirmation
 */

/**
 * @typedef {Object} AuthResponse
 * @property {User} user
 * @property {string} token
 * @property {string} expires_at
 */