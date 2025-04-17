
import { Database } from '@/integrations/supabase/types';
import { Account, Transaction, Card, CategoryType } from '@/types/models';

// Map database account to frontend account
export function mapDbAccountToAccount(dbAccount: Database['public']['Tables']['accounts']['Row']): Account {
  return {
    id: dbAccount.id,
    name: dbAccount.name,
    type: dbAccount.type,
    balance: dbAccount.balance,
    createdAt: dbAccount.created_at,
    color: dbAccount.color || '#888888'
  };
}

// Map database transaction to frontend transaction
export function mapDbTransactionToTransaction(dbTransaction: Database['public']['Tables']['transactions']['Row']): Transaction {
  return {
    id: dbTransaction.id,
    accountId: dbTransaction.account_id,
    description: dbTransaction.description,
    amount: dbTransaction.amount,
    type: dbTransaction.type,
    category: dbTransaction.category,
    date: dbTransaction.date,
    createdAt: dbTransaction.created_at
  };
}

// Map database card to frontend card
export function mapDbCardToCard(dbCard: Database['public']['Tables']['cards']['Row']): Card {
  return {
    id: dbCard.id,
    accountId: dbCard.account_id,
    name: dbCard.name,
    type: dbCard.type,
    lastFourDigits: dbCard.last_four_digits,
    expiryDate: dbCard.expiry_date,
    limit: dbCard.credit_limit || undefined,
    closingDay: dbCard.closing_day || undefined,
    dueDay: dbCard.due_day || undefined
  };
}

// Default category colors (fallback)
export const defaultCategoryColors: Record<CategoryType, string> = {
  food: '#FF6B6B',
  transport: '#4ECDC4',
  housing: '#45B7D1',
  entertainment: '#96CEB4',
  health: '#FF7F50',
  education: '#9B59B6',
  shopping: '#3498DB',
  salary: '#2ECC71',
  investment: '#F1C40F',
  other: '#95A5A6'
};
