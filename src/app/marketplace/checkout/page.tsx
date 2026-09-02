import CheckoutPage from "@/views/CheckoutPage";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sahara Marketplace — Premium Tunisian Souvenirs",
  description: "Complete your CalmaTrip marketplace order securely.",
};

export default function Checkout() {
  return <CheckoutPage />;
}
