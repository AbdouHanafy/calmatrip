"use client";
import { LegalPageLayout, LegalSection } from "@/components/legal/LegalPageLayout";

export default function LegalNoticePage() {
  return (
    <LegalPageLayout title="Mentions légales" updatedAt="4 septembre 2026">
      <div className="rounded-2xl border border-calma-terracotta/30 bg-calma-terracotta/[.06] p-5 text-sm text-calma-ink/80">
        <strong>À compléter avant mise en ligne :</strong> les champs marqués{" "}
        <code className="rounded bg-white/60 px-1.5 py-0.5">[À compléter]</code> ci-dessous doivent
        être remplacés par les informations légales réelles de votre société (forme juridique,
        numéro d’immatriculation, capital, gérant) avant l’ouverture publique du site. Nous n’avons
        pas inventé de numéro d’immatriculation fictif.
      </div>

      <LegalSection title="1. Éditeur du site">
        <p>
          Le site calmatrip.com est édité par <strong>[À compléter — raison sociale]</strong>, [À
          compléter — forme juridique, ex. SARL / société unipersonnelle], au capital de [À
          compléter] TND, immatriculée sous le numéro [À compléter — matricule fiscal / RNE], dont
          le siège social est situé Avenue Habib Bourguiba, Hammamet, Tunisie.
        </p>
        <p>Directeur de la publication : [À compléter — nom du représentant légal].</p>
        <p>
          Contact :{" "}
          <a href="mailto:contact@calmatrip.com" className="underline">
            contact@calmatrip.com
          </a>{" "}
          — +216 21 622 972
        </p>
      </LegalSection>

      <LegalSection title="2. Hébergement">
        <p>
          Le site est hébergé sur un serveur privé (VPS). [À compléter — nom, adresse et contact de
          l’hébergeur].
        </p>
      </LegalSection>

      <LegalSection title="3. Propriété intellectuelle">
        <p>
          L’ensemble des contenus présents sur le site (textes, photographies, logo, charte
          graphique) est la propriété de Calma Trip ou de ses partenaires, sauf mention contraire,
          et est protégé par le droit d’auteur. Toute reproduction sans autorisation préalable est
          interdite.
        </p>
      </LegalSection>

      <LegalSection title="4. Contenu partenaire">
        <p>
          Les annonces publiées par les partenaires B2B (agences, artisans, guides) relèvent de la
          responsabilité de leurs auteurs respectifs. Calma Trip modère ces contenus avant
          publication mais n’en garantit pas l’exactitude exhaustive.
        </p>
      </LegalSection>

      <LegalSection title="5. Contact">
        <p>
          Pour toute question relative aux présentes mentions légales :{" "}
          <a href="mailto:contact@calmatrip.com" className="underline">
            contact@calmatrip.com
          </a>
        </p>
      </LegalSection>
    </LegalPageLayout>
  );
}
