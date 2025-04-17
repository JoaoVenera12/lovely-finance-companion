
import { Account, Transaction, Card, CategoryType } from "@/types/models";

// Account Data
export const accounts: Account[] = [
  {
    id: "1",
    name: "Conta Corrente Itaú",
    type: "checking",
    balance: 5230.45,
    createdAt: "2023-01-15",
    color: "#FF9800"
  },
  {
    id: "2",
    name: "Poupança Banco do Brasil",
    type: "savings",
    balance: 12500.00,
    createdAt: "2023-02-20",
    color: "#2196F3"
  },
  {
    id: "3",
    name: "Conta Nubank",
    type: "checking",
    balance: 3450.20,
    createdAt: "2023-03-10",
    color: "#9C27B0"
  },
  {
    id: "4",
    name: "Investimentos XP",
    type: "investment",
    balance: 25000.00,
    createdAt: "2023-01-25",
    color: "#4CAF50"
  }
];

// Categories with colors
export const categoryColors: Record<CategoryType, string> = {
  food: "#FF5252",
  transport: "#FFC107",
  housing: "#3F51B5",
  entertainment: "#9C27B0",
  health: "#E91E63",
  education: "#2196F3",
  shopping: "#F44336",
  salary: "#4CAF50",
  investment: "#009688",
  other: "#607D8B"
};

// Transaction Data
export const transactions: Transaction[] = [
  {
    id: "1",
    accountId: "1",
    description: "Salário",
    amount: 5000.00,
    type: "income",
    category: "salary",
    date: "2023-04-05",
    createdAt: "2023-04-05"
  },
  {
    id: "2",
    accountId: "1",
    description: "Supermercado Extra",
    amount: 350.75,
    type: "expense",
    category: "food",
    date: "2023-04-07",
    createdAt: "2023-04-07"
  },
  {
    id: "3",
    accountId: "1",
    description: "Uber",
    amount: 45.20,
    type: "expense",
    category: "transport",
    date: "2023-04-08",
    createdAt: "2023-04-08"
  },
  {
    id: "4",
    accountId: "2",
    description: "Transferência para poupança",
    amount: 1000.00,
    type: "expense",
    category: "investment",
    date: "2023-04-06",
    createdAt: "2023-04-06"
  },
  {
    id: "5",
    accountId: "2",
    description: "Rendimento poupança",
    amount: 35.50,
    type: "income",
    category: "investment",
    date: "2023-04-30",
    createdAt: "2023-04-30"
  },
  {
    id: "6",
    accountId: "3",
    description: "Cinema",
    amount: 80.00,
    type: "expense",
    category: "entertainment",
    date: "2023-04-15",
    createdAt: "2023-04-15"
  },
  {
    id: "7",
    accountId: "3",
    description: "Farmácia",
    amount: 120.30,
    type: "expense",
    category: "health",
    date: "2023-04-18",
    createdAt: "2023-04-18"
  },
  {
    id: "8",
    accountId: "4",
    description: "Aplicação Fundo Imobiliário",
    amount: 2000.00,
    type: "expense",
    category: "investment",
    date: "2023-04-10",
    createdAt: "2023-04-10"
  },
  {
    id: "9",
    accountId: "4",
    description: "Dividendos",
    amount: 350.00,
    type: "income",
    category: "investment",
    date: "2023-04-25",
    createdAt: "2023-04-25"
  },
  {
    id: "10",
    accountId: "1",
    description: "Aluguel",
    amount: 1200.00,
    type: "expense",
    category: "housing",
    date: "2023-04-10",
    createdAt: "2023-04-10"
  }
];

// Card Data
export const cards: Card[] = [
  {
    id: "1",
    accountId: "1",
    name: "Cartão Itaú Visa",
    type: "credit",
    lastFourDigits: "5678",
    expiryDate: "12/26",
    limit: 8000.00,
    closingDay: 25,
    dueDay: 5
  },
  {
    id: "2",
    accountId: "1",
    name: "Débito Itaú",
    type: "debit",
    lastFourDigits: "5679",
    expiryDate: "12/26"
  },
  {
    id: "3",
    accountId: "3",
    name: "Nubank Mastercard",
    type: "credit",
    lastFourDigits: "9012",
    expiryDate: "10/25",
    limit: 5000.00,
    closingDay: 20,
    dueDay: 1
  },
  {
    id: "4",
    accountId: "2",
    name: "Débito Banco do Brasil",
    type: "debit",
    lastFourDigits: "3456",
    expiryDate: "08/27"
  }
];

// Helper Functions
export const getAccountById = (id: string): Account | undefined => {
  return accounts.find(account => account.id === id);
};

export const getTransactionsByAccountId = (accountId: string): Transaction[] => {
  return transactions.filter(transaction => transaction.accountId === accountId);
};

export const getCardsByAccountId = (accountId: string): Card[] => {
  return cards.filter(card => card.accountId === accountId);
};

export const calculateTotalBalance = (): number => {
  return accounts.reduce((total, account) => total + account.balance, 0);
};

export const calculateMonthlyIncomeExpense = (): { income: number; expense: number } => {
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();
  
  return transactions.reduce(
    (totals, transaction) => {
      const transactionDate = new Date(transaction.date);
      if (
        transactionDate.getMonth() === currentMonth &&
        transactionDate.getFullYear() === currentYear
      ) {
        if (transaction.type === "income") {
          totals.income += transaction.amount;
        } else {
          totals.expense += transaction.amount;
        }
      }
      return totals;
    },
    { income: 0, expense: 0 }
  );
};

export const getCategoryExpenseData = (): Array<{ name: string; value: number }> => {
  const categoryTotals = {} as Record<CategoryType, number>;
  
  transactions.forEach(transaction => {
    if (transaction.type === "expense") {
      if (categoryTotals[transaction.category]) {
        categoryTotals[transaction.category] += transaction.amount;
      } else {
        categoryTotals[transaction.category] = transaction.amount;
      }
    }
  });
  
  return Object.entries(categoryTotals).map(([name, value]) => ({
    name,
    value
  }));
};

export const getMonthlyTransactionData = (): Array<{
  month: string;
  income: number;
  expense: number;
}> => {
  const monthlyData: Record<string, { income: number; expense: number }> = {};
  
  // Initialize with last 6 months
  const now = new Date();
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const monthKey = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
    const monthName = d.toLocaleDateString('default', { month: 'short' });
    monthlyData[monthKey] = { income: 0, expense: 0, month: monthName };
  }
  
  // Fill in with transaction data
  transactions.forEach(transaction => {
    const date = new Date(transaction.date);
    const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    
    if (monthlyData[monthKey]) {
      if (transaction.type === 'income') {
        monthlyData[monthKey].income += transaction.amount;
      } else {
        monthlyData[monthKey].expense += transaction.amount;
      }
    }
  });
  
  // Convert to array format needed for charts
  return Object.entries(monthlyData).map(([key, data]) => ({
    month: data.month || key.split('-')[1],
    income: data.income,
    expense: data.expense
  }));
};
