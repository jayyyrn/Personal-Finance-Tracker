export type TransactionType = 'income' | 'expense';

export interface Category {
  id: number;
  name: string;
  type: TransactionType;
  color?: string;
}

export interface TransactionData {
  type: TransactionType;
  amount: number;
  category_id: number;
  description: string;
  transaction_date: string;
}

export interface Budget {
  id: number;
  category_id: number;
  limit: number;
}

export interface DashboardStats {
  totalIncome?: number;
  totalExpenses?: number;
  // add other fields as needed
}
