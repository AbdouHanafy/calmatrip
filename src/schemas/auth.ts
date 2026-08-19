import { z } from "zod";

export const registerSchema = z.object({
  name: z.string().trim().min(2, "Please enter your full name."),
  email: z.string().trim().toLowerCase().email("Please enter a valid email address."),
  phone: z
    .string()
    .trim()
    .min(8, "Please enter a valid phone number.")
    .regex(/^\+?[\d\s]{8,20}$/, "Please enter a valid phone number."),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters and include a letter and a number.")
    .regex(/[a-zA-Z]/, "Password must be at least 8 characters and include a letter and a number.")
    .regex(/[0-9]/, "Password must be at least 8 characters and include a letter and a number."),
  accountType: z.enum(["user", "artisan", "agency"]).default("user"),
  website: z.string().optional(), // honeypot
});

export type RegisterInput = z.infer<typeof registerSchema>;
