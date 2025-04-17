
import { useParams, useNavigate } from "react-router-dom";
import MainLayout from "@/components/layout/MainLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Plus, CreditCard } from "lucide-react";
import TransactionList from "@/components/transactions/TransactionList";
import { useQuery } from '@tanstack/react-query';
import { fetchAccountById, fetchTransactionsByAccountId, fetchCardsByAccountId } from "@/utils/supabaseQueries";

const AccountDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const { data: account, isLoading: accountLoading } = useQuery({
    queryKey: ['account', id],
    queryFn: () => fetchAccountById(id || ""),
    enabled: !!id
  });

  const { data: transactions = [], isLoading: transactionsLoading } = useQuery({
    queryKey: ['transactions', id],
    queryFn: () => fetchTransactionsByAccountId(id || ""),
    enabled: !!id
  });

  const { data: cards = [], isLoading: cardsLoading } = useQuery({
    queryKey: ['cards', id],
    queryFn: () => fetchCardsByAccountId(id || ""),
    enabled: !!id
  });
  
  if (accountLoading) {
    return (
      <MainLayout>
        <div className="flex flex-col items-center justify-center h-[50vh]">
          <p className="text-muted-foreground">Carregando detalhes da conta...</p>
        </div>
      </MainLayout>
    );
  }

  if (!account) {
    return (
      <MainLayout>
        <div className="flex flex-col items-center justify-center h-[80vh]">
          <h1 className="text-2xl font-bold mb-4">Conta não encontrada</h1>
          <Button onClick={() => navigate("/accounts")}>Voltar para Contas</Button>
        </div>
      </MainLayout>
    );
  }

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

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => navigate("/accounts")}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-3xl font-bold tracking-tight">{account.name}</h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle>Informações</CardTitle>
              <CardDescription>Detalhes da conta</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Tipo</h3>
                  <p>{getAccountTypeLabel(account.type)}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Saldo Atual</h3>
                  <p className="text-2xl font-bold">
                    {account.balance.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Data de Criação</h3>
                  <p>{new Date(account.createdAt).toLocaleDateString('pt-BR')}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-sm md:col-span-2">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <div>
                <CardTitle>Cartões Vinculados</CardTitle>
                <CardDescription>Cartões associados a esta conta</CardDescription>
              </div>
              <Button 
                size="sm" 
                className="flex items-center gap-1"
                onClick={() => navigate("/cards")}
              >
                <Plus className="h-4 w-4" /> Novo Cartão
              </Button>
            </CardHeader>
            <CardContent>
              {cardsLoading ? (
                <div className="flex justify-center items-center py-8">
                  <p className="text-muted-foreground">Carregando cartões...</p>
                </div>
              ) : cards.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <CreditCard className="h-12 w-12 text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">Nenhum cartão vinculado a esta conta.</p>
                  <Button 
                    variant="link" 
                    onClick={() => navigate("/cards")} 
                    className="mt-2"
                  >
                    Adicionar um cartão
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {cards.map(card => (
                    <div 
                      key={card.id} 
                      className="relative bg-accent rounded-lg p-4 overflow-hidden"
                      onClick={() => navigate(`/cards`)}
                      style={{ cursor: 'pointer' }}
                    >
                      <div className="flex justify-between items-center mb-6">
                        <CreditCard className="h-5 w-5 text-primary" />
                        <span className="text-sm font-medium">{card.expiryDate}</span>
                      </div>
                      <div className="text-base font-medium mb-1">{card.name}</div>
                      <div className="text-sm font-medium tracking-widest">
                        •••• {card.lastFourDigits}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <Card className="shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div>
              <CardTitle>Transações</CardTitle>
              <CardDescription>Histórico de transações desta conta</CardDescription>
            </div>
            <Button 
              size="sm" 
              className="flex items-center gap-1"
              onClick={() => navigate("/transactions")}
            >
              <Plus className="h-4 w-4" /> Nova Transação
            </Button>
          </CardHeader>
          <CardContent>
            {transactionsLoading ? (
              <div className="flex justify-center items-center py-8">
                <p className="text-muted-foreground">Carregando transações...</p>
              </div>
            ) : (
              <TransactionList transactions={transactions} />
            )}
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

export default AccountDetail;
