import { useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import type { AxiosError } from "axios";

import { verifyEmail, resendVerificationCode } from "../../../api/authApi";
import AuthLayout from "../components/AuthLayout";
import {
  authError,
  authInput,
  authLabel,
  authLink,
  authMuted,
  authSubmit,
} from "../components/authStyles";

interface VerifyEmailForm {
  email: string;
  code: string;
}

const RESEND_COOLDOWN_SECONDS = 60;

const VerifyEmailPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const emailFromRegister =
    (location.state as { email?: string } | null)?.email ?? "";

  const [resendCooldown, setResendCooldown] = useState(0);

  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm<VerifyEmailForm>({
    defaultValues: { email: emailFromRegister, code: "" },
  });

  const verifyMutation = useMutation({
    mutationFn: verifyEmail,
    onSuccess: () => {
      toast.success("¡Email verificado! Ya puedes iniciar sesión.");
      navigate("/login");
    },
    onError: (error: AxiosError<{ message?: string }>) => {
      toast.error(
        error.response?.data?.message || "No se pudo verificar el código."
      );
    },
  });

  const resendMutation = useMutation({
    mutationFn: resendVerificationCode,
    onSuccess: () => {
      toast.success("Código reenviado. Revisa tu email.");
      setResendCooldown(RESEND_COOLDOWN_SECONDS);
      const interval = setInterval(() => {
        setResendCooldown((s) => {
          if (s <= 1) {
            clearInterval(interval);
            return 0;
          }
          return s - 1;
        });
      }, 1000);
    },
    onError: (error: AxiosError<{ message?: string }>) => {
      toast.error(
        error.response?.data?.message || "No se pudo reenviar el código."
      );
    },
  });

  const onSubmit: SubmitHandler<VerifyEmailForm> = (data) => {
    verifyMutation.mutate({ email: data.email.trim(), code: data.code.trim() });
  };

  const handleResend = () => {
    const email = getValues("email").trim();
    if (!email) {
      toast.error("Ingresa tu email para reenviar el código.");
      return;
    }
    resendMutation.mutate(email);
  };

  return (
    <AuthLayout
      title="Verifica tu Email"
      subtitle="Te enviamos un código de 6 dígitos. Ingrésalo para activar tu cuenta."
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
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
          <label htmlFor="code" className={authLabel}>
            Código de Verificación
          </label>
          <input
            id="code"
            type="text"
            inputMode="numeric"
            maxLength={6}
            placeholder="123456"
            {...register("code", {
              required: "El código es requerido",
              pattern: {
                value: /^\d{6}$/,
                message: "El código debe ser de 6 dígitos",
              },
            })}
            className={`${authInput} text-center text-lg tracking-[0.5em]`}
          />
          {errors.code && <p className={authError}>{errors.code.message}</p>}
        </div>
        <button
          type="submit"
          disabled={verifyMutation.isPending}
          className={authSubmit}
        >
          {verifyMutation.isPending ? "Verificando..." : "Verificar"}
        </button>
      </form>

      <div className={`${authMuted} text-center`}>
        ¿No recibiste el código?{" "}
        <button
          type="button"
          onClick={handleResend}
          disabled={resendMutation.isPending || resendCooldown > 0}
          className={`${authLink} disabled:text-text-soft disabled:no-underline disabled:cursor-not-allowed`}
        >
          {resendCooldown > 0
            ? `Reenviar en ${resendCooldown}s`
            : resendMutation.isPending
              ? "Reenviando..."
              : "Reenviar código"}
        </button>
      </div>

      <p className={`${authMuted} text-center`}>
        ¿Ya verificaste tu cuenta?{" "}
        <Link to="/login" className={authLink}>
          Inicia sesión aquí
        </Link>
      </p>
    </AuthLayout>
  );
};

export default VerifyEmailPage;
