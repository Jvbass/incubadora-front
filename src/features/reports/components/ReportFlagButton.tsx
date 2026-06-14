import { useState } from "react";
import { Flag } from "lucide-react";
import { useAuthZustand } from "../../../hooks/useAuthZustand";
import type { ReportContentType } from "../../../types";
import ReportModal from "./ReportModal";

interface ReportFlagButtonProps {
  contentType: ReportContentType;
  contentId: number;
  /** Texto corto que identifica lo reportado en el modal. */
  contentLabel: string;
  /** Username del autor del contenido: oculta la bandera en contenido propio. */
  ownerUsername: string;
  /** Tamaño del icono (por defecto 14, discreto). */
  size?: number;
  /** Texto opcional junto a la bandera (ej. "Reportar"). */
  label?: string;
  className?: string;
}

/**
 * Bandera de reporte discreta. No se renderiza si el usuario no está
 * autenticado o si es el autor del contenido (no puede auto-reportarse;
 * el backend también lo valida con 409).
 */
const ReportFlagButton = ({
  contentType,
  contentId,
  contentLabel,
  ownerUsername,
  size = 14,
  label,
  className = "",
}: ReportFlagButtonProps) => {
  const { user } = useAuthZustand();
  const [isModalOpen, setIsModalOpen] = useState(false);

  if (!user || user.username === ownerUsername) return null;

  return (
    <>
      <button
        type="button"
        onClick={() => setIsModalOpen(true)}
        title="Reportar"
        aria-label="Reportar contenido"
        className={`cursor-pointer inline-flex items-center gap-1 text-gray-400 hover:text-red-500 transition-colors ${className}`}
      >
        <Flag size={size} />
        {label && <span className="text-xs">{label}</span>}
      </button>
      <ReportModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        contentType={contentType}
        contentId={contentId}
        contentLabel={contentLabel}
      />
    </>
  );
};

export default ReportFlagButton;
