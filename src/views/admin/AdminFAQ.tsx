"use client";

import { useEffect, useState } from "react";
import { HelpCircle, Plus, Pencil, Trash2, ArrowUp, ArrowDown, X } from "lucide-react";

interface FAQItem {
  id: number;
  question: string;
  answer: string;
  icon: string;
  order: number;
}

function FAQModal({
  faq,
  onClose,
  onSave,
}: {
  faq: FAQItem | null;
  onClose: () => void;
  onSave: (data: { question: string; answer: string; icon: string }) => Promise<void>;
}) {
  const [question, setQuestion] = useState(faq?.question ?? "");
  const [answer, setAnswer] = useState(faq?.answer ?? "");
  const [icon, setIcon] = useState(faq?.icon ?? "HelpCircle");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async () => {
    if (!question.trim() || !answer.trim()) {
      setError("Question et réponse requises.");
      return;
    }
    setSaving(true);
    setError(null);
    try {
      await onSave({
        question: question.trim(),
        answer: answer.trim(),
        icon: icon.trim() || "HelpCircle",
      });
    } catch {
      setError("Une erreur est survenue.");
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-fraunces text-lg text-calma-ink">
            {faq ? "Modifier la question" : "Nouvelle question"}
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
            <label className="mb-1 block text-xs font-medium text-calma-taupe">Question</label>
            <input
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              className="w-full rounded-xl border border-calma-border px-3 py-2 text-sm text-calma-ink focus:border-calma-terracotta focus:outline-none"
              placeholder="Comment réserver une activité ?"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-calma-taupe">Réponse</label>
            <textarea
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              rows={4}
              className="w-full rounded-xl border border-calma-border px-3 py-2 text-sm text-calma-ink focus:border-calma-terracotta focus:outline-none"
              placeholder="Vous pouvez réserver directement en ligne..."
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-calma-taupe">
              Icône (nom lucide-react, optionnel)
            </label>
            <input
              value={icon}
              onChange={(e) => setIcon(e.target.value)}
              className="w-full rounded-xl border border-calma-border px-3 py-2 text-sm text-calma-ink focus:border-calma-terracotta focus:outline-none"
              placeholder="HelpCircle"
            />
          </div>

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

export default function AdminFAQ() {
  const [faqs, setFaqs] = useState<FAQItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalFaq, setModalFaq] = useState<FAQItem | "new" | null>(null);

  const load = async () => {
    setLoading(true);
    const res = await fetch("/api/admin/faq");
    const data = await res.json();
    setFaqs(Array.isArray(data) ? data : []);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const save = async (data: { question: string; answer: string; icon: string }) => {
    if (modalFaq && modalFaq !== "new") {
      await fetch(`/api/admin/faq/${modalFaq.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
    } else {
      await fetch("/api/admin/faq", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
    }
    setModalFaq(null);
    await load();
  };

  const remove = async (id: number) => {
    if (!confirm("Supprimer cette question ?")) return;
    await fetch(`/api/admin/faq/${id}`, { method: "DELETE" });
    load();
  };

  const move = async (index: number, direction: -1 | 1) => {
    const target = index + direction;
    if (target < 0 || target >= faqs.length) return;
    const a = faqs[index];
    const b = faqs[target];
    await Promise.all([
      fetch(`/api/admin/faq/${a.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ order: b.order }),
      }),
      fetch(`/api/admin/faq/${b.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ order: a.order }),
      }),
    ]);
    load();
  };

  return (
    <div className="mx-auto max-w-4xl p-6">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="font-fraunces text-2xl font-normal text-calma-ink">FAQ</h1>
          <p className="mt-1 text-sm text-calma-taupe">
            {faqs.length} question{faqs.length !== 1 ? "s" : ""} publiée
            {faqs.length !== 1 ? "s" : ""} sur le site
          </p>
        </div>
        <button
          onClick={() => setModalFaq("new")}
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
      ) : faqs.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-calma-border py-16 text-center text-calma-taupe">
          <HelpCircle className="mx-auto mb-3 h-10 w-10 opacity-30" />
          <p>Aucune question pour le moment</p>
        </div>
      ) : (
        <div className="space-y-3">
          {faqs.map((faq, index) => (
            <div
              key={faq.id}
              className="flex items-start gap-4 rounded-2xl border border-calma-border bg-white p-5"
            >
              <div className="flex flex-col gap-1 pt-1">
                <button
                  onClick={() => move(index, -1)}
                  disabled={index === 0}
                  aria-label="Monter"
                  className="rounded-lg p-1 text-calma-taupe hover:bg-calma-sand disabled:opacity-30"
                >
                  <ArrowUp className="h-4 w-4" />
                </button>
                <button
                  onClick={() => move(index, 1)}
                  disabled={index === faqs.length - 1}
                  aria-label="Descendre"
                  className="rounded-lg p-1 text-calma-taupe hover:bg-calma-sand disabled:opacity-30"
                >
                  <ArrowDown className="h-4 w-4" />
                </button>
              </div>

              <div className="min-w-0 flex-1">
                <p className="font-semibold text-calma-ink">{faq.question}</p>
                <p className="mt-1 text-sm text-calma-taupe">{faq.answer}</p>
              </div>

              <div className="flex flex-shrink-0 gap-2">
                <button
                  onClick={() => setModalFaq(faq)}
                  aria-label={`Modifier « ${faq.question} »`}
                  className="flex h-11 w-11 items-center justify-center rounded-xl bg-calma-sand text-calma-ink transition-colors hover:bg-calma-border"
                >
                  <Pencil className="h-4 w-4" />
                </button>
                <button
                  onClick={() => remove(faq.id)}
                  aria-label={`Supprimer « ${faq.question} »`}
                  className="flex h-11 w-11 items-center justify-center rounded-xl bg-red-50 text-red-600 transition-colors hover:bg-red-100"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {modalFaq && (
        <FAQModal
          faq={modalFaq === "new" ? null : modalFaq}
          onClose={() => setModalFaq(null)}
          onSave={save}
        />
      )}
    </div>
  );
}
