export interface Transaction {
  id: string;
  type: 'income' | 'expense';
  amount: number;
  category: string;
  description: string;
  date: string;
}

export interface Budget {
  category: string;
  limit: number;
  spent: number;
}

export interface Category {
  name: string;
  type: 'income' | 'expense';
  color: string;
}