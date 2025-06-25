import { useForm, type SubmitHandler } from "react-hook-form";

import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";

import { AxiosError } from "axios";
import { useAuth } from "../../hooks/useAuth";
import type { RegisterRequest } from "../../types";

const RegisterPage = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterRequest>();
  const { registerAndLogin } = useAuth();
  const navigate = useNavigate();

  const onSubmit: SubmitHandler<RegisterRequest> = async (data) => {
    try {
      await registerAndLogin(data);
      toast.success("¡Registro exitoso! Bienvenido.");
      navigate("/"); // Redirige a la raíz para que RoleBasedRedirect haga su trabajo.
    } catch (error) {
      console.error(error);
      let errorMessage = "Ocurrió un error inesperado.";
      if (error instanceof AxiosError && error.response) {
        // Asumiendo que el backend envía un campo 'message' en el cuerpo del error
        errorMessage = error.response.data.message || "Error en el registro.";
      }
      toast.error(errorMessage);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center text-gray-900">
          Crear una Cuenta
        </h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Campos del formulario */}
          <div>
            <label
              htmlFor="username"
              className="text-sm font-medium text-gray-700"
            >
              Usuario
            </label>
            <input
              id="username"
              type="text"
              {...register("username", {
                required: "El nombre de usuario es requerido",
              })}
              className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            />
            {errors.username && (
              <p className="mt-1 text-xs text-red-600">
                {errors.username.message}
              </p>
            )}
          </div>
          <div>
            <label
              htmlFor="email"
              className="text-sm font-medium text-gray-700"
            >
              Correo Electrónico
            </label>
            <input
              id="email"
              type="email"
              {...register("email", {
                required: "El correo electrónico es requerido",
              })}
              className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            />
            {errors.email && (
              <p className="mt-1 text-xs text-red-600">
                {errors.email.message}
              </p>
            )}
          </div>
          <div>
            <label
              htmlFor="password"
              className="text-sm font-medium text-gray-700"
            >
              Contraseña
            </label>
            <input
              id="password"
              type="password"
              {...register("password", {
                required: "La contraseña es requerida",
              })}
              className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            />
            {errors.password && (
              <p className="mt-1 text-xs text-red-600">
                {errors.password.message}
              </p>
            )}
          </div>
          <div>
            <label
              htmlFor="firstName"
              className="text-sm font-medium text-gray-700"
            >
              Nombre
            </label>
            <input
              id="firstName"
              type="text"
              {...register("firstName", { required: "El nombre es requerido" })}
              className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            />
            {errors.firstName && (
              <p className="mt-1 text-xs text-red-600">
                {errors.firstName.message}
              </p>
            )}
          </div>
          <div>
            <label
              htmlFor="lastName"
              className="text-sm font-medium text-gray-700"
            >
              Apellido
            </label>
            <input
              id="lastName"
              type="text"
              {...register("lastName", {
                required: "El apellido es requerido",
              })}
              className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            />
            {errors.lastName && (
              <p className="mt-1 text-xs text-red-600">
                {errors.lastName.message}
              </p>
            )}
          </div>
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-2 text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-300"
          >
            {isSubmitting ? "Registrando..." : "Registrarse"}
          </button>
        </form>
        <p className="text-sm text-center text-gray-600">
          ¿Ya tienes una cuenta?{" "}
          <Link
            to="/login"
            className="font-medium text-indigo-600 hover:text-indigo-500"
          >
            Inicia sesión aquí
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
