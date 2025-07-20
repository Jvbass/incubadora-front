import { useForm, type SubmitHandler } from "react-hook-form";

interface CommentFormInput {
  content: string;
}

interface CommentFormProps {
  onSubmit: (data: CommentFormInput) => Promise<void>;

  initialContent?: string;
  isSubmitting: boolean;
}

export const CommentForm = ({
  onSubmit,

  initialContent = "",
  isSubmitting,
}: CommentFormProps) => {
  const {
    register,
    handleSubmit,
    reset, // Obtenemos la función reset de useForm
    formState: { errors },
  } = useForm<CommentFormInput>({
    defaultValues: {
      content: initialContent,
    },
  });

  // Convertimos el handler en una función asíncrona
  const handleFormSubmit: SubmitHandler<CommentFormInput> = async (data) => {
    try {
      await onSubmit(data); // 1. Esperamos a que la mutación termine
      reset({ content: "" }); // 2. Si termina sin error, limpiamos el formulario
    } catch (error) {
      // 3. Si hay un error, la mutación ya mostró el toast.
      // No hacemos nada aquí para que el usuario pueda corregir su texto.
      console.error("La sumisión del comentario falló:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="mt-4">
      <textarea
        {...register("content", {
          required: "El comentario no puede estar vacío",
        })}
        rows={3}
        className="mt-1 block w-full bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded-md px-3 py-2 transition duration-300 ease focus:outline-none focus:border-blue-500 hover:border-blue-300 focus:shadow-sm"
        placeholder="Escribe tu respuesta..."
        disabled={isSubmitting} // Deshabilitamos mientras se envía
      />
      {errors.content && (
        <p className="text-xs text-red-600 mt-1">{errors.content.message}</p>
      )}
      <div className="flex justify-end items-center space-x-3 mt-2">
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-4 py-2 text-sm text-white bg-indigo-600 rounded-md hover:bg-indigo-700 disabled:opacity-50"
        >
          {isSubmitting ? "Publicando..." : "Publicar"}
        </button>
      </div>
    </form>
  );
};
