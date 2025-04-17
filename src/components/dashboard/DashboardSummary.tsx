
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  TrendingUp, 
  TrendingDown, 
  CreditCard, 
  Wallet 
} from "lucide-react";
import { calculateMonthlyIncomeExpense, calculateTotalBalance } from "@/data/mockData";

const DashboardSummary = () => {
  const totalBalance = calculateTotalBalance();
  const { income, expense } = calculateMonthlyIncomeExpense();
  
  const summaryItems = [
    {
      title: "Saldo Total",
      value: totalBalance.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }),
      icon: <Wallet className="h-5 w-5 text-muted-foreground" />,
      trend: totalBalance > 0 ? 
        <TrendingUp className="h-4 w-4 text-finance-income" /> : 
        <TrendingDown className="h-4 w-4 text-finance-expense" />,
      color: "bg-primary/10"
    },
    {
      title: "Receitas (Mês)",
      value: income.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }),
      icon: <TrendingUp className="h-5 w-5 text-finance-income" />,
      trend: null,
      color: "bg-finance-income/10"
    },
    {
      title: "Despesas (Mês)",
      value: expense.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }),
      icon: <TrendingDown className="h-5 w-5 text-finance-expense" />,
      trend: null,
      color: "bg-finance-expense/10"
    },
    {
      title: "Balanço (Mês)",
      value: (income - expense).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }),
      icon: <CreditCard className="h-5 w-5 text-muted-foreground" />,
      trend: income - expense > 0 ? 
        <TrendingUp className="h-4 w-4 text-finance-income" /> : 
        <TrendingDown className="h-4 w-4 text-finance-expense" />,
      color: income - expense > 0 ? "bg-finance-income/10" : "bg-finance-expense/10"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {summaryItems.map((item, index) => (
        <Card key={index} className="shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">{item.title}</CardTitle>
            <div className={`${item.color} p-2 rounded-full`}>
              {item.icon}
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{item.value}</div>
            {item.trend && (
              <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                {item.trend} 
                {income - expense > 0 ? "Positivo" : "Negativo"}
              </p>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default DashboardSummary;
