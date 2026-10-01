"use client";
import React, { createContext, useContext, useMemo, useState } from "react";

export type CalmaLang = "fr" | "en" | "ar";

const RTL_LANGS: CalmaLang[] = ["ar"];

export interface CalmaCategory {
  title: string;
  desc: string;
  count: string;
  ph: string;
}

export interface CalmaExperience {
  place: string;
  title: string;
  price: number;
  rating: string;
  ph: string;
}

export interface CalmaWhy {
  n: string;
  title: string;
  desc: string;
}

export interface CalmaTestimonial {
  quote: string;
  name: string;
  role: string;
  init: string;
}

export interface CalmaWhyItem {
  title: string;
  desc: string;
}

export interface CalmaJourney {
  title: string;
  region: string;
  duration: string;
  desc: string;
  ph: string;
}

export interface CalmaOfferItem {
  num: string;
  title: string;
  desc: string;
}

export interface CalmaLangItem {
  code: string;
  lang: string;
}

export interface CalmaServicesDict {
  eyebrow: string;
  heroTitle: string;
  heroSub: string;
  statLabels: [string, string, string, string];
  offerKicker: string;
  offerTitle1: string;
  offerTitle2: string;
  searchPh: string;
  clearSearch: string;
  resultWord: string;
  resultsWord: string;
  forWord: string;
  noResultsFor: string;
  noResultsHint: string;
  emptySearch: string;
  emptyCategory: string;
  bookThis: string;
  bookShort: string;
  fromLabel: string;
  readMore: string;
  showLess: string;
  moreIncluded: string;
  viewDetails: string;
  detailFeaturesTitle: string;
  reviewsTitle: string;
  reviewWord: string;
  reviewsWord: string;
  trustSecure: string;
  trustConfirm: string;
  trustSupport: string;
  relatedTitle: string;
  notFoundTitle: string;
  notFoundHint: string;
  whyKicker: string;
  whyTitle: string;
  why: [CalmaWhyItem, CalmaWhyItem, CalmaWhyItem, CalmaWhyItem];
  contactKicker: string;
  contactTitle1: string;
  contactTitle2: string;
  contactFeatures: [string, string, string, string];
  contactCta: string;
  responseTime: string;
  emailLabel: string;
  phoneLabel: string;
  ctaKicker: string;
  ctaTitle: string;
  ctaSub: string;
  ctaBtn1: string;
  ctaBtn2: string;
  modalTitle: string;
  modalSub: string;
  modalLogin: string;
  modalClose: string;
}

export interface CalmaMarketDict {
  eyebrow: string;
  heroTitle: string;
  heroSub: string;
  loading: string;
  productWord: string;
  productsWord: string;
  sortNewest: string;
  sortPriceAsc: string;
  sortPriceDesc: string;
  sortNameAz: string;
  emptyTitle: string;
  emptySub: string;
  searchPh: string;
  clearSearch: string;
  allLabel: string;
  myOrders: string;
  wishlistLabel: string;
  cartLabel: string;
  outOfStock: string;
  lowStock: string; // "Plus que {n}" — {n} is replaced at render time
  addToWishlist: string;
  removeFromWishlist: string;
  addToCart: string;
}

export interface CalmaExploreDict {
  eyebrow: string;
  heroTitle: string;
  heroSub: string;
  searchPh: string;
  catAll: string;
  catFood: string;
  catSights: string;
  catActivities: string;
  catHidden: string;
  catEvents: string;
  catMuseums: string;
  catHotels: string;
  allCities: string;
  budgetLabel: string;
  useLocation: string;
  listLabel: string;
  mapLabel: string;
  filtersLabel: string;
  clearAll: string;
  sortLabel: string;
  sortPopularity: string;
  sortRating: string;
  sortReviews: string;
  emptyTitle: string;
  emptySub: string;
  resetFilters: string;
}

export interface CalmaAboutDict {
  eyebrow: string;
  heroTitle: string;
  heroSub: string;
  statLabels: [string, string, string, string];
  storyKicker: string;
  storyTitle: string;
  storyP1: string;
  storyP2: string;
  storyItems: [string, string, string];
  promiseKicker: string;
  promiseTitle1: string;
  promiseTitleEm: string;
  promiseP1: string;
  promiseP2: string;
  promiseQuote: string;
  offerKicker: string;
  offerTitle: string;
  offerings: [CalmaOfferItem, CalmaOfferItem, CalmaOfferItem, CalmaOfferItem];
  teamKicker: string;
  teamTitle: string;
  specialistsKicker: string;
  specialistsTitle: string;
  specialistsSub: string;
  spokenFluently: string;
  languages: [CalmaLangItem, CalmaLangItem, CalmaLangItem];
  specialistsBottom: string;
  ctaTitle1: string;
  ctaTitleEm: string;
  ctaSub: string;
  ctaBtn: string;
}

export interface CalmaContactDict {
  breadcrumbHome: string;
  eyebrow: string;
  heroTitle1: string;
  heroTitleEm: string;
  heroSub: string;
  infoPhoneTitle: string;
  infoPhoneDesc: string;
  infoEmailTitle: string;
  infoEmailDesc: string;
  infoAddressTitle: string;
  infoAddressDesc: string;
  infoHoursTitle: string;
  infoHoursDesc: string;
  infoHours1: string;
  infoHours2: string;
  formTitle: string;
  formSub: string;
  labelName: string;
  phName: string;
  labelEmail: string;
  phEmail: string;
  labelPhone: string;
  labelSubject: string;
  subjSelect: string;
  subjReservation: string;
  subjInfo: string;
  subjComplaint: string;
  subjQuote: string;
  subjOther: string;
  labelMessage: string;
  phMessage: string;
  sendBtn: string;
  sentTitle: string;
  sentSub: string;
  mapAddress: string;
  openInMaps: string;
  practicalTitle: string;
  practicalItems: [string, string, string, string, string, string];
  helpTitle: string;
  avgResponseLabel: string;
  avgResponseValue: string;
  satisfactionLabel: string;
  callBtn: string;
  whatsappBtn: string;
  followUs: string;
  faqKicker: string;
  faqTitle: string;
  faqSub: string;
  faqNoAnswer: string;
  faqContactSupport: string;
  ctaKicker: string;
  ctaTitle: string;
  ctaSub: string;
  ctaCallBtn: string;
  ctaWhatsappBtn: string;
}

export interface CalmaDashboardDict {
  // Sidebar
  navBookings: string;
  navNew: string;
  navPayments: string;
  navReviews: string;
  navProfile: string;
  backToSite: string;
  signOut: string;
  upcomingExpSingular: string;
  upcomingExpPlural: string;
  actionRequiredSingular: string;
  actionRequiredPlural: string;
  toReviewSingular: string;
  toReviewPlural: string;

  // Payments tab
  paymentsTitle: string;
  paymentsSub: string;
  paymentsEmpty: string;

  // Reviews tab
  reviewsTitle: string;
  reviewsSub: string;
  reviewsEmpty: string;
  reviewsToRateTitle: string;
  reviewsYoursTitle: string;
  reviewsPendingApproval: string;
  leaveReviewBtn: string;

  // Profile tab
  profileTitle: string;
  profileSub: string;
  profileNameLabel: string;
  profileEmailLabel: string;
  profilePhoneLabel: string;
  profilePhonePh: string;
  profileSaveBtn: string;
  profileSavedMsg: string;
  profileErrorMsg: string;

  // Header
  welcomeBack: string;
  nextTripSub: string;
  emptyHeaderSub: string;

  // Hero card
  yourNextExperience: string;
  reservationRef: string;
  travelersCount: string;
  viewTrip: string;

  // Payment status badge
  paymentPaid: string;
  paymentPending: string;
  paymentRefunded: string;

  // Booking status badge
  statusConfirmed: string;
  statusPending: string;
  statusCancelled: string;

  // Journey / progress steps
  journeyTitle: string;
  stepReceived: string;
  stepConfirmed: string;
  stepPrepare: string;
  stepEnjoy: string;
  stepShare: string;

  // "At a glance" grid
  glanceTitle: string;
  glanceDatesLabel: string;
  glanceDatesSub: string;
  glanceTravelersSub: string;
  glancePaymentSub: string;
  glancePaymentSubPaid: string;
  glanceDestinationLabel: string;

  // "Before your trip"
  beforeTitle: string;
  beforeSubSoon: string;
  beforeSubGeneral: string;
  packingTitle: string;
  packingDesc: string;
  helpCardTitle: string;
  helpCardDesc: string;
  fullDetailsTitle: string;
  fullDetailsDesc: string;

  // Recommendations
  alsoLikeTitle: string;
  alsoLikeSub: string;

  // Bookings list / empty states
  otherBookingsTitle: string;
  upcomingTitle: string;
  historyTitle: string;
  emptyTitle: string;
  emptySub: string;
  createBooking: string;
  newBookingTitle: string;
  newBookingSub: string;

  // Support strip
  needHelpTitle: string;
  needHelpSub: string;
  callBtn: string;
  whatsappBtn: string;
}

export interface CalmaPartnerOnboardingDict {
  pageTitle: string;
  pageSub: string;
  savedIndicator: string;
  savingIndicator: string;
  googleBtn: string;

  stepAccount: string;
  stepPartnerType: string;
  stepBusiness: string;
  stepInterests: string;
  stepPresence: string;
  stepReview: string;
  stepWord: string;
  ofWord: string;

  accountTitle: string;
  accountSub: string;
  accountNameLabel: string;
  accountEmailLabel: string;
  accountPhoneLabel: string;
  accountPasswordLabel: string;
  accountConfirmLabel: string;
  accountSubmitBtn: string;
  accountHaveAccount: string;
  accountLoginLink: string;

  typeTitle: string;
  typeSub: string;
  typeArtisanLabel: string;
  typeArtisanTagline: string;
  typeArtisanDesc: string;
  typeAgencyLabel: string;
  typeAgencyTagline: string;
  typeAgencyDesc: string;

  bizTitle: string;
  bizSub: string;
  bizOrgLabel: string;
  bizOrgPh: string;
  bizFirstNameLabel: string;
  bizLastNameLabel: string;
  bizPhoneLabel: string;
  bizCountryLabel: string;
  bizCountryPh: string;
  bizCityLabel: string;
  bizCityOtherLabel: string;
  bizCityOtherPh: string;
  bizCurrencyLabel: string;
  bizWebsiteLabel: string;
  bizWebsitePh: string;
  bizWebsiteOptional: string;

  interestsArtisanTitle: string;
  interestsAgencyTitle: string;
  interestsSub: string;
  interestsErrorRequired: string;

  presenceTitle: string;
  presenceSub: string;
  presenceUrlLabel: string;
  presenceNone: string;

  reviewTitle: string;
  reviewSub: string;
  reviewSectionAccount: string;
  reviewSectionPartner: string;
  reviewSectionBusiness: string;
  reviewSectionInterests: string;
  reviewSectionPresence: string;
  reviewEditBtn: string;
  reviewReadyTitle: string;
  reviewReadySub: string;
  reviewSubmitBtn: string;
  reviewSubmitting: string;

  successTitle: string;
  successSub: string;
  successBackBtn: string;

  lockedSubmittedTitle: string;
  lockedSubmittedSub: string;
  lockedUnderReviewTitle: string;
  lockedUnderReviewSub: string;
  lockedApprovedTitle: string;
  lockedApprovedSub: string;
  lockedRejectedTitle: string;
  lockedRejectedSub: string;
  lockedSuspendedTitle: string;
  lockedSuspendedSub: string;
  goToDashboardBtn: string;

  backBtn: string;
  continueBtn: string;
  requiredError: string;
  invalidUrlError: string;

  catTransport: string;
  catExcursion: string;
  catActivity: string;
  catFoodDrink: string;
  catSight: string;
  catHiddenGem: string;
  catHotel: string;

  platformWebsite: string;
  platformInstagram: string;
  platformFacebook: string;
  platformTiktok: string;
  platformYoutube: string;
  platformLinkedin: string;
  platformOther: string;
}

export interface CalmaCommunityDict {
  eyebrow: string;
  heroTitle: string;
  heroSub: string;
  fbTitle: string;
  fbDesc: string;
  fbJoin: string;
  loginPrompt: string;
  loginCta: string;
  placeholder: string;
  charCount: string; // "{n} / 2000 caractères" — {n} is replaced at render time
  photoLabel: string;
  errorMin: string;
  successMsg: string;
  shareCta: string;
  sharing: string;
  emptyTitle: string;
  deleteLabel: string;
  deleteConfirm: string;
  today: string;
  yesterday: string;
  daysAgo: string; // "Il y a {n} jours" — {n} is replaced at render time
}

export interface CalmaPartnerLandingDict {
  eyebrow: string;
  heroTitle: string;
  heroSub: string;
  artisanLabel: string;
  artisanDesc: string;
  artisanPoints: [string, string, string];
  agencyLabel: string;
  agencyDesc: string;
  agencyPoints: [string, string, string];
  learnMore: string;
}

// Homepage (src/views/Home.tsx + src/components/home/*).
export interface CalmaHomeDict {
  heroTitle: string;
  heroSub: string;
  heroCaption: string;
  searchLabel: string;
  searchPlaceholder: string;
  searchBtn: string;
  chipsLabel: string;
  chips: {
    tours: string;
    sights: string;
    activities: string;
    food: string;
    hiddenGems: string;
    museums: string;
    events: string;
  };
  trust: { title: string; desc: string }[];
  toursHeading: string;
  localHeading: string;
  destinationsHeading: string;
  destinations: [string, string, string, string, string, string];
  shopHeading: string;
  reviewsHeading: string;
  reviewsCount: string; // "{n} avis" — {n} is replaced at render time
  seeAll: string;
  prev: string;
  next: string;
  from: string;
  priceOnRequest: string;
  plannerHeading: string;
  plannerSub: string;
  plannerContact: string;
  howHeading: string;
  howSteps: { title: string; desc: string }[];
  guidesHeading: string;
  faqHeading: string;
  faqSub: string;
  faqMore: string;
  partnerHeading: string;
  partnerSub: string;
  partnerCta: string;
}

// Shared header/footer chrome (CalmaHeader, CalmaFooter).
export interface CalmaLayoutDict {
  login: string;
  register: string;
  logout: string;
  account: string;
  language: string;
  openMenu: string;
  closeMenu: string;
  menu: string;
  mySpace: string;
  adminSpace: string;
  partnerSpace: string;
  footContact: string;
  footNewsletter: string;
  privacy: string;
  terms: string;
  legalNotice: string;
  footBottomNote: string;
}

// Search bar (SearchBar, DatePanel, ParticipantsPanel) + /search results page.
export interface CalmaSearchDict {
  destinationLabel: string;
  serviceLabel: string;
  allServices: string;
  dateLabel: string;
  dateFlexible: string;
  clearDate: string;
  participantsLabel: string;
  participantOne: string;
  participantMany: string; // "{n}"
  adults: string;
  adultsHint: string;
  children: string;
  childrenHint: string;
  fewer: string; // "{who}"
  more: string; // "{who}"
  today: string;
  tomorrow: string;
  nextWeekend: string;
  prevMonth: string;
  nextMonth: string;
  groupHint: string; // "{n}" — shown under the counter at the max
  groupHintLink: string;
  resultsIn: string; // "{d}"
  resultsTitle: string; // "{q}"
  resultsCount: string; // "{n}"
  noResultsTitle: string;
  noResultsSub: string;
  emptyTitle: string;
  emptySub: string;
}

export interface CalmaDict {
  navHome: string;
  navServices: string;
  navServicesViewAll: string;
  navMarket: string;
  navExplore: string;
  navBlog: string;
  navCommunity: string;
  navAbout: string;
  navContact: string;
  navBecomePartner: string;

  heroEyebrow: string;
  heroTitle: string;
  heroTitleEm: string;
  heroSub: string;
  heroCta1: string;
  heroCta2: string;

  searchDestL: string;
  searchDest: string;
  searchDateL: string;
  searchDatePh: string;
  searchCatL: string;
  searchCat: string;
  browse: string;

  icCulture: string;
  icMedina: string;
  icBeach: string;
  icDesert: string;
  icFood: string;
  icHammam: string;
  icSail: string;
  icAdv: string;

  catsKicker: string;
  catsHeading: string;
  catsSub: string;
  catsViewAll: string;

