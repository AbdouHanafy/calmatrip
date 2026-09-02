import type { Session } from "next-auth";

export const ADMIN_ROLES = [
  "ADMIN",
  "SUPER_ADMIN",
  "CONTENT_MANAGER",
  "SEO_MANAGER",
  "SUPPORT_AGENT",
  "EDITOR",
] as const;

export function isAdminWorkspaceRole(role: string | null | undefined) {
  return ADMIN_ROLES.includes(role as (typeof ADMIN_ROLES)[number]);
}

export function isApprovedPartner(session: Session | null, type?: "ARTISAN" | "AGENCY") {
  if (session?.user?.role !== "B2B" || session.user.b2bStatus?.toLowerCase() !== "approved")
    return false;
  return !type || session.user.b2bType?.toUpperCase() === type;
}
