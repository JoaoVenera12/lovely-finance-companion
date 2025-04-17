
import MainLayout from "@/components/layout/MainLayout";
import { useState } from "react";
import { cards, accounts } from "@/data/mockData";
import { Button } from "@/components/ui/button";
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
import { Card as CardType, CardType as CardTypeEnum } from "@/types/models";
import { 
  CreditCard, 
  Trash2, 
  Edit, 
  Plus 
} from "lucide-react";
import { toast } from "sonner";

const Cards = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCard, setEditingCard] = useState<CardType | null>(null);
  const [cardsData, setCardsData] = useState<CardType[]>(cards);
  
  // Form state
  const [cardName, setCardName] = useState("");
  const [cardType, setCardType] = useState<CardTypeEnum>("credit");
  const [lastFourDigits, setLastFourDigits] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [accountId, setAccountId] = useState("");
  const [limit, setLimit] = useState("");
  const [closingDay, setClosingDay] = useState("");
  const [dueDay, setDueDay] = useState("");

  const handleOpenDialog = (card?: CardType) => {
    if (card) {
      setEditingCard(card);
      setCardName(card.name);
      setCardType(card.type);
      setLastFourDigits(card.lastFourDigits);
      setExpiryDate(card.expiryDate);
      setAccountId(card.accountId);
      setLimit(card.limit?.toString() || "");
      setClosingDay(card.closingDay?.toString() || "");
      setDueDay(card.dueDay?.toString() || "");
    } else {
      setEditingCard(null);
      setCardName("");
      setCardType("credit");
      setLastFourDigits("");
      setExpiryDate("");
      setAccountId(accounts.length > 0 ? accounts[0].id : "");
      setLimit("");
      setClosingDay("");
      setDueDay("");
    }
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
  };

  const handleSaveCard = () => {
    try {
      if (!cardName) {
        throw new Error("O nome do cartão é obrigatório");
      }
      
      if (!accountId) {
        throw new Error("Selecione uma conta");
      }
      
      if (!lastFourDigits || !/^\d{4}$/.test(lastFourDigits)) {
        throw new Error("Informe os últimos 4 dígitos válidos");
      }
      
      if (!expiryDate || !/^\d{2}\/\d{2}$/.test(expiryDate)) {
        throw new Error("Informe uma data de validade válida (MM/AA)");
      }
      
      const parsedLimit = limit ? parseFloat(limit.replace(/[^\d,.-]/g, '').replace(',', '.')) : undefined;
      const parsedClosingDay = closingDay ? parseInt(closingDay) : undefined;
      const parsedDueDay = dueDay ? parseInt(dueDay) : undefined;
      
      if (cardType === "credit") {
        if (!parsedLimit || parsedLimit <= 0) {
          throw new Error("Informe um limite válido para cartão de crédito");
        }
        
        if (!parsedClosingDay || parsedClosingDay < 1 || parsedClosingDay > 31) {
          throw new Error("Informe um dia de fechamento válido (1-31)");
        }
        
        if (!parsedDueDay || parsedDueDay < 1 || parsedDueDay > 31) {
          throw new Error("Informe um dia de vencimento válido (1-31)");
        }
      }
      
      if (editingCard) {
        // Update existing card
        const updatedCards = cardsData.map(c => 
          c.id === editingCard.id 
            ? { 
                ...c, 
                name: cardName, 
                type: cardType, 
                lastFourDigits, 
                expiryDate, 
                accountId,
                limit: parsedLimit,
                closingDay: parsedClosingDay,
                dueDay: parsedDueDay
              }
            : c
        );
        setCardsData(updatedCards);
        toast.success("Cartão atualizado com sucesso!");
      } else {
        // Create new card
        const newCard: CardType = {
          id: (cardsData.length + 1).toString(),
          name: cardName,
          type: cardType,
          lastFourDigits,
          expiryDate,
          accountId,
          limit: parsedLimit,
          closingDay: parsedClosingDay,
          dueDay: parsedDueDay
        };
        setCardsData([...cardsData, newCard]);
        toast.success("Cartão criado com sucesso!");
      }
      
      handleCloseDialog();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Erro ao salvar cartão");
    }
  };

  const handleDeleteCard = (cardId: string) => {
    const updatedCards = cardsData.filter(c => c.id !== cardId);
    setCardsData(updatedCards);
    toast.success("Cartão excluído com sucesso!");
  };

  const getAccountById = (id: string) => {
    return accounts.find(account => account.id === id);
  };

  const getCardTypeLabel = (type: CardTypeEnum) => {
    switch(type) {
      case "credit": return "Crédito";
      case "debit": return "Débito";
      case "both": return "Crédito e Débito";
      default: return type;
    }
  };

  const cardTypeOptions = [
    { value: "credit", label: "Crédito" },
    { value: "debit", label: "Débito" },
    { value: "both", label: "Crédito e Débito" }
  ];

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold tracking-tight">Cartões</h1>
          <Button onClick={() => handleOpenDialog()} className="flex items-center gap-1">
            <Plus className="h-4 w-4" /> Novo Cartão
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {cardsData.map((card) => {
            const account = getAccountById(card.accountId);
            const isCredit = card.type === "credit" || card.type === "both";
            const isDebit = card.type === "debit" || card.type === "both";
            
            return (
              <div key={card.id} className="account-card group">
                <div className="flex items-start justify-between">
                  <div className="flex flex-col gap-1">
                    <h3 className="font-semibold">{card.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {account?.name} • {getCardTypeLabel(card.type)}
                    </p>
                  </div>
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8" 
                      onClick={() => handleOpenDialog(card)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8 text-destructive hover:text-destructive/90" 
                      onClick={() => handleDeleteCard(card.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                
                <div className="relative mt-4 bg-primary/10 rounded-lg p-4 overflow-hidden">
                  <div className="flex justify-between items-center mb-6">
                    <CreditCard className="h-6 w-6 text-primary" />
                    <span className="text-sm font-medium">{card.expiryDate}</span>
                  </div>
                  <div className="text-lg font-medium tracking-widest">
                    •••• •••• •••• {card.lastFourDigits}
                  </div>
                  
                  {isCredit && card.limit && (
                    <div className="mt-4 flex flex-col">
                      <span className="text-xs text-muted-foreground">Limite:</span>
                      <span className="font-medium">
                        {parseFloat(card.limit.toString()).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                      </span>
                    </div>
                  )}
                  
                  {isCredit && card.closingDay && card.dueDay && (
                    <div className="mt-2 flex flex-col">
                      <span className="text-xs text-muted-foreground">Fechamento/Vencimento:</span>
                      <span className="font-medium">Dia {card.closingDay} / Dia {card.dueDay}</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Card Form Dialog */}
        <Dialog open={isDialogOpen} onOpenChange={handleCloseDialog}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>
                {editingCard ? "Editar Cartão" : "Novo Cartão"}
              </DialogTitle>
              <DialogDescription>
                {editingCard 
                  ? "Edite os detalhes do seu cartão" 
                  : "Adicione um novo cartão ao seu gerenciamento financeiro"}
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Nome do Cartão</Label>
                <Input
                  id="name"
                  value={cardName}
                  onChange={(e) => setCardName(e.target.value)}
                  placeholder="Ex: Cartão Nubank"
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="type">Tipo de Cartão</Label>
                <Select
                  value={cardType}
                  onValueChange={(value) => setCardType(value as CardTypeEnum)}
                >
                  <SelectTrigger id="type">
                    <SelectValue placeholder="Selecione o tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    {cardTypeOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="account">Conta Vinculada</Label>
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
              
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="lastFourDigits">Últimos 4 Dígitos</Label>
                  <Input
                    id="lastFourDigits"
                    value={lastFourDigits}
                    onChange={(e) => setLastFourDigits(e.target.value)}
                    placeholder="1234"
                    maxLength={4}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="expiryDate">Validade</Label>
                  <Input
                    id="expiryDate"
                    value={expiryDate}
                    onChange={(e) => setExpiryDate(e.target.value)}
                    placeholder="MM/AA"
                  />
                </div>
              </div>
              
              {(cardType === "credit" || cardType === "both") && (
                <>
                  <div className="grid gap-2">
                    <Label htmlFor="limit">Limite</Label>
                    <Input
                      id="limit"
                      value={limit}
                      onChange={(e) => setLimit(e.target.value)}
                      placeholder="0,00"
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="closingDay">Dia de Fechamento</Label>
                      <Input
                        id="closingDay"
                        value={closingDay}
                        onChange={(e) => setClosingDay(e.target.value)}
                        placeholder="1-31"
                        type="number"
                        min="1"
                        max="31"
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="dueDay">Dia de Vencimento</Label>
                      <Input
                        id="dueDay"
                        value={dueDay}
                        onChange={(e) => setDueDay(e.target.value)}
                        placeholder="1-31"
                        type="number"
                        min="1"
                        max="31"
                      />
                    </div>
                  </div>
                </>
              )}
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={handleCloseDialog}>Cancelar</Button>
              <Button onClick={handleSaveCard}>Salvar</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </MainLayout>
  );
};

export default Cards;
