"use client";
import { LegalPageLayout, LegalSection } from "@/components/legal/LegalPageLayout";

export default function PrivacyPolicyPage() {
  return (
    <LegalPageLayout title="Politique de confidentialité" updatedAt="4 septembre 2026">
      <p>
        Calma Trip (« nous », « notre ») exploite le site calmatrip.com et propose des services de
        transferts, excursions, réservation de prestations touristiques et une marketplace de
        produits artisanaux tunisiens. La présente politique explique quelles données personnelles
        nous collectons, pourquoi, et quels droits vous avez sur ces données.
      </p>

      <LegalSection title="1. Données que nous collectons">
        <p>Selon votre usage du site, nous pouvons collecter :</p>
        <ul className="list-disc space-y-1 pl-5">
          <li>
            <strong>Compte :</strong> nom, adresse email, mot de passe (chiffré) ou identifiant
            Google si vous vous connectez via Google.
          </li>
          <li>
            <strong>Réservations et commandes :</strong> détails de la prestation réservée, dates,
            nombre de participants, adresse de livraison pour la marketplace, historique de
            commandes.
          </li>
          <li>
            <strong>Communication :</strong> messages envoyés via le formulaire de contact, les avis
            clients, les échanges avec notre support.
          </li>
          <li>
            <strong>Partenaires (B2B) :</strong> informations professionnelles fournies lors de
            l’inscription en tant que partenaire (agence, artisan, guide).
          </li>
          <li>
            <strong>Données techniques :</strong> adresse IP, type de navigateur, pages consultées,
            à des fins de sécurité (limitation du taux de requêtes) et d’amélioration du site.
          </li>
        </ul>
      </LegalSection>

      <LegalSection title="2. Pourquoi nous utilisons ces données">
        <ul className="list-disc space-y-1 pl-5">
          <li>Créer et gérer votre compte, traiter vos réservations et commandes.</li>
          <li>
            Vous envoyer les confirmations et informations liées à vos réservations (email, WhatsApp
            si vous y consentez).
          </li>
          <li>Répondre à vos demandes via le formulaire de contact ou le support.</li>
          <li>Assurer la sécurité du site et prévenir les abus.</li>
          <li>Avec votre consentement, vous envoyer notre newsletter.</li>
        </ul>
        <p>
          Nous ne vendons jamais vos données personnelles à des tiers. Nous ne les partageons
          qu’avec les prestataires strictement nécessaires à l’exécution du service (par exemple un
          partenaire local pour honorer une réservation, ou un prestataire d’envoi d’emails).
        </p>
      </LegalSection>

      <LegalSection title="3. Conservation des données">
        <p>
          Vos données de compte sont conservées tant que votre compte est actif. Les données de
          réservation et de commande sont conservées le temps nécessaire au respect de nos
          obligations comptables et légales, puis archivées ou supprimées. Vous pouvez demander la
          suppression de votre compte à tout moment (voir section 5).
        </p>
      </LegalSection>

      <LegalSection title="4. Cookies">
        <p>
          Le site utilise des cookies techniques nécessaires à son fonctionnement (session de
          connexion, préférence de langue, panier de la marketplace). Ces cookies ne servent pas à
          vous pister à des fins publicitaires.
        </p>
      </LegalSection>

      <LegalSection title="5. Vos droits">
        <p>Vous disposez, sur vos données personnelles, d’un droit :</p>
        <ul className="list-disc space-y-1 pl-5">
          <li>d’accès et de rectification,</li>
          <li>de suppression de votre compte et de vos données associées,</li>
          <li>
            d’opposition à l’usage de vos données pour la newsletter (désinscription en un clic),
          </li>
          <li>de portabilité de vos données de réservation.</li>
        </ul>
        <p>
          Pour exercer ces droits, contactez-nous à{" "}
          <a href="mailto:contact@calmatrip.com" className="underline">
            contact@calmatrip.com
          </a>{" "}
          ou au +216 21 622 972. Nous répondons sous 30 jours.
        </p>
      </LegalSection>

      <LegalSection title="6. Sécurité">
        <p>
          Les mots de passe sont stockés de façon chiffrée (hachage). Les fichiers que vous
          téléversez (photos de profil, justificatifs partenaires) sont validés avant stockage.
          Aucun système n’étant infaillible, nous vous invitons à utiliser un mot de passe unique et
          robuste pour votre compte Calma Trip.
        </p>
      </LegalSection>

      <LegalSection title="7. Modifications">
        <p>
          Cette politique peut être mise à jour ; la date en haut de page indique la dernière
          révision. En cas de changement important, nous vous en informerons par email.
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
