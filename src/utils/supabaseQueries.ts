
import { supabase } from '@/lib/supabase';
import { startOfMonth, endOfMonth, subMonths } from 'date-fns';
import { Account, Transaction, Card } from '@/types/models';
import { mapDbAccountToAccount, mapDbTransactionToTransaction, mapDbCardToCard, defaultCategoryColors } from './dataMappers';

export const fetchAccounts = async (): Promise<Account[]> => {
  const { data: accounts, error } = await supabase
    .from('accounts')
    .select('*')
    .order('created_at');
    
  if (error) throw error;
  return accounts.map(mapDbAccountToAccount);
};

export const fetchAccountById = async (id: string): Promise<Account | null> => {
  const { data: account, error } = await supabase
    .from('accounts')
    .select('*')
    .eq('id', id)
    .single();
    
  if (error) {
    if (error.code === 'PGRST116') return null; // No rows returned
    throw error;
  }
  
  return account ? mapDbAccountToAccount(account) : null;
};

export const fetchTransactionsByAccountId = async (accountId: string): Promise<Transaction[]> => {
  const { data: transactions, error } = await supabase
    .from('transactions')
    .select('*')
    .eq('account_id', accountId)
    .order('date', { ascending: false });
    
  if (error) throw error;
  return transactions.map(mapDbTransactionToTransaction);
};

export const fetchCardsByAccountId = async (accountId: string): Promise<Card[]> => {
  const { data: cards, error } = await supabase
    .from('cards')
    .select('*')
    .eq('account_id', accountId);
    
  if (error) throw error;
  return cards.map(mapDbCardToCard);
};

export const fetchAllTransactions = async (): Promise<Transaction[]> => {
  const { data: transactions, error } = await supabase
    .from('transactions')
    .select('*')
    .order('date', { ascending: false });
    
  if (error) throw error;
  return transactions.map(mapDbTransactionToTransaction);
};

export const fetchCategoryColors = async (): Promise<Record<string, string>> => {
  const { data: colors, error } = await supabase
    .from('category_colors')
    .select('category, color');
    
  if (error) throw error;

  const colorMap: Record<string, string> = {};
  colors?.forEach((item: any) => {
    colorMap[item.category] = item.color;
  });
  
  return colorMap;
};

export const calculateMonthlyIncomeExpense = async () => {
  const currentDate = new Date();
  const startDate = startOfMonth(currentDate);
  const endDate = endOfMonth(currentDate);

  const { data: transactions, error } = await supabase
    .from('transactions')
    .select('*')
    .gte('date', startDate.toISOString())
    .lte('date', endDate.toISOString());

  if (error) throw error;

  const income = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + Number(t.amount), 0);

  const expense = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + Number(t.amount), 0);

  return { income, expense };
};

export const calculateTotalBalance = async () => {
  const { data: accounts, error } = await supabase
    .from('accounts')
    .select('balance');

  if (error) throw error;
  
  return accounts.reduce((sum, account) => sum + Number(account.balance), 0);
};

export const getCategoryExpenseData = async () => {
  const currentDate = new Date();
  const startDate = startOfMonth(currentDate);
  const endDate = endOfMonth(currentDate);

  const { data: transactions, error } = await supabase
    .from('transactions')
    .select('*')
    .eq('type', 'expense')
    .gte('date', startDate.toISOString())
    .lte('date', endDate.toISOString());

  if (error) throw error;

  const categoryTotals: Record<string, number> = {};
  transactions.forEach(transaction => {
    categoryTotals[transaction.category] = (categoryTotals[transaction.category] || 0) + Number(transaction.amount);
  });

  return Object.entries(categoryTotals).map(([name, value]) => ({
    name,
    value
  }));
};

export const getMonthlyTransactionData = async () => {
  const last6Months = Array.from({ length: 6 }, (_, i) => {
    const date = subMonths(new Date(), i);
    return {
      startDate: startOfMonth(date),
      endDate: endOfMonth(date),
      month: date.toLocaleString('default', { month: 'short' })
    };
  }).reverse();

  const { data: transactions, error } = await supabase
    .from('transactions')
    .select('*')
    .gte('date', last6Months[0].startDate.toISOString())
    .lte('date', last6Months[5].endDate.toISOString());

  if (error) throw error;

  return last6Months.map(({ startDate, endDate, month }) => {
    const monthTransactions = transactions.filter(t => {
      const date = new Date(t.date);
      return date >= startDate && date <= endDate;
    });

    const income = monthTransactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + Number(t.amount), 0);

    const expense = monthTransactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + Number(t.amount), 0);

    return { month, income, expense };
  });
};
