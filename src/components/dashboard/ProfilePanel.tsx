import { useEffect, useState } from "react";
import { User as UserIcon, Check } from "lucide-react";
import { useCalmaLang } from "@/lib/calma/i18n";

interface Profile {
  name: string | null;
  email: string | null;
  phone: string | null;
}

export function ProfilePanel() {
  const { t } = useCalmaLang();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState<"idle" | "saved" | "error">("idle");

  useEffect(() => {
    fetch("/api/user/profile")
      .then((res) => (res.ok ? res.json() : null))
      .then((data: Profile | null) => {
        if (!data) return;
        setProfile(data);
        setName(data.name ?? "");
        setPhone(data.phone ?? "");
      });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setFeedback("idle");
    try {
      const res = await fetch("/api/user/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, phone }),
      });
      if (!res.ok) throw new Error();
      setFeedback("saved");
    } catch {
      setFeedback("error");
    } finally {
      setSaving(false);
    }
  };

  if (!profile) {
    return <div className="h-40 animate-pulse rounded-2xl bg-calma-border/40" />;
  }

  return (
    <div className="rounded-2xl border border-calma-border bg-white p-6">
      <div className="mb-6 flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-calma-terracotta/10">
          <UserIcon className="h-5 w-5 text-calma-terracotta" />
        </div>
        <div>
          <h2 className="font-fraunces text-lg font-normal text-calma-ink">
            {t.dash.profileTitle}
          </h2>
          <p className="text-sm text-calma-taupe">{t.dash.profileSub}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="max-w-md space-y-4">
        <div>
          <label className="mb-1.5 block text-sm font-medium text-calma-ink">
            {t.dash.profileNameLabel}
          </label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full rounded-xl border border-calma-border px-3.5 py-2.5 text-sm text-calma-ink outline-none focus:border-calma-terracotta"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-calma-ink">
            {t.dash.profileEmailLabel}
          </label>
          <input
            value={profile.email ?? ""}
            disabled
            className="w-full rounded-xl border border-calma-border bg-calma-sand px-3.5 py-2.5 text-sm text-calma-taupe"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-calma-ink">
            {t.dash.profilePhoneLabel}
          </label>
          <input
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder={t.dash.profilePhonePh}
            className="w-full rounded-xl border border-calma-border px-3.5 py-2.5 text-sm text-calma-ink outline-none focus:border-calma-terracotta"
          />
        </div>

        <div className="flex items-center gap-3 pt-1">
          <button
            type="submit"
            disabled={saving}
            className="rounded-xl bg-calma-terracotta px-5 py-2.5 text-sm font-semibold text-calma-ink transition-colors hover:bg-calma-terracotta-deep disabled:opacity-60"
          >
            {t.dash.profileSaveBtn}
          </button>
          {feedback === "saved" && (
            <span className="flex items-center gap-1.5 text-sm font-medium text-calma-success">
              <Check className="h-4 w-4" />
              {t.dash.profileSavedMsg}
            </span>
          )}
          {feedback === "error" && (
            <span className="text-sm font-medium text-red-500">{t.dash.profileErrorMsg}</span>
          )}
        </div>
      </form>
    </div>
  );
}
