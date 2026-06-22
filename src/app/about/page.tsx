import About from '@/views/About';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About Us — Sahara Tunisia Travel',
  description: 'Learn about Sahara Tunisia Travel. We provide premium excursion, transport, and travel experiences since 2023.',
};

export default function AboutPage() {
  return <About />;
}
