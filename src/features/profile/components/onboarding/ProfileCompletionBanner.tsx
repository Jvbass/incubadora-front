import { Link } from "react-router-dom";
import { Sparkles } from "lucide-react";
import { useOnboardingBanner } from "../../hooks/useOnboardingBanner";

interface ProfileCompletionBannerProps {
  username?: string;
}

// Banner de onboarding del dashboard (profile-wizard SDD, WU3, R1).
// Autogestionado: no renderiza nada una vez que el usuario lo descarta,
// completa el wizard, o ya tiene un marcador de una sesión anterior.
const ProfileCompletionBanner = ({ username }: ProfileCompletionBannerProps) => {
  const { shouldShow, dismiss } = useOnboardingBanner(username);

  if (!shouldShow) return null;

  return (
    <div
      data-testid="profile-completion-banner"
      className="p-5 rounded-lg border bg-bg-light dark:bg-bg-dark border-cta-300 dark:border-cta-700 flex flex-col sm:flex-row sm:items-center gap-4"
    >
      <Sparkles size={24} className="text-cta-600 dark:text-cta-300 shrink-0" />
      <div className="flex-1">
        <h3 className="font-semibold text-text-main dark:text-text-light">
          Completa tu perfil
        </h3>
        <p className="text-sm text-text-soft dark:text-gray-400">
          Agrega tu experiencia, stack y redes sociales para que el resto de la
          comunidad te conozca mejor.
        </p>
      </div>
      <div className="flex items-center gap-4 shrink-0">
        <button
          type="button"
          onClick={dismiss}
          data-testid="profile-completion-banner-dismiss"
          className="text-sm font-medium text-text-soft hover:text-text-main dark:hover:text-text-light hover:underline cursor-pointer"
        >
          Ahora no
        </button>
        <Link
          to="/complete-profile"
          data-testid="profile-completion-banner-primary"
          className="flex items-center gap-1 text-sm font-semibold rounded-md py-1.5 px-3 border border-cta-600 text-cta-600 hover:bg-cta-600 hover:text-white transition-colors dark:border-cta-300 dark:text-cta-300"
        >
          Empezar
        </Link>
      </div>
    </div>
  );
};

export default ProfileCompletionBanner;
