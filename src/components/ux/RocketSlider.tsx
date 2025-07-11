import { useWatch } from "react-hook-form";
import type { ControllerRenderProps, Control } from "react-hook-form";

interface RocketSliderProps {
  // Pasamos el 'field' y 'control' directamente desde el Controller de React Hook Form
  field: ControllerRenderProps<any, any>;
  control: Control<any>;
  min?: number;
  max?: number;
  step?: number;
}

export const RocketSlider = ({
  field,
  control,
  min = 1,
  max = 10,
  step = 1,
}: RocketSliderProps) => {
  // Obtenemos el valor actual para mostrarlo y calcular la posición
  const currentValue = useWatch({ control, name: field.name }) || min;

  // Calculamos el porcentaje de la posición del cohete y la barra de progreso
  const percentage = ((currentValue - min) / (max - min)) * 100;

  return (
    <div className="relative w-full py-4">
      <div className="relative h-2 bg-gray-200 rounded-full">
        <div
          className="absolute h-2 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full"
          style={{ width: `${percentage}%` }}
        />
        <span
          className="absolute text-3xl -top-4 transform -translate-x-1/2 transition-all duration-150 ease-in-out"
          style={{ left: `${percentage}%` }}
        >
          🚀
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        {...field}
        onChange={(e) => field.onChange(parseInt(e.target.value, 10))} // Aseguramos que el valor sea numérico
        className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer"
      />
      <div className="text-center mt-3">
        <span className="text-lg font-semibold text-gray-700 bg-gray-100 px-3 py-1 rounded-md">
          {currentValue} / {max}
        </span>
      </div>
    </div>
  );
};
