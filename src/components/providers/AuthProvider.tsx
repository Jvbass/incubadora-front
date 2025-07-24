import { useEffect } from "react";
import { useAuthStore } from "../../stores/authStore";

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const initializeAuth = useAuthStore((state) => state.initializeAuth);

  useEffect(() => {
    // Initialize auth state from localStorage on app startup
    initializeAuth();
  }, [initializeAuth]);

  return <>{children}</>;
};