  expKicker: string;
  expHeading: string;
  expViewAll: string;
  expFrom: string;
  expPer: string;

  journeysKicker: string;
  journeysHeading: string;
  journeysSub: string;

  storyKicker: string;
  storyHeading: string;
  storyText: string;

  shopKicker: string;
  shopHeading: string;
  shopViewAll: string;

  guidesEyebrow: string;
  guidesHeroTitle: string;
  guidesHeroSub: string;
  guidesEmpty: string;
  guidesBack: string;
  guidesRead: string;
  servicesBack: string;

  whyKicker: string;
  whyHeading: string;
  whySub: string;
  whyBtn: string;

  customKicker: string;
  customHeading: string;
  customSub: string;

  testiHeading: string;

  reviewKicker: string;
  reviewHeading: string;
  reviewSub: string;

  newsKicker: string;
  newsTitle: string;
  newsSub: string;
  newsBtn1: string;
  newsBtn2: string;
  newsTrust: string;

  footTag: string;
  footExplore: string;
  footCompany: string;

  newsletterTitle: string;
  newsletterSub: string;
  newsletterPlaceholder: string;
  newsletterCta: string;
  newsletterSuccess: string;

  cats: CalmaCategory[];
  exps: CalmaExperience[];
  whys: CalmaWhy[];
  testis: CalmaTestimonial[];
  journeys: CalmaJourney[];

  svc: CalmaServicesDict;
  mkt: CalmaMarketDict;
  exp: CalmaExploreDict;
  abt: CalmaAboutDict;
  cnt: CalmaContactDict;
  dash: CalmaDashboardDict;
  pnr: CalmaPartnerOnboardingDict;
  community: CalmaCommunityDict;
  pln: CalmaPartnerLandingDict;
  home: CalmaHomeDict;
  layout: CalmaLayoutDict;
  search: CalmaSearchDict;
  tickerMessages: string[];
}

