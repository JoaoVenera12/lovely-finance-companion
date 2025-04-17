
export type AccountType = 'checking' | 'savings' | 'investment';

export interface Account {
  id: string;
  name: string;
  type: AccountType;
  balance: number;
  createdAt: string;
  color?: string;
}

export type TransactionType = 'income' | 'expense';

export type CategoryType = 
  | 'food' 
  | 'transport' 
  | 'housing' 
  | 'entertainment' 
  | 'health' 
  | 'education' 
  | 'shopping' 
  | 'salary' 
  | 'investment' 
  | 'other';

export interface Category {
  id: string;
  name: string;
  type: CategoryType;
  color: string;
  icon?: string;
}

export interface Transaction {
  id: string;
  accountId: string;
  description: string;
  amount: number;
  type: TransactionType;
  category: CategoryType;
  date: string;
  createdAt: string;
}

export type CardType = 'credit' | 'debit' | 'both';

export interface Card {
  id: string;
  accountId: string;
  name: string;
  type: CardType;
  lastFourDigits: string;
  expiryDate: string;
  limit?: number;
  closingDay?: number;
  dueDay?: number;
}
