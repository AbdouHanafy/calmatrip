// app/contact/page.tsx

import Contact from "@/views/Contact";
import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import { getPublicFaqs } from "@/repositories/faqRepository";

// ✅ Single export metadata — no duplicate, uses buildMetadata
export const metadata: Metadata = buildMetadata({
  title: "Contact Us — 24/7 Multilingual Support",
  description:
    "Get in touch with Calma Trip. Our team responds in under 30 minutes. Call +216 21 622 972 or email contact@calmatrip.com. Support in English, French and Arabic.",
  path: "/contact",
  keywords: [
    "Calma Trip phone",
    "contact Tunisia travel agency",
    "Tunisia travel support",
    "+216 21 622 972",
  ],
});

export default async function ContactPage() {
  const faqs = await getPublicFaqs();
  return <Contact faqs={faqs.map((f) => ({ q: f.question, a: f.answer }))} />;
}
