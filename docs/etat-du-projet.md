# Calma Trip — état du projet

_Mis à jour le 30 septembre 2026._

Ce document décrit ce qui existe aujourd'hui sur le site public et dans le back-office, ce qui a changé lors de la dernière série de travaux, et ce qu'il reste à faire avant la mise en ligne.

---

## 1. En bref

| Zone            | État                                                                                                                               |
| --------------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| Page d'accueil  | Refaite dans un style « marketplace d'activités » (type GetYourGuide) : photo, barre de recherche, cartes d'activités réelles.     |
| Header / footer | Refaits : header blanc fixe, footer clair avec les coordonnées issues des réglages du site.                                        |
| Recherche       | Barre Destination · Service · Date · Participants, page de résultats `/search`.                                                    |
| Back-office     | Nouvelles pages **Destinations** et onglet **Réglages → Search** ; destinations assignables à chaque service.                      |
| Contenu         | Photos réelles (Wikimedia Commons) et données de démonstration réalistes en local. **La production n'est pas encore mise à jour.** |
| Qualité         | Type-check et lint OK, 278 tests passent.                                                                                          |

---

## 2. Site public

### Page d'accueil (`/`)

De haut en bas :

1. **Hero** — une seule photo (vieux port de Bizerte, avec légende), titre, sous-titre et barre de recherche.
2. **Catégories** — pastilles vers les catégories réelles de l'Explorer (Sites, Activités, Cafés, Pépites cachées, Musées, Événements) et vers les services.
3. **Garanties** — annulation gratuite 24 h, prix locaux, guides locaux, support 24/7 (promesses déjà présentes ailleurs sur le site).
4. **Excursions et transferts** — carrousel des services actifs (populaires d'abord).
5. **Où aller en Tunisie** — 6 destinations (Sidi Bou Saïd, Carthage, Kairouan, El Jem, Tozeur, Douz) qui ouvrent l'Explorer filtré.
6. **Proposé par nos partenaires locaux** — annonces Explorer approuvées.
7. **Artisanat tunisien** — produits de la marketplace.
8. **Avis** — grille des avis approuvés (masquée tant qu'il n'y en a aucun).
9. **Bannière sur mesure** — groupes / circuits, lien devis + téléphone.
10. **Formulaire d'avis** — seul endroit où un voyageur peut laisser un avis.

Tout ce qui s'affiche vient de la base de données : aucune note, statistique ou témoignage inventé. Les effets « générés » (particules, parallaxe, diaporama, pastilles flottantes, titres en italique) ont été supprimés.

### Barre de recherche

| Champ        | Comportement                                                                                                                                     |
| ------------ | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| Destination  | Texte fixe « Hammamet » tant qu'une seule destination est active ; devient une liste déroulante dès qu'une deuxième est activée dans l'admin.    |
| Service      | « Tous les services » + les services actifs proposés dans la destination choisie.                                                                |
| Date         | Panneau calendrier : Aujourd'hui, Demain, Le week-end prochain, Date flexible ; deux mois côte à côte (un seul sur mobile), jours passés barrés. |
| Participants | Adultes (18 ans et +) et Enfants (0–17 ans), plafonnés par le réglage admin ; au plafond, lien « Demandez un devis ».                            |

- **Un service choisi** → ouvre directement sa fiche `/services/[id]`.
- **Aucun service** → `/search?destination=…&date=…&adults=…&children=…`, qui liste les services et annonces de la destination, avec la barre pré-remplie.

### Header et footer

- **Header** : blanc, fixe en haut, logo (pictogramme agrandi), menu issu du CMS de navigation, sélecteur de langue FR/EN/AR, bouton Connexion (initiales une fois connecté). « Devenir partenaire » apparaît seul à partir de 1700 px, sinon dans le menu Connexion. Menu burger sous 1280 px.
- **Footer** : fond crème, colonnes Explorer / Société (menus CMS), Nous contacter (téléphone, WhatsApp, email, adresse depuis **Réglages → Contact**), Newsletter, liens légaux traduits.

### Langues

Tous les nouveaux textes existent en français, anglais et arabe (avec mise en page de droite à gauche en arabe).

---

## 3. Back-office — ce que l'admin peut gérer

| Écran                         | Chemin                  | Ce qu'on y fait                                                                                                               |
| ----------------------------- | ----------------------- | ----------------------------------------------------------------------------------------------------------------------------- |
| Destinations _(nouveau)_      | `/admin/destinations`   | Ajouter, renommer, supprimer, réordonner ; bouton **Visible / Hidden** pour l'afficher ou non dans la barre de recherche.     |
| Experiences & services        | `/admin/services`       | Nouveau bloc **Destinations** dans chaque fiche : cocher où le service est proposé. **Aucune case cochée = proposé partout.** |
| Réglages → Search _(nouveau)_ | `/admin/cms/settings`   | Afficher/masquer le champ Date, afficher/masquer le champ Participants, nombre maximum de participants (1–99, défaut 20).     |
| Réglages → Contact            | `/admin/cms/settings`   | Téléphone, WhatsApp, email et adresse affichés dans le footer et la bannière « sur mesure ».                                  |
| Navigation                    | `/admin/cms/navigation` | Liens du header et des colonnes du footer.                                                                                    |

**Pour ajouter une destination (ex. Djerba)** : Admin → Destinations → activer « Djerba » (ou la créer) → dans chaque service concerné, cocher Djerba. Les annonces partenaires dont la ville contient « Djerba » apparaissent aussi dans ses résultats.

---

## 4. Données et contenu

### Photos

14 photos réelles de Tunisie ajoutées dans `public/images/services/`, `public/images/products/` et `public/images/explore/`. Sources et licences : [`public/images/CREDITS.md`](../public/images/CREDITS.md).

> ⚠️ 10 de ces photos sont sous licence CC BY / CC BY-SA : **le nom de l'auteur et la licence doivent être affichés sur le site** (par exemple une section « Crédits photos » dans les mentions légales). À faire avant la mise en ligne, ou remplacer par vos propres photos.

### Données de démonstration (base locale uniquement)

| Avant                                 | Après                                                                                       |
| ------------------------------------- | ------------------------------------------------------------------------------------------- |
| Services test « llllaaaa », « AZEAZ » | Mountain Oases & Chott el-Jérid by 4x4 (dès 120 TND), Ksar Ghilane Overnight (dès 290 TND)  |
| Annonces test « azeaze », « sfdgdf »  | Aghlabid Basins – Kairouan (12 TND), Sunset Camel Ride – Douz (dès 40 TND)                  |
| T-shirt, casquette, hoodie, mug…      | Assiette de Nabeul, mini tajine, tasse de Nabeul, fouta, tapis mergoum de Kairouan, chéchia |

Les prix, durées et descriptions sont **réalistes mais à valider**. Le fichier `prisma/seed.ts` contient désormais les produits artisanaux et ne crée que Hammamet comme destination active.

### Base de données

Nouvelle migration `20260930204547_search_destinations` :

- champ `active` sur `Destination` ;
- liaison plusieurs-à-plusieurs `Service` ↔ `Destination` ;
- seule **Hammamet** reste active (créée si absente).

Elle s'applique automatiquement en production via `npm run build` (`prisma migrate deploy`).

---

## 5. Architecture (pour les développeurs)

| Élément             | Fichier(s)                                                                                                    |
| ------------------- | ------------------------------------------------------------------------------------------------------------- |
| Page d'accueil      | `src/app/page.tsx` (données) → `src/views/Home.tsx` → `src/components/home/*`                                 |
| Barre de recherche  | `src/components/search/SearchBar.tsx`, `DatePanel.tsx`, `ParticipantsPanel.tsx`, `dates.ts`                   |
| Options de la barre | `src/lib/searchOptions.ts` (destinations actives + services actifs)                                           |
| Page de résultats   | `src/app/search/page.tsx` → `src/views/SearchPage.tsx`                                                        |
| Recherche en base   | `src/repositories/searchRepository.ts`                                                                        |
| Destinations        | `src/repositories/destinationRepository.ts`, `src/schemas/destination.ts`, `src/app/api/admin/destinations/*` |
| Cartes partagées    | `src/lib/activities.ts` (mapping service/annonce/produit → carte)                                             |
| Réglages « Search » | `src/features/cms/schemas/settingsSchemas.ts`, `src/features/cms/services/settings.ts`                        |
| Textes FR/EN/AR     | `src/lib/calma/i18n.tsx` (`home`, `layout`, `search`)                                                         |

Tests ajoutés : schémas `search` et `destination`, repositories `search` et `destination`, calendrier (`dates.test.ts`), réglages `search`.

Autres corrections :

- `next.config.ts` : `res.cloudinary.com` ré-autorisé pour les anciennes images encore en base (le passage au stockage local l'avait retiré et faisait planter les pages).
- La création d'un service via l'API perdait ses « features » : corrigé.
- La recherche de l'Explorer tient compte de la ville.
- Les pastilles de catégories de l'ancienne page d'accueil pointaient vers des catégories inexistantes : corrigé.

---

## 6. Reste à faire

### Avant la mise en ligne

- [ ] **Crédits photos** visibles sur le site (voir §4), ou remplacement par vos photos.
- [ ] **Production** : remplacer les données de test et les produits fictifs via l'admin (seule la base locale a été corrigée).
- [ ] **Valider les prix / durées / descriptions** des services et produits de démonstration.
- [ ] **Mentions légales** : compléter les champs `[À compléter]` (raison sociale, RNE, hébergeur…).
- [ ] **Photos manquantes** : ajouter des photos aux services qui n'en ont pas en production.

### Améliorations suivantes

- [ ] **Date et participants → réservation** : ils sont transmis dans l'URL de la fiche service mais pas encore utilisés pour pré-remplir la réservation (qui se fait dans l'espace client).
- [ ] **Page Services** : retirer les statistiques peu crédibles (« 75 % de satisfaction », « Support 18/7 »).
- [ ] **Formulaire d'avis** : l'aligner sur le nouveau style (carte dans une carte, bouton délavé).
- [ ] **Variables d'environnement locales** manquantes (Google OAuth, VAPID, SMTP, Twilio) : connexion Google, notifications push et emails désactivés en local.
- [ ] **`CLAUDE.md`** : mettre à jour la mention « images sur Cloudinary » (le stockage est désormais local, Cloudinary seulement pour les anciennes images).

---

## 7. Lancer le projet

```bash
npm install
npm run db:start          # MySQL portable (auto via predev/prebuild/pretest)
npx prisma migrate deploy
npm run db:seed           # facultatif : repart des données de démo
npm run dev               # http://localhost:3000
npm run test              # 278 tests
```
