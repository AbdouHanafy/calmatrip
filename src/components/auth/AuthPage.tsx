'use client';

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import {
  Eye,
  EyeOff,
  ArrowRight,
  Loader2,
  Mail,
  Lock,
  User as UserIcon,
  Compass,
  Store,
  ShieldCheck,
  Zap,
  Check,
} from "lucide-react";
import { GoogleAuthButton } from "@/components/auth/GoogleAuthButton";

type AuthPageProps = {
  mode: "login" | "register";
  callbackUrl?: string;
  /** "traveler" (default) = plain public auth, no account-type picker.
   *  "partner" = dedicated artisan/agency flow, reached via "Devenir partenaire". */
  audience?: "traveler" | "partner";
};

type AccountType = "user" | "artisan" | "agency";
type PartnerType = "artisan" | "agency";

interface Particle {
  id: number;
  left: number;
  bottom: number;
  size: number;
  duration: number;
  delay: number;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const PARTNER_TYPES: { value: PartnerType; label: string; icon: typeof UserIcon; desc: string }[] = [
  { value: "artisan", label: "Artisan", icon: Store, desc: "Vendez vos créations sur la Marketplace." },
  { value: "agency", label: "Agence", icon: Compass, desc: "Publiez vos circuits sur Explorer." },
];

const TRUST_ITEMS = [
  { icon: ShieldCheck, label: "Authentification sécurisée" },
  { icon: Lock, label: "Confidentialité protégée" },
  { icon: Zap, label: "Réservation rapide" },
];

function passwordStrength(pw: string) {
  let score = 0;
  if (pw.length >= 8) score++;
  if (/[a-z]/.test(pw) && /[A-Z]/.test(pw)) score++;
  if (/[0-9]/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw) || pw.length >= 12) score++;

  const levels = [
    { label: "Très faible", color: "#C0392B" },
    { label: "Faible", color: "#C46B4A" },
    { label: "Moyen", color: "#D9A441" },
    { label: "Fort", color: "#4A667D" },
    { label: "Excellent", color: "#5E8B63" },
  ];
  return { score, ...levels[score] };
}

