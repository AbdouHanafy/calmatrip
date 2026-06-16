import { Home as HomeComponent } from '@/pages/Home';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Calmatrip — Premium Transport & Excursions',
  description: 'Book reliable airport transfers and amazing excursions securely with Calmatrip.',
};

export default function HomePage() {
  return <HomeComponent />;
}
