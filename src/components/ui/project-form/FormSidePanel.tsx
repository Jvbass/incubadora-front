// src/components/ui/project-form/FormSidePanel.tsx

import { formHelpContent } from "../../../data/formHelpContent";
import { useActiveFieldStore } from "../../../hooks/useActiveField";


const FormSidePanel = () => {
  const { activeField } = useActiveFieldStore();
  const hint = activeField ? formHelpContent[activeField] : null;

  return (
    <aside className="md:col-span-1 transition-all duration-300 ">
      <div className="p-6 bg-bg-light dark:bg-slate-800 rounded-lg shadow-md sticky top-4 border border-blue-300 dark:border-slate-600  ">
        {hint ? (
          <>
            <h2 className="text-2xl font-semibold text-slate-800 dark:text-slate-100 mb-3">
              {hint.title}
            </h2>
            <p className="text-sm text-slate-600 dark:text-text-light mb-4">
              {hint.description}
            </p>
            {hint.recommendations && (
              <ul className="list-disc list-inside text-slate-600 dark:text-slate-200 space-y-1 text-sm">
                {hint.recommendations.map((rec, i) => (
                  <li key={i}>{rec}</li>
                ))}
              </ul>
            )}
          </>
        ) : (
          <>
            <h2 className="text-2xl font-semibold text-slate-800 dark:text-slate-100 mb-3">
              Publica tu Proyecto
            </h2>
            <p className="text-sm text-slate-600 dark:text-text-light mb-4">
              Comparte tu trabajo con la comunidad. Un buen título y una
              descripción clara son la clave.
            </p>
            <h4 className="font-semibold text-slate-800 dark:text-slate-100 mb-2">
              Recomendaciones:
            </h4>
            <ul className="list-disc list-inside text-slate-600 dark:text-slate-200 space-y-1 text-sm">
              <li>Sé específico sobre las tecnologías que usaste.</li>
              <li>Si buscas colaboradores, ¡activa la opción!</li>
              <li>Incluye el enlace al repositorio.</li>
              <li>Agrega un enlace de despliegue si está disponible.</li>
            </ul>
          </>
        )}
      </div>
    </aside>
  );
};

export default FormSidePanel;
