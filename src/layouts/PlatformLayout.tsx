
import React from 'react';
import { Outlet } from 'react-router-dom';
import { PlatformNav } from '@/components/platform/PlatformNav';
import ChatBot from '@/components/chatbot/ChatBot';

const PlatformLayout: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <PlatformNav />
      <main className="flex-grow container mx-auto px-4 py-8">
        <Outlet />
      </main>
      <footer className="py-4 text-center text-sm text-muted-foreground border-t border-border bg-card">
        © {new Date().getFullYear()} PedLife. Todos os direitos reservados.
      </footer>
      <ChatBot />
    </div>
  );
};

export default PlatformLayout;
