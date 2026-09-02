"use client";

import { useEffect, useState } from "react";
import { Percent, TrendingUp, Package, Compass, Check, X, Clock } from "lucide-react";
import {
  CollectionList,
  type CollectionColumn,
} from "@/components/admin/collection/CollectionList";

type PartnerProfileStatus =
  "DRAFT" | "SUBMITTED" | "UNDER_REVIEW" | "APPROVED" | "REJECTED" | "SUSPENDED";

interface Partner {
  id: string;
  name: string | null;
  email: string | null;
  b2bType: "ARTISAN" | "AGENCY" | null;
  b2bStatus: string | null;
  commissionRate: number;
  commissionEarned: number;
  createdAt: string;
  partnerProfile: {
    status: PartnerProfileStatus;
    organizationName: string | null;
    countryCode: string | null;
    city: string | null;
    submittedAt: string | null;
    rejectionReason: string | null;
  } | null;
}

function ProfileStatusBadge({ status }: { status: PartnerProfileStatus | undefined }) {
  if (!status || status === "DRAFT") {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-calma-sand px-2.5 py-1 text-xs font-semibold text-calma-taupe">
        Draft
      </span>
    );
  }
  if (status === "APPROVED") {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-calma-success/10 px-2.5 py-1 text-xs font-semibold text-calma-success">
        <Check size={11} /> Approved
      </span>
    );
  }
  if (status === "REJECTED") {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-red-50 px-2.5 py-1 text-xs font-semibold text-red-600">
        <X size={11} /> Rejected
      </span>
    );
  }
  if (status === "SUSPENDED") {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-red-50 px-2.5 py-1 text-xs font-semibold text-red-600">
        Suspended
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-700">
      <Clock size={11} /> {status === "SUBMITTED" ? "Submitted" : "Under review"}
    </span>
  );
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
          className="w-20 rounded-lg border border-calma-border py-1.5 pl-3 pr-6 text-sm text-calma-ink focus:border-admin-gold focus:outline-none"
        />
        <Percent className="pointer-events-none absolute right-2 top-1/2 h-3 w-3 -translate-y-1/2 text-calma-taupe" />
      </div>
      {dirty && (
        <button
          onClick={save}
          disabled={saving}
          className="rounded-lg bg-admin-gold px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-admin-gold-deep disabled:opacity-50"
        >
          {saving ? "..." : "Save"}
        </button>
      )}
    </div>
  );
}

