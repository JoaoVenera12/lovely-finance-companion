
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { AccountCard } from "@/components/accounts/AccountCard";
import { useQuery } from '@tanstack/react-query';
import { fetchAccounts } from "@/utils/supabaseQueries";
import { mapDbAccountToAccount } from "@/utils/dataMappers";

const AccountOverview = () => {
  const navigate = useNavigate();
  
  const { data: accounts = [], isLoading } = useQuery({
    queryKey: ['accounts'],
    queryFn: fetchAccounts
  });

  const visibleAccounts = accounts.slice(0, 3);

  return (
    <Card className="shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div>
          <CardTitle>Minhas Contas</CardTitle>
          <CardDescription>Visualize o saldo de suas contas</CardDescription>
        </div>
        <Button 
          size="sm" 
          className="flex items-center gap-1"
          onClick={() => navigate("/accounts")}
        >
          <Plus className="h-4 w-4" /> Nova Conta
        </Button>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center items-center py-8">
            <p className="text-muted-foreground">Carregando contas...</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {visibleAccounts.map((account) => (
                <AccountCard key={account.id} account={account} />
              ))}
            </div>
            {accounts.length > 3 && (
              <Button
                variant="link"
                className="mt-4 w-full"
                onClick={() => navigate("/accounts")}
              >
                Ver todas as {accounts.length} contas
              </Button>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default AccountOverview;
