"use client";
import { useMemo, useState } from "react";
import { evaluateCondition } from "@/features/cms/services/validation";
import type { SafeCondition } from "@/features/cms/types";

type Field = {
  id: string;
  key: string;
  label: unknown;
  type: string;
  required: boolean;
  placeholder: unknown;
  options: unknown;
  condition: unknown;
};
type Step = {
  id: string;
  title: unknown;
  description: unknown;
  condition: unknown;
  fields: Field[];
};
const localized = (value: unknown, locale: string) =>
  typeof value === "object" && value
    ? ((value as Record<string, string>)[locale] ?? (value as Record<string, string>).fr ?? "")
    : "";

export default function DynamicForm({
  slug,
  steps,
  locale = "fr",
  allowDraft = false,
}: {
  slug: string;
  steps: Step[];
  locale?: string;
  allowDraft?: boolean;
}) {
  const [stepIndex, setStepIndex] = useState(0);
  const [data, setData] = useState<Record<string, unknown>>({});
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const visibleSteps = useMemo(
    () =>
      steps.filter(
        (step) => !step.condition || evaluateCondition(step.condition as SafeCondition, data),
      ),
    [steps, data],
  );
  const step = visibleSteps[stepIndex] ?? visibleSteps[0];
  if (!step) return null;
  const fields = step.fields.filter(
    (field) => !field.condition || evaluateCondition(field.condition as SafeCondition, data),
  );
  async function submit(draft = false) {
    setSending(true);
    const response = await fetch(`/api/forms/${slug}/submit`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ data, locale, draft }),
    });
    const result = await response.json();
    setMessage(
      response.ok
        ? draft
          ? "Draft saved"
          : "Thank you. Your form was submitted."
        : (result.error ?? "Please check the form."),
    );
    setSending(false);
  }
  async function upload(fieldKey: string, file?: File) {
    if (!file) return;
    setSending(true);
    setMessage("Uploading…");
    const payload = new FormData();
    payload.set("fieldKey", fieldKey);
    payload.set("files", file);
    const response = await fetch(`/api/forms/${slug}/upload`, { method: "POST", body: payload });
    const result = await response.json();
    if (response.ok) {
      setData((old) => ({ ...old, [fieldKey]: result.url }));
      setMessage("File uploaded.");
    } else setMessage(result.error ?? "Upload failed.");
    setSending(false);
  }
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (stepIndex < visibleSteps.length - 1) setStepIndex((i) => i + 1);
        else void submit();
      }}
      className="space-y-5"
    >
      <div className="h-2 overflow-hidden rounded-full bg-calma-sand">
        <div
          className="h-full bg-admin-gold"
          style={{ width: `${((stepIndex + 1) / visibleSteps.length) * 100}%` }}
        />
      </div>
      <div>
        <h2 className="font-fraunces text-2xl">{localized(step.title, locale)}</h2>
        <p className="text-calma-taupe">{localized(step.description, locale)}</p>
      </div>
      {fields.map((field) => {
        const options = Array.isArray(field.options)
          ? (field.options as Array<{ label: unknown; value: string }>)
          : [];
        return (
          <label key={field.id} className="block text-sm font-semibold">
            {localized(field.label, locale)}
            {field.required && " *"}
            {field.type === "CHECKBOX" ? (
              <input
                type="checkbox"
                className="ml-3"
                onChange={(e) => setData((old) => ({ ...old, [field.key]: e.target.checked }))}
              />
            ) : field.type === "RADIO" && options.length ? (
              <span className="mt-2 flex flex-wrap gap-4">
                {options.map((option) => (
                  <label key={option.value} className="flex items-center gap-2 font-normal">
                    <input
                      type="radio"
                      name={field.key}
                      required={field.required}
                      value={option.value}
                      onChange={(event) =>
                        setData((old) => ({ ...old, [field.key]: event.target.value }))
                      }
                    />
                    {localized(option.label, locale)}
                  </label>
                ))}
              </span>
            ) : field.type === "MULTI_SELECT" && options.length ? (
              <select
                multiple
                required={field.required}
                className="mt-1 min-h-28 w-full rounded-xl border border-calma-border p-3 font-normal"
                onChange={(event) =>
                  setData((old) => ({
                    ...old,
                    [field.key]: Array.from(
                      event.currentTarget.selectedOptions,
                      (option) => option.value,
                    ),
                  }))
                }
              >
                {options.map((option) => (
                  <option key={option.value} value={option.value}>
                    {localized(option.label, locale)}
                  </option>
                ))}
              </select>
            ) : ["SELECT", "COUNTRY", "CITY", "CURRENCY"].includes(field.type) && options.length ? (
              <select
                required={field.required}
                className="mt-1 w-full rounded-xl border border-calma-border p-3 font-normal"
                onChange={(e) => setData((old) => ({ ...old, [field.key]: e.target.value }))}
              >
                <option value="">Select…</option>
                {options.map((option) => (
                  <option key={option.value} value={option.value}>
                    {localized(option.label, locale)}
                  </option>
                ))}
              </select>
            ) : field.type === "TEXTAREA" ? (
              <textarea
                required={field.required}
                className="mt-1 w-full rounded-xl border border-calma-border p-3 font-normal"
                placeholder={localized(field.placeholder, locale)}
                onChange={(e) => setData((old) => ({ ...old, [field.key]: e.target.value }))}
              />
            ) : ["FILE", "IMAGE"].includes(field.type) ? (
              <span className="mt-1 block">
                <input
                  type="file"
                  required={field.required && !data[field.key]}
                  accept="image/jpeg,image/png,image/webp,image/gif"
                  className="w-full rounded-xl border border-calma-border p-3 font-normal"
                  onChange={(event) => void upload(field.key, event.target.files?.[0])}
                />
                {typeof data[field.key] === "string" && (
                  <span className="mt-1 block text-xs font-normal text-calma-taupe">
                    Uploaded successfully
                  </span>
                )}
              </span>
            ) : field.type === "HIDDEN" ? (
              <input type="hidden" value={String(data[field.key] ?? "")} />
            ) : (
              <input
                required={field.required}
                type={
                  field.type === "EMAIL"
                    ? "email"
                    : field.type === "NUMBER"
                      ? "number"
                      : field.type === "DATE"
                        ? "date"
                        : field.type === "TIME"
                          ? "time"
                          : field.type === "URL"
                            ? "url"
                            : "text"
                }
                className="mt-1 w-full rounded-xl border border-calma-border p-3 font-normal"
                placeholder={localized(field.placeholder, locale)}
                onChange={(e) =>
                  setData((old) => ({
                    ...old,
                    [field.key]: field.type === "NUMBER" ? e.target.valueAsNumber : e.target.value,
                  }))
                }
              />
            )}
          </label>
        );
      })}
      <div className="flex justify-between gap-3">
        {stepIndex > 0 && (
          <button
            type="button"
            onClick={() => setStepIndex((i) => i - 1)}
            className="rounded-xl border px-5 py-3"
          >
            Back
          </button>
        )}
        <div className="ml-auto flex gap-3">
          {allowDraft && (
            <button
              type="button"
              onClick={() => submit(true)}
              className="rounded-xl border px-5 py-3"
            >
              Save draft
            </button>
          )}
          <button
            disabled={sending}
            className="rounded-xl bg-admin-navy px-6 py-3 font-semibold text-white"
          >
            {stepIndex < visibleSteps.length - 1 ? "Continue" : "Submit"}
          </button>
        </div>
      </div>
      {message && (
        <p role="status" className="rounded-xl bg-calma-sand p-3">
          {message}
        </p>
      )}
    </form>
  );
}
