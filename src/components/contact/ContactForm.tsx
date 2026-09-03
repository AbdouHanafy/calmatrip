"use client";
import { useState } from "react";
import { Send, CheckCircle } from "lucide-react";
import { useCalmaLang } from "@/lib/calma/i18n";
import { Reveal } from "./Reveal";

const inputClass =
  "h-14 w-full rounded-2xl border border-[#F0E2CE] bg-[#F7F1E7] px-5 text-base text-[#15242E] outline-none transition-all duration-300 placeholder:text-[#5E7480]/60 focus:border-[#D2B38B] focus:bg-white focus:ring-4 focus:ring-[#D2B38B]/[.12]";

export function ContactForm() {
  const { t } = useCalmaLang();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
    website: "", // honeypot — left empty by real visitors, hidden from view
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        setSubmitted(true);
        setTimeout(() => {
          setSubmitted(false);
          setFormData({ name: "", email: "", phone: "", subject: "", message: "", website: "" });
        }, 3000);
      } else {
        alert("Échec de l'envoi du message : erreur serveur");
      }
    } catch (error) {
      console.error(error);
      alert("Échec de l'envoi du message : erreur réseau");
    }
  };

  return (
    <Reveal>
      <div className="rounded-[28px] border border-[#15242E]/[.06] bg-white p-8 shadow-[0_30px_70px_-32px_rgba(21,36,46,.22)] sm:p-10">
        <div className="mb-8">
          <h2 className="font-fraunces text-[28px] font-normal leading-tight text-[#15242E] sm:text-[32px]">
            {t.cnt.formTitle}
          </h2>
          <p className="mt-2 text-[15px] leading-relaxed text-[#5E7480]">{t.cnt.formSub}</p>
        </div>

        {submitted ? (
          <div className="animate-scale-in rounded-2xl border border-[#D2B38B]/40 bg-[#F7F1E7] p-10 text-center">
            <CheckCircle className="mx-auto mb-5 h-12 w-12 text-[#4C7A92]" />
            <h3 className="mb-2 font-fraunces text-2xl font-normal text-[#15242E]">
              {t.cnt.sentTitle}
            </h3>
            <p className="text-[#5E7480]">{t.cnt.sentSub}</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <input
              type="text"
              name="website"
              value={formData.website}
              onChange={(e) => setFormData({ ...formData, website: e.target.value })}
              tabIndex={-1}
              autoComplete="off"
              aria-hidden="true"
              className="absolute left-[-9999px] top-auto h-0 w-0 overflow-hidden"
            />
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-[13px] font-semibold text-[#15242E]">
                  {t.cnt.labelName} <span className="text-[#D2B38B]">*</span>
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
                <label className="mb-2 block text-[13px] font-semibold text-[#15242E]">
                  {t.cnt.labelEmail} <span className="text-[#D2B38B]">*</span>
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
                <label className="mb-2 block text-[13px] font-semibold text-[#15242E]">
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
                <label className="mb-2 block text-[13px] font-semibold text-[#15242E]">
                  {t.cnt.labelSubject} <span className="text-[#D2B38B]">*</span>
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
              <label className="mb-2 block text-[13px] font-semibold text-[#15242E]">
                {t.cnt.labelMessage} <span className="text-[#D2B38B]">*</span>
              </label>
              <textarea
                required
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                rows={6}
                className="w-full resize-none rounded-2xl border border-[#F0E2CE] bg-[#F7F1E7] px-5 py-4 text-[15px] leading-relaxed text-[#15242E] outline-none transition-all duration-300 placeholder:text-[#5E7480]/60 focus:border-[#D2B38B] focus:bg-white focus:ring-4 focus:ring-[#D2B38B]/[.12]"
                placeholder={t.cnt.phMessage}
              />
            </div>

            <button
              type="submit"
              className="group flex w-full items-center justify-center gap-2.5 rounded-2xl px-8 py-[18px] text-[15px] font-bold text-white shadow-[0_16px_32px_-12px_rgba(210,179,139,.6)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_22px_40px_-12px_rgba(210,179,139,.75)] active:translate-y-0"
              style={{ backgroundColor: "#D2B38B" }}
            >
              <Send className="h-[18px] w-[18px] transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-1" />
              {t.cnt.sendBtn}
            </button>
          </form>
        )}
      </div>
    </Reveal>
  );
}
