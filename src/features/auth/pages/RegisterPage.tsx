import { useForm, type SubmitHandler } from "react-hook-form";

import type { RegisterRequest } from "../../../types";
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

const RegisterPage = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterRequest>();

  const { registerAccount, isRegistering } = useAuthZustand();

  const onSubmit: SubmitHandler<RegisterRequest> = (data) => {
    registerAccount(data);
  };

  return (
    <AuthLayout
      title="Crear una Cuenta"
      subtitle="Únete y empieza a construir tu portafolio."
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div>
          <label htmlFor="username" className={authLabel}>
            Usuario
          </label>
          <input
            id="username"
            type="text"
            autoComplete="username"
            {...register("username", {
              required: "El nombre de usuario es requerido",
            })}
            className={authInput}
          />
          {errors.username && (
            <p className={authError}>{errors.username.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="email" className={authLabel}>
            Correo Electrónico
          </label>
          <input
            id="email"
            type="email"
            autoComplete="email"
            {...register("email", {
              required: "El correo electrónico es requerido",
            })}
            className={authInput}
          />
          {errors.email && <p className={authError}>{errors.email.message}</p>}
        </div>

        <div>
          <label htmlFor="password" className={authLabel}>
            Contraseña
          </label>
          <input
            id="password"
            type="password"
            autoComplete="new-password"
            {...register("password", {
              required: "La contraseña es requerida",
            })}
            className={authInput}
          />
          {errors.password && (
            <p className={authError}>{errors.password.message}</p>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="firstName" className={authLabel}>
              Nombre
            </label>
            <input
              id="firstName"
              type="text"
              autoComplete="given-name"
              {...register("firstName", {
                required: "El nombre es requerido",
              })}
              className={authInput}
            />
            {errors.firstName && (
              <p className={authError}>{errors.firstName.message}</p>
            )}
          </div>
          <div>
            <label htmlFor="lastName" className={authLabel}>
              Apellido
            </label>
            <input
              id="lastName"
              type="text"
              autoComplete="family-name"
              {...register("lastName", {
                required: "El apellido es requerido",
              })}
              className={authInput}
            />
            {errors.lastName && (
              <p className={authError}>{errors.lastName.message}</p>
            )}
          </div>
        </div>

        <button type="submit" disabled={isRegistering} className={authSubmit}>
          {isRegistering ? "Registrando..." : "Registrarse"}
        </button>
      </form>

      <p className={`${authMuted} text-center`}>
        ¿Ya tienes una cuenta?{" "}
        <Link to="/login" className={authLink}>
          Inicia sesión aquí
        </Link>
      </p>
    </AuthLayout>
  );
};

export default RegisterPage;
