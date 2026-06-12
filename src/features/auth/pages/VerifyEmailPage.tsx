import { useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import type { AxiosError } from "axios";

import { verifyEmail, resendVerificationCode } from "../../../api/authApi";

interface VerifyEmailForm {
  email: string;
  code: string;
}

const RESEND_COOLDOWN_SECONDS = 60;

const VerifyEmailPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const emailFromRegister = (location.state as { email?: string } | null)?.email ?? "";

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
      toast.error(error.response?.data?.message || "No se pudo verificar el código.");
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
      toast.error(error.response?.data?.message || "No se pudo reenviar el código.");
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
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center text-gray-900">
          Verifica tu Email
        </h2>
        <p className="text-sm text-center text-gray-600">
          Te enviamos un código de 6 dígitos. Ingrésalo para activar tu cuenta.
        </p>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label htmlFor="email" className="text-sm font-medium text-gray-700">
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
              <p className="mt-1 text-xs text-red-600">{errors.email.message}</p>
            )}
          </div>
          <div>
            <label htmlFor="code" className="text-sm font-medium text-gray-700">
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
              className="w-full px-3 py-2 mt-1 text-center text-lg tracking-[0.5em] border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            />
            {errors.code && (
              <p className="mt-1 text-xs text-red-600">{errors.code.message}</p>
            )}
          </div>
          <button
            type="submit"
            disabled={verifyMutation.isPending}
            className="w-full py-2 text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-300"
          >
            {verifyMutation.isPending ? "Verificando..." : "Verificar"}
          </button>
        </form>
        <div className="text-sm text-center text-gray-600">
          ¿No recibiste el código?{" "}
          <button
            type="button"
            onClick={handleResend}
            disabled={resendMutation.isPending || resendCooldown > 0}
            className="font-medium text-indigo-600 hover:text-indigo-500 disabled:text-gray-400"
          >
            {resendCooldown > 0
              ? `Reenviar en ${resendCooldown}s`
              : resendMutation.isPending
                ? "Reenviando..."
                : "Reenviar código"}
          </button>
        </div>
        <p className="text-sm text-center text-gray-600">
          ¿Ya verificaste tu cuenta?{" "}
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

export default VerifyEmailPage;
