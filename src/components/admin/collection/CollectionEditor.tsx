"use client";
import Link from "next/link";
import { ArrowLeft, Save, Trash2 } from "lucide-react";

interface StatusFieldConfig {
  label: string;
  value: string;
  options: { value: string; label: string }[];
  onChange: (value: string) => void;
  disabled?: boolean;
}

interface CollectionEditorProps {
  title: string;
  subtitle?: string;
  backHref: string;
  backLabel: string;
  onSave: () => void;
  saving?: boolean;
  saveLabel: string;
  savedMessage?: string | null;
  statusFields?: StatusFieldConfig[];
  onDeleteRequest?: () => void;
  deleteLabel?: string;
  /** Extra content in the sticky sidebar, below the status fields — e.g. metadata that isn't editable. */
  sidebarExtra?: React.ReactNode;
  children: React.ReactNode;
}

/**
 * The generic "Payload-like" full-page editor: the form takes the whole page,
 * a sidebar stays fixed alongside it with Save / status / Delete — never a
 * modal, never a drawer that pushes the page content around.
 */
export function CollectionEditor({
  title,
  subtitle,
  backHref,
  backLabel,
  onSave,
  saving = false,
  saveLabel,
  savedMessage,
  statusFields = [],
  onDeleteRequest,
  deleteLabel,
  sidebarExtra,
  children,
}: CollectionEditorProps) {
  return (
    <div>
      <Link
        href={backHref}
        className="mb-4 inline-flex items-center gap-1.5 text-sm font-medium text-calma-taupe no-underline transition-colors hover:text-admin-navy"
      >
        <ArrowLeft className="h-4 w-4" />
        {backLabel}
      </Link>

      <div className="mb-6">
        <h1 className="font-fraunces text-2xl font-normal text-calma-ink">{title}</h1>
        {subtitle && <p className="text-sm text-calma-taupe">{subtitle}</p>}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_300px]">
        <div className="space-y-6 rounded-2xl border border-calma-border bg-white p-6">
          {children}
        </div>

        <aside className="h-fit space-y-5 rounded-2xl border border-calma-border bg-white p-5 lg:sticky lg:top-4">
          <button
            onClick={onSave}
            disabled={saving}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-admin-navy px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-admin-navy-deep disabled:opacity-60"
          >
            <Save className="h-4 w-4" />
            {saving ? "…" : saveLabel}
          </button>
          {savedMessage && (
            <p className="-mt-2 text-center text-xs font-medium text-calma-success">
              {savedMessage}
            </p>
          )}

          {statusFields.length > 0 && (
            <div className="space-y-4 border-t border-calma-border pt-4">
              {statusFields.map((field) => (
                <div key={field.label}>
                  <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-calma-taupe">
                    {field.label}
                  </label>
                  <select
                    value={field.value}
                    onChange={(e) => field.onChange(e.target.value)}
                    disabled={field.disabled}
                    className="w-full rounded-lg border border-calma-border px-3 py-2 text-sm disabled:opacity-50"
                  >
                    {field.options.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>
              ))}
            </div>
          )}

          {sidebarExtra && <div className="border-t border-calma-border pt-4">{sidebarExtra}</div>}

          {onDeleteRequest && (
            <button
              onClick={onDeleteRequest}
              className="flex w-full items-center justify-center gap-2 rounded-xl border border-red-200 px-4 py-2.5 text-sm font-semibold text-red-500 transition-colors hover:bg-red-50"
            >
              <Trash2 className="h-4 w-4" />
              {deleteLabel}
            </button>
          )}
        </aside>
      </div>
    </div>
  );
}
