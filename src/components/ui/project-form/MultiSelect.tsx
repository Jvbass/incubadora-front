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
      onChange={(selectedOptions) => {
        field.onChange(
          selectedOptions ? selectedOptions.map((option) => option.value) : []
        );
      }}

      // Estilizando el select
      styles={{
        control: (base) => ({
          ...base,
          borderColor: "#d1d5db", // border-gray-300
          boxShadow: "none",
          "&:hover": {
            borderColor: "#a5b4fc", // focus:border-indigo-500
          },
        }),
        option: (base, { isFocused, isSelected }) => ({
          ...base,
          color: "#000000", // text-gray-200
          backgroundColor: isSelected
            ? "#4f46e5" // indigo-600 para la opción seleccionada
            : isFocused
            ? "#a5b4fc" // bg-gray-700 para la opción con hover/focus
            : "transparent", // Fondo transparente por defecto
          "&:active": {
            backgroundColor: "#4338ca", // indigo-700
          },
        }),
      }}
    />
  );
};

export default MultiSelect;
