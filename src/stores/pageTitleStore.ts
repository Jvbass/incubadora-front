import { create } from "zustand";

interface PageTitleState {
  /** Título contextual de la sección actual; null = usar el título por ruta. */
  title: string | null;
  setTitle: (title: string | null) => void;
}

// Lo setean las páginas de detalle para mostrar el nombre real de la entidad
// en el navbar (ej. "Proyecto: X"). El navbar cae al título por ruta si es null.
export const usePageTitleStore = create<PageTitleState>((set) => ({
  title: null,
  setTitle: (title) => set({ title }),
}));
