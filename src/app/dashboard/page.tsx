import { UserDashboard } from '@/pages/UserDashboard';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'My Bookings — Sahara Tunisia Dashboard',
  description: 'Manage your bookings and reservations with Sahara Tunisia Travel.',
  robots: {
    index: false,
    follow: false,
  },
};

export default function DashboardPage() {
  return <UserDashboard />;
}
