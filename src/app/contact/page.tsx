import { Contact } from '@/pages/Contact';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact Us — Sahara Tunisia 24/7 Support',
  description: 'Contact Sahara Tunisia for inquiries and bookings. Reach our customer support 24/7 for a hassle-free travel experience.',
};

export default function ContactPage() {
  return <Contact />;
}
