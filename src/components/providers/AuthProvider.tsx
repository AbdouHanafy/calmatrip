'use client';

import { SessionProvider } from "next-auth/react";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider
      refetchInterval={5 * 60} // Refetch every 5 minutes instead of default 1 minute
      refetchOnWindowFocus={false} // Don't refetch when window regains focus
    >
      {children}
    </SessionProvider>
  );
}
