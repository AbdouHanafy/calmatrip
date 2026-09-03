"use client";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Calendar,
  Car,
  Users,
  CreditCard,
  MapPin,
  Phone,
  MessageCircle,
  Headphones,
  History,
  Backpack,
  HelpCircle,
  FileText,
} from "lucide-react";
import CalmaFooter from "@/components/calma/CalmaFooter";
import Link from "next/link";
import { CalmaLangProvider, useCalmaLang } from "@/lib/calma/i18n";
import { BookingForm } from "@/components/booking/Bookingform";
import { useSession } from "next-auth/react";
import NotificationBell from "@/components/ui/NotificationBell";
import PushToggle from "@/components/ui/PushToggle";
import { useUserBookings } from "@/hooks/useUserBookings";
import { DashboardSidebar, type TabKey } from "@/components/dashboard/DashboardSidebar";
import { BookingCard } from "@/components/dashboard/BookingCard";
import { TripHeroCard } from "@/components/dashboard/TripHeroCard";
import { ReviewModal } from "@/components/dashboard/ReviewModal";
import { CancelBookingModal } from "@/components/dashboard/CancelBookingModal";
import { ActivityDetailsModal } from "@/components/dashboard/ActivityDetailsModal";
import { PaymentsPanel } from "@/components/dashboard/PaymentsPanel";
import { ReviewsPanel } from "@/components/dashboard/ReviewsPanel";
import { ProfilePanel } from "@/components/dashboard/ProfilePanel";
import { ServiceCard } from "@/components/services/ServiceCard";
import { mapService } from "@/lib/services/mapService";
import type { Booking } from "@/components/dashboard/types";

const isPast = (dateStr: string) => new Date(dateStr) < new Date(new Date().toDateString());

