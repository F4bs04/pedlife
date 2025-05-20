import React from 'react'; // Added explicit React import
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
import MedicationCategoryPage from "./pages/platform/MedicationCategoryPage";
import MedicationCalculatorPage from "./pages/platform/MedicationCalculatorPage";
import InsulinCalculatorPage from "./pages/platform/InsulinCalculatorPage"; // Nova importação

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
            <Route index element={<CalculatorPage />} /> {/* Mantém a rota raiz da plataforma como Calculadora */}
            <Route path="calculator" element={<Outlet />}>
              <Route index element={<CalculatorPage />} />
              <Route path="insulina" element={<InsulinCalculatorPage />} /> {/* Nova rota para insulina */}
              <Route path=":categorySlug" element={<MedicationCategoryPage />} />
              <Route path=":categorySlug/:medicationSlug" element={<MedicationCalculatorPage />} />
            </Route>
            <Route path="edit-profile" element={<UserEditPage />} />
            {/* A rota /platform/insulin agora será tratada por /platform/calculator/insulina se o link na CalculatorPage usar o slug 'insulina' */}
            {/* Se uma rota direta /platform/insulin for desejada sem passar pela listagem de categorias, ela pode ser adicionada aqui: */}
            {/* <Route path="insulin" element={<InsulinCalculatorPage />} /> */}
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
