// Clases compartidas de los formularios de auth (rediseño v2, SDD §12.3 R3).
// Dark-first con soporte de modo claro vía tokens del design system.

export const authLabel =
  "block text-sm font-medium text-text-main dark:text-text-light";

export const authInput =
  "w-full px-3 py-2.5 mt-1 text-sm rounded-md border bg-white dark:bg-bg-darker " +
  "text-text-main dark:text-text-light placeholder:text-text-soft " +
  "border-gray-300 dark:border-border " +
  "focus:outline-none focus:border-cta-600 dark:focus:border-cta-300 focus:ring-1 focus:ring-cta-600/40 " +
  "transition duration-200";

export const authError = "mt-1 text-xs text-cta-600 dark:text-cta-300";

export const authSubmit =
  "w-full py-2.5 font-semibold text-white bg-cta-600 rounded-md cursor-pointer " +
  "hover:bg-cta-900 transition duration-200 " +
  "focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cta-600 " +
  "dark:focus:ring-offset-bg-dark disabled:opacity-50 disabled:cursor-not-allowed";

export const authLink =
  "font-medium text-cta-600 dark:text-cta-300 hover:underline";

export const authMuted = "text-sm text-text-soft";
