import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";

export type AccountType = "user" | "artisan" | "agency";
export type PartnerType = "artisan" | "agency";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_RE = /^\+?[\d\s]{8,20}$/;

export function passwordStrength(pw: string) {
  let score = 0;
  if (pw.length >= 8) score++;
  if (/[a-z]/.test(pw) && /[A-Z]/.test(pw)) score++;
  if (/[0-9]/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw) || pw.length >= 12) score++;

  const levels = [
    { label: "Très faible", color: "#C0392B" },
    { label: "Faible", color: "#C46B4A" },
    { label: "Moyen", color: "#B98D52" },
    { label: "Fort", color: "#4C7A92" },
    { label: "Excellent", color: "#5E8B63" },
  ];
  return { score, ...levels[score] };
}

interface UseAuthFormArgs {
  mode: "login" | "register";
  audience: "traveler" | "partner";
  callbackUrl: string;
  /** Pre-selects the partner type when arriving from the artisan/agency detail page ("?type=..."). */
  initialPartnerType?: PartnerType | null;
}

export function useAuthForm({
  mode,
  audience,
  callbackUrl,
  initialPartnerType = null,
}: UseAuthFormArgs) {
  const isLogin = mode === "login";
  const isPartner = audience === "partner";
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [website, setWebsite] = useState(""); // honeypot — left empty by real visitors, hidden from view
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [partnerType, setPartnerType] = useState<PartnerType>(initialPartnerType ?? "artisan");
  const partnerTypeLocked = initialPartnerType !== null;
  const accountType: AccountType = isPartner ? partnerType : "user";
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const strength = useMemo(() => passwordStrength(password), [password]);

  const validate = (): string | null => {
    if (!isLogin && name.trim().length < 2) return "Veuillez indiquer votre nom complet.";
    if (!EMAIL_RE.test(email.trim())) return "Veuillez indiquer une adresse email valide.";
    if (!isLogin && !PHONE_RE.test(phone.trim()))
      return "Veuillez indiquer un numéro de téléphone valide.";
    if (password.length < 8 || !/[a-zA-Z]/.test(password) || !/[0-9]/.test(password)) {
      return "Le mot de passe doit contenir au moins 8 caractères, une lettre et un chiffre.";
    }
    if (!isLogin && password !== confirmPassword) return "Les mots de passe ne correspondent pas.";
    if (!isLogin && !acceptTerms)
      return "Veuillez accepter les conditions d'utilisation pour continuer.";
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
          body: JSON.stringify({
            name: name.trim(),
            email: email.trim(),
            phone: phone.trim(),
            password,
            accountType,
            website,
          }),
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
            : "Compte créé, mais la connexion a échoué. Veuillez vous connecter.",
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

  return {
    isLogin,
    isPartner,
    name,
    setName,
    email,
    setEmail,
    phone,
    setPhone,
    website,
    setWebsite,
    password,
    setPassword,
    confirmPassword,
    setConfirmPassword,
    partnerType,
    setPartnerType,
    partnerTypeLocked,
    accountType,
    showPassword,
    setShowPassword,
    rememberMe,
    setRememberMe,
    acceptTerms,
    setAcceptTerms,
    loading,
    success,
    error,
    strength,
    handleSubmit,
  };
}
