"use client";

import { useEffect, useState } from "react";
import { BookOpen, Plus, Pencil, Trash2, X, EyeOff } from "lucide-react";
import { RichTextEditor } from "@/components/admin/RichTextEditor";
import { SingleImageUpload } from "@/components/admin/SingleImageUpload";

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

function GuideModal({
  guide,
  onClose,
  onSave,
}: {
  guide: GuideItem | null;
  onClose: () => void;
  onSave: (data: GuideForm) => Promise<void>;
}) {
  const [form, setForm] = useState<GuideForm>(
    guide
      ? {
          title: guide.title,
          summary: guide.summary,
          content: guide.content,
          category: guide.category ?? "",
          image: guide.image ?? "",
          active: guide.active,
        }
      : EMPTY_FORM,
  );
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async () => {
    if (!form.title.trim() || !form.summary.trim() || !form.content.trim()) {
      setError("Titre, résumé et contenu requis.");
      return;
    }
    setSaving(true);
    setError(null);
    try {
      await onSave(form);
    } catch {
      setError("Une erreur est survenue.");
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 overflow-y-auto">
      <div className="my-8 w-full max-w-2xl rounded-2xl bg-white p-6 shadow-2xl">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-fraunces text-lg text-calma-ink">
            {guide ? "Modifier le guide" : "Nouveau guide pratique"}
          </h2>
          <button
            onClick={onClose}
            aria-label="Fermer"
            className="rounded-lg p-1 text-calma-taupe hover:bg-calma-sand"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="mb-1 block text-xs font-medium text-calma-taupe">Titre</label>
            <input
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="w-full rounded-xl border border-calma-border px-3 py-2 text-sm text-calma-ink focus:border-calma-terracotta focus:outline-none"
              placeholder="Comment obtenir son visa pour la Tunisie"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-calma-taupe">
              Résumé (affiché dans la liste)
            </label>
            <textarea
              value={form.summary}
              onChange={(e) => setForm({ ...form, summary: e.target.value })}
              rows={2}
              className="w-full rounded-xl border border-calma-border px-3 py-2 text-sm text-calma-ink focus:border-calma-terracotta focus:outline-none"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-calma-taupe">
              Catégorie (optionnel)
            </label>
            <input
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              placeholder="Visa & Documents, Transport..."
              className="w-full rounded-xl border border-calma-border px-3 py-2 text-sm text-calma-ink focus:border-calma-terracotta focus:outline-none"
            />
          </div>
          <SingleImageUpload
            value={form.image}
            onChange={(url) => setForm({ ...form, image: url })}
          />
          <div>
            <label className="mb-1 block text-xs font-medium text-calma-taupe">
              Contenu de l&apos;article
            </label>
            <RichTextEditor
              value={form.content}
              onChange={(html) => setForm({ ...form, content: html })}
              placeholder="Rédigez le guide ici..."
              minHeight={220}
            />
          </div>
          <label className="flex items-center gap-2 text-sm text-calma-ink">
            <input
              type="checkbox"
              checked={form.active}
              onChange={(e) => setForm({ ...form, active: e.target.checked })}
              className="h-4 w-4 rounded border-calma-border"
            />
            Visible publiquement
          </label>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <button
            onClick={submit}
            disabled={saving}
            className="w-full rounded-xl bg-calma-terracotta py-2.5 text-sm font-semibold text-white transition-colors hover:bg-calma-terracotta-deep disabled:opacity-60"
          >
            {saving ? "Enregistrement..." : "Enregistrer"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function AdminGuides() {
  const [guides, setGuides] = useState<GuideItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalGuide, setModalGuide] = useState<GuideItem | "new" | null>(null);

  const load = async () => {
    setLoading(true);
    const res = await fetch("/api/admin/guides");
    const data = await res.json();
    setGuides(Array.isArray(data) ? data : []);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const save = async (form: GuideForm) => {
    const payload = {
      ...form,
      category: form.category || undefined,
      image: form.image || undefined,
    };
    if (modalGuide && modalGuide !== "new") {
      await fetch(`/api/admin/guides/${modalGuide.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
    } else {
      await fetch("/api/admin/guides", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
    }
    setModalGuide(null);
    await load();
  };

  const remove = async (id: number) => {
    if (!confirm("Supprimer ce guide ?")) return;
    await fetch(`/api/admin/guides/${id}`, { method: "DELETE" });
    load();
  };

  return (
    <div className="mx-auto max-w-4xl p-6">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="font-fraunces text-2xl font-normal text-calma-ink">Guides pratiques</h1>
          <p className="mt-1 text-sm text-calma-taupe">
            {guides.length} guide{guides.length !== 1 ? "s" : ""}
          </p>
        </div>
        <button
          onClick={() => setModalGuide("new")}
          className="flex items-center gap-2 rounded-xl bg-calma-terracotta px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-calma-terracotta-deep"
        >
          <Plus className="h-4 w-4" />
          Ajouter
        </button>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-20 animate-pulse rounded-2xl bg-calma-sand" />
          ))}
        </div>
      ) : guides.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-calma-border py-16 text-center text-calma-taupe">
          <BookOpen className="mx-auto mb-3 h-10 w-10 opacity-30" />
          <p>Aucun guide pour le moment</p>
        </div>
      ) : (
        <div className="space-y-3">
          {guides.map((guide) => (
            <div
              key={guide.id}
              className="flex items-start gap-4 rounded-2xl border border-calma-border bg-white p-5"
            >
              <div className="min-w-0 flex-1">
                <div className="mb-1 flex flex-wrap items-center gap-2">
                  <p className="font-semibold text-calma-ink">{guide.title}</p>
                  {guide.category && (
                    <span className="rounded-full bg-calma-olive/10 px-2 py-0.5 text-xs text-calma-olive">
                      {guide.category}
                    </span>
                  )}
                  {!guide.active && (
                    <span className="flex items-center gap-1 rounded-full bg-calma-sand px-2 py-0.5 text-xs text-calma-taupe">
                      <EyeOff className="h-3 w-3" /> Masqué
                    </span>
                  )}
                </div>
                <p className="text-xs text-calma-taupe">/guides/{guide.slug}</p>
                <p className="mt-1.5 text-sm text-calma-taupe line-clamp-2">{guide.summary}</p>
              </div>
              <div className="flex flex-shrink-0 gap-2">
                <button
                  onClick={() => setModalGuide(guide)}
                  aria-label={`Modifier ${guide.title}`}
                  className="rounded-xl bg-calma-sand p-2 text-calma-ink transition-colors hover:bg-calma-border"
                >
                  <Pencil className="h-4 w-4" />
                </button>
                <button
                  onClick={() => remove(guide.id)}
                  aria-label={`Supprimer ${guide.title}`}
                  className="rounded-xl bg-red-50 p-2 text-red-600 transition-colors hover:bg-red-100"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {modalGuide && (
        <GuideModal
          guide={modalGuide === "new" ? null : modalGuide}
          onClose={() => setModalGuide(null)}
          onSave={save}
        />
      )}
    </div>
  );
}
