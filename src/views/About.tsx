"use client";
import { CheckCircle, Shield, Quote, Smile, Award, Zap, MessageCircle } from "lucide-react";
import Link from "next/link";
import { CalmaLangProvider, useCalmaLang } from "@/lib/calma/i18n";
import CalmaHeader from "@/components/calma/CalmaHeader";
import CalmaFooter from "@/components/calma/CalmaFooter";
import PageHeader from "@/components/calma/PageHeader";
import AnimatedStat from "@/components/calma/AnimatedStat";
import HomeReviews from "@/components/home/HomeReviews";

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

const OFFER_ICONS = [Smile, Shield, Award, Zap];

const wrap = "mx-auto max-w-[1240px] px-4 sm:px-6 lg:px-8";
const h2 = "m-0 text-[22px] font-bold tracking-[-0.01em] text-calma-ink sm:text-[26px]";

function AboutContent({ team, reviews }: { team: TeamMember[]; reviews: Review[] }) {
  const { t } = useCalmaLang();

  const statValues = ["2026", "500+", "50+", "98%"];
  const stats = t.abt.statLabels.map((label, i) => ({ value: statValues[i], label }));
  const offerings = t.abt.offerings.map((o, i) => ({ ...o, icon: OFFER_ICONS[i] }));
  const languages = t.abt.languages;

  return (
    <>
      <CalmaHeader active="about" />
      <main className="min-h-screen bg-white pb-12 font-hanken">
        <PageHeader
          title={t.abt.heroTitle}
          subtitle={t.abt.heroSub}
          image={encodeURI("/images/explore/El Jem Amphitheatre.jpg")}
          imageAlt="El Jem, Tunisie"
          crumbs={[{ label: t.cnt.breadcrumbHome, href: "/" }, { label: t.navAbout }]}
        />

        <section className={`${wrap} pt-8`}>
          <ul className="m-0 grid list-none grid-cols-2 gap-x-8 gap-y-5 rounded-xl border border-calma-ink/10 p-5 sm:grid-cols-4 lg:px-6">
            {stats.map((stat, index) => (
              <li key={index}>
                <div className="text-[24px] font-bold leading-tight text-calma-ink">
                  <AnimatedStat value={stat.value} />
                </div>
                <div className="text-[13px] text-calma-taupe">{stat.label}</div>
              </li>
            ))}
          </ul>
        </section>

        <section className={`${wrap} pt-10`}>
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <div className="rounded-2xl border border-calma-ink/10 p-6 sm:p-8">
              <div className="text-[12px] font-semibold uppercase tracking-[.04em] text-calma-taupe">
                {t.abt.storyKicker}
              </div>
              <h2 className={`${h2} mt-1.5`}>{t.abt.storyTitle}</h2>
              <p className="mb-3 mt-4 text-[15px] leading-relaxed text-calma-taupe">
                {t.abt.storyP1}
              </p>
              <p className="m-0 text-[15px] leading-relaxed text-calma-taupe">{t.abt.storyP2}</p>
              <ul className="m-0 mt-5 list-none space-y-2.5 border-t border-calma-ink/10 p-0 pt-5">
                {t.abt.storyItems.map((item, idx) => (
                  <li key={idx} className="flex items-center gap-2.5">
                    <CheckCircle size={16} className="shrink-0 text-calma-olive" />
                    <span className="text-[14.5px] text-calma-ink">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex flex-col justify-between rounded-2xl bg-calma-sand p-6 sm:p-8">
              <div>
                <div className="text-[12px] font-semibold uppercase tracking-[.04em] text-calma-taupe">
                  {t.abt.promiseKicker}
                </div>
                <h2 className={`${h2} mt-1.5`}>
                  {t.abt.promiseTitle1} {t.abt.promiseTitleEm}
                </h2>
                <p className="mb-3 mt-4 text-[15px] leading-relaxed text-calma-ink/80">
                  {t.abt.promiseP1}
                </p>
                <p className="m-0 text-[15px] leading-relaxed text-calma-ink/80">
                  {t.abt.promiseP2}
                </p>
              </div>
              <div className="mt-6 flex items-start gap-2.5 border-t border-calma-ink/10 pt-5 text-calma-ink">
                <Quote size={18} className="mt-0.5 shrink-0 text-calma-olive" />
                <span className="text-[14.5px] font-semibold italic">{t.abt.promiseQuote}</span>
              </div>
            </div>
          </div>
        </section>

        <section className={`${wrap} pt-12`}>
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <h2 className={h2}>{t.abt.offerTitle}</h2>
            <span className="text-[13px] text-calma-taupe">{t.abt.offerKicker}</span>
          </div>
          <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {offerings.map((item) => (
              <div key={item.num} className="rounded-xl border border-calma-ink/10 p-5">
                <item.icon size={24} strokeWidth={1.7} className="mb-3 text-calma-olive" />
                <h3 className="m-0 text-[15.5px] font-bold text-calma-ink">{item.title}</h3>
                <p className="mb-0 mt-1.5 text-[14px] leading-snug text-calma-taupe">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {team.length > 0 && (
          <section className={`${wrap} pt-12`}>
            <div className="text-[12px] font-semibold uppercase tracking-[.04em] text-calma-taupe">
              {t.abt.teamKicker}
            </div>
            <h2 className={`${h2} mt-1.5`}>{t.abt.teamTitle}</h2>
            <div className="mt-5 grid grid-cols-2 gap-4 lg:grid-cols-4">
              {team.map((member) => (
                <div
                  key={member.id}
                  className="rounded-xl border border-calma-ink/10 p-5 text-center"
                >
                  <div className="mx-auto mb-3 grid h-14 w-14 place-items-center rounded-full bg-calma-sand text-[26px]">
                    {member.icon}
                  </div>
                  <h3 className="m-0 text-[15.5px] font-bold text-calma-ink">{member.name}</h3>
                  <p className="mb-0 mt-1 text-[12px] font-semibold uppercase tracking-[.04em] text-calma-taupe">
                    {member.role}
                  </p>
                  <p className="mb-0 mt-1 text-[13px] text-calma-taupe">{member.experience}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        <section className={`${wrap} pt-12`}>
          <div className="text-[12px] font-semibold uppercase tracking-[.04em] text-calma-taupe">
            {t.abt.specialistsKicker}
          </div>
          <h2 className={`${h2} mt-1.5`}>{t.abt.specialistsTitle}</h2>
          <p className="mb-0 mt-2 max-w-[620px] text-[15px] leading-relaxed text-calma-taupe">
            {t.abt.specialistsSub}
          </p>

          <div className="mt-5 flex flex-wrap gap-3">
            {languages.map((l) => (
              <div
                key={l.code}
                className="flex items-center gap-3 rounded-xl border border-calma-ink/10 px-5 py-3"
              >
                <span className="grid h-10 w-10 place-items-center rounded-full bg-calma-ink text-[13px] font-bold text-white">
                  {l.code}
                </span>
                <div>
                  <div className="text-[14.5px] font-bold text-calma-ink">{l.lang}</div>
                  <div className="text-[12.5px] text-calma-taupe">{t.abt.spokenFluently}</div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-5 flex items-start gap-3 rounded-xl bg-calma-sand p-5">
            <MessageCircle
              size={22}
              strokeWidth={1.7}
              className="mt-0.5 shrink-0 text-calma-olive"
            />
            <p className="m-0 text-[15px] leading-relaxed text-calma-ink/80">
              {t.abt.specialistsBottom}
            </p>
          </div>
        </section>

        <HomeReviews reviews={reviews} />

        <section className={`${wrap} pt-6`}>
          <div className="rounded-2xl border border-calma-ink/10 px-6 py-10 text-center">
            <h2 className="m-0 text-[22px] font-bold tracking-[-0.01em] text-calma-ink sm:text-[28px]">
              {t.abt.ctaTitle1} {t.abt.ctaTitleEm} ?
            </h2>
            <p className="mx-auto mb-6 mt-3 max-w-[520px] text-[15.5px] leading-relaxed text-calma-taupe">
              {t.abt.ctaSub}
            </p>
            <Link
              href="/services"
              className="inline-block rounded-full bg-calma-ink px-6 py-3 text-[15px] font-semibold text-white no-underline transition-colors hover:bg-calma-olive"
            >
              {t.abt.ctaBtn}
            </Link>
          </div>
        </section>
      </main>
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
