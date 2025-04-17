
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { 
  Home, 
  Wallet, 
  CreditCard, 
  BarChart2, 
  PieChart, 
  Receipt, 
  Settings, 
  LogOut,
  Menu,
  X
} from "lucide-react";
import { useState } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import { Button } from "@/components/ui/button";

const Sidebar = () => {
  const location = useLocation();
  const isMobile = useIsMobile();
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { name: "Dashboard", path: "/", icon: <Home size={20} /> },
    { name: "Contas", path: "/accounts", icon: <Wallet size={20} /> },
    { name: "Cartões", path: "/cards", icon: <CreditCard size={20} /> },
    { name: "Transações", path: "/transactions", icon: <Receipt size={20} /> },
    { name: "Relatórios", path: "/reports", icon: <BarChart2 size={20} /> },
    { name: "Configurações", path: "/settings", icon: <Settings size={20} /> },
  ];

  const toggleSidebar = () => setIsOpen(!isOpen);

  return (
    <>
      {isMobile && (
        <Button
          variant="ghost"
          size="icon"
          className="fixed top-4 left-4 z-50"
          onClick={toggleSidebar}
        >
          <Menu size={24} />
        </Button>
      )}

      <aside
        className={cn(
          "bg-sidebar text-sidebar-foreground flex flex-col h-screen z-40",
          isMobile
            ? `fixed inset-y-0 left-0 w-64 transform transition-transform duration-200 ease-in-out ${
                isOpen ? "translate-x-0" : "-translate-x-full"
              }`
            : "w-64"
        )}
      >
        {isMobile && (
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-4 right-4"
            onClick={toggleSidebar}
          >
            <X size={24} />
          </Button>
        )}

        <div className="flex items-center justify-center h-16 border-b border-sidebar-border">
          <h1 className="text-xl font-bold">FinanControl</h1>
        </div>

        <nav className="flex-1 pt-4 overflow-y-auto">
          <ul className="space-y-1 px-2">
            {navItems.map((item) => (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 rounded-md transition-colors",
                    location.pathname === item.path
                      ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                      : "text-sidebar-foreground hover:bg-sidebar-accent/50"
                  )}
                  onClick={() => isMobile && setIsOpen(false)}
                >
                  {item.icon}
                  <span>{item.name}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="p-4 border-t border-sidebar-border">
          <button className="flex items-center gap-3 text-sidebar-foreground hover:text-sidebar-accent-foreground w-full px-4 py-2 rounded-md transition-colors">
            <LogOut size={20} />
            <span>Sair</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
