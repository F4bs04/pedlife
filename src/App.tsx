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
import InsulinCalculatorPage from "./pages/platform/InsulinCalculatorPage";
import FlowsAndTipsPage from "./pages/platform/FlowsAndTipsPage";
import ProtocolDetailPage from "./pages/platform/ProtocolDetailPage";

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
            <Route index element={<CalculatorPage />} />
            <Route path="calculator" element={<Outlet />}>
              <Route index element={<CalculatorPage />} />
              {/* A rota da insulina foi movida para fora de /calculator */}
              <Route path=":categorySlug" element={<MedicationCategoryPage />} />
              <Route path=":categorySlug/:medicationSlug" element={<MedicationCalculatorPage />} />
            </Route>
            {/* Nova rota para a calculadora de insulina */}
            <Route path="insulin" element={<InsulinCalculatorPage />} />
            <Route path="edit-profile" element={<UserEditPage />} />
            <Route path="tips" element={<FlowsAndTipsPage />} />
            <Route path="protocols/:protocolId" element={<ProtocolDetailPage />} />
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
