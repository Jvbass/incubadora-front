// src/components/layout/AuthenticatedLayout.tsx

import React from 'react';
import Navbar from './Navbar';

// Este componente sirve como plantilla para todas las páginas que requieren autenticación.
const AuthenticatedLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div>
      <Navbar />
      <main>
        <div>
          {children}
        </div>
      </main>
    </div>
  );
};

export default AuthenticatedLayout;