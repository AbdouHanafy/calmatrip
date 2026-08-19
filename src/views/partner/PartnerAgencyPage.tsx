"use client";

import { Compass, MapPin, Percent, Zap, LayoutDashboard } from "lucide-react";
import { PartnerTypeDetail } from "./PartnerTypeDetail";

export default function PartnerAgencyPage() {
  return (
    <PartnerTypeDetail
      icon={Compass}
      eyebrow="Espace agence"
      title="Publiez vos activités et hébergements sur Explore"
      subtitle="Comme sur GetYourGuide ou TripAdvisor, exposez vos excursions, activités et hôtels à des voyageurs qui explorent la Tunisie sur Calma Trip Explore."
      accent="#4A667D"
      benefits={[
        {
          icon: MapPin,
          title: "Visibilité sur Explore",
          desc: "Vos activités, hôtels ou adresses affichés parmi les découvertes recommandées aux voyageurs.",
        },
        {
          icon: Percent,
          title: "Commission claire",
          desc: "Un taux de commission fixé à l'avance, avec un suivi net de vos gains à chaque validation.",
        },
        {
          icon: Zap,
          title: "Publication rapide",
          desc: "Soumettez une nouvelle annonce en quelques minutes depuis votre espace partenaire.",
        },
        {
          icon: LayoutDashboard,
          title: "Un espace dédié",
          desc: "Gérez toutes vos annonces, suivez leur statut de validation, depuis un seul tableau de bord.",
        },
      ]}
      steps={[
        "Créez votre compte agence en quelques secondes.",
        "Publiez vos activités, circuits ou hébergements : catégorie, ville, photo, description.",
        "Notre équipe valide votre annonce avant sa mise en ligne.",
        "Votre annonce apparaît sur Explore, visible par les voyageurs.",
      ]}
      ctaHref="/partner/register?type=agency"
      ctaLabel="S'inscrire comme agence"
      otherHref="/partner/artisan"
      otherLabel="Vous êtes plutôt un artisan ? Découvrez l'espace artisan →"
    />
  );
}
