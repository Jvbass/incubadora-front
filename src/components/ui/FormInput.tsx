
import type { ChangeEvent } from "react";
import type { CreateData } from "../../types";

// Componente Atómico: Input reutilizable con etiqueta, manejo de errores y soporte para TypeScript.
interface FormInputProps {
    label: string;
    id: keyof CreateData;
    helpText?: string;
    error?: string;
    children?: React.ReactNode;
    value: string | number;
    onChange: (
      e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => void;
    [x: string]: any; // Para props adicionales como type, placeholder, etc.
  }
  
  const FormInput = ({
    label,
    id,
    helpText,
    error,
    children,
    ...props
  }: FormInputProps) => (
    <div className="mb-6">
      <label
        htmlFor={id}
        className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-200"
      >
        {label}
      </label>
      {children ? (
        children
      ) : (
        <input
          id={id}
          name={id}
          {...props}
          className={`bg-gray-50 border ${
            error ? "border-red-500" : "border-gray-300"
          } text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500`}
          aria-invalid={!!error}
          aria-describedby={error ? `${id}-error` : undefined}
        />
      )}
      {helpText && !error && (
        <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
          {helpText}
        </p>
      )}
      {error && (
        <p
          id={`${id}-error`}
          className="mt-2 text-xs text-red-600 dark:text-red-500"
        >
          {error}
        </p>
      )}
    </div>
  );

export default FormInput