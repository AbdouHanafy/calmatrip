"use client";

import Link from "next/link";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import CalmaLogo from "@/components/calma/CalmaLogo";
import { useOptionalCalmaLang, CALMA_DICT } from "@/lib/calma/i18n";
import {
  Eye,
  EyeOff,
  ArrowRight,
  Loader2,
  Mail,
  Phone,
  Lock,
  User as UserIcon,
  ShieldCheck,
  Zap,
  Check,
} from "lucide-react";
import { GoogleAuthButton } from "@/components/auth/GoogleAuthButton";
import { PartnerTypeSelector } from "@/components/auth/PartnerTypeSelector";
import { PasswordStrengthMeter } from "@/components/auth/PasswordStrengthMeter";
import { useAuthForm, type PartnerType } from "@/hooks/auth/useAuthForm";

const PARTNER_TYPE_LABEL: Record<PartnerType, string> = {
  artisan: "Artisan",
  agency: "Agence",
};

type AuthPageProps = {
  mode: "login" | "register";
  callbackUrl?: string;
  /** "traveler" (default) = plain public auth, no account-type picker.
   *  "partner" = dedicated artisan/agency flow, reached via "Devenir partenaire". */
  audience?: "traveler" | "partner";
  /** Pre-selects the partner type when arriving from the artisan/agency detail page. */
  initialPartnerType?: PartnerType | null;
};

const TRUST_ITEMS = [
  { icon: ShieldCheck, label: "Authentification sécurisée" },
  { icon: Lock, label: "Confidentialité protégée" },
  { icon: Zap, label: "Réservation rapide" },
];

