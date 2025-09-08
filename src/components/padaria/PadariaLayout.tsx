import { useEffect } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { PadariaSidebar } from "@/components/padaria/PadariaSidebar";
import { Bell, User, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface PadariaLayoutProps {
  children: React.ReactNode;
}

export function PadariaLayout({ children }: PadariaLayoutProps) {
  const navigate = useNavigate();
  const { user, isLoading, logout, isAuthenticated } = useAuth();

  // Show loading while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
          <p className="text-muted-foreground">Carregando...</p>
        </div>
      </div>
    );
  }

  // Check if user is authenticated and is a bakery
  if (!isAuthenticated || !user) {
    return <Navigate to="/padaria/login" replace />;
  }

  // Check if user role is bakery
  if (user.role !== 'bakery') {
    // If admin, redirect to admin dashboard
    return <Navigate to="/" replace />;
  }

  const handleLogout = () => {
    logout();
    navigate("/padaria/login");
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen w-full bg-background">
        {/* Header */}
        <header className="h-16 bg-card border-b border-border flex items-center justify-between px-4 sticky top-0 z-50">
          <div className="flex items-center gap-4">
            <SidebarTrigger />
            <div>
              <h1 className="text-xl font-bold text-primary">Portal da Padaria</h1>
              <p className="text-sm text-muted-foreground">
                {user.bakery_name || 'Campanha SINDPAN 2025'}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon">
              <Bell className="w-4 h-4" />
            </Button>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <User className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <div className="px-2 py-1.5 text-sm">
                  <p className="font-medium">{user.bakery_name}</p>
                  <p className="text-muted-foreground">{user.cnpj || user.email}</p>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="w-4 h-4 mr-2" />
                  Sair
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        <div className="flex w-full">
          <PadariaSidebar />
          <main className="flex-1 p-3 lg:p-4">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}