import { useCallback, useState } from "react";

const ONBOARDING_KEY_PREFIX = "incubadora:onboarding:profile-wizard:";

type OnboardingMarker = "completed" | "dismissed";

const getMarkerKey = (username: string) => `${ONBOARDING_KEY_PREFIX}${username}`;

const readMarker = (username?: string): OnboardingMarker | null => {
  if (!username) return null;
  return localStorage.getItem(getMarkerKey(username)) as OnboardingMarker | null;
};

// Gate de onboarding del perfil (profile-wizard SDD, WU3/D3). Un marcador en
// localStorage, claveado por usuario, decide si se muestra el banner de
// "completa tu perfil" en el dashboard. La ausencia de marcador significa
// "nunca visto" -> se muestra; "dismissed" o "completed" lo ocultan para
// siempre (por navegador + usuario). Es una limitación aceptada (D3): no es
// server-backed, es solo un nudge, el wizard siempre se puede omitir.
export const useOnboardingBanner = (username?: string) => {
  const [marker, setMarker] = useState<OnboardingMarker | null>(() =>
    readMarker(username)
  );

  const setAndPersist = useCallback(
    (value: OnboardingMarker) => {
      if (!username) return;
      localStorage.setItem(getMarkerKey(username), value);
      setMarker(value);
    },
    [username]
  );

  const dismiss = useCallback(() => setAndPersist("dismissed"), [setAndPersist]);
  const markCompleted = useCallback(() => setAndPersist("completed"), [setAndPersist]);

  return {
    // false mientras `username` no esté resuelto (evita un flash antes de
    // que la autenticación resuelva) y false una vez que exista cualquier
    // marcador (dismissed o completed).
    shouldShow: !!username && marker === null,
    dismiss,
    markCompleted,
  };
};
