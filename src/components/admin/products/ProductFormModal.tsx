import { ImageIcon, X } from "lucide-react";
import { ImageUploadZone } from "@/components/admin/shared/ImageUploadZone";
import type { ImageEntry } from "@/components/admin/shared/imageEntry";
import { AVAILABLE_SIZES, type ProductFormData } from "./types";

interface ProductFormModalProps {
  isEditing: boolean;
  form: ProductFormData;
  onFormChange: (data: ProductFormData) => void;
  imageEntries: ImageEntry[];
  onImageEntriesChange: (images: ImageEntry[]) => void;
  saving: boolean;
  error: string | null;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
}

export function ProductFormModal({
  isEditing,
  form,
  onFormChange,
  imageEntries,
  onImageEntriesChange,
  saving,
  error,
  onClose,
  onSubmit,
}: ProductFormModalProps) {
  const toggleSize = (size: string) => {
    onFormChange({
      ...form,
      sizes: form.sizes.includes(size)
        ? form.sizes.filter((s) => s !== size)
        : [...form.sizes, size],
    });
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-calma-ink">
            {isEditing ? "Modifier le produit" : "Nouveau produit"}
          </h2>
          <button
            onClick={onClose}
            aria-label="Fermer"
            className="text-calma-taupe hover:text-calma-taupe"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-medium text-calma-ink block mb-1.5">Nom</label>
            <input
              required
              value={form.name}
              onChange={(e) => onFormChange({ ...form, name: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl border border-calma-border focus:outline-none focus:ring-2 focus:ring-[#F2994A]"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-calma-ink block mb-1.5">Prix (TND)</label>
              <input
                required
                type="number"
                step="0.01"
                value={form.price}
                onChange={(e) => onFormChange({ ...form, price: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-calma-border focus:outline-none focus:ring-2 focus:ring-[#F2994A]"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-calma-ink block mb-1.5">Stock</label>
              <input
                required
                type="number"
                value={form.stock}
                onChange={(e) => onFormChange({ ...form, stock: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-calma-border focus:outline-none focus:ring-2 focus:ring-[#F2994A]"
              />
            </div>
          </div>
          <div>
            <label className="text-sm font-medium text-calma-ink block mb-1.5">Catégorie</label>
            <input
              required
              value={form.category}
              onChange={(e) => onFormChange({ ...form, category: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl border border-calma-border focus:outline-none focus:ring-2 focus:ring-[#F2994A]"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-calma-ink block mb-1.5">
              Tailles disponibles <span className="text-calma-taupe font-normal">(optionnel)</span>
            </label>
            <div className="flex gap-2 flex-wrap">
              {AVAILABLE_SIZES.map((size) => (
                <button
                  key={size}
                  type="button"
                  onClick={() => toggleSize(size)}
                  className={`px-4 py-2 rounded-xl border-2 text-sm font-semibold transition-all ${
                    form.sizes.includes(size)
                      ? "border-[#5E8B63] bg-[#5E8B63]/10 text-[#5E8B63]"
                      : "border-calma-border text-calma-taupe hover:border-[#F2994A]/50"
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-calma-ink mb-2 flex items-center gap-2">
              <ImageIcon className="w-4 h-4 text-[#F2994A]" />
              Images
              <span className="text-xs text-calma-taupe font-normal">
                (optional — multiple allowed)
              </span>
            </label>
            <ImageUploadZone images={imageEntries} onChange={onImageEntriesChange} />
          </div>

          <div>
            <label className="text-sm font-medium text-calma-ink block mb-1.5">Description</label>
            <textarea
              required
              rows={3}
              value={form.description}
              onChange={(e) => onFormChange({ ...form, description: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl border border-calma-border focus:outline-none focus:ring-2 focus:ring-[#F2994A] resize-none"
            />
          </div>

          <button
            type="submit"
            disabled={saving}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-[#F2994A] to-[#5E8B63] text-white font-semibold disabled:opacity-60 hover:shadow-lg transition-shadow"
          >
            {saving ? "Enregistrement..." : isEditing ? "Enregistrer" : "Créer le produit"}
          </button>
        </form>
      </div>
    </div>
  );
}
