//IDs de los campos en ProjectForm.tsx que tendrán ayuda
export type FormFieldId =
  | "title"
  | "subtitle"
  | "description"
  | "repositoryUrl"
  | "projectUrl"
  | "technologyIds"
  | "status"
  | "isCollaborative"
  | "needMentoring"
  | "developmentProgress";

// 2. Definimos la estructura de nuestro objeto de ayuda
export interface FieldHint {
  title: string;
  description: string;
  recommendations?: string[];
}

// 3. Creamos el mapa de contenido
export const formHelpContent: Record<string, FieldHint> = {
  title: {
    title: "Título del Proyecto",
    description:
      "Un título corto y memorable. Piensa en él como el nombre de tu app o marca. (Máx. 50 caracteres)",
    recommendations: [
      "Sé conciso: mantén menos de 50 caracteres.",
      "Usa palabras clave relevantes para que sea fácil de identificar.",
      "Evita caracteres especiales innecesarios y abreviaturas poco claras.",
    ],
  },
  subtitle: {
    title: "Subtítulo",
    description:
      "Un 'slogan' o descripción de una línea que resuma tu proyecto de forma atractiva. (Máx. 100 caracteres)",
    recommendations: [
      "Usa entre 3 y 6 palabras.",
      "Evita términos genéricos como 'App' o 'Proyecto Final'.",
      "Refleja la tecnología o propósito (ej. 'Taskify - Gestor de Tareas con React').",
    ],
  },
  description: {
    title: "Descripción",
    description:
      "¡Aquí es donde brillas! Describe los objetivos, funcionalidades y el estado actual. Puedes usar Markdown para formatear listas, enlaces o código.",
    recommendations: [
      "Explica los objetivos, el público objetivo y qué problema resuelve.",
      "Incluye pasos para instalar, ejecutar y probar (dependencias y comandos).",
      "Detalla el estado actual, funcionalidades pendientes y cómo colaborar o reportar issues.",
    ],
  },
  repositoryUrl: {
    title: "URL del Repositorio",
    description:
      "Pega el enlace a tu repositorio (ej. GitHub, GitLab). Asegúrate de que sea público si buscas colaboradores.",
    recommendations: [
      "Incluye la URL completa empezando por https://.",
      "Verifica que el repositorio sea accesible (público o con instrucciones de acceso).",
      "Si apuntas a una rama o carpeta específica, indícalo (ej. /tree/main).",
    ],
  },
  projectUrl: {
    title: "URL del Despliegue",
    description:
      "Muestra tu proyecto en acción. Un enlace a Vercel, Netlify, GitHub Pages, etc. ¡Hará que recibir feedback sea mucho más fácil!",
    recommendations: [
      "Asegúrate de que el enlace use https y esté disponible públicamente.",
      "Si el despliegue requiere credenciales o está en staging, agrega instrucciones claras o credenciales de demo.",
      "Incluye una captura o link alternativo si el sitio está temporalmente caído.",
    ],
  },
  technologyIds: {
    title: "Tecnologías",
    description:
      "Selecciona las tecnologías principales. Esto ayuda a otros a entender tu stack y a filtrar proyectos.",
    recommendations: [
      "Selecciona las 2-6 tecnologías más relevantes (lenguaje + framework + librerías clave).",
      "Prioriza tecnologías que describan la «surface» del proyecto (ej. React, TypeScript, Node.js).",
      "Evita listar dependencias muy menores o transversales que no aporten contexto.",
    ],
  },
  status: {
    title: "Estado del Proyecto",
    description:
      "'Borrador' (privado, solo tú puedes verlo), 'Publicar' (visible para todos), 'Archivar' (oculto, pero no borrado).",
    recommendations: [
      "Usa 'Borrador' mientras falten README o instrucciones para correr el proyecto.",
      "Elige 'Publicar' cuando tengas instrucciones básicas y el despliegue (si aplica).",
      "Usa 'Archivar' para proyectos inactivos que quieras conservar sin recibir nuevas contribuciones.",
    ],
  },
  isCollaborative: {
    title: "Busco Colaboradores",
    description:
      "Marca esta opción si estás abierto a que otros desarrolladores se unan y aporten código a tu proyecto.",
    recommendations: [
      "Indica en la descripción qué tipo de contribuciones aceptas (código, diseño, testing).",
      "Añade etiquetas o issues iniciales ('good first issue') para orientar a nuevos colaboradores.",
      "Especifica el nivel de experiencia requerido y las expectativas de comunicación.",
    ],
  },
  needMentoring: {
    title: "Busco Mentor",
    description:
      "Marca esta opción si te gustaría recibir guía o consejo de un desarrollador más experimentado.",
    recommendations: [
      "Describe qué tipo de mentoría necesitas (arquitectura, revisión de código, estrategia).",
      "Indica disponibilidad aproximada y duración esperada de la mentoría.",
      "Sé claro sobre el nivel de experiencia deseado en el mentor y los objetivos a alcanzar.",
    ],
  },
  developmentProgress: {
    title: "Progreso del Desarrollo",
    description:
      "Arrastra la barra para indicar qué tan avanzado está tu proyecto. 10% es una idea, 100% es un proyecto completado y listo.",
    recommendations: [
      "Sé honesto: 10% idea, 30% diseño/prototipo, 60% funcional mínimo, 100% listo.",
      "Si es <100%, añade en la descripción qué falta por completar y quién puede ayudar.",
      "Actualiza este valor con frecuencia para que colaboradores vean progreso real.",
    ],
  },
};
