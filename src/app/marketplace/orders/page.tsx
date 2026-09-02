import OrdersPage from "@/views/OrdersPage";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sahara Marketplace — Premium Tunisian Souvenirs",
  description: "Track your CalmaTrip marketplace orders.",
};

export default function Orders() {
  return <OrdersPage />;
}
