import { useState } from "react";
import { Pencil, Plus, Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import type { Language } from "../../../types";

type LanguageDraft = Omit<Language, "id">;

interface EditableLanguagesProps {
  languages: Language[];
  canEdit: boolean;
  isSaving: boolean;
  onSave: (languages: LanguageDraft[]) => void;
}

const PROFICIENCIES = ["Básico", "Intermedio", "Avanzado", "Nativo"];

/**
 * Chips de idiomas; con `canEdit`, el lápiz abre un mini-editor in-place
 * con filas idioma + nivel, añadir y eliminar.
 */
const EditableLanguages = ({
  languages,
  canEdit,
  isSaving,
  onSave,
}: EditableLanguagesProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [drafts, setDrafts] = useState<LanguageDraft[]>([]);

  const startEdit = () => {
    setDrafts(
      languages.map(({ language, proficiency }) => ({ language, proficiency }))
    );
    setIsEditing(true);
  };

  const save = () => {
    const cleaned = drafts
      .map((d) => ({ ...d, language: d.language.trim() }))
      .filter((d) => d.language !== "");
    if (cleaned.some((d) => !d.proficiency)) {
      toast.error("Selecciona el nivel de cada idioma.");
      return;
    }
    onSave(cleaned);
    setIsEditing(false);
  };

  const updateDraft = (index: number, patch: Partial<LanguageDraft>) => {
    setDrafts(drafts.map((d, i) => (i === index ? { ...d, ...patch } : d)));
  };

  const chips = (
    <div className="flex flex-wrap justify-center md:justify-start gap-2 text-sm text-gray-600 dark:text-gray-400">
      {languages.map((lang) => (
        <span
          key={lang.id}
          className="px-2 py-0.5 rounded bg-gray-200 dark:bg-gray-800"
        >
          {lang.language} ({lang.proficiency})
        </span>
      ))}
      {canEdit && languages.length === 0 && (
        <span className="text-gray-500">Añade tus idiomas</span>
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
          title="Editar idiomas"
          aria-label="Editar idiomas"
          className="mt-0.5 shrink-0 cursor-pointer text-gray-400 transition-opacity hover:text-cta-600 md:opacity-0 md:group-hover:opacity-100"
        >
          <Pencil size={16} />
        </button>
      </div>
    );
  }

  const inputClasses =
    "rounded-md border border-divider bg-bg-light p-2 text-sm text-text-main focus:border-cta-600 focus:outline-none dark:border-gray-700 dark:bg-bg-dark dark:text-text-light";

  return (
    <div className="flex w-full max-w-xl flex-col gap-2">
      {drafts.map((draft, index) => (
        <div key={index} className="flex items-center gap-2">
          <input
            value={draft.language}
            onChange={(e) => updateDraft(index, { language: e.target.value })}
            placeholder="Idioma"
            maxLength={50}
            className={`${inputClasses} flex-1`}
          />
          <select
            value={draft.proficiency}
            onChange={(e) =>
              updateDraft(index, { proficiency: e.target.value })
            }
            className={inputClasses}
          >
            <option value="">Nivel</option>
            {PROFICIENCIES.map((level) => (
              <option key={level} value={level}>
                {level}
              </option>
            ))}
          </select>
          <button
            type="button"
            onClick={() => setDrafts(drafts.filter((_, i) => i !== index))}
            title="Eliminar idioma"
            className="cursor-pointer text-gray-400 hover:text-red-500"
          >
            <Trash2 size={16} />
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={() => setDrafts([...drafts, { language: "", proficiency: "" }])}
        className="flex w-fit cursor-pointer items-center gap-1 text-sm text-cta-600 hover:underline"
      >
        <Plus size={14} /> Añadir idioma
      </button>
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

export default EditableLanguages;