export function AuthPage({ mode, callbackUrl = "/dashboard", audience = "traveler" }: AuthPageProps) {
  const isLogin = mode === "login";
  const isPartner = audience === "partner";
  const router = useRouter();
  const reduceMotion = useReducedMotion();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [partnerType, setPartnerType] = useState<PartnerType>("artisan");
  const accountType: AccountType = isPartner ? partnerType : "user";
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [particles, setParticles] = useState<Particle[] | null>(null);

  useEffect(() => {
    setParticles(
      Array.from({ length: 14 }).map((_, i) => ({
        id: i,
        left: Math.random() * 100,
        bottom: Math.random() * 60,
        size: 2 + Math.round(Math.random() * 3),
        duration: 10 + Math.random() * 8,
        delay: Math.random() * 10,
      }))
    );
  }, []);

  const strength = useMemo(() => passwordStrength(password), [password]);

  const validate = (): string | null => {
    if (!isLogin && name.trim().length < 2) return "Veuillez indiquer votre nom complet.";
    if (!EMAIL_RE.test(email.trim())) return "Veuillez indiquer une adresse email valide.";
    if (password.length < 8 || !/[a-zA-Z]/.test(password) || !/[0-9]/.test(password)) {
      return "Le mot de passe doit contenir au moins 8 caractères, une lettre et un chiffre.";
    }
    if (!isLogin && password !== confirmPassword) return "Les mots de passe ne correspondent pas.";
    if (!isLogin && !acceptTerms) return "Veuillez accepter les conditions d'utilisation pour continuer.";
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);
    try {
      if (!isLogin) {
        const res = await fetch("/api/auth/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name: name.trim(), email: email.trim(), password, accountType }),
        });
        const data = await res.json();
        if (!res.ok) {
          setError(data.error ?? "Une erreur est survenue. Veuillez réessayer.");
          setLoading(false);
          return;
        }
      }

      const result = await signIn("credentials", {
        email: email.trim(),
        password,
        redirect: false,
      });

      if (result?.error) {
        setError(
          isLogin
            ? "Email ou mot de passe incorrect."
            : "Compte créé, mais la connexion a échoué. Veuillez vous connecter."
        );
        setLoading(false);
        return;
      }

      const destination = !isLogin && accountType !== "user" ? "/b2b" : callbackUrl;
      setLoading(false);
      setSuccess(true);
      setTimeout(() => {
        router.push(destination);
        router.refresh();
      }, 900);
    } catch {
      setError("Une erreur est survenue. Veuillez réessayer.");
      setLoading(false);
    }
  };

  const inputBoxClass =
    "flex h-11 items-center gap-2.5 rounded-xl border border-calma-olive/15 bg-white/80 px-3.5 transition-all duration-300 focus-within:border-calma-terracotta focus-within:bg-white focus-within:shadow-[0_0_0_4px_rgba(242,153,74,.12)]";
  const inputFieldClass =
    "w-full border-none bg-transparent text-[15px] text-calma-ink outline-none placeholder:text-calma-taupe/55";
  const labelClass = "mb-1 block text-[12.5px] font-semibold text-calma-ink";

  return (
    <div className="relative h-screen overflow-hidden font-hanken">
      {/* Cinematic Tunisian background with slow Ken Burns zoom */}
      <div className={`absolute inset-0 ${reduceMotion ? "" : "calma-hero-kenburns"}`}>
        <Image
          src="/images/explore/kairouan_mosque.png"
          alt="Grande Mosquée de Kairouan, Tunisie"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
      </div>

      {/* Warm cinematic gradient overlay */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "linear-gradient(160deg,rgba(36,26,14,.82) 0%,rgba(36,51,63,.62) 45%,rgba(24,18,12,.88) 100%)",
        }}
      />
      {/* Soft radial vignette centered behind the card */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background: "radial-gradient(55% 50% at 50% 46%, rgba(20,14,8,.2) 0%, rgba(20,14,8,.55) 100%)",
        }}
      />
      {/* Warm atmospheric glow */}
      <div
        className="pointer-events-none absolute -right-[10%] -top-[10%] h-[55%] w-[50%] rounded-full opacity-[.25] blur-[120px]"
        style={{ background: "radial-gradient(circle, #F2994A 0%, transparent 70%)" }}
      />

      {/* Slow floating dust particles */}
      {particles && (
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          {particles.map((p) => (
            <div
              key={p.id}
              className="calma-dust absolute rounded-full bg-white/60"
              style={{
                left: `${p.left}%`,
                bottom: `${p.bottom}%`,
                width: p.size,
                height: p.size,
                animation: `calma-dust ${p.duration}s linear ${p.delay}s infinite`,
              }}
            />
          ))}
        </div>
      )}

      {/* Content */}
      <div className="relative z-10 flex h-full items-center justify-center px-4 py-3 sm:px-6">
        <div className="w-full max-w-[520px]">
          {/* Branding above the card */}
          <motion.div
            className="mb-3 text-center"
            initial={reduceMotion ? undefined : { opacity: 0, y: -14 }}
            animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          >
            <Link href="/" className="inline-flex items-center">
              <Image src="/images/logo-cream.png" alt="Calma Trip" width={252} height={78} className="h-8 w-auto sm:h-9" priority />
            </Link>
            <p className="mx-auto mt-1.5 max-w-[380px] text-pretty font-fraunces text-[13px] italic leading-[1.4] text-white/80">
              {isPartner
                ? "Rejoignez le réseau d'artisans et d'agences qui font vivre la Tunisie."
                : "Découvrez la beauté de la Tunisie à travers des expériences inoubliables."}
            </p>
          </motion.div>

          {/* Card */}
          <motion.div
            className="relative max-h-[90vh] overflow-y-auto rounded-[28px] border border-white/25 bg-calma-cream/95 p-6 backdrop-blur-2xl sm:p-8"
            style={{ boxShadow: "0 40px 90px -30px rgba(15,12,8,.65), 0 1px 0 0 rgba(255,255,255,.4) inset" }}
            initial={reduceMotion ? undefined : { opacity: 0, y: 28, scale: 0.98 }}
            animate={reduceMotion ? undefined : { opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          >
            <AnimatePresence>
              {success && (
                <motion.div
                  className="absolute inset-0 z-20 flex flex-col items-center justify-center gap-4 bg-calma-cream/98 backdrop-blur-sm"
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
                  <p className="font-fraunces text-lg text-calma-ink">
                    {isLogin ? "Connexion réussie" : "Compte créé avec succès"}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="mb-4 text-center">
              <h1 className="mb-1 text-balance font-fraunces text-[clamp(22px,3vw,28px)] font-normal leading-[1.1] text-calma-ink">
                {isPartner
                  ? isLogin
                    ? "Bon retour, partenaire"
                    : "Devenir partenaire"
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
              accountType={isLogin ? "user" : accountType}
            />

            <div className="my-4 flex items-center gap-4">
              <div className="h-px flex-1 bg-gradient-to-r from-transparent to-calma-olive/15" />
              <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-calma-taupe/70">ou</span>
              <div className="h-px flex-1 bg-gradient-to-l from-transparent to-calma-olive/15" />
            </div>

            <form onSubmit={handleSubmit} className="space-y-3" noValidate>
              {!isLogin && isPartner && (
                <div>
                  <label className={labelClass}>Vous êtes</label>
                  <div className="grid grid-cols-2 gap-2">
                    {PARTNER_TYPES.map((opt) => (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => setPartnerType(opt.value)}
                        className={`flex flex-col items-center gap-1 rounded-xl border px-2 py-2 text-[12px] font-semibold transition-all duration-300 ${
                          partnerType === opt.value
                            ? "border-calma-terracotta bg-calma-terracotta/10 text-calma-terracotta"
                            : "border-calma-olive/15 bg-white/70 text-calma-taupe hover:border-calma-olive/30"
                        }`}
                      >
                        <opt.icon size={15} />
                        {opt.label}
                      </button>
                    ))}
                  </div>
                  <p className="mt-1 text-[11px] leading-snug text-calma-taupe">
                    {PARTNER_TYPES.find((t) => t.value === partnerType)?.desc} Soumis à validation par notre équipe.
                  </p>
                </div>
              )}

              {!isLogin && (
                <div>
                  <label htmlFor="name" className={labelClass}>
                    Nom complet
                  </label>
                  <div className={inputBoxClass}>
                    <UserIcon size={18} className="shrink-0 text-calma-terracotta" />
                    <input
                      id="name"
                      type="text"
                      autoComplete="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
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
                  <Mail size={18} className="shrink-0 text-calma-terracotta" />
                  <input
                    id="email"
                    type="email"
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="vous@exemple.com"
                    className={inputFieldClass}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className={labelClass}>
                  Mot de passe
                </label>
                <div className={inputBoxClass}>
                  <Lock size={18} className="shrink-0 text-calma-terracotta" />
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete={isLogin ? "current-password" : "new-password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className={inputFieldClass}
                  />
                  <motion.button
                    type="button"
                    onClick={() => setShowPassword((p) => !p)}
                    aria-label={showPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}
                    className="shrink-0 text-calma-taupe transition-colors hover:text-calma-terracotta"
                    whileTap={{ scale: 0.85 }}
                  >
                    <AnimatePresence mode="wait" initial={false}>
                      <motion.span
                        key={showPassword ? "hide" : "show"}
                        initial={{ opacity: 0, rotate: -45 }}
                        animate={{ opacity: 1, rotate: 0 }}
                        exit={{ opacity: 0, rotate: 45 }}
                        transition={{ duration: 0.18 }}
                        className="flex"
                      >
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </motion.span>
                    </AnimatePresence>
                  </motion.button>
                </div>

                {!isLogin && password.length > 0 && (
                  <div className="mt-1.5">
                    <div className="flex gap-1.5">
                      {[0, 1, 2, 3].map((i) => (
                        <div key={i} className="h-1 flex-1 overflow-hidden rounded-full bg-calma-olive/10">
                          <motion.div
                            className="h-full rounded-full"
                            style={{ backgroundColor: strength.score > i ? strength.color : "transparent" }}
                            initial={{ scaleX: 0 }}
                            animate={{ scaleX: strength.score > i ? 1 : 0 }}
                            transition={{ duration: 0.3 }}
                          />
                        </div>
                      ))}
                    </div>
                    <p className="mt-1 text-[11px] font-medium" style={{ color: strength.color }}>
                      Sécurité : {strength.label}
                    </p>
                  </div>
                )}

                {!isLogin && password.length === 0 && (
                  <p className="mt-1 text-[11px] text-calma-taupe">
                    8 caractères minimum, avec une lettre et un chiffre.
                  </p>
                )}
              </div>

              {!isLogin && (
                <div>
                  <label htmlFor="confirmPassword" className={labelClass}>
                    Confirmer le mot de passe
                  </label>
                  <div className={inputBoxClass}>
                    <Lock size={18} className="shrink-0 text-calma-terracotta" />
                    <input
                      id="confirmPassword"
                      type={showPassword ? "text" : "password"}
                      autoComplete="new-password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
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
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="h-4 w-4 rounded border-calma-olive/30 text-calma-terracotta accent-calma-terracotta focus:ring-calma-terracotta"
                    />
                    Se souvenir de moi
                  </label>
                  <Link href="/contact" className="text-sm font-semibold text-calma-terracotta transition-colors hover:text-calma-olive">
                    Mot de passe oublié ?
                  </Link>
                </div>
              ) : (
                <label className="flex cursor-pointer items-start gap-2.5 text-sm leading-relaxed text-calma-ink">
                  <input
                    type="checkbox"
                    checked={acceptTerms}
                    onChange={(e) => setAcceptTerms(e.target.checked)}
                    className="mt-0.5 h-4 w-4 shrink-0 rounded border-calma-olive/30 text-calma-terracotta accent-calma-terracotta focus:ring-calma-terracotta"
                  />
                  <span>
                    J&apos;accepte les{" "}
                    <span className="font-semibold text-calma-terracotta">conditions d&apos;utilisation</span> et la{" "}
                    <span className="font-semibold text-calma-terracotta">politique de confidentialité</span>.
                  </span>
                </label>
              )}

              <AnimatePresence>
                {error && (
                  <motion.p
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="overflow-hidden rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600"
                  >
                    {error}
                  </motion.p>
                )}
              </AnimatePresence>

              <motion.button
                type="submit"
                disabled={loading}
                className="group relative flex w-full items-center justify-center gap-2 overflow-hidden rounded-full px-6 py-3 text-[15px] font-bold text-calma-cream shadow-[0_16px_32px_-12px_rgba(242,153,74,.65)] transition-shadow duration-300 hover:shadow-[0_22px_40px_-12px_rgba(242,153,74,.8)] disabled:opacity-70"
                style={{ background: "linear-gradient(135deg,#F2994A 0%,#F2994A 55%,#C97A34 100%)" }}
                whileHover={reduceMotion ? undefined : { y: -2 }}
                whileTap={{ scale: 0.98 }}
              >
                {loading ? (
                  <Loader2 size={18} className="animate-spin" />
                ) : (
                  <>
                    {isLogin ? "Se connecter" : "Créer mon compte"}
                    <ArrowRight size={18} className="transition-transform duration-300 group-hover:translate-x-1" />
                  </>
                )}
              </motion.button>
            </form>

            {/* Trust section */}
            <div className="mt-4 flex items-center justify-center gap-4 border-t border-calma-olive/10 pt-3">
              {TRUST_ITEMS.map((item) => (
                <div key={item.label} className="flex items-center gap-1.5" title={item.label}>
                  <item.icon size={12} className="shrink-0 text-calma-success" />
                  <span className="hidden text-[10.5px] leading-tight text-calma-taupe sm:inline">{item.label}</span>
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
                  className="font-semibold text-calma-terracotta transition-colors hover:text-calma-olive"
                >
                  {isLogin ? "S'inscrire" : "Se connecter"}
                </Link>
              </p>
              {!isPartner && (
                <p className="mt-2 text-[12px] text-calma-taupe">
                  Vous êtes artisan ou agence ?{" "}
                  <Link href="/partner/register" className="font-semibold text-calma-terracotta transition-colors hover:text-calma-olive">
                    Devenir partenaire
                  </Link>
                </p>
              )}
              {isPartner && (
                <p className="mt-2 text-[12px] text-calma-taupe">
                  Vous êtes un voyageur ?{" "}
                  <Link href="/register" className="font-semibold text-calma-terracotta transition-colors hover:text-calma-olive">
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
            <Link href="/" className="text-xs text-white/70 transition-colors hover:text-white">
              ← Retour à l&apos;accueil
            </Link>
          </motion.p>
        </div>
      </div>
    </div>
  );
}
