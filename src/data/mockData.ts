import { 
  Account, 
  Transaction, 
  Card, 
  MonthlyData 
} from '@/types/models';

// Account constants
export const ACCOUNT_TYPE = {
  CHECKING: 'checking',
  SAVINGS: 'savings',
  INVESTMENT: 'investment',
};

// Sample account data
export const accounts: Account[] = [
  {
    id: '1',
    name: 'Conta Corrente',
    type: 'checking',
    balance: 5000,
    createdAt: '2024-01-01T10:00:00.000Z',
    color: '#29ABE2',
  },
  {
    id: '2',
    name: 'Conta Poupança',
    type: 'savings',
    balance: 15000,
    createdAt: '2023-12-15T14:30:00.000Z',
    color: '#8E44AD',
  },
  {
    id: '3',
    name: 'Investimentos',
    type: 'investment',
    balance: 25000,
    createdAt: '2023-11-20T09:15:00.000Z',
    color: '#F39C12',
  },
  {
    id: '4',
    name: 'Nuconta',
    type: 'checking',
    balance: 879.32,
    createdAt: '2023-11-20T09:15:00.000Z',
    color: '#9b59b6',
  },
];

// Transaction constants
export const TRANSACTION_TYPE = {
  INCOME: 'income',
  EXPENSE: 'expense',
};

export const CATEGORY_TYPE = {
  FOOD: 'food',
  TRANSPORT: 'transport',
  HOUSING: 'housing',
  ENTERTAINMENT: 'entertainment',
  HEALTH: 'health',
  EDUCATION: 'education',
  SHOPPING: 'shopping',
  SALARY: 'salary',
  INVESTMENT: 'investment',
  OTHER: 'other',
};

// Sample transaction data
export const transactions: Transaction[] = [
  {
    id: '1',
    accountId: '1',
    description: 'Salário',
    amount: 5000,
    type: 'income',
    category: 'salary',
    date: '2024-01-05T08:00:00.000Z',
    createdAt: '2024-01-05T08:00:00.000Z',
  },
  {
    id: '2',
    accountId: '1',
    description: 'Aluguel',
    amount: 1200,
    type: 'expense',
    category: 'housing',
    date: '2024-01-10T19:00:00.000Z',
    createdAt: '2024-01-10T19:00:00.000Z',
  },
  {
    id: '3',
    accountId: '1',
    description: 'Supermercado',
    amount: 500,
    type: 'expense',
    category: 'food',
    date: '2024-01-15T13:00:00.000Z',
    createdAt: '2024-01-15T13:00:00.000Z',
  },
  {
    id: '4',
    accountId: '1',
    description: 'Cinema',
    amount: 80,
    type: 'expense',
    category: 'entertainment',
    date: '2024-01-20T21:45:00.000Z',
    createdAt: '2024-01-20T21:45:00.000Z',
  },
  {
    id: '5',
    accountId: '1',
    description: 'Transporte',
    amount: 150,
    type: 'expense',
    category: 'transport',
    date: '2024-01-25T07:30:00.000Z',
    createdAt: '2024-01-25T07:30:00.000Z',
  },
  {
    id: '6',
    accountId: '1',
    description: 'Restaurante',
    amount: 200,
    type: 'expense',
    category: 'food',
    date: '2024-01-28T12:00:00.000Z',
    createdAt: '2024-01-28T12:00:00.000Z',
  },
  {
    id: '7',
    accountId: '1',
    description: 'Investimento',
    amount: 1000,
    type: 'expense',
    category: 'investment',
    date: '2024-01-31T18:00:00.000Z',
    createdAt: '2024-01-31T18:00:00.000Z',
  },
  {
    id: '8',
    accountId: '1',
    description: 'Compras',
    amount: 300,
    type: 'expense',
    category: 'shopping',
    date: '2024-02-03T15:00:00.000Z',
    createdAt: '2024-02-03T15:00:00.000Z',
  },
  {
    id: '9',
    accountId: '1',
    description: 'Plano de Saúde',
    amount: 400,
    type: 'expense',
    category: 'health',
    date: '2024-02-07T09:00:00.000Z',
    createdAt: '2024-02-07T09:00:00.000Z',
  },
  {
    id: '10',
    accountId: '1',
    description: 'Educação',
    amount: 600,
    type: 'expense',
    category: 'education',
    date: '2024-02-12T14:00:00.000Z',
    createdAt: '2024-02-12T14:00:00.000Z',
  },
];

// Card constants
export const CARD_TYPE = {
  CREDIT: 'credit',
  DEBIT: 'debit',
  BOTH: 'both',
};

// Sample card data
export const cards: Card[] = [
  {
    id: '1',
    accountId: '1',
    name: 'Cartão de Crédito',
    type: 'credit',
    lastFourDigits: '1234',
    expiryDate: '12/25',
    limit: 5000,
    closingDay: 5,
    dueDay: 20,
  },
  {
    id: '2',
    accountId: '1',
    name: 'Cartão de Débito',
    type: 'debit',
    lastFourDigits: '5678',
    expiryDate: '10/26',
  },
];

// Monthly data for charts
export const monthlyData: MonthlyData[] = [
  { month: 'Jan', income: 5000, expense: 3200 },
  { month: 'Feb', income: 5200, expense: 3300 },
  { month: 'Mar', income: 4800, expense: 3100 },
  { month: 'Apr', income: 5100, expense: 3400 },
  { month: 'May', income: 5300, expense: 3200 },
  { month: 'Jun', income: 5500, expense: 3800 },
  { month: 'Jul', income: 5400, expense: 3700 },
  { month: 'Aug', income: 5600, expense: 3500 },
  { month: 'Sep', income: 5800, expense: 3600 },
  { month: 'Oct', income: 6000, expense: 3900 },
  { month: 'Nov', income: 6200, expense: 4100 },
  { month: 'Dec', income: 6500, expense: 4300 },
];