export default function AdminB2BPartners() {
  const [partners, setPartners] = useState<Partner[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [rejectTarget, setRejectTarget] = useState<Partner | null>(null);
  const [reason, setReason] = useState("");
  const [reviewing, setReviewing] = useState<string | null>(null);

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
      setError(data.error ?? "Something went wrong.");
      return;
    }
    await load();
  };

  const review = async (
    id: string,
    decision: "APPROVED" | "REJECTED",
    rejectionReason?: string,
  ) => {
    setError(null);
    setReviewing(id);
    const res = await fetch(`/api/admin/b2b-partners/${id}/review`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ decision, reason: rejectionReason }),
    });
    setReviewing(null);
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error ?? "Something went wrong.");
      return;
    }
    await load();
  };

  const confirmReject = async () => {
    if (!rejectTarget) return;
    await review(rejectTarget.id, "REJECTED", reason);
    setRejectTarget(null);
    setReason("");
  };

  const totalEarned = partners.reduce((sum, p) => sum + p.commissionEarned, 0);

  const columns: CollectionColumn<Partner>[] = [
    {
      key: "partner",
      label: "Partner",
      render: (p) => (
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-admin-navy/10 text-admin-navy">
            {p.b2bType === "ARTISAN" ? (
              <Package className="h-4 w-4" />
            ) : (
              <Compass className="h-4 w-4" />
            )}
          </div>
          <div className="min-w-0">
            <p className="truncate font-medium text-calma-ink">{p.name ?? "—"}</p>
            <p className="truncate text-xs text-calma-taupe">{p.email}</p>
          </div>
        </div>
      ),
    },
    {
      key: "type",
      label: "Type",
      render: (p) => (
        <span className="rounded-full bg-calma-sand px-2.5 py-1 text-xs font-semibold text-calma-taupe">
          {p.b2bType === "ARTISAN" ? "Artisan" : "Agency"}
        </span>
      ),
    },
    {
      key: "business",
      label: "Business",
      render: (p) => (
        <div className="text-xs text-calma-taupe">
          <p className="font-medium text-calma-ink">{p.partnerProfile?.organizationName ?? "—"}</p>
          <p>
            {[p.partnerProfile?.city, p.partnerProfile?.countryCode].filter(Boolean).join(", ") ||
              "—"}
          </p>
        </div>
      ),
    },
    {
      key: "status",
      label: "Application",
      render: (p) => {
        const status = p.partnerProfile?.status;
        const awaiting = status === "SUBMITTED" || status === "UNDER_REVIEW";
        return (
          <div className="flex items-center gap-2">
            <ProfileStatusBadge status={status} />
            {awaiting && (
              <>
                <button
                  onClick={() => review(p.id, "APPROVED")}
                  disabled={reviewing === p.id}
                  className="rounded-lg bg-calma-success px-2.5 py-1 text-xs font-medium text-white transition-colors hover:bg-calma-success/90 disabled:opacity-50"
                >
                  Approve
                </button>
                <button
                  onClick={() => {
                    setRejectTarget(p);
                    setReason("");
                  }}
                  disabled={reviewing === p.id}
                  className="rounded-lg bg-red-50 px-2.5 py-1 text-xs font-medium text-red-600 transition-colors hover:bg-red-100 disabled:opacity-50"
                >
                  Reject
                </button>
              </>
            )}
          </div>
        );
      },
    },
    {
      key: "earned",
      label: "Earned",
      render: (p) => (
        <span className="font-semibold text-calma-ink">{p.commissionEarned.toFixed(2)} TND</span>
      ),
    },
    {
      key: "rate",
      label: "Commission rate",
      render: (p) => <RateEditor partner={p} onSave={(rate) => updateRate(p.id, rate)} />,
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-fraunces text-2xl font-normal text-calma-ink">
            Automatic commission
          </h1>
          <p className="mt-1 text-calma-taupe">
            {partners.length} B2B partner{partners.length !== 1 ? "s" : ""}
          </p>
        </div>
        <div className="flex items-center gap-2 rounded-xl bg-admin-gold/10 px-4 py-2.5">
          <TrendingUp className="h-4 w-4 text-admin-gold" />
          <span className="text-sm font-semibold text-admin-gold">
            {totalEarned.toFixed(2)} TND collected in commission
          </span>
        </div>
      </div>

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <CollectionList
        items={partners}
        getId={(p) => p.id}
        columns={columns}
        loading={loading}
        emptyIcon={Percent}
        emptyTitle="No B2B partners yet"
      />

      {rejectTarget && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
          onClick={() => setRejectTarget(null)}
        >
          <div
            className="w-full max-w-md rounded-2xl bg-white p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="mb-1 text-lg font-bold text-calma-ink">
              Reject {rejectTarget.name ?? rejectTarget.email}&apos;s application?
            </h3>
            <p className="mb-4 text-sm text-calma-taupe">
              Optionally tell the partner why — this reason is shown to them.
            </p>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              rows={3}
              placeholder="Reason (optional)"
              className="mb-4 w-full resize-none rounded-xl border border-calma-border px-3 py-2 text-sm focus:border-admin-gold focus:outline-none"
            />
            <div className="flex gap-3">
              <button
                onClick={() => setRejectTarget(null)}
                className="flex-1 rounded-xl border border-calma-border px-4 py-2.5 font-medium text-calma-ink transition-colors hover:bg-calma-sand"
              >
                Cancel
              </button>
              <button
                onClick={confirmReject}
                disabled={reviewing === rejectTarget.id}
                className="flex-1 rounded-xl bg-red-500 px-4 py-2.5 font-medium text-white transition-colors hover:bg-red-600 disabled:opacity-50"
              >
                {reviewing === rejectTarget.id ? "Rejecting…" : "Reject"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
