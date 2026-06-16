import { useRef, useState } from "react";
import apiService from "../../api/apiService";
import type { ImageUploadResponse } from "../../types";

const SQUOOSH_URL = "https://squoosh.app/";

interface ImageUploadProps {
  currentImageUrl?: string | null;
  onUploadSuccess: (urls: ImageUploadResponse) => void;
  onDeleteSuccess?: () => void;
  endpoint: string;
  deleteEndpoint?: string;
  accept?: string;
  aspectHint?: string;
  maxSizeMB?: number;
  label?: string;
}

const ImageUpload = ({
  currentImageUrl,
  onUploadSuccess,
  onDeleteSuccess,
  endpoint,
  deleteEndpoint,
  accept = "image/jpeg,image/png,image/webp",
  aspectHint,
  maxSizeMB = 1,
  label = "Imagen",
}: ImageUploadProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [sizeError, setSizeError] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const maxBytes = maxSizeMB * 1024 * 1024;
  const displayImage = preview ?? currentImageUrl ?? null;

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

    const formData = new FormData();
    formData.append("file", file);
    setIsUploading(true);

    try {
      const { data } = await apiService.post<ImageUploadResponse>(
        endpoint,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      onUploadSuccess(data);
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
    if (!deleteEndpoint) return;
    if (!confirm("¿Eliminar esta imagen?")) return;

    setIsDeleting(true);
    setUploadError(null);

    try {
      await apiService.delete(deleteEndpoint);
      setPreview(null);
      onDeleteSuccess?.();
    } catch {
      setUploadError("No se pudo eliminar la imagen. Inténtalo de nuevo.");
    } finally {
      setIsDeleting(false);
    }
  };

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
          className="rounded-md object-cover border border-border max-h-40"
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
            : displayImage
            ? "Cambiar imagen"
            : "Subir imagen"}
        </button>

        {deleteEndpoint && currentImageUrl && !preview && (
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
