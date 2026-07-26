import { Trash2 } from "lucide-react";

interface CancelBookingModalProps {
  onCancel: () => void;
  onConfirm: () => void;
}

export function CancelBookingModal({ onCancel, onConfirm }: CancelBookingModalProps) {
  return (
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in"
      onClick={onCancel}
    >
      <div
        className="bg-white rounded-2xl p-6 max-w-md w-full animate-scale-up"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-100 flex items-center justify-center">
            <Trash2 className="w-8 h-8 text-red-500" />
          </div>
          <h3 className="text-xl font-bold text-calma-ink mb-2">Annuler la réservation</h3>
          <p className="text-calma-taupe mb-6">
            Êtes-vous sûr de vouloir annuler cette réservation ? Cette action est irréversible.
          </p>
          <div className="flex gap-3">
            <button
              onClick={onCancel}
              className="flex-1 px-4 py-2.5 border border-calma-border text-calma-ink rounded-xl font-medium hover:bg-calma-sand transition-colors"
            >
              Non, garder
            </button>
            <button
              onClick={onConfirm}
              className="flex-1 px-4 py-2.5 bg-red-500 text-white rounded-xl font-medium hover:bg-red-600 transition-colors"
            >
              Oui, annuler
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
