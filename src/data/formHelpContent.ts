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
  link?: {
    title: string;
    url: string;
  };
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
    description: "Resume los objetivos, funcionalidades y el estado actual. ",
    recommendations: [
      "Explica qué problema resuelve.",
      "Indica alguna especialidad especial que te gustaría destacar.",
      "Detalla el estado actual, funcionalidades pendientes y cómo colaborar o reportar issues.",
      "Usa el siguiente formato MD para una mejor presentación:",
    ],
    link: {
      title: "Guía de Markdown",
      url: "https://markdown-it.github.io/#md3=%7B%22source%22%3A%22%23%23%20%F0%9F%9A%80%20El%20Pitch%3A%20%C2%BFQu%C3%A9%20es%20este%20proyecto%3F%5Cn%5Cn%28Describe%20en%202-3%20frases%20el%20proyecto.%20%C2%BFQu%C3%A9%20problema%20resuelve%20y%20para%20qui%C3%A9n%3F%20Ve%20al%20grano.%29%5Cn%5Cn%3E%20%F0%9F%92%A1%20%2A%2ATip%3A%2A%2A%20%C2%A1S%C3%A9%20conciso!%20Imagina%20que%20tienes%2030%20segundos%20para%20explic%C3%A1rselo%20a%20un%20reclutador.%20Usa%20%2A%2Anegrita%2A%2A%20para%20la%20idea%20principal%20y%20%2Acursiva%2A%20para%20el%20p%C3%BAblico%20objetivo.%5Cn%5Cn---%5Cn%5Cn%23%23%20%F0%9F%93%B8%20Vistazo%20R%C3%A1pido%20%28Screenshots%20%2F%20GIFs%29%5Cn%5Cn%C2%A1Una%20imagen%20%28o%20un%20GIF%29%20vale%20m%C3%A1s%20que%20mil%20l%C3%ADneas%20de%20c%C3%B3digo!%5Cn%5Cn%7C%20Feature%20A%20%28Ej%3A%20Login%29%20%7C%20Feature%20B%20%28Ej%3A%20Dashboard%29%20%7C%5Cn%7C%20%3A---%3A%20%7C%20%3A---%3A%20%7C%5Cn%7C%20!%5BDescripci%C3%B3n%20de%20la%20imagen%201%5D%28URL_DE_TU_IMAGEN_O_GIF%29%20%7C%20!%5BDescripci%C3%B3n%20de%20la%20imagen%202%5D%28URL_DE_TU_IMAGEN_O_GIF%29%20%7C%5Cn%5Cn%3E%20%F0%9F%92%A1%20%2A%2ATip%3A%2A%2A%20%C2%A1Los%20GIFs%20son%20oro!%20Graba%20tu%20pantalla%20usando%20herramientas%20gratuitas%20%28como%20LICEcap%20o%20Giphy%20Capture%29%20para%20mostrar%20la%20%2Afuncionalidad%2A%20m%C3%A1s%20impresionante%20en%20acci%C3%B3n.%20Sube%20la%20imagen%2Fgif%20a%20un%20servicio%20como%20%5BImgur%5D%28https%3A%2F%2Fimgur.com%2F%29%20para%20obtener%20la%20URL.%5Cn%5Cn---%5Cn%5Cn%23%23%20%F0%9F%8C%9F%20Caracter%C3%ADsticas%20Principales%5Cn%5Cn%28Usa%20una%20lista%20para%20mostrar%20lo%20que%20los%20usuarios%20pueden%20%2Ahacer%2A.%29%5Cn%5Cn%2A%20%2A%2AAutenticaci%C3%B3n%20y%20Perfiles%3A%2A%2A%5Cn%20%20%2A%20Registro%20de%20nuevos%20usuarios%20y%20login%20%28con%20JWT%20%2F%20OAuth%29.%5Cn%20%20%2A%20Perfiles%20de%20usuario%20personalizables.%5Cn%2A%20%2A%2AM%C3%B3dulo%20Principal%20%28Ej%3A%20E-commerce%29%3A%2A%2A%5Cn%20%20%2A%20Cat%C3%A1logo%20de%20productos%20consumiendo%20una%20API%20REST.%5Cn%20%20%2A%20Carrito%20de%20compras%20con%20estado%20global%20%28usando%20Context%2C%20Redux%2C%20Pinia%2C%20etc.%29.%5Cn%2A%20%2A%2APanel%20de%20Administraci%C3%B3n%20%28CRUD%29%3A%2A%2A%5Cn%20%20%2A%20Gesti%C3%B3n%20%28Crear%2C%20Leer%2C%20Actualizar%2C%20Borrar%29%20de%20productos%2Fposts.%5Cn%20%20%2A%20Dashboard%20con%20estad%C3%ADsticas%20b%C3%A1sicas.%5Cn%5Cn%3E%20%F0%9F%92%A1%20%2A%2ATip%3A%2A%2A%20Enf%C3%B3cate%20en%20las%20%2Aacciones%2A%20y%20el%20%2Avalor%2A%20para%20el%20usuario.%20%5C%22Los%20usuarios%20pueden%20gestionar%20su%20inventario%5C%22%20es%20mejor%20que%20%5C%22Hice%20un%20CRUD%20de%20productos%5C%22.%5Cn%5Cn---%5Cn%5Cn%23%23%20%F0%9F%8F%9B%EF%B8%8F%20Decisiones%20de%20Dise%C3%B1o%20y%20Arquitectura%5Cn%5Cn%28Esta%20es%20tu%20secci%C3%B3n%20estrella.%20Demuestra%20%2Ac%C3%B3mo%2A%20piensas%29.%5Cn%5Cn1.%20%20%2A%2A%C2%BFPor%20qu%C3%A9%20%5BTecnolog%C3%ADa%20Clave%5D%3F%2A%2A%5Cn%20%20%20%20%28Ej%3A%20%5C%22Se%20eligi%C3%B3%20%2A%2ANext.js%2A%2A%20sobre%20React%20simple%20para%20aprovechar%20el%20%2AServer-Side%20Rendering%2A%20%28SSR%29%20y%20mejorar%20dr%C3%A1sticamente%20el%20SEO%20de%20las%20p%C3%A1ginas%20de%20productos%2C%20lo%20cual%20era%20un%20requisito%20clave%20del%20proyecto...%5C%22%29%5Cn%5Cn2.%20%20%2A%2AEstructura%20del%20Backend%20%2F%20Base%20de%20Datos%3A%2A%2A%5Cn%20%20%20%20%28Ej%3A%20%5C%22Se%20implement%C3%B3%20una%20arquitectura%20de%20microservicios%20%28separando%20Usuarios%20de%20Pedidos%29%20para%20mejorar%20la%20escalabilidad.%20Para%20la%20base%20de%20datos%2C%20se%20opt%C3%B3%20por%20%2A%2APostgreSQL%2A%2A%20por%20sus%20capacidades%20transaccionales%20robustas%20%28ACID%29%20en%20lugar%20de%20NoSQL...%5C%22%29%5Cn%5Cn3.%20%20%2A%2APatr%C3%B3n%20de%20Dise%C3%B1o%20Aplicado%3A%2A%2A%5Cn%20%20%20%20%28Ej%3A%20%5C%22Se%20utiliz%C3%B3%20el%20%2A%2APatr%C3%B3n%20Repositorio%2A%2A%20en%20el%20backend%20para%20abstraer%20la%20l%C3%B3gica%20de%20acceso%20a%20datos%2C%20haciendo%20que%20el%20c%C3%B3digo%20sea%20m%C3%A1s%20mantenible%20y%20f%C3%A1cil%20de%20testear...%5C%22%29%5Cn%5Cn%3E%20%F0%9F%92%A1%20%2A%2ATip%3A%2A%2A%20No%20repitas%20las%20tecnolog%C3%ADas%20que%20ya%20listaste.%20Explica%20el%20%2APOR%20QU%C3%89%2A%20las%20elegiste.%20%C2%BFQu%C3%A9%20alternativas%20consideraste%3F%20Esto%20demuestra%20%60seniority%60%20y%20pensamiento%20cr%C3%ADtico.%5Cn%5Cn---%5Cn%5Cn%23%23%20%F0%9F%A7%97%20Desaf%C3%ADos%20T%C3%A9cnicos%20y%20Lecciones%20Aprendidas%5Cn%5CnAqu%C3%AD%20es%20donde%20demuestras%20tu%20habilidad%20para%20resolver%20problemas.%5Cn%5Cn%23%23%23%20Desaf%C3%ADo%201%3A%20%5BEl%20problema%20m%C3%A1s%20dif%C3%ADcil%20que%20tuviste%5D%5Cn%5Cn%3E%20%2A%2AEl%20Problema%3A%2A%2A%20%28Ej%3A%20%5C%22La%20sincronizaci%C3%B3n%20en%20tiempo%20real%20del%20inventario%20entre%20el%20panel%20de%20admin%20y%20la%20tienda%20p%C3%BAblica%20era%20lenta%20y%20propensa%20a%20errores%20de%20concurrencia...%5C%22%29%5Cn%3E%5Cn%3E%20%2A%2ALa%20Soluci%C3%B3n%3A%2A%2A%20%28Ej%3A%20%5C%22Implement%C3%A9%20%2A%2AWebSockets%2A%2A%20%28con%20Socket.io%29%20para%20notificar%20a%20todos%20los%20clientes%20conectados%20de%20un%20cambio%20de%20stock%20instant%C3%A1neamente%2C%20en%20lugar%20de%20usar%20polling%20HTTP.%20Adem%C3%A1s%2C%20us%C3%A9%20transacciones%20en%20la%20BD%20para%20asegurar%20la%20atomicidad%20de%20las%20ventas.%5C%22%29%5Cn%5Cn%23%23%23%20Desaf%C3%ADo%202%3A%20%5BOtro%20problema%20interesante%5D%5Cn%5Cn%3E%20%2A%2AEl%20Problema%3A%2A%2A%20%28Ej%3A%20%5C%22Las%20consultas%20a%20la%20base%20de%20datos%20para%20el%20dashboard%20de%20anal%C3%ADticas%20eran%20muy%20ineficientes%20y%20tardaban%20segundos%20en%20cargar...%5C%22%29%5Cn%3E%5Cn%3E%20%2A%2ALa%20Soluci%C3%B3n%3A%2A%2A%20%28Ej%3A%20%5C%22Aprend%C3%AD%20a%20usar%20%60EXPLAIN%20ANALYZE%60%20en%20SQL%20para%20identificar%20los%20cuellos%20de%20botella.%20Termin%C3%A9%20%2A%2Acreando%20%C3%ADndices%20compuestos%2A%2A%20en%20las%20tablas%20de%20%60pedidos%60%20y%20%60fechas%60%2C%20reduciendo%20el%20tiempo%20de%20carga%20en%20un%2090%25.%5C%22%29%5Cn%5Cn%23%23%23%20Principales%20Lecciones%3A%5Cn%5Cn%2A%20Aprend%C3%AD%20la%20importancia%20de%20normalizar%20%28y%20a%20veces%20%2Adesnormalizar%2A%29%20correctamente%20una%20base%20de%20datos.%5Cn%2A%20Domin%C3%A9%20el%20manejo%20de%20estado%20as%C3%ADncrono%20en%20el%20frontend%20usando%20%60React%20Query%60.%5Cn%2A%20Fue%20mi%20primera%20vez%20implementando%20un%20pipeline%20de%20CI%2FCD%20b%C3%A1sico%20con%20Docker%20y%20GitHub%20Actions.%5Cn%5Cn%3E%20%F0%9F%92%A1%20%2A%2ATip%3A%2A%2A%20%C2%A1No%20tengas%20miedo%20de%20admitir%20lo%20que%20no%20sab%C3%ADas!%20Explicar%20c%C3%B3mo%20superaste%20un%20bug%20imposible%20o%20aprendiste%20una%20nueva%20arquitectura%20demuestra%20resiliencia%20y%20proactividad.%5Cn%5Cn---%5Cn%5Cn%23%23%20%F0%9F%92%BB%20Fragmento%20de%20C%C3%B3digo%20Destacado%5Cn%5Cn%28Muestra%20un%20peque%C3%B1o%20bloque%20de%20c%C3%B3digo%20del%20que%20est%C3%A9s%20orgulloso.%20%C2%A1No%20olvides%20el%20lenguaje%20para%20el%20syntax%20highlighting!%29%5Cn%5Cn%60%60%60javascript%5Cn%2F%2F%20Ejemplo%3A%20Un%20Custom%20Hook%20de%20React%20que%20resuelve%20un%20problema%20complejo%5Cn%5Cnfunction%20useDebounce%28value%2C%20delay%29%20%7B%5Cn%20%20const%20%5BdebouncedValue%2C%20setDebouncedValue%5D%20%3D%20useState%28value%29%3B%5Cn%5Cn%20%20useEffect%28%28%29%20%3D%3E%20%7B%5Cn%20%20%20%20%2F%2F%20Configura%20un%20temporizador%20para%20actualizar%20el%20valor%5Cn%20%20%20%20%2F%2F%20solo%20despu%C3%A9s%20de%20que%20el%20usuario%20haya%20dejado%20de%20escribir%5Cn%20%20%20%20const%20handler%20%3D%20setTimeout%28%28%29%20%3D%3E%20%7B%5Cn%20%20%20%20%20%20setDebouncedValue%28value%29%3B%5Cn%20%20%20%20%7D%2C%20delay%29%3B%5Cn%5Cn%20%20%20%20%2F%2F%20Limpia%20el%20temporizador%20si%20el%20valor%20cambia%20%28o%20al%20desmontar%29%5Cn%20%20%20%20return%20%28%29%20%3D%3E%20%7B%5Cn%20%20%20%20%20%20clearTimeout%28handler%29%3B%5Cn%20%20%20%20%7D%3B%5Cn%20%20%7D%2C%20%5Bvalue%2C%20delay%5D%29%3B%20%2F%2F%20Solo%20se%20re-ejecuta%20si%20el%20valor%20o%20el%20delay%20cambian%5Cn%5Cn%20%20return%20debouncedValue%3B%5Cn%7D%22%2C%22defaults%22%3A%7B%22html%22%3Afalse%2C%22xhtmlOut%22%3Afalse%2C%22breaks%22%3Afalse%2C%22langPrefix%22%3A%22language-%22%2C%22linkify%22%3Atrue%2C%22typographer%22%3Atrue%2C%22_highlight%22%3Atrue%2C%22_strict%22%3Afalse%2C%22_view%22%3A%22html%22%7D%7D",
    },
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
