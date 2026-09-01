"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { CollectionEditor } from "@/components/admin/collection/CollectionEditor";
import { DeleteConfirmModal } from "@/components/admin/collection/DeleteConfirmModal";

interface FAQItem {
  id: number;
  question: string;
  answer: string;
  icon: string;
  order: number;
}

export default function AdminFAQEditPage({ id }: { id?: string }) {
  const router = useRouter();
  const [faq, setFaq] = useState<FAQItem | null | undefined>(id ? undefined : null);
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [icon, setIcon] = useState("HelpCircle");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showDelete, setShowDelete] = useState(false);

  useEffect(() => {
    if (!id) return;
    fetch("/api/admin/faq")
      .then((res) => res.json())
      .then((all: FAQItem[]) => {
        const found = Array.isArray(all) ? (all.find((f) => f.id === parseInt(id)) ?? null) : null;
        setFaq(found);
        if (found) {
          setQuestion(found.question);
          setAnswer(found.answer);
          setIcon(found.icon);
        }
      });
  }, [id]);

  const handleSave = async () => {
    if (!question.trim() || !answer.trim()) {
      setError("Question and answer are required.");
      return;
    }
    setSaving(true);
    setSaved(false);
    setError(null);
    const payload = {
      question: question.trim(),
      answer: answer.trim(),
      icon: icon.trim() || "HelpCircle",
    };
    try {
      if (faq) {
        await fetch(`/api/admin/faq/${faq.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        setSaved(true);
      } else {
        await fetch("/api/admin/faq", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        router.push("/admin/faq");
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!faq) return;
    await fetch(`/api/admin/faq/${faq.id}`, { method: "DELETE" });
    router.push("/admin/faq");
  };

  if (id && faq === undefined) {
    return <div className="h-72 animate-pulse rounded-2xl bg-calma-border/40" />;
  }
  if (id && !faq) {
    return (
      <div className="rounded-2xl border border-calma-border bg-white p-12 text-center text-calma-taupe">
        Question not found.
      </div>
    );
  }

  return (
    <>
      <CollectionEditor
        title={faq ? faq.question : "New question"}
        subtitle={faq ? "Edit this FAQ entry" : "Add a question to the public FAQ"}
        backHref="/admin/faq"
        backLabel="All questions"
        onSave={handleSave}
        saving={saving}
        saveLabel={faq ? "Save changes" : "Create question"}
        savedMessage={saved ? "Saved." : null}
        onDeleteRequest={faq ? () => setShowDelete(true) : undefined}
        deleteLabel="Delete question"
      >
        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <div>
          <label className="mb-1.5 block text-sm font-medium text-calma-ink">
            Question <span className="text-admin-gold">*</span>
          </label>
          <input
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Comment réserver une activité ?"
            className="w-full rounded-xl border border-calma-border px-4 py-3 focus:border-admin-gold focus:outline-none"
          />
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-calma-ink">
            Answer <span className="text-admin-gold">*</span>
          </label>
          <textarea
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            rows={5}
            placeholder="Vous pouvez réserver directement en ligne..."
            className="w-full resize-none rounded-xl border border-calma-border px-4 py-3 focus:border-admin-gold focus:outline-none"
          />
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-calma-ink">
            Icon{" "}
            <span className="text-xs font-normal text-calma-taupe">(lucide-react icon name)</span>
          </label>
          <input
            value={icon}
            onChange={(e) => setIcon(e.target.value)}
            placeholder="HelpCircle"
            className="w-full rounded-xl border border-calma-border px-4 py-3 focus:border-admin-gold focus:outline-none"
          />
        </div>
      </CollectionEditor>

      {showDelete && faq && (
        <DeleteConfirmModal
          itemLabel={faq.question}
          isDeleting={saving}
          onCancel={() => setShowDelete(false)}
          onConfirm={handleDelete}
        />
      )}
    </>
  );
}
