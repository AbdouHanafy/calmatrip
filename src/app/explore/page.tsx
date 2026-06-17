import ExplorePage  from '@/views/ExplorePage';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Explore Tunisia — Discover Local Favourites | Calmatrip',
  description: 'Explore the best sights, food, and activities in Tunisia. Hand-picked recommendations for an authentic travel experience with Calmatrip.',
};

export default function Explore() {
  return <ExplorePage />;
}
