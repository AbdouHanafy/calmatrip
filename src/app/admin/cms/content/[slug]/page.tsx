import ContentEntryEditor from "@/features/cms/components/ContentEntryEditor";
export default async function NewContentEntryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  return <ContentEntryEditor contentTypeSlug={(await params).slug} />;
}
