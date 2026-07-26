"use client";
import { useState } from "react";
import {
  Calendar,
  Car,
  CheckCircle,
  XCircle,
  AlertCircle,
  ChevronRight,
  Phone,
  MessageCircle,
  Headphones,
  History,
} from "lucide-react";
import CalmaFooter from "@/components/calma/CalmaFooter";
import { CalmaLangProvider } from "@/lib/calma/i18n";
import { BookingForm } from "@/components/booking/Bookingform";
import { useSession } from "next-auth/react";
import NotificationBell from "@/components/ui/NotificationBell";
import PushToggle from "@/components/ui/PushToggle";
import { useUserBookings } from "@/hooks/useUserBookings";
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";
import { BookingCard } from "@/components/dashboard/BookingCard";
import { ReviewModal } from "@/components/dashboard/ReviewModal";
import { CancelBookingModal } from "@/components/dashboard/CancelBookingModal";
import { ActivityDetailsModal } from "@/components/dashboard/ActivityDetailsModal";
import type { Booking } from "@/components/dashboard/types";

const isPast = (dateStr: string) => new Date(dateStr) < new Date(new Date().toDateString());

function UserDashboardInner() {
  const { data: session } = useSession();
  const { bookings, serviceDetailsFor, handleCancelBooking, submitReview } = useUserBookings();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"bookings" | "new">("bookings");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
  const [detailsBooking, setDetailsBooking] = useState<Booking | null>(null);
  const [reviewBooking, setReviewBooking] = useState<Booking | null>(null);

  const userInitials =
    session?.user?.name
      ?.split(" ")
      .map((n) => n[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() ?? "MO";

  const stats = [
    { label: "Total", value: bookings.length, icon: Calendar },
    {
      label: "Confirmées",
      value: bookings.filter((b) => b.status === "confirmed").length,
      icon: CheckCircle,
    },
    {
      label: "En attente",
      value: bookings.filter((b) => b.status === "pending").length,
      icon: AlertCircle,
    },
    {
      label: "Annulées",
      value: bookings.filter((b) => b.status === "cancelled").length,
      icon: XCircle,
    },
  ];

  const upcomingTrips = bookings
    .filter((b) => b.status === "confirmed" && !isPast(b.date))
    .slice(0, 2);
  const upcomingBookings = bookings.filter((b) => !isPast(b.date));
  const pastBookings = bookings.filter((b) => isPast(b.date));

  const confirmCancel = async () => {
    if (!showDeleteConfirm) return;
    await handleCancelBooking(showDeleteConfirm);
    setShowDeleteConfirm(null);
  };

  const handleSubmitReview = async (rating: number, comment: string) => {
    if (!reviewBooking) return;
    const success = await submitReview(reviewBooking.id, rating, comment);
    if (success) setReviewBooking(null);
  };

  return (
    <div className="min-h-screen bg-calma-sand font-hanken flex">
      <DashboardSidebar
        sidebarOpen={sidebarOpen}
        onToggleSidebar={() => setSidebarOpen((v) => !v)}
        onCloseSidebar={() => setSidebarOpen(false)}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      {/* Main content */}
      <main className="flex-1 overflow-x-hidden">
        <div className="sticky top-0 z-30 bg-white/95 backdrop-blur-sm border-b border-calma-border">
          <div className="px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              <div className="hidden lg:block">
                <h1 className="font-fraunces text-2xl font-normal text-calma-ink">
                  Bonjour, {session?.user?.name ?? "voyageur"} 👋
                </h1>
                <p className="text-sm text-calma-taupe">Bienvenue dans votre espace personnel</p>
              </div>

              <div className="flex items-center gap-4 ml-auto lg:ml-0">
                <NotificationBell />
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-calma-terracotta flex items-center justify-center">
                    <span className="text-white text-sm font-bold">{userInitials}</span>
                  </div>
                  <div className="hidden md:block">
                    <p className="text-sm font-semibold text-calma-ink">
                      {session?.user?.name ?? "Voyageur"}
                    </p>
                    <p className="text-xs text-calma-taupe">{session?.user?.email ?? ""}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="p-4 sm:p-6 lg:p-8">
          {/* Push notifications */}
          <div className="mb-6">
            <PushToggle />
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-8">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl p-5 shadow-sm hover:shadow-lg transition-all duration-300 border border-calma-border"
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p className="text-xs text-calma-taupe uppercase tracking-wider">
                      {stat.label}
                    </p>
                    <p className="text-3xl font-bold mt-1 text-calma-ink">{stat.value}</p>
                  </div>
                  <div className="w-10 h-10 rounded-xl bg-calma-terracotta/10 flex items-center justify-center">
                    <stat.icon className="w-5 h-5 text-calma-terracotta" />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Content card */}
          <div className="bg-white rounded-2xl shadow-sm border border-calma-border overflow-hidden">
            {activeTab === "bookings" && upcomingTrips.length > 0 && (
              <div className="bg-calma-terracotta/[.04] border-b border-calma-border p-4 md:p-6">
                <h3 className="text-sm font-semibold text-calma-ink mb-3 flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-calma-terracotta" />
                  Prochains voyages
                </h3>
                <div className="flex flex-wrap gap-4">
                  {upcomingTrips.map((trip) => (
                    <div
                      key={trip.id}
                      className="bg-white rounded-xl p-3 shadow-sm flex items-center gap-3 border border-calma-border"
                    >
                      <div className="w-10 h-10 rounded-lg bg-calma-terracotta flex items-center justify-center">
                        <Car className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-calma-ink">{trip.service}</p>
                        <p className="text-xs text-calma-taupe">
                          {new Date(trip.date).toLocaleDateString("fr-FR", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })}{" "}
                          à {trip.time}
                        </p>
                      </div>
                      <ChevronRight className="w-4 h-4 text-calma-taupe" />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === "bookings" && (
              <div className="p-4 md:p-6">
                {bookings.length === 0 ? (
                  <div className="text-center py-12">
                    <Car className="w-16 h-16 text-calma-border mx-auto mb-4" />
                    <p className="text-calma-taupe mb-4">Aucune réservation pour le moment</p>
                    <button
                      onClick={() => setActiveTab("new")}
                      className="px-6 py-3 bg-calma-terracotta text-white rounded-xl font-semibold hover:shadow-lg transition-all duration-300"
                    >
                      Créer une réservation
                    </button>
                  </div>
                ) : (
                  <div className="space-y-8">
                    {upcomingBookings.length > 0 && (
                      <div>
                        <h3 className="mb-4 flex items-center gap-2 text-sm font-semibold text-calma-ink">
                          <Calendar className="w-4 h-4 text-calma-terracotta" />À venir
                        </h3>
                        <div className="space-y-4">
                          {upcomingBookings.map((booking) => (
                            <BookingCard
                              key={booking.id}
                              booking={booking}
                              past={false}
                              onCancel={() => setShowDeleteConfirm(booking.id)}
                              onDetails={() => setDetailsBooking(booking)}
                              onReview={() => setReviewBooking(booking)}
                            />
                          ))}
                        </div>
                      </div>
                    )}

                    {pastBookings.length > 0 && (
                      <div>
                        <h3 className="mb-4 flex items-center gap-2 text-sm font-semibold text-calma-ink">
                          <History className="w-4 h-4 text-calma-taupe" />
                          Historique
                        </h3>
                        <div className="space-y-4">
                          {pastBookings.map((booking) => (
                            <BookingCard
                              key={booking.id}
                              booking={booking}
                              past
                              onCancel={() => setShowDeleteConfirm(booking.id)}
                              onDetails={() => setDetailsBooking(booking)}
                              onReview={() => setReviewBooking(booking)}
                            />
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {activeTab === "new" && (
              <div className="p-4 md:p-8">
                <div className="max-w-3xl mx-auto">
                  <div className="text-center mb-8">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-calma-terracotta flex items-center justify-center">
                      <Car className="w-8 h-8 text-white" />
                    </div>
                    <h2 className="text-2xl font-bold text-calma-ink">Nouvelle réservation</h2>
                    <p className="text-calma-taupe mt-2">
                      Remplissez le formulaire pour réserver votre prochain trajet
                    </p>
                  </div>
                  <BookingForm />
                </div>
              </div>
            )}
          </div>

          {/* Quick support */}
          <div className="mt-8 bg-white rounded-2xl p-6 border border-calma-border">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-calma-terracotta/10 flex items-center justify-center">
                  <Headphones className="w-6 h-6 text-calma-terracotta" />
                </div>
                <div>
                  <h3 className="font-semibold text-calma-ink">Besoin d&apos;aide ?</h3>
                  <p className="text-sm text-calma-taupe">Notre équipe est disponible 24/7</p>
                </div>
              </div>
              <div className="flex gap-3">
                <a
                  href="tel:+21621622972"
                  className="px-5 py-2.5 bg-white text-calma-terracotta rounded-xl font-medium hover:shadow-md transition-all duration-300 flex items-center gap-2 border border-calma-border"
                >
                  <Phone className="w-4 h-4" />
                  <span>Appeler</span>
                </a>
                <a
                  href="https://wa.me/21621622972"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-5 py-2.5 bg-calma-terracotta text-white rounded-xl font-medium hover:shadow-lg transition-all duration-300 flex items-center gap-2"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>WhatsApp</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </main>

      {showDeleteConfirm && (
        <CancelBookingModal onCancel={() => setShowDeleteConfirm(null)} onConfirm={confirmCancel} />
      )}

      {detailsBooking && (
        <ActivityDetailsModal
          booking={detailsBooking}
          info={serviceDetailsFor(detailsBooking.service)}
          onClose={() => setDetailsBooking(null)}
        />
      )}

      {reviewBooking && (
        <ReviewModal
          booking={reviewBooking}
          onClose={() => setReviewBooking(null)}
          onSubmit={handleSubmitReview}
        />
      )}

      <style>{`
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes scale-up {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-fade-in { animation: fade-in 0.3s ease-out forwards; }
        .animate-scale-up { animation: scale-up 0.3s ease-out forwards; }
      `}</style>
    </div>
  );
}

export default function UserDashboard() {
  return (
    <CalmaLangProvider>
      <UserDashboardInner />
      <CalmaFooter />
    </CalmaLangProvider>
  );
}
