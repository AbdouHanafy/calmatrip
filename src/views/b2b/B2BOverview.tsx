"use client";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import {
  Clock,
  CheckCircle2,
  XCircle,
  Package,
  MapPin,
  TrendingUp,
  Percent,
  Wallet,
  Hourglass,
  Plus,
} from "lucide-react";
import Link from "next/link";

interface OverviewStats {
  b2bType: "ARTISAN" | "AGENCY";
  listingsCount: number;
  // ARTISAN only
  bookingsCount?: number;
  confirmedCount?: number;
  revenue?: number;
  commission?: number;
  netEarnings?: number;
  commissionRate?: number;
  // AGENCY only
  approvedCount?: number;
  pendingCount?: number;
}

export default function B2BOverview() {
  const { data: session } = useSession();
  const b2bType = session?.user?.b2bType?.toUpperCase() as "ARTISAN" | "AGENCY" | undefined;
  const b2bStatus = (session?.user?.b2bStatus ?? "pending").toLowerCase();
  const [stats, setStats] = useState<OverviewStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/b2b/overview")
      .then((res) => (res.ok ? res.json() : null))
      .then(setStats)
      .catch(() => setStats(null))
      .finally(() => setLoading(false));
  }, []);

  const statusConfig: Record<
    string,
    { icon: typeof Clock; label: string; desc: string; className: string }
  > = {
    pending: {
      icon: Clock,
      label: "Compte en attente de validation",
      desc: "Notre équipe vérifie votre profil. Vous serez notifié dès que votre compte sera approuvé.",
      className: "bg-calma-gold/10 border-calma-gold/25 text-[#8A6B2E]",
    },
    approved: {
      icon: CheckCircle2,
      label: "Compte approuvé",
      desc: "Votre compte partenaire est actif.",
      className: "bg-calma-success/10 border-calma-success/25 text-calma-success",
    },
    rejected: {
      icon: XCircle,
      label: "Compte non approuvé",
      desc: "Contactez notre équipe pour plus d'informations sur cette décision.",
      className: "bg-red-50 border-red-200 text-red-600",
    },
  };

  const status = statusConfig[b2bStatus] ?? statusConfig.pending;
  const StatusIcon = status.icon;
  const isAgency = b2bType === "AGENCY";
  const listingsLabel = isAgency ? "Annonces Explore" : "Produits publiés";
  const listingsHref = isAgency ? "/b2b/explore" : "/b2b/products";

  return (
    <div className="max-w-4xl">
      <div
        className={`mb-8 flex items-start gap-3 rounded-calma-card border p-5 ${status.className}`}
      >
        <StatusIcon className="mt-0.5 h-5 w-5 shrink-0" />
        <div>
          <p className="font-semibold">{status.label}</p>
          <p className="mt-1 text-sm opacity-90">{status.desc}</p>
        </div>
      </div>

      {/* Quick actions — the entry point to actually manage inventory, so the
          space never reads as an empty shell with nothing to do. */}
      <div className="mb-6 flex flex-wrap gap-3">
        {b2bType === "ARTISAN" && (
          <>
            <Link
              href="/b2b/products"
              className="flex items-center gap-2 rounded-xl bg-calma-gold px-4 py-2.5 text-sm font-semibold text-[#241A12] no-underline transition-shadow hover:shadow-lg"
            >
              <Plus className="h-4 w-4" /> Ajouter un produit
            </Link>
            <Link
              href="/b2b/services"
              className="flex items-center gap-2 rounded-xl border border-calma-gold/40 bg-white px-4 py-2.5 text-sm font-semibold text-[#8A6B2E] no-underline transition-colors hover:bg-calma-gold/5"
            >
              <Plus className="h-4 w-4" /> Ajouter un service
            </Link>
          </>
        )}
        {isAgency && (
          <Link
            href="/b2b/explore"
            className="flex items-center gap-2 rounded-xl bg-calma-gold px-4 py-2.5 text-sm font-semibold text-[#241A12] no-underline transition-shadow hover:shadow-lg"
          >
            <Plus className="h-4 w-4" /> Ajouter une annonce Explore
          </Link>
        )}
      </div>

      {loading ? (
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-28 animate-pulse rounded-calma-card bg-calma-sand" />
          ))}
        </div>
      ) : stats && isAgency ? (
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-3">
          <Link
            href={listingsHref}
            className="rounded-calma-card border border-calma-border bg-white p-5 no-underline transition-shadow hover:shadow-md"
          >
            <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-calma-olive/10 text-calma-olive">
              <MapPin className="h-5 w-5" />
            </div>
            <p className="font-fraunces text-2xl text-calma-ink">{stats.listingsCount}</p>
            <p className="text-xs text-calma-taupe">{listingsLabel}</p>
          </Link>
          <div className="rounded-calma-card border border-calma-border bg-white p-5">
            <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-calma-success/10 text-calma-success">
              <CheckCircle2 className="h-5 w-5" />
            </div>
            <p className="font-fraunces text-2xl text-calma-ink">{stats.approvedCount ?? 0}</p>
            <p className="text-xs text-calma-taupe">Approuvées, visibles sur Explore</p>
          </div>
          <div className="rounded-calma-card border border-calma-border bg-white p-5">
            <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-calma-gold/10 text-[#8A6B2E]">
              <Hourglass className="h-5 w-5" />
            </div>
            <p className="font-fraunces text-2xl text-calma-ink">{stats.pendingCount ?? 0}</p>
            <p className="text-xs text-calma-taupe">En attente de validation</p>
          </div>
        </div>
      ) : null}

      {!loading && stats && isAgency && (
        <Link
          href="/b2b/sales"
          className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-calma-terracotta no-underline hover:text-calma-olive"
        >
          Voir mes réservations et commissions →
        </Link>
      )}

      {!loading && stats && !isAgency ? (
        <>
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            <Link
              href={listingsHref}
              className="rounded-calma-card border border-calma-border bg-white p-5 no-underline transition-shadow hover:shadow-md"
            >
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-calma-olive/10 text-calma-olive">
                <Package className="h-5 w-5" />
              </div>
              <p className="font-fraunces text-2xl text-calma-ink">{stats.listingsCount}</p>
              <p className="text-xs text-calma-taupe">{listingsLabel}</p>
            </Link>
            <div className="rounded-calma-card border border-calma-border bg-white p-5">
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-calma-terracotta/10 text-calma-terracotta">
                <TrendingUp className="h-5 w-5" />
              </div>
              <p className="font-fraunces text-2xl text-calma-ink">{stats.confirmedCount ?? 0}</p>
              <p className="text-xs text-calma-taupe">Ventes confirmées</p>
            </div>
            <div className="rounded-calma-card border border-calma-border bg-white p-5">
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-calma-success/10 text-calma-success">
                <Wallet className="h-5 w-5" />
              </div>
              <p className="font-fraunces text-2xl text-calma-ink">
                {(stats.netEarnings ?? 0).toFixed(2)} TND
              </p>
              <p className="text-xs text-calma-taupe">Net perçu (commission déduite)</p>
            </div>
            <div className="rounded-calma-card border border-calma-border bg-white p-5">
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-calma-gold/10 text-calma-gold">
                <Percent className="h-5 w-5" />
              </div>
              <p className="font-fraunces text-2xl text-calma-ink">{stats.commissionRate}%</p>
              <p className="text-xs text-calma-taupe">Taux de commission</p>
            </div>
          </div>

          <Link
            href="/b2b/sales"
            className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-calma-terracotta no-underline hover:text-calma-olive"
          >
            Voir le détail des ventes et commissions →
          </Link>
        </>
      ) : null}

      {!loading && !stats && (
        <div className="rounded-calma-card border border-calma-border bg-white p-8 text-center">
          <p className="text-sm text-calma-taupe">
            Impossible de charger vos statistiques pour le moment.
          </p>
        </div>
      )}
    </div>
  );
}
