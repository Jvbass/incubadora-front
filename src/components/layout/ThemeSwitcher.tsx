import { Moon, Sun, Laptop } from "lucide-react";
import { useThemeStore } from "../../stores/themeStore";


interface ThemeSwitcherProps {
  iconSize?: number;
  color?: string;
}

/**
 * Este componente ahora solo se encarga de la UI y de cambiar el estado.
 * La lógica de aplicar el tema ha sido movida a ThemeApplier.tsx.
 */
export const ThemeSwitcher = ({ iconSize = 18, color = "text-black" }: ThemeSwitcherProps) => {
  const { theme, setTheme } = useThemeStore();

  const icons = {
    light: <Sun size={iconSize} />,
    dark: <Moon size={iconSize} />,
    system: <Laptop size={iconSize} />,
  };

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
      className={`relative rounded-full p-2 hover:bg-indigo-400 
      focus:outline-none ${color} dark:text-amber-50 hover:text-brand-900 cursor-pointer transition duration-300`}
      aria-label={`Cambiar a tema ${theme === "light" ? "oscuro" : "claro"}`}
    >
      {icons[theme]}
    </button>
  );
};
