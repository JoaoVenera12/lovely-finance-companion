
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { transactions, getAccountById, categoryColors } from "@/data/mockData";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Plus } from "lucide-react";
import { Transaction } from "@/types/models";

const TransactionOverview = () => {
  const navigate = useNavigate();
  const recentTransactions = transactions
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const renderTransactionItem = (transaction: Transaction) => {
    const account = getAccountById(transaction.accountId);
    const isIncome = transaction.type === 'income';
    const categoryColor = categoryColors[transaction.category] || '#888';

    return (
      <div key={transaction.id} className="transaction-item">
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
              {account?.name} • {formatDate(transaction.date)}
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
        <div className="space-y-0">
          {recentTransactions.map(renderTransactionItem)}
        </div>
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
