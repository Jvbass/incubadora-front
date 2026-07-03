import { useState } from "react";
import Modal from "../../../components/ui/modal/Modal";

interface ReportActionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (adminMessage: string) => void;
  title: string;
  confirmLabel: string;
  confirmClass: string;
  isPending: boolean;
}

const ReportActionModal = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  confirmLabel,
  confirmClass,
  isPending,
}: ReportActionModalProps) => {
  const [message, setMessage] = useState("");

  const handleConfirm = () => {
    onConfirm(message);
    setMessage("");
  };

  const handleClose = () => {
    setMessage("");
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title={title}>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">
            Mensaje al usuario{" "}
            <span className="text-gray-500 font-normal">(opcional)</span>
          </label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            maxLength={500}
            rows={3}
            placeholder="Explica brevemente la decisión tomada..."
            className="w-full rounded-md bg-gray-700 border border-gray-600 text-white placeholder-gray-400 px-3 py-2 text-sm focus:outline-none focus:border-cyan-500 resize-none"
          />
          <p className="text-xs text-gray-500 mt-1 text-right">
            {message.length}/500
          </p>
        </div>
        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={handleClose}
            className="px-4 py-2 text-sm rounded-md bg-gray-600 text-white hover:bg-gray-500"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            disabled={isPending}
            className={`px-4 py-2 text-sm rounded-md text-white disabled:opacity-50 ${confirmClass}`}
          >
            {isPending ? "Procesando..." : confirmLabel}
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default ReportActionModal;
