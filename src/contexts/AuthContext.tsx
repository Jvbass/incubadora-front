import { useState, useEffect, type ReactNode } from "react";
import apiService from "../api/apiService";
import { decodeToken } from "../utils/jwt";
import type { User, RegisterRequest } from "../types";

// Importamos el CONTEXTO desde nuestro archivo de hooks.
import { AuthContext } from "../hooks/useAuth";

// Tipos para las peticiones a la API.
type LoginRequest = {
  username: string;
  password: string;
};

type AuthResponse = {
  token: string;
};

// Creamos el componente "Proveedor" que envolverá nuestra aplicación.
// AuthProvider es un componente proveedor que envuelve la aplicación para manejar la autenticación
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  // Estado para almacenar la información del usuario autenticado
  const [user, setUser] = useState<User | null>(null);

  // Estado para el token JWT, inicializado desde localStorage si existe
  const [token, setToken] = useState<string | null>(
    localStorage.getItem("authToken")
  );

  // Estado para manejar el estado de carga inicial
  const [isLoading, setIsLoading] = useState(true);

  // Este efecto se encarga de verificar si hay un token válido en localStorage
  useEffect(() => {
    // 1. Obtener el token del localStorage
    const storedToken = localStorage.getItem("authToken");

    // 2. Si no hay token, terminar la carga
    if (!storedToken) {
      setIsLoading(false);
      return;
    }

    try {
      // 3. Decodificar y verificar el token
      const decoded = decodeToken(storedToken);

      // 4. Verificar si el token expiró
      if (decoded.exp * 1000 <= Date.now()) {
        localStorage.removeItem("authToken");
        setIsLoading(false);
        return;
      }

      // 5. Token válido: actualizar estado
      setUser({
        username: decoded.sub,
        role: decoded.role,
      });
      setToken(storedToken);
    } catch (error) {
      console.error("Token inválido:", error);
      localStorage.removeItem("authToken");
    }

    // 6. Finalizar carga
    setIsLoading(false);
  }, []);

  // Función asíncrona para manejar el inicio de sesión
  const login = async (loginData: LoginRequest): Promise<User> => {
    try {
      // Realiza la petición de inicio de sesión al servidor
      const response = await apiService.post<AuthResponse>(
        "/auth/login",
        loginData
      );
      console.log("response" + response.data);
      const { token: newToken } = response.data;

      // Almacena el token en el localStorage
      localStorage.setItem("authToken", newToken);
      setToken(newToken);

      // Decodifica el token para obtener la información del usuario
      const decoded = decodeToken(newToken);
      const loggedInUser: User = {
        username: decoded.sub,
        role: decoded.role,
      };
      setUser(loggedInUser);

      return loggedInUser;
    } catch (error) {
      console.error("Error en el login:", error);
      throw error; // Propaga el error para manejarlo en el componente
    }
  };

  const registerAndLogin = async (
    registerData: RegisterRequest
  ): Promise<User> => {
    try {
      // 1. Llama al endpoint de registro. La respuesta no incluye un token.
      await apiService.post("/auth/register", registerData);

      // 2. Si el registro es exitoso, llama a la función de login con las credenciales nuevas.
      // Esto nos dará el token y establecerá la sesión.
      const loginData = {
        username: registerData.username,
        password: registerData.password,
      };
      return await login(loginData);
    } catch (error) {
      console.error("Error en el registro:", error);
      throw error; // Propaga el error para que el componente lo maneje.
    }
  };

  // Función para cerrar sesión
  const logout = () => {
    // Limpia el token del almacenamiento local
    localStorage.removeItem("authToken");
    // Resetea los estados de autenticación
    setUser(null);
    setToken(null);
  };

  // Objeto con los valores y funciones que estarán disponibles para los componentes hijos
  const value = {
    isAuthenticated: !!user, // Booleano que indica si hay un usuario autenticado
    user, // Información del usuario actual
    isLoading, // Estado de carga
    login, // Función para iniciar sesión
    logout, // Función para cerrar sesión
    registerAndLogin, // Función para registrar e iniciar sesión
  };

  // Muestra un indicador de carga mientras se verifica la autenticación
  if (isLoading) {
    return <div>Cargando aplicación...</div>;
  }

  // Provee el contexto de autenticación a los componentes hijos
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
