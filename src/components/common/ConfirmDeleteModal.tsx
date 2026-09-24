"use client";

import React, { useEffect, useRef } from "react";
import { AlertTriangle, X, Loader2 } from "lucide-react";

interface ConfirmDeleteModalProps {
  isOpen: boolean;
  productTitle: string;
  isDeleting: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmDeleteModal({
  isOpen,
  productTitle,
  isDeleting,
  onConfirm,
  onCancel,
}: ConfirmDeleteModalProps) {
  const cancelBtnRef = useRef<HTMLButtonElement>(null);

  // Focus trap + escape key
  useEffect(() => {
    if (!isOpen) return;

    // Focus cancel button on open
    cancelBtnRef.current?.focus();

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !isDeleting) {
        onCancel();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    // Prevent body scroll
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [isOpen, isDeleting, onCancel]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="delete-modal-title"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={!isDeleting ? onCancel : undefined}
      />

      {/* Modal content */}
      <div className="relative bg-white rounded-3xl shadow-2xl max-w-md w-full p-6 sm:p-8 animate-in fade-in zoom-in-95 duration-200">
        {/* Close button */}
        {!isDeleting && (
          <button
            type="button"
            onClick={onCancel}
            className="absolute top-4 right-4 p-1.5 rounded-lg text-text-muted hover:text-gray-700 hover:bg-gray-100 transition-colors cursor-pointer"
            aria-label="Close dialog"
          >
            <X className="w-4 h-4" />
          </button>
        )}

        {/* Icon */}
        <div className="w-14 h-14 rounded-2xl bg-red-100 text-danger flex items-center justify-center mx-auto mb-4">
          <AlertTriangle className="w-7 h-7" />
        </div>

        {/* Title */}
        <h2
          id="delete-modal-title"
          className="text-xl font-bold text-gray-900 text-center"
        >
          Delete Product?
        </h2>

        {/* Description */}
        <p className="mt-2 text-sm text-text-secondary text-center max-w-sm mx-auto">
          Are you sure you want to delete{" "}
          <span className="font-semibold text-gray-800">
            &ldquo;{productTitle}&rdquo;
          </span>
          ? This action cannot be undone.
        </p>

        {/* Actions */}
        <div className="mt-6 flex flex-col-reverse sm:flex-row items-center justify-center gap-3">
          <button
            ref={cancelBtnRef}
            type="button"
            onClick={onCancel}
            disabled={isDeleting}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl text-sm font-semibold text-gray-800 bg-white border border-border hover:bg-gray-50 transition-colors disabled:opacity-50 cursor-pointer"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={onConfirm}
            disabled={isDeleting}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-danger hover:bg-danger-hover shadow-xs transition-colors disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer"
          >
            {isDeleting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Deleting...</span>
              </>
            ) : (
              <span>Delete Product</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
