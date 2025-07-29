import { useForm, type SubmitHandler } from "react-hook-form";
import { Link } from "react-router-dom";
import { useAuthZustand } from "../../hooks/useAuthZustand";
import Loading from "../../components/ux/Loading";

type LoginFormData = {
  username: string;
  password: string;
};

const LoginPage = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>();
  const { login, isLoggingIn } = useAuthZustand();

  const onSubmit: SubmitHandler<LoginFormData> = (data) => {
    login(data);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 ">
      <div className="w-full max-w-sm p-8 space-y-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center text-gray-900">
          Iniciar Sesión
        </h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Campo Usuario */}
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
              {...register("username", { required: "El usuario es requerido" })}
              className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            />
            {errors.username && (
              <p className="mt-1 text-xs text-red-600">
                {errors.username.message}
              </p>
            )}
          </div>

          {/* Campo Contraseña */}
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

          <button
            type="submit"
            disabled={isLoggingIn}
            className="w-full py-2 text-black bg-indigo-600 rounded-md hover:bg-indigo-700 disabled:bg-indigo-300"
          >
            {isLoggingIn ? <Loading message="..." /> : "Iniciar Sesión"}
          </button>
        </form>
        <p className="text-sm text-center text-gray-600">
          ¿No tienes una cuenta?{" "}
          <Link
            to="/register"
            className="font-medium text-indigo-600 hover:text-indigo-500"
          >
            Regístrate aquí
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
