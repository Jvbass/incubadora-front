const FormSidePanel = () => {
  return (
    <aside className="md:col-span-1">
      <div className="p-6 bg-white rounded-lg shadow-md sticky top-24">
        <h2 className="text-xl font-bold text-gray-800 mb-3">
          Publica tu Proyecto
        </h2>
        <p className="text-gray-600 mb-4 text-sm">
          Comparte tu trabajo con la comunidad. Un buen título y una descripción
          clara son la clave para atraer a otros desarrolladores, mentores o
          reclutadores.
        </p>
        <h4 className="font-semibold text-gray-700 mb-2">Recomendaciones:</h4>
        <ul className="list-disc list-inside text-gray-600 space-y-1 text-sm">
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
