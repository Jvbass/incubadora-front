import { useState, type ChangeEvent, type FormEvent } from "react";
import toast from "react-hot-toast";
import type { CreateData } from "../../types";
import FormInput from "../../components/ui/FormInput";

type FormErrors = {
  [K in keyof CreateData]?: string;
};



// --- Organismo del Diseño ---

// Componente Organismo: El formulario completo para la página.
function CreateProject() {
  const [formData, setFormData] = useState<CreateData>({
    title: "",
    description: "",
    repositoryUrl: "",
    projectUrl: "",
    developerUsername: "",
    technologies: "",
    tools: "",
    status: "Planificado",
    isCollaborative: false,
    developmentProgress: "0",
  });

  const [errors, setErrors] = useState<FormErrors>({});

  const validate = (): FormErrors => {
    const newErrors: FormErrors = {};
    if (!formData.title.trim()) newErrors.title = "El título es obligatorio.";
    if (formData.title.length > 100)
      newErrors.title = "El título no puede exceder los 100 caracteres.";

    if (!formData.description.trim())
      newErrors.description = "La descripción es obligatoria.";

    if (!formData.developerUsername.trim())
      newErrors.developerUsername = "El nombre de usuario es obligatorio.";

    const urlPattern =
      /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/;
    if (formData.repositoryUrl && !urlPattern.test(formData.repositoryUrl)) {
      newErrors.repositoryUrl =
        "Por favor, introduce una URL de repositorio válida.";
    }
    if (formData.projectUrl && !urlPattern.test(formData.projectUrl)) {
      newErrors.projectUrl = "Por favor, introduce una URL de proyecto válida.";
    }

    return newErrors;
  };

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    const isCheckbox = type === "checkbox";
    // Hacemos un type assertion para que TypeScript sepa que 'name' es una clave de CreateData
    const fieldName = name as keyof CreateData;

    setFormData((prevData) => ({
      ...prevData,
      [fieldName]: isCheckbox ? (e.target as HTMLInputElement).checked : value,
    }));

    //borrar mensajes de error al correjirlos
    if (errors[fieldName]) {
      setErrors((prevErrors) => {
        const newErrors = { ...prevErrors };
        delete newErrors[fieldName];
        return newErrors;
      });
    }
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const validationErrors = validate();
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      // Estructurar los datos para el backend
      const dataForBackend = {
        ...formData,
        technologies: formData.technologies
          .split(",")
          .map((t) => ({ name: t.trim() }))
          .filter((t) => t.name),
        tools: formData.tools
          .split(",")
          .map((t) => ({ name: t.trim() }))
          .filter((t) => t.name),
        developmentProgress: parseInt(formData.developmentProgress, 10),
        // Campos autogenerados por el backend (id, createdAt) se omiten
      };

      console.log("Datos validados y listos para enviar:", dataForBackend);
      alert(
        "Proyecto enviado con éxito. Revisa la consola para ver los datos estructurados."
      );
      // Aquí iría la llamada a la API:
      // await fetch('/api/projects', { method: 'POST', body: JSON.stringify(dataForBackend) });
    } else {
      console.log("Errores de validación:", validationErrors);
      toast.error("Por favor, corrige los errores en el formulario.");
    }
  };

  return (
    <div className="bg-gray-100 dark:bg-gray-900 min-h-screen font-sans">
      <main className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        <form onSubmit={handleSubmit} noValidate>
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
            {/* Columna Izquierda: Contexto y Guía (Layout Responsivo) */}
            <aside className="lg:col-span-2">
              <div className="sticky top-8 bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                  Registra tu Proyecto
                </h2>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                  Completa este formulario para añadir tu proyecto a la
                  plataforma. Proporciona detalles claros y precisos para que
                  otros puedan entender tu trabajo.
                </p>
                <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                  <h3 className="font-semibold text-gray-800 dark:text-gray-200">
                    Recomendación Clave:
                  </h3>
                  <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                    Las URL de tu repositorio y del proyecto en producción son
                    cruciales. Verifican la autenticidad y permiten a otros ver
                    tu trabajo en acción. ¡No las olvides!
                  </p>
                </div>
              </div>
            </aside>

            {/* Columna Derecha: Campos del Formulario (Layout Responsivo) */}
            <div className="lg:col-span-3">
              {/* Sección 1: Información Principal */}
              <section className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg mb-10">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 border-b pb-4 dark:border-gray-700">
                  Información Principal
                </h3>

                <FormInput
                  label="Título del Proyecto"
                  id="title"
                  value={formData.title}
                  onChange={handleChange}
                  error={errors.title}
                  placeholder="Ej: Plataforma de gestión de tareas"
                  required
                />
                <FormInput
                  label="Nombre de usuario"
                  id="developerUsername"
                  value={formData.developerUsername}
                  onChange={handleChange}
                  error={errors.developerUsername}
                  placeholder="tu-usuario-de-github"
                  required
                />

                <FormInput
                  label="Descripción detallada"
                  id="description"
                  value={formData.description}
                  onChange={handleChange}
                  error={errors.description}
                  helpText="Describe el propósito y características principales."
                >
                  <textarea
                    id="description"
                    name="description"
                    rows={5}
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Ej: Una aplicación web para organizar proyectos personales y de equipo..."
                    className={`bg-gray-50 border ${
                      errors.description ? "border-red-500" : "border-gray-300"
                    } text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white`}
                  ></textarea>
                </FormInput>

                <div className="grid md:grid-cols-2 gap-6">
                  <FormInput
                    label="URL del Repositorio"
                    id="repositoryUrl"
                    type="url"
                    value={formData.repositoryUrl}
                    onChange={handleChange}
                    error={errors.repositoryUrl}
                    placeholder="https://github.com/..."
                  />
                  <FormInput
                    label="URL del Proyecto (Deploy)"
                    id="projectUrl"
                    type="url"
                    value={formData.projectUrl}
                    onChange={handleChange}
                    error={errors.projectUrl}
                    placeholder="https://mi-proyecto.com"
                  />
                </div>

                {/* Sección 2: Detalles Técnicos y Estado */}

                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 border-b pb-4 dark:border-gray-700 mt-8">
                  Detalles Técnicos y Estado
                </h3>

                <FormInput
                  label="Tecnologías (separadas por comas)"
                  id="technologies"
                  value={formData.technologies}
                  onChange={handleChange}
                  placeholder="React, Node.js, Next.js"
                />
                <FormInput
                  label="Herramientas (separadas por comas)"
                  id="tools"
                  value={formData.tools}
                  onChange={handleChange}
                  placeholder="Docker, Figma, Vercel"
                />

                <FormInput
                  label="Estado del Proyecto"
                  id="status"
                  value={formData.status}
                  onChange={handleChange}
                >
                  <select
                    id="status"
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  >
                    <option>Pendiente</option>
                    <option>Publicado</option>
                    <option>Archivado</option>
                  </select>
                </FormInput>

                <FormInput
                  label={`Progreso de Desarrollo: ${formData.developmentProgress}%`}
                  id="developmentProgress"
                  value={formData.developmentProgress}
                  onChange={handleChange}
                >
                  <input
                    type="range"
                    id="developmentProgress"
                    name="developmentProgress"
                    min="0"
                    max="100"
                    value={formData.developmentProgress}
                    onChange={handleChange}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
                  />
                </FormInput>

                <div className="flex items-center mt-8">
                  <input
                    id="isCollaborative"
                    name="isCollaborative"
                    type="checkbox"
                    checked={formData.isCollaborative}
                    onChange={handleChange}
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                  />
                  <label
                    htmlFor="isCollaborative"
                    className="ml-3 text-sm font-medium text-gray-900 dark:text-gray-300"
                  >
                    Este proyecto está abierto a colaboración
                  </label>
                </div>
              </section>

              <div className="mt-10 text-right">
                <button
                  type="submit"
                  className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-base px-10 py-3 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 transition-colors duration-300 shadow-md hover:shadow-lg disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  Guardar Proyecto
                </button>
              </div>
            </div>
          </div>
        </form>
      </main>
    </div>
  );
}

export default CreateProject;
