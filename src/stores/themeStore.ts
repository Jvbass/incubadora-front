import { create } from "zustand";
import { persist } from "zustand/middleware";

// Definimos los posibles estados del tema
type Theme = "light" | "dark" | "system";

interface ThemeState {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

// Creamos el store con persistencia en localStorage
export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      theme: "dark", // Dark por defecto (D-17, rediseño v2); el usuario puede cambiarlo
      setTheme: (newTheme) => set({ theme: newTheme }),
    }),
    {
      name: "theme-storage", // Nombre de la clave en localStorage
    }
  )
);
