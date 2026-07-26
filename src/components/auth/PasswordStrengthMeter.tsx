import { motion } from "motion/react";
import { passwordStrength } from "@/hooks/auth/useAuthForm";

export function PasswordStrengthMeter({ password }: { password: string }) {
  if (password.length === 0) {
    return (
      <p className="mt-1 text-[11px] text-calma-taupe">
        8 caractères minimum, avec une lettre et un chiffre.
      </p>
    );
  }

  const strength = passwordStrength(password);

  return (
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
  );
}
