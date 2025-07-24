import axios from "axios";
import toast from "react-hot-toast";

// Create axios instance with base configuration
const apiService = axios.create({
  baseURL: "http://localhost:8080/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to attach JWT token
apiService.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("authToken");
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle authentication errors
apiService.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response) {
      const { status, data } = error.response;

      if (status === 401) {
        // Token expired or invalid
        toast.error("Tu sesión ha expirado. Por favor, inicia sesión de nuevo.");
        
        // Clear token and redirect to login
        localStorage.removeItem("authToken");
        
        // Use Zustand store to update auth state
        import("../stores/authStore").then(({ useAuthStore }) => {
          useAuthStore.getState().logout();
        });
        
        window.location.href = "/login";
      } else if (status === 403) {
        // Check if it's an authentication error vs business logic error
        const isAuthError = data?.message?.includes("token") || 
                           data?.message?.includes("sesión") ||
                           data?.message?.includes("autenticación") ||
                           data?.message?.includes("permisos insuficientes");
        
        if (isAuthError) {
          toast.error("No tienes permisos suficientes. Por favor, inicia sesión de nuevo.");
          localStorage.removeItem("authToken");
          
          // Use Zustand store to update auth state
          import("../stores/authStore").then(({ useAuthStore }) => {
            useAuthStore.getState().logout();
          });
          
          window.location.href = "/login";
        }
        // If not auth error, let component handle it
      }
    }

    return Promise.reject(error);
  }
);

export default apiService;