export const CALMA_DICT: Record<CalmaLang, CalmaDict> = {
  fr: {
    navHome: "Accueil",
    navServices: "Services",
    navServicesViewAll: "Voir tous les services",
    navMarket: "Marketplace",
    navExplore: "Explorer",
    navBlog: "Blog",
    navCommunity: "Communauté",
    navAbout: "À propos",
    navContact: "Contact",
    navBecomePartner: "Devenir partenaire",

    heroEyebrow: "Expériences locales · Tunisie",
    heroTitle: "Une Tunisie qui se",
    heroTitleEm: "vit",
    heroSub:
      "Pas qui se visite. Des activités menées par des locaux — de la médina de Tunis aux dunes de Tozeur, réservées en direct.",
    heroCta1: "Planifier mon échappée",
    heroCta2: "Voir les expériences",

    searchDestL: "Destination",
    searchDest: "Commencez à taper ou choisissez…",
    searchDateL: "Date",
    searchDatePh: "JJ/MM/AAAA",
    searchCatL: "Activité",
    searchCat: "Toutes",
    browse: "Parcourir les expériences",

    icCulture: "Culture",
    icMedina: "Médina",
    icBeach: "Plage",
    icDesert: "Désert",
    icFood: "Food",
    icHammam: "Hammam",
    icSail: "Voile",
    icAdv: "Aventure",

    catsKicker: "Par type d’activité",
    catsHeading: "Choisissez votre Tunisie",
    catsSub: "De la médina au désert, de la mer à la table.",
    catsViewAll: "Toutes les destinations",

    expKicker: "Explorer",
    expHeading: "Expériences à la une",
    expViewAll: "Tout voir",
    expFrom: "dès",
    expPer: "/pers.",

    journeysKicker: "Voyages suggérés",
    journeysHeading: "Des itinéraires pensés pour vous inspirer",
    journeysSub: "Trois façons de vivre la Tunisie, du sud saharien à la côte méditerranéenne.",

    storyKicker: "L’âme du pays",
    storyHeading: "Un pays de contrastes.",
    storyText:
      "La mer et le désert. Les médinas anciennes et la vie moderne. La tradition et la découverte. La Tunisie ne se résume pas — elle se ressent, une ruelle et une dune à la fois.",

    shopKicker: "Marketplace",
    shopHeading: "L’artisanat tunisien, livré chez vous",
    shopViewAll: "Voir la boutique",

    guidesEyebrow: "Guides pratiques · Tunisie",
    guidesHeroTitle: "Voyagez informé",
    guidesHeroSub:
      "Visa, transport, monnaie, coutumes locales — tout ce qu'il faut savoir avant de partir.",
    guidesEmpty: "Aucun guide disponible pour le moment.",
    guidesBack: "Tous les guides",
    guidesRead: "Lire",
    servicesBack: "Tous les services",

    whyKicker: "Pourquoi calma·trip",
    whyHeading: "Le voyage juste, pensé avec les Tunisiens",
    whySub:
      "Nous travaillons directement avec des guides et artisans locaux. Vous payez le juste prix, ils sont payés équitablement.",
    whyBtn: "Notre démarche",

    customKicker: "Sur mesure",
    customHeading: "Un voyage sur mesure, rien que pour vous.",
    customSub:
      "Nos spécialistes locaux dessinent chaque étape de votre séjour. De la médina aux dunes, nous créons des souvenirs qui durent.",

    testiHeading: "Ce que disent nos voyageurs",

    reviewKicker: "Votre avis",
    reviewHeading: "Partagez votre expérience",
    reviewSub: "Votre avis compte pour nous et pour les autres voyageurs.",

    newsKicker: "Commencez l’aventure",
    newsTitle: "Prêt à explorer la Tunisie ?",
    newsSub:
      "Réservez maintenant et profitez de services de transport et de voyage premium partout en Tunisie. Réponse garantie sous 30 minutes.",
    newsBtn1: "Voir les services",
    newsBtn2: "Appeler",
    newsTrust: "Paiement sécurisé · Sans engagement · Support 24/7",

    footTag:
      "La marketplace des expériences authentiques en Tunisie, réservées directement auprès des locaux.",
    footExplore: "Explorer",
    footCompany: "Société",

    newsletterTitle: "Newsletter",
    newsletterSub: "Recevez nos meilleures expériences et bons plans, une fois par mois.",
    newsletterPlaceholder: "Votre email",
    newsletterCta: "S'inscrire",
    newsletterSuccess: "Merci ! Vous êtes inscrit.",

    cats: [
      {
        title: "Culture & Médina",
        desc: "Ateliers, patrimoine, artisans",
        count: "48 exp.",
        ph: "PHOTO — MÉDINA",
      },
      {
        title: "Plage & Méditerranée",
        desc: "Djerba, Hammamet, Kélibia",
        count: "32 exp.",
        ph: "PHOTO — MER",
      },
      {
        title: "Désert & Sahara",
        desc: "Tozeur, Douz, Matmata",
        count: "27 exp.",
        ph: "PHOTO — DÉSERT",
      },
      {
        title: "Food & Marché",
        desc: "Épices, huile d’olive, street food",
        count: "21 exp.",
        ph: "PHOTO — MARCHÉ",
      },
    ],
    exps: [
      {
        place: "Nabeul",
        title: "Atelier poterie avec un maître céramiste",
        price: 45,
        rating: "4.9",
        ph: "PHOTO — ATELIER",
      },
      {
        place: "Tozeur",
        title: "Coucher de soleil en 4×4 dans le Chott el-Jérid",
        price: 60,
        rating: "4.8",
        ph: "PHOTO — 4×4",
      },
      {
        place: "Tunis",
        title: "Médina secrète : ruelles, souks et toits",
        price: 25,
        rating: "5.0",
        ph: "PHOTO — SOUK",
      },
    ],
    whys: [
      { n: "01", title: "Guides locaux", desc: "Des habitants qui connaissent chaque ruelle." },
      { n: "02", title: "Sans intermédiaire", desc: "Vous réservez en direct, au juste prix." },
      { n: "03", title: "Petits groupes", desc: "Des expériences intimes, jamais en masse." },
      { n: "04", title: "Annulation souple", desc: "Remboursé jusqu’à 24 h avant." },
    ],
    journeys: [
      {
        title: "Dunes et oasis du Sud",
        region: "Sud tunisien",
        duration: "3 jours",
        desc: "Des dunes dorées de Douz aux palmeraies secrètes de Chebika, en petit groupe.",
        ph: "PHOTO — SAHARA",
      },
      {
        title: "La côte, autrement",
        region: "Sidi Bou Saïd · Carthage",
        duration: "2 jours",
        desc: "Ruelles bleu et blanc, ports antiques et couchers de soleil sur la Méditerranée.",
        ph: "PHOTO — CÔTE",
      },
      {
        title: "Sur les traces de l’Histoire",
        region: "Kairouan · El Jem",
        duration: "1 jour",
        desc: "Médinas millénaires, mosquées sacrées et l’amphithéâtre romain le mieux conservé d’Afrique.",
        ph: "PHOTO — PATRIMOINE",
      },
    ],
    testis: [
      {
        quote:
          "On a pétri l’argile avec un artisan de Nabeul — un moment qu’aucune agence ne nous aurait offert.",
        name: "Camille Reyer",
        role: "Lyon, France",
        init: "C",
      },
      {
        quote:
          "Le désert au coucher du soleil, sans la foule. Notre guide connaissait chaque piste.",
        name: "Marco Bianchi",
        role: "Milan, Italie",
        init: "M",
      },
      {
        quote: "Réservation limpide, prix honnête, et un guide passionné dans la médina de Tunis.",
        name: "Sophie Laurent",
        role: "Bruxelles, Belgique",
        init: "S",
      },
    ],

    svc: {
      eyebrow: "Nos services · Tunisie",
      heroTitle: "Voyagez l’esprit tranquille",
      heroSub:
        "Transport premium, guides locaux et logistique sur mesure — nous orchestrons chaque détail de votre séjour en Tunisie. Réponse garantie sous 30 minutes.",
      statLabels: ["Clients heureux", "Destinations", "Taux de satisfaction", "Support"],
      offerKicker: "Ce que nous proposons",
      offerTitle1: "Des services pensés",
      offerTitle2: "pour chaque voyageur",
      searchPh: "Rechercher un service (transfert, excursion, activité…)",
      clearSearch: "Effacer la recherche",
      resultWord: "résultat",
      resultsWord: "résultats",
      forWord: "pour",
      noResultsFor: "Aucun résultat pour",
      noResultsHint: "— essayez un autre mot ou parcourez tout ci-dessous.",
      emptySearch: "Rien ne correspond à votre recherche pour le moment.",
      emptyCategory: "Aucun service dans cette catégorie pour le moment.",
      bookThis: "Réserver cette expérience",
      bookShort: "Réserver",
      fromLabel: "Dès",
      readMore: "Lire plus ↓",
      showLess: "Réduire ↑",
      moreIncluded: "inclus en plus",
      viewDetails: "Voir les détails",
      detailFeaturesTitle: "Ce qui est inclus",
      reviewsTitle: "Avis clients",
      reviewWord: "avis",
      reviewsWord: "avis",
      trustSecure: "Paiement à la livraison",
      trustConfirm: "Confirmation sous 30 min",
      trustSupport: "Support 24/7",
      relatedTitle: "Autres services qui pourraient vous plaire",
      notFoundTitle: "Service introuvable",
      notFoundHint: "Ce service n'est plus disponible.",
      whyKicker: "Pourquoi Calma Trip",
      whyTitle: "Conçu pour votre tranquillité d’esprit",
      why: [
        {
          title: "Sécurité garantie",
          desc: "Véhicules entretenus, assurance complète, chauffeurs certifiés.",
        },
        {
          title: "Toujours à l’heure",
          desc: "Suivi GPS en temps réel. Votre horaire est le nôtre.",
        },
        {
          title: "Qualité premium",
          desc: "Partenaires triés sur le volet, standards constants, aucune surprise.",
        },
        { title: "Support humain 24/7", desc: "Spécialistes parlant anglais, français et arabe." },
      ],
      contactKicker: "Nous contacter",
      contactTitle1: "Pas sûr de ce dont vous avez besoin ?",
      contactTitle2: "On trouve la solution ensemble.",
      contactFeatures: [
        "Chauffeurs professionnels certifiés",
        "Flotte moderne et climatisée",
        "Confirmation de réservation instantanée",
        "Support multilingue 24/7",
      ],
      contactCta: "Demander un devis",
      responseTime: "Délai de réponse",
      emailLabel: "Email",
      phoneLabel: "Téléphone",
      ctaKicker: "Prêt quand vous l’êtes",
      ctaTitle: "Votre prochain voyage commence ici.",
      ctaSub: "Rejoignez des centaines de voyageurs qui explorent la Tunisie en toute sérénité.",
      ctaBtn1: "Nous contacter",
      ctaBtn2: "Réserver",
      modalTitle: "Presque terminé !",
      modalSub: "Connectez-vous à votre compte pour confirmer votre réservation.",
      modalLogin: "Se connecter & réserver",
      modalClose: "Fermer",
    },

    mkt: {
      eyebrow: "Marketplace · Tunisie",
      heroTitle: "L’artisanat tunisien, livré chez vous",
      heroSub:
        "Souvenirs et essentiels de voyage sélectionnés avec soin — vêtements, accessoires et pièces d’artisanat inspirés de la Tunisie.",
      loading: "Chargement...",
      productWord: "produit",
      productsWord: "produits",
      sortNewest: "Plus récents",
      sortPriceAsc: "Prix croissant",
      sortPriceDesc: "Prix décroissant",
      sortNameAz: "Nom A-Z",
      emptyTitle: "Aucun produit trouvé",
      emptySub: "Essayez une autre recherche ou catégorie",
      searchPh: "Rechercher un produit...",
      clearSearch: "Effacer la recherche",
      allLabel: "Tout",
      myOrders: "Mes commandes",
      wishlistLabel: "Favoris",
      cartLabel: "Panier",
      outOfStock: "Rupture de stock",
      lowStock: "Plus que {n}",
      addToWishlist: "Ajouter aux favoris",
      removeFromWishlist: "Retirer des favoris",
      addToCart: "Ajouter au panier",
    },

    exp: {
      eyebrow: "Explorer · Tunisie",
      heroTitle: "Du nord bleu au Sahara doré",
      heroSub:
        "Six régions, mille visages. Choisissez une destination et découvrez les lieux qui l’incarnent — bientôt complétés par les circuits de nos agences et guides partenaires.",
      searchPh: "Où voulez-vous aller ?",
      catAll: "Tout",
      catFood: "Restauration",
      catSights: "Sites",
      catActivities: "Activités",
      catHidden: "Trésors cachés",
      catEvents: "Événements",
      catMuseums: "Musées",
      catHotels: "Hébergements",
      allCities: "Toutes les villes",
      budgetLabel: "Budget",
      useLocation: "Utiliser ma position",
      listLabel: "Liste",
      mapLabel: "Carte",
      filtersLabel: "Filtres",
      clearAll: "Tout effacer",
      sortLabel: "Trier",
      sortPopularity: "Popularité",
      sortRating: "Note",
      sortReviews: "Avis",
      emptyTitle: "Aucun trésor trouvé...",
      emptySub:
        "Nous n’avons rien trouvé correspondant à vos critères exacts. Essayez d’élargir votre recherche ou d’explorer une autre catégorie.",
      resetFilters: "Réinitialiser les filtres",
    },

    abt: {
      eyebrow: "À propos · Calma Trip",
      heroTitle: "Le voyage, pensé avec les Tunisiens",
      heroSub:
        "Nous connectons les voyageurs aux guides, artisans et hôtes locaux — pour un tourisme plus juste, plus vrai, plus calme.",
      statLabels: [
        "Fondée à Hammamet",
        "Clients satisfaits",
        "Partenaires locaux",
        "Satisfaction client",
      ],
      storyKicker: "Notre histoire",
      storyTitle: "Née à Hammamet",
      storyP1:
        "Fondée à Hammamet, en Tunisie, en 2026, Calma Trip est née d’une conviction simple : voyager devrait être synonyme de sérénité. Notre nom reflète cette vision — vous permettre de découvrir le cœur de votre destination avant même d’y poser le pied.",
      storyP2:
        "Nous sommes bien plus qu’une plateforme de tourisme et une marketplace. Nous vous connectons à des services de voyage premium via nos partenaires locaux de confiance, tandis que notre équipe assure un suivi constant et proactif pour que chaque détail se déroule exactement comme prévu.",
      storyItems: [
        "Services premium via des partenaires locaux de confiance",
        "Suivi proactif sur chaque réservation",
        "Votre satisfaction est notre priorité",
      ],
      promiseKicker: "Notre engagement",
      promiseTitle1: "La promesse",
      promiseTitleEm: "Calma",
      promiseP1:
        "Avec Calma Trip, voyagez enfin l’esprit léger. Oubliez les négociations sans fin et les réservations multiples — nous sommes votre hub unique et fiable pour sécuriser tous vos services instantanément.",
      promiseP2:
        "Votre satisfaction est notre priorité. Nous recueillons activement vos retours et offrons une prise en charge immédiate pour garantir une expérience fluide et sans souci du début à la fin.",
      promiseQuote: "Un seul hub. Tous vos services. Zéro stress.",
      offerKicker: "Ce que nous offrons",
      offerTitle: "Tout ce dont vous avez besoin, pris en charge",
      offerings: [
        {
          num: "01",
          title: "Planification sans stress",
          desc: "Nous prenons en charge tous les détails logistiques de votre voyage, pour que vous puissiez profiter pleinement de votre séjour plutôt que de le gérer.",
        },
        {
          num: "02",
          title: "Accompagnement de bout en bout",
          desc: "Du début de votre réservation jusqu’à votre retour, notre équipe assure un suivi complet et une assistance fiable à chaque étape de votre voyage.",
        },
        {
          num: "03",
          title: "Prix locaux",
          desc: "Vivez la véritable expérience tunisienne, sans les tarifs touristiques gonflés. Une valeur authentique, à chaque fois.",
        },
        {
          num: "04",
          title: "Prise en charge immédiate",
          desc: "Nous privilégions votre confort et votre tranquillité d’esprit avec un service rapide et réactif, avant et pendant votre voyage.",
        },
      ],
      teamKicker: "L’équipe",
      teamTitle: "Les visages derrière Calma Trip",
      specialistsKicker: "Notre équipe",
      specialistsTitle: "Spécialistes de destination",
      specialistsSub:
        "Nos spécialistes dédiés sont toujours disponibles pour vous guider personnellement — que ce soit pour une question sur votre excursion ou une simple curiosité sur la vie en Tunisie.",
      spokenFluently: "Parlé couramment",
      languages: [
        { code: "EN", lang: "Anglais" },
        { code: "FR", lang: "Français" },
        { code: "AR", lang: "Arabe" },
      ],
      specialistsBottom:
        "Au-delà des simples réservations, nos spécialistes de destination vous aident à tirer le meilleur parti de la Tunisie — pépites cachées, adresses locales, conseils culturels et logistique de voyage. Voyez-nous comme votre lien personnel avec la vraie Tunisie.",
      ctaTitle1: "Prêt à voyager en toute",
      ctaTitleEm: "sérénité",
      ctaSub:
        "Rejoignez des centaines de voyageurs satisfaits et découvrez la Tunisie — sans stress, pleinement accompagnés, à prix locaux.",
      ctaBtn: "Découvrir nos services",
    },

    cnt: {
      breadcrumbHome: "Accueil",
      eyebrow: "Contactez-nous",
      heroTitle1: "Parlez à un",
      heroTitleEm: "humain",
      heroSub:
        "Notre équipe répond à toutes vos questions et vous accompagne dans vos projets de voyage — en français, anglais et arabe.",
      infoPhoneTitle: "Téléphone",
      infoPhoneDesc: "Disponible 24/7",
      infoEmailTitle: "Email",
      infoEmailDesc: "Réponse sous 24h",
      infoAddressTitle: "Adresse",
      infoAddressDesc: "Visitez notre bureau",
      infoHoursTitle: "Horaires",
      infoHoursDesc: "Service client",
      infoHours1: "Lun-Ven : 8h00 - 20h00",
      infoHours2: "Sam-Dim : 9h00 - 18h00",
      formTitle: "Envoyez-nous un message",
      formSub: "Remplissez le formulaire ci-dessous, notre équipe vous répond sous 24h.",
      labelName: "Nom complet",
      phName: "Votre nom",
      labelEmail: "Email",
      phEmail: "votre@email.com",
      labelPhone: "Téléphone",
      labelSubject: "Sujet",
      subjSelect: "Sélectionner un sujet",
      subjReservation: "Réservation",
      subjInfo: "Demande d’information",
      subjComplaint: "Réclamation",
      subjQuote: "Demande de devis",
      subjOther: "Autre",
      labelMessage: "Message",
      phMessage: "Votre message...",
      sendBtn: "Envoyer le message",
      sentTitle: "Message envoyé !",
      sentSub: "Merci de nous avoir contactés. Notre équipe vous répondra très prochainement.",
      mapAddress: "Avenue Habib Bourguiba, Hammamet",
      openInMaps: "Ouvrir dans Google Maps",
      practicalTitle: "Informations pratiques",
      practicalItems: [
        "Parking gratuit disponible pour les visiteurs",
        "Bureau accessible aux personnes à mobilité réduite",
        "Service client disponible en français, arabe et anglais",
        "Paiements en espèces et par carte acceptés",
        "Réservation en ligne sécurisée 24/7",
        "Support téléphonique disponible 24h/24, 7j/7",
      ],
      helpTitle: "Assistance immédiate",
      avgResponseLabel: "Délai de réponse moyen",
      avgResponseValue: "Moins de 30 minutes",
      satisfactionLabel: "Satisfaction",
      callBtn: "Appeler",
      whatsappBtn: "WhatsApp",
      followUs: "Suivez-nous",
      faqKicker: "FAQ",
      faqTitle: "Questions fréquentes",
      faqSub: "Tout ce qu’il faut savoir avant de réserver votre prochaine expérience.",
      faqNoAnswer: "Vous n’avez pas trouvé de réponse ?",
      faqContactSupport: "Contactez notre support",
      ctaKicker: "Toujours disponibles",
      ctaTitle: "Besoin d’une assistance immédiate ?",
      ctaSub:
        "Notre équipe est disponible 24/7 pour répondre à vos questions et organiser votre prochaine aventure tunisienne.",
      ctaCallBtn: "Appeler maintenant",
      ctaWhatsappBtn: "WhatsApp",
    },

    dash: {
      navBookings: "Mes réservations",
      navNew: "Nouvelle réservation",
      navPayments: "Paiements",
      navReviews: "Avis",
      navProfile: "Profil",
      backToSite: "Retour au site",
      signOut: "Déconnexion",
      upcomingExpSingular: "expérience à venir",
      upcomingExpPlural: "expériences à venir",
      actionRequiredSingular: "action requise",
      actionRequiredPlural: "actions requises",
      toReviewSingular: "à évaluer",
      toReviewPlural: "à évaluer",

      paymentsTitle: "Paiements",
      paymentsSub:
        "Le suivi des paiements de toutes vos réservations, mis à jour par notre équipe.",
      paymentsEmpty: "Aucun paiement à afficher pour le moment.",

      reviewsTitle: "Vos avis",
      reviewsSub:
        "Seuls les clients ayant réellement réservé un service peuvent laisser un avis — c'est ce qui garantit leur authenticité.",
      reviewsEmpty: "Vous n'avez pas encore d'expérience à évaluer.",
      reviewsToRateTitle: "À évaluer",
      reviewsYoursTitle: "Vos avis envoyés",
      reviewsPendingApproval: "en cours de validation",
      leaveReviewBtn: "Laisser un avis",

      profileTitle: "Profil",
      profileSub: "Vos informations personnelles.",
      profileNameLabel: "Nom complet",
      profileEmailLabel: "Adresse email",
      profilePhoneLabel: "Téléphone",
      profilePhonePh: "+216 00 000 000",
      profileSaveBtn: "Enregistrer",
      profileSavedMsg: "Profil mis à jour.",
      profileErrorMsg: "Échec de la mise à jour. Réessayez.",

      welcomeBack: "Bon retour",
      nextTripSub: "vous attend.",
      emptyHeaderSub: "Votre prochaine aventure commence ici.",

      yourNextExperience: "Votre prochaine expérience",
      reservationRef: "Réservation",
      travelersCount: "voyageurs",
      viewTrip: "Voir votre séjour",

      paymentPaid: "Payé",
      paymentPending: "Paiement en attente",
      paymentRefunded: "Remboursé",

      statusConfirmed: "Confirmée",
      statusPending: "En attente",
      statusCancelled: "Annulée",

      journeyTitle: "Votre parcours",
      stepReceived: "Réservation reçue",
      stepConfirmed: "Confirmée",
      stepPrepare: "Préparez votre séjour",
      stepEnjoy: "Profitez de votre expérience",
      stepShare: "Partagez votre expérience",

      glanceTitle: "Votre séjour en un coup d'œil",
      glanceDatesLabel: "Date",
      glanceDatesSub: "Les dates de votre expérience",
      glanceTravelersSub: "Inclus dans votre réservation",
      glancePaymentSub: "Finalisez votre paiement avant le départ",
      glancePaymentSubPaid: "Merci, tout est réglé",
      glanceDestinationLabel: "Destination",

      beforeTitle: "Avant votre départ",
      beforeSubSoon: "Votre aventure arrive bientôt.",
      beforeSubGeneral: "Tout ce qu'il faut savoir avant le grand jour.",
      packingTitle: "Que faut-il emporter",
      packingDesc: "Découvrez nos conseils pratiques pour bien préparer votre expérience.",
      helpCardTitle: "Besoin d'aide ?",
      helpCardDesc: "Contactez notre équipe au sujet de votre réservation.",
      fullDetailsTitle: "Voir les détails de la réservation",
      fullDetailsDesc: "Consultez toutes les informations de votre expérience.",

      alsoLikeTitle: "Vous aimerez aussi",
      alsoLikeSub: "Complétez votre expérience avec d'autres services Calma Trip",

      otherBookingsTitle: "Vos autres réservations",
      upcomingTitle: "À venir",
      historyTitle: "Historique",
      emptyTitle: "Votre prochaine aventure commence ici",
      emptySub: "Aucune réservation pour le moment — créez-en une pour la voir apparaître ici.",
      createBooking: "Créer une réservation",
      newBookingTitle: "Nouvelle réservation",
      newBookingSub: "Remplissez le formulaire pour réserver votre prochain trajet",

      needHelpTitle: "Besoin d'aide ?",
      needHelpSub: "Notre équipe est disponible 24/7",
      callBtn: "Appeler",
      whatsappBtn: "WhatsApp",
    },
    pnr: {
      pageTitle: "Devenir partenaire CalmaTrip",
      pageSub: "Quelques étapes pour rejoindre notre réseau de partenaires.",
      savedIndicator: "Enregistré",
      savingIndicator: "Enregistrement…",
      googleBtn: "Continuer avec Google",

      stepAccount: "Compte",
      stepPartnerType: "Type de partenaire",
      stepBusiness: "Entreprise",
      stepInterests: "Centres d'intérêt",
      stepPresence: "Présence en ligne",
      stepReview: "Vérification",
      stepWord: "Étape",
      ofWord: "sur",

      accountTitle: "Créez votre compte",
      accountSub: "Commencez par créer votre compte CalmaTrip Partenaires.",
      accountNameLabel: "Nom complet",
      accountEmailLabel: "Adresse email",
      accountPhoneLabel: "Téléphone",
      accountPasswordLabel: "Mot de passe",
      accountConfirmLabel: "Confirmer le mot de passe",
      accountSubmitBtn: "Créer mon compte",
      accountHaveAccount: "Vous avez déjà un compte ?",
      accountLoginLink: "Se connecter",

      typeTitle: "Quel type de partenaire êtes-vous ?",
      typeSub: "Ce choix détermine les étapes suivantes de votre inscription.",
      typeArtisanLabel: "Artisan",
      typeArtisanTagline: "Professionnel local",
      typeArtisanDesc: "Proposez vos services et votre savoir-faire aux voyageurs CalmaTrip.",
      typeAgencyLabel: "Agence",
      typeAgencyTagline: "Professionnel du voyage",
      typeAgencyDesc:
        "Construisez des expériences et des offres de voyage pour vos clients avec CalmaTrip.",

      bizTitle: "Informations sur votre entreprise",
      bizSub: "Ces informations nous permettent de vérifier et présenter votre activité.",
      bizOrgLabel: "Nom de l'entreprise / organisation",
      bizOrgPh: "ex. Sahara Excursions",
      bizFirstNameLabel: "Prénom du contact",
      bizLastNameLabel: "Nom du contact",
      bizPhoneLabel: "Téléphone",
      bizCountryLabel: "Pays",
      bizCountryPh: "Rechercher un pays…",
      bizCityLabel: "Ville",
      bizCityOtherLabel: "Autre ville",
      bizCityOtherPh: "Précisez votre ville",
      bizCurrencyLabel: "Devise",
      bizWebsiteLabel: "Site web",
      bizWebsitePh: "https://exemple.com",
      bizWebsiteOptional: "Optionnel",

      interestsArtisanTitle: "Avec quels services souhaitez-vous travailler ?",
      interestsAgencyTitle: "Que souhaitez-vous proposer ou promouvoir avec CalmaTrip ?",
      interestsSub: "Sélectionnez toutes les catégories qui s'appliquent.",
      interestsErrorRequired: "Veuillez sélectionner au moins une catégorie.",

      presenceTitle: "Votre présence en ligne",
      presenceSub: "Sélectionnez les plateformes où l'on peut vous retrouver (optionnel).",
      presenceUrlLabel: "Lien / identifiant",
      presenceNone: "Aucune plateforme sélectionnée pour le moment.",

      reviewTitle: "Vérifiez votre candidature",
      reviewSub: "Relisez les informations avant de soumettre votre candidature à notre équipe.",
      reviewSectionAccount: "Compte",
      reviewSectionPartner: "Type de partenaire",
      reviewSectionBusiness: "Entreprise",
      reviewSectionInterests: "Centres d'intérêt",
      reviewSectionPresence: "Présence en ligne",
      reviewEditBtn: "Modifier",
      reviewReadyTitle: "Prêt à soumettre votre candidature ?",
      reviewReadySub:
        "Notre équipe examinera votre profil partenaire et vous contactera prochainement.",
      reviewSubmitBtn: "Soumettre ma candidature",
      reviewSubmitting: "Envoi en cours…",

      successTitle: "Votre candidature a été envoyée",
      successSub:
        "Merci de rejoindre CalmaTrip. Notre équipe va examiner votre profil partenaire et vous contactera prochainement.",
      successBackBtn: "Retour à l'accueil",

      lockedSubmittedTitle: "Candidature en cours d'examen",
      lockedSubmittedSub:
        "Votre candidature a bien été soumise. Notre équipe vous contactera prochainement.",
      lockedUnderReviewTitle: "Candidature en cours d'examen",
      lockedUnderReviewSub: "Notre équipe examine actuellement votre profil partenaire.",
      lockedApprovedTitle: "Candidature approuvée",
      lockedApprovedSub: "Votre compte partenaire est actif. Bienvenue chez CalmaTrip !",
      lockedRejectedTitle: "Candidature non retenue",
      lockedRejectedSub: "Votre candidature n'a pas été retenue cette fois-ci.",
      lockedSuspendedTitle: "Compte suspendu",
      lockedSuspendedSub: "Votre compte partenaire est actuellement suspendu.",
      goToDashboardBtn: "Accéder à mon espace",

      backBtn: "Précédent",
      continueBtn: "Continuer",
      requiredError: "Ce champ est obligatoire.",
      invalidUrlError: "Veuillez indiquer un lien valide (commençant par https://).",

      catTransport: "Transport",
      catExcursion: "Excursions",
      catActivity: "Activités",
      catFoodDrink: "Gastronomie",
      catSight: "Sites & monuments",
      catHiddenGem: "Pépites cachées",
      catHotel: "Hébergement",

      platformWebsite: "Site web",
      platformInstagram: "Instagram",
      platformFacebook: "Facebook",
      platformTiktok: "TikTok",
      platformYoutube: "YouTube",
      platformLinkedin: "LinkedIn",
      platformOther: "Autre",
    },

    community: {
      eyebrow: "Communauté",
      heroTitle: "Partagez votre expérience Calma Trip",
      heroSub:
        "Racontez votre voyage, donnez votre avis, échangez avec d'autres voyageurs — et rejoignez notre groupe Facebook pour ne rien manquer.",
      fbTitle: "Rejoignez notre groupe Facebook",
      fbDesc: "Discutez avec la communauté Calma Trip, posez vos questions, partagez vos photos.",
      fbJoin: "Rejoindre",
      loginPrompt: "Connectez-vous pour partager votre expérience.",
      loginCta: "Se connecter",
      placeholder: "Racontez votre expérience avec Calma Trip...",
      charCount: "{n} / 2000 caractères",
      photoLabel: "Photo",
      errorMin: "Votre message doit contenir au moins 10 caractères.",
      successMsg: "Merci ! Votre partage sera publié après validation par notre équipe.",
      shareCta: "Partager",
      sharing: "Publication…",
      emptyTitle: "Aucun partage pour le moment. Soyez le premier !",
      deleteLabel: "Supprimer",
      deleteConfirm: "Supprimer ce partage ?",
      today: "Aujourd'hui",
      yesterday: "Hier",
      daysAgo: "Il y a {n} jours",
    },
    pln: {
      eyebrow: "Devenir partenaire",
      heroTitle: "Faites vivre la Tunisie avec Calma Trip",
      heroSub:
        "Que vous soyez artisan ou agence, choisissez le profil qui vous correspond pour découvrir comment rejoindre notre réseau de partenaires.",
      artisanLabel: "Artisan",
      artisanDesc:
        "Vendez vos créations — poterie, textile, bijoux, produits locaux — sur la Marketplace Calma Trip.",
      artisanPoints: [
        "Commission simple et transparente",
        "Visibilité auprès des voyageurs",
        "Gestion en quelques clics",
      ],
      agencyLabel: "Agence",
      agencyDesc:
        "Publiez vos activités, excursions et hébergements sur Explore, comme sur GetYourGuide ou TripAdvisor.",
      agencyPoints: ["Visibilité sur Explore", "Suivi de commission clair", "Publication rapide"],
      learnMore: "En savoir plus",
    },
    home: {
      heroTitle: "Excursions, transferts et activités en Tunisie",
      heroSub: "Réservés en direct auprès d’une équipe locale installée à Hammamet.",
      heroCaption: "Vieux port de Bizerte",
      searchLabel: "Rechercher une destination ou une activité",
      searchPlaceholder: "Où allez-vous ? Djerba, désert, Sidi Bou Saïd…",
      searchBtn: "Rechercher",
      chipsLabel: "Catégories",
      chips: {
        tours: "Excursions & transferts",
        sights: "Sites & monuments",
        activities: "Activités",
        food: "Cafés & cuisine",
        hiddenGems: "Pépites cachées",
        museums: "Musées",
        events: "Événements",
      },
      trust: [
        { title: "Annulation gratuite", desc: "Remboursé jusqu’à 24 h avant le départ" },
        { title: "Prix locaux", desc: "Vous réservez en direct, sans intermédiaire" },
        { title: "Guides locaux", desc: "Des habitants qui connaissent chaque ruelle" },
        { title: "Support 24/7", desc: "En français, anglais et arabe" },
      ],
      toursHeading: "Excursions et transferts",
      localHeading: "Proposé par nos partenaires locaux",
      destinationsHeading: "Où aller en Tunisie",
      destinations: ["Sidi Bou Saïd", "Carthage", "Kairouan", "El Jem", "Tozeur", "Douz"],
      shopHeading: "Artisanat tunisien",
      reviewsHeading: "Ce qu’en disent nos voyageurs",
      reviewsCount: "{n} avis",
      seeAll: "Tout voir",
      prev: "Précédent",
      next: "Suivant",
      from: "À partir de",
      priceOnRequest: "Sur devis",
      plannerHeading: "Un groupe, un événement ou un circuit sur mesure ?",
      plannerSub:
        "Dites-nous ce que vous avez en tête : on prépare le programme, les transferts et les réservations avec vous.",
      plannerContact: "Demander un devis",
      howHeading: "Comment ça marche",
      howSteps: [
        {
          title: "Choisissez",
          desc: "Parcourez les excursions, transferts et activités, filtrez par destination, date et nombre de voyageurs.",
        },
        {
          title: "Réservez en direct",
          desc: "Confirmez en quelques clics, au prix local, sans intermédiaire. Annulation gratuite jusqu'à 24 h avant.",
        },
        {
          title: "Voyagez l'esprit tranquille",
          desc: "Notre équipe locale vous accompagne avant et pendant le voyage, en français, anglais et arabe.",
        },
      ],
      guidesHeading: "Guides pratiques",
      faqHeading: "Questions fréquentes",
      faqSub: "L'essentiel à savoir avant de réserver.",
      faqMore: "Voir toutes les questions",
      partnerHeading: "Vous proposez des activités en Tunisie ?",
      partnerSub:
        "Artisans, agences, hôtels : rejoignez Calma Trip et présentez vos offres à des voyageurs du monde entier.",
      partnerCta: "Devenir partenaire",
    },
    layout: {
      login: "Connexion",
      register: "Inscription",
      logout: "Déconnexion",
      account: "Compte",
      language: "Langue",
      openMenu: "Ouvrir le menu",
      closeMenu: "Fermer le menu",
      menu: "Menu",
      mySpace: "Mon espace",
      adminSpace: "Espace admin",
      partnerSpace: "Espace partenaire",
      footContact: "Nous contacter",
      footNewsletter: "Newsletter",
      privacy: "Confidentialité",
      terms: "CGV",
      legalNotice: "Mentions légales",
      footBottomNote: "Paiement sécurisé · Support 24/7",
    },
    search: {
      destinationLabel: "Destination",
      serviceLabel: "Service",
      allServices: "Tous les services",
      dateLabel: "Date",
      dateFlexible: "Date flexible",
      clearDate: "Effacer la date",
      participantsLabel: "Participants",
      participantOne: "1 participant",
      participantMany: "{n} participants",
      adults: "Adultes",
      adultsHint: "18 ans et plus",
      children: "Enfants",
      childrenHint: "De 0 à 17 ans",
      fewer: "Retirer : {who}",
      more: "Ajouter : {who}",
      today: "Aujourd’hui",
      tomorrow: "Demain",
      nextWeekend: "Le week-end prochain",
      prevMonth: "Mois précédent",
      nextMonth: "Mois suivant",
      groupHint: "Plus de {n} personnes ?",
      groupHintLink: "Demandez un devis",
      resultsIn: "Activités à {d}",
      resultsTitle: "Résultats pour « {q} »",
      resultsCount: "{n} résultat(s)",
      noResultsTitle: "Aucune activité ne correspond pour l’instant",
      noResultsSub:
        "Essayez « Tous les services », ou contactez-nous : on organise aussi des sorties sur mesure.",
      emptyTitle: "Où allez-vous ?",
      emptySub: "Choisissez une destination et un service pour voir nos activités.",
    },
    tickerMessages: [
      "☀️ ÉTÉ 2026 — RÉSERVEZ MAINTENANT",
      "RÉPONSE GARANTIE SOUS 30 MINUTES",
      "−15% SUR LES RÉSERVATIONS ANTICIPÉES",
      "GUIDES LOCAUX · PRIX JUSTES · ZÉRO STRESS",
      "SUPPORT 24/7 EN FRANÇAIS, ANGLAIS & ARABE",
    ],
  },
  en: {
    navHome: "Home",
    navServices: "Services",
    navServicesViewAll: "View all services",
    navMarket: "Marketplace",
    navExplore: "Explore",
    navBlog: "Blog",
    navCommunity: "Community",
    navAbout: "About Us",
    navContact: "Contact",
    navBecomePartner: "Become a partner",

    heroEyebrow: "Local experiences · Tunisia",
    heroTitle: "A Tunisia you",
    heroTitleEm: "live",
    heroSub:
      "Not just visit. Activities led by locals — from the Tunis medina to the dunes of Tozeur, booked direct.",
    heroCta1: "Plan your escape",
    heroCta2: "View experiences",

    searchDestL: "Destination",
    searchDest: "Start typing or select below…",
    searchDateL: "Date",
    searchDatePh: "MM/DD/YYYY",
    searchCatL: "Activity",
    searchCat: "All",
    browse: "Browse experiences",

    icCulture: "Culture",
    icMedina: "Medina",
    icBeach: "Beach",
    icDesert: "Desert",
    icFood: "Food",
    icHammam: "Hammam",
    icSail: "Sailing",
    icAdv: "Adventure",

    catsKicker: "By type of activity",
    catsHeading: "Choose your Tunisia",
    catsSub: "From the medina to the desert, from the sea to the table.",
    catsViewAll: "All destinations",

    expKicker: "Explore",
    expHeading: "Featured experiences",
    expViewAll: "View all",
    expFrom: "from",
    expPer: "/person",

    journeysKicker: "Suggested journeys",
    journeysHeading: "Itineraries designed to inspire you",
    journeysSub:
      "Three ways to experience Tunisia, from the Saharan south to the Mediterranean coast.",

    storyKicker: "The soul of the country",
    storyHeading: "A country of contrasts.",
    storyText:
      "Sea and desert. Ancient medinas and modern life. Tradition and discovery. Tunisia isn't summed up — it's felt, one alley and one dune at a time.",

    shopKicker: "Marketplace",
    shopHeading: "Tunisian craftsmanship, delivered to you",
    shopViewAll: "Visit the shop",

    guidesEyebrow: "Practical guides · Tunisia",
    guidesHeroTitle: "Travel informed",
    guidesHeroSub:
      "Visas, transport, currency, local customs — everything you need to know before you go.",
    guidesEmpty: "No guides available yet.",
    guidesBack: "All guides",
    guidesRead: "Read",
    servicesBack: "All services",

    whyKicker: "Why calma·trip",
    whyHeading: "Travel done right, built with Tunisians",
    whySub:
      "We work directly with local guides and artisans. You pay a fair price, and they are paid fairly.",
    whyBtn: "How we work",

    customKicker: "Tailor-made",
    customHeading: "A trip designed just for you.",
    customSub:
      "Our local specialists shape every step of your stay. From the medina to the dunes, we craft memories that last.",

    testiHeading: "What our travelers say",

    reviewKicker: "Your voice",
    reviewHeading: "Share your experience",
    reviewSub: "Your review matters to us and to other travelers.",

    newsKicker: "Start the adventure",
    newsTitle: "Ready to explore Tunisia?",
    newsSub:
      "Book now and enjoy premium transport and travel services across Tunisia. Response guaranteed within 30 minutes.",
    newsBtn1: "View services",
    newsBtn2: "Call now",
    newsTrust: "Secure Payment · No Obligation · 24/7 Support",

    footTag: "The marketplace for authentic experiences in Tunisia, booked directly with locals.",
    footExplore: "Explore",
    footCompany: "Company",

    newsletterTitle: "Newsletter",
    newsletterSub: "Get our best experiences and deals, once a month.",
    newsletterPlaceholder: "Your email",
    newsletterCta: "Subscribe",
    newsletterSuccess: "Thanks! You're subscribed.",

    cats: [
      {
        title: "Culture & Medina",
        desc: "Workshops, heritage, artisans",
        count: "48 exp.",
        ph: "PHOTO — MEDINA",
      },
      {
        title: "Beach & Mediterranean",
        desc: "Djerba, Hammamet, Kelibia",
        count: "32 exp.",
        ph: "PHOTO — SEA",
      },
      {
        title: "Desert & Sahara",
        desc: "Tozeur, Douz, Matmata",
        count: "27 exp.",
        ph: "PHOTO — DESERT",
      },
      {
        title: "Food & Market",
        desc: "Spices, olive oil, street food",
        count: "21 exp.",
        ph: "PHOTO — MARKET",
      },
    ],
    exps: [
      {
        place: "Nabeul",
        title: "Pottery workshop with a master ceramist",
        price: 45,
        rating: "4.9",
        ph: "PHOTO — WORKSHOP",
      },
      {
        place: "Tozeur",
        title: "Sunset 4×4 across the Chott el-Jerid",
        price: 60,
        rating: "4.8",
        ph: "PHOTO — 4×4",
      },
      {
        place: "Tunis",
        title: "Secret medina: alleys, souks and rooftops",
        price: 25,
        rating: "5.0",
        ph: "PHOTO — SOUK",
      },
    ],
    whys: [
      { n: "01", title: "Local guides", desc: "Locals who know every alley." },
      { n: "02", title: "No middleman", desc: "Book direct, at a fair price." },
      { n: "03", title: "Small groups", desc: "Intimate experiences, never crowds." },
      { n: "04", title: "Flexible cancellation", desc: "Refunded up to 24 h before." },
    ],
    journeys: [
      {
        title: "Dunes and oases of the South",
        region: "Southern Tunisia",
        duration: "3 days",
        desc: "From the golden dunes of Douz to the hidden palm groves of Chebika, in a small group.",
        ph: "PHOTO — SAHARA",
      },
      {
        title: "The coast, differently",
        region: "Sidi Bou Said · Carthage",
        duration: "2 days",
        desc: "Blue-and-white alleys, ancient ports, and sunsets over the Mediterranean.",
        ph: "PHOTO — COAST",
      },
      {
        title: "On the trail of history",
        region: "Kairouan · El Jem",
        duration: "1 day",
        desc: "Centuries-old medinas, sacred mosques, and Africa's best-preserved Roman amphitheater.",
        ph: "PHOTO — HERITAGE",
      },
    ],
    testis: [
      {
        quote: "We shaped clay with an artisan in Nabeul — a moment no agency could have given us.",
        name: "Camille Reyer",
        role: "Lyon, France",
        init: "C",
      },
      {
        quote: "The desert at sunset, without the crowds. Our guide knew every track.",
        name: "Marco Bianchi",
        role: "Milan, Italy",
        init: "M",
      },
      {
        quote: "Seamless booking, honest price, and a passionate guide in the Tunis medina.",
        name: "Sophie Laurent",
        role: "Brussels, Belgium",
        init: "S",
      },
    ],

    svc: {
      eyebrow: "Our services · Tunisia",
      heroTitle: "Travel with peace of mind",
      heroSub:
        "Premium transport, local guides, and tailor-made logistics — we orchestrate every detail of your stay in Tunisia. Response guaranteed within 30 minutes.",
      statLabels: ["Happy clients", "Destinations", "Satisfaction rate", "Support"],
      offerKicker: "What we offer",
      offerTitle1: "Services tailored",
      offerTitle2: "to every traveller",
      searchPh: "Search a service (transfer, excursion, activity…)",
      clearSearch: "Clear search",
      resultWord: "result",
      resultsWord: "results",
      forWord: "for",
      noResultsFor: "No results for",
      noResultsHint: "— try another word or browse everything below.",
      emptySearch: "Nothing matches your search yet.",
      emptyCategory: "No services in this category yet.",
      bookThis: "Book this experience",
      bookShort: "Book",
      fromLabel: "From",
      readMore: "Read more ↓",
      showLess: "Show less ↑",
      moreIncluded: "more included",
      viewDetails: "View details",
      detailFeaturesTitle: "What's included",
      reviewsTitle: "Customer reviews",
      reviewWord: "review",
      reviewsWord: "reviews",
      trustSecure: "Pay on arrival",
      trustConfirm: "Confirmation within 30 min",
      trustSupport: "24/7 support",
      relatedTitle: "Other services you might like",
      notFoundTitle: "Service not found",
      notFoundHint: "This service is no longer available.",
      whyKicker: "Why Calma Trip",
      whyTitle: "Built around your peace of mind",
      why: [
        {
          title: "Guaranteed safety",
          desc: "Maintained vehicles, full insurance, certified drivers.",
        },
        { title: "Always on time", desc: "Real-time GPS tracking. Your schedule is ours." },
        {
          title: "Premium quality",
          desc: "Handpicked partners, consistent standards, no surprises.",
        },
        { title: "24/7 human support", desc: "English, French, and Arabic-speaking specialists." },
      ],
      contactKicker: "Get in touch",
      contactTitle1: "Not sure what you need?",
      contactTitle2: "Let’s find the solution together.",
      contactFeatures: [
        "Certified professional drivers",
        "Modern, air-conditioned fleet",
        "Instant booking confirmation",
        "24/7 multilingual support",
      ],
      contactCta: "Request a quote",
      responseTime: "Response time",
      emailLabel: "Email",
      phoneLabel: "Phone",
      ctaKicker: "Ready when you are",
      ctaTitle: "Your next trip starts here.",
      ctaSub: "Join hundreds of travellers exploring Tunisia with complete peace of mind.",
      ctaBtn1: "Contact us",
      ctaBtn2: "Book now",
      modalTitle: "Almost there!",
      modalSub: "Log in to your account to confirm your booking.",
      modalLogin: "Log in & book",
      modalClose: "Close",
    },

    mkt: {
      eyebrow: "Marketplace · Tunisia",
      heroTitle: "Tunisian craftsmanship, delivered to you",
      heroSub:
        "Carefully curated souvenirs and travel essentials — clothing, accessories, and handcrafted pieces inspired by Tunisia.",
      loading: "Loading...",
      productWord: "product",
      productsWord: "products",
      sortNewest: "Newest",
      sortPriceAsc: "Price ascending",
      sortPriceDesc: "Price descending",
      sortNameAz: "Name A-Z",
      emptyTitle: "No products found",
      emptySub: "Try a different search or category",
      searchPh: "Search for a product...",
      clearSearch: "Clear search",
      allLabel: "All",
      myOrders: "My orders",
      wishlistLabel: "Wishlist",
      cartLabel: "Cart",
      outOfStock: "Out of stock",
      lowStock: "Only {n} left",
      addToWishlist: "Add to wishlist",
      removeFromWishlist: "Remove from wishlist",
      addToCart: "Add to cart",
    },

    exp: {
      eyebrow: "Explore · Tunisia",
      heroTitle: "From the blue north to the golden Sahara",
      heroSub:
        "Six regions, a thousand faces. Choose a destination and discover the places that embody it — soon complemented by tours from our partner agencies and guides.",
      searchPh: "Where do you want to go?",
      catAll: "All",
      catFood: "Food & Drink",
      catSights: "Sights",
      catActivities: "Activities",
      catHidden: "Hidden Gems",
      catEvents: "Events",
      catMuseums: "Museums",
      catHotels: "Stays",
      allCities: "All Cities",
      budgetLabel: "Budget",
      useLocation: "Use My Location",
      listLabel: "List",
      mapLabel: "Map",
      filtersLabel: "Filters",
      clearAll: "Clear All",
      sortLabel: "Sort",
      sortPopularity: "Popularity",
      sortRating: "Rating",
      sortReviews: "Reviews",
      emptyTitle: "No treasures found...",
      emptySub:
        "We couldn’t find anything matching your exact criteria. Try broadening your search or exploring a different category.",
      resetFilters: "Reset All Filters",
    },

    abt: {
      eyebrow: "About · Calma Trip",
      heroTitle: "Travel, designed with Tunisians",
      heroSub:
        "We connect travellers with local guides, artisans, and hosts — for tourism that’s fairer, truer, calmer.",
      statLabels: [
        "Founded in Hammamet",
        "Happy clients",
        "Local partners",
        "Customer satisfaction",
      ],
      storyKicker: "Our story",
      storyTitle: "Born in Hammamet",
      storyP1:
        "Founded in Hammamet, Tunisia, in 2026, Calma Trip was born from a simple conviction: travel should mean peace of mind. Our name reflects that vision — letting you discover the heart of your destination before you even set foot in it.",
      storyP2:
        "We are far more than a tourism platform and marketplace. We connect you to premium travel services through our trusted local partners, while our team provides constant, proactive follow-up so every detail unfolds exactly as planned.",
      storyItems: [
        "Premium services through trusted local partners",
        "Proactive follow-up on every booking",
        "Your satisfaction is our priority",
      ],
      promiseKicker: "Our commitment",
      promiseTitle1: "The",
      promiseTitleEm: "Calma",
      promiseP1:
        "With Calma Trip, travel with a light heart at last. Forget endless negotiations and scattered bookings — we’re your single, trusted hub for securing every service instantly.",
      promiseP2:
        "Your satisfaction is our priority. We actively gather your feedback and provide immediate support to guarantee a smooth, worry-free experience from start to finish.",
      promiseQuote: "One hub. All your services. Zero stress.",
      offerKicker: "What we offer",
      offerTitle: "Everything you need, taken care of",
      offerings: [
        {
          num: "01",
          title: "Stress-free planning",
          desc: "We handle every logistical detail of your trip, so you can fully enjoy your stay instead of managing it.",
        },
        {
          num: "02",
          title: "End-to-end support",
          desc: "From the moment you book until your return, our team provides complete follow-up and reliable assistance at every step of your journey.",
        },
        {
          num: "03",
          title: "Local prices",
          desc: "Experience the real Tunisia, without inflated tourist rates. Authentic value, every time.",
        },
        {
          num: "04",
          title: "Immediate assistance",
          desc: "We prioritise your comfort and peace of mind with fast, responsive service, before and during your trip.",
        },
      ],
      teamKicker: "The team",
      teamTitle: "The faces behind Calma Trip",
      specialistsKicker: "Our team",
      specialistsTitle: "Destination specialists",
      specialistsSub:
        "Our dedicated specialists are always available to guide you personally — whether it’s a question about your excursion or simple curiosity about life in Tunisia.",
      spokenFluently: "Spoken fluently",
      languages: [
        { code: "EN", lang: "English" },
        { code: "FR", lang: "French" },
        { code: "AR", lang: "Arabic" },
      ],
      specialistsBottom:
        "Beyond simple bookings, our destination specialists help you make the most of Tunisia — hidden gems, local addresses, cultural tips, and travel logistics. Think of us as your personal connection to the real Tunisia.",
      ctaTitle1: "Ready to travel with complete",
      ctaTitleEm: "peace of mind",
      ctaSub:
        "Join hundreds of satisfied travellers and discover Tunisia — stress-free, fully supported, at local prices.",
      ctaBtn: "Discover our services",
    },

    cnt: {
      breadcrumbHome: "Home",
      eyebrow: "Contact us",
      heroTitle1: "Talk to a",
      heroTitleEm: "human",
      heroSub:
        "Our team answers all your questions and supports your travel plans — in French, English, and Arabic.",
      infoPhoneTitle: "Phone",
      infoPhoneDesc: "Available 24/7",
      infoEmailTitle: "Email",
      infoEmailDesc: "Response within 24h",
      infoAddressTitle: "Address",
      infoAddressDesc: "Visit our office",
      infoHoursTitle: "Hours",
      infoHoursDesc: "Customer service",
      infoHours1: "Mon-Fri: 8:00 AM - 8:00 PM",
      infoHours2: "Sat-Sun: 9:00 AM - 6:00 PM",
      formTitle: "Send us a message",
      formSub: "Fill in the form below, our team will respond within 24h.",
      labelName: "Full name",
      phName: "Your name",
      labelEmail: "Email",
      phEmail: "your@email.com",
      labelPhone: "Phone",
      labelSubject: "Subject",
      subjSelect: "Select a subject",
      subjReservation: "Reservation",
      subjInfo: "Information request",
      subjComplaint: "Complaint",
      subjQuote: "Quote request",
      subjOther: "Other",
      labelMessage: "Message",
      phMessage: "Your message...",
      sendBtn: "Send message",
      sentTitle: "Message sent!",
      sentSub: "Thank you for reaching out. Our team will get back to you shortly.",
      mapAddress: "Avenue Habib Bourguiba, Hammamet",
      openInMaps: "Open in Google Maps",
      practicalTitle: "Practical information",
      practicalItems: [
        "Free parking available for visitors",
        "Office accessible to people with reduced mobility",
        "Customer service available in French, Arabic, and English",
        "Cash and card payments accepted",
        "Secure 24/7 online booking",
        "Phone support available 24/7",
      ],
      helpTitle: "Immediate assistance",
      avgResponseLabel: "Average response time",
      avgResponseValue: "Under 30 minutes",
      satisfactionLabel: "Satisfaction",
      callBtn: "Call",
      whatsappBtn: "WhatsApp",
      followUs: "Follow us",
      faqKicker: "FAQ",
      faqTitle: "Frequently asked questions",
      faqSub: "Everything you need to know before booking your next experience.",
      faqNoAnswer: "Didn’t find an answer?",
      faqContactSupport: "Contact our support",
      ctaKicker: "Always available",
      ctaTitle: "Need immediate assistance?",
      ctaSub:
        "Our team is available 24/7 to answer your questions and plan your next Tunisian adventure.",
      ctaCallBtn: "Call now",
      ctaWhatsappBtn: "WhatsApp",
    },

    dash: {
      navBookings: "My bookings",
      navNew: "New booking",
      navPayments: "Payments",
      navReviews: "Reviews",
      navProfile: "Profile",
      backToSite: "Back to site",
      signOut: "Sign out",
      upcomingExpSingular: "upcoming experience",
      upcomingExpPlural: "upcoming experiences",
      actionRequiredSingular: "action required",
      actionRequiredPlural: "actions required",
      toReviewSingular: "to review",
      toReviewPlural: "to review",

      paymentsTitle: "Payments",
      paymentsSub: "Payment tracking for all your bookings, kept up to date by our team.",
      paymentsEmpty: "No payments to show yet.",

      reviewsTitle: "Your reviews",
      reviewsSub:
        "Only clients who actually booked a service can leave a review — that's what makes them credible.",
      reviewsEmpty: "You don't have an experience to review yet.",
      reviewsToRateTitle: "To review",
      reviewsYoursTitle: "Your submitted reviews",
      reviewsPendingApproval: "pending approval",
      leaveReviewBtn: "Leave a review",

      profileTitle: "Profile",
      profileSub: "Your personal information.",
      profileNameLabel: "Full name",
      profileEmailLabel: "Email address",
      profilePhoneLabel: "Phone",
      profilePhonePh: "+216 00 000 000",
      profileSaveBtn: "Save",
      profileSavedMsg: "Profile updated.",
      profileErrorMsg: "Update failed. Please try again.",

      welcomeBack: "Welcome back",
      nextTripSub: "is waiting for you.",
      emptyHeaderSub: "Your next adventure starts here.",

      yourNextExperience: "Your next experience",
      reservationRef: "Booking",
      travelersCount: "travelers",
      viewTrip: "View your trip",

      paymentPaid: "Paid",
      paymentPending: "Payment pending",
      paymentRefunded: "Refunded",

      statusConfirmed: "Confirmed",
      statusPending: "Pending",
      statusCancelled: "Cancelled",

      journeyTitle: "Your journey",
      stepReceived: "Booking received",
      stepConfirmed: "Confirmed",
      stepPrepare: "Get ready",
      stepEnjoy: "Enjoy your experience",
      stepShare: "Share your experience",

      glanceTitle: "Your trip at a glance",
      glanceDatesLabel: "Date",
      glanceDatesSub: "The dates of your experience",
      glanceTravelersSub: "Included in your booking",
      glancePaymentSub: "Complete payment before departure",
      glancePaymentSubPaid: "Thank you, all settled",
      glanceDestinationLabel: "Destination",

      beforeTitle: "Before you go",
      beforeSubSoon: "Your adventure is coming up soon.",
      beforeSubGeneral: "Everything you need to know before the big day.",
      packingTitle: "What to pack",
      packingDesc: "Practical tips to get ready for your experience.",
      helpCardTitle: "Need help?",
      helpCardDesc: "Contact our team about your booking.",
      fullDetailsTitle: "View full booking details",
      fullDetailsDesc: "See all the information about your experience.",

      alsoLikeTitle: "You might also like",
      alsoLikeSub: "Complete your experience with other Calma Trip services",

      otherBookingsTitle: "Your other bookings",
      upcomingTitle: "Upcoming",
      historyTitle: "History",
      emptyTitle: "Your next adventure starts here",
      emptySub: "No bookings yet — create one and it'll show up here.",
      createBooking: "Create a booking",
      newBookingTitle: "New booking",
      newBookingSub: "Fill in the form to book your next trip",

      needHelpTitle: "Need help?",
      needHelpSub: "Our team is available 24/7",
      callBtn: "Call",
      whatsappBtn: "WhatsApp",
    },
    pnr: {
      pageTitle: "Become a CalmaTrip partner",
      pageSub: "A few steps to join our partner network.",
      savedIndicator: "Saved",
      savingIndicator: "Saving…",
      googleBtn: "Continue with Google",

      stepAccount: "Account",
      stepPartnerType: "Partner type",
      stepBusiness: "Business",
      stepInterests: "Interests",
      stepPresence: "Online presence",
      stepReview: "Review",
      stepWord: "Step",
      ofWord: "of",

      accountTitle: "Create your account",
      accountSub: "Start by creating your CalmaTrip Partners account.",
      accountNameLabel: "Full name",
      accountEmailLabel: "Email address",
      accountPhoneLabel: "Phone",
      accountPasswordLabel: "Password",
      accountConfirmLabel: "Confirm password",
      accountSubmitBtn: "Create my account",
      accountHaveAccount: "Already have an account?",
      accountLoginLink: "Sign in",

      typeTitle: "What type of partner are you?",
      typeSub: "This choice determines the rest of your application.",
      typeArtisanLabel: "Artisan",
      typeArtisanTagline: "Local professional",
      typeArtisanDesc: "Offer your services and expertise to CalmaTrip travelers.",
      typeAgencyLabel: "Agency",
      typeAgencyTagline: "Travel professional",
      typeAgencyDesc: "Build experiences and travel offers for your clients with CalmaTrip.",

      bizTitle: "Your business details",
      bizSub: "This lets us verify and showcase your business.",
      bizOrgLabel: "Organization / business name",
      bizOrgPh: "e.g. Sahara Excursions",
      bizFirstNameLabel: "Contact first name",
      bizLastNameLabel: "Contact last name",
      bizPhoneLabel: "Phone",
      bizCountryLabel: "Country",
      bizCountryPh: "Search a country…",
      bizCityLabel: "City",
      bizCityOtherLabel: "Other city",
      bizCityOtherPh: "Enter your city",
      bizCurrencyLabel: "Currency",
      bizWebsiteLabel: "Website",
      bizWebsitePh: "https://example.com",
      bizWebsiteOptional: "Optional",

      interestsArtisanTitle: "What services do you work with?",
      interestsAgencyTitle: "What are you interested in offering or promoting with CalmaTrip?",
      interestsSub: "Select every category that applies.",
      interestsErrorRequired: "Please select at least one category.",

      presenceTitle: "Your online presence",
      presenceSub: "Select the platforms where you can be found (optional).",
      presenceUrlLabel: "Link / handle",
      presenceNone: "No platform selected yet.",

      reviewTitle: "Review your application",
      reviewSub: "Review the information before submitting your application to our team.",
      reviewSectionAccount: "Account",
      reviewSectionPartner: "Partner type",
      reviewSectionBusiness: "Business",
      reviewSectionInterests: "Interests",
      reviewSectionPresence: "Online presence",
      reviewEditBtn: "Edit",
      reviewReadyTitle: "Ready to submit your partner application?",
      reviewReadySub: "Our team will review your partner profile and contact you shortly.",
      reviewSubmitBtn: "Submit application",
      reviewSubmitting: "Submitting…",

      successTitle: "Your application has been submitted",
      successSub:
        "Thank you for joining CalmaTrip. Our team will review your partner profile and contact you shortly.",
      successBackBtn: "Back to home",

      lockedSubmittedTitle: "Application under review",
      lockedSubmittedSub: "Your application has been submitted. Our team will contact you shortly.",
      lockedUnderReviewTitle: "Application under review",
      lockedUnderReviewSub: "Our team is currently reviewing your partner profile.",
      lockedApprovedTitle: "Application approved",
      lockedApprovedSub: "Your partner account is active. Welcome to CalmaTrip!",
      lockedRejectedTitle: "Application not approved",
      lockedRejectedSub: "Your application wasn't approved this time.",
      lockedSuspendedTitle: "Account suspended",
      lockedSuspendedSub: "Your partner account is currently suspended.",
      goToDashboardBtn: "Go to my dashboard",

      backBtn: "Back",
      continueBtn: "Continue",
      requiredError: "This field is required.",
      invalidUrlError: "Please enter a valid link (starting with https://).",

      catTransport: "Transport",
      catExcursion: "Excursions",
      catActivity: "Activities",
      catFoodDrink: "Food & Drink",
      catSight: "Sights & landmarks",
      catHiddenGem: "Hidden gems",
      catHotel: "Accommodation",

      platformWebsite: "Website",
      platformInstagram: "Instagram",
      platformFacebook: "Facebook",
      platformTiktok: "TikTok",
      platformYoutube: "YouTube",
      platformLinkedin: "LinkedIn",
      platformOther: "Other",
    },

    community: {
      eyebrow: "Community",
      heroTitle: "Share your Calma Trip experience",
      heroSub:
        "Tell us about your trip, leave your feedback, chat with other travelers — and join our Facebook group so you never miss a thing.",
      fbTitle: "Join our Facebook group",
      fbDesc: "Chat with the Calma Trip community, ask your questions, share your photos.",
      fbJoin: "Join",
      loginPrompt: "Sign in to share your experience.",
      loginCta: "Sign in",
      placeholder: "Tell us about your experience with Calma Trip...",
      charCount: "{n} / 2000 characters",
      photoLabel: "Photo",
      errorMin: "Your message must be at least 10 characters long.",
      successMsg: "Thank you! Your post will be published after review by our team.",
      shareCta: "Share",
      sharing: "Posting…",
      emptyTitle: "No posts yet. Be the first!",
      deleteLabel: "Delete",
      deleteConfirm: "Delete this post?",
      today: "Today",
      yesterday: "Yesterday",
      daysAgo: "{n} days ago",
    },
    pln: {
      eyebrow: "Become a partner",
      heroTitle: "Bring Tunisia to life with Calma Trip",
      heroSub:
        "Whether you're an artisan or an agency, choose the profile that fits you to see how to join our partner network.",
      artisanLabel: "Artisan",
      artisanDesc:
        "Sell your creations — pottery, textiles, jewelry, local products — on the Calma Trip Marketplace.",
      artisanPoints: [
        "Simple, transparent commission",
        "Visibility to travelers",
        "Manage everything in a few clicks",
      ],
      agencyLabel: "Agency",
      agencyDesc:
        "List your activities, excursions and stays on Explore, just like on GetYourGuide or TripAdvisor.",
      agencyPoints: ["Visibility on Explore", "Clear commission tracking", "Fast publishing"],
      learnMore: "Learn more",
    },
    home: {
      heroTitle: "Tours, transfers and things to do in Tunisia",
      heroSub: "Booked directly with a local team based in Hammamet.",
      heroCaption: "Old port, Bizerte",
      searchLabel: "Search for a destination or activity",
      searchPlaceholder: "Where to? Djerba, the desert, Sidi Bou Said…",
      searchBtn: "Search",
      chipsLabel: "Categories",
      chips: {
        tours: "Tours & transfers",
        sights: "Sights & landmarks",
        activities: "Activities",
        food: "Cafés & food",
        hiddenGems: "Hidden gems",
        museums: "Museums",
        events: "Events",
      },
      trust: [
        { title: "Free cancellation", desc: "Full refund up to 24 hours before" },
        { title: "Local prices", desc: "Book directly, no middleman" },
        { title: "Local guides", desc: "People who know every alley" },
        { title: "24/7 support", desc: "In English, French and Arabic" },
      ],
      toursHeading: "Tours and transfers",
      localHeading: "From our local partners",
      destinationsHeading: "Where to go in Tunisia",
      destinations: ["Sidi Bou Said", "Carthage", "Kairouan", "El Jem", "Tozeur", "Douz"],
      shopHeading: "Tunisian craft",
      reviewsHeading: "What travellers say",
      reviewsCount: "{n} reviews",
      seeAll: "See all",
      prev: "Previous",
      next: "Next",
      from: "From",
      priceOnRequest: "Price on request",
      plannerHeading: "Travelling as a group, or want a custom itinerary?",
      plannerSub:
        "Tell us what you have in mind — we’ll plan the days, the transfers and the bookings with you.",
      plannerContact: "Request a quote",
      howHeading: "How it works",
      howSteps: [
        {
          title: "Choose",
          desc: "Browse excursions, transfers and activities, and filter by destination, date and group size.",
        },
        {
          title: "Book direct",
          desc: "Confirm in a few clicks at local prices, with no middleman. Free cancellation up to 24 h before.",
        },
        {
          title: "Travel stress-free",
          desc: "Our local team looks after you before and during your trip, in French, English and Arabic.",
        },
      ],
      guidesHeading: "Practical guides",
      faqHeading: "Frequently asked questions",
      faqSub: "The essentials to know before you book.",
      faqMore: "See all questions",
      partnerHeading: "Do you offer activities in Tunisia?",
      partnerSub:
        "Artisans, agencies, hotels: join Calma Trip and showcase your offers to travellers from around the world.",
      partnerCta: "Become a partner",
    },
    layout: {
      login: "Log in",
      register: "Sign up",
      logout: "Log out",
      account: "Account",
      language: "Language",
      openMenu: "Open menu",
      closeMenu: "Close menu",
      menu: "Menu",
      mySpace: "My account",
      adminSpace: "Admin space",
      partnerSpace: "Partner space",
      footContact: "Contact us",
      footNewsletter: "Newsletter",
      privacy: "Privacy",
      terms: "Terms of sale",
      legalNotice: "Legal notice",
      footBottomNote: "Secure payment · 24/7 support",
    },
    search: {
      destinationLabel: "Destination",
      serviceLabel: "Service",
      allServices: "All services",
      dateLabel: "Date",
      dateFlexible: "Flexible date",
      clearDate: "Clear date",
      participantsLabel: "Participants",
      participantOne: "1 participant",
      participantMany: "{n} participants",
      adults: "Adults",
      adultsHint: "18 and over",
      children: "Children",
      childrenHint: "Ages 0 to 17",
      fewer: "Remove: {who}",
      more: "Add: {who}",
      today: "Today",
      tomorrow: "Tomorrow",
      nextWeekend: "Next weekend",
      prevMonth: "Previous month",
      nextMonth: "Next month",
      groupHint: "More than {n} people?",
      groupHintLink: "Request a quote",
      resultsIn: "Things to do in {d}",
      resultsTitle: "Results for “{q}”",
      resultsCount: "{n} result(s)",
      noResultsTitle: "Nothing matches yet",
      noResultsSub: "Try “All services”, or get in touch — we also put together custom outings.",
      emptyTitle: "Where are you going?",
      emptySub: "Pick a destination and a service to see what we offer.",
    },
    tickerMessages: [
      "☀️ SUMMER 2026 — BOOK NOW",
      "GUARANTEED REPLY WITHIN 30 MINUTES",
      "−15% ON EARLY BOOKINGS",
      "LOCAL GUIDES · FAIR PRICES · ZERO STRESS",
      "24/7 SUPPORT IN FRENCH, ENGLISH & ARABIC",
    ],
  },
  ar: {
    navHome: "الرئيسية",
    navServices: "الخدمات",
    navServicesViewAll: "عرض كل الخدمات",
    navMarket: "السوق",
    navExplore: "استكشف",
    navBlog: "المدونة",
    navCommunity: "المجتمع",
    navAbout: "من نحن",
    navContact: "اتصل بنا",
    navBecomePartner: "كن شريكًا",

    heroEyebrow: "تجارب محلية · تونس",
    heroTitle: "تونس تُعاش",
    heroTitleEm: "لا تُزار فقط",
    heroSub: "أنشطة يقودها أهل البلاد — من مدينة تونس العتيقة إلى كثبان توزر، تُحجز مباشرة.",
    heroCta1: "خطّط لهروبك",
    heroCta2: "شاهد التجارب",

    searchDestL: "الوجهة",
    searchDest: "ابدأ الكتابة أو اختر…",
    searchDateL: "التاريخ",
    searchDatePh: "يي/شش/سسسس",
    searchCatL: "النشاط",
    searchCat: "الكل",
    browse: "تصفح التجارب",

    icCulture: "ثقافة",
    icMedina: "المدينة العتيقة",
    icBeach: "شاطئ",
    icDesert: "صحراء",
    icFood: "أكل",
    icHammam: "حمّام",
    icSail: "إبحار",
    icAdv: "مغامرة",

    catsKicker: "حسب نوع النشاط",
    catsHeading: "اختر تونسك",
    catsSub: "من المدينة العتيقة إلى الصحراء، ومن البحر إلى المائدة.",
    catsViewAll: "كل الوجهات",

    expKicker: "استكشف",
    expHeading: "تجارب مميزة",
    expViewAll: "عرض الكل",
    expFrom: "ابتداءً من",
    expPer: "/للشخص",

    journeysKicker: "رحلات مقترحة",
    journeysHeading: "مسارات صُممت لإلهامك",
    journeysSub: "ثلاث طرق لعيش تونس، من صحراء الجنوب إلى ساحل المتوسط.",

    storyKicker: "روح البلاد",
    storyHeading: "بلد التناقضات.",
    storyText:
      "البحر والصحراء. المدن العتيقة والحياة العصرية. التقاليد والاكتشاف. تونس لا تُختصر — بل تُعاش، زقاقًا وكثيبًا في كل مرة.",

    shopKicker: "السوق",
    shopHeading: "الحرف التونسية، تصلك أينما كنت",
    shopViewAll: "زر المتجر",

    guidesEyebrow: "أدلة عملية · تونس",
    guidesHeroTitle: "سافر وأنت مطّلع",
    guidesHeroSub: "التأشيرة، النقل، العملة، العادات المحلية — كل ما تحتاج معرفته قبل السفر.",
    guidesEmpty: "لا توجد أدلة متاحة حاليًا.",
    guidesBack: "كل الأدلة",
    guidesRead: "قراءة",
    servicesBack: "كل الخدمات",

    whyKicker: "لماذا كالما تريب",
    whyHeading: "سفر عادل، بُني مع التونسيين",
    whySub: "نعمل مباشرة مع المرشدين والحرفيين المحليين. تدفعون السعر العادل، ويُدفع لهم بإنصاف.",
    whyBtn: "طريقة عملنا",

    customKicker: "حسب الطلب",
    customHeading: "رحلة مصممة خصيصًا لك.",
    customSub:
      "يصمم خبراؤنا المحليون كل تفصيل في إقامتكم. من المدينة العتيقة إلى الكثبان، نصنع ذكريات تدوم.",

    testiHeading: "ماذا يقول مسافرونا",

    reviewKicker: "رأيك",
    reviewHeading: "شاركنا تجربتك",
    reviewSub: "رأيك يهمنا ويهم بقية المسافرين.",

    newsKicker: "ابدأ المغامرة",
    newsTitle: "مستعد لاستكشاف تونس؟",
    newsSub: "احجز الآن واستمتع بخدمات نقل وسفر مميزة في جميع أنحاء تونس. رد مضمون خلال 30 دقيقة.",
    newsBtn1: "عرض الخدمات",
    newsBtn2: "اتصل بنا",
    newsTrust: "دفع آمن · بدون التزام · دعم على مدار الساعة",

    footTag: "سوق التجارب الأصيلة في تونس، تُحجز مباشرة مع السكان المحليين.",
    footExplore: "استكشف",
    footCompany: "الشركة",

    newsletterTitle: "النشرة الإخبارية",
    newsletterSub: "استلم أفضل تجاربنا وعروضنا، مرة كل شهر.",
    newsletterPlaceholder: "بريدك الإلكتروني",
    newsletterCta: "اشترك",
    newsletterSuccess: "شكرًا! تم تسجيل اشتراكك.",

    cats: [
      {
        title: "ثقافة ومدينة عتيقة",
        desc: "ورشات، تراث، حرفيون",
        count: "48 تجربة",
        ph: "صورة — المدينة",
      },
      {
        title: "شاطئ والبحر الأبيض المتوسط",
        desc: "جربة، الحمامات، قليبية",
        count: "32 تجربة",
        ph: "صورة — البحر",
      },
      { title: "صحراء وساحل", desc: "توزر، دوز، مطماطة", count: "27 تجربة", ph: "صورة — الصحراء" },
      {
        title: "أكل وسوق",
        desc: "توابل، زيت زيتون، أكل الشارع",
        count: "21 تجربة",
        ph: "صورة — السوق",
      },
    ],
    exps: [
      {
        place: "نابل",
        title: "ورشة فخار مع حرفي محترف",
        price: 45,
        rating: "4.9",
        ph: "صورة — ورشة",
      },
      {
        place: "توزر",
        title: "غروب الشمس بسيارة 4×4 في شط الجريد",
        price: 60,
        rating: "4.8",
        ph: "صورة — 4×4",
      },
      {
        place: "تونس",
        title: "المدينة السرية: أزقة وأسواق وأسطح",
        price: 25,
        rating: "5.0",
        ph: "صورة — السوق",
      },
    ],
    whys: [
      { n: "01", title: "مرشدون محليون", desc: "سكان يعرفون كل زقاق." },
      { n: "02", title: "بدون وسيط", desc: "احجز مباشرة، بالسعر العادل." },
      { n: "03", title: "مجموعات صغيرة", desc: "تجارب حميمية، بدون ازدحام." },
      { n: "04", title: "إلغاء مرن", desc: "استرداد كامل حتى 24 ساعة قبل الموعد." },
    ],
    journeys: [
      {
        title: "كثبان وواحات الجنوب",
        region: "جنوب تونس",
        duration: "3 أيام",
        desc: "من كثبان دوز الذهبية إلى واحات شبيكة المخفية، في مجموعة صغيرة.",
        ph: "PHOTO — SAHARA",
      },
      {
        title: "الساحل، بنظرة مختلفة",
        region: "سيدي بوسعيد · قرطاج",
        duration: "يومان",
        desc: "أزقة زرقاء وبيضاء، موانئ عتيقة، وغروب الشمس على البحر المتوسط.",
        ph: "PHOTO — COAST",
      },
      {
        title: "على خطى التاريخ",
        region: "القيروان · الجم",
        duration: "يوم واحد",
        desc: "مدن عتيقة عمرها قرون، مساجد مقدسة، ومدرج روماني هو الأفضل حفظًا في أفريقيا.",
        ph: "PHOTO — HERITAGE",
      },
    ],
    testis: [
      {
        quote: "شكّلنا الطين مع حرفي في نابل — لحظة ما كانت لتقدمها لنا أي وكالة.",
        name: "كاميل ريير",
        role: "ليون، فرنسا",
        init: "C",
      },
      {
        quote: "الصحراء عند الغروب، بدون ازدحام. مرشدنا كان يعرف كل درب.",
        name: "ماركو بيانكي",
        role: "ميلانو، إيطاليا",
        init: "M",
      },
      {
        quote: "حجز سلس، سعر صادق، ومرشد شغوف في مدينة تونس العتيقة.",
        name: "صوفي لوران",
        role: "بروكسل، بلجيكا",
        init: "S",
      },
    ],

    svc: {
      eyebrow: "خدماتنا · تونس",
      heroTitle: "سافر وأنت مطمئن البال",
      heroSub:
        "نقل متميز، مرشدون محليون، ولوجستيك مصمم خصيصًا — ننسق كل تفصيل في إقامتك بتونس. رد مضمون خلال 30 دقيقة.",
      statLabels: ["عملاء سعداء", "وجهات", "نسبة الرضا", "دعم"],
      offerKicker: "ماذا نقدم",
      offerTitle1: "خدمات مصممة",
      offerTitle2: "لكل مسافر",
      searchPh: "ابحث عن خدمة (نقل، رحلة، نشاط…)",
      clearSearch: "مسح البحث",
      resultWord: "نتيجة",
      resultsWord: "نتائج",
      forWord: "لـ",
      noResultsFor: "لا نتائج لـ",
      noResultsHint: "— جرّب كلمة أخرى أو تصفح كل شيء أدناه.",
      emptySearch: "لا شيء يطابق بحثك حاليًا.",
      emptyCategory: "لا خدمات في هذه الفئة حاليًا.",
      bookThis: "احجز هذه التجربة",
      bookShort: "احجز",
      fromLabel: "ابتداءً من",
      readMore: "اقرأ المزيد ↓",
      showLess: "عرض أقل ↑",
      moreIncluded: "إضافية مشمولة",
      viewDetails: "عرض التفاصيل",
      detailFeaturesTitle: "ما هو مشمول",
      reviewsTitle: "آراء العملاء",
      reviewWord: "تقييم",
      reviewsWord: "تقييمات",
      trustSecure: "الدفع عند الوصول",
      trustConfirm: "تأكيد خلال 30 دقيقة",
      trustSupport: "دعم على مدار الساعة",
      relatedTitle: "خدمات أخرى قد تعجبك",
      notFoundTitle: "الخدمة غير موجودة",
      notFoundHint: "هذه الخدمة لم تعد متوفرة.",
      whyKicker: "لماذا كالما تريب",
      whyTitle: "مصمم من أجل راحة بالك",
      why: [
        { title: "سلامة مضمونة", desc: "مركبات مصانة، تأمين كامل، سائقون معتمدون." },
        { title: "دائمًا في الموعد", desc: "تتبع GPS مباشر. جدولك هو جدولنا." },
        { title: "جودة متميزة", desc: "شركاء مختارون بعناية، معايير ثابتة، بدون مفاجآت." },
        {
          title: "دعم بشري على مدار الساعة",
          desc: "أخصائيون يتحدثون الإنجليزية والفرنسية والعربية.",
        },
      ],
      contactKicker: "تواصل معنا",
      contactTitle1: "غير متأكد مما تحتاجه؟",
      contactTitle2: "لنجد الحل معًا.",
      contactFeatures: [
        "سائقون محترفون معتمدون",
        "أسطول حديث ومكيّف",
        "تأكيد حجز فوري",
        "دعم متعدد اللغات على مدار الساعة",
      ],
      contactCta: "اطلب عرض سعر",
      responseTime: "مدة الرد",
      emailLabel: "البريد الإلكتروني",
      phoneLabel: "الهاتف",
      ctaKicker: "جاهزون عندما تكون جاهزًا",
      ctaTitle: "رحلتك القادمة تبدأ هنا.",
      ctaSub: "انضم إلى مئات المسافرين الذين يستكشفون تونس براحة بال تامة.",
      ctaBtn1: "تواصل معنا",
      ctaBtn2: "احجز الآن",
      modalTitle: "أوشكنا على الانتهاء!",
      modalSub: "سجّل الدخول إلى حسابك لتأكيد حجزك.",
      modalLogin: "تسجيل الدخول والحجز",
      modalClose: "إغلاق",
    },

    mkt: {
      eyebrow: "السوق · تونس",
      heroTitle: "الحرف التونسية، تصلك أينما كنت",
      heroSub:
        "هدايا تذكارية وأساسيات سفر مُنتقاة بعناية — ملابس وإكسسوارات وقطع حرفية مستوحاة من تونس.",
      loading: "جاري التحميل...",
      productWord: "منتج",
      productsWord: "منتجات",
      sortNewest: "الأحدث",
      sortPriceAsc: "السعر تصاعديًا",
      sortPriceDesc: "السعر تنازليًا",
      sortNameAz: "الاسم أ-ي",
      emptyTitle: "لم يتم العثور على منتجات",
      emptySub: "جرّب بحثًا أو فئة مختلفة",
      searchPh: "البحث عن منتج...",
      clearSearch: "مسح البحث",
      allLabel: "الكل",
      myOrders: "طلباتي",
      wishlistLabel: "المفضلة",
      cartLabel: "السلة",
      outOfStock: "غير متوفر",
      lowStock: "متبقٍ {n} فقط",
      addToWishlist: "إضافة إلى المفضلة",
      removeFromWishlist: "إزالة من المفضلة",
      addToCart: "أضف إلى السلة",
    },

    exp: {
      eyebrow: "استكشف · تونس",
      heroTitle: "من الشمال الأزرق إلى الصحراء الذهبية",
      heroSub:
        "ست مناطق، ألف وجه. اختر وجهة واكتشف الأماكن التي تجسدها — قريبًا مع رحلات من وكالاتنا ومرشدينا الشركاء.",
      searchPh: "إلى أين تريد الذهاب؟",
      catAll: "الكل",
      catFood: "أكل ومشروبات",
      catSights: "معالم",
      catActivities: "أنشطة",
      catHidden: "كنوز خفية",
      catEvents: "فعاليات",
      catMuseums: "متاحف",
      catHotels: "إقامات",
      allCities: "كل المدن",
      budgetLabel: "الميزانية",
      useLocation: "استخدم موقعي",
      listLabel: "قائمة",
      mapLabel: "خريطة",
      filtersLabel: "الفلاتر",
      clearAll: "مسح الكل",
      sortLabel: "ترتيب",
      sortPopularity: "الأكثر شعبية",
      sortRating: "التقييم",
      sortReviews: "الآراء",
      emptyTitle: "لم نجد كنوزًا...",
      emptySub: "لم نجد ما يطابق معاييرك بالضبط. جرّب توسيع بحثك أو استكشاف فئة مختلفة.",
      resetFilters: "إعادة تعيين كل الفلاتر",
    },

    abt: {
      eyebrow: "من نحن · كالما تريب",
      heroTitle: "السفر، مُصمَّم مع التونسيين",
      heroSub:
        "نربط المسافرين بالمرشدين والحرفيين والمضيفين المحليين — من أجل سياحة أكثر عدلاً وصدقًا وهدوءًا.",
      statLabels: ["تأسست في الحمامات", "عملاء راضون", "شركاء محليون", "رضا العملاء"],
      storyKicker: "قصتنا",
      storyTitle: "وُلدت في الحمامات",
      storyP1:
        "تأسست كالما تريب في الحمامات، تونس، سنة 2026، انطلاقًا من قناعة بسيطة: السفر يجب أن يعني راحة البال. اسمنا يعكس هذه الرؤية — يتيح لك اكتشاف جوهر وجهتك حتى قبل أن تطأها قدماك.",
      storyP2:
        "نحن أكثر بكثير من مجرد منصة سياحية وسوق إلكتروني. نربطكم بخدمات سفر متميزة عبر شركائنا المحليين الموثوقين، بينما يضمن فريقنا متابعة مستمرة واستباقية حتى يسير كل تفصيل تمامًا كما هو مخطط له.",
      storyItems: [
        "خدمات متميزة عبر شركاء محليين موثوقين",
        "متابعة استباقية لكل حجز",
        "رضاكم هو أولويتنا",
      ],
      promiseKicker: "التزامنا",
      promiseTitle1: "وعد",
      promiseTitleEm: "كالما",
      promiseP1:
        "مع كالما تريب، سافر أخيرًا وأنت مرتاح البال. انسَ المفاوضات التي لا تنتهي والحجوزات المتفرقة — نحن مركزكم الموحد والموثوق لتأمين جميع خدماتكم فورًا.",
      promiseP2:
        "رضاكم هو أولويتنا. نجمع آراءكم بفعالية ونقدم دعمًا فوريًا لضمان تجربة سلسة وخالية من القلق من البداية إلى النهاية.",
      promiseQuote: "مركز واحد. كل خدماتك. صفر توتر.",
      offerKicker: "ماذا نقدم",
      offerTitle: "كل ما تحتاجه، متكفَّل به",
      offerings: [
        {
          num: "01",
          title: "تخطيط بلا توتر",
          desc: "نتكفل بكل التفاصيل اللوجستية لرحلتك، لتستمتع بإقامتك بدلاً من إدارتها.",
        },
        {
          num: "02",
          title: "مرافقة شاملة",
          desc: "من لحظة حجزك حتى عودتك، يضمن فريقنا متابعة كاملة ومساعدة موثوقة في كل خطوة من رحلتك.",
        },
        {
          num: "03",
          title: "أسعار محلية",
          desc: "عش التجربة التونسية الحقيقية، بدون أسعار سياحية مبالغ فيها. قيمة أصيلة، في كل مرة.",
        },
        {
          num: "04",
          title: "تكفل فوري",
          desc: "نعطي الأولوية لراحتك وطمأنينتك بخدمة سريعة ومتجاوبة، قبل رحلتك وأثناءها.",
        },
      ],
      teamKicker: "الفريق",
      teamTitle: "الوجوه وراء كالما تريب",
      specialistsKicker: "فريقنا",
      specialistsTitle: "أخصائيو الوجهات",
      specialistsSub:
        "أخصائيونا المخصصون متاحون دائمًا لإرشادكم شخصيًا — سواء لسؤال حول رحلتكم أو مجرد فضول حول الحياة في تونس.",
      spokenFluently: "يُتحدث بطلاقة",
      languages: [
        { code: "EN", lang: "الإنجليزية" },
        { code: "FR", lang: "الفرنسية" },
        { code: "AR", lang: "العربية" },
      ],
      specialistsBottom:
        "إلى جانب الحجوزات البسيطة، يساعدكم أخصائيو الوجهات لدينا على الاستفادة القصوى من تونس — كنوز خفية، عناوين محلية، نصائح ثقافية ولوجستيك السفر. اعتبرونا رابطكم الشخصي بتونس الحقيقية.",
      ctaTitle1: "مستعد للسفر براحة بال",
      ctaTitleEm: "تامة",
      ctaSub:
        "انضم إلى مئات المسافرين الراضين واكتشف تونس — بدون توتر، بمرافقة كاملة، وبأسعار محلية.",
      ctaBtn: "اكتشف خدماتنا",
    },

    cnt: {
      breadcrumbHome: "الرئيسية",
      eyebrow: "اتصل بنا",
      heroTitle1: "تحدث مع",
      heroTitleEm: "إنسان",
      heroSub:
        "يجيب فريقنا على جميع أسئلتكم ويرافقكم في مشاريع سفركم — بالفرنسية والإنجليزية والعربية.",
      infoPhoneTitle: "الهاتف",
      infoPhoneDesc: "متاح على مدار الساعة",
      infoEmailTitle: "البريد الإلكتروني",
      infoEmailDesc: "رد خلال 24 ساعة",
      infoAddressTitle: "العنوان",
      infoAddressDesc: "زوروا مكتبنا",
      infoHoursTitle: "أوقات العمل",
      infoHoursDesc: "خدمة العملاء",
      infoHours1: "الإثنين-الجمعة: 8:00 - 20:00",
      infoHours2: "السبت-الأحد: 9:00 - 18:00",
      formTitle: "أرسل لنا رسالة",
      formSub: "املأ النموذج أدناه، سيرد عليك فريقنا خلال 24 ساعة.",
      labelName: "الاسم الكامل",
      phName: "اسمك",
      labelEmail: "البريد الإلكتروني",
      phEmail: "بريدك@الإلكتروني.com",
      labelPhone: "الهاتف",
      labelSubject: "الموضوع",
      subjSelect: "اختر موضوعًا",
      subjReservation: "حجز",
      subjInfo: "طلب معلومات",
      subjComplaint: "شكوى",
      subjQuote: "طلب عرض سعر",
      subjOther: "أخرى",
      labelMessage: "الرسالة",
      phMessage: "رسالتك...",
      sendBtn: "إرسال الرسالة",
      sentTitle: "تم إرسال الرسالة!",
      sentSub: "شكرًا لتواصلكم معنا. سيرد فريقنا عليكم قريبًا جدًا.",
      mapAddress: "شارع الحبيب بورقيبة، الحمامات",
      openInMaps: "فتح في خرائط جوجل",
      practicalTitle: "معلومات عملية",
      practicalItems: [
        "موقف سيارات مجاني متاح للزوار",
        "مكتب مهيأ لذوي الحركة المحدودة",
        "خدمة العملاء متاحة بالفرنسية والعربية والإنجليزية",
        "الدفع نقدًا وبالبطاقة مقبول",
        "حجز آمن عبر الإنترنت على مدار الساعة",
        "دعم هاتفي متاح 24 ساعة، 7 أيام في الأسبوع",
      ],
      helpTitle: "مساعدة فورية",
      avgResponseLabel: "متوسط مدة الرد",
      avgResponseValue: "أقل من 30 دقيقة",
      satisfactionLabel: "الرضا",
      callBtn: "اتصل",
      whatsappBtn: "واتساب",
      followUs: "تابعنا",
      faqKicker: "الأسئلة الشائعة",
      faqTitle: "أسئلة متكررة",
      faqSub: "كل ما تحتاج معرفته قبل حجز تجربتك القادمة.",
      faqNoAnswer: "لم تجد إجابة؟",
      faqContactSupport: "تواصل مع دعمنا",
      ctaKicker: "متاحون دائمًا",
      ctaTitle: "بحاجة لمساعدة فورية؟",
      ctaSub: "فريقنا متاح على مدار الساعة للإجابة على أسئلتكم وتنظيم مغامرتكم التونسية القادمة.",
      ctaCallBtn: "اتصل الآن",
      ctaWhatsappBtn: "واتساب",
    },

    dash: {
      navBookings: "حجوزاتي",
      navNew: "حجز جديد",
      navPayments: "المدفوعات",
      navReviews: "التقييمات",
      navProfile: "الملف الشخصي",
      backToSite: "العودة إلى الموقع",
      signOut: "تسجيل الخروج",
      upcomingExpSingular: "تجربة قادمة",
      upcomingExpPlural: "تجارب قادمة",
      actionRequiredSingular: "إجراء مطلوب",
      actionRequiredPlural: "إجراءات مطلوبة",
      toReviewSingular: "بانتظار التقييم",
      toReviewPlural: "بانتظار التقييم",

      paymentsTitle: "المدفوعات",
      paymentsSub: "متابعة مدفوعات كل حجوزاتك، محدّثة من طرف فريقنا.",
      paymentsEmpty: "لا توجد مدفوعات لعرضها بعد.",

      reviewsTitle: "تقييماتك",
      reviewsSub: "فقط العملاء الذين حجزوا فعلاً خدمة يمكنهم ترك تقييم — وهذا ما يجعله موثوقًا.",
      reviewsEmpty: "ليس لديك بعد تجربة لتقييمها.",
      reviewsToRateTitle: "بانتظار التقييم",
      reviewsYoursTitle: "تقييماتك المرسلة",
      reviewsPendingApproval: "قيد المراجعة",
      leaveReviewBtn: "ترك تقييم",

      profileTitle: "الملف الشخصي",
      profileSub: "معلوماتك الشخصية.",
      profileNameLabel: "الاسم الكامل",
      profileEmailLabel: "البريد الإلكتروني",
      profilePhoneLabel: "الهاتف",
      profilePhonePh: "+216 00 000 000",
      profileSaveBtn: "حفظ",
      profileSavedMsg: "تم تحديث الملف الشخصي.",
      profileErrorMsg: "فشل التحديث. حاول مرة أخرى.",

      welcomeBack: "مرحبًا بعودتك",
      nextTripSub: "بانتظارك.",
      emptyHeaderSub: "مغامرتك القادمة تبدأ هنا.",

      yourNextExperience: "تجربتك القادمة",
      reservationRef: "الحجز",
      travelersCount: "مسافرين",
      viewTrip: "عرض رحلتك",

      paymentPaid: "تم الدفع",
      paymentPending: "الدفع قيد الانتظار",
      paymentRefunded: "تم الاسترداد",

      statusConfirmed: "مؤكدة",
      statusPending: "قيد الانتظار",
      statusCancelled: "ملغاة",

      journeyTitle: "مسار رحلتك",
      stepReceived: "تم استلام الحجز",
      stepConfirmed: "مؤكد",
      stepPrepare: "جهّز نفسك",
      stepEnjoy: "استمتع بتجربتك",
      stepShare: "شارك تجربتك",

      glanceTitle: "رحلتك بنظرة سريعة",
      glanceDatesLabel: "التاريخ",
      glanceDatesSub: "تواريخ تجربتك",
      glanceTravelersSub: "مشمول في حجزك",
      glancePaymentSub: "أكمل الدفع قبل المغادرة",
      glancePaymentSubPaid: "شكرًا، تم الدفع بالكامل",
      glanceDestinationLabel: "الوجهة",

      beforeTitle: "قبل الرحيل",
      beforeSubSoon: "مغامرتك تقترب قريبًا.",
      beforeSubGeneral: "كل ما تحتاج معرفته قبل اليوم الموعود.",
      packingTitle: "ماذا تحضر معك",
      packingDesc: "نصائح عملية للاستعداد لتجربتك.",
      helpCardTitle: "بحاجة للمساعدة؟",
      helpCardDesc: "تواصل مع فريقنا بخصوص حجزك.",
      fullDetailsTitle: "عرض كل تفاصيل الحجز",
      fullDetailsDesc: "اطّلع على كل معلومات تجربتك.",

      alsoLikeTitle: "قد يعجبك أيضًا",
      alsoLikeSub: "أكمل تجربتك مع خدمات كالما تريب الأخرى",

      otherBookingsTitle: "حجوزاتك الأخرى",
      upcomingTitle: "القادمة",
      historyTitle: "السجل",
      emptyTitle: "مغامرتك القادمة تبدأ هنا",
      emptySub: "لا توجد حجوزات بعد — أنشئ واحدة لتظهر هنا.",
      createBooking: "إنشاء حجز",
      newBookingTitle: "حجز جديد",
      newBookingSub: "املأ النموذج لحجز رحلتك القادمة",

      needHelpTitle: "بحاجة للمساعدة؟",
      needHelpSub: "فريقنا متاح على مدار الساعة",
      callBtn: "اتصل",
      whatsappBtn: "واتساب",
    },
    pnr: {
      pageTitle: "كن شريكاً في CalmaTrip",
      pageSub: "بضع خطوات للانضمام إلى شبكة شركائنا.",
      savedIndicator: "تم الحفظ",
      savingIndicator: "جارٍ الحفظ…",
      googleBtn: "المتابعة عبر Google",

      stepAccount: "الحساب",
      stepPartnerType: "نوع الشريك",
      stepBusiness: "النشاط التجاري",
      stepInterests: "مجالات الاهتمام",
      stepPresence: "الحضور الرقمي",
      stepReview: "المراجعة",
      stepWord: "خطوة",
      ofWord: "من",

      accountTitle: "أنشئ حسابك",
      accountSub: "ابدأ بإنشاء حساب شركاء CalmaTrip الخاص بك.",
      accountNameLabel: "الاسم الكامل",
      accountEmailLabel: "البريد الإلكتروني",
      accountPhoneLabel: "الهاتف",
      accountPasswordLabel: "كلمة المرور",
      accountConfirmLabel: "تأكيد كلمة المرور",
      accountSubmitBtn: "إنشاء حسابي",
      accountHaveAccount: "لديك حساب بالفعل؟",
      accountLoginLink: "تسجيل الدخول",

      typeTitle: "ما نوع الشريك الذي تمثله؟",
      typeSub: "هذا الاختيار يحدد بقية خطوات التسجيل.",
      typeArtisanLabel: "حرفي",
      typeArtisanTagline: "محترف محلي",
      typeArtisanDesc: "قدّم خدماتك وخبرتك لمسافري CalmaTrip.",
      typeAgencyLabel: "وكالة",
      typeAgencyTagline: "محترف سياحي",
      typeAgencyDesc: "ابنِ تجارب وعروض سفر لعملائك مع CalmaTrip.",

      bizTitle: "معلومات نشاطك التجاري",
      bizSub: "تتيح لنا هذه المعلومات التحقق من نشاطك وعرضه.",
      bizOrgLabel: "اسم المؤسسة / النشاط",
      bizOrgPh: "مثال: رحلات الصحراء",
      bizFirstNameLabel: "الاسم الأول لجهة الاتصال",
      bizLastNameLabel: "اسم العائلة لجهة الاتصال",
      bizPhoneLabel: "الهاتف",
      bizCountryLabel: "الدولة",
      bizCountryPh: "ابحث عن دولة…",
      bizCityLabel: "المدينة",
      bizCityOtherLabel: "مدينة أخرى",
      bizCityOtherPh: "حدد مدينتك",
      bizCurrencyLabel: "العملة",
      bizWebsiteLabel: "الموقع الإلكتروني",
      bizWebsitePh: "https://example.com",
      bizWebsiteOptional: "اختياري",

      interestsArtisanTitle: "ما الخدمات التي تعمل بها؟",
      interestsAgencyTitle: "ما الذي ترغب في تقديمه أو الترويج له مع CalmaTrip؟",
      interestsSub: "اختر كل الفئات التي تنطبق عليك.",
      interestsErrorRequired: "يرجى اختيار فئة واحدة على الأقل.",

      presenceTitle: "حضورك الرقمي",
      presenceSub: "اختر المنصات التي يمكن إيجادك فيها (اختياري).",
      presenceUrlLabel: "الرابط / المعرّف",
      presenceNone: "لم يتم اختيار أي منصة بعد.",

      reviewTitle: "راجع طلبك",
      reviewSub: "راجع المعلومات قبل إرسال طلبك إلى فريقنا.",
      reviewSectionAccount: "الحساب",
      reviewSectionPartner: "نوع الشريك",
      reviewSectionBusiness: "النشاط التجاري",
      reviewSectionInterests: "مجالات الاهتمام",
      reviewSectionPresence: "الحضور الرقمي",
      reviewEditBtn: "تعديل",
      reviewReadyTitle: "هل أنت جاهز لإرسال طلبك؟",
      reviewReadySub: "سيراجع فريقنا ملف شراكتك ويتواصل معك قريباً.",
      reviewSubmitBtn: "إرسال الطلب",
      reviewSubmitting: "جارٍ الإرسال…",

      successTitle: "تم إرسال طلبك",
      successSub: "شكراً لانضمامك إلى CalmaTrip. سيراجع فريقنا ملف شراكتك ويتواصل معك قريباً.",
      successBackBtn: "العودة إلى الرئيسية",

      lockedSubmittedTitle: "الطلب قيد المراجعة",
      lockedSubmittedSub: "تم إرسال طلبك بنجاح. سيتواصل معك فريقنا قريباً.",
      lockedUnderReviewTitle: "الطلب قيد المراجعة",
      lockedUnderReviewSub: "يقوم فريقنا حالياً بمراجعة ملف شراكتك.",
      lockedApprovedTitle: "تم قبول الطلب",
      lockedApprovedSub: "حساب الشراكة الخاص بك نشط الآن. أهلاً بك في CalmaTrip!",
      lockedRejectedTitle: "لم يتم قبول الطلب",
      lockedRejectedSub: "لم تتم الموافقة على طلبك هذه المرة.",
      lockedSuspendedTitle: "الحساب موقوف",
      lockedSuspendedSub: "حساب الشراكة الخاص بك موقوف حالياً.",
      goToDashboardBtn: "الذهاب إلى مساحتي",

      backBtn: "السابق",
      continueBtn: "متابعة",
      requiredError: "هذا الحقل إلزامي.",
      invalidUrlError: "يرجى إدخال رابط صالح (يبدأ بـ https://).",

      catTransport: "النقل",
      catExcursion: "الرحلات",
      catActivity: "الأنشطة",
      catFoodDrink: "المطاعم والمقاهي",
      catSight: "المعالم",
      catHiddenGem: "كنوز خفية",
      catHotel: "الإقامة",

      platformWebsite: "الموقع الإلكتروني",
      platformInstagram: "إنستغرام",
      platformFacebook: "فيسبوك",
      platformTiktok: "تيك توك",
      platformYoutube: "يوتيوب",
      platformLinkedin: "لينكد إن",
      platformOther: "أخرى",
    },

    community: {
      eyebrow: "المجتمع",
      heroTitle: "شارك تجربتك مع Calma Trip",
      heroSub:
        "أخبرنا عن رحلتك، شاركنا رأيك، وتواصل مع مسافرين آخرين — وانضم إلى مجموعتنا على فيسبوك حتى لا يفوتك شيء.",
      fbTitle: "انضم إلى مجموعتنا على فيسبوك",
      fbDesc: "تحدث مع مجتمع Calma Trip، اطرح أسئلتك، وشارك صورك.",
      fbJoin: "انضم",
      loginPrompt: "سجّل الدخول لمشاركة تجربتك.",
      loginCta: "تسجيل الدخول",
      placeholder: "أخبرنا عن تجربتك مع Calma Trip...",
      charCount: "{n} / 2000 حرف",
      photoLabel: "صورة",
      errorMin: "يجب أن تحتوي رسالتك على 10 أحرف على الأقل.",
      successMsg: "شكرًا لك! سيتم نشر مشاركتك بعد مراجعة فريقنا.",
      shareCta: "نشر",
      sharing: "جارٍ النشر…",
      emptyTitle: "لا توجد مشاركات حتى الآن. كن أول من يشارك!",
      deleteLabel: "حذف",
      deleteConfirm: "حذف هذه المشاركة؟",
      today: "اليوم",
      yesterday: "أمس",
      daysAgo: "منذ {n} أيام",
    },
    pln: {
      eyebrow: "كن شريكًا",
      heroTitle: "أحيِ تونس مع Calma Trip",
      heroSub:
        "سواء كنت حرفيًا أو وكالة، اختر الملف المناسب لك لمعرفة كيفية الانضمام إلى شبكة شركائنا.",
      artisanLabel: "حرفي",
      artisanDesc: "بيع إبداعاتك — الفخار، النسيج، الحلي، المنتجات المحلية — على متجر Calma Trip.",
      artisanPoints: ["عمولة بسيطة وشفافة", "ظهور أمام المسافرين", "إدارة بنقرات قليلة"],
      agencyLabel: "وكالة",
      agencyDesc:
        "نشر أنشطتك ورحلاتك وإقاماتك على Explore، تمامًا كما في GetYourGuide أو TripAdvisor.",
      agencyPoints: ["ظهور على Explore", "تتبع واضح للعمولة", "نشر سريع"],
      learnMore: "المزيد",
    },
    home: {
      heroTitle: "رحلات وتنقلات وأنشطة في تونس",
      heroSub: "احجز مباشرة مع فريق محلي مقيم في الحمامات.",
      heroCaption: "الميناء القديم، بنزرت",
      searchLabel: "ابحث عن وجهة أو نشاط",
      searchPlaceholder: "إلى أين؟ جربة، الصحراء، سيدي بوسعيد…",
      searchBtn: "بحث",
      chipsLabel: "الفئات",
      chips: {
        tours: "رحلات وتنقلات",
        sights: "معالم ومواقع",
        activities: "أنشطة",
        food: "مقاهٍ ومأكولات",
        hiddenGems: "أماكن خفية",
        museums: "متاحف",
        events: "فعاليات",
      },
      trust: [
        { title: "إلغاء مجاني", desc: "استرداد كامل حتى 24 ساعة قبل الموعد" },
        { title: "أسعار محلية", desc: "احجز مباشرة، بلا وسيط" },
        { title: "مرشدون محليون", desc: "أناس يعرفون كل زقاق" },
        { title: "دعم على مدار الساعة", desc: "بالعربية والفرنسية والإنجليزية" },
      ],
      toursHeading: "رحلات وتنقلات",
      localHeading: "من شركائنا المحليين",
      destinationsHeading: "إلى أين تذهب في تونس",
      destinations: ["سيدي بوسعيد", "قرطاج", "القيروان", "الجم", "توزر", "دوز"],
      shopHeading: "الصناعات التقليدية التونسية",
      reviewsHeading: "ماذا يقول المسافرون",
      reviewsCount: "{n} تقييم",
      seeAll: "عرض الكل",
      prev: "السابق",
      next: "التالي",
      from: "ابتداءً من",
      priceOnRequest: "السعر عند الطلب",
      plannerHeading: "مجموعة، مناسبة أو رحلة حسب الطلب؟",
      plannerSub: "أخبرنا بما تفكر فيه، وسنخطط معك البرنامج والتنقلات والحجوزات.",
      plannerContact: "اطلب عرض سعر",
      howHeading: "كيف يعمل الأمر",
      howSteps: [
        {
          title: "اختر",
          desc: "تصفّح الرحلات والتنقلات والأنشطة، وصفِّ حسب الوجهة والتاريخ وعدد المسافرين.",
        },
        {
          title: "احجز مباشرة",
          desc: "أكّد بنقرات قليلة وبأسعار محلية دون وسيط. إلغاء مجاني حتى 24 ساعة قبل الموعد.",
        },
        {
          title: "سافر بلا قلق",
          desc: "يرافقك فريقنا المحلي قبل الرحلة وأثناءها بالفرنسية والإنجليزية والعربية.",
        },
      ],
      guidesHeading: "أدلة عملية",
      faqHeading: "الأسئلة الشائعة",
      faqSub: "الأساسيات التي يجب معرفتها قبل الحجز.",
      faqMore: "عرض كل الأسئلة",
      partnerHeading: "هل تقدّم أنشطة في تونس؟",
      partnerSub:
        "حرفيون ووكالات وفنادق: انضمّوا إلى Calma Trip واعرضوا عروضكم على مسافرين من العالم كله.",
      partnerCta: "كن شريكًا",
    },
    layout: {
      login: "تسجيل الدخول",
      register: "إنشاء حساب",
      logout: "تسجيل الخروج",
      account: "الحساب",
      language: "اللغة",
      openMenu: "فتح القائمة",
      closeMenu: "إغلاق القائمة",
      menu: "القائمة",
      mySpace: "حسابي",
      adminSpace: "فضاء الإدارة",
      partnerSpace: "فضاء الشريك",
      footContact: "اتصل بنا",
      footNewsletter: "النشرة الإخبارية",
      privacy: "الخصوصية",
      terms: "شروط البيع",
      legalNotice: "البيانات القانونية",
      footBottomNote: "دفع آمن · دعم على مدار الساعة",
    },
    search: {
      destinationLabel: "الوجهة",
      serviceLabel: "الخدمة",
      allServices: "كل الخدمات",
      dateLabel: "التاريخ",
      dateFlexible: "تاريخ مرن",
      clearDate: "مسح التاريخ",
      participantsLabel: "المشاركون",
      participantOne: "مشارك واحد",
      participantMany: "{n} مشاركين",
      adults: "البالغون",
      adultsHint: "18 سنة فما فوق",
      children: "الأطفال",
      childrenHint: "من 0 إلى 17 سنة",
      fewer: "إنقاص: {who}",
      more: "إضافة: {who}",
      today: "اليوم",
      tomorrow: "غدًا",
      nextWeekend: "عطلة نهاية الأسبوع القادمة",
      prevMonth: "الشهر السابق",
      nextMonth: "الشهر التالي",
      groupHint: "أكثر من {n} أشخاص؟",
      groupHintLink: "اطلب عرض سعر",
      resultsIn: "أنشطة في {d}",
      resultsTitle: "نتائج «{q}»",
      resultsCount: "{n} نتيجة",
      noResultsTitle: "لا يوجد ما يطابق بحثك حاليًا",
      noResultsSub: "جرّب «كل الخدمات»، أو تواصل معنا: ننظّم أيضًا رحلات حسب الطلب.",
      emptyTitle: "إلى أين تذهب؟",
      emptySub: "اختر وجهة وخدمة لرؤية أنشطتنا.",
    },
    tickerMessages: [
      "☀️ صيف 2026 — احجز الآن",
      "رد مضمون في أقل من 30 دقيقة",
      "خصم 15% على الحجوزات المبكرة",
      "مرشدون محليون · أسعار عادلة · بدون توتر",
      "دعم على مدار الساعة بالفرنسية والإنجليزية والعربية",
    ],
  },
};

