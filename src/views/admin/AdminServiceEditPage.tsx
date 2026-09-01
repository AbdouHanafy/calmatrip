"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, X, ImageIcon } from "lucide-react";
import { RichTextEditor } from "@/components/admin/RichTextEditor";
import { ImageUploadZone } from "@/components/admin/shared/ImageUploadZone";
import { CollectionEditor } from "@/components/admin/collection/CollectionEditor";
import { DeleteConfirmModal } from "@/components/admin/collection/DeleteConfirmModal";
import { useServices } from "@/hooks/admin/useServices";
import {
  emptyServiceForm,
  parseFeatures,
  parseImages,
  SERVICE_CATEGORIES,
  type ImageEntry,
  type Service,
  type ServiceFormData,
} from "@/components/admin/services/types";

export default function AdminServiceEditPage({ id }: { id?: string }) {
  const router = useRouter();
  const { services, loading, saving, error, saveService, deleteService } = useServices();

  const editingService: Service | null = id
    ? (services.find((s) => s.id === parseInt(id)) ?? null)
    : null;

  const [formData, setFormData] = useState<ServiceFormData>(emptyServiceForm);
  const [imageEntries, setImageEntries] = useState<ImageEntry[]>([]);
  const [initialized, setInitialized] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (initialized || loading) return;
    if (id && !editingService) return; // still waiting for the list to load
    if (editingService) {
      setFormData({
        title: editingService.title,
        subtitle: editingService.subtitle ?? "",
        description: editingService.description,
        price: editingService.price,
        category: editingService.category ?? "Transport",
        duration: editingService.duration ?? "",
        active: editingService.active,
        popular: editingService.popular,
        features: parseFeatures(editingService.features),
      });
      setImageEntries(
        parseImages(editingService.image).map((url) => ({ id: `existing-${url}`, url })),
      );
    }
    setInitialized(true);
  }, [id, editingService, loading, initialized]);

  const addFeatureRow = () => setFormData((f) => ({ ...f, features: [...f.features, ""] }));
  const updateFeatureRow = (index: number, value: string) =>
    setFormData((f) => ({
      ...f,
      features: f.features.map((feat, i) => (i === index ? value : feat)),
    }));
  const removeFeatureRow = (index: number) =>
    setFormData((f) => ({ ...f, features: f.features.filter((_, i) => i !== index) }));

  const handleSave = async () => {
    setSaved(false);
    const result = await saveService(
      formData,
      imageEntries,
      setImageEntries,
      editingService?.id ?? null,
    );
    if (result.ok) {
      if (!editingService) {
        router.push("/admin/services");
      } else {
        setSaved(true);
      }
    }
  };

  const handleDelete = async () => {
    if (!editingService) return;
    await deleteService(editingService.id);
    router.push("/admin/services");
  };

  if (id && loading) {
    return <div className="h-96 animate-pulse rounded-2xl bg-calma-border/40" />;
  }
  if (id && !editingService) {
    return (
      <div className="rounded-2xl border border-calma-border bg-white p-12 text-center text-calma-taupe">
        Service not found.
      </div>
    );
  }

  return (
    <>
      <CollectionEditor
        title={editingService ? editingService.title : "New service"}
        subtitle={editingService ? "Edit this service" : "Add a service to the public catalog"}
        backHref="/admin/services"
        backLabel="All services"
        onSave={handleSave}
        saving={saving}
        saveLabel={editingService ? "Save changes" : "Create service"}
        savedMessage={saved ? "Saved." : null}
        onDeleteRequest={editingService ? () => setShowDelete(true) : undefined}
        deleteLabel="Delete service"
        statusFields={[
          {
            label: "Visibility",
            value: formData.active ? "active" : "inactive",
            options: [
              { value: "active", label: "Active — visible on the site" },
              { value: "inactive", label: "Inactive — hidden" },
            ],
            onChange: (v) => setFormData((f) => ({ ...f, active: v === "active" })),
          },
          {
            label: "Popular badge",
            value: formData.popular ? "yes" : "no",
            options: [
              { value: "no", label: "No" },
              { value: "yes", label: "Yes" },
            ],
            onChange: (v) => setFormData((f) => ({ ...f, popular: v === "yes" })),
          },
        ]}
      >
        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <div>
          <label className="mb-2 flex items-center gap-2 text-sm font-medium text-calma-ink">
            <ImageIcon className="h-4 w-4 text-admin-gold" />
            Images
          </label>
          <ImageUploadZone images={imageEntries} onChange={setImageEntries} />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-calma-ink">
            Service name <span className="text-admin-gold">*</span>
          </label>
          <input
            value={formData.title}
            onChange={(e) => setFormData((f) => ({ ...f, title: e.target.value }))}
            className="w-full rounded-xl border border-calma-border px-4 py-3 focus:border-admin-gold focus:outline-none"
            placeholder="Ex: Airport Transfer"
            required
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-calma-ink">Subtitle</label>
          <input
            value={formData.subtitle}
            onChange={(e) => setFormData((f) => ({ ...f, subtitle: e.target.value }))}
            className="w-full rounded-xl border border-calma-border px-4 py-3 focus:border-admin-gold focus:outline-none"
            placeholder="Ex: Arrival & Departure"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-calma-ink">
            Description <span className="text-admin-gold">*</span>
          </label>
          <RichTextEditor
            value={formData.description}
            onChange={(html) => setFormData((f) => ({ ...f, description: html }))}
            placeholder="Detailed description of the service..."
            minHeight={180}
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-calma-ink">Features</label>
          <div className="space-y-2">
            {formData.features.map((feature, index) => (
              <div key={index} className="flex items-center gap-2">
                <input
                  value={feature}
                  onChange={(e) => updateFeatureRow(index, e.target.value)}
                  placeholder="Ex: Real-time flight tracking"
                  className="flex-1 rounded-xl border border-calma-border px-4 py-2.5 focus:border-admin-gold focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => removeFeatureRow(index)}
                  aria-label="Remove this feature"
                  className="shrink-0 rounded-xl p-2.5 text-red-500 transition-colors hover:bg-red-50"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={addFeatureRow}
              className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-calma-border px-4 py-2.5 text-sm text-calma-taupe transition-all hover:border-admin-gold hover:text-admin-gold"
            >
              <Plus className="h-4 w-4" />
              Add feature
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-medium text-calma-ink">
              Category <span className="text-admin-gold">*</span>
            </label>
            <select
              value={formData.category}
              onChange={(e) => setFormData((f) => ({ ...f, category: e.target.value }))}
              className="w-full rounded-xl border border-calma-border bg-white px-4 py-3 focus:border-admin-gold focus:outline-none"
            >
              {SERVICE_CATEGORIES.filter((c) => c !== "all").map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-calma-ink">
              Price <span className="text-admin-gold">*</span>
            </label>
            <input
              value={formData.price}
              onChange={(e) => setFormData((f) => ({ ...f, price: e.target.value }))}
              placeholder="Ex: From 50 TND"
              className="w-full rounded-xl border border-calma-border px-4 py-3 focus:border-admin-gold focus:outline-none"
              required
            />
          </div>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-calma-ink">Duration</label>
          <input
            value={formData.duration}
            onChange={(e) => setFormData((f) => ({ ...f, duration: e.target.value }))}
            placeholder="Ex: 2 hours"
            className="w-full rounded-xl border border-calma-border px-4 py-3 focus:border-admin-gold focus:outline-none"
          />
        </div>
      </CollectionEditor>

      {showDelete && editingService && (
        <DeleteConfirmModal
          itemLabel={editingService.title}
          isDeleting={saving}
          onCancel={() => setShowDelete(false)}
          onConfirm={handleDelete}
        />
      )}
    </>
  );
}
