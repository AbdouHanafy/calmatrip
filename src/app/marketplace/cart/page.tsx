import CartPage from "@/views/CartPage";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sahara Marketplace — Premium Tunisian Souvenirs",
  description: "Review products selected from CalmaTrip partners.",
};

export default function Cart() {
  return <CartPage />;
}
