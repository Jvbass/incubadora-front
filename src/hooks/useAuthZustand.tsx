import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { loginUser, registerUser } from "../api/authApi";
import { useAuthStore } from "../stores/authStore";
import type { RegisterRequest } from "../types";
import toast from "react-hot-toast";
import type { AxiosError } from "axios";

export const useAuthZustand = () => {
  const navigate = useNavigate();
  const { 
    user, 
    isAuthenticated, 
    isLoading, 
    login: loginStore, 
    logout: logoutStore, 
    setLoading 
  } = useAuthStore();

  // Login mutation
  const loginMutation = useMutation({
    mutationFn: loginUser,
    onMutate: () => {
      setLoading(true);
    },
    onSuccess: (data) => {
      loginStore(data.token);
      toast.success("¡Bienvenido de nuevo!");
      navigate("/");
    },
    onError: (error: AxiosError<{ message?: string }>) => {
      setLoading(false);
      toast.error(error.response?.data?.message || "Credenciales incorrectas.");
    },
  });

  // Register mutation: la cuenta queda pendiente de verificar email,
  // por lo que ya no se hace login automático.
  const registerMutation = useMutation({
    mutationFn: (data: RegisterRequest) => registerUser(data),
    onSuccess: (data) => {
      toast.success(data.message || "Cuenta creada. Revisa tu email.");
      navigate("/verify-email", { state: { email: data.email } });
    },
    onError: (error: AxiosError<{ message?: string }>) => {
      toast.error(error.response?.data?.message || "Ocurrió un error durante el registro.");
    }
  });

  // Logout function
  const logout = () => {
    logoutStore();
    navigate("/login");
    toast.success("Sesión cerrada.");
  };

  return {
    // State
    user,
    isAuthenticated,
    isLoading: isLoading || loginMutation.isPending || registerMutation.isPending,

    // Actions
    login: loginMutation.mutate,
    isLoggingIn: loginMutation.isPending,

    registerAccount: registerMutation.mutate,
    isRegistering: registerMutation.isPending,
    
    logout,
  };
};