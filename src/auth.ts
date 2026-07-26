import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";
import { checkRateLimit, getClientIp } from "@/lib/rateLimit";

export function getAdminEmails(): string[] {
  return (process.env.ADMIN_EMAILS ?? "")
    .split(",")
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean);
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  trustHost: true,

  adapter: PrismaAdapter(prisma),

  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, request) {
        const email = credentials?.email;
        const password = credentials?.password;
        if (typeof email !== "string" || typeof password !== "string" || !email || !password) {
          return null;
        }

        const ip = getClientIp(request);
        if (!checkRateLimit(`login:${ip}:${email.toLowerCase()}`, 8, 10 * 60 * 1000)) {
          return null;
        }

        const user = await prisma.user.findUnique({
          where: { email: email.toLowerCase() },
        });

        // Generic failure for: no such user, no password set (Google-only account), or wrong password.
        if (!user || !user.password) return null;

        const isValid = await bcrypt.compare(password, user.password);
        if (!isValid) return null;

        if (user.status !== "active") return null;

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          image: user.image,
          role: user.role,
          b2bType: user.b2bType,
          b2bStatus: user.b2bStatus,
        };
      },
    }),
  ],

  session: {
    strategy: "jwt",
  },

  pages: {
    signIn: "/login",
    error: "/auth/error",
  },

  callbacks: {
    async jwt({ token, user, trigger }) {
      // On initial sign-in, attach user id + role
      if (user) {
        token.id = user.id;
        token.role = user.role ?? "USER";
        token.b2bType = user.b2bType ?? null;
        token.b2bStatus = user.b2bStatus ?? null;
      }

      // On session update trigger, refresh role from DB
      if (trigger === "update" && token.id) {
        const dbUser = await prisma.user.findUnique({
          where: { id: token.id as string },
          select: { role: true, b2bType: true, b2bStatus: true },
        });
        if (dbUser) {
          token.role = dbUser.role;
          token.b2bType = dbUser.b2bType;
          token.b2bStatus = dbUser.b2bStatus;
        }
      }

      return token;
    },

    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string;
        session.user.role = (token.role as string) ?? "USER";
        session.user.b2bType = (token.b2bType as string | null) ?? null;
        session.user.b2bStatus = (token.b2bStatus as string | null) ?? null;

        // Always re-read role/b2bType/b2bStatus from the DB rather than trusting
        // the JWT's cached copy. The JWT is only re-populated from `user` at
        // sign-in; useSession().update() does not reliably trigger a jwt()
        // refresh in this setup, so a role change (e.g. B2B approval, or the
        // apply-account-type flow right after a Google sign-up) would
        // otherwise never be reflected until the user logs out and back in.
        if (token.id) {
          const dbUser = await prisma.user.findUnique({
            where: { id: token.id as string },
            select: { role: true, b2bType: true, b2bStatus: true },
          });
          if (dbUser) {
            session.user.role = dbUser.role;
            session.user.b2bType = dbUser.b2bType;
            session.user.b2bStatus = dbUser.b2bStatus;
          }
        }
      }
      return session;
    },
  },

  events: {
    async createUser({ user }) {
      // Auto-assign ADMIN role if email matches ADMIN_EMAILS env var
      const adminEmails = getAdminEmails();
      if (user.email && adminEmails.includes(user.email.toLowerCase())) {
        await prisma.user.update({
          where: { id: user.id },
          data: { role: "ADMIN" },
        });
      }
    },
  },
});
