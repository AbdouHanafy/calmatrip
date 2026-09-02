export type CmsPermission =
  | "cms.read"
  | "content.manage"
  | "content.publish"
  | "seo.manage"
  | "forms.manage"
  | "forms.submissions.read"
  | "forms.submissions.manage"
  | "media.manage"
  | "navigation.manage"
  | "settings.manage"
  | "reservations.read"
  | "reservations.update"
  | "payments.read"
  | "partners.approve"
  | "users.manage";

const ROLE_PERMISSIONS: Record<string, readonly CmsPermission[]> = {
  ADMIN: [
    "cms.read",
    "content.manage",
    "content.publish",
    "seo.manage",
    "forms.manage",
    "forms.submissions.read",
    "forms.submissions.manage",
    "media.manage",
    "navigation.manage",
    "settings.manage",
    "reservations.read",
    "reservations.update",
    "payments.read",
    "partners.approve",
    "users.manage",
  ],
  SUPER_ADMIN: [
    "cms.read",
    "content.manage",
    "content.publish",
    "seo.manage",
    "forms.manage",
    "forms.submissions.read",
    "forms.submissions.manage",
    "media.manage",
    "navigation.manage",
    "settings.manage",
    "reservations.read",
    "reservations.update",
    "payments.read",
    "partners.approve",
    "users.manage",
  ],
  CONTENT_MANAGER: ["cms.read", "content.manage", "content.publish", "media.manage"],
  EDITOR: ["cms.read", "content.manage", "media.manage"],
  SEO_MANAGER: ["cms.read", "seo.manage"],
  BOOKING_MANAGER: ["reservations.read", "reservations.update"],
  PARTNER_MANAGER: ["partners.approve"],
  SUPPORT_AGENT: ["forms.submissions.read", "forms.submissions.manage"],
};

export function hasPermission(role: string | null | undefined, permission: CmsPermission) {
  return role ? ROLE_PERMISSIONS[role]?.includes(permission) === true : false;
}
