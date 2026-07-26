"use client";

import { useEffect, useState } from "react";
import { Percent, TrendingUp, Package, Compass } from "lucide-react";

interface Partner {
  id: string;
  name: string | null;
  email: string | null;
  b2bType: "ARTISAN" | "AGENCY" | null;
  b2bStatus: string | null;
  commissionRate: number;
  commissionEarned: number;
  createdAt: string;
}

function RateEditor({
  partner,
  onSave,
}: {
  partner: Partner;
  onSave: (rate: number) => Promise<void>;
}) {
  const [value, setValue] = useState(String(partner.commissionRate));
  const [saving, setSaving] = useState(false);

  const dirty = value !== String(partner.commissionRate);

  const save = async () => {
    const rate = parseFloat(value);
    if (isNaN(rate) || rate < 0 || rate > 100) return;
    setSaving(true);
    await onSave(rate);
    setSaving(false);
  };

  return (
    <div className="flex items-center gap-2">
      <div className="relative">
        <input
          type="number"
          min={0}
          max={100}
          step={0.5}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className="w-20 rounded-lg border border-calma-border py-1.5 pl-3 pr-6 text-sm text-calma-ink focus:border-calma-terracotta focus:outline-none"
        />
        <Percent className="pointer-events-none absolute right-2 top-1/2 h-3 w-3 -translate-y-1/2 text-calma-taupe" />
      </div>
      {dirty && (
        <button
          onClick={save}
          disabled={saving}
          className="rounded-lg bg-calma-terracotta px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-calma-terracotta-deep disabled:opacity-50"
        >
          {saving ? "..." : "Enregistrer"}
        </button>
      )}
    </div>
  );
}

export default function AdminB2BPartners() {
  const [partners, setPartners] = useState<Partner[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    const res = await fetch("/api/admin/b2b-partners");
    const data = await res.json();
    setPartners(Array.isArray(data) ? data : []);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const updateRate = async (id: string, rate: number) => {
    setError(null);
    const res = await fetch(`/api/admin/b2b-partners/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ commissionRate: rate }),
    });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error ?? "Une erreur est survenue.");
      return;
    }
    await load();
  };

  const totalEarned = partners.reduce((sum, p) => sum + p.commissionEarned, 0);

  return (
    <div className="mx-auto max-w-4xl p-6">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-fraunces text-2xl font-normal text-calma-ink">
            Commission automatique
          </h1>
          <p className="mt-1 text-sm text-calma-taupe">
            {partners.length} partenaire{partners.length !== 1 ? "s" : ""} B2B
          </p>
        </div>
        <div className="flex items-center gap-2 rounded-xl bg-calma-terracotta/10 px-4 py-2.5">
          <TrendingUp className="h-4 w-4 text-calma-terracotta" />
          <span className="text-sm font-semibold text-calma-terracotta">
            {totalEarned.toFixed(2)} TND de commission perçue
          </span>
        </div>
      </div>

      {error && (
        <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-16 animate-pulse rounded-2xl bg-calma-sand" />
          ))}
        </div>
      ) : partners.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-calma-border py-16 text-center text-calma-taupe">
          <Percent className="mx-auto mb-3 h-10 w-10 opacity-30" />
          <p>Aucun partenaire B2B pour le moment</p>
        </div>
      ) : (
        <div className="space-y-2">
          {partners.map((partner) => (
            <div
              key={partner.id}
              className="flex flex-wrap items-center gap-4 rounded-2xl border border-calma-border bg-white p-4"
            >
              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-calma-olive/10 text-calma-olive">
                {partner.b2bType === "ARTISAN" ? (
                  <Package className="h-4 w-4" />
                ) : (
                  <Compass className="h-4 w-4" />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate font-medium text-calma-ink">{partner.name ?? "—"}</p>
                <p className="truncate text-xs text-calma-taupe">{partner.email}</p>
              </div>
              <span className="flex-shrink-0 rounded-full bg-calma-sand px-2.5 py-1 text-xs font-semibold text-calma-taupe">
                {partner.b2bType === "ARTISAN" ? "Artisan" : "Agence"}
              </span>
              <div className="flex-shrink-0 text-right">
                <p className="text-xs text-calma-taupe">Perçu</p>
                <p className="text-sm font-semibold text-calma-ink">
                  {partner.commissionEarned.toFixed(2)} TND
                </p>
              </div>
              <RateEditor partner={partner} onSave={(rate) => updateRate(partner.id, rate)} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
