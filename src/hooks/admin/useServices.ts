import { useCallback, useEffect, useState } from "react";
import type { ImageEntry, Service } from "@/components/admin/services/types";
import { serializeImages } from "@/components/admin/services/types";

interface ServicePayload {
  title: string;
  subtitle: string | null;
  description: string;
  price: string;
  category: string;
  duration: string | null;
  image: string | null;
  active: boolean;
  popular: boolean;
  features: string[] | null;
}

export function useServices() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchServices = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch("/api/services");
      if (!res.ok) throw new Error("Failed to load services");
      const data = await res.json();
      setServices(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load services");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchServices();
  }, [fetchServices]);

  const uploadPendingFiles = async (
    entries: ImageEntry[],
    setImageEntries: (updater: (prev: ImageEntry[]) => ImageEntry[]) => void,
  ): Promise<ImageEntry[]> => {
    const pending = entries.filter((e) => !!e.file);
    if (pending.length === 0) return entries;

    setImageEntries((prev) =>
      prev.map((e) => (e.file ? { ...e, uploading: true, error: undefined } : e)),
    );

    const formData = new FormData();
    pending.forEach((e) => formData.append("files", e.file!));

    let uploadedUrls: string[] = [];
    try {
      const res = await fetch("/api/admin/upload", { method: "POST", body: formData });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Upload failed");
      uploadedUrls = json.urls as string[];
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Upload failed";
      setImageEntries((prev) =>
        prev.map((e) => (e.file ? { ...e, uploading: false, error: msg } : e)),
      );
      throw err;
    }

    let urlIndex = 0;
    const resolved = entries.map((e) => {
      if (!e.file) return e;
      const url = uploadedUrls[urlIndex++] ?? e.url;
      return { id: e.id, url };
    });

    setImageEntries(() => resolved);
    return resolved;
  };

  const saveService = async (
    formData: {
      title: string;
      subtitle: string;
      description: string;
      price: string;
      category: string;
      duration: string;
      active: boolean;
      popular: boolean;
      features: string[];
    },
    imageEntries: ImageEntry[],
    setImageEntries: (updater: (prev: ImageEntry[]) => ImageEntry[]) => void,
    editingServiceId: number | null,
  ): Promise<{ ok: true } | { ok: false; error: string }> => {
    if (!formData.title.trim() || !formData.description.trim() || !formData.price.trim()) {
      return { ok: false, error: "Please fill in all required fields" };
    }

    setSaving(true);
    setError(null);

    try {
      const resolvedImages = await uploadPendingFiles(imageEntries, setImageEntries);
      const imageValue = serializeImages(resolvedImages.map((e) => e.url));
      const cleanedFeatures = formData.features.map((f) => f.trim()).filter((f) => f.length > 0);

      const payload: ServicePayload = {
        title: formData.title.trim(),
        subtitle: formData.subtitle.trim() || null,
        description: formData.description.trim(),
        price: formData.price.trim(),
        category: formData.category,
        duration: formData.duration.trim() || null,
        image: imageValue,
        active: formData.active,
        popular: formData.popular,
        features: cleanedFeatures.length > 0 ? cleanedFeatures : null,
      };

      const url = editingServiceId ? `/api/services/${editingServiceId}` : "/api/services";
      const method = editingServiceId ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok)
        throw new Error(editingServiceId ? "Failed to update service" : "Failed to create service");

      await fetchServices();
      return { ok: true };
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to save service";
      setError(message);
      return { ok: false, error: message };
    } finally {
      setSaving(false);
    }
  };

  const toggleServiceStatus = async (service: Service) => {
    try {
      const res = await fetch(`/api/services/${service.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ active: !service.active }),
      });
      if (!res.ok) throw new Error();
      setServices((prev) =>
        prev.map((s) => (s.id === service.id ? { ...s, active: !s.active } : s)),
      );
    } catch {
      setError("Failed to update status");
    }
  };

  const togglePopular = async (service: Service) => {
    try {
      const res = await fetch(`/api/services/${service.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ popular: !service.popular }),
      });
      if (!res.ok) throw new Error();
      setServices((prev) =>
        prev.map((s) => (s.id === service.id ? { ...s, popular: !s.popular } : s)),
      );
    } catch {
      setError("Failed to update popular status");
    }
  };

  const deleteService = async (id: number) => {
    try {
      const res = await fetch(`/api/services/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      setServices((prev) => prev.filter((s) => s.id !== id));
    } catch {
      setError("Failed to delete service");
    }
  };

  return {
    services,
    loading,
    saving,
    error,
    setError,
    saveService,
    toggleServiceStatus,
    togglePopular,
    deleteService,
  };
}