function UserDashboardInner() {
  const { t } = useCalmaLang();
  const { data: session } = useSession();
  const { bookings, services, serviceDetailsFor, handleCancelBooking, submitReview } =
    useUserBookings();

  const router = useRouter();
  const searchParams = useSearchParams();
  const requestedTab = searchParams.get("view");
  const initialTab: TabKey = ["bookings", "new", "payments", "reviews", "profile"].includes(
    requestedTab ?? "",
  )
    ? (requestedTab as TabKey)
    : "bookings";
  const [activeTab, setActiveTab] = useState<TabKey>(initialTab);
  useEffect(() => {
    setActiveTab(initialTab);
  }, [initialTab]);
  const changeTab = (tab: TabKey) => {
    setActiveTab(tab);
    router.replace(tab === "bookings" ? "/dashboard" : `/dashboard?view=${tab}`, { scroll: false });
  };
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

  const upcomingBookings = bookings.filter((b) => !isPast(b.date) && b.status !== "cancelled");
  const pastBookings = bookings.filter((b) => isPast(b.date) || b.status === "cancelled");
  // The single most relevant trip to feature — confirmed first, else the next pending one.
  const nextTrip =
    [...upcomingBookings]
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .find((b) => b.status === "confirmed") ??
    upcomingBookings.find((b) => b.status === "pending");
  const otherUpcoming = upcomingBookings.filter((b) => b.id !== nextTrip?.id);
  const hasMoreBookings = otherUpcoming.length > 0 || pastBookings.length > 0;

  const daysUntilNextTrip = nextTrip
    ? Math.round(
        (new Date(nextTrip.date).getTime() - new Date(new Date().toDateString()).getTime()) /
          86_400_000,
      )
    : null;

  const activeBookings = bookings.filter((b) => b.status !== "cancelled");
  const actionRequiredCount = bookings.filter(
    (b) => b.status === "confirmed" && b.paymentStatus === "pending",
  ).length;
  const reviewEligible = bookings.filter(
    (b) => isPast(b.date) && b.status === "confirmed" && !b.review,
  );
  const reviewedBookings = bookings.filter((b) => b.review);

  const bookedTitles = new Set(bookings.map((b) => b.service));
  const recommendedServices = services
    .filter((s) => s.active !== false && !bookedTitles.has(s.title))
    .slice(0, 3)
    .map(mapService);

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
    <div className="min-h-screen bg-calma-sand font-hanken lg:flex lg:items-start">
      <DashboardSidebar
        activeTab={activeTab}
        onTabChange={changeTab}
        upcomingCount={upcomingBookings.length}
        actionRequiredCount={actionRequiredCount}
        toReviewCount={reviewEligible.length}
        userName={session?.user?.name ?? "Voyageur"}
        userInitials={userInitials}
      />

      {/* Main content */}
      <main className="flex-1 overflow-x-hidden bg-calma-sand">
        <div className="hidden border-b border-calma-border bg-white/95 backdrop-blur-sm lg:block">
          <div className="flex items-center justify-between px-8 py-4">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-calma-terracotta">
                {t.dash.welcomeBack}, {session?.user?.name?.split(" ")[0] ?? ""}
              </p>
              <h1 className="font-fraunces text-2xl font-normal text-calma-ink">
                {nextTrip ? `${nextTrip.service} ${t.dash.nextTripSub}` : t.dash.emptyHeaderSub}
              </h1>
            </div>
            <NotificationBell />
          </div>
        </div>

        <div className="mx-auto max-w-[1440px] p-4 sm:p-6 lg:p-8">
          {/* Push notifications */}
          <div className="mb-6">
            <PushToggle />
          </div>

          {activeTab === "bookings" && (
            <>
              {nextTrip ? (
                <>
                  {/* Hero — the single dominant element; everything else stays secondary */}
                  <div className="mb-8">
                    <TripHeroCard
                      booking={nextTrip}
                      service={serviceDetailsFor(nextTrip.service)}
                      onDetails={() => setDetailsBooking(nextTrip)}
                    />
                  </div>

                  {/* Trip at a glance — real fields only, no admin-style status counters */}
                  <h2 className="mb-3 font-fraunces text-lg font-normal text-calma-ink">
                    {t.dash.glanceTitle}
                  </h2>
                  <div className="mb-8 grid grid-cols-2 gap-4 md:grid-cols-4">
                    <div className="rounded-2xl border border-calma-border bg-white p-4">
                      <Calendar className="mb-2 h-5 w-5 text-calma-terracotta" />
                      <p className="text-sm font-bold text-calma-ink">
                        {new Date(nextTrip.date).toLocaleDateString("fr-FR", {
                          day: "numeric",
                          month: "short",
                        })}
                      </p>
                      <p className="text-xs text-calma-taupe">{t.dash.glanceDatesSub}</p>
                    </div>
                    <div className="rounded-2xl border border-calma-border bg-white p-4">
                      <Users className="mb-2 h-5 w-5 text-calma-terracotta" />
                      <p className="text-sm font-bold text-calma-ink">
                        {nextTrip.passengers} {t.dash.travelersCount}
                      </p>
                      <p className="text-xs text-calma-taupe">{t.dash.glanceTravelersSub}</p>
                    </div>
                    <div className="rounded-2xl border border-calma-border bg-white p-4">
                      <CreditCard className="mb-2 h-5 w-5 text-calma-terracotta" />
                      <p className="text-sm font-bold text-calma-ink">
                        {
                          t.dash[
                            nextTrip.paymentStatus === "paid"
                              ? "paymentPaid"
                              : nextTrip.paymentStatus === "refunded"
                                ? "paymentRefunded"
                                : "paymentPending"
                          ]
                        }
                      </p>
                      <p className="text-xs text-calma-taupe">
                        {nextTrip.paymentStatus === "paid"
                          ? t.dash.glancePaymentSubPaid
                          : t.dash.glancePaymentSub}
                      </p>
                    </div>
                    <div className="rounded-2xl border border-calma-border bg-white p-4">
                      <MapPin className="mb-2 h-5 w-5 text-calma-terracotta" />
                      <p className="truncate text-sm font-bold text-calma-ink">{nextTrip.to}</p>
                      <p className="text-xs text-calma-taupe">{t.dash.glanceDestinationLabel}</p>
                    </div>
                  </div>

                  {/* Before your trip — real, clickable, never a dead link */}
                  <h2 className="mb-1 font-fraunces text-lg font-normal text-calma-ink">
                    {t.dash.beforeTitle}
                  </h2>
                  <p className="mb-3 text-sm text-calma-taupe">
                    {daysUntilNextTrip !== null && daysUntilNextTrip <= 3
                      ? t.dash.beforeSubSoon
                      : t.dash.beforeSubGeneral}
                  </p>
                  <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
                    <Link
                      href="/guides"
                      className="rounded-2xl border border-calma-border bg-white p-5 no-underline transition-colors hover:border-calma-terracotta/40"
                    >
                      <Backpack className="mb-3 h-5 w-5 text-calma-terracotta" />
                      <p className="mb-1 text-sm font-semibold text-calma-ink">
                        {t.dash.packingTitle}
                      </p>
                      <p className="text-xs text-calma-taupe">{t.dash.packingDesc}</p>
                    </Link>
                    <Link
                      href="/contact"
                      className="rounded-2xl border border-calma-border bg-white p-5 no-underline transition-colors hover:border-calma-terracotta/40"
                    >
                      <HelpCircle className="mb-3 h-5 w-5 text-calma-terracotta" />
                      <p className="mb-1 text-sm font-semibold text-calma-ink">
                        {t.dash.helpCardTitle}
                      </p>
                      <p className="text-xs text-calma-taupe">{t.dash.helpCardDesc}</p>
                    </Link>
                    <button
                      onClick={() => setDetailsBooking(nextTrip)}
                      className="rounded-2xl border border-calma-border bg-white p-5 text-left transition-colors hover:border-calma-terracotta/40"
                    >
                      <FileText className="mb-3 h-5 w-5 text-calma-terracotta" />
                      <p className="mb-1 text-sm font-semibold text-calma-ink">
                        {t.dash.fullDetailsTitle}
                      </p>
                      <p className="text-xs text-calma-taupe">{t.dash.fullDetailsDesc}</p>
                    </button>
                  </div>
                </>
              ) : (
                <div className="mb-8 rounded-2xl border border-calma-border bg-white p-4 text-center sm:p-12">
                  <Car className="mx-auto mb-4 h-16 w-16 text-calma-border" />
                  <h3 className="mb-2 font-fraunces text-lg font-normal text-calma-ink">
                    {t.dash.emptyTitle}
                  </h3>
                  <p className="mb-4 text-calma-taupe">{t.dash.emptySub}</p>
                  <button
                    onClick={() => changeTab("new")}
                    className="rounded-xl bg-calma-terracotta px-6 py-3 font-semibold text-calma-ink transition-all duration-300 hover:shadow-lg"
                  >
                    {t.dash.createBooking}
                  </button>
                </div>
              )}

              {/* Other / past bookings — only rendered when there's actually something to show */}
              {hasMoreBookings && (
                <div className="mb-8 space-y-8 rounded-2xl border border-calma-border bg-white p-4 md:p-6">
                  {otherUpcoming.length > 0 && (
                    <div>
                      <h3 className="mb-4 flex items-center gap-2 text-sm font-semibold text-calma-ink">
                        <Calendar className="w-4 h-4 text-calma-terracotta" />
                        {nextTrip ? t.dash.otherBookingsTitle : t.dash.upcomingTitle}
                      </h3>
                      <div className="space-y-4">
                        {otherUpcoming.map((booking) => (
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
                        {t.dash.historyTitle}
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

              {/* Recommendations — real catalog services only, excluding anything already booked */}
              {recommendedServices.length > 0 && (
                <div className="mb-8">
                  <h2 className="mb-1 font-fraunces text-lg font-normal text-calma-ink">
                    {t.dash.alsoLikeTitle}
                  </h2>
                  <p className="mb-4 text-sm text-calma-taupe">{t.dash.alsoLikeSub}</p>
                  <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                    {recommendedServices.map((s) => (
                      <ServiceCard key={s.id} service={s} onBook={() => changeTab("new")} />
                    ))}
                  </div>
                </div>
              )}
            </>
          )}

          {activeTab === "new" && (
            <div className="rounded-2xl border border-calma-border bg-white p-4 md:p-8">
              <div className="mx-auto max-w-3xl">
                <div className="mb-8 text-center">
                  <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-calma-terracotta">
                    <Car className="h-8 w-8 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-calma-ink">{t.dash.newBookingTitle}</h2>
                  <p className="mt-2 text-calma-taupe">{t.dash.newBookingSub}</p>
                </div>
                <BookingForm />
              </div>
            </div>
          )}

          {activeTab === "payments" && (
            <div className="mb-8">
              <PaymentsPanel bookings={activeBookings} />
            </div>
          )}

          {activeTab === "reviews" && (
            <div className="mb-8">
              <ReviewsPanel
                eligible={reviewEligible}
                reviewed={reviewedBookings}
                onReview={setReviewBooking}
              />
            </div>
          )}

          {activeTab === "profile" && (
            <div className="mb-8">
              <ProfilePanel />
            </div>
          )}

          {/* Support — deliberately quieter than the hero above */}
          <div className="rounded-2xl border border-calma-border bg-white p-5">
            <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-calma-terracotta/10">
                  <Headphones className="h-5 w-5 text-calma-terracotta" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-calma-ink">{t.dash.needHelpTitle}</h3>
                  <p className="text-xs text-calma-taupe">{t.dash.needHelpSub}</p>
                </div>
              </div>
              <div className="flex gap-2.5">
                <a
                  href="tel:+21621622972"
                  className="flex items-center gap-1.5 rounded-xl border border-calma-border bg-white px-4 py-2 text-sm font-medium text-calma-terracotta transition-colors hover:border-calma-terracotta/40"
                >
                  <Phone className="h-3.5 w-3.5" />
                  {t.dash.callBtn}
                </a>
                <a
                  href="https://wa.me/21621622972"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 rounded-xl bg-calma-terracotta px-4 py-2 text-sm font-medium text-calma-ink transition-colors hover:bg-calma-terracotta-deep"
                >
                  <MessageCircle className="h-3.5 w-3.5" />
                  {t.dash.whatsappBtn}
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
