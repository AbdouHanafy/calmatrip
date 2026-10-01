"use client";
import { useState } from "react";
import { Send, CheckCircle } from "lucide-react";
import { useCalmaLang } from "@/lib/calma/i18n";

const inputClass =
  "h-12 w-full rounded-xl border border-calma-ink/20 bg-white px-4 text-[15px] text-calma-ink outline-none transition-colors placeholder:text-calma-taupe/70 focus:border-calma-ink";
const labelClass = "mb-1.5 block text-[13.5px] font-semibold text-calma-ink";

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
    <div className="rounded-2xl border border-calma-ink/10 bg-white p-6 sm:p-8">
      <h2 className="m-0 text-[22px] font-bold tracking-[-0.01em] text-calma-ink sm:text-[26px]">
        {t.cnt.formTitle}
      </h2>
      <p className="mb-6 mt-2 text-[15px] leading-relaxed text-calma-taupe">{t.cnt.formSub}</p>

      {submitted ? (
        <div className="rounded-xl bg-calma-sand p-10 text-center">
          <CheckCircle size={40} className="mx-auto mb-4 text-calma-success" />
          <h3 className="m-0 mb-1 text-[18px] font-bold text-calma-ink">{t.cnt.sentTitle}</h3>
          <p className="m-0 text-calma-taupe">{t.cnt.sentSub}</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-5">
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
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            <div>
              <label className={labelClass}>
                {t.cnt.labelName} <span className="text-calma-terracotta">*</span>
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
              <label className={labelClass}>
                {t.cnt.labelEmail} <span className="text-calma-terracotta">*</span>
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

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            <div>
              <label className={labelClass}>{t.cnt.labelPhone}</label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className={inputClass}
                placeholder="+216 XX XXX XXX"
              />
            </div>
            <div>
              <label className={labelClass}>
                {t.cnt.labelSubject} <span className="text-calma-terracotta">*</span>
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
            <label className={labelClass}>
              {t.cnt.labelMessage} <span className="text-calma-terracotta">*</span>
            </label>
            <textarea
              required
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              rows={6}
              className="w-full resize-none rounded-xl border border-calma-ink/20 bg-white px-4 py-3 text-[15px] leading-relaxed text-calma-ink outline-none transition-colors placeholder:text-calma-taupe/70 focus:border-calma-ink"
              placeholder={t.cnt.phMessage}
            />
          </div>

          <button
            type="submit"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-calma-ink px-7 py-3 text-[15px] font-semibold text-white transition-colors hover:bg-calma-olive"
          >
            <Send size={16} />
            {t.cnt.sendBtn}
          </button>
        </form>
      )}
    </div>
  );
}
