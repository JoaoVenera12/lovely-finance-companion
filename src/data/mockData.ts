// This file will be deleted after migration
import { Account, Transaction, Card, CategoryType } from '@/types/models';

// Only keeping the helper function that might be useful
export const getAccountTypeLabel = (type: string) => {
  switch (type) {
    case 'checking':
      return 'Conta Corrente';
    case 'savings':
      return 'Poupança';
    case 'investment':
      return 'Investimento';
    default:
      return type;
  }
};
