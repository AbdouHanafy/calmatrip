import CartPage from '@/views/CartPage';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Sahara Marketplace — Premium Tunisian Souvenirs',
  description: 'Shop authentic Tunisian souvenirs, local products, clothing, and accessories from the official Sahara Tunisia store.',
};

export default function Cart() {
  return <CartPage />;
}
