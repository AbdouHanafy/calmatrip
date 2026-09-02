import { notFound } from "next/navigation";
import { auth } from "@/auth";
import { hasPermission } from "@/features/cms/services/permissions";
import SubmissionInbox from "@/features/cms/components/SubmissionInbox";

export default async function SubmissionInboxPage() {
  const session = await auth();
  if (!hasPermission(session?.user?.role, "forms.submissions.read")) notFound();
  return <SubmissionInbox />;
}
