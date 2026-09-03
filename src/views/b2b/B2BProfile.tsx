"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { SingleImageUpload } from "@/components/admin/SingleImageUpload";

interface Profile {
  id: string;
  name: string | null;
  email: string | null;
  phone: string | null;
  image: string | null;
  b2bType: string | null;
  b2bStatus: string | null;
}

export default function B2BProfile() {
  const { update } = useSession();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [image, setImage] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    fetch("/api/b2b/profile")
      .then((res) => res.json())
      .then((data: Profile) => {
        setProfile(data);
        setName(data.name ?? "");
        setPhone(data.phone ?? "");
        setImage(data.image ?? "");
      })
      .finally(() => setLoading(false));
  }, []);

  const save = async () => {
    setSaving(true);
    setError(null);
    setSuccess(false);
    const res = await fetch("/api/b2b/profile", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, phone, image }),
    });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error ?? "Une erreur est survenue.");
    } else {
      setSuccess(true);
      await update?.();
      setTimeout(() => setSuccess(false), 3000);
    }
    setSaving(false);
  };

  if (loading) {
    return (
      <div className="max-w-xl space-y-4">
        <div className="h-8 w-48 animate-pulse rounded-lg bg-calma-sand" />
        <div className="h-64 animate-pulse rounded-2xl bg-calma-sand" />
      </div>
    );
  }

  return (
    <div className="max-w-xl">
      <div className="mb-8">
        <h1 className="font-fraunces text-2xl font-normal text-calma-ink">Mon profil</h1>
        <p className="mt-1 text-sm text-calma-taupe">Gérez vos informations de contact</p>
      </div>

      <div className="rounded-2xl border border-calma-border bg-white p-6 space-y-5">
        <SingleImageUpload
          value={image}
          onChange={setImage}
          label="Photo de profil"
          endpoint="/api/b2b/upload"
        />

        <div>
          <label className="mb-1 block text-xs font-medium text-calma-taupe">
            Nom / raison sociale
          </label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-xl border border-calma-border px-3 py-2 text-sm text-calma-ink focus:border-calma-terracotta focus:outline-none"
          />
        </div>

        <div>
          <label className="mb-1 block text-xs font-medium text-calma-taupe">Email</label>
          <input
            value={profile?.email ?? ""}
            disabled
            className="w-full rounded-xl border border-calma-border bg-calma-sand px-3 py-2 text-sm text-calma-taupe"
          />
        </div>

        <div>
          <label className="mb-1 block text-xs font-medium text-calma-taupe">
            Téléphone (WhatsApp){" "}
            <span className="font-normal normal-case text-calma-taupe/70">
              — utilisé pour vous notifier de l&apos;approbation de vos annonces
            </span>
          </label>
          <input
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="+216 XX XXX XXX"
            className="w-full rounded-xl border border-calma-border px-3 py-2 text-sm text-calma-ink focus:border-calma-terracotta focus:outline-none"
          />
        </div>

        {error && <p className="text-sm text-red-600">{error}</p>}
        {success && <p className="text-sm text-calma-success">Profil mis à jour.</p>}

        <button
          onClick={save}
          disabled={saving}
          className="w-full rounded-xl bg-calma-terracotta py-2.5 text-sm font-semibold text-calma-ink transition-colors hover:bg-calma-terracotta-deep disabled:opacity-60"
        >
          {saving ? "Enregistrement..." : "Enregistrer"}
        </button>
      </div>
    </div>
  );
}
