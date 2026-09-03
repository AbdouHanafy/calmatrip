"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AlertCircle, Check, Loader2 } from "lucide-react";
import MediaFieldPicker from "@/features/cms/components/media/MediaFieldPicker";
import type { SiteSettings } from "@/features/cms/services/settings";
import type { SettingsGroup } from "@/features/cms/schemas/settingsSchemas";

const TABS: { key: SettingsGroup; label: string; description: string }[] = [
  { key: "general", label: "General", description: "Site identity, locale, and timezone." },
  { key: "branding", label: "Branding", description: "Logo and favicon shown across the site." },
  { key: "contact", label: "Contact", description: "How visitors reach the business." },
  { key: "social", label: "Social", description: "Social profile links." },
  {
    key: "footer",
    label: "Footer",
    description: "Global footer text (navigation is managed separately).",
  },
];

type SaveState = "idle" | "saving" | "saved" | "error";

function Field({
  label,
  hint,
  children,
  htmlFor,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
  htmlFor: string;
}) {
  return (
    <div className="space-y-1.5">
      <label htmlFor={htmlFor} className="block text-sm font-semibold text-slate-800">
        {label}
      </label>
      {hint && <p className="text-xs text-slate-500">{hint}</p>}
      {children}
    </div>
  );
}

const inputClass =
  "w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-200";

