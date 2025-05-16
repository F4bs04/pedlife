
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import PlatformLayout from "./layouts/PlatformLayout";
import CalculatorPage from "./pages/platform/CalculatorPage";
import UserEditPage from "./pages/platform/UserEditPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          
          <Route path="/platform" element={<PlatformLayout />}>
            <Route index element={<CalculatorPage />} /> {/* Rota padrão para /platform */}
            <Route path="calculator" element={<CalculatorPage />} />
            <Route path="edit-profile" element={<UserEditPage />} />
            {/* Adicione outras rotas da plataforma aqui, por exemplo: */}
            {/* <Route path="insulin" element={<div>Página Insulina</div>} /> */}
            {/* <Route path="tips" element={<div>Página Dicas</div>} /> */}
          </Route>

          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
