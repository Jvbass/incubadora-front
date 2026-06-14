import { useState } from "react";
import { Pencil, Plus, Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import type { SocialLink } from "../../../types";

type SocialLinkDraft = Omit<SocialLink, "id">;

interface EditableSocialLinksProps {
  socialLinks: SocialLink[];
  canEdit: boolean;
  isSaving: boolean;
  onSave: (socialLinks: SocialLinkDraft[]) => void;
}

/**
 * Enlaces sociales del header del perfil; con `canEdit`, el lápiz abre un
 * mini-editor in-place con filas plataforma + URL, añadir y eliminar.
 */
const EditableSocialLinks = ({
  socialLinks,
  canEdit,
  isSaving,
  onSave,
}: EditableSocialLinksProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [drafts, setDrafts] = useState<SocialLinkDraft[]>([]);

  const startEdit = () => {
    setDrafts(socialLinks.map(({ platform, url }) => ({ platform, url })));
    setIsEditing(true);
  };

  const save = () => {
    const cleaned = drafts
      .map((d) => ({ platform: d.platform.trim(), url: d.url.trim() }))
      .filter((d) => d.platform !== "" || d.url !== "");
    if (cleaned.some((d) => !d.platform || !d.url)) {
      toast.error("Cada red social necesita plataforma y URL.");
      return;
    }
    onSave(cleaned);
    setIsEditing(false);
  };

  const updateDraft = (index: number, patch: Partial<SocialLinkDraft>) => {
    setDrafts(drafts.map((d, i) => (i === index ? { ...d, ...patch } : d)));
  };

  const links = (
    <>
      {socialLinks.map((link) => (
        <a
          key={link.id}
          href={link.url}
          className="text-indigo-600 hover:underline text-sm"
        >
          {link.platform}
        </a>
      ))}
      {canEdit && socialLinks.length === 0 && (
        <span className="text-gray-500">Añade tus redes</span>
      )}
    </>
  );

  if (!canEdit) return links;

  if (!isEditing) {
    return (
      <span className="group inline-flex items-center gap-3">
        {links}
        <button
          type="button"
          onClick={startEdit}
          title="Editar redes sociales"
          aria-label="Editar redes sociales"
          className="shrink-0 cursor-pointer text-gray-400 transition-opacity hover:text-cta-600 md:opacity-0 md:group-hover:opacity-100"
        >
          <Pencil size={16} />
        </button>
      </span>
    );
  }

  const inputClasses =
    "rounded-md border border-divider bg-bg-light p-2 text-sm text-text-main focus:border-cta-600 focus:outline-none dark:border-gray-700 dark:bg-bg-dark dark:text-text-light";

  return (
    <div className="flex w-full max-w-xl flex-col gap-2">
      {drafts.map((draft, index) => (
        <div key={index} className="flex items-center gap-2">
          <input
            value={draft.platform}
            onChange={(e) => updateDraft(index, { platform: e.target.value })}
            placeholder="Plataforma (ej: LinkedIn)"
            maxLength={50}
            className={`${inputClasses} w-40`}
          />
          <input
            value={draft.url}
            onChange={(e) => updateDraft(index, { url: e.target.value })}
            placeholder="URL del perfil"
            maxLength={255}
            className={`${inputClasses} flex-1`}
          />
          <button
            type="button"
            onClick={() => setDrafts(drafts.filter((_, i) => i !== index))}
            title="Eliminar red social"
            className="cursor-pointer text-gray-400 hover:text-red-500"
          >
            <Trash2 size={16} />
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={() => setDrafts([...drafts, { platform: "", url: "" }])}
        className="flex w-fit cursor-pointer items-center gap-1 text-sm text-cta-600 hover:underline"
      >
        <Plus size={14} /> Añadir red social
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

export default EditableSocialLinks;
