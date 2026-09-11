"use client";
import { LegalPageLayout, LegalSection } from "@/components/legal/LegalPageLayout";

export default function TermsOfSalePage() {
  return (
    <LegalPageLayout title="Conditions générales de vente" updatedAt="4 septembre 2026">
      <p>
        Les présentes conditions générales de vente (« CGV ») régissent toute réservation de service
        (transferts, excursions, prestations touristiques) et tout achat de produit sur la
        marketplace effectués via le site calmatrip.com, exploité par Calma Trip, Avenue Habib
        Bourguiba, Hammamet, Tunisie.
      </p>

      <LegalSection title="1. Services proposés">
        <p>Calma Trip propose deux types d’offres, avec des conditions distinctes :</p>
        <ul className="list-disc space-y-1 pl-5">
          <li>
            <strong>Prestations touristiques</strong> (transferts, excursions, activités) — fournies
            par Calma Trip ou par des partenaires professionnels vérifiés (guides, agences)
            référencés sur le site.
          </li>
          <li>
            <strong>Marketplace</strong> — produits artisanaux et souvenirs vendus par des
            partenaires tiers ; Calma Trip agit comme intermédiaire de mise en relation et de
            paiement.
          </li>
        </ul>
        <p>
          Le contenu (descriptions, photos, prix) des prestations et produits proposés par des
          partenaires est fourni par ces derniers et modéré par notre équipe avant publication, mais
          Calma Trip ne garantit pas l’exactitude exhaustive de chaque annonce partenaire.
        </p>
      </LegalSection>

      <LegalSection title="2. Prix et paiement">
        <p>
          Les prix affichés sont ceux en vigueur au moment de la réservation, en dinars tunisiens
          (TND) sauf mention contraire, toutes taxes comprises le cas échéant. Le paiement est
          exigible au moment de la réservation ou de la commande, selon le moyen de paiement proposé
          sur le site.
        </p>
      </LegalSection>

      <LegalSection title="3. Confirmation de réservation">
        <p>
          Toute réservation ou commande donne lieu à une confirmation envoyée à l’adresse email
          renseignée. Il vous appartient de vérifier l’exactitude des informations saisies (dates,
          nombre de participants, adresse de livraison) avant de valider.
        </p>
      </LegalSection>

      <LegalSection title="4. Annulation et remboursement">
        <ul className="list-disc space-y-1 pl-5">
          <li>
            <strong>Prestations touristiques :</strong> les conditions d’annulation (délai, frais
            éventuels) sont précisées sur la fiche de chaque prestation avant réservation. Sauf
            mention contraire, une annulation communiquée au moins 48 heures avant la date prévue
            donne droit à un remboursement intégral.
          </li>
          <li>
            <strong>Marketplace :</strong> conformément au droit de rétractation applicable, vous
            disposez d’un délai raisonnable après réception pour signaler un produit non conforme et
            demander un remboursement ou un échange, sauf pour les produits personnalisés ou
            périssables.
          </li>
        </ul>
        <p>
          Toute demande d’annulation ou de remboursement se fait via « Mes réservations » / « Mes
          commandes » sur votre espace client, ou en contactant{" "}
          <a href="mailto:contact@calmatrip.com" className="underline">
            contact@calmatrip.com
          </a>
          .
        </p>
      </LegalSection>

      <LegalSection title="5. Responsabilité">
        <p>
          Calma Trip met en relation les voyageurs avec des prestataires locaux vérifiés mais n’est
          pas l’organisateur direct des prestations fournies par des partenaires tiers. Notre
          responsabilité se limite à la bonne mise en relation, au traitement du paiement et au
          support client. Nous ne saurions être tenus responsables des faits imprévisibles échappant
          à notre contrôle raisonnable (conditions météorologiques, décisions administratives, cas
          de force majeure).
        </p>
      </LegalSection>

      <LegalSection title="6. Avis clients">
        <p>
          Les avis publiés sur le site reflètent l’expérience des clients ayant effectivement
          réservé une prestation ou acheté un produit. Calma Trip se réserve le droit de modérer
          tout avis manifestement abusif, injurieux ou hors sujet.
        </p>
      </LegalSection>

      <LegalSection title="7. Droit applicable et litiges">
        <p>
          Les présentes CGV sont soumises au droit tunisien. En cas de litige, une solution amiable
          sera recherchée en priorité en nous contactant directement ; à défaut, les tribunaux
          compétents de Tunisie seront seuls saisis.
        </p>
      </LegalSection>

      <LegalSection title="8. Contact">
        <p>
          Calma Trip — Avenue Habib Bourguiba, Hammamet, Tunisie
          <br />
          Email :{" "}
          <a href="mailto:contact@calmatrip.com" className="underline">
            contact@calmatrip.com
          </a>{" "}
          — Téléphone : +216 21 622 972
        </p>
      </LegalSection>
    </LegalPageLayout>
  );
}
