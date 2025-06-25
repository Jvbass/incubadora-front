import { createContext, useContext } from "react";
import type { User,RegisterRequest } from "../types";


// Tipos que necesita el contexto.
type LoginRequest = {
  username: string;
  password: string;
};

// Esta es la "forma" de nuestro contexto.
interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  isLoading: boolean;
  login: (loginData: LoginRequest) => Promise<User>;
  logout: () => void;
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  isLoading: boolean;
  login: (loginData: LoginRequest) => Promise<User>;
  registerAndLogin: (registerData: RegisterRequest) => Promise<User>; // <-- AÑADIR ESTA LÍNEA
  logout: () => void;
}

// 1. CREACIÓN DEL CONTEXTO
// Creamos el contexto, lo inicializamos con 'undefined' y lo exportamos.
export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

// 2. CREACIÓN DEL HOOK
// Creamos el componente "Proveedor" que envolverá nuestra aplicación.
export const useAuth = () => {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error("useAuth debe ser usado dentro de un AuthProvider");
  }

  return context;
};
