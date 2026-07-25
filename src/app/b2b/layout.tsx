import B2BDashboard from '@/views/b2b/B2BDashboard';

export default function B2BLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <B2BDashboard>{children}</B2BDashboard>;
}
