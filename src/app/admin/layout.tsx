import { AdminDashboard } from '@/pages/admin/AdminDashboard';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AdminDashboard>{children}</AdminDashboard>;
}