interface CalmaLangContextValue {
  lang: CalmaLang;
  setLang: (lang: CalmaLang) => void;
  t: CalmaDict;
  dir: "ltr" | "rtl";
}

const CalmaLangContext = createContext<CalmaLangContextValue | null>(null);

const STORAGE_KEY = "calma-lang";

export function CalmaLangProvider({
  children,
  defaultLang = "fr",
}: {
  children: React.ReactNode;
  defaultLang?: CalmaLang;
}) {
  const [lang, setLangState] = useState<CalmaLang>(defaultLang);

  // Hydrate from the previously chosen language on mount (client-only, avoids SSR mismatch).
  React.useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY) as CalmaLang | null;
    if (stored && stored !== lang && CALMA_DICT[stored]) {
      setLangState(stored);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const setLang = (next: CalmaLang) => {
    setLangState(next);
    window.localStorage.setItem(STORAGE_KEY, next);
  };

  const dir: "ltr" | "rtl" = RTL_LANGS.includes(lang) ? "rtl" : "ltr";

  React.useEffect(() => {
    document.documentElement.dir = dir;
    document.documentElement.lang = lang;
  }, [lang, dir]);

  const value = useMemo<CalmaLangContextValue>(
    () => ({ lang, setLang, t: CALMA_DICT[lang], dir }),
    [lang, dir],
  );
  return <CalmaLangContext.Provider value={value}>{children}</CalmaLangContext.Provider>;
}

export function useCalmaLang() {
  const ctx = useContext(CalmaLangContext);
  if (!ctx) throw new Error("useCalmaLang must be used within a CalmaLangProvider");
  return ctx;
}

export function useOptionalCalmaLang() {
  return useContext(CalmaLangContext);
}
