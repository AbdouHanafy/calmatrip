import { notFound } from "next/navigation";
import { auth } from "@/auth";
import { hasPermission } from "@/features/cms/services/permissions";
import SettingsPage from "@/features/cms/components/settings/SettingsPage";

export default async function SiteSettingsPage() {
  const session = await auth();
  if (!hasPermission(session?.user?.role, "settings.manage")) notFound();
  return <SettingsPage />;
}
