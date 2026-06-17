import { useRef, useState } from "react";
import apiService from "../../api/apiService";
import type { ImageUploadResponse } from "../../types";

const SQUOOSH_URL = "https://squoosh.app/";

// Modo inmediato: requiere endpoint + onUploadSuccess (comportamiento original).
// Modo diferido: requiere onFileSelected; NO realiza POST — el padre sube la imagen más tarde.
type ImageUploadProps =
  | {
      // ─── Modo inmediato (default) ───────────────────────────────────────────
      endpoint: string;
      onUploadSuccess: (urls: ImageUploadResponse) => void;
      onFileSelected?: never;
      deferred?: false;
      // Props opcionales comunes
      currentImageUrl?: string | null;
      onDeleteSuccess?: () => void;
      deleteEndpoint?: string;
      accept?: string;
      aspectHint?: string;
      maxSizeMB?: number;
      label?: string;
      variant?: "rectangle" | "avatar";
    }
  | {
      // ─── Modo diferido: solo valida + preview + devuelve File al padre ──────
      deferred: true;
      onFileSelected: (file: File) => void;
      endpoint?: never;
      onUploadSuccess?: never;
      // Props opcionales comunes
      currentImageUrl?: string | null;
      onDeleteSuccess?: never;
      deleteEndpoint?: never;
      accept?: string;
      aspectHint?: string;
      maxSizeMB?: number;
      label?: string;
      variant?: "rectangle" | "avatar";
    };

const ImageUpload = (props: ImageUploadProps) => {
  const {
    currentImageUrl,
    accept = "image/jpeg,image/png,image/webp",
    aspectHint,
    maxSizeMB = 1,
    label = "Imagen",
    variant = "rectangle",
    deferred = false,
  } = props;

  const inputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [sizeError, setSizeError] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const maxBytes = maxSizeMB * 1024 * 1024;
  const displayImage = preview ?? currentImageUrl ?? null;

  // Clases de la imagen de preview según la variante
  const isAvatar = variant === "avatar";
  const previewClasses = isAvatar
    ? "w-20 h-20 rounded-full object-cover border-2 border-border"
    : "rounded-md object-cover border border-border max-h-40";

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setSizeError(false);
    setUploadError(null);

    if (file.size > maxBytes) {
      setSizeError(true);
      if (inputRef.current) inputRef.current.value = "";
      return;
    }

    const localPreview = URL.createObjectURL(file);
    setPreview(localPreview);

    // Modo diferido: devolver el archivo al padre sin subir
    if (deferred) {
      (props as { onFileSelected: (f: File) => void }).onFileSelected(file);
      if (inputRef.current) inputRef.current.value = "";
      return;
    }

    // Modo inmediato: POST multipart al endpoint
    const formData = new FormData();
    formData.append("file", file);
    setIsUploading(true);

    try {
      const { data } = await apiService.post<ImageUploadResponse>(
        (props as { endpoint: string }).endpoint,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      (props as { onUploadSuccess: (u: ImageUploadResponse) => void }).onUploadSuccess(data);
    } catch (err: any) {
      const msg =
        err?.response?.data?.message ?? "Error al subir la imagen. Inténtalo de nuevo.";
      setUploadError(msg);
      setPreview(null);
    } finally {
      setIsUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  const handleDelete = async () => {
    if (!("deleteEndpoint" in props) || !props.deleteEndpoint) return;
    if (!confirm("¿Eliminar esta imagen?")) return;

    setIsDeleting(true);
    setUploadError(null);

    try {
      await apiService.delete(props.deleteEndpoint);
      setPreview(null);
      props.onDeleteSuccess?.();
    } catch {
      setUploadError("No se pudo eliminar la imagen. Inténtalo de nuevo.");
    } finally {
      setIsDeleting(false);
    }
  };

  // Variante avatar: layout compacto circular — sin label visible ni botones extra
  if (isAvatar) {
    return (
      <div className="flex flex-col items-center gap-2">
        {/* Preview circular o placeholder */}
        {displayImage ? (
          <img src={displayImage} alt="Avatar" className={previewClasses} />
        ) : (
          <div className="w-20 h-20 rounded-full bg-gray-200 dark:bg-gray-700 border-2 border-border flex items-center justify-center text-gray-400 text-xs">
            Sin imagen
          </div>
        )}

        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={isUploading || isDeleting}
          className="px-3 py-1 text-xs text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50"
        >
          {isUploading ? "Subiendo..." : displayImage ? "Cambiar" : "Subir"}
        </button>

        {sizeError && (
          <p className="text-xs text-red-600 text-center">
            El archivo supera {maxSizeMB} MB.{" "}
            <a href={SQUOOSH_URL} target="_blank" rel="noopener noreferrer" className="underline">
              squoosh.app
            </a>
          </p>
        )}
        {uploadError && <p className="text-xs text-red-600 text-center">{uploadError}</p>}

        <input ref={inputRef} type="file" accept={accept} className="hidden" onChange={handleFileChange} />
      </div>
    );
  }

  // ─── Variante rectangular (default) — comportamiento original intacto ────────
  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium dark:text-brand-100 text-text-main">
        {label}
        {aspectHint && (
          <span className="ml-1 text-xs text-gray-400">({aspectHint})</span>
        )}
      </label>

      {displayImage && (
        <img
          src={displayImage}
          alt="Preview"
          className={previewClasses}
        />
      )}

      <div className="flex flex-wrap gap-2 items-center">
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={isUploading || isDeleting}
          className="px-4 py-1.5 text-sm text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50"
        >
          {isUploading
            ? "Subiendo..."
            : deferred
            ? displayImage
              ? "Cambiar imagen"
              : "Seleccionar imagen"
            : displayImage
            ? "Cambiar imagen"
            : "Subir imagen"}
        </button>

        {"deleteEndpoint" in props && props.deleteEndpoint && currentImageUrl && !preview && (
          <button
            type="button"
            onClick={handleDelete}
            disabled={isDeleting || isUploading}
            className="px-4 py-1.5 text-sm text-white bg-red-600 rounded-md hover:bg-red-700 disabled:opacity-50"
          >
            {isDeleting ? "Eliminando..." : "Eliminar imagen"}
          </button>
        )}
      </div>

      {sizeError && (
        <p className="text-xs text-red-600">
          El archivo supera {maxSizeMB} MB. Comprímelo en{" "}
          <a
            href={SQUOOSH_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="underline"
          >
            squoosh.app
          </a>{" "}
          e inténtalo de nuevo.
        </p>
      )}

      {uploadError && (
        <p className="text-xs text-red-600">{uploadError}</p>
      )}

      <input
        ref={inputRef}
        type="file"
        accept={accept}
        className="hidden"
        onChange={handleFileChange}
      />
    </div>
  );
};

export default ImageUpload;
