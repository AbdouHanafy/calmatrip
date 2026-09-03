import { notFound } from "next/navigation";
import { auth } from "@/auth";
import { hasPermission } from "@/features/cms/services/permissions";
import NavigationEditor from "@/features/cms/components/navigation/NavigationEditor";

export default async function NavigationEditorPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await auth();
  if (!hasPermission(session?.user?.role, "navigation.manage")) notFound();
  return <NavigationEditor navigationId={(await params).id} />;
}
