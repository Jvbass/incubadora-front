import { Suspense, useState } from "react";
import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import { Sidebar } from "./Sidebar";
import { PageSkeleton } from "../ux/Skeleton";

// Layout-route para las páginas autenticadas (rediseño v2, SDD §12.3 R2):
// renderiza <Outlet/> con su propio Suspense, de modo que la barra superior y
// la sidebar permanecen montadas al navegar entre pantallas (solo cambia el
// contenido, sin flicker de página completa).
const AuthenticatedLayout = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-bg-light dark:bg-bg-darker">
      <Navbar
        onToggleMenu={() => setIsMobileMenuOpen((open) => !open)}
        isMobileMenuOpen={isMobileMenuOpen}
      />
      <Sidebar
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
      />
      <main className="pt-14 md:pl-16">
        <div className="px-4 sm:px-6 lg:px-8 py-6">
          <Suspense fallback={<PageSkeleton />}>
            <Outlet />
          </Suspense>
        </div>
      </main>
    </div>
  );
};

export default AuthenticatedLayout;
