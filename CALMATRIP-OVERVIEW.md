# Calma Trip — Vue d'ensemble de la plateforme

## Qu'est-ce que Calma Trip ?

Calma Trip est une plateforme de réservation de voyage tunisienne (transferts, excursions,
activités, marketplace artisanale, contenu "explore"). Fondée à Hammamet, elle met en relation
voyageurs et prestataires locaux avec des prix locaux, une réservation instantanée et un support
multilingue (français, anglais, arabe) 24/7.

Trois types d'utilisateurs :

- **Voyageurs (USER)** — réservent des services, achètent sur la marketplace, gèrent leurs favoris.
- **Partenaires (B2B)** — agences/prestataires qui publient leurs propres services, produits et
  expériences "explore" (soumis à validation admin avant publication).
- **Administrateurs (ADMIN)** — modèrent le contenu B2B, gèrent bookings, commandes, avis, contenu
  éditorial (guides, événements, musées, FAQ).

## Stack technique

Next.js 15 (App Router) · React 18 · TypeScript · Prisma / MySQL · NextAuth v5 (Google + email/mot
de passe) · Tailwind CSS v4 · MUI + Radix UI. Déployé en PWA (installable, service worker).

## Combien de pages ?

**44 pages** (`page.tsx`) au total, réparties en 4 espaces :

| Espace     | Pages | Détail                                                                                                                                                                                 |
| ---------- | ----: | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Public** |    16 | accueil, à propos, contact, services (+ page détail par service), marketplace (+ détail, panier, checkout, commandes, wishlist), explore, guides (+ détail), favoris, dashboard client |
| **Auth**   |     6 | connexion / inscription voyageur, connexion / inscription partenaire, erreurs et finalisation d'auth                                                                                   |
| **Admin**  |    17 | dashboard, réservations, clients, contacts, événements, FAQ, guides, musées, newsletter, avis, services, partenaires B2B, marketplace (produits/commandes)                             |
| **B2B**    |     5 | dashboard partenaire, explore, produits, ventes, profil                                                                                                                                |

À cela s'ajoutent **72 routes API** (`route.ts`, non comptées comme "pages" — ce sont des
endpoints JSON) et une poignée de pages système (404, erreurs) non listées ci-dessus.

Sur ces 44 pages, seules les **16 pages publiques** (moins les pages transactionnelles/connectées
comme le panier ou le dashboard) sont destinées à être indexées par Google — les espaces
admin/B2B/auth sont bloqués via `robots.txt`.
