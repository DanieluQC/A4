import React, { useState } from 'react';
import { Header } from './Header';
import { Sidebar } from './Sidebar';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header onMenuClick={() => setSidebarOpen(true)} />
      <div className="flex pt-16">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <main className="flex-1 lg:ml-6 p-4">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
      <footer className="bg-white border-t border-gray-200 py-4 lg:ml-64">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-600">
              CORPAC © 2025 - Todos los derechos reservados
            </p>
            <a
              href="#"
              className="text-sm text-primary-600 hover:text-primary-700 transition-colors"
            >
              Política de Privacidad
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};