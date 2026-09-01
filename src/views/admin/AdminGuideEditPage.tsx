"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { RichTextEditor } from "@/components/admin/RichTextEditor";
import { SingleImageUpload } from "@/components/admin/SingleImageUpload";
import { CollectionEditor } from "@/components/admin/collection/CollectionEditor";
import { DeleteConfirmModal } from "@/components/admin/collection/DeleteConfirmModal";

interface GuideItem {
  id: number;
  title: string;
  slug: string;
  summary: string;
  content: string;
  category: string | null;
  image: string | null;
  active: boolean;
}

type GuideForm = {
  title: string;
  summary: string;
  content: string;
  category: string;
  image: string;
  active: boolean;
};

const EMPTY_FORM: GuideForm = {
  title: "",
  summary: "",
  content: "",
  category: "",
  image: "",
  active: true,
};

export default function AdminGuideEditPage({ id }: { id?: string }) {
  const router = useRouter();
  const [guide, setGuide] = useState<GuideItem | null | undefined>(id ? undefined : null);
  const [form, setForm] = useState<GuideForm>(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showDelete, setShowDelete] = useState(false);

  useEffect(() => {
    if (!id) return;
    fetch("/api/admin/guides")
      .then((res) => res.json())
      .then((all: GuideItem[]) => {
        const found = Array.isArray(all) ? (all.find((g) => g.id === parseInt(id)) ?? null) : null;
        setGuide(found);
        if (found) {
          setForm({
            title: found.title,
            summary: found.summary,
            content: found.content,
            category: found.category ?? "",
            image: found.image ?? "",
            active: found.active,
          });
        }
      });
  }, [id]);

  const handleSave = async () => {
    if (!form.title.trim() || !form.summary.trim() || !form.content.trim()) {
      setError("Title, summary and content are required.");
      return;
    }
    setSaving(true);
    setSaved(false);
    setError(null);
    const payload = {
      ...form,
      category: form.category || undefined,
      image: form.image || undefined,
    };
    try {
      if (guide) {
        await fetch(`/api/admin/guides/${guide.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        setSaved(true);
      } else {
        await fetch("/api/admin/guides", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        router.push("/admin/guides");
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!guide) return;
    await fetch(`/api/admin/guides/${guide.id}`, { method: "DELETE" });
    router.push("/admin/guides");
  };

  if (id && guide === undefined) {
    return <div className="h-96 animate-pulse rounded-2xl bg-calma-border/40" />;
  }
  if (id && !guide) {
    return (
      <div className="rounded-2xl border border-calma-border bg-white p-12 text-center text-calma-taupe">
        Guide not found.
      </div>
    );
  }

  return (
    <>
      <CollectionEditor
        title={guide ? guide.title : "New guide"}
        subtitle={guide ? `/guides/${guide.slug}` : "Add a practical guide"}
        backHref="/admin/guides"
        backLabel="All guides"
        onSave={handleSave}
        saving={saving}
        saveLabel={guide ? "Save changes" : "Create guide"}
        savedMessage={saved ? "Saved." : null}
        onDeleteRequest={guide ? () => setShowDelete(true) : undefined}
        deleteLabel="Delete guide"
        statusFields={[
          {
            label: "Visibility",
            value: form.active ? "active" : "hidden",
            options: [
              { value: "active", label: "Visible publicly" },
              { value: "hidden", label: "Hidden" },
            ],
            onChange: (v) => setForm((f) => ({ ...f, active: v === "active" })),
          },
        ]}
      >
        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <div>
          <label className="mb-1.5 block text-sm font-medium text-calma-ink">
            Title <span className="text-admin-gold">*</span>
          </label>
          <input
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            placeholder="Comment obtenir son visa pour la Tunisie"
            className="w-full rounded-xl border border-calma-border px-4 py-3 focus:border-admin-gold focus:outline-none"
          />
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-calma-ink">
            Summary{" "}
            <span className="text-xs font-normal text-calma-taupe">(shown in the list)</span>{" "}
            <span className="text-admin-gold">*</span>
          </label>
          <textarea
            value={form.summary}
            onChange={(e) => setForm({ ...form, summary: e.target.value })}
            rows={2}
            className="w-full resize-none rounded-xl border border-calma-border px-4 py-3 focus:border-admin-gold focus:outline-none"
          />
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-calma-ink">Category</label>
          <input
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
            placeholder="Visa & Documents, Transport..."
            className="w-full rounded-xl border border-calma-border px-4 py-3 focus:border-admin-gold focus:outline-none"
          />
        </div>

        <SingleImageUpload
          value={form.image}
          onChange={(url) => setForm({ ...form, image: url })}
        />

        <div>
          <label className="mb-1.5 block text-sm font-medium text-calma-ink">
            Article content <span className="text-admin-gold">*</span>
          </label>
          <RichTextEditor
            value={form.content}
            onChange={(html) => setForm({ ...form, content: html })}
            placeholder="Rédigez le guide ici..."
            minHeight={260}
          />
        </div>
      </CollectionEditor>

      {showDelete && guide && (
        <DeleteConfirmModal
          itemLabel={guide.title}
          isDeleting={saving}
          onCancel={() => setShowDelete(false)}
          onConfirm={handleDelete}
        />
      )}
    </>
  );
}
