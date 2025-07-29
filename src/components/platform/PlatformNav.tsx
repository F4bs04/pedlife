import React from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Bell, UserCircle, Settings, Menu, Moon, Sun, LogOut } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";
import { useIsMobile } from '@/hooks/use-mobile';
import { useTheme } from 'next-themes';
import { useUser } from '@/hooks/use-user';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { forceLogout } from '@/utils/auth-utils';

export const PlatformNav: React.FC = () => {
  const isMobile = useIsMobile();
  const { theme, setTheme } = useTheme();
  const { user, profile, loading } = useUser();
  const navigate = useNavigate();
  const { toast } = useToast();

  const navLinkClasses = ({ isActive }: { isActive: boolean }) =>
    `text-sm font-medium transition-colors hover:text-primary ${
      isActive ? 'text-primary' : 'text-muted-foreground'
    }`;

  const handleLogout = async () => {
    try {
      console.log('Attempting to logout...');
      
      toast({
        title: "Saindo...",
        description: "Desconectando sua sessão.",
      });
      
      // Use the improved force logout function
      await forceLogout();
      
    } catch (error) {
      console.error('Logout error:', error);
      toast({
        variant: "destructive",
        title: "Erro ao sair",
        description: "Forçando logout...",
      });
      
      // Force logout even if there's an error
      await forceLogout();
    }
  };

  const navItems = [
    { to: "/platform/calculator", label: "Calculadora de Medicamentos" },
    { to: "/platform/insulin", label: "Referencial para Insulina" },
    { to: "/platform/protocols", label: "Protocolos" },
  ];

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  // Get user display information
  const getUserDisplayName = () => {
    if (loading) return "Carregando...";
    return profile?.full_name || user?.email?.split('@')[0] || "Usuário";
  };

  const getUserEmail = () => {
    if (loading) return "Carregando...";
    return profile?.email || user?.email || "email@exemplo.com";
  };

  const getUserInitials = () => {
    const name = getUserDisplayName();
    if (name === "Carregando..." || name === "Usuário") return "U";
    
    const parts = name.split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-6">
          <Link to="/platform" className="flex items-center gap-2">
            <img
              src="/lovable-uploads/b16ed0cb-3142-4d88-85ea-a5a2deccbba2.png"
              alt="Pedlife Logo"
              className="h-8 w-auto" // Ajustei para h-8 para manter consistência, pode ser ajustado se necessário
            />
          </Link>
          {!isMobile && (
            <nav className="flex items-center gap-4">
              {navItems.map((item) => (
                <NavLink key={item.to} to={item.to} className={navLinkClasses}>
                  {item.label}
                </NavLink>
              ))}
            </nav>
          )}
        </div>

        <div className="flex items-center gap-4">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={toggleTheme}
            className="text-muted-foreground hover:text-primary"
          >
            {theme === 'dark' ? (
              <Sun className="h-5 w-5" />
            ) : (
              <Moon className="h-5 w-5" />
            )}
            <span className="sr-only">Alternar tema</span>
          </Button>
          
          <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-primary">
            <Bell className="h-5 w-5" />
            <span className="sr-only">Notificações</span>
          </Button>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                <Avatar className="h-8 w-8">
                  <AvatarImage src="/placeholder-user.jpg" alt={getUserDisplayName()} />
                  <AvatarFallback className="bg-primary text-primary-foreground">
                    {getUserInitials()}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">{getUserDisplayName()}</p>
                  <p className="text-xs leading-none text-muted-foreground">
                    {getUserEmail()}
                  </p>
                  {profile?.crm && (
                    <p className="text-xs leading-none text-muted-foreground">
                      CRM: {profile.crm}
                    </p>
                  )}
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link to="/platform/edit-profile" className="flex items-center w-full">
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Configurações</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-red-600 focus:text-red-600">
                <LogOut className="mr-2 h-4 w-4" />
                Sair
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          
          {isMobile && (
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Abrir menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right">
                <nav className="grid gap-6 text-lg font-medium mt-8">
                  <Link to="/platform" className="flex items-center gap-2 mb-4">
                     <img
                       src="/lovable-uploads/b16ed0cb-3142-4d88-85ea-a5a2deccbba2.png"
                       alt="Pedlife Logo"
                       className="h-8 w-auto" // Ajustei para h-8 para manter consistência
                     />
                   </Link>
                  {navItems.map((item) => (
                    <SheetClose key={item.to} asChild>
                      <NavLink
                        to={item.to}
                        className={({ isActive }) =>
                          `flex items-center gap-4 px-2.5 ${
                            isActive ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'
                          }`
                        }
                      >
                        {item.label}
                      </NavLink>
                    </SheetClose>
                  ))}
                </nav>
              </SheetContent>
            </Sheet>
          )}
        </div>
      </div>
    </header>
  );
};
