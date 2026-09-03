"use client";

import Link from "next/link";
import { ArrowRight, Store, Compass, Check } from "lucide-react";
import { CalmaLangProvider } from "@/lib/calma/i18n";
import CalmaHeader from "@/components/calma/CalmaHeader";
import CalmaFooter from "@/components/calma/CalmaFooter";

const PROFILES = [
  {
    href: "/partner/artisan",
    icon: Store,
    accent: "#5E8B63",
    label: "Artisan",
    desc: "Vendez vos créations — poterie, textile, bijoux, produits locaux — sur la Marketplace Calma Trip.",
    points: [
      "Commission simple et transparente",
      "Visibilité auprès des voyageurs",
      "Gestion en quelques clics",
    ],
  },
  {
    href: "/partner/agency",
    icon: Compass,
    accent: "#4C7A92",
    label: "Agence",
    desc: "Publiez vos activités, excursions et hébergements sur Explore, comme sur GetYourGuide ou TripAdvisor.",
    points: ["Visibilité sur Explore", "Suivi de commission clair", "Publication rapide"],
  },
];

function PartnerLandingContent() {
  return (
    <>
      <CalmaHeader active="contact" />
      <main className="min-h-screen bg-calma-cream font-hanken">
        <section className="bg-calma-olive px-6 pb-20 pt-20 text-center sm:px-10">
          <div className="mx-auto max-w-[640px]">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/[.08] px-4 py-2 text-[11px] font-bold uppercase tracking-[.18em] text-calma-cream backdrop-blur-md">
              Devenir partenaire
            </div>
            <h1 className="mb-4 text-balance font-fraunces text-[clamp(30px,4vw,44px)] font-normal leading-[1.1] tracking-[-0.02em] text-calma-cream">
              Faites vivre la Tunisie avec Calma Trip
            </h1>
            <p className="mx-auto max-w-[520px] text-pretty text-[16px] leading-[1.65] text-white/80">
              Que vous soyez artisan ou agence, choisissez le profil qui vous correspond pour
              découvrir comment rejoindre notre réseau de partenaires.
            </p>
          </div>
        </section>

        <section className="mx-auto -mt-10 max-w-[920px] px-6 pb-20 sm:px-10">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            {PROFILES.map((p) => (
              <div
                key={p.href}
                className="flex flex-col rounded-calma-block border border-calma-olive/10 bg-white p-8"
                style={{ boxShadow: "0 22px 50px -22px rgba(21,36,46,.3)" }}
              >
                <div
                  className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl"
                  style={{ background: `${p.accent}18`, color: p.accent }}
                >
                  <p.icon size={26} />
                </div>
                <h2 className="mb-2 font-fraunces text-2xl font-normal text-calma-ink">
                  {p.label}
                </h2>
                <p className="mb-5 text-sm leading-relaxed text-calma-taupe">{p.desc}</p>
                <ul className="mb-8 space-y-2.5">
                  {p.points.map((pt) => (
                    <li key={pt} className="flex items-start gap-2 text-sm text-calma-ink">
                      <Check size={16} className="mt-0.5 shrink-0" style={{ color: p.accent }} />
                      {pt}
                    </li>
                  ))}
                </ul>
                <Link
                  href={p.href}
                  className="group mt-auto inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-[15px] font-semibold text-white no-underline transition-all duration-300 hover:-translate-y-0.5"
                  style={{ background: p.accent }}
                >
                  En savoir plus
                  <ArrowRight
                    size={16}
                    className="transition-transform duration-300 group-hover:translate-x-1"
                  />
                </Link>
              </div>
            ))}
          </div>
        </section>
      </main>
      <CalmaFooter />
    </>
  );
}

export default function PartnerLandingPage() {
  return (
    <CalmaLangProvider>
      <PartnerLandingContent />
    </CalmaLangProvider>
  );
}
