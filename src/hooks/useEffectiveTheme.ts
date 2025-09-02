import { useState, useEffect } from "react";
import { useThemeStore } from "../stores/themeStore";

type EffectiveTheme = "light" | "dark";

/**
 * Hook que devuelve el tema efectivo ('light' or 'dark'),
 * resolviendo el estado 'system' basado en las preferencias del sistema operativo.
 * @returns {EffectiveTheme} El tema actual como 'light' o 'dark'.
 */
export const useEffectiveTheme = (): EffectiveTheme => {
  const { theme } = useThemeStore();
  const [effectiveTheme, setEffectiveTheme] = useState<EffectiveTheme>("light");

  useEffect(() => {
    // Media query para detectar el tema del sistema operativo.
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

    // Función para determinar y establecer el tema.
    const checkTheme = () => {
      const isSystemDark = mediaQuery.matches;
      if (theme === "dark" || (theme === "system" && isSystemDark)) {
        setEffectiveTheme("dark");
      } else {
        setEffectiveTheme("light");
      }
    };

    checkTheme(); // Comprobar el tema al cargar el componente y cuando 'theme' cambia.

    // Escuchar cambios en las preferencias del sistema operativo.
    mediaQuery.addEventListener("change", checkTheme);

    // Limpiar el listener al desmontar el componente.
    return () => mediaQuery.removeEventListener("change", checkTheme);
  }, [theme]); // El efecto se ejecuta cada vez que el estado 'theme' del store cambia.

  return effectiveTheme;
};
