interface AvatarUsuarioProps {
  /** URL de la imagen del avatar (Cloudinary u otra). Puede ser null/undefined. */
  src?: string | null;
  /** Texto alternativo / nombre de usuario para el alt y el fallback de iniciales. */
  nombre: string;
  /** Clases de tamaño en Tailwind (ej: "w-8 h-8"). Por defecto "w-8 h-8". */
  tamano?: string;
  /** Forma del avatar. Por defecto "rounded-md". */
  forma?: "rounded-md" | "rounded-full" | "rounded-lg" | "rounded-none";
  /** Clases extra adicionales (ring, shadow, etc.). */
  className?: string;
}

/**
 * Avatar de usuario: muestra la imagen real si existe, o una inicial como fallback.
 * Compatible con URLs de Cloudinary y con cuentas sin imagen subida.
 */
const AvatarUsuario = ({
  src,
  nombre,
  tamano = "w-8 h-8",
  forma = "rounded-md",
  className = "",
}: AvatarUsuarioProps) => {
  const inicial = nombre ? nombre.charAt(0).toUpperCase() : "?";

  if (src) {
    return (
      <img
        src={src}
        alt={nombre}
        className={`${tamano} ${forma} object-cover ${className}`}
      />
    );
  }

  return (
    <div
      className={`${tamano} ${forma} bg-cta-600 flex items-center justify-center font-bold text-white text-sm flex-shrink-0 ${className}`}
      aria-label={nombre}
    >
      {inicial}
    </div>
  );
};

export default AvatarUsuario;
