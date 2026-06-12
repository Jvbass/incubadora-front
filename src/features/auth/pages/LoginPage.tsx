import { useForm, type SubmitHandler } from "react-hook-form";
import { Link } from "react-router-dom";
import { useAuthZustand } from "../../../hooks/useAuthZustand";
import AuthLayout from "../components/AuthLayout";
import {
  authError,
  authInput,
  authLabel,
  authLink,
  authMuted,
  authSubmit,
} from "../components/authStyles";

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
    <AuthLayout
      title="Iniciar Sesión"
      subtitle="Bienvenido de vuelta. Tu comunidad te espera."
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {/* Campo Usuario */}
        <div>
          <label htmlFor="username" className={authLabel}>
            Usuario
          </label>
          <input
            id="username"
            type="text"
            autoComplete="username"
            {...register("username", { required: "El usuario es requerido" })}
            className={authInput}
          />
          {errors.username && (
            <p className={authError}>{errors.username.message}</p>
          )}
        </div>

        {/* Campo Contraseña */}
        <div>
          <label htmlFor="password" className={authLabel}>
            Contraseña
          </label>
          <input
            id="password"
            type="password"
            autoComplete="current-password"
            {...register("password", {
              required: "La contraseña es requerida",
            })}
            className={authInput}
          />
          {errors.password && (
            <p className={authError}>{errors.password.message}</p>
          )}
        </div>

        <button type="submit" disabled={isLoggingIn} className={authSubmit}>
          {isLoggingIn ? "Ingresando..." : "Iniciar Sesión"}
        </button>
      </form>

      <p className={`${authMuted} text-center`}>
        ¿No tienes una cuenta?{" "}
        <Link to="/register" className={authLink}>
          Regístrate aquí
        </Link>
      </p>
    </AuthLayout>
  );
};

export default LoginPage;
