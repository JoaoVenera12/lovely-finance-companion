import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { getMonthlyTransactionData } from "@/utils/supabaseQueries";
import { useQuery } from '@tanstack/react-query';

const MonthlyComparison = () => {
  const { data = [] } = useQuery({
    queryKey: ['monthlyTransactionData'],
    queryFn: getMonthlyTransactionData
  });

  const formatTooltipValue = (value: number) => {
    return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  };

  return (
    <Card className="shadow-sm">
      <CardHeader>
        <CardTitle>Comparativo Mensal</CardTitle>
        <CardDescription>Evolução de receitas e despesas nos últimos 6 meses</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart 
              data={data}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip formatter={formatTooltipValue} />
              <Legend />
              <Bar dataKey="income" name="Receitas" fill="#4CAF50" />
              <Bar dataKey="expense" name="Despesas" fill="#FF5252" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default MonthlyComparison;
