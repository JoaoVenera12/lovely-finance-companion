
import MainLayout from "@/components/layout/MainLayout";
import DashboardSummary from "@/components/dashboard/DashboardSummary";
import AccountOverview from "@/components/dashboard/AccountOverview";
import TransactionOverview from "@/components/dashboard/TransactionOverview";
import ExpenseByCategory from "@/components/dashboard/ExpenseByCategory";
import MonthlyComparison from "@/components/dashboard/MonthlyComparison";

const Dashboard = () => {
  return (
    <MainLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        
        <DashboardSummary />
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <AccountOverview />
          <TransactionOverview />
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ExpenseByCategory />
          <MonthlyComparison />
        </div>
      </div>
    </MainLayout>
  );
};

export default Dashboard;
