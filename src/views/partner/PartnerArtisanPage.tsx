"use client";

import { Store, Percent, Users, ShieldCheck, Package } from "lucide-react";
import { PartnerTypeDetail } from "./PartnerTypeDetail";

export default function PartnerArtisanPage() {
  return (
    <PartnerTypeDetail
      icon={Store}
      eyebrow="Espace artisan"
      title="Vendez vos créations à des milliers de voyageurs"
      subtitle="Rejoignez la Marketplace Calma Trip et faites découvrir votre artisanat — poterie, textile, bijoux, produits locaux — à des voyageurs venus du monde entier."
      accent="#5E8B63"
      benefits={[
        {
          icon: Percent,
          title: "Commission simple et transparente",
          desc: "Un taux de commission clair, fixé à l'avance — pas de frais cachés sur vos ventes.",
        },
        {
          icon: Users,
          title: "Visibilité auprès des voyageurs",
          desc: "Vos produits exposés directement aux visiteurs qui préparent leur séjour en Tunisie.",
        },
        {
          icon: ShieldCheck,
          title: "Paiements et suivi sécurisés",
          desc: "Suivez vos ventes et vos commissions en temps réel depuis votre espace partenaire.",
        },
        {
          icon: Package,
          title: "Gestion en quelques clics",
          desc: "Ajoutez, modifiez ou retirez vos produits à tout moment depuis votre tableau de bord.",
        },
      ]}
      steps={[
        "Créez votre compte artisan en quelques secondes.",
        "Ajoutez vos produits : photos, description, prix et stock.",
        "Notre équipe valide votre annonce avant sa mise en ligne.",
        "Vos produits sont visibles sur la Marketplace et vous commencez à vendre.",
      ]}
      ctaHref="/partner/register?type=artisan"
      ctaLabel="S'inscrire comme artisan"
      otherHref="/partner/agency"
      otherLabel="Vous êtes plutôt une agence ? Découvrez l'espace agence →"
    />
  );
}
