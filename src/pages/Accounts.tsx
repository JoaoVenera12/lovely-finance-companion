
import MainLayout from "@/components/layout/MainLayout";
import { AccountCard } from "@/components/accounts/AccountCard";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Account, AccountType } from "@/types/models";
import { toast } from "sonner";
import { useQuery } from '@tanstack/react-query';
import { fetchAccounts } from "@/utils/supabaseQueries";
import { supabase } from "@/lib/supabase";

const Accounts = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingAccount, setEditingAccount] = useState<Account | null>(null);
  
  // Use React Query to fetch accounts
  const { data: accounts = [], isLoading, refetch } = useQuery({
    queryKey: ['accounts'],
    queryFn: fetchAccounts
  });
  
  // Form state
  const [accountName, setAccountName] = useState("");
  const [accountType, setAccountType] = useState<AccountType>("checking");
  const [accountBalance, setAccountBalance] = useState("");
  const [accountColor, setAccountColor] = useState("#6E59A5");

  const handleOpenDialog = (account?: Account) => {
    if (account) {
      setEditingAccount(account);
      setAccountName(account.name);
      setAccountType(account.type);
      setAccountBalance(account.balance.toString());
      setAccountColor(account.color || "#6E59A5");
    } else {
      setEditingAccount(null);
      setAccountName("");
      setAccountType("checking");
      setAccountBalance("");
      setAccountColor("#6E59A5");
    }
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
  };

  const handleSaveAccount = async () => {
    try {
      const balance = parseFloat(accountBalance.replace(/[^\d,.-]/g, '').replace(',', '.'));
      
      if (!accountName) {
        throw new Error("O nome da conta é obrigatório");
      }
      
      if (isNaN(balance)) {
        throw new Error("Saldo inválido");
      }
      
      if (editingAccount) {
        // Update existing account in Supabase
        const { error } = await supabase
          .from('accounts')
          .update({
            name: accountName,
            type: accountType,
            balance,
            color: accountColor
          })
          .eq('id', editingAccount.id);
          
        if (error) throw error;
        toast.success("Conta atualizada com sucesso!");
      } else {
        // Create new account in Supabase
        const { error } = await supabase
          .from('accounts')
          .insert({
            name: accountName,
            type: accountType,
            balance,
            color: accountColor,
            user_id: (await supabase.auth.getUser()).data.user?.id || ''
          });
          
        if (error) throw error;
        toast.success("Conta criada com sucesso!");
      }
      
      // Refresh data
      refetch();
      handleCloseDialog();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Erro ao salvar conta");
    }
  };

  const handleDeleteAccount = async (accountId: string) => {
    try {
      const { error } = await supabase
        .from('accounts')
        .delete()
        .eq('id', accountId);
        
      if (error) throw error;
      
      // Refresh data
      refetch();
      toast.success("Conta excluída com sucesso!");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Erro ao excluir conta");
    }
  };

  const accountTypeOptions = [
    { value: "checking", label: "Conta Corrente" },
    { value: "savings", label: "Poupança" },
    { value: "investment", label: "Investimento" }
  ];

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold tracking-tight">Contas</h1>
          <Button onClick={() => handleOpenDialog()} className="flex items-center gap-1">
            <Plus className="h-4 w-4" /> Nova Conta
          </Button>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center py-8">
            <p className="text-muted-foreground">Carregando contas...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {accounts.map((account) => (
              <AccountCard 
                key={account.id} 
                account={account} 
                onEdit={(acc) => handleOpenDialog(acc)} 
                onDelete={handleDeleteAccount}
              />
            ))}
          </div>
        )}

        {/* Account Form Dialog */}
        <Dialog open={isDialogOpen} onOpenChange={handleCloseDialog}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>
                {editingAccount ? "Editar Conta" : "Nova Conta"}
              </DialogTitle>
              <DialogDescription>
                {editingAccount 
                  ? "Edite os detalhes da sua conta" 
                  : "Adicione uma nova conta ao seu gerenciamento financeiro"}
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Nome da Conta</Label>
                <Input
                  id="name"
                  value={accountName}
                  onChange={(e) => setAccountName(e.target.value)}
                  placeholder="Ex: Conta Corrente Itaú"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="type">Tipo de Conta</Label>
                <Select
                  value={accountType}
                  onValueChange={(value) => setAccountType(value as AccountType)}
                >
                  <SelectTrigger id="type">
                    <SelectValue placeholder="Selecione o tipo de conta" />
                  </SelectTrigger>
                  <SelectContent>
                    {accountTypeOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="balance">Saldo Inicial</Label>
                <Input
                  id="balance"
                  value={accountBalance}
                  onChange={(e) => setAccountBalance(e.target.value)}
                  placeholder="0,00"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="color">Cor</Label>
                <div className="flex items-center gap-2">
                  <Input
                    id="color"
                    type="color"
                    value={accountColor}
                    onChange={(e) => setAccountColor(e.target.value)}
                    className="w-12 h-8 p-1"
                  />
                  <span className="text-sm text-muted-foreground">{accountColor}</span>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={handleCloseDialog}>Cancelar</Button>
              <Button onClick={handleSaveAccount}>Salvar</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </MainLayout>
  );
};

export default Accounts;
