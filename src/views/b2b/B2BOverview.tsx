'use client';
import { useSession } from "next-auth/react";
import { Clock, CheckCircle2, XCircle, Package, Compass } from "lucide-react";

export default function B2BOverview() {
  const { data: session } = useSession();
  const b2bType = session?.user?.b2bType;
  const b2bStatus = session?.user?.b2bStatus ?? "pending";

  const statusConfig: Record<string, { icon: typeof Clock; label: string; desc: string; className: string }> = {
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

  return (
    <div className="max-w-3xl">
      <div className={`mb-8 flex items-start gap-3 rounded-calma-card border p-5 ${status.className}`}>
        <StatusIcon className="mt-0.5 h-5 w-5 shrink-0" />
        <div>
          <p className="font-semibold">{status.label}</p>
          <p className="mt-1 text-sm opacity-90">{status.desc}</p>
        </div>
      </div>

      <div className="rounded-calma-card border border-calma-border bg-white p-8 text-center">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-calma-gold/10 text-calma-gold">
          {b2bType === "ARTISAN" ? <Package size={26} /> : <Compass size={26} />}
        </div>
        <h2 className="font-fraunces text-xl font-normal text-calma-ink">
          {b2bType === "ARTISAN" ? "Gestion de vos produits" : "Gestion de vos circuits"}
        </h2>
        <p className="mx-auto mt-2 max-w-sm text-sm text-calma-taupe">
          {b2bType === "ARTISAN"
            ? "La création et le suivi de vos produits Marketplace arrivent bientôt ici."
            : "La création et le suivi de vos services Explorer arrivent bientôt ici."}
        </p>
      </div>
    </div>
  );
}
