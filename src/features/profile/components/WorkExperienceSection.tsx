import { useState } from "react";
import { BriefcaseBusiness, Pencil, Plus, Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import type { WorkExperience } from "../../../types";

type ExperienceDraft = Omit<WorkExperience, "id">;

interface WorkExperienceSectionProps {
  experiences: WorkExperience[];
  canEdit: boolean;
  isSaving: boolean;
  onSave: (experiences: ExperienceDraft[]) => void;
}

const CURRENT_YEAR = new Date().getFullYear();

const emptyDraft = (): ExperienceDraft => ({
  companyName: "",
  position: "",
  description: "",
  startYear: CURRENT_YEAR,
  endYear: undefined,
});

const toDraft = (exp: WorkExperience): ExperienceDraft => ({
  companyName: exp.companyName,
  position: exp.position,
  description: exp.description,
  startYear: exp.startYear,
  endYear: exp.endYear,
});

/**
 * Timeline de experiencia laboral. Si `canEdit`, cada entrada se puede
 * editar in-place (incluyendo años de inicio/fin), eliminar, y se pueden
 * añadir entradas nuevas sin pasar por /settings.
 */
const WorkExperienceSection = ({
  experiences,
  canEdit,
  isSaving,
  onSave,
}: WorkExperienceSectionProps) => {
  // null = sin edición; -1 = entrada nueva; >= 0 = índice en edición
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [draft, setDraft] = useState<ExperienceDraft>(emptyDraft());

  if (!canEdit && experiences.length === 0) return null;

  const startEdit = (index: number) => {
    setDraft(toDraft(experiences[index]));
    setEditingIndex(index);
  };

  const startAdd = () => {
    setDraft(emptyDraft());
    setEditingIndex(-1);
  };

  const cancel = () => setEditingIndex(null);

  const validate = (): string | null => {
    if (!draft.position.trim()) return "El cargo es obligatorio.";
    if (!draft.companyName.trim()) return "La empresa es obligatoria.";
    if (
      !draft.startYear ||
      draft.startYear < 1950 ||
      draft.startYear > CURRENT_YEAR
    )
      return `El año de inicio debe estar entre 1950 y ${CURRENT_YEAR}.`;
    if (draft.endYear != null && draft.endYear < draft.startYear)
      return "El año de fin no puede ser anterior al de inicio.";
    if (draft.endYear != null && draft.endYear > CURRENT_YEAR + 1)
      return `El año de fin no puede ser mayor a ${CURRENT_YEAR + 1}.`;
    return null;
  };

  const save = () => {
    const error = validate();
    if (error) {
      toast.error(error);
      return;
    }
    const cleaned: ExperienceDraft = {
      ...draft,
      companyName: draft.companyName.trim(),
      position: draft.position.trim(),
      description: draft.description?.trim() ?? "",
    };
    const updated =
      editingIndex === -1
        ? [...experiences.map(toDraft), cleaned]
        : experiences.map((exp, i) =>
            i === editingIndex ? cleaned : toDraft(exp)
          );
    onSave(updated);
    setEditingIndex(null);
  };

  const remove = (index: number) => {
    if (!window.confirm("¿Eliminar esta experiencia laboral?")) return;
    onSave(experiences.filter((_, i) => i !== index).map(toDraft));
    setEditingIndex(null);
  };

  const yearInputClasses =
    "w-28 rounded-md border border-divider bg-bg-light p-2 text-sm text-text-main focus:border-cta-600 focus:outline-none dark:border-gray-700 dark:bg-bg-dark dark:text-text-light";
  const textInputClasses =
    "block w-full rounded-md border border-divider bg-bg-light p-2 text-sm text-text-main focus:border-cta-600 focus:outline-none dark:border-gray-700 dark:bg-bg-dark dark:text-text-light";

  const editForm = (
    <div className="space-y-2 rounded-md border border-divider p-4 dark:border-gray-700">
      <input
        autoFocus
        value={draft.position}
        onChange={(e) => setDraft({ ...draft, position: e.target.value })}
        placeholder="Cargo"
        maxLength={100}
        className={textInputClasses}
      />
      <input
        value={draft.companyName}
        onChange={(e) => setDraft({ ...draft, companyName: e.target.value })}
        placeholder="Empresa"
        maxLength={100}
        className={textInputClasses}
      />
      <div className="flex flex-wrap items-center gap-2">
        <input
          type="number"
          value={draft.startYear ?? ""}
          onChange={(e) =>
            setDraft({ ...draft, startYear: Number(e.target.value) })
          }
          placeholder="Año inicio"
          min={1950}
          max={CURRENT_YEAR}
          className={yearInputClasses}
        />
        <span className="text-sm text-gray-600 dark:text-gray-300">—</span>
        <input
          type="number"
          value={draft.endYear ?? ""}
          onChange={(e) =>
            setDraft({
              ...draft,
              endYear:
                e.target.value === "" ? undefined : Number(e.target.value),
            })
          }
          placeholder="Año fin"
          min={1950}
          max={CURRENT_YEAR + 1}
          className={yearInputClasses}
        />
        <span className="text-xs text-gray-500 dark:text-gray-400">
          (vacío = Actualmente)
        </span>
      </div>
      <textarea
        value={draft.description ?? ""}
        onChange={(e) => setDraft({ ...draft, description: e.target.value })}
        placeholder="Descripción de tus tareas"
        rows={3}
        maxLength={1000}
        className={textInputClasses}
      />
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
          onClick={cancel}
          className="cursor-pointer rounded-md bg-gray-200 px-3 py-1 text-sm text-gray-800 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
        >
          Cancelar
        </button>
      </div>
    </div>
  );

  return (
    <section className="container">
      <div className="flex flex-col justify-baseline items-left mb-4 text-text-main dark:text-text-light">
        <div className="flex items-center gap-3">
          <h3 className="text-3xl font-semibold flex items-center gap-1 me-2">
            <BriefcaseBusiness size={20} /> Experiencia laboral{" "}
          </h3>
          {canEdit && editingIndex === null && (
            <button
              type="button"
              onClick={startAdd}
              className="flex cursor-pointer items-center gap-1 rounded-full border border-cta-600 px-3 py-1 text-sm font-medium text-cta-600 transition-all duration-200 hover:bg-brand-900"
            >
              <Plus size={14} /> Añadir
            </button>
          )}
        </div>

        {experiences.length === 0 && editingIndex === null && (
          <p className="mt-4 text-gray-500">
            Aún no has añadido experiencia laboral.
          </p>
        )}

        <div className="relative border-l border-gray-700 ml-4 mt-4">
          {experiences.map((exp, index) => (
            <div key={exp.id ?? index} className="mb-10 ml-6 ">
              {/* Punto en la línea */}
              <span className="absolute -left-3 flex h-6 w-6 items-center justify-center rounded-full bg-cta-600 "></span>

              {editingIndex === index ? (
                editForm
              ) : (
                <div className="group relative">
                  <h4 className="text-lg font-bold dark:text-cta-300 text-cta-600">
                    {exp.position}
                  </h4>
                  <p className="text-gray-800 dark:text-gray-200 font-semibold">
                    {exp.companyName}
                  </p>
                  <span className="text-sm text-gray-600 dark:text-gray-300">
                    {exp.startYear} -{" "}
                    {exp.endYear ? exp.endYear : "Actualmente"}
                  </span>
                  <p className="mt-2 text-gray-800 dark:text-gray-200 max-w-2xl">
                    {exp.description}
                  </p>
                  {canEdit && editingIndex === null && (
                    <div className="absolute right-0 top-0 flex gap-2 md:opacity-0 md:transition-opacity md:group-hover:opacity-100">
                      <button
                        type="button"
                        onClick={() => startEdit(index)}
                        title="Editar experiencia"
                        className="cursor-pointer text-gray-400 hover:text-cta-600"
                      >
                        <Pencil size={16} />
                      </button>
                      <button
                        type="button"
                        onClick={() => remove(index)}
                        title="Eliminar experiencia"
                        className="cursor-pointer text-gray-400 hover:text-red-500"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}

          {/* Entrada nueva */}
          {editingIndex === -1 && (
            <div className="mb-10 ml-6">
              <span className="absolute -left-3 flex h-6 w-6 items-center justify-center rounded-full bg-cta-600 "></span>
              {editForm}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default WorkExperienceSection;
