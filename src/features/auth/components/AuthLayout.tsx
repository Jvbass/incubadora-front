import type { ReactNode } from "react";
import { Link } from "react-router-dom";

interface AuthLayoutProps {
  title: string;
  subtitle?: string;
  children: ReactNode;
}

// Layout split-screen para login/registro/verificación (SDD §12.3 R3):
// panel visual con cohete a la izquierda (solo lg+), formulario a la derecha.
// En móvil: columna única con el logo arriba.
const AuthLayout = ({ title, subtitle, children }: AuthLayoutProps) => {
  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-bg-light dark:bg-bg-darker">
      {/* Panel visual (solo escritorio) */}
      <div className="hidden lg:flex relative flex-col justify-between p-12 overflow-hidden bg-gradient-to-br from-[#131519] via-[#1d2025] to-[#7e2616]">
        {/* halos decorativos */}
        <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-cta-600/20 blur-3xl" />
        <div className="absolute -bottom-32 -right-16 w-[28rem] h-[28rem] rounded-full bg-cta-900/30 blur-3xl" />

        <Link to="/" className="relative flex items-center gap-3 w-fit">
          <img
            src="/images/logo-main.png"
            aria-hidden="true"
            className="w-10 h-10 rounded-full bg-gray-200 p-0.5"
          />
          <span className="text-xl font-bold tracking-tight text-text-light">
            incubadora<span className="text-cta-300">.dev</span>
          </span>
        </Link>

        <div className="relative flex flex-col items-center text-center gap-8">
          <img
            src="/images/cohete-auth.png"
            aria-hidden="true"
            className="w-72 max-w-[60%] drop-shadow-[0_0_45px_rgba(192,57,43,0.35)]"
          />
          <div className="space-y-3 max-w-md">
            <h1 className="text-3xl font-bold text-text-light">
              Construye tu reputación como developer
            </h1>
            <p className="text-text-soft">
              Publica proyectos, recibe feedback de la comunidad y crece con
              mentorías de desarrolladores con experiencia.
            </p>
          </div>
        </div>

        <p className="relative text-sm text-text-soft">
          Proyectos · Feedback · Kudos · Mentorías
        </p>
      </div>

      {/* Columna del formulario */}
      <div className="flex flex-col items-center justify-center px-4 sm:px-8 py-10">
        <div className="w-full max-w-md space-y-6">
          {/* Logo en móvil/tablet (el panel visual está oculto) */}
          <Link
            to="/"
            className="lg:hidden flex items-center justify-center gap-2"
          >
            <img
              src="/images/logo-main.png"
              aria-hidden="true"
              className="w-9 h-9 rounded-full bg-gray-200 p-0.5"
            />
            <span className="font-bold tracking-tight text-text-main dark:text-text-light">
              incubadora<span className="text-cta-600 dark:text-cta-300">.dev</span>
            </span>
          </Link>

          <div className="text-center space-y-1.5">
            <h2 className="text-2xl font-bold text-text-main dark:text-text-light">
              {title}
            </h2>
            {subtitle && <p className="text-sm text-text-soft">{subtitle}</p>}
          </div>

          {children}
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
