import WishlistPage from "@/views/WishlistPage";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sahara Marketplace — Premium Tunisian Souvenirs",
  description: "Save authentic Tunisian products from CalmaTrip partners for later.",
};

export default function Wishlist() {
  return <WishlistPage />;
}
