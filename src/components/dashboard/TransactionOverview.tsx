
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Plus } from "lucide-react";
import { Transaction } from "@/types/models";
import { useQuery } from '@tanstack/react-query';
import { fetchAllTransactions, fetchAccountById, fetchCategoryColors } from "@/utils/supabaseQueries";
import { defaultCategoryColors } from "@/utils/dataMappers";

const TransactionOverview = () => {
  const navigate = useNavigate();
  
  // Fetch all transactions
  const { data: transactions = [], isLoading: transactionsLoading } = useQuery({
    queryKey: ['recentTransactions'],
    queryFn: fetchAllTransactions
  });

  // Get the 5 most recent transactions
  const recentTransactions = transactions
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);

  // Fetch category colors
  const { data: categoryColors = defaultCategoryColors } = useQuery({
    queryKey: ['categoryColors'],
    queryFn: fetchCategoryColors
  });

  // Fetch all accounts data at once
  const { data: accounts = {} } = useQuery({
    queryKey: ['accounts'],
    queryFn: async () => {
      if (recentTransactions.length === 0) return {};
      const accountIds = [...new Set(recentTransactions.map(t => t.accountId))];
      const accountsData = await Promise.all(accountIds.map(fetchAccountById));
      return accountsData.reduce((acc, account) => {
        if (account) acc[account.id] = account;
        return acc;
      }, {} as Record<string, any>);
    }
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const renderTransactionItem = (transaction: Transaction) => {
    const isIncome = transaction.type === 'income';
    const categoryColor = categoryColors[transaction.category] || '#888';
    const account = accounts[transaction.accountId];

    return (
      <div key={transaction.id} className="transaction-item py-3 px-4 flex items-center justify-between border-b last:border-0">
        <div className="flex items-center gap-4">
          <div 
            className="w-10 h-10 rounded-full flex items-center justify-center"
            style={{ backgroundColor: `${categoryColor}20` }}
          >
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: categoryColor }}></div>
          </div>
          <div>
            <p className="font-medium">{transaction.description}</p>
            <p className="text-sm text-muted-foreground">
              {account?.name || 'Carregando...'} • {formatDate(transaction.date)}
            </p>
          </div>
        </div>
        <div className={`font-medium ${isIncome ? 'text-finance-income' : 'text-finance-expense'}`}>
          {isIncome ? '+ ' : '- '}
          {transaction.amount.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
        </div>
      </div>
    );
  };

  return (
    <Card className="shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div>
          <CardTitle>Transações Recentes</CardTitle>
          <CardDescription>As últimas 5 transações registradas</CardDescription>
        </div>
        <Button 
          size="sm" 
          className="flex items-center gap-1"
          onClick={() => navigate("/transactions")}
        >
          <Plus className="h-4 w-4" /> Nova Transação
        </Button>
      </CardHeader>
      <CardContent>
        {transactionsLoading ? (
          <div className="flex justify-center items-center py-8">
            <p className="text-muted-foreground">Carregando transações...</p>
          </div>
        ) : recentTransactions.length === 0 ? (
          <div className="flex justify-center items-center py-8">
            <p className="text-muted-foreground">Nenhuma transação encontrada</p>
          </div>
        ) : (
          <div className="space-y-0">
            {recentTransactions.map(renderTransactionItem)}
          </div>
        )}
        <Button
          variant="link"
          className="mt-4 w-full"
          onClick={() => navigate("/transactions")}
        >
          Ver todas as transações
        </Button>
      </CardContent>
    </Card>
  );
};

export default TransactionOverview;
