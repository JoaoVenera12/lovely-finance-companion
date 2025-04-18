
import { Transaction } from "@/types/models";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Edit, MoreVertical, Trash2 } from "lucide-react";
import { useQuery } from '@tanstack/react-query';
import { fetchAccountById, fetchCategoryColors } from "@/utils/supabaseQueries";
import { defaultCategoryColors } from "@/utils/dataMappers";

interface TransactionListProps {
  transactions: Transaction[];
  onEdit?: (transaction: Transaction) => void;
  onDelete?: (transactionId: string) => void;
}

const TransactionList = ({ transactions, onEdit, onDelete }: TransactionListProps) => {
  // Fetch all category colors
  const { data: categoryColors = defaultCategoryColors } = useQuery({
    queryKey: ['categoryColors'],
    queryFn: fetchCategoryColors
  });

  // Fetch all accounts data at once
  const { data: accounts = {} } = useQuery({
    queryKey: ['accounts'],
    queryFn: async () => {
      const accountIds = [...new Set(transactions.map(t => t.accountId))];
      const accountsData = await Promise.all(accountIds.map(fetchAccountById));
      return accountsData.reduce((acc, account) => {
        if (account) acc[account.id] = account;
        return acc;
      }, {} as Record<string, any>);
    },
    enabled: transactions.length > 0
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const getCategoryLabel = (category: string) => {
    return category.charAt(0).toUpperCase() + category.slice(1);
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Data</TableHead>
          <TableHead>Descrição</TableHead>
          <TableHead>Categoria</TableHead>
          <TableHead>Conta</TableHead>
          <TableHead className="text-right">Valor</TableHead>
          {(onEdit || onDelete) && <TableHead className="w-[60px]"></TableHead>}
        </TableRow>
      </TableHeader>
      <TableBody>
        {transactions.length === 0 ? (
          <TableRow>
            <TableCell colSpan={6} className="text-center h-32 text-muted-foreground">
              Nenhuma transação encontrada
            </TableCell>
          </TableRow>
        ) : (
          transactions.map((transaction) => {
            const isIncome = transaction.type === 'income';
            const categoryColor = categoryColors[transaction.category] || '#888';
            
            const account = accounts[transaction.accountId];
            
            return (
              <TableRow key={transaction.id}>
                <TableCell>{formatDate(transaction.date)}</TableCell>
                <TableCell>{transaction.description}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: categoryColor }}
                    ></div>
                    {getCategoryLabel(transaction.category)}
                  </div>
                </TableCell>
                <TableCell>{account?.name || 'Carregando...'}</TableCell>
                <TableCell className={`text-right font-medium ${isIncome ? 'text-finance-income' : 'text-finance-expense'}`}>
                  {isIncome ? '+' : '-'} {transaction.amount.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                </TableCell>
                {(onEdit || onDelete) && (
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        {onEdit && (
                          <DropdownMenuItem onClick={() => onEdit(transaction)}>
                            <Edit className="h-4 w-4 mr-2" />
                            Editar
                          </DropdownMenuItem>
                        )}
                        {onDelete && (
                          <DropdownMenuItem 
                            onClick={() => onDelete(transaction.id)}
                            className="text-destructive focus:text-destructive"
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Excluir
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                )}
              </TableRow>
            );
          })
        )}
      </TableBody>
    </Table>
  );
};

export default TransactionList;
