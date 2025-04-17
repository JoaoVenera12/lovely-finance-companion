
import MainLayout from "@/components/layout/MainLayout";
import TransactionList from "@/components/transactions/TransactionList";
import { transactions, accounts, categoryColors } from "@/data/mockData";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Plus } from "lucide-react";
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
import { Transaction, TransactionType, CategoryType } from "@/types/models";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const Transactions = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const [transactionsData, setTransactionsData] = useState<Transaction[]>(transactions);
  
  // Form state
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [type, setType] = useState<TransactionType>("expense");
  const [category, setCategory] = useState<CategoryType>("other");
  const [accountId, setAccountId] = useState("");
  const [date, setDate] = useState<Date>(new Date());

  const handleOpenDialog = (transaction?: Transaction) => {
    if (transaction) {
      setEditingTransaction(transaction);
      setDescription(transaction.description);
      setAmount(transaction.amount.toString());
      setType(transaction.type);
      setCategory(transaction.category);
      setAccountId(transaction.accountId);
      setDate(new Date(transaction.date));
    } else {
      setEditingTransaction(null);
      setDescription("");
      setAmount("");
      setType("expense");
      setCategory("other");
      setAccountId(accounts.length > 0 ? accounts[0].id : "");
      setDate(new Date());
    }
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
  };

  const handleSaveTransaction = () => {
    try {
      const parsedAmount = parseFloat(amount.replace(/[^\d,.-]/g, '').replace(',', '.'));
      
      if (!description) {
        throw new Error("A descrição é obrigatória");
      }
      
      if (isNaN(parsedAmount) || parsedAmount <= 0) {
        throw new Error("Valor inválido");
      }
      
      if (!accountId) {
        throw new Error("Selecione uma conta");
      }
      
      if (editingTransaction) {
        // Update existing transaction
        const updatedTransactions = transactionsData.map(trans => 
          trans.id === editingTransaction.id 
            ? { 
                ...trans, 
                description, 
                amount: parsedAmount, 
                type, 
                category, 
                accountId, 
                date: date.toISOString().split('T')[0] 
              }
            : trans
        );
        setTransactionsData(updatedTransactions);
        toast.success("Transação atualizada com sucesso!");
      } else {
        // Create new transaction
        const newTransaction: Transaction = {
          id: (transactionsData.length + 1).toString(),
          description,
          amount: parsedAmount,
          type,
          category,
          accountId,
          date: date.toISOString().split('T')[0],
          createdAt: new Date().toISOString()
        };
        setTransactionsData([...transactionsData, newTransaction]);
        toast.success("Transação criada com sucesso!");
      }
      
      handleCloseDialog();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Erro ao salvar transação");
    }
  };

  const handleDeleteTransaction = (transactionId: string) => {
    const updatedTransactions = transactionsData.filter(trans => trans.id !== transactionId);
    setTransactionsData(updatedTransactions);
    toast.success("Transação excluída com sucesso!");
  };

  const transactionTypeOptions = [
    { value: "income", label: "Receita" },
    { value: "expense", label: "Despesa" }
  ];

  const categoryOptions = [
    { value: "food", label: "Alimentação" },
    { value: "transport", label: "Transporte" },
    { value: "housing", label: "Moradia" },
    { value: "entertainment", label: "Lazer" },
    { value: "health", label: "Saúde" },
    { value: "education", label: "Educação" },
    { value: "shopping", label: "Compras" },
    { value: "salary", label: "Salário" },
    { value: "investment", label: "Investimento" },
    { value: "other", label: "Outros" }
  ];

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold tracking-tight">Transações</h1>
          <Button onClick={() => handleOpenDialog()} className="flex items-center gap-1">
            <Plus className="h-4 w-4" /> Nova Transação
          </Button>
        </div>

        <TransactionList 
          transactions={transactionsData} 
          onEdit={(trans) => handleOpenDialog(trans)} 
          onDelete={handleDeleteTransaction}
        />

        {/* Transaction Form Dialog */}
        <Dialog open={isDialogOpen} onOpenChange={handleCloseDialog}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>
                {editingTransaction ? "Editar Transação" : "Nova Transação"}
              </DialogTitle>
              <DialogDescription>
                {editingTransaction 
                  ? "Edite os detalhes da sua transação" 
                  : "Adicione uma nova transação ao seu gerenciamento financeiro"}
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="description">Descrição</Label>
                <Input
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Ex: Supermercado"
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="amount">Valor</Label>
                <Input
                  id="amount"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0,00"
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="type">Tipo</Label>
                <Select
                  value={type}
                  onValueChange={(value) => setType(value as TransactionType)}
                >
                  <SelectTrigger id="type">
                    <SelectValue placeholder="Selecione o tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    {transactionTypeOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="category">Categoria</Label>
                <Select
                  value={category}
                  onValueChange={(value) => setCategory(value as CategoryType)}
                >
                  <SelectTrigger id="category">
                    <SelectValue placeholder="Selecione a categoria" />
                  </SelectTrigger>
                  <SelectContent>
                    {categoryOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        <div className="flex items-center gap-2">
                          <div 
                            className="w-3 h-3 rounded-full" 
                            style={{ backgroundColor: categoryColors[option.value as CategoryType] }}
                          ></div>
                          {option.label}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="account">Conta</Label>
                <Select
                  value={accountId}
                  onValueChange={(value) => setAccountId(value)}
                >
                  <SelectTrigger id="account">
                    <SelectValue placeholder="Selecione a conta" />
                  </SelectTrigger>
                  <SelectContent>
                    {accounts.map((account) => (
                      <SelectItem key={account.id} value={account.id}>
                        {account.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="date">Data</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !date && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {date ? format(date, "dd/MM/yyyy") : <span>Selecione uma data</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={(date) => date && setDate(date)}
                      initialFocus
                      className="pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={handleCloseDialog}>Cancelar</Button>
              <Button onClick={handleSaveTransaction}>Salvar</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </MainLayout>
  );
};

export default Transactions;
