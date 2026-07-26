import { AlertCircle, ImageIcon, Loader2, Plus, X } from "lucide-react";
import { RichTextEditor } from "@/components/admin/RichTextEditor";
import { ImageUploadZone } from "@/components/admin/shared/ImageUploadZone";
import type { ImageEntry, Service, ServiceFormData } from "./types";

interface ServiceFormModalProps {
  editingService: Service | null;
  formData: ServiceFormData;
  onFormDataChange: (data: ServiceFormData) => void;
  imageEntries: ImageEntry[];
  onImageEntriesChange: (images: ImageEntry[]) => void;
  saving: boolean;
  error: string | null;
  onClose: () => void;
  onSubmit: () => void;
}

export function ServiceFormModal({
  editingService,
  formData,
  onFormDataChange,
  imageEntries,
  onImageEntriesChange,
  saving,
  error,
  onClose,
  onSubmit,
}: ServiceFormModalProps) {
  const addFeatureRow = () => {
    onFormDataChange({ ...formData, features: [...formData.features, ""] });
  };

  const updateFeatureRow = (index: number, value: string) => {
    const next = [...formData.features];
    next[index] = value;
    onFormDataChange({ ...formData, features: next });
  };

  const removeFeatureRow = (index: number) => {
    onFormDataChange({ ...formData, features: formData.features.filter((_, i) => i !== index) });
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-scale-up"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-bold bg-gradient-to-r from-[#F2994A] to-[#5E8B63] bg-clip-text text-transparent">
            {editingService ? "Edit Service" : "New Service"}
          </h3>
          <button
            onClick={onClose}
            aria-label="Fermer"
            className="p-2 hover:bg-calma-sand rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-calma-taupe" />
          </button>
        </div>

        {error && (
          <div className="mb-4 flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
            <AlertCircle className="w-4 h-4 shrink-0" />
            {error}
          </div>
        )}

        <form
          className="space-y-5"
          onSubmit={(e) => {
            e.preventDefault();
            onSubmit();
          }}
        >
          {/* Images */}
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

          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-calma-ink mb-2">
              Service Name <span className="text-[#F2994A]">*</span>
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => onFormDataChange({ ...formData, title: e.target.value })}
              className="w-full px-4 py-3 border border-calma-border rounded-xl focus:ring-2 focus:ring-[#F2994A] focus:border-transparent transition-all"
              placeholder="Ex: Airport Transfer"
              required
            />
          </div>

          {/* Subtitle */}
          <div>
            <label className="block text-sm font-medium text-calma-ink mb-2">
              Subtitle <span className="text-xs text-calma-taupe font-normal">(optional)</span>
            </label>
            <input
              type="text"
              value={formData.subtitle}
              onChange={(e) => onFormDataChange({ ...formData, subtitle: e.target.value })}
              className="w-full px-4 py-3 border border-calma-border rounded-xl focus:ring-2 focus:ring-[#F2994A] focus:border-transparent transition-all"
              placeholder="Ex: Arrival & Departure"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-calma-ink mb-2">
              Description <span className="text-[#F2994A]">*</span>
            </label>
            <RichTextEditor
              value={formData.description}
              onChange={(html) => onFormDataChange({ ...formData, description: html })}
              placeholder="Detailed description of the service..."
              minHeight={180}
            />
          </div>

          {/* Features */}
          <div>
            <label className="block text-sm font-medium text-calma-ink mb-2 flex items-center justify-between">
              <span>
                Features <span className="text-xs text-calma-taupe font-normal">(optional)</span>
              </span>
            </label>
            <div className="space-y-2">
              {formData.features.map((feature, index) => (
                <div key={index} className="flex items-center gap-2">
                  <input
                    type="text"
                    value={feature}
                    onChange={(e) => updateFeatureRow(index, e.target.value)}
                    placeholder="Ex: Real-time flight tracking"
                    className="flex-1 px-4 py-2.5 border border-calma-border rounded-xl focus:ring-2 focus:ring-[#F2994A] focus:border-transparent transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => removeFeatureRow(index)}
                    aria-label="Supprimer cette caractéristique"
                    className="p-2.5 text-red-500 hover:bg-red-50 rounded-xl transition-colors shrink-0"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={addFeatureRow}
                className="flex items-center gap-2 px-4 py-2.5 border-2 border-dashed border-calma-border hover:border-[#F2994A] hover:bg-[#F2994A]/5 rounded-xl text-sm text-calma-taupe hover:text-[#F2994A] transition-all w-full justify-center"
              >
                <Plus className="w-4 h-4" />
                Add feature
              </button>
            </div>
          </div>

          {/* Category + Price */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium text-calma-ink mb-2">
                Category <span className="text-[#F2994A]">*</span>
              </label>
              <select
                value={formData.category}
                onChange={(e) => onFormDataChange({ ...formData, category: e.target.value })}
                className="w-full px-4 py-3 border border-calma-border rounded-xl focus:ring-2 focus:ring-[#F2994A] focus:border-transparent bg-white"
              >
                <option value="Transport">Transport</option>
                <option value="Excursion">Excursion</option>
                <option value="Group">Group</option>
                <option value="Camel Treks">Camel Treks</option>
                <option value="4x4 Tours">4x4 Tours</option>
                <option value="Catamaran Trips">Catamaran Trips</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-calma-ink mb-2">
                Price <span className="text-[#F2994A]">*</span>
              </label>
              <input
                type="text"
                placeholder="Ex: 50 TND"
                value={formData.price}
                onChange={(e) => onFormDataChange({ ...formData, price: e.target.value })}
                className="w-full px-4 py-3 border border-calma-border rounded-xl focus:ring-2 focus:ring-[#F2994A] focus:border-transparent transition-all"
                required
              />
            </div>
          </div>

          {/* Duration */}
          <div>
            <label className="block text-sm font-medium text-calma-ink mb-2">Duration</label>
            <input
              type="text"
              placeholder="Ex: 2 hours"
              value={formData.duration}
              onChange={(e) => onFormDataChange({ ...formData, duration: e.target.value })}
              className="w-full px-4 py-3 border border-calma-border rounded-xl focus:ring-2 focus:ring-[#F2994A] focus:border-transparent transition-all"
            />
          </div>

          {/* Toggles */}
          <div className="flex items-center gap-6">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.active}
                onChange={(e) => onFormDataChange({ ...formData, active: e.target.checked })}
                className="w-4 h-4 text-[#5E8B63] rounded"
              />
              <span className="text-sm text-calma-ink">Active</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.popular}
                onChange={(e) => onFormDataChange({ ...formData, popular: e.target.checked })}
                className="w-4 h-4 text-[#D9A441] rounded"
              />
              <span className="text-sm text-calma-ink">Popular</span>
            </label>
          </div>

          {/* Submit */}
          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              disabled={saving}
              className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-[#F2994A] to-[#5E8B63] text-white rounded-xl font-semibold hover:shadow-lg transition-all duration-300 disabled:opacity-60"
            >
              {saving && <Loader2 className="w-4 h-4 animate-spin" />}
              {saving ? "Saving..." : editingService ? "Update" : "Create Service"}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 border-2 border-calma-border text-calma-ink rounded-xl font-semibold hover:bg-calma-sand transition-all duration-300"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
