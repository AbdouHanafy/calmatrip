"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowDown, ArrowLeft, ArrowUp, Loader2, Plus, Save, Trash2 } from "lucide-react";
import { FORM_FIELD_TYPES } from "@/features/cms/types";

type Localized = { fr?: string; en?: string; ar?: string };
type Condition = {
  field: string;
  operator: "EQUALS" | "NOT_EQUALS" | "IS_EMPTY" | "IS_NOT_EMPTY";
  value?: string;
  action: "SHOW" | "HIDE";
};
type Field = {
  id?: string;
  key: string;
  label: Localized;
  type: string;
  required: boolean;
  position: number;
  placeholder?: Localized;
  helpText?: Localized;
  validation?: { min?: number; max?: number; pattern?: string };
  options?: Array<{ value: string; label: Localized }>;
  condition?: Condition;
};
type Step = {
  id?: string;
  title: Localized;
  description?: Localized;
  position: number;
  condition?: Condition;
  fields: Field[];
};
type Form = {
  id: string;
  name: string;
  slug: string;
  description?: Localized;
  status: "DRAFT" | "IN_REVIEW" | "PUBLISHED" | "ARCHIVED";
  settings?: { progressIndicator?: boolean; saveDraft?: boolean };
  steps: Step[];
  _count?: { submissions: number };
};
const control =
  "h-10 w-full border border-slate-300 bg-white px-3 text-sm outline-none focus:border-slate-600";
const newField = (position: number): Field => ({
  key: "",
  label: { fr: "" },
  type: "TEXT",
  required: false,
  position,
});
const newStep = (position: number): Step => ({
  title: { fr: `Step ${position + 1}` },
  position,
  fields: [newField(0)],
});

