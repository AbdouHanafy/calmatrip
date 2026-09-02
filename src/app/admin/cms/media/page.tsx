import { notFound } from "next/navigation";
import { auth } from "@/auth";
import { hasPermission } from "@/features/cms/services/permissions";
import MediaLibrary from "@/features/cms/components/media/MediaLibrary";
export default async function MediaLibraryPage() {
  const session = await auth();
  if (!hasPermission(session?.user?.role, "media.manage")) notFound();
  return <MediaLibrary />;
}
