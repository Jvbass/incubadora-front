const FormSidePanel = () => {
  return (
    <aside className="md:col-span-1">
      <div className="p-6 bg-slate-100 dark:bg-slate-800 rounded-lg shadow-md sticky top-24 border border-zinc-300 dark:border-slate-600">
        <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-3 ">
          Publica tu Proyecto
        </h2>
        <p className="text-slate-600 dark:text-slate-200 mb-4 text-sm">
          Comparte tu trabajo con la comunidad. Un buen título y una descripción
          clara son la clave para atraer a otros desarrolladores, mentores o
          reclutadores.
        </p>
        <h4 className="font-semibold text-slate-800 dark:text-slate-100 mb-2">
          Recomendaciones:
        </h4>
        <ul className="list-disc list-inside text-slate-600 dark:text-slate-200 space-y-1 text-sm">
          <li>Sé específico sobre las tecnologías que usaste.</li>
          <li>Si buscas colaboradores, ¡activa la opción!</li>
          <li>Un enlace al repositorio es casi obligatorio.</li>
          <li>Muestra tu proyecto en acción con un enlace de despliegue.</li>
        </ul>
      </div>
    </aside>
  );
};

export default FormSidePanel;
