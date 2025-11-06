import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { loginUser, registerUser } from "../api/queries";
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

  // Register and login mutation
  const registerAndLoginMutation = useMutation({
    mutationFn: async (data: RegisterRequest) => {
      // Step 1: Register user
      await registerUser(data);
      // Step 2: Login with new credentials
      const { username, password } = data;
      const tokenData = await loginUser({ username, password });
      return tokenData;
    },
    onMutate: () => {
      setLoading(true);
    },
    onSuccess: (data) => {
      loginStore(data.token);
      toast.success("¡Registro completado! Bienvenido.");
      navigate("/");
    },
    onError: (error: AxiosError<{ message?: string }>) => {
      setLoading(false);
      console.log("error", error)
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
    isLoading: isLoading || loginMutation.isPending || registerAndLoginMutation.isPending,

    // Actions
    login: loginMutation.mutate,
    isLoggingIn: loginMutation.isPending,

    registerAndLogin: registerAndLoginMutation.mutate,
    isRegisteringAndLoggingIn: registerAndLoginMutation.isPending,
    
    logout,
  };
};