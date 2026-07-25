# Handoff : Page d'accueil Calma Trip (hero photo + parallaxe + navigation)

## Overview
Calma Trip est une marketplace d'expériences et de services de voyage en Tunisie
(culture, plage, désert, food), réservées en direct auprès de locaux. Ce handoff
couvre la **page d'accueil** et son système partagé (header, hero de page, footer),
plus 4 pages secondaires : Services, Marketplace, Explorer, À propos.
Le site est **bilingue FR/EN** (bascule dans le header) et repose sur une palette
olive / terre cuite.

## About the Design Files
Les fichiers de ce dossier sont des **références de design réalisées en HTML** —
des prototypes qui montrent l'apparence et le comportement voulus, **pas du code de
production à copier tel quel**. La tâche est de **recréer ces designs dans
l'environnement existant du site** (React / Next / Vue / etc.) en suivant ses
patterns et sa librairie de composants. S'il n'existe pas encore d'environnement,
choisir le framework le plus adapté (React + Tailwind recommandé) et y implémenter
les designs.

Les prototypes utilisent un petit runtime maison (`support.js`, fichiers `.dc.html`).
**Ne pas porter ce runtime** : il ne sert qu'au rendu du prototype. Ne reprendre que
le markup, les styles inline, la copy et la logique décrite ci-dessous.

## Fidelity
**Haute fidélité (hifi).** Couleurs, typographie, espacements et interactions sont
finaux. Recréer l'UI au pixel près avec les composants du codebase cible.

---

## Design Tokens

### Couleurs
| Rôle | Hex | Usage |
|------|-----|-------|
| Olive (primaire) | `#4A4E3F` | Header, footer, fonds sombres, boutons secondaires |
| Terre cuite (accent) | `#9C533E` | CTA, liens, badges, détails |
| Terre douce | `#d59a86` | Accent sur fond sombre, soulignés, éléments décoratifs |
| Sable (fond) | `#ECE3D0` | Fond de page |
| Crème (surface) | `#F6EFE0` | Cartes, surfaces, texte sur fond sombre |
| Encre (texte) | `#2A2622` | Titres et texte principal |
| Taupe (secondaire) | `#6B665C` | Texte secondaire, légendes |
| Olive profond | `#3a3d31` | Dégradés, placeholders |
| Olive très profond | `#2e3128` | Dégradés bas de hero, fins de dégradé |

Dégradé hero de page (bandeaux secondaires) :
`linear-gradient(180deg,#43473a 0%,#4A4E3F 40%,#575a49 100%)`
Overlay photo du hero d'accueil :
`linear-gradient(180deg,rgba(38,40,30,.5) 0%,rgba(38,40,30,.12) 36%,rgba(38,40,30,.32) 60%,rgba(46,49,40,.86) 100%)`

### Typographie
- **Fraunces** (serif, Google Fonts) — titres/display. Poids 400 (regular) et 600 ;
  italique 400 utilisé pour les mots accentués. Optical size 9..144.
- **Poppins** (sans, Google Fonts) — logo / wordmark uniquement. Poids 700,
  letter-spacing `-0.02em`.
- **Hanken Grotesk** (sans, Google Fonts) — corps, interface, boutons.
  Poids 400/500/600/700.

Échelle titres : H1 hero `clamp(42px,6vw,74px)` / line-height 1 ; H2 sections
`clamp(28px,3.6vw,44px)` ; H3 cartes 19–24px. Corps 15–17px, line-height 1.5–1.65.

### Rayons & ombres
- Rayons : cartes/blocs `18px`, gros blocs/bandeaux `26px`, petits éléments `12–16px`,
  pilules/boutons ronds `999px`.
- Ombre carte flottante (barre de recherche) : `0 22px 50px -22px rgba(42,38,34,.5)`.
- Bordure fine standard : `1px solid rgba(74,78,63,.12)`.

### Espacements
Padding sections desktop : `70–84px` vertical, `40px` horizontal, `max-width:1240px`
centré. Grilles : gap `18–22px`.

---

## Screens / Views

### 1. Header (partagé — `CalmaHeader`)
- **Layout** : barre flex space-between, fond olive `#4A4E3F`, texte crème,
  padding `20px 40px`.
- **Gauche** : logo = monogramme « ct » (image masquée, voir Assets) 40×33px +
  wordmark « Calma Trip » en Poppins 700 20px.
- **Centre** : nav — Accueil, Services, Marketplace, Explorer, À propos.
  Lien actif : couleur crème pleine + `border-bottom:2px solid #d59a86` (padding-bottom 3px).
  Liens inactifs : `rgba(246,239,224,.82)`, bordure transparente.