export function AuthPage({
  mode,
  callbackUrl = "/dashboard",
  audience = "traveler",
  initialPartnerType = null,
}: AuthPageProps) {
  const reduceMotion = useReducedMotion();
  // AuthPage is rendered on some routes (e.g. /partner/login) without a CalmaLangProvider
  // ancestor, so it can't assume one exists — fall back to the default French dictionary.
  const t = useOptionalCalmaLang()?.t ?? CALMA_DICT.fr;
  const form = useAuthForm({ mode, audience, callbackUrl, initialPartnerType });
  const { isLogin, isPartner } = form;

  const inputBoxClass =
    "flex h-11 items-center gap-2.5 rounded-xl border border-calma-ink/20 bg-white px-3.5 transition-colors focus-within:border-calma-ink";
  const inputFieldClass =
    "w-full border-none bg-transparent text-[15px] text-calma-ink outline-none placeholder:text-calma-taupe/55";
  const labelClass = "mb-1 block text-[12.5px] font-semibold text-calma-ink";

  return (
    <div className="relative min-h-screen bg-white font-hanken">
      <div className="relative z-10 flex min-h-screen items-center justify-center px-4 py-8 sm:px-6">
        <div className="w-full max-w-[520px]">
          {/* Branding above the card */}
          <motion.div
            className="mb-3 text-center"
            initial={reduceMotion ? undefined : { opacity: 0, y: -14 }}
            animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          >
            <Link href="/" className="inline-flex items-center justify-center">
              <CalmaLogo tone="navy" iconSize={30} />
            </Link>
            <p className="mx-auto mt-1.5 max-w-[380px] text-pretty text-[14px] leading-[1.5] text-calma-taupe">
              {isPartner
                ? "Rejoignez le réseau d'artisans et d'agences qui font vivre la Tunisie."
                : "Découvrez la beauté de la Tunisie à travers des expériences inoubliables."}
            </p>
          </motion.div>

          {/* Card */}
          <motion.div
            className="relative rounded-2xl border border-calma-ink/10 bg-white p-6 shadow-[0_8px_30px_-12px_rgba(0,0,0,.18)] sm:p-8"
            initial={reduceMotion ? undefined : { opacity: 0, y: 28, scale: 0.98 }}
            animate={reduceMotion ? undefined : { opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          >
            <AnimatePresence>
              {form.success && (
                <motion.div
                  className="absolute inset-0 z-20 flex flex-col items-center justify-center gap-4 bg-white"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <motion.div
                    className="flex h-16 w-16 items-center justify-center rounded-full bg-calma-success/15 text-calma-success"
                    initial={{ scale: 0.4, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: "spring", stiffness: 300, damping: 18 }}
                  >
                    <Check size={30} strokeWidth={2.5} />
                  </motion.div>
                  <p className="text-lg font-bold text-calma-ink">
                    {isLogin ? "Connexion réussie" : "Compte créé avec succès"}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="mb-4 text-center">
              <h1 className="mb-1 text-balance text-[clamp(22px,3vw,28px)] font-bold leading-[1.1] tracking-[-0.01em] text-calma-ink">
                {isPartner
                  ? isLogin
                    ? "Bon retour, partenaire"
                    : t.navBecomePartner
                  : isLogin
                    ? "Bon retour"
                    : "Créer un compte"}
              </h1>
              <p className="text-[13.5px] leading-[1.45] text-calma-taupe">
                {isPartner
                  ? isLogin
                    ? "Connectez-vous à votre espace partenaire Calma Trip."
                    : "Vendez vos produits ou publiez vos circuits auprès de nos voyageurs."
                  : isLogin
                    ? "Connectez-vous pour accéder à votre espace Calma Trip."
                    : "Rejoignez Calma Trip pour réserver vos expériences en Tunisie."}
              </p>
            </div>

            <GoogleAuthButton
              callbackUrl={callbackUrl}
              label={isLogin ? "Continuer avec Google" : "S'inscrire avec Google"}
              accountType={isLogin ? "user" : form.accountType}
            />

            <div className="my-4 flex items-center gap-4">
              <div className="h-px flex-1 bg-calma-olive/15" />
              <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-calma-taupe/70">
                ou
              </span>
              <div className="h-px flex-1 bg-calma-olive/15" />
            </div>

            <form onSubmit={form.handleSubmit} className="space-y-3" noValidate>
              {!isLogin && (
                <input
                  type="text"
                  name="website"
                  value={form.website}
                  onChange={(e) => form.setWebsite(e.target.value)}
                  tabIndex={-1}
                  autoComplete="off"
                  aria-hidden="true"
                  className="absolute left-[-9999px] top-auto h-0 w-0 overflow-hidden"
                />
              )}
              {!isLogin && isPartner && form.partnerTypeLocked ? (
                <div className="flex items-center justify-between rounded-xl border border-calma-ink/15 bg-calma-sand px-3.5 py-2.5 text-sm text-calma-ink">
                  <span>
                    Inscription en tant qu&apos;
                    <strong>{PARTNER_TYPE_LABEL[form.partnerType]}</strong>
                  </span>
                  <Link
                    href={form.partnerType === "artisan" ? "/partner/agency" : "/partner/artisan"}
                    className="text-xs font-semibold text-calma-olive hover:text-calma-olive"
                  >
                    Changer
                  </Link>
                </div>
              ) : (
                !isLogin &&
                isPartner && (
                  <PartnerTypeSelector
                    value={form.partnerType}
                    onChange={form.setPartnerType}
                    labelClassName={labelClass}
                  />
                )
              )}

              {!isLogin && (
                <div>
                  <label htmlFor="name" className={labelClass}>
                    Nom complet
                  </label>
                  <div className={inputBoxClass}>
                    <UserIcon size={18} className="shrink-0 text-calma-olive" />
                    <input
                      id="name"
                      type="text"
                      autoComplete="name"
                      value={form.name}
                      onChange={(e) => form.setName(e.target.value)}
                      placeholder="Votre nom"
                      className={inputFieldClass}
                    />
                  </div>
                </div>
              )}

              <div>
                <label htmlFor="email" className={labelClass}>
                  Email
                </label>
                <div className={inputBoxClass}>
                  <Mail size={18} className="shrink-0 text-calma-olive" />
                  <input
                    id="email"
                    type="email"
                    autoComplete="email"
                    value={form.email}
                    onChange={(e) => form.setEmail(e.target.value)}
                    placeholder="vous@exemple.com"
                    className={inputFieldClass}
                  />
                </div>
              </div>

              {!isLogin && (
                <div>
                  <label htmlFor="phone" className={labelClass}>
                    Numéro de téléphone
                  </label>
                  <div className={inputBoxClass}>
                    <Phone size={18} className="shrink-0 text-calma-olive" />
                    <input
                      id="phone"
                      type="tel"
                      autoComplete="tel"
                      value={form.phone}
                      onChange={(e) => form.setPhone(e.target.value)}
                      placeholder="+216 XX XXX XXX"
                      className={inputFieldClass}
                    />
                  </div>
                </div>
              )}

              <div>
                <label htmlFor="password" className={labelClass}>
                  Mot de passe
                </label>
                <div className={inputBoxClass}>
                  <Lock size={18} className="shrink-0 text-calma-olive" />
                  <input
                    id="password"
                    type={form.showPassword ? "text" : "password"}
                    autoComplete={isLogin ? "current-password" : "new-password"}
                    value={form.password}
                    onChange={(e) => form.setPassword(e.target.value)}
                    placeholder="••••••••"
                    className={inputFieldClass}
                  />
                  <motion.button
                    type="button"
                    onClick={() => form.setShowPassword((p) => !p)}
                    aria-label={
                      form.showPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"
                    }
                    className="shrink-0 text-calma-taupe transition-colors hover:text-calma-olive"
                    whileTap={{ scale: 0.85 }}
                  >
                    <AnimatePresence mode="wait" initial={false}>
                      <motion.span
                        key={form.showPassword ? "hide" : "show"}
                        initial={{ opacity: 0, rotate: -45 }}
                        animate={{ opacity: 1, rotate: 0 }}
                        exit={{ opacity: 0, rotate: 45 }}
                        transition={{ duration: 0.18 }}
                        className="flex"
                      >
                        {form.showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </motion.span>
                    </AnimatePresence>
                  </motion.button>
                </div>

                {!isLogin && <PasswordStrengthMeter password={form.password} />}
              </div>

              {!isLogin && (
                <div>
                  <label htmlFor="confirmPassword" className={labelClass}>
                    Confirmer le mot de passe
                  </label>
                  <div className={inputBoxClass}>
                    <Lock size={18} className="shrink-0 text-calma-olive" />
                    <input
                      id="confirmPassword"
                      type={form.showPassword ? "text" : "password"}
                      autoComplete="new-password"
                      value={form.confirmPassword}
                      onChange={(e) => form.setConfirmPassword(e.target.value)}
                      placeholder="••••••••"
                      className={inputFieldClass}
                    />
                  </div>
                </div>
              )}

              {isLogin ? (
                <div className="flex items-center justify-between">
                  <label className="flex cursor-pointer items-center gap-2.5 text-sm text-calma-ink">
                    <input
                      type="checkbox"
                      checked={form.rememberMe}
                      onChange={(e) => form.setRememberMe(e.target.checked)}
                      className="h-4 w-4 rounded border-calma-olive/30 text-calma-olive accent-calma-ink focus:ring-calma-ink"
                    />
                    Se souvenir de moi
                  </label>
                  <Link
                    href="/contact"
                    className="text-sm font-semibold text-calma-olive transition-colors hover:text-calma-olive"
                  >
                    Mot de passe oublié ?
                  </Link>
                </div>
              ) : (
                <label className="flex cursor-pointer items-start gap-2.5 text-sm leading-relaxed text-calma-ink">
                  <input
                    type="checkbox"
                    checked={form.acceptTerms}
                    onChange={(e) => form.setAcceptTerms(e.target.checked)}
                    className="mt-0.5 h-4 w-4 shrink-0 rounded border-calma-olive/30 text-calma-olive accent-calma-ink focus:ring-calma-ink"
                  />
                  <span>
                    J&apos;accepte les{" "}
                    <span className="font-semibold text-calma-olive">
                      conditions d&apos;utilisation
                    </span>{" "}
                    et la{" "}
                    <span className="font-semibold text-calma-olive">
                      politique de confidentialité
                    </span>
                    .
                  </span>
                </label>
              )}

              <AnimatePresence>
                {form.error && (
                  <motion.p
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="overflow-hidden rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600"
                  >
                    {form.error}
                  </motion.p>
                )}
              </AnimatePresence>

              <motion.button
                type="submit"
                disabled={form.loading}
                className="group relative flex w-full items-center justify-center gap-2 overflow-hidden rounded-full bg-calma-ink px-6 py-3 text-[15px] font-semibold text-white transition-colors hover:bg-calma-olive disabled:opacity-70"
                whileTap={{ scale: 0.98 }}
              >
                {form.loading ? (
                  <Loader2 size={18} className="animate-spin" />
                ) : (
                  <>
                    {isLogin ? "Se connecter" : "Créer mon compte"}
                    <ArrowRight
                      size={18}
                      className="transition-transform duration-300 group-hover:translate-x-1"
                    />
                  </>
                )}
              </motion.button>
            </form>

            {/* Trust section */}
            <div className="mt-4 flex items-center justify-center gap-4 border-t border-calma-olive/10 pt-3">
              {TRUST_ITEMS.map((item) => (
                <div key={item.label} className="flex items-center gap-1.5" title={item.label}>
                  <item.icon size={12} className="shrink-0 text-calma-success" />
                  <span className="hidden text-[10.5px] leading-tight text-calma-taupe sm:inline">
                    {item.label}
                  </span>
                </div>
              ))}
            </div>

            <div className="mt-3 text-center">
              <p className="text-[12.5px] text-calma-taupe">
                {isLogin ? "Pas encore de compte ?" : "Déjà un compte ?"}{" "}
                <Link
                  href={
                    isPartner
                      ? isLogin
                        ? "/partner/register"
                        : "/partner/login"
                      : isLogin
                        ? `/register?callbackUrl=${encodeURIComponent(callbackUrl)}`
                        : `/login?callbackUrl=${encodeURIComponent(callbackUrl)}`
                  }
                  className="font-semibold text-calma-olive transition-colors hover:text-calma-olive"
                >
                  {isLogin ? "S'inscrire" : "Se connecter"}
                </Link>
              </p>
              {!isPartner && (
                <p className="mt-2 text-[12px] text-calma-taupe">
                  Vous êtes artisan ou agence ?{" "}
                  <Link
                    href="/partner"
                    className="font-semibold text-calma-olive transition-colors hover:text-calma-olive"
                  >
                    {t.navBecomePartner}
                  </Link>
                </p>
              )}
              {isPartner && (
                <p className="mt-2 text-[12px] text-calma-taupe">
                  Vous êtes un voyageur ?{" "}
                  <Link
                    href="/register"
                    className="font-semibold text-calma-olive transition-colors hover:text-calma-olive"
                  >
                    Créer un compte voyageur
                  </Link>
                </p>
              )}
            </div>
          </motion.div>

          <motion.p
            className="mt-2.5 text-center"
            initial={reduceMotion ? undefined : { opacity: 0 }}
            animate={reduceMotion ? undefined : { opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            <Link
              href="/"
              className="text-[13px] text-calma-taupe no-underline transition-colors hover:text-calma-ink"
            >
              ← Retour à l&apos;accueil
            </Link>
          </motion.p>
        </div>
      </div>
    </div>
  );
}
