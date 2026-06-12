// Skeletons de carga (rediseño v2, SDD §12.3 R4/R6): reemplazan al texto
// "Cargando..." para que la transición entre pantallas no salte.

export const Skeleton = ({ className = "" }: { className?: string }) => (
  <div
    className={`animate-pulse rounded-md bg-gray-200 dark:bg-bg-hoverdark ${className}`}
  />
);

/** Fila tipo card de proyecto/mentoría. */
export const CardRowSkeleton = () => (
  <div className="flex items-center gap-4 p-4 rounded-lg border border-divider dark:border-border bg-bg-light dark:bg-bg-dark">
    <Skeleton className="w-14 h-14 rounded-full shrink-0" />
    <div className="flex-grow space-y-2">
      <Skeleton className="h-4 w-2/5" />
      <Skeleton className="h-3 w-3/5" />
      <div className="flex gap-2 pt-1">
        <Skeleton className="h-5 w-16" />
        <Skeleton className="h-5 w-16" />
        <Skeleton className="h-5 w-16" />
      </div>
    </div>
    <div className="hidden sm:flex flex-col items-end gap-2 shrink-0">
      <Skeleton className="h-8 w-24" />
      <Skeleton className="h-3 w-14" />
    </div>
  </div>
);

/** Lista de cards con título de sección. */
export const ListSkeleton = ({ rows = 3 }: { rows?: number }) => (
  <section aria-busy="true" className="space-y-4">
    <Skeleton className="h-6 w-48" />
    {Array.from({ length: rows }).map((_, i) => (
      <CardRowSkeleton key={i} />
    ))}
  </section>
);

/** Fallback genérico de página para el Suspense del layout autenticado. */
export const PageSkeleton = () => (
  <div aria-busy="true" className="max-w-7xl mx-auto space-y-8 py-2">
    <Skeleton className="h-8 w-64" />
    <ListSkeleton rows={3} />
  </div>
);

export default Skeleton;
