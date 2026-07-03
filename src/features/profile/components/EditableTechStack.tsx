import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Pencil } from "lucide-react";
import { fetchTechnologies } from "../../../api/projectApi";
import MultiSelect from "../../projects/components/MultiSelect";
import type { Technology } from "../../../types";

interface EditableTechStackProps {
  techStack: Technology[];
  canEdit: boolean;
  isSaving: boolean;
  onSave: (techStackIds: number[]) => void;
}

/**
 * Chips del stack tecnológico; con `canEdit`, el lápiz abre el MultiSelect
 * de tecnologías in-place (mismo selector que el formulario de /settings).
 */
const EditableTechStack = ({
  techStack,
  canEdit,
  isSaving,
  onSave,
}: EditableTechStackProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  const { data: technologies, isLoading } = useQuery({
    queryKey: ["technologies"],
    queryFn: fetchTechnologies,
    staleTime: 1000 * 60 * 60,
    enabled: isEditing,
  });

  const options =
    technologies?.map((tech: Technology) => ({
      value: tech.id,
      label: tech.name,
    })) ?? [];

  const startEdit = () => {
    setSelectedIds(techStack.map((tech) => tech.id));
    setIsEditing(true);
  };

  const save = () => {
    onSave(selectedIds);
    setIsEditing(false);
  };

  const chips = (
    <div className="flex flex-wrap justify-center md:justify-start gap-2">
      {techStack.map((tech) => (
        <div
          key={tech.id}
          style={{
            borderColor: tech.techColor,
            backgroundColor: tech.techColor + "2A", // Opacidad
          }}
          className="px-2 py-0.5 border-1 text-xs font-small rounded-md flex items-center text-text-dark dark:text-text-light"
        >
          <span>{tech.name}</span>
        </div>
      ))}
      {canEdit && techStack.length === 0 && (
        <span className="text-sm text-gray-500">Añade tu stack</span>
      )}
    </div>
  );

  if (!canEdit) return chips;

  if (!isEditing) {
    return (
      <div className="group flex items-start gap-2">
        <div className="min-w-0 flex-1">{chips}</div>
        <button
          type="button"
          onClick={startEdit}
          title="Editar stack"
          aria-label="Editar stack"
          className="mt-0.5 shrink-0 cursor-pointer text-gray-400 transition-opacity hover:text-cta-600 md:opacity-0 md:group-hover:opacity-100"
        >
          <Pencil size={16} />
        </button>
      </div>
    );
  }

  // Objeto mínimo compatible con la prop `field` (react-hook-form) que
  // espera MultiSelect, manejado aquí con estado local.
  const field = {
    value: selectedIds,
    onChange: setSelectedIds,
    onBlur: () => {},
    name: "techStackIds",
    ref: () => {},
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } as any;

  return (
    <div className="flex w-full max-w-xl flex-col gap-2">
      <MultiSelect field={field} options={options} isLoading={isLoading} />
      <div className="flex gap-2">
        <button
          type="button"
          onClick={save}
          disabled={isSaving}
          className="cursor-pointer rounded-md bg-indigo-600 px-3 py-1 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-50"
        >
          Guardar
        </button>
        <button
          type="button"
          onClick={() => setIsEditing(false)}
          className="cursor-pointer rounded-md bg-gray-200 px-3 py-1 text-sm text-gray-800 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
        >
          Cancelar
        </button>
      </div>
    </div>
  );
};

export default EditableTechStack;
