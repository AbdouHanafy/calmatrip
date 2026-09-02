"use client";
import {
  CheckCircle,
  Shield,
  ChevronRight,
  Quote,
  Smile,
  Award,
  Zap,
  MessageCircle,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { CalmaLangProvider, useCalmaLang } from "@/lib/calma/i18n";
import CalmaHeader from "@/components/calma/CalmaHeader";
import CalmaFooter from "@/components/calma/CalmaFooter";
import AnimatedStat from "@/components/calma/AnimatedStat";
import ReviewsSection from "@/components/home/ReviewsSection";

interface TeamMember {
  id: number;
  name: string;
  role: string;
  experience: string;
  icon: string;
}

interface Review {
  id: number;
  name: string;
  avatar: string | null;
  rating: number;
  comment: string;
  service: string | null;
  createdAt: string;
}

/* Motif zellige réutilisable */
function ZelligePattern({
  id,
  stroke = "#ffffff",
  opacity = 0.06,
}: {
  id: string;
  stroke?: string;
  opacity?: number;
}) {
  return (
    <svg className="absolute inset-0 h-full w-full" style={{ opacity }} aria-hidden="true">
      <defs>
        <pattern id={id} width="56" height="56" patternUnits="userSpaceOnUse">
          <path
            d="M28 2 L34 22 L54 28 L34 34 L28 54 L22 34 L2 28 L22 22 Z"
            fill="none"
            stroke={stroke}
            strokeWidth="1.2"
          />
          <circle cx="28" cy="28" r="4" fill="none" stroke={stroke} strokeWidth="1" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#${id})`} />
    </svg>
  );
}

const OFFER_ICONS = [Smile, Shield, Award, Zap];

function AboutContent({ team, reviews }: { team: TeamMember[]; reviews: Review[] }) {
  const { t } = useCalmaLang();

  const statValues = ["2026", "500+", "50+", "98%"];
  const stats = t.abt.statLabels.map((label, i) => ({ value: statValues[i], label }));

  const offerings = t.abt.offerings.map((o, i) => ({ ...o, icon: OFFER_ICONS[i] }));

  const languages = t.abt.languages;

  return (
    <>
      <CalmaHeader active="about" />
      <div className="min-h-screen bg-calma-sand font-hanken">
        {/* ── Hero — cinematic, photo-backed, sand texture ── */}
        <section className="relative flex min-h-[320px] items-center justify-center overflow-hidden px-6 py-16 text-center sm:px-10">
          <Image
            src={encodeURI("/images/explore/El Jem Amphitheatre.jpg")}
            alt="El Jem, Tunisie"
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
          <div
            className="absolute inset-0"
            style={{
              background: "rgba(42,38,34,.66)",
            }}
          />
          <div
            className="pointer-events-none absolute inset-0 opacity-[.07]"
            style={{
              backgroundImage: "transparent",
            }}
          />
          <div className="relative z-[2] mx-auto max-w-[640px]">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/[.08] px-4 py-2 text-[11px] font-bold uppercase tracking-[.18em] text-calma-cream backdrop-blur-md">
              <span className="h-1.5 w-1.5 rounded-full bg-calma-terracotta" />
              {t.abt.eyebrow}
            </div>
            <h1 className="mb-4 text-balance font-fraunces text-[clamp(32px,4.4vw,48px)] font-normal leading-[1.05] tracking-[-0.02em] text-calma-cream">
              {t.abt.heroTitle}
            </h1>
            <p className="mx-auto max-w-[520px] text-pretty text-[16px] leading-[1.65] text-white/80">
              {t.abt.heroSub}
            </p>
          </div>
        </section>

        {/* Stats — chiffres Fraunces animés, séparés par des filets */}
        <section className="border-b border-calma-olive/10 bg-calma-cream py-12">
          <div className="mx-auto grid max-w-4xl grid-cols-2 gap-y-10 px-4 md:grid-cols-4">
            {stats.map((stat, index) => (
              <div
                key={index}
                className={`text-center ${index > 0 ? "md:border-l md:border-calma-olive/10" : ""}`}
              >
                <div className="font-fraunces text-3xl text-calma-terracotta md:text-4xl">
                  <AnimatedStat value={stat.value} />
                </div>
                <div className="mt-1 text-xs uppercase tracking-[0.14em] text-calma-taupe">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Our Story + The Calm Promise — deux volets éditoriaux */}
        <section className="py-20 lg:py-28">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 items-stretch gap-8 lg:grid-cols-2">
              {/* Story */}
              <div className="rounded-calma-card border border-calma-olive/10 bg-white p-8 lg:p-10">
                <span className="text-[0.7rem] uppercase tracking-[0.22em] text-calma-terracotta">
                  {t.abt.storyKicker}
                </span>
                <h2 className="mb-4 mt-3 font-fraunces text-3xl font-normal text-calma-ink">
                  {t.abt.storyTitle}
                </h2>
                <p className="mb-4 leading-relaxed text-calma-taupe">{t.abt.storyP1}</p>
                <p className="mb-6 leading-relaxed text-calma-taupe">{t.abt.storyP2}</p>
                <div className="space-y-3 border-t border-calma-olive/10 pt-6">
                  {t.abt.storyItems.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-3">
                      <CheckCircle className="h-4 w-4 shrink-0 text-calma-terracotta" />
                      <span className="text-sm text-calma-ink">{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Calm Promise */}
              <div className="relative flex flex-col justify-between overflow-hidden rounded-calma-card bg-calma-olive p-8 text-calma-cream lg:p-10">
                <ZelligePattern id="promise-zellige" />
                <div className="relative">
                  <span className="text-[0.7rem] uppercase tracking-[0.22em] text-calma-terracotta-soft">
                    {t.abt.promiseKicker}
                  </span>
                  <h3 className="mb-4 mt-3 font-fraunces text-3xl font-normal">
                    {t.abt.promiseTitle1}{" "}
                    <em className="italic text-calma-terracotta-soft">{t.abt.promiseTitleEm}</em>
                  </h3>
                  <p className="mb-6 leading-relaxed text-calma-cream/75">{t.abt.promiseP1}</p>
                  <p className="leading-relaxed text-calma-cream/75">{t.abt.promiseP2}</p>
                </div>
                <div className="relative mt-8 border-t border-white/10 pt-6">
                  <div className="flex items-center gap-2 text-calma-terracotta-soft">
                    <Quote className="h-4 w-4 flex-shrink-0" />
                    <span className="font-fraunces text-sm italic">{t.abt.promiseQuote}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* What We Offer — liste éditoriale numérotée */}
        <section className="bg-calma-sand py-20">
          <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
            <div className="mb-12 flex flex-wrap items-baseline justify-between gap-2">
              <h2 className="font-fraunces text-3xl font-normal text-calma-ink md:text-4xl">
                {t.abt.offerTitle}
              </h2>
              <span className="text-xs uppercase tracking-[0.16em] text-calma-taupe">
                {t.abt.offerKicker}
              </span>
            </div>

            <div className="divide-y divide-calma-olive/10 border-y border-calma-olive/10">
              {offerings.map((item) => (
                <div
                  key={item.num}
                  className="group grid grid-cols-[3rem_1fr] gap-4 py-7 md:grid-cols-[5rem_16rem_1fr] md:gap-8"
                >
                  <span className="font-fraunces text-lg text-calma-terracotta">{item.num}</span>
                  <h3 className="font-fraunces text-xl font-normal text-calma-ink transition-colors group-hover:text-calma-terracotta md:text-2xl">
                    {item.title}
                  </h3>
                  <p className="col-span-2 text-sm leading-relaxed text-calma-taupe md:col-span-1">
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Team — real staff, fetched from the DB */}
        {team.length > 0 && (
          <section className="bg-calma-cream py-20">
            <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
              <div className="mb-12 text-center">
                <span className="text-[0.7rem] uppercase tracking-[0.22em] text-calma-terracotta">
                  {t.abt.teamKicker}
                </span>
                <h2 className="mb-4 mt-3 font-fraunces text-3xl font-normal text-calma-ink md:text-4xl">
                  {t.abt.teamTitle}
                </h2>
              </div>
              <div className="grid grid-cols-2 gap-5 lg:grid-cols-4">
                {team.map((member) => (
                  <div
                    key={member.id}
                    className="group rounded-calma-card border border-calma-olive/10 bg-white p-6 text-center transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_40px_-20px_rgba(42,38,34,.3)]"
                  >
                    <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-calma-terracotta/10 text-3xl transition-transform duration-300 group-hover:scale-110">
                      {member.icon}
                    </div>
                    <h3 className="font-fraunces text-lg font-normal text-calma-ink">
                      {member.name}
                    </h3>
                    <p className="mt-1 text-xs font-semibold uppercase tracking-wide text-calma-terracotta">
                      {member.role}
                    </p>
                    <p className="mt-1 text-xs text-calma-taupe">{member.experience}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Destination Specialists */}
        <section className="py-20">
          <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
            <div className="mb-12 text-center">
              <span className="text-[0.7rem] uppercase tracking-[0.22em] text-calma-terracotta">
                {t.abt.specialistsKicker}
              </span>
              <h2 className="mb-4 mt-3 font-fraunces text-3xl font-normal text-calma-ink md:text-4xl">
                {t.abt.specialistsTitle}
              </h2>
              <p className="mx-auto max-w-2xl text-calma-taupe">{t.abt.specialistsSub}</p>
            </div>

            <div className="mb-12 flex flex-col justify-center gap-4 sm:flex-row">
              {languages.map((l) => (
                <div
                  key={l.code}
                  className="flex items-center gap-4 rounded-calma-card border border-calma-olive/10 bg-white px-8 py-5"
                >
                  <span className="flex h-11 w-11 items-center justify-center rounded-full bg-calma-olive font-fraunces text-sm text-calma-terracotta-soft">
                    {l.code}
                  </span>
                  <div>
                    <p className="font-medium text-calma-ink">{l.lang}</p>
                    <p className="text-xs text-calma-taupe">{t.abt.spokenFluently}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="rounded-calma-card border border-calma-olive/10 bg-white p-8 text-center">
              <MessageCircle className="mx-auto mb-4 h-7 w-7 text-calma-terracotta" />
              <p className="mx-auto max-w-2xl leading-relaxed text-calma-taupe">
                {t.abt.specialistsBottom}
              </p>
            </div>
          </div>
        </section>

        {/* Testimonials — real reviews from the DB */}
        <ReviewsSection reviews={reviews} />

        {/* CTA — tuile bleu profond zellige */}
        <section className="pb-20">
          <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
            <div className="relative overflow-hidden rounded-calma-block bg-calma-olive p-12 text-center text-calma-cream">
              <ZelligePattern id="about-cta-zellige" opacity={0.08} />
              <div
                className="pointer-events-none absolute -right-1/4 -top-1/3 h-[480px] w-[480px] rounded-full opacity-20 blur-[90px]"
                style={{ backgroundColor: "#F2994A" }}
              />
              <div className="relative">
                <h2 className="mb-4 font-fraunces text-3xl font-normal md:text-4xl">
                  {t.abt.ctaTitle1}{" "}
                  <em className="italic text-calma-terracotta-soft">{t.abt.ctaTitleEm}</em> ?
                </h2>
                <p className="mx-auto mb-8 max-w-2xl text-lg text-calma-cream/75">{t.abt.ctaSub}</p>
                <Link
                  href="/services"
                  className="group inline-flex items-center gap-2 rounded-full px-8 py-3.5 text-sm font-semibold text-calma-cream shadow-[0_14px_28px_-10px_rgba(242,153,74,.6)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_18px_34px_-10px_rgba(242,153,74,.75)]"
                  style={{
                    backgroundColor: "#F2994A",
                  }}
                >
                  <span>{t.abt.ctaBtn}</span>
                  <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </div>
            </div>
          </div>
        </section>
      </div>
      <CalmaFooter />
    </>
  );
}

export default function About({ team, reviews }: { team: TeamMember[]; reviews: Review[] }) {
  return (
    <CalmaLangProvider>
      <AboutContent team={team} reviews={reviews} />
    </CalmaLangProvider>
  );
}
