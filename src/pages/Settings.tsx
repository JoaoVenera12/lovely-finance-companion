import MainLayout from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

// Interface for user preferences
interface UserPreferences {
  darkMode: boolean;
  notifications: boolean;
  currency: string;
}

const Settings = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [currency, setCurrency] = useState("BRL");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  // Load user data and preferences on component mount
  useEffect(() => {
    const loadUserData = async () => {
      try {
        // Load preferences from localStorage
        const savedPreferences = localStorage.getItem('userPreferences');
        if (savedPreferences) {
          const preferences = JSON.parse(savedPreferences) as UserPreferences;
          setDarkMode(preferences.darkMode);
          setNotifications(preferences.notifications);
          setCurrency(preferences.currency);
        }
        
        // Load user profile from Supabase
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          setEmail(user.email || "");
          
          // Get user profile data from profiles table
          const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .single();
          
          if (data && !error) {
            setName(data.full_name || "");
          }
        }
      } catch (error) {
        console.error("Error loading user data:", error);
      }
    };
    
    loadUserData();
  }, []);

  const handleSaveProfile = async () => {
    try {
      setLoading(true);
      
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error("Usuário não autenticado");
      }
      
      // Update profile in Supabase (only full_name)
      const { error } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          full_name: name,
          updated_at: new Date().toISOString(),
        });
      
      if (error) throw error;
      
      toast.success("Perfil atualizado com sucesso!");
    } catch (error) {
      toast.error("Erro ao atualizar perfil");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSavePreferences = async () => {
    try {
      setLoading(true);
      
      // Save preferences to localStorage
      const preferences: UserPreferences = {
        darkMode,
        notifications,
        currency
      };
      
      localStorage.setItem('userPreferences', JSON.stringify(preferences));
      
      // Apply dark mode if needed
      document.documentElement.classList.toggle('dark', darkMode);
      
      toast.success("Preferências atualizadas com sucesso!");
    } catch (error) {
      toast.error("Erro ao atualizar preferências");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Configurações</h1>
          <p className="text-muted-foreground">
            Gerencie suas preferências e configurações da conta.
          </p>
        </div>

        <Tabs defaultValue="account" className="space-y-4">
          <TabsList>
            <TabsTrigger value="account">Conta</TabsTrigger>
            <TabsTrigger value="preferences">Preferências</TabsTrigger>
            <TabsTrigger value="notifications">Notificações</TabsTrigger>
          </TabsList>
          
          {/* Account Settings */}
          <TabsContent value="account" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Informações do Perfil</CardTitle>
                <CardDescription>
                  Atualize suas informações pessoais.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nome</Label>
                  <Input 
                    id="name" 
                    value={name} 
                    onChange={(e) => setName(e.target.value)} 
                    placeholder="Seu nome completo" 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input 
                    id="email" 
                    value={email} 
                    disabled 
                    placeholder="seu.email@exemplo.com" 
                  />
                  <p className="text-sm text-muted-foreground">
                    O email não pode ser alterado.
                  </p>
                </div>
                <Button 
                  onClick={handleSaveProfile} 
                  disabled={loading}
                >
                  {loading ? "Salvando..." : "Salvar Alterações"}
                </Button>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Segurança</CardTitle>
                <CardDescription>
                  Gerencie sua senha e segurança da conta.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button variant="outline">Alterar Senha</Button>
                <Button variant="outline" className="ml-2">Ativar Autenticação em Dois Fatores</Button>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Preferences Settings */}
          <TabsContent value="preferences" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Aparência</CardTitle>
                <CardDescription>
                  Personalize a aparência do aplicativo.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="dark-mode">Modo Escuro</Label>
                    <p className="text-sm text-muted-foreground">
                      Ative o modo escuro para reduzir o cansaço visual.
                    </p>
                  </div>
                  <Switch 
                    id="dark-mode" 
                    checked={darkMode} 
                    onCheckedChange={setDarkMode} 
                  />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Moeda</CardTitle>
                <CardDescription>
                  Configure a moeda padrão para exibição de valores.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="currency">Moeda Padrão</Label>
                  <select 
                    id="currency"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    value={currency}
                    onChange={(e) => setCurrency(e.target.value)}
                  >
                    <option value="BRL">Real Brasileiro (R$)</option>
                    <option value="USD">Dólar Americano ($)</option>
                    <option value="EUR">Euro (€)</option>
                    <option value="GBP">Libra Esterlina (£)</option>
                  </select>
                </div>
                <Button 
                  onClick={handleSavePreferences} 
                  disabled={loading}
                >
                  {loading ? "Salvando..." : "Salvar Preferências"}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Notifications Settings */}
          <TabsContent value="notifications" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Notificações</CardTitle>
                <CardDescription>
                  Configure como e quando deseja receber notificações.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="notifications">Ativar Notificações</Label>
                    <p className="text-sm text-muted-foreground">
                      Receba alertas sobre transações, faturas e atualizações.
                    </p>
                  </div>
                  <Switch 
                    id="notifications" 
                    checked={notifications} 
                    onCheckedChange={setNotifications} 
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="email-notifications">Notificações por Email</Label>
                    <p className="text-sm text-muted-foreground">
                      Receba notificações importantes por email.
                    </p>
                  </div>
                  <Switch 
                    id="email-notifications" 
                    checked={notifications} 
                    onCheckedChange={setNotifications} 
                    disabled={!notifications}
                  />
                </div>
                
                <Button 
                  onClick={handleSavePreferences} 
                  disabled={loading}
                >
                  {loading ? "Salvando..." : "Salvar Configurações"}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default Settings;
