import { notFound } from "next/navigation";
import { auth } from "@/auth";
import { hasPermission } from "@/features/cms/services/permissions";
import NavigationList from "@/features/cms/components/navigation/NavigationList";

export default async function NavigationPage() {
  const session = await auth();
  if (!hasPermission(session?.user?.role, "navigation.manage")) notFound();
  return <NavigationList />;
}
