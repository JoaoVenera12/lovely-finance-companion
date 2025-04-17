import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";
import { getCategoryExpenseData, fetchCategoryColors } from "@/utils/supabaseQueries";
import { useQuery } from '@tanstack/react-query';

const ExpenseByCategory = () => {
  const { data: categoryExpenses = [] } = useQuery({
    queryKey: ['categoryExpenses'],
    queryFn: getCategoryExpenseData
  });

  const { data: categoryColors = {} } = useQuery({
    queryKey: ['categoryColors'],
    queryFn: fetchCategoryColors
  });

  const data = categoryExpenses;
  
  // Format data for the chart
  const chartData = data.map(item => ({
    name: item.name.charAt(0).toUpperCase() + item.name.slice(1),
    value: Number(item.value.toFixed(2))
  }));

  // Get colors for each category
  const COLORS = chartData.map(item => 
    categoryColors[item.name.toLowerCase() as keyof typeof categoryColors] || "#888"
  );

  const renderCustomizedLabel = ({ 
    cx, 
    cy, 
    midAngle, 
    innerRadius, 
    outerRadius, 
    percent 
  }: any) => {
    if (percent < 0.05) return null;
    
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * Math.PI / 180);
    const y = cy + radius * Math.sin(-midAngle * Math.PI / 180);
  
    return (
      <text 
        x={x} 
        y={y} 
        fill="white" 
        textAnchor="middle" 
        dominantBaseline="central"
        fontSize={12}
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  const formatTooltipValue = (value: number) => {
    return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  };

  return (
    <Card className="shadow-sm">
      <CardHeader>
        <CardTitle>Despesas por Categoria</CardTitle>
        <CardDescription>Distribuição de suas despesas no mês atual</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={renderCustomizedLabel}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={formatTooltipValue} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default ExpenseByCategory;