export default function FormEditor({ formId }: { formId: string }) {
  const [form, setForm] = useState<Form | null>(null);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  useEffect(() => {
    fetch(`/api/cms/forms/${formId}`)
      .then(async (response) => {
        if (!response.ok) throw new Error("Unable to load form");
        return response.json();
      })
      .then(setForm)
      .catch((error) => setMessage(error.message));
  }, [formId]);
  function change(patch: Partial<Form>) {
    setForm((current) => (current ? { ...current, ...patch } : current));
  }
  function updateStep(index: number, patch: Partial<Step>) {
    if (form)
      change({ steps: form.steps.map((step, i) => (i === index ? { ...step, ...patch } : step)) });
  }
  function updateField(stepIndex: number, fieldIndex: number, patch: Partial<Field>) {
    const step = form?.steps[stepIndex];
    if (step)
      updateStep(stepIndex, {
        fields: step.fields.map((field, i) => (i === fieldIndex ? { ...field, ...patch } : field)),
      });
  }
  function moveStep(index: number, direction: -1 | 1) {
    if (!form) return;
    const target = index + direction;
    if (target < 0 || target >= form.steps.length) return;
    const steps = [...form.steps];
    [steps[index], steps[target]] = [steps[target], steps[index]];
    change({ steps: steps.map((step, position) => ({ ...step, position })) });
  }
  function moveField(stepIndex: number, fieldIndex: number, direction: -1 | 1) {
    const step = form?.steps[stepIndex];
    if (!step) return;
    const target = fieldIndex + direction;
    if (target < 0 || target >= step.fields.length) return;
    const fields = [...step.fields];
    [fields[fieldIndex], fields[target]] = [fields[target], fields[fieldIndex]];
    updateStep(stepIndex, { fields: fields.map((field, position) => ({ ...field, position })) });
  }
  function moveFieldTo(stepIndex: number, fieldIndex: number, targetIndex: number) {
    if (!form || stepIndex === targetIndex) return;
    const source = form.steps[stepIndex];
    const field = source.fields[fieldIndex];
    const steps = form.steps.map((step, index) =>
      index === stepIndex
        ? {
            ...step,
            fields: step.fields
              .filter((_, i) => i !== fieldIndex)
              .map((item, position) => ({ ...item, position })),
          }
        : index === targetIndex
          ? { ...step, fields: [...step.fields, { ...field, position: step.fields.length }] }
          : step,
    );
    if (steps[stepIndex].fields.length) change({ steps });
    else setMessage("A step must contain at least one field.");
  }
  async function save() {
    if (!form) return;
    setSaving(true);
    setMessage("");
    const payload = {
      ...form,
      steps: form.steps.map((step, position) => ({
        ...step,
        position,
        fields: step.fields.map((field, fieldPosition) => ({ ...field, position: fieldPosition })),
      })),
    };
    const response = await fetch(`/api/cms/forms/${form.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const result = await response.json();
    if (response.ok) {
      setForm(result);
      setMessage("Form saved.");
    } else setMessage(result.error ?? "Unable to save form");
    setSaving(false);
  }
  if (!form)
    return (
      <div className="flex min-h-96 items-center justify-center text-slate-500">
        {message || <Loader2 className="h-5 w-5 animate-spin" />}
      </div>
    );
  const allFields = form.steps.flatMap((step) => step.fields).filter((field) => field.key);
  return (
    <div className="mx-auto max-w-6xl space-y-6 p-6">
      <header className="flex flex-wrap items-start justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <Link
            href="/admin/cms"
            className="mb-3 inline-flex items-center gap-1 text-xs text-slate-500"
          >
            <ArrowLeft className="h-4 w-4" /> Forms
          </Link>
          <input
            value={form.name}
            onChange={(event) => change({ name: event.target.value })}
            className="block w-full border-0 p-0 font-space text-3xl font-semibold outline-none"
          />
          <p className="mt-1 text-xs text-slate-500">{form._count?.submissions ?? 0} submissions</p>
        </div>
        <div className="flex gap-2">
          <select
            value={form.status}
            onChange={(event) => change({ status: event.target.value as Form["status"] })}
            className={control}
          >
            <option>DRAFT</option>
            <option>IN_REVIEW</option>
            <option>PUBLISHED</option>
            <option>ARCHIVED</option>
          </select>
          <button
            onClick={save}
            disabled={saving}
            className="flex h-10 items-center gap-2 bg-slate-950 px-4 text-sm font-semibold text-white disabled:opacity-50"
          >
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}{" "}
            Save
          </button>
        </div>
      </header>
      <section className="grid gap-4 border border-slate-200 bg-slate-50 p-4 sm:grid-cols-2">
        <label className="text-xs font-semibold">
          Slug
          <input
            value={form.slug}
            onChange={(event) =>
              change({ slug: event.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "-") })
            }
            className={`mt-1 ${control}`}
          />
        </label>
        <label className="text-xs font-semibold">
          Description
          <input
            value={form.description?.fr ?? ""}
            onChange={(event) =>
              change({ description: { ...form.description, fr: event.target.value } })
            }
            className={`mt-1 ${control}`}
          />
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={form.settings?.progressIndicator !== false}
            onChange={(event) =>
              change({ settings: { ...form.settings, progressIndicator: event.target.checked } })
            }
          />{" "}
          Progress indicator
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={form.settings?.saveDraft === true}
            onChange={(event) =>
              change({ settings: { ...form.settings, saveDraft: event.target.checked } })
            }
          />{" "}
          Allow draft saving
        </label>
      </section>
      {form.steps.map((step, stepIndex) => (
        <section key={step.id ?? stepIndex} className="border border-slate-200 bg-white">
          <div className="flex items-center gap-2 border-b border-slate-200 bg-slate-50 p-3">
            <span className="text-xs text-slate-400">{stepIndex + 1}</span>
            <input
              value={step.title.fr ?? ""}
              onChange={(event) =>
                updateStep(stepIndex, { title: { ...step.title, fr: event.target.value } })
              }
              className="h-9 flex-1 border border-slate-300 px-3 text-sm font-semibold"
            />
            <button onClick={() => moveStep(stepIndex, -1)} disabled={!stepIndex}>
              <ArrowUp className="h-4 w-4" />
            </button>
            <button
              onClick={() => moveStep(stepIndex, 1)}
              disabled={stepIndex === form.steps.length - 1}
            >
              <ArrowDown className="h-4 w-4" />
            </button>
            {form.steps.length > 1 && (
              <button
                onClick={() => change({ steps: form.steps.filter((_, i) => i !== stepIndex) })}
                className="text-red-600"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            )}
          </div>
          <div className="space-y-3 p-4">
            {step.fields.map((field, fieldIndex) => (
              <div key={field.id ?? fieldIndex} className="border border-slate-200 p-3">
                <div className="grid gap-2 lg:grid-cols-[1fr_1fr_170px_auto]">
                  <input
                    value={field.label.fr ?? ""}
                    placeholder="Label"
                    onChange={(event) =>
                      updateField(stepIndex, fieldIndex, {
                        label: { ...field.label, fr: event.target.value },
                      })
                    }
                    className={control}
                  />
                  <input
                    value={field.key}
                    placeholder="fieldKey"
                    onChange={(event) =>
                      updateField(stepIndex, fieldIndex, {
                        key: event.target.value.replace(/[^a-zA-Z0-9_]/g, ""),
                      })
                    }
                    className={`${control} font-mono`}
                  />
                  <select
                    value={field.type}
                    onChange={(event) =>
                      updateField(stepIndex, fieldIndex, { type: event.target.value })
                    }
                    className={control}
                  >
                    {FORM_FIELD_TYPES.map((type) => (
                      <option key={type}>{type}</option>
                    ))}
                  </select>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => moveField(stepIndex, fieldIndex, -1)}
                      disabled={!fieldIndex}
                    >
                      <ArrowUp className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => moveField(stepIndex, fieldIndex, 1)}
                      disabled={fieldIndex === step.fields.length - 1}
                    >
                      <ArrowDown className="h-4 w-4" />
                    </button>
                    {step.fields.length > 1 && (
                      <button
                        onClick={() =>
                          updateStep(stepIndex, {
                            fields: step.fields.filter((_, i) => i !== fieldIndex),
                          })
                        }
                        className="text-red-600"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                </div>
                <div className="mt-3 flex flex-wrap items-center gap-4 text-xs">
                  <label>
                    <input
                      type="checkbox"
                      checked={field.required}
                      onChange={(event) =>
                        updateField(stepIndex, fieldIndex, { required: event.target.checked })
                      }
                    />{" "}
                    Required
                  </label>
                  {form.steps.length > 1 && (
                    <label>
                      Move to{" "}
                      <select
                        value={stepIndex}
                        onChange={(event) =>
                          moveFieldTo(stepIndex, fieldIndex, Number(event.target.value))
                        }
                        className="ml-1 border p-1"
                      >
                        {form.steps.map((target, index) => (
                          <option key={index} value={index}>
                            {target.title.fr || `Step ${index + 1}`}
                          </option>
                        ))}
                      </select>
                    </label>
                  )}
                </div>
                {["SELECT", "MULTI_SELECT", "RADIO", "COUNTRY", "CITY", "CURRENCY"].includes(
                  field.type,
                ) && (
                  <label className="mt-3 block text-xs font-semibold">
                    Options (value|label)
                    <textarea
                      value={(field.options ?? [])
                        .map((option) => `${option.value}|${option.label.fr ?? option.value}`)
                        .join("\n")}
                      onChange={(event) =>
                        updateField(stepIndex, fieldIndex, {
                          options: event.target.value
                            .split("\n")
                            .filter(Boolean)
                            .map((line) => {
                              const [value, label = value] = line.split("|");
                              return { value: value.trim(), label: { fr: label.trim() } };
                            }),
                        })
                      }
                      className="mt-1 min-h-20 w-full border border-slate-300 p-2 font-mono text-xs"
                    />
                  </label>
                )}
                <div className="mt-3 grid gap-2 sm:grid-cols-3">
                  <label className="text-xs">
                    Show when
                    <select
                      value={field.condition?.field ?? ""}
                      onChange={(event) =>
                        updateField(stepIndex, fieldIndex, {
                          condition: event.target.value
                            ? {
                                field: event.target.value,
                                operator: "EQUALS",
                                value: "",
                                action: "SHOW",
                              }
                            : undefined,
                        })
                      }
                      className={control}
                    >
                      <option value="">Always</option>
                      {allFields
                        .filter((item) => item.key !== field.key)
                        .map((item) => (
                          <option key={item.key} value={item.key}>
                            {item.label.fr || item.key}
                          </option>
                        ))}
                    </select>
                  </label>
                  {field.condition && (
                    <>
                      <label className="text-xs">
                        Operator
                        <select
                          value={field.condition.operator}
                          onChange={(event) =>
                            updateField(stepIndex, fieldIndex, {
                              condition: {
                                ...field.condition!,
                                operator: event.target.value as Condition["operator"],
                              },
                            })
                          }
                          className={control}
                        >
                          <option>EQUALS</option>
                          <option>NOT_EQUALS</option>
                          <option>IS_EMPTY</option>
                          <option>IS_NOT_EMPTY</option>
                        </select>
                      </label>
                      <label className="text-xs">
                        Value
                        <input
                          disabled={field.condition.operator.includes("EMPTY")}
                          value={field.condition.value ?? ""}
                          onChange={(event) =>
                            updateField(stepIndex, fieldIndex, {
                              condition: { ...field.condition!, value: event.target.value },
                            })
                          }
                          className={control}
                        />
                      </label>
                    </>
                  )}
                </div>
              </div>
            ))}
            <button
              onClick={() =>
                updateStep(stepIndex, { fields: [...step.fields, newField(step.fields.length)] })
              }
              className="flex items-center gap-1 text-xs font-semibold"
            >
              <Plus className="h-4 w-4" /> Add field
            </button>
          </div>
        </section>
      ))}
      <button
        onClick={() => change({ steps: [...form.steps, newStep(form.steps.length)] })}
        className="flex items-center gap-2 border border-dashed border-slate-300 px-4 py-3 text-sm font-semibold"
      >
        <Plus className="h-4 w-4" /> Add step
      </button>
      {message && (
        <p role="status" className="border border-slate-200 bg-white p-3 text-sm">
          {message}
        </p>
      )}
    </div>
  );
}
