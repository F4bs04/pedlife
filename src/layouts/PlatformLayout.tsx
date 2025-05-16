
import React from 'react';
import { Outlet } from 'react-router-dom';
import { PlatformNav } from '@/components/platform/PlatformNav';

const PlatformLayout: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <PlatformNav />
      <main className="flex-grow container mx-auto px-4 py-8">
        <Outlet />
      </main>
      <footer className="py-4 text-center text-sm text-muted-foreground border-t">
        © {new Date().getFullYear()} PedLife. Todos os direitos reservados.
      </footer>
    </div>
  );
};

export default PlatformLayout;
