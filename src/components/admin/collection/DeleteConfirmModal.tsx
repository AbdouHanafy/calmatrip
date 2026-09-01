import { Trash2 } from "lucide-react";

interface DeleteConfirmModalProps {
  /** The real, human-readable name of the item being deleted — never just an id. */
  itemLabel: string;
  isDeleting?: boolean;
  errorMessage?: string | null;
  onCancel: () => void;
  onConfirm: () => void;
}

export function DeleteConfirmModal({
  itemLabel,
  isDeleting = false,
  errorMessage,
  onCancel,
  onConfirm,
}: DeleteConfirmModalProps) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
      onClick={onCancel}
    >
      <div
        className="w-full max-w-md rounded-2xl bg-white p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
            <Trash2 className="h-8 w-8 text-red-500" />
          </div>
          <h3 className="mb-2 text-xl font-bold text-calma-ink">Confirmer la suppression</h3>
          <p className="mb-2 text-calma-taupe">
            Supprimer <span className="font-semibold text-calma-ink">{itemLabel}</span> ? Cette
            action est irréversible.
          </p>
          {errorMessage && <p className="mb-2 text-sm font-medium text-red-500">{errorMessage}</p>}
          <div className="mt-4 flex gap-3">
            <button
              onClick={onCancel}
              className="flex-1 rounded-xl border border-calma-border px-4 py-2.5 font-medium text-calma-ink transition-colors hover:bg-calma-sand"
            >
              Annuler
            </button>
            <button
              onClick={onConfirm}
              disabled={isDeleting}
              className="flex-1 rounded-xl bg-red-500 px-4 py-2.5 font-medium text-white transition-colors hover:bg-red-600 disabled:opacity-50"
            >
              {isDeleting ? "Suppression…" : "Supprimer"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
