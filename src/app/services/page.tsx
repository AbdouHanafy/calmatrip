import Services from '@/views/Services';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Our Services — Sahara Tunisia Transport & Tours',
  description: 'Discover our premium travel services in Tunisia, including VIP airport transfers, group transport, and private excursions.',
};

export default function ServicesPage() {
  return <Services />;
}
