import { z } from "zod";

export const contactSchema = z.object({
  name: z.string().trim().min(1, "Champs requis manquants"),
  email: z.string().trim().email("Email invalide"),
  phone: z.string().trim().optional(),
  subject: z.string().trim().min(1, "Champs requis manquants"),
  message: z.string().trim().min(1, "Champs requis manquants").max(5000),
  website: z.string().optional(), // honeypot
});

export type ContactInput = z.infer<typeof contactSchema>;
