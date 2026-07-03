import { useEffect } from "react";
import { usePageTitleStore } from "../stores/pageTitleStore";

/**
 * Setea el título contextual del navbar mientras el componente está montado y
 * lo limpia al desmontar. Pasar null/undefined mientras los datos cargan.
 */
export const usePageTitle = (title: string | null | undefined) => {
  const setTitle = usePageTitleStore((s) => s.setTitle);
  useEffect(() => {
    setTitle(title ?? null);
    return () => setTitle(null);
  }, [title, setTitle]);
};
