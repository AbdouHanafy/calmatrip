'use client';
import { useState, useEffect } from "react";
import { motion } from "motion/react";
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  Send,
  CheckCircle,
  ChevronDown,
  Headphones,
  MessageCircle,
  Facebook,
  ArrowRight,
  ExternalLink,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { CalmaLangProvider, useCalmaLang } from '@/lib/calma/i18n';
import CalmaHeader from '@/components/calma/CalmaHeader';
import CalmaFooter from '@/components/calma/CalmaFooter';

/* Motif zellige réutilisable */
function ZelligePattern({ id, opacity = 0.06 }: { id: string; opacity?: number }) {
  return (
    <svg className="absolute inset-0 h-full w-full" style={{ opacity }} aria-hidden="true">
      <defs>
        <pattern id={id} width="56" height="56" patternUnits="userSpaceOnUse">
          <path
            d="M28 2 L34 22 L54 28 L34 34 L28 54 L22 34 L2 28 L22 22 Z"
            fill="none"
            stroke="#ffffff"
            strokeWidth="1.2"
          />
          <circle cx="28" cy="28" r="4" fill="none" stroke="#ffffff" strokeWidth="1" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#${id})`} />
    </svg>
  );
}

/* Reveal-on-scroll wrapper — consistent, subtle fade + rise used across every section */
function Reveal({
  children,
  delay = 0,
  className,
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.7, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}

const inputClass =
  "h-14 w-full rounded-2xl border border-[#F1EBE1] bg-[#FBF8F1] px-5 text-[15px] text-[#2D2926] outline-none transition-all duration-300 placeholder:text-[#726C64]/60 focus:border-[#F2994A] focus:bg-white focus:ring-4 focus:ring-[#F2994A]/[.12]";

const GOOGLE_MAPS_URL =
  "https://www.google.com/maps/search/?api=1&query=Avenue+Habib+Bourguiba%2C+Hammamet%2C+Tunisie";

function ContactContent() {
  const { t } = useCalmaLang();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  const [submitted, setSubmitted] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [faqs, setFaqs] = useState<{ q: string; a: string }[]>([]);

  useEffect(() => {
    fetch("/api/faq")
      .then((res) => res.json())
      .then((data: { question: string; answer: string }[]) => {
        setFaqs(Array.isArray(data) ? data.map((f) => ({ q: f.question, a: f.answer })) : []);
      })
      .catch(() => setFaqs([]));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (res.ok) {
        setSubmitted(true);
        setTimeout(() => {
          setSubmitted(false);
          setFormData({ name: "", email: "", phone: "", subject: "", message: "" });
        }, 3000);
      } else {
        alert("Échec de l'envoi du message : erreur serveur");
      }
    } catch (error) {
      console.error(error);
      alert("Échec de l'envoi du message : erreur réseau");
    }
  };

  const contactInfo = [
    {
      icon: Phone,
      title: t.cnt.infoPhoneTitle,
      details: ["+216 21 622 972"],
      description: t.cnt.infoPhoneDesc,
    },
    {
      icon: Mail,
      title: t.cnt.infoEmailTitle,
      details: ["contact@calmatrip.com"],
      description: t.cnt.infoEmailDesc,
    },
    {
      icon: MapPin,
      title: t.cnt.infoAddressTitle,
      details: ["Avenue Habib Bourguiba", "Hammamet, Tunisie"],
      description: t.cnt.infoAddressDesc,
    },
    {
      icon: Clock,
      title: t.cnt.infoHoursTitle,
      details: [t.cnt.infoHours1, t.cnt.infoHours2],
      description: t.cnt.infoHoursDesc,
    },
  ];

  return (
    <>
      <CalmaHeader active="contact" />
      <div className="min-h-screen bg-[#F1EBE1]">

        {/* ── Hero — cinematic, photo-backed, breadcrumb + welcoming intro ── */}
        <section className="relative flex min-h-[340px] items-center justify-center overflow-hidden px-6 py-20 text-center sm:px-10">
          <Image
            src="/images/explore/chebika_oasis.png"
            alt="Chebika, Tunisie"
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
          <div
            className="absolute inset-0"
            style={{
              background:
                'linear-gradient(180deg,rgba(42,38,34,.72) 0%,rgba(42,38,34,.55) 45%,rgba(42,38,34,.82) 100%)',
            }}
          />
          <div
            className="pointer-events-none absolute inset-0 opacity-[.07]"
            style={{
              backgroundImage: 'repeating-linear-gradient(100deg,transparent 0 26px,#F8F5F0 26px 27px)',
            }}
          />
          <div className="relative z-[2] mx-auto max-w-[640px]">
            {/* Breadcrumb */}
            <nav aria-label="Fil d'Ariane" className="mb-6 flex items-center justify-center gap-2 text-[12.5px] font-medium text-white/60">
              <Link href="/" className="transition-colors hover:text-white">{t.cnt.breadcrumbHome}</Link>
              <span>/</span>
              <span className="text-white/85">{t.navContact}</span>
            </nav>
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/[.08] px-4 py-2 text-[11px] font-bold uppercase tracking-[.18em] text-[#F8F5F0] backdrop-blur-md">
              <span className="h-1.5 w-1.5 rounded-full bg-[#F2994A]" />
              {t.cnt.eyebrow}
            </div>
            <h1 className="mb-4 text-balance font-fraunces text-[clamp(34px,4.8vw,48px)] font-normal leading-[1.08] tracking-[-0.02em] text-[#F8F5F0]">
              {t.cnt.heroTitle1} <em className="not-italic text-[#F7B77E]">{t.cnt.heroTitleEm}</em>
            </h1>
            <p className="mx-auto max-w-[520px] text-pretty text-[16px] leading-[1.7] text-white/80">
              {t.cnt.heroSub}
            </p>
          </div>
        </section>

        {/* ── Coordonnées — cartes flottantes premium ── */}
        <section className="bg-[#F1EBE1] pb-4 pt-16 sm:pt-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {contactInfo.map((info, index) => (
                <Reveal key={index} delay={index * 0.08}>
                  <div className="group h-full rounded-[20px] border border-[#2D2926]/[.06] bg-white p-7 shadow-[0_2px_16px_-8px_rgba(42,38,34,.12)] transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_24px_44px_-20px_rgba(42,38,34,.28)]">
                    <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-full border border-[#F2994A]/20 bg-[#F2994A]/[.08] text-[#F2994A] transition-all duration-300 group-hover:scale-110 group-hover:bg-[#F2994A] group-hover:text-white">
                      <info.icon className="h-5 w-5" strokeWidth={1.75} />
                    </div>
                    <h3 className="text-[0.7rem] font-bold uppercase tracking-[0.18em] text-[#726C64]">{info.title}</h3>
                    {info.details.map((detail, idx) => (
                      <p key={idx} className="mt-1.5 font-fraunces text-[17px] leading-snug text-[#2D2926]">
                        {detail}
                      </p>
                    ))}
                    <p className="mt-2 text-[12.5px] text-[#F2994A]">{info.description}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ── Formulaire & colonne infos ── */}
        <section className="py-24 sm:py-28">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 items-start gap-12 lg:grid-cols-[55fr_45fr] lg:gap-10">
              {/* Formulaire */}
              <Reveal>
                <div className="rounded-[28px] border border-[#2D2926]/[.06] bg-white p-8 shadow-[0_30px_70px_-32px_rgba(42,38,34,.22)] sm:p-10">
                  <div className="mb-8">
                    <h2 className="font-fraunces text-[28px] font-normal leading-tight text-[#2D2926] sm:text-[32px]">
                      {t.cnt.formTitle}
                    </h2>
                    <p className="mt-2 text-[15px] leading-relaxed text-[#726C64]">
                      {t.cnt.formSub}
                    </p>
                  </div>

                  {submitted ? (
                    <div className="animate-scale-in rounded-2xl border border-[#F2994A]/40 bg-[#FBF8F1] p-10 text-center">
                      <CheckCircle className="mx-auto mb-5 h-12 w-12 text-[#4A667D]" />
                      <h3 className="mb-2 font-fraunces text-2xl font-normal text-[#2D2926]">{t.cnt.sentTitle}</h3>
                      <p className="text-[#726C64]">
                        {t.cnt.sentSub}
                      </p>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                        <div>
                          <label className="mb-2 block text-[13px] font-semibold text-[#2D2926]">
                            {t.cnt.labelName} <span className="text-[#F2994A]">*</span>
                          </label>
                          <input
                            type="text"
                            required
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className={inputClass}
                            placeholder={t.cnt.phName}
                          />
                        </div>
                        <div>
                          <label className="mb-2 block text-[13px] font-semibold text-[#2D2926]">
                            {t.cnt.labelEmail} <span className="text-[#F2994A]">*</span>
                          </label>
                          <input
                            type="email"
                            required
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            className={inputClass}
                            placeholder={t.cnt.phEmail}
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                        <div>
                          <label className="mb-2 block text-[13px] font-semibold text-[#2D2926]">
                            {t.cnt.labelPhone}
                          </label>
                          <input
                            type="tel"
                            value={formData.phone}
                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                            className={inputClass}
                            placeholder="+216 XX XXX XXX"
                          />
                        </div>
                        <div>
                          <label className="mb-2 block text-[13px] font-semibold text-[#2D2926]">
                            {t.cnt.labelSubject} <span className="text-[#F2994A]">*</span>
                          </label>
                          <select
                            required
                            value={formData.subject}
                            onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                            className={`${inputClass} cursor-pointer`}
                          >
                            <option value="">{t.cnt.subjSelect}</option>
                            <option value="reservation">{t.cnt.subjReservation}</option>
                            <option value="information">{t.cnt.subjInfo}</option>
                            <option value="reclamation">{t.cnt.subjComplaint}</option>
                            <option value="devis">{t.cnt.subjQuote}</option>
                            <option value="autre">{t.cnt.subjOther}</option>
                          </select>
                        </div>
                      </div>

                      <div>
                        <label className="mb-2 block text-[13px] font-semibold text-[#2D2926]">
                          {t.cnt.labelMessage} <span className="text-[#F2994A]">*</span>
                        </label>
                        <textarea
                          required
                          value={formData.message}
                          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                          rows={6}
                          className="w-full resize-none rounded-2xl border border-[#F1EBE1] bg-[#FBF8F1] px-5 py-4 text-[15px] leading-relaxed text-[#2D2926] outline-none transition-all duration-300 placeholder:text-[#726C64]/60 focus:border-[#F2994A] focus:bg-white focus:ring-4 focus:ring-[#F2994A]/[.12]"
                          placeholder={t.cnt.phMessage}
                        />
                      </div>

                      <button
                        type="submit"
                        className="group flex w-full items-center justify-center gap-2.5 rounded-2xl px-8 py-[18px] text-[15px] font-bold text-white shadow-[0_16px_32px_-12px_rgba(242,153,74,.6)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_22px_40px_-12px_rgba(242,153,74,.75)] active:translate-y-0"
                        style={{ background: 'linear-gradient(135deg,#F2994A 0%,#F2994A 55%,#C97A34 100%)' }}
                      >
                        <Send className="h-[18px] w-[18px] transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-1" />
                        {t.cnt.sendBtn}
                      </button>
                    </form>
                  )}
                </div>
              </Reveal>

              {/* Colonne droite — carte, infos, assistance, réseaux */}
              <div className="flex flex-col gap-6">
                {/* Carte interactive */}
                <Reveal delay={0.05}>
                  <div className="group relative h-80 overflow-hidden rounded-[26px] border border-[#2D2926]/[.06] shadow-[0_24px_50px_-24px_rgba(42,38,34,.35)] transition-shadow duration-300 hover:shadow-[0_32px_64px_-20px_rgba(42,38,34,.45)]">
                    <iframe
                      title="Localisation Calma Trip — Avenue Habib Bourguiba, Hammamet"
                      src="https://maps.google.com/maps?q=Avenue%20Habib%20Bourguiba%2C%20Hammamet%2C%20Tunisie&z=15&output=embed"
                      className="absolute inset-0 h-full w-full grayscale-[15%] transition-[filter] duration-300 group-hover:grayscale-0"
                      style={{ border: 0 }}
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                    />
                    <div className="pointer-events-none absolute inset-0 rounded-[26px] ring-1 ring-inset ring-black/[.06]" />
                    <div className="absolute bottom-5 left-5 rounded-xl bg-white/95 px-3.5 py-2 shadow-md backdrop-blur-sm">
                      <p className="text-xs font-medium text-[#2D2926]">{t.cnt.mapAddress}</p>
                    </div>
                    <a
                      href={GOOGLE_MAPS_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="absolute bottom-5 right-5 flex items-center gap-1.5 rounded-full bg-white px-4 py-2.5 text-[12.5px] font-bold text-[#2D2926] shadow-lg transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#F2994A] hover:text-white"
                    >
                      {t.cnt.openInMaps}
                      <ExternalLink className="h-3.5 w-3.5" />
                    </a>
                  </div>
                </Reveal>

                {/* Informations pratiques */}
                <Reveal delay={0.1}>
                  <div className="rounded-[22px] border border-[#2D2926]/[.06] bg-white p-7 shadow-[0_2px_16px_-8px_rgba(42,38,34,.1)] sm:p-8">
                    <div className="mb-5 flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#F2994A]/[.08] text-[#F2994A]">
                        <CheckCircle className="h-5 w-5" strokeWidth={1.75} />
                      </div>
                      <h3 className="font-fraunces text-lg font-normal text-[#2D2926]">
                        {t.cnt.practicalTitle}
                      </h3>
                    </div>
                    <ul className="space-y-3.5">
                      {t.cnt.practicalItems.map((info, idx) => (
                        <li key={idx} className="flex items-start gap-3">
                          <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-[#F2994A]" />
                          <span className="text-sm leading-relaxed text-[#2D2926]">{info}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </Reveal>

                {/* Assistance immédiate */}
                <Reveal delay={0.15}>
                  <div className="rounded-[22px] border border-[#2D2926]/[.06] bg-white p-7 shadow-[0_2px_16px_-8px_rgba(42,38,34,.1)] sm:p-8">
                    <div className="mb-5 flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#F2994A]/[.08] text-[#F2994A]">
                        <Headphones className="h-5 w-5" strokeWidth={1.75} />
                      </div>
                      <h3 className="font-fraunces text-lg font-normal text-[#2D2926]">
                        {t.cnt.helpTitle}
                      </h3>
                    </div>
                    <div className="mb-5 flex items-center justify-between rounded-xl bg-[#FBF8F1] px-4 py-3.5">
                      <div>
                        <p className="text-[11.5px] text-[#726C64]">{t.cnt.avgResponseLabel}</p>
                        <p className="font-fraunces text-sm text-[#2D2926]">{t.cnt.avgResponseValue}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-[11.5px] text-[#726C64]">{t.cnt.satisfactionLabel}</p>
                        <p className="font-fraunces text-sm text-[#4A667D]">98%</p>
                      </div>
                    </div>
                    <div className="flex flex-col gap-2.5 sm:flex-row">
                      <a
                        href="tel:+21621622972"
                        className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#4A667D] px-4 py-3 text-[13.5px] font-semibold text-white transition-colors duration-300 hover:bg-[#3A5164]"
                      >
                        <Phone className="h-4 w-4" /> {t.cnt.callBtn}
                      </a>
                      <a
                        href="https://wa.me/21621622972"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-[#F1EBE1] px-4 py-3 text-[13.5px] font-semibold text-[#2D2926] transition-colors duration-300 hover:border-[#F2994A] hover:text-[#F2994A]"
                      >
                        <MessageCircle className="h-4 w-4" /> {t.cnt.whatsappBtn}
                      </a>
                    </div>
                  </div>
                </Reveal>

                {/* Réseaux sociaux */}
                <Reveal delay={0.2}>
                  <div className="flex items-center gap-3 rounded-[22px] border border-[#2D2926]/[.06] bg-white p-6 shadow-[0_2px_16px_-8px_rgba(42,38,34,.1)]">
                    <span className="text-xs font-bold uppercase tracking-[0.16em] text-[#726C64]">{t.cnt.followUs}</span>
                    <a
                      href="https://www.facebook.com/profile.php?id=61590996770536"
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="Facebook"
                      className="ml-auto flex h-10 w-10 items-center justify-center rounded-full border border-[#F1EBE1] text-[#2D2926] transition-all duration-300 hover:-translate-y-0.5 hover:border-[#F2994A] hover:text-[#F2994A]"
                    >
                      <Facebook className="h-4 w-4" />
                    </a>
                    <a
                      href="https://wa.me/21621622972"
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="WhatsApp"
                      className="flex h-10 w-10 items-center justify-center rounded-full border border-[#F1EBE1] text-[#2D2926] transition-all duration-300 hover:-translate-y-0.5 hover:border-[#F2994A] hover:text-[#F2994A]"
                    >
                      <MessageCircle className="h-4 w-4" />
                    </a>
                  </div>
                </Reveal>
              </div>
            </div>
          </div>
        </section>

        {/* ── FAQ — accordéon premium ── */}
        <section className="bg-white py-24 sm:py-28">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <Reveal>
              <div className="mb-14 text-center">
                <span className="text-xs font-bold uppercase tracking-[0.18em] text-[#F2994A]">{t.cnt.faqKicker}</span>
                <h2 className="mt-3 font-fraunces text-[32px] font-normal text-[#2D2926] sm:text-[36px]">
                  {t.cnt.faqTitle}
                </h2>
                <p className="mx-auto mt-3 max-w-md text-[15px] leading-relaxed text-[#726C64]">
                  {t.cnt.faqSub}
                </p>
              </div>
            </Reveal>

            <div className="space-y-3">
              {faqs.map((faq, index) => {
                const isOpen = openFaq === index;
                return (
                  <Reveal key={index} delay={Math.min(index * 0.05, 0.3)}>
                    <div
                      className={`overflow-hidden rounded-2xl border transition-colors duration-300 ${
                        isOpen ? "border-[#F2994A]/30 bg-[#FBF8F1]" : "border-[#F1EBE1] bg-white hover:bg-[#FBF8F1]/60"
                      }`}
                    >
                      <button
                        onClick={() => setOpenFaq(isOpen ? null : index)}
                        className="flex w-full items-center justify-between gap-4 px-6 py-6 text-left sm:px-8"
                      >
                        <div className="flex items-baseline gap-5">
                          <span className="font-fraunces text-sm text-[#F2994A]">
                            {String(index + 1).padStart(2, "0")}
                          </span>
                          <span className={`font-fraunces text-[18px] transition-colors sm:text-[19px] ${isOpen ? "text-[#4A667D]" : "text-[#2D2926]"}`}>
                            {faq.q}
                          </span>
                        </div>
                        <ChevronDown
                          className={`h-5 w-5 shrink-0 text-[#F2994A] transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
                        />
                      </button>
                      <div
                        className="grid transition-all duration-300 ease-out"
                        style={{ gridTemplateRows: isOpen ? "1fr" : "0fr" }}
                      >
                        <div className="overflow-hidden">
                          <p className="border-t border-[#F2994A]/15 px-6 pb-6 pt-4 leading-relaxed text-[#726C64] sm:px-8 sm:pl-[4.75rem]">
                            {faq.a}
                          </p>
                        </div>
                      </div>
                    </div>
                  </Reveal>
                );
              })}
            </div>

            <Reveal delay={0.1}>
              <div className="mt-10 text-center">
                <p className="text-[#726C64]">
                  {t.cnt.faqNoAnswer}{" "}
                  <Link href="/services" className="border-b border-[#F2994A] pb-0.5 text-[#4A667D] transition-colors hover:text-[#3A5164]">
                    {t.cnt.faqContactSupport}
                  </Link>
                </p>
              </div>
            </Reveal>
          </div>
        </section>

        {/* ── CTA — banner de réservation immersif ── */}
        <section className="py-24 sm:py-28">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <Reveal>
              <div className="relative isolate flex min-h-[440px] items-center overflow-hidden rounded-calma-block text-center text-calma-cream">
                <Image
                  src="/images/explore/sahara_camel.png"
                  alt="Désert du Sahara, Tunisie"
                  fill
                  sizes="(min-width: 1024px) 1152px, 100vw"
                  className="-z-10 object-cover"
                />
                <div
                  className="absolute inset-0 -z-10"
                  style={{
                    background:
                      'linear-gradient(160deg,rgba(52,34,18,.88) 0%,rgba(36,51,63,.8) 45%,rgba(29,42,52,.9) 100%)',
                  }}
                />
                <ZelligePattern id="contact-cta-zellige" opacity={0.08} />
                <div
                  className="pointer-events-none absolute -right-1/4 -top-1/3 h-[460px] w-[460px] rounded-full opacity-25 blur-[100px]"
                  style={{ background: 'radial-gradient(circle, #F2994A 0%, transparent 70%)' }}
                />
                <div className="relative mx-auto max-w-2xl px-8 py-20 sm:px-14">
                  <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/[.08] px-4 py-2 text-[11px] font-bold uppercase tracking-[.18em] text-calma-terracotta-soft backdrop-blur-md">
                    <span className="h-1.5 w-1.5 rounded-full bg-calma-terracotta-soft" />
                    {t.cnt.ctaKicker}
                  </div>
                  <h2 className="mb-5 text-balance font-fraunces text-[clamp(30px,4.2vw,44px)] font-normal leading-[1.08]">
                    {t.cnt.ctaTitle}
                  </h2>
                  <p className="mx-auto mb-9 max-w-xl text-[17px] leading-[1.7] text-calma-cream/80">
                    {t.cnt.ctaSub}
                  </p>
                  <div className="flex flex-col justify-center gap-4 sm:flex-row">
                    <a
                      href="tel:+21621622972"
                      className="group inline-flex items-center justify-center gap-2 rounded-full px-9 py-4 text-[15.5px] font-semibold text-calma-cream shadow-[0_16px_32px_-12px_rgba(242,153,74,.65)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_22px_40px_-12px_rgba(242,153,74,.8)]"
                      style={{ background: 'linear-gradient(135deg,#F2994A 0%,#F2994A 55%,#C97A34 100%)' }}
                    >
                      <Phone className="h-4 w-4" />
                      <span>{t.cnt.ctaCallBtn}</span>
                      <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                    </a>
                    <Link
                      href="https://wa.me/21621622972"
                      className="inline-flex items-center justify-center gap-2 rounded-full border border-white/40 px-9 py-4 text-[15.5px] font-semibold text-calma-cream transition-all duration-300 hover:-translate-y-1 hover:border-calma-terracotta-soft hover:text-calma-terracotta-soft"
                    >
                      <MessageCircle className="h-4 w-4" />
                      <span>{t.cnt.ctaWhatsappBtn}</span>
                    </Link>
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </section>

        <style>{`
          @keyframes scale-in {
            from { opacity: 0; transform: scale(0.96); }
            to { opacity: 1; transform: scale(1); }
          }
          .animate-scale-in {
            animation: scale-in 0.3s ease-out forwards;
          }
        `}</style>
      </div>
      <CalmaFooter />
    </>
  );
}

export default function Contact() {
  return (
    <CalmaLangProvider>
      <ContactContent />
    </CalmaLangProvider>
  );
}
