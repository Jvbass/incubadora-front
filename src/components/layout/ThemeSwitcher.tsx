import { Moon, Sun, Laptop } from "lucide-react";
import { useThemeStore } from "../../stores/themeStore";

const icons = {
  light: <Sun size={24} className="text-gray-800 dark:text-ui-off-white" />,
  dark: (
    <Moon size={24} className=" dark:text-amber-50 dark:text-ui-off-white" />
  ),
  system: (
    <Laptop
      size={24}
      className="text-gray-800  dark:text-amber-50 dark:text-ui-off-white"
    />
  ),
};

/**
 * Este componente ahora solo se encarga de la UI y de cambiar el estado.
 * La lógica de aplicar el tema ha sido movida a ThemeApplier.tsx.
 */
export const ThemeSwitcher = () => {
  const { theme, setTheme } = useThemeStore();

  const toggleTheme = () => {
    const sequence: ("system" | "light" | "dark")[] = [
      "system",
      "light",
      "dark",
    ];
    const currentIndex = sequence.indexOf(theme);
    const nextTheme = sequence[(currentIndex + 1) % sequence.length];
    setTheme(nextTheme);
  };

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-full  hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
      aria-label={`Cambiar a tema ${theme === "light" ? "oscuro" : "claro"}`}
    >
      {icons[theme]}
    </button>
  );
};
