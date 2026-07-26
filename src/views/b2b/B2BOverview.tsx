"use client";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import {
  Clock,
  CheckCircle2,
  XCircle,
  Package,
  Compass,
  TrendingUp,
  Percent,
  Wallet,
} from "lucide-react";
import Link from "next/link";

interface OverviewStats {
  b2bType: "ARTISAN" | "AGENCY";
  listingsCount: number;
  bookingsCount: number;
  confirmedCount: number;
  revenue: number;
  commission: number;
  netEarnings: number;
  commissionRate: number;
}

export default function B2BOverview() {
  const { data: session } = useSession();
  const b2bType = session?.user?.b2bType;
  const b2bStatus = session?.user?.b2bStatus ?? "pending";
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
  const listingsLabel = isAgency ? "Services publiés" : "Produits publiés";
  const listingsHref = isAgency ? "/b2b/services" : "/b2b/products";
  const salesLabel = isAgency ? "Réservations" : "Ventes";

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

      {loading ? (
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-28 animate-pulse rounded-calma-card bg-calma-sand" />
          ))}
        </div>
      ) : stats ? (
        <>
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            <Link
              href={listingsHref}
              className="rounded-calma-card border border-calma-border bg-white p-5 no-underline transition-shadow hover:shadow-md"
            >
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-calma-olive/10 text-calma-olive">
                {isAgency ? <Compass className="h-5 w-5" /> : <Package className="h-5 w-5" />}
              </div>
              <p className="font-fraunces text-2xl text-calma-ink">{stats.listingsCount}</p>
              <p className="text-xs text-calma-taupe">{listingsLabel}</p>
            </Link>
            <div className="rounded-calma-card border border-calma-border bg-white p-5">
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-calma-terracotta/10 text-calma-terracotta">
                <TrendingUp className="h-5 w-5" />
              </div>
              <p className="font-fraunces text-2xl text-calma-ink">{stats.confirmedCount}</p>
              <p className="text-xs text-calma-taupe">{salesLabel} confirmées</p>
            </div>
            <div className="rounded-calma-card border border-calma-border bg-white p-5">
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-calma-success/10 text-calma-success">
                <Wallet className="h-5 w-5" />
              </div>
              <p className="font-fraunces text-2xl text-calma-ink">
                {stats.netEarnings.toFixed(2)} TND
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
            Voir le détail {isAgency ? "des réservations" : "des ventes"} et commissions →
          </Link>
        </>
      ) : (
        <div className="rounded-calma-card border border-calma-border bg-white p-8 text-center">
          <p className="text-sm text-calma-taupe">
            Impossible de charger vos statistiques pour le moment.
          </p>
        </div>
      )}
    </div>
  );
}
