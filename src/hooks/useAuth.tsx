// 2. CREACIÓN DEL HOOK

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { fetchUserData, loginUser, registerUser } from "../api/queries";
import type { RegisterRequest, UserProfileResponse  } from "../types";
import toast from "react-hot-toast";
import type { AxiosError } from "axios";

// Creamos el componente "Proveedor" que envolverá nuestra aplicación.
export const useAuth = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // 1. QUERY: Fuente de verdad para los datos del usuario.
  // Llama a la función `fetchUserData`
  const {
    data: user,
    isLoading,
    isError,
  } = useQuery<UserProfileResponse  | null>({
    queryKey: ["userData"],
    queryFn: async () => {
      // Si no hay token, no intentamos hacer la petición.
      if (!localStorage.getItem("authToken")) {
        return null;
      }
      try {
        // La petición se hará con el token gracias a tu interceptor de axios.
        return await fetchUserData();
      } catch (error) {
        // Si hay error de autenticación, limpiamos el token y devolvemos null
        localStorage.removeItem("authToken");
        return null;
      }
    },
    // Queremos que los datos del usuario se mantengan "frescos" durante toda la sesión
    // y solo se actualicen si nosotros lo indicamos (ej. al hacer login).
    staleTime: Infinity,
    retry: false, // Si falla una vez (token inválido), no reintentamos.
  });

  
  // 2. MUTATION: para manejar el Login.
  const loginMutation = useMutation({
    mutationFn: loginUser,
    onSuccess: (data) => {
      // Guardamos el token que nos devuelve la API.
      localStorage.setItem("authToken", data.token);

      // Invalidamos la query 'userData'. Esto le dice a React Query que
      // los datos del usuario están obsoletos y debe volver a pedirlos.
      // ¡Esto actualiza el estado 'user' en toda la app automáticamente!
      queryClient.invalidateQueries({ queryKey: ["userData"] });

      toast.success("¡Bienvenido de nuevo!");
      navigate("/"); // O a la ruta que corresponda.
    },
    onError: (error: AxiosError<{ message?: string }>) => {
      toast.error(error.response?.data?.message || "Credenciales incorrectas.");
    },
  });


  // 3. MUTATION: para manejar el Registro.
  const registerAndLoginMutation = useMutation({
    mutationFn: async (data: RegisterRequest) => {
      // Paso 1: Registrar al usuario.
      await registerUser(data);
      // Paso 2: Iniciar sesión con las credenciales recién creadas.
      const { username, password } = data;
      const tokenData = await loginUser({ username, password });
      return tokenData; // Esto se pasa al callback onSuccess.
    },
    onSuccess: (data) => {
      // Esta lógica es idéntica a la de un login exitoso.
      localStorage.setItem('authToken', data.token);
      queryClient.invalidateQueries({ queryKey: ['userData'] });
      toast.success('¡Registro completado! Bienvenido.');
      navigate('/'); // Redirige al home directamente.
    },
    onError: (error: AxiosError<{ message?: string }>) => {
      toast.error(error.response?.data?.message || 'Ocurrió un error durante el registro.');
    }
  });


  // 4. Función de Logout.
  const logout = () => {
    localStorage.removeItem("authToken");
    // Limpiamos toda la caché para asegurar que no queden datos del usuario anterior.
    queryClient.clear();
    navigate("/login");
    toast.success("Sesión cerrada.");
  };


  // 5. Return de todas las variables y funciones.
  return {
    // Datos y Estado
    user,
    isAuthenticated: !!user && !isError, // Es autenticado si hay datos de usuario y no hay error.
    isLoading, // Útil para mostrar un loader mientras se valida el token inicial.

    // Acciones
    login: loginMutation.mutate,
    isLoggingIn: loginMutation.isPending,

    registerAndLogin: registerAndLoginMutation.mutate,
    isRegisteringAndLoggingIn: registerAndLoginMutation.isPending,
    logout,
  };
};
