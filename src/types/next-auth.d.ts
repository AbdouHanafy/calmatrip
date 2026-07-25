import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: string;
      b2bType?: string | null;
      b2bStatus?: string | null;
    } & DefaultSession["user"];
  }

  interface User {
    role?: string;
    b2bType?: string | null;
    b2bStatus?: string | null;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    role?: string;
    b2bType?: string | null;
    b2bStatus?: string | null;
  }
}
