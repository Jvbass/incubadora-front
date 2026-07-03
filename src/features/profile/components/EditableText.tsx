import { useState, type ReactNode } from "react";
import { Check, Pencil, X } from "lucide-react";

interface EditableTextProps {
  value: string;
  canEdit: boolean;
  onSave: (value: string) => void;
  isSaving?: boolean;
  multiline?: boolean;
  placeholder?: string;
  maxLength?: number;
  children: ReactNode;
}

/**
 * Muestra `children` tal cual; si `canEdit`, aparece un lápiz al pasar el
 * mouse que convierte el contenido en un input/textarea editable in-place.
 */
const EditableText = ({
  value,
  canEdit,
  onSave,
  isSaving,
  multiline,
  placeholder,
  maxLength,
  children,
}: EditableTextProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState(value);

  if (!canEdit) return <>{children}</>;

  const startEdit = () => {
    setDraft(value ?? "");
    setIsEditing(true);
  };

  const save = () => {
    onSave(draft.trim());
    setIsEditing(false);
  };

  if (!isEditing) {
    return (
      <div className="group relative flex items-start gap-2">
        <div className="min-w-0 flex-1">{children}</div>
        <button
          type="button"
          onClick={startEdit}
          title="Editar"
          aria-label="Editar"
          className="mt-1 shrink-0 cursor-pointer text-gray-400 transition-opacity hover:text-cta-600 md:opacity-0 md:group-hover:opacity-100"
        >
          <Pencil size={16} />
        </button>
      </div>
    );
  }

  const inputClasses =
    "w-full rounded-md border border-divider bg-bg-light p-2 text-sm text-text-main focus:border-cta-600 focus:outline-none dark:border-gray-700 dark:bg-bg-dark dark:text-text-light";

  return (
    <div className="flex w-full flex-col gap-2">
      {multiline ? (
        <textarea
          autoFocus
          rows={5}
          value={draft}
          maxLength={maxLength}
          placeholder={placeholder}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Escape") setIsEditing(false);
          }}
          className={inputClasses}
        />
      ) : (
        <input
          autoFocus
          value={draft}
          maxLength={maxLength}
          placeholder={placeholder}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") save();
            if (e.key === "Escape") setIsEditing(false);
          }}
          className={inputClasses}
        />
      )}
      <div className="flex gap-2">
        <button
          type="button"
          onClick={save}
          disabled={isSaving}
          className="flex cursor-pointer items-center gap-1 rounded-md bg-indigo-600 px-3 py-1 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-50"
        >
          <Check size={14} /> Guardar
        </button>
        <button
          type="button"
          onClick={() => setIsEditing(false)}
          className="flex cursor-pointer items-center gap-1 rounded-md bg-gray-200 px-3 py-1 text-sm text-gray-800 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
        >
          <X size={14} /> Cancelar
        </button>
      </div>
    </div>
  );
};

export default EditableText;