- **Droite** : sur l'accueil, pilule bascule **FR / EN** (segment actif fond
  `#9C533E`, texte crème) + bouton **Contact** (fond `#9C533E`, pilule).
  Sur les pages secondaires, seulement le bouton Contact.
- Le header d'accueil est **superposé au hero** (position relative, z-index 20,
  fond transparent — l'olive vient du hero). Les pages secondaires ont un header
  olive plein.

### 2. Hero d'accueil (le point central de ce handoff)
Section pleine largeur, `min-height:640px; height:88vh; max-height:820px`,
`overflow:hidden`. Empilement (du fond vers l'avant) :

1. **Photo de fond** (`[data-bg]`) — image plein cadre `object-fit:cover`,
   remplie par l'utilisateur (placeholder « Déposez votre photo »). Dans le
   codebase : `<img>`/background responsive.
2. **Overlay** dégradé sombre (voir tokens) pour la lisibilité, `pointer-events:none`.
3. **Particules** (facultatif) : ~22 petits ronds crème/terre cuite (2–6px) en
   animation `dust` (montée + fondu, 7–14s, delays aléatoires). Purement décoratif ;
   respecter `prefers-reduced-motion`.
4. **Contenu centré** (z-index 10) : eyebrow en pilule translucide
   (« Expériences locales · Tunisie »), **H1** Fraunces 400 avec dernier mot en
   italique terre douce (FR « Une Tunisie qui se *vit* » / EN « A Tunisia you *live* »),
   **sous-titre** ~17px crème. `text-shadow` léger sur les deux pour la lisibilité.
5. **Rangée de catégories** (`[data-parallax]`) positionnée en absolu, `bottom:96px`,
   centrée. Défilement horizontal (`overflow-x:auto`, scrollbar masquée),
   **sans flèches**. 8 items, chacun largeur 118px, colonne centrée :
   - cercle 62px, `border:1px solid rgba(255,255,255,.32)`, icône SVG line 26px
     stroke crème `#F6EFE0` stroke-width 1.5 ;
   - label 14px 600 crème.
   - Hover : bordure `#d59a86`, fond `rgba(255,255,255,.14)`.
   - Catégories (FR / EN) : Culture, Médina/Medina, Plage/Beach, Désert/Desert,
     Food, Hammam, Voile/Sailing, Aventure/Adventure.
     Icônes = temple, arche, parasol, soleil+dune, bol, goutte, voilier, boussole
     (SVG line simples ; voir le HTML source pour les `path` exacts).

**Parallaxe (effet « 3D »)** : au mousemove sur le hero, on calcule
`cx = x/width - 0.5`, `cy = y/height - 0.5`, lissés (`c += (t-c)*0.06`) via
`requestAnimationFrame`. À chaque frame :
- photo : `transform: scale(1.08) translate(cx*-22px, cy*-15px)` ;
- rangée catégories : `transform: translate(cx*14px, cy*8px)`.
Au `mouseleave`, cibles → 0. Si `prefers-reduced-motion`, pas de boucle : juste
`scale(1.06)` sur la photo. Le `scale > 1` évite de révéler les bords pendant le pan.

### 3. Barre de recherche (chevauche le bas du hero)
Conteneur `max-width:920px`, `margin-top:-72px`, z-index 15. Carte crème,
rayon 16px, ombre flottante, flex-wrap, padding 12px :
- **Destination** (flex 2) : label 11px 700 taupe + input (icône `◉` terre cuite,
  placeholder FR « Commencez à taper ou choisissez… » / EN « Start typing or select below… »).
- séparateur vertical 1px.
- **Date** (flex 1) : label « Date » + input (icône `▦`, placeholder `JJ/MM/AAAA` /
  `MM/DD/YYYY`).
- **Bouton** « Parcourir les expériences » / « Browse experiences » : fond `#9C533E`,
  crème, 700, rayon 12px, padding `17px 30px`.

### 4. Sections de la home (sous la recherche)
- **Catégories par activité** : en-tête (kicker terre cuite + H2) + paragraphe ;
  4 cartes 230×300px qui se **chevauchent en escalier** (décalage vertical
  `[0,22,44,22]px`, `margin-left:-18px` à partir de la 2e, z-index décroissant),
  rayon 16px, image placeholder + dégradé sombre bas + badge count terre cuite +
  titre/desc crème.
- **Marketplace (à la une)** : en-tête + lien « Tout voir » ; grille 3 colonnes de
  cartes expérience (image 16:11 + badge note, lieu, titre Fraunces, prix
  Fraunces terre cuite, flèche).
- **Bandeau « Pourquoi »** : bloc olive rayon 26px, 2 colonnes (texte + grille 2×2
  de 4 arguments numérotés 01–04, séparateurs 1px translucides).
- **Témoignages** : 3 cartes crème (5 étoiles terre cuite, citation Fraunces
  italique, avatar initiale terre cuite + nom/rôle).
- **CTA final** : bloc rayon 26px, fond
  `radial-gradient(120% 140% at 85% 15%,#9C533E 0%,#3a3d31 45%,#2e3128 100%)`,
  trame diagonale subtile en overlay, centré : kicker, H2, sous-texte, 2 boutons
  (« Voir les services » plein crème + « Appeler » outline), ligne de confiance
  « Paiement sécurisé · Sans engagement · Support 24/7 ».

### 5. Footer (partagé — `CalmaFooter`)
Fond olive, wordmark + tagline, 2 colonnes de liens (Explorer / Société),
barre basse translucide « © 2026 Calma Trip · Tunisie » + « Paiement sécurisé · Support 24/7 ».

### 6. Pages secondaires (même système)
Chaque page = `CalmaHeader` (onglet actif) + `CalmaPageHero` (bandeau olive
dégradé avec soleil terre cuite pulsant, dunes et silhouette médina statiques,
kicker + H1 + sous-titre centrés) + contenu + `CalmaFooter`.
- **Services** : 6 cartes service (icône dans carré olive, titre Fraunces, desc) +
  bloc olive « Réservez en 4 étapes » + section sur-mesure (checklist + CTA + image).
- **Marketplace** : chips de filtre (actif olive plein) + tri + grille 3 col de 9
  expériences (badge catégorie + note) + bouton « Charger plus ».
- **Explorer** : grille 3 col de 6 régions (carte image 300px, dégradé, badge count,
  nom Fraunces + desc) + bloc olive « carte des régions ».
- **À propos** : histoire (2 col image+texte) + 4 stats + 3 valeurs + CTA contact.

---

## Interactions & Behavior
- **Bascule FR/EN** : tout le texte vient d'un dictionnaire `{fr, en}` ; l'état de
  langue rerend la page. Implémenter via i18n du codebase (ou contexte + dictionnaire).
- **Parallaxe hero** : voir formules ci-dessus (rAF, lissage 0.06). Désactiver sous
  `prefers-reduced-motion`.
- **Rangée catégories** : scroll horizontal tactile/trackpad, scrollbar masquée,
  pas de flèches. Chaque item mène (à terme) vers Marketplace filtré.
- **Nav / liens** : Accueil→home, Services, Marketplace, Explorer, À propos ;
  Contact → page contact (temporairement À propos dans le proto).
- **Hover** : cartes/liens réagissent (liens `a` passent de `#9C533E` à `#4A4E3F`) ;
  items catégorie changent bordure+fond.

## State Management
- `lang: 'fr' | 'en'` (global/contexte).
- État local hero : cibles de parallaxe (`tx,ty`) + valeurs lissées (`cx,cy`) en rAF.
- Champs de recherche (destination, date) — contrôlés, non câblés dans le proto.
- Prévoir plus tard : catégorie/filtre sélectionné pour Marketplace.

## Assets
- **Logo monogramme** : `assets/ct-mark.png` — PNG à canal alpha, appliqué en
  **CSS mask** sur un bloc coloré (`-webkit-mask/mask: url(...) center/contain`) pour
  le recolorer selon le fond (crème sur olive, olive sur clair). Fournir idéalement
  une version SVG en prod. Garder la contre-forme ouverte entre le C et le t.
- **Photos** : placeholders `<image-slot>` dans le proto — à remplacer par de vraies
  photos (hero paysage, cartes catégories/expériences/régions).
- **Icônes** : SVG line inline (stroke, width 1.5). Reprendre les `path` du HTML ou
  les remplacer par la librairie d'icônes du codebase (style outline fin).
- **Polices** : Google Fonts — Fraunces, Poppins, Hanken Grotesk.

## Files
- `Calma Trip 2b.dc.html` — **page d'accueil** (hero photo + parallaxe + toutes sections).
- `CalmaHeader.dc.html` — header partagé (prop `active`).
- `CalmaPageHero.dc.html` — bandeau hero des pages secondaires (props kicker/title/subtitle).
- `CalmaFooter.dc.html` — footer partagé.
- `Services.dc.html`, `Marketplace.dc.html`, `Explorer.dc.html`, `A-propos.dc.html`
  — pages secondaires.
- `Calma Trip Style.dc.html` — mini guide de style (couleurs, typo, logo).
- `assets/ct-mark.png` — logo monogramme.

> Note runtime : les `.dc.html` chargent `support.js` et utilisent des trous
> `{{ ... }}`, `<sc-for>`, `<dc-import>`. C'est l'échafaudage du prototype — **à ne
> pas reproduire**. Lire le markup et les styles inline comme spécification visuelle.
