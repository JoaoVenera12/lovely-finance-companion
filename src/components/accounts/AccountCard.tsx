
import { Account } from "@/types/models";
import { CreditCard, Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface AccountCardProps {
  account: Account;
  onEdit?: (account: Account) => void;
  onDelete?: (accountId: string) => void;
}

export const AccountCard = ({ account, onEdit, onDelete }: AccountCardProps) => {
  const navigate = useNavigate();
  
  const getAccountTypeLabel = (type: string) => {
    switch (type) {
      case 'checking':
        return 'Conta Corrente';
      case 'savings':
        return 'Poupança';
      case 'investment':
        return 'Investimento';
      default:
        return type;
    }
  };

  const handleClick = () => {
    navigate(`/accounts/${account.id}`);
  };

  return (
    <div 
      className="account-card cursor-pointer" 
      style={{ borderLeft: `4px solid ${account.color || '#6E59A5'}` }}
      onClick={handleClick}
    >
      <div className="flex items-center justify-between">
        <h3 className="font-semibold">{account.name}</h3>
        {(onEdit || onDelete) && (
          <div className="flex gap-1">
            {onEdit && (
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8" 
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit(account);
                }}
              >
                <Edit className="h-4 w-4" />
              </Button>
            )}
            {onDelete && (
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8 text-destructive hover:text-destructive/90" 
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(account.id);
                }}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
          </div>
        )}
      </div>
      <div className="flex items-center text-sm text-muted-foreground">
        <CreditCard className="h-3 w-3 mr-1" />
        <span>{getAccountTypeLabel(account.type)}</span>
      </div>
      <div className="mt-2">
        <div className="text-xl font-bold">
          {account.balance.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
        </div>
      </div>
    </div>
  );
};
