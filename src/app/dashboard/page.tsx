import UserDashboard from "@/views/UserDashboard";
import type { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "My trips",
  description: "Manage your CalmaTrip bookings, payments, reviews and traveler profile.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function DashboardPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-calma-sand" />}>
      <UserDashboard />
    </Suspense>
  );
}
