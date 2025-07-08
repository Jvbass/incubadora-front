// src/components/common/MultiSelect.tsx

import Select from "react-select";
import type { ControllerRenderProps } from "react-hook-form";

// Definimos los tipos para las props que nuestro componente recibirá
interface Option {
  value: number;
  label: string;
}

interface MultiSelectProps {
  field: ControllerRenderProps<any, any>; // Objeto 'field' de react-hook-form
  options: Option[];
  placeholder?: string;
  isLoading?: boolean;
}

const MultiSelect = ({
  field,
  options,
  placeholder,
  isLoading,
}: MultiSelectProps) => {
  // `react-select` trabaja con objetos {value, label}.
  // `react-hook-form` nos da un array de IDs (números).
  // Necesitamos convertir el valor del formulario al formato que react-select entiende.
  const currentValue = options.filter((option) =>
    field.value?.includes(option.value)
  );

  return (
    <Select
      {...field}
      value={currentValue}
      isMulti
      options={options}
      isLoading={isLoading}
      placeholder={placeholder || "Selecciona..."}
      // Al cambiar, convertimos de vuelta el array de objetos al array de IDs
      // que react-hook-form espera.
      onChange={(selectedOptions) => {
        field.onChange(
          selectedOptions ? selectedOptions.map((option) => option.value) : []
        );
      }}
      // Estilos para que se parezca a los otros inputs de Tailwind
      styles={{
        control: (base) => ({
          ...base,
          borderColor: "#d1d5db", // border-gray-300
          boxShadow: "none",
          "&:hover": {
            borderColor: "#a5b4fc", // focus:border-indigo-500
          },
        }),
      }}
    />
  );
};

export default MultiSelect;