export default function SettingsPage() {
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<SettingsGroup>("general");
  const [saveState, setSaveState] = useState<Record<SettingsGroup, SaveState>>({
    general: "idle",
    branding: "idle",
    contact: "idle",
    social: "idle",
    footer: "idle",
  });
  const [saveError, setSaveError] = useState<Record<SettingsGroup, string | null>>({
    general: null,
    branding: null,
    contact: null,
    social: null,
    footer: null,
  });

  useEffect(() => {
    let cancelled = false;
    fetch("/api/cms/settings")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load settings");
        return res.json();
      })
      .then((body) => {
        if (!cancelled) setSettings(body.settings);
      })
      .catch(() => {
        if (!cancelled) setLoadError("Could not load site settings. Please refresh the page.");
      });
    return () => {
      cancelled = true;
    };
  }, []);

  async function save(group: SettingsGroup, data: Record<string, unknown>) {
    setSaveState((s) => ({ ...s, [group]: "saving" }));
    setSaveError((s) => ({ ...s, [group]: null }));
    try {
      const res = await fetch("/api/cms/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ group, data }),
      });
      const body = await res.json().catch(() => null);
      if (!res.ok) throw new Error(body?.error ?? "Failed to save settings");
      setSettings(body.settings);
      setSaveState((s) => ({ ...s, [group]: "saved" }));
      setTimeout(
        () => setSaveState((s) => (s[group] === "saved" ? { ...s, [group]: "idle" } : s)),
        2500,
      );
    } catch (error) {
      setSaveState((s) => ({ ...s, [group]: "error" }));
      setSaveError((s) => ({
        ...s,
        [group]: error instanceof Error ? error.message : "Failed to save settings",
      }));
    }
  }

  if (loadError) {
    return (
      <div className="flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
        <AlertCircle className="h-4 w-4 flex-shrink-0" />
        {loadError}
      </div>
    );
  }

  if (!settings) {
    return (
      <div className="flex items-center gap-2 text-sm text-slate-500">
        <Loader2 className="h-4 w-4 animate-spin" />
        Loading settings…
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-space text-xl font-semibold text-slate-900">Site Settings</h1>
        <p className="text-sm text-slate-500">
          Configure global website settings. Changes take effect on the public site immediately
          after saving.
        </p>
      </div>

      <div className="flex flex-wrap gap-1 border-b border-slate-200" role="tablist">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            type="button"
            role="tab"
            aria-selected={activeTab === tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`rounded-t-lg px-4 py-2.5 text-sm font-semibold transition-colors ${
              activeTab === tab.key
                ? "border-b-2 border-slate-900 text-slate-900"
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <p className="text-sm text-slate-500">{TABS.find((t) => t.key === activeTab)?.description}</p>

      {activeTab === "general" && (
        <GeneralForm
          value={settings.general}
          saveState={saveState.general}
          error={saveError.general}
          onSave={(data) => save("general", data)}
        />
      )}
      {activeTab === "branding" && (
        <BrandingForm
          value={settings.branding}
          saveState={saveState.branding}
          error={saveError.branding}
          onSave={(data) => save("branding", data)}
        />
      )}
      {activeTab === "contact" && (
        <ContactForm
          value={settings.contact}
          saveState={saveState.contact}
          error={saveError.contact}
          onSave={(data) => save("contact", data)}
        />
      )}
      {activeTab === "social" && (
        <SocialForm
          value={settings.social}
          saveState={saveState.social}
          error={saveError.social}
          onSave={(data) => save("social", data)}
        />
      )}
      {activeTab === "footer" && (
        <FooterForm
          value={settings.footer}
          saveState={saveState.footer}
          error={saveError.footer}
          onSave={(data) => save("footer", data)}
        />
      )}
    </div>
  );
}

function SaveButton({ state }: { state: SaveState }) {
  return (
    <button
      type="submit"
      disabled={state === "saving"}
      className="flex items-center gap-2 rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-slate-700 disabled:opacity-60"
    >
      {state === "saving" && <Loader2 className="h-4 w-4 animate-spin" />}
      {state === "saved" && <Check className="h-4 w-4" />}
      {state === "saving" ? "Saving…" : state === "saved" ? "Saved" : "Save changes"}
    </button>
  );
}

function ErrorBanner({ message }: { message: string | null }) {
  if (!message) return null;
  return (
    <div
      role="alert"
      className="flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700"
    >
      <AlertCircle className="h-4 w-4 flex-shrink-0" />
      {message}
    </div>
  );
}

function GeneralForm({
  value,
  saveState,
  error,
  onSave,
}: {
  value: SiteSettings["general"];
  saveState: SaveState;
  error: string | null;
  onSave: (data: SiteSettings["general"]) => void;
}) {
  const [form, setForm] = useState(value);
  useEffect(() => setForm(value), [value]);

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSave(form);
      }}
      className="max-w-xl space-y-4 rounded-xl border border-slate-200 bg-white p-5"
    >
      <ErrorBanner message={error} />
      <Field label="Site name" htmlFor="siteName">
        <input
          id="siteName"
          className={inputClass}
          value={form.siteName}
          maxLength={120}
          required
          onChange={(e) => setForm({ ...form, siteName: e.target.value })}
        />
      </Field>
      <Field
        label="Site description"
        hint="Used as the default public metadata description."
        htmlFor="siteDescription"
      >
        <textarea
          id="siteDescription"
          className={inputClass}
          rows={3}
          maxLength={300}
          required
          value={form.siteDescription}
          onChange={(e) => setForm({ ...form, siteDescription: e.target.value })}
        />
      </Field>
      <Field label="Default locale" htmlFor="defaultLocale">
        <select
          id="defaultLocale"
          className={inputClass}
          value={form.defaultLocale}
          onChange={(e) =>
            setForm({ ...form, defaultLocale: e.target.value as "fr" | "en" | "ar" })
          }
        >
          <option value="fr">Français</option>
          <option value="en">English</option>
          <option value="ar">العربية</option>
        </select>
      </Field>
      <Field label="Timezone" hint="Any valid IANA timezone, e.g. Africa/Tunis." htmlFor="timezone">
        <input
          id="timezone"
          className={inputClass}
          value={form.timezone}
          required
          onChange={(e) => setForm({ ...form, timezone: e.target.value })}
        />
      </Field>
      <SaveButton state={saveState} />
    </form>
  );
}

function BrandingForm({
  value,
  saveState,
  error,
  onSave,
}: {
  value: SiteSettings["branding"];
  saveState: SaveState;
  error: string | null;
  onSave: (data: SiteSettings["branding"]) => void;
}) {
  const [form, setForm] = useState(value);
  useEffect(() => setForm(value), [value]);

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSave(form);
      }}
      className="max-w-xl space-y-5 rounded-xl border border-slate-200 bg-white p-5"
    >
      <ErrorBanner message={error} />
      <Field label="Logo" hint="Shown in the public header and footer." htmlFor="logo">
        <MediaFieldPicker
          value={form.logoUrl ?? ""}
          onChange={(v) => setForm({ ...form, logoUrl: typeof v === "string" ? v || null : null })}
        />
      </Field>
      <Field
        label="Favicon"
        hint="Shown in the browser tab. Falls back to the bundled default if unset."
        htmlFor="favicon"
      >
        <MediaFieldPicker
          value={form.faviconUrl ?? ""}
          onChange={(v) =>
            setForm({ ...form, faviconUrl: typeof v === "string" ? v || null : null })
          }
        />
      </Field>
      <SaveButton state={saveState} />
    </form>
  );
}

function ContactForm({
  value,
  saveState,
  error,
  onSave,
}: {
  value: SiteSettings["contact"];
  saveState: SaveState;
  error: string | null;
  onSave: (data: SiteSettings["contact"]) => void;
}) {
  const [form, setForm] = useState(value);
  useEffect(() => setForm(value), [value]);

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSave(form);
      }}
      className="max-w-xl space-y-4 rounded-xl border border-slate-200 bg-white p-5"
    >
      <ErrorBanner message={error} />
      <Field label="Email" htmlFor="email">
        <input
          id="email"
          type="email"
          className={inputClass}
          value={form.email ?? ""}
          onChange={(e) => setForm({ ...form, email: e.target.value || null })}
        />
      </Field>
      <Field label="Phone" htmlFor="phone">
        <input
          id="phone"
          className={inputClass}
          value={form.phone ?? ""}
          onChange={(e) => setForm({ ...form, phone: e.target.value || null })}
        />
      </Field>
      <Field label="WhatsApp" hint="Used by the floating WhatsApp chat button." htmlFor="whatsapp">
        <input
          id="whatsapp"
          className={inputClass}
          value={form.whatsapp ?? ""}
          onChange={(e) => setForm({ ...form, whatsapp: e.target.value || null })}
        />
      </Field>
      <Field label="Address" htmlFor="address">
        <input
          id="address"
          className={inputClass}
          value={form.address ?? ""}
          maxLength={300}
          onChange={(e) => setForm({ ...form, address: e.target.value || null })}
        />
      </Field>
      <SaveButton state={saveState} />
    </form>
  );
}

function SocialForm({
  value,
  saveState,
  error,
  onSave,
}: {
  value: SiteSettings["social"];
  saveState: SaveState;
  error: string | null;
  onSave: (data: SiteSettings["social"]) => void;
}) {
  const [form, setForm] = useState(value);
  useEffect(() => setForm(value), [value]);
  const fields: { key: keyof SiteSettings["social"]; label: string }[] = [
    { key: "facebook", label: "Facebook" },
    { key: "instagram", label: "Instagram" },
    { key: "tiktok", label: "TikTok" },
    { key: "youtube", label: "YouTube" },
  ];

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSave(form);
      }}
      className="max-w-xl space-y-4 rounded-xl border border-slate-200 bg-white p-5"
    >
      <ErrorBanner message={error} />
      {fields.map((f) => (
        <Field
          key={f.key}
          label={f.label}
          hint="Leave empty to hide this icon on the site."
          htmlFor={f.key}
        >
          <input
            id={f.key}
            type="url"
            placeholder="https://…"
            className={inputClass}
            value={form[f.key] ?? ""}
            onChange={(e) => setForm({ ...form, [f.key]: e.target.value || null })}
          />
        </Field>
      ))}
      <SaveButton state={saveState} />
    </form>
  );
}

function FooterForm({
  value,
  saveState,
  error,
  onSave,
}: {
  value: SiteSettings["footer"];
  saveState: SaveState;
  error: string | null;
  onSave: (data: SiteSettings["footer"]) => void;
}) {
  const [form, setForm] = useState(value);
  useEffect(() => setForm(value), [value]);

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSave(form);
      }}
      className="max-w-xl space-y-4 rounded-xl border border-slate-200 bg-white p-5"
    >
      <ErrorBanner message={error} />
      <Field
        label="Copyright text"
        hint={`Rendered as "© ${new Date().getFullYear()} <this text>".`}
        htmlFor="copyrightText"
      >
        <input
          id="copyrightText"
          className={inputClass}
          maxLength={200}
          value={form.copyrightText ?? ""}
          onChange={(e) => setForm({ ...form, copyrightText: e.target.value || null })}
        />
      </Field>
      <Field
        label="Footer description"
        hint="Overrides the default tagline under the logo. Leave empty to keep the default."
        htmlFor="description"
      >
        <textarea
          id="description"
          className={inputClass}
          rows={2}
          maxLength={300}
          value={form.description ?? ""}
          onChange={(e) => setForm({ ...form, description: e.target.value || null })}
        />
      </Field>
      <p className="text-xs text-slate-500">
        Footer navigation links are managed separately in{" "}
        <Link href="/admin/cms/navigation" className="font-semibold underline">
          Navigation
        </Link>
        .
      </p>
      <SaveButton state={saveState} />
    </form>
  );
}
