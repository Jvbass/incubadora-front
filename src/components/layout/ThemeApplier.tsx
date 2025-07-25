import { useEffect } from "react";
import { useThemeStore } from "../../stores/themeStore";

export const ThemeApplier = () => {
  const { theme } = useThemeStore();

  useEffect(() => {
    const root = window.document.documentElement;
    const isDark =
      theme === "dark" ||
      (theme === "system" &&
        window.matchMedia("(prefers-color-scheme: dark)").matches);

    root.classList.toggle("dark", isDark);

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = () => {
      if (theme === "system") {
        root.classList.toggle("dark", mediaQuery.matches);
      }
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, [theme]);

  // No renderiza nada
  return null;
};
