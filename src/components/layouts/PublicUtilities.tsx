"use client";

import { usePathname } from "next/navigation";
import InstallPWA from "@/components/ui/InstallPWA";

/** Public conversion utilities must never overlap operational workspaces. */
export default function PublicUtilities() {
  const pathname = usePathname();
  const privateWorkspace =
    pathname.startsWith("/admin") ||
    pathname.startsWith("/b2b") ||
    pathname.startsWith("/dashboard");
  if (privateWorkspace) return null;
  return (
    <>
      <InstallPWA />
    </>
  );
}
