import axios from "axios";
import toast from "react-hot-toast";

// 1. CREACIÓN DE LA INSTANCIA DE AXIOS
// Creamos una instancia de Axios con una configuración base.
// La baseURL corresponde a la ruta base de nuestra API en el backend de Spring Boot.
// Esto evita que tengamos que escribir 'http://localhost:8080/api' en cada llamada.
const apiService = axios.create({
  baseURL: "http://localhost:8080/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// 2. CONFIGURACIÓN DEL INTERCEPTOR DE PETICIONES (REQUEST)
// Aquí es donde ocurre la magia del JWT.
// 'interceptors.request.use()' registra una función que se ejecutará
// antes de que cualquier petición hecha con esta instancia de Axios sea enviada.
apiService.interceptors.request.use(
  (config) => {
    // Antes de enviar la petición, intentamos obtener el token del localStorage.
    const token = localStorage.getItem("authToken");

    // Si existe un token...
    if (token) {
      // ...lo añadimos a la cabecera 'Authorization'.
      // El formato 'Bearer <token>' es un estándar que el backend espera.
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Devolvemos la configuración modificada para que la petición continúe.
    return config;
  },
  (error) => {
    // Si hay un error durante la configuración de la petición, lo rechazamos.
    return Promise.reject(error);
  }
);

// 3. CONFIGURACIÓN DEL INTERCEPTOR DE RESPUESTAS (RESPONSE)
// Similar al interceptor de peticiones, pero para las respuestas.
// Aquí es donde manejamos los errores de autenticación.
apiService.interceptors.response.use(
  // La primera función se ejecuta si la respuesta es exitosa (status 2xx).
  // Simplemente la devolvemos para que la promesa se resuelva.
  (response) => {
    return response;
  },
  // La segunda función se ejecuta si la respuesta tiene un error.
  (error) => {
    // Verificamos si el error tiene un objeto de respuesta (es un error de API, no de red).
    if (error.response) {
      const { status, data } = error.response;

      // Solo redirigir al login en casos específicos de autenticación
      if (status === 401) {
        toast.error(
          "Tu sesión ha expirado. Por favor, inicia sesión de nuevo."
        );
        localStorage.removeItem("authToken");
        window.location.href = "/login";
      } else if (status === 403) {
        // Para 403, solo redirigir si es un error de autenticación real
        // No si es un error de negocio (como "no puedes dar feedback a tu propio proyecto")
        const isAuthError = data?.message?.includes("token") || 
                           data?.message?.includes("sesión") ||
                           data?.message?.includes("autenticación") ||
                           data?.message?.includes("permisos insuficientes");
        
        if (isAuthError) {
          toast.error(
            "No tienes permisos suficientes. Por favor, inicia sesión de nuevo."
          );
          localStorage.removeItem("authToken");
          window.location.href = "/login";
        }
        // Si no es un error de autenticación, dejamos que el componente lo maneje
      }
    }

    // Para cualquier otro error, simplemente lo propagamos para que el
    // bloque catch del componente que hizo la llamada lo pueda manejar.
    return Promise.reject(error);
  }
);

// 4. EXPORTACIÓN
// Exportamos la instancia configurada para poder usarla en cualquier parte
export default apiService;
