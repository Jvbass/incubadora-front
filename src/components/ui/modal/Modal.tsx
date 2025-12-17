import React, { useEffect } from "react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
}

const Modal = ({ isOpen, onClose, children, title }: ModalProps) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center bg-transparent backdrop-blur-sm transition-opacity duration-200"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative flex flex-col w-11/12 rounded-lg bg-gray-800 text-white shadow-2xl transform transition-all duration-200 ease-in-out scale-95 opacity-0 animate-scale-in max-h-[95vh] max-w-[90vw]"
        style={{ animation: "scaleIn 0.2s forwards" }}
      >
        {/* Header */}
        <div className="flex-shrink-0 p-4 border-b border-gray-700 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-cyan-400">{title}</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white cursor-pointer text-2xl"
          >
            &times;
          </button>
        </div>

        {/* Content */}
        <div className="flex-grow p-6 overflow-y-auto text-text-main dark:text-text-light">
          {children}
        </div>
      </div>
      <style>{`
        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
      `}</style>
    </div>
  );
};

export default Modal;
