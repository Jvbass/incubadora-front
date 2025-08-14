import React, { useState } from 'react';
import Navbar from './Navbar';
import { Sidebar } from './Sidebar';
import { MobileMenuButton } from './MenuButon';

// Este componente sirve como plantilla para todas las páginas que requieren autenticación.
const AuthenticatedLayout = ({ children }: { children: React.ReactNode }) => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div>
      <Navbar />
      <MobileMenuButton
        isOpen={isMobileMenuOpen}
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
      />
      <Sidebar
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
      />
      <main className="pt-18 px-8 md:px-20">
        <div>{children}</div>
      </main>
    </div>
  );
};

export default AuthenticatedLayout;