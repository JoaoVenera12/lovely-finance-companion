
import MainLayout from "@/components/layout/MainLayout";
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import ExpenseByCategory from "@/components/dashboard/ExpenseByCategory";
import MonthlyComparison from "@/components/dashboard/MonthlyComparison";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { toast } from "sonner";

const Reports = () => {
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = (format: 'csv' | 'excel') => {
    setIsExporting(true);
    
    // Simulate export process
    setTimeout(() => {
      setIsExporting(false);
      toast.success(`Relatório exportado com sucesso no formato ${format.toUpperCase()}`);
    }, 1500);
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold tracking-tight">Relatórios</h1>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              className="flex items-center gap-1" 
              onClick={() => handleExport('csv')}
              disabled={isExporting}
            >
              <Download className="h-4 w-4" /> 
              Exportar CSV
            </Button>
            <Button 
              variant="outline" 
              className="flex items-center gap-1" 
              onClick={() => handleExport('excel')}
              disabled={isExporting}
            >
              <Download className="h-4 w-4" /> 
              Exportar Excel
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ExpenseByCategory />
          <MonthlyComparison />
        </div>

        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle>Resumo Anual</CardTitle>
            <CardDescription>Visão geral das finanças no ano corrente</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex justify-center items-center py-12">
              <p className="text-muted-foreground">
                Mais relatórios detalhados em breve...
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

export default Reports;
