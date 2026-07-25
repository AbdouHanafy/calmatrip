"use client";
import { useState, useEffect } from "react";
import {
  Calendar,
  Car,
  Clock,
  MapPin,
  Plus,
  CheckCircle,
  XCircle,
  AlertCircle,
  Trash2,
  User,
  ChevronRight,
  Phone,
  MessageCircle,
  Repeat,
  Headphones,
  LayoutDashboard,
  LogOut,
  Menu,
  X,
  Star,
  Info,
  History,
} from "lucide-react";
import Link from "next/link";
import { signOut } from "next-auth/react";
import CalmaFooter from "@/components/calma/CalmaFooter";
import { CalmaLangProvider } from "@/lib/calma/i18n";
import { BookingForm } from "@/components/booking/Bookingform";
import { useSession } from "next-auth/react";
import NotificationBell from "@/components/ui/NotificationBell";
import PushToggle from "@/components/ui/PushToggle";

type Booking = {
  id: string;
  service: string;
  date: string;
  time: string;
  from: string;
  to: string;
  status: "confirmed" | "pending" | "cancelled";
  price: string;
  driver?: string;
  vehicle?: string;
  tripType: "one-way" | "round-trip";
  returnDate?: string | null;
  returnTime?: string | null;
  review?: { id: number; rating: number; comment: string; approved: boolean } | null;
};

type ServiceInfo = {
  id: number;
  title: string;
  description: string;
  image: string | null;
  category: string | null;
  duration: string | null;
};

function BookingStatusBadge({ status }: { status: Booking["status"] }) {
  const styles = {
    confirmed: "bg-calma-success/10 text-calma-success border-calma-success/20",
    pending: "bg-calma-gold/10 text-[#8A6B2E] border-calma-gold/25",
    cancelled: "bg-red-50 text-red-500 border-red-200",
  };
  const icons = { confirmed: CheckCircle, pending: AlertCircle, cancelled: XCircle };
  const labels = { confirmed: "Confirmée", pending: "En attente", cancelled: "Annulée" };
  const Icon = icons[status];
  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium border ${styles[status]}`}>
      <Icon className="w-4 h-4" />
      {labels[status]}
    </span>
  );
}

function BookingCard({
  booking,
  past,
  onCancel,
  onDetails,
  onReview,
}: {
  booking: Booking;
  past: boolean;
  onCancel: () => void;
  onDetails: () => void;
  onReview: () => void;
}) {
  const canReview = past && booking.status === "confirmed";

  return (
    <div className="border border-calma-border rounded-xl p-4 md:p-6 hover:shadow-md transition-all duration-300 bg-white">
      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
        <div className="flex-1">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-calma-terracotta flex items-center justify-center">
                <Car className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-lg font-bold text-calma-ink">{booking.service}</h3>
              <span
                className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold border ${
                  booking.tripType === "round-trip"
                    ? "bg-calma-olive/10 text-calma-olive border-calma-olive/20"
                    : "bg-calma-sand text-calma-taupe border-calma-border"
                }`}
              >
                <Repeat className="w-3 h-3" />
                {booking.tripType === "round-trip" ? "Aller-retour" : "Aller simple"}
              </span>
            </div>
            <BookingStatusBadge status={booking.status} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
            <div className="flex items-center text-calma-taupe">
              <Calendar className="w-4 h-4 mr-2 text-calma-terracotta" />
              <span>{new Date(booking.date).toLocaleDateString("fr-FR", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}</span>
            </div>
            <div className="flex items-center text-calma-taupe">
              <Clock className="w-4 h-4 mr-2 text-calma-terracotta" />
              <span>{booking.time}</span>
            </div>
            <div className="flex items-start md:col-span-2">
              <MapPin className="w-4 h-4 mr-2 text-calma-terracotta mt-0.5 flex-shrink-0" />
              <div>
                <div className="font-medium text-calma-ink">Départ : {booking.from}</div>
                <div className="text-calma-taupe mt-1">Destination : {booking.to}</div>
              </div>
            </div>

            {booking.tripType === "round-trip" && booking.returnDate && (
              <div className="md:col-span-2 mt-2 pt-3 border-t border-dashed border-calma-border">
                <div className="flex items-center gap-2 text-xs font-semibold text-calma-olive mb-2">
                  <Repeat className="w-3.5 h-3.5" />
                  Trajet retour
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="flex items-center text-calma-taupe">
                    <Calendar className="w-4 h-4 mr-2 text-calma-olive" />
                    <span>
                      {new Date(booking.returnDate).toLocaleDateString("fr-FR", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
                    </span>
                  </div>
                  {booking.returnTime && (
                    <div className="flex items-center text-calma-taupe">
                      <Clock className="w-4 h-4 mr-2 text-calma-olive" />
                      <span>{booking.returnTime}</span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {(booking.driver || booking.vehicle) && (
            <div className="mt-4 pt-3 border-t border-calma-border flex flex-wrap gap-4 text-xs">
              {booking.driver && (
                <div className="flex items-center gap-1 text-calma-taupe">
                  <User className="w-3 h-3" />
                  <span>Chauffeur : {booking.driver}</span>
                </div>
              )}
              {booking.vehicle && (
                <div className="flex items-center gap-1 text-calma-taupe">
                  <Car className="w-3 h-3" />
                  <span>Véhicule : {booking.vehicle}</span>
                </div>
              )}
            </div>
          )}

          <div className="mt-4 flex flex-wrap gap-2 pt-3 border-t border-calma-border">
            <button
              onClick={onDetails}
              className="inline-flex items-center gap-1.5 rounded-lg border border-calma-border px-3 py-1.5 text-xs font-semibold text-calma-ink transition-colors hover:border-calma-terracotta/40 hover:text-calma-terracotta"
            >
              <Info className="w-3.5 h-3.5" />
              Détails de l&apos;activité
            </button>

            {canReview && !booking.review && (
              <button
                onClick={onReview}
                className="inline-flex items-center gap-1.5 rounded-lg bg-calma-terracotta/10 px-3 py-1.5 text-xs font-semibold text-calma-terracotta transition-colors hover:bg-calma-terracotta/20"
              >
                <Star className="w-3.5 h-3.5" />
                Laisser un avis
              </button>
            )}

            {booking.review && (
              <span className="inline-flex items-center gap-1.5 rounded-lg bg-calma-success/10 px-3 py-1.5 text-xs font-semibold text-calma-success">
                <CheckCircle className="w-3.5 h-3.5" />
                Avis envoyé · {booking.review.rating}/5
                {!booking.review.approved && <span className="text-calma-taupe font-normal">(en validation)</span>}
              </span>
            )}
          </div>
        </div>

        <div className="flex flex-row lg:flex-col items-center lg:items-end gap-3 lg:gap-2">
          <div className="text-xl font-bold text-calma-terracotta">{booking.price}</div>
          {!past && booking.status !== "cancelled" && (
            <button
              onClick={onCancel}
              className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-all duration-200"
              aria-label="Annuler la réservation"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function ReviewModal({
  booking,
  onClose,
  onSubmit,
}: {
  booking: Booking;
  onClose: () => void;
  onSubmit: (rating: number, comment: string) => Promise<void>;
}) {
  const [rating, setRating] = useState(0);
  const [hovered, setHovered] = useState(0);
  const [comment, setComment] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    if (rating === 0) {
      setError("Veuillez sélectionner une note.");
      return;
    }
    if (comment.trim().length < 10) {
      setError("Votre commentaire doit contenir au moins 10 caractères.");
      return;
    }
    setError("");
    setSaving(true);
    await onSubmit(rating, comment.trim());
    setSaving(false);
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in" onClick={onClose}>
      <div className="bg-white rounded-2xl p-6 max-w-md w-full animate-scale-up" onClick={(e) => e.stopPropagation()}>
        <div className="mb-4 flex items-start justify-between gap-3">
          <div>
            <h3 className="text-lg font-bold text-calma-ink">Laisser un avis</h3>
            <p className="text-sm text-calma-taupe">{booking.service}</p>
          </div>
          <button onClick={onClose} className="text-calma-taupe hover:text-calma-ink">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="mb-4 flex items-center gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setRating(star)}
              onMouseEnter={() => setHovered(star)}
              onMouseLeave={() => setHovered(0)}
              className="transition-transform hover:scale-110"
            >
              <Star
                size={28}
                className={star <= (hovered || rating) ? "fill-calma-gold text-calma-gold" : "text-calma-border"}
              />
            </button>
          ))}
        </div>

        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          rows={4}
          placeholder="Comment s'est passée votre expérience ?"
          className="w-full resize-none rounded-xl border border-calma-border bg-calma-sand/40 px-4 py-3 text-sm text-calma-ink outline-none transition-colors focus:border-calma-terracotta focus:bg-white"
        />

        {error && <p className="mt-2 rounded-lg bg-red-50 px-3 py-2 text-xs text-red-600">{error}</p>}

        <button
          onClick={handleSubmit}
          disabled={saving}
          className="mt-4 w-full rounded-xl bg-calma-terracotta py-3 font-semibold text-white transition-shadow hover:shadow-lg disabled:opacity-60"
        >
          {saving ? "Envoi..." : "Envoyer mon avis"}
        </button>
      </div>
    </div>
  );
}

function UserDashboardInner() {
  const { data: session } = useSession();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"bookings" | "new">("bookings");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [services, setServices] = useState<ServiceInfo[]>([]);
  const [detailsBooking, setDetailsBooking] = useState<Booking | null>(null);
  const [reviewBooking, setReviewBooking] = useState<Booking | null>(null);

  const userInitials =
    session?.user?.name
      ?.split(" ")
      .map((n) => n[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() ?? "MO";

  const fetchServices = async () => {
    try {
      const res = await fetch("/api/services");
      if (res.ok) setServices(await res.json());
    } catch (e) {
      console.error(e);
    }
  };

  const fetchBookings = async () => {
    if (!session?.user?.email) return;
    try {
      const res = await fetch(`/api/bookings?email=${encodeURIComponent(session.user.email)}`);
      if (res.ok) {
        const data = await res.json();
        setBookings(
          data.map((b: any) => ({
            id: b.id.toString(),
            service: b.service || "Transfert aéroport",
            date: b.date.split("T")[0],
            time: b.time,
            from: b.fromLocation || "—",
            to: b.toLocation || "—",
            status: b.status.toLowerCase(),
            price: b.price ? `${b.price} TND` : "À confirmer",
            tripType: b.tripType || "one-way",
            returnDate: b.returnDate ? b.returnDate.split("T")[0] : null,
            returnTime: b.returnTime || null,
            driver: b.driver,
            vehicle: b.vehicle,
            review: b.review ?? null,
          })),
        );
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, [session?.user?.email]);

  useEffect(() => {
    fetchServices();
  }, []);

  const serviceDetailsFor = (title: string) => services.find((s) => s.title === title) ?? null;

  const isPast = (dateStr: string) => new Date(dateStr) < new Date(new Date().toDateString());

  const stats = [
    { label: "Total", value: bookings.length, icon: Calendar },
    { label: "Confirmées", value: bookings.filter((b) => b.status === "confirmed").length, icon: CheckCircle },
    { label: "En attente", value: bookings.filter((b) => b.status === "pending").length, icon: AlertCircle },
    { label: "Annulées", value: bookings.filter((b) => b.status === "cancelled").length, icon: XCircle },
  ];

  const upcomingTrips = bookings.filter((b) => b.status === "confirmed" && !isPast(b.date)).slice(0, 2);
  const upcomingBookings = bookings.filter((b) => !isPast(b.date));
  const pastBookings = bookings.filter((b) => isPast(b.date));

  const handleCancelBooking = async (id: string) => {
    try {
      const res = await fetch(`/api/bookings/${id}/cancel`, { method: "PATCH" });
      const data = await res.json();
      if (res.ok) {
        setBookings((prev) => prev.map((b) => (b.id === id ? { ...b, status: "cancelled" } : b)));
      } else {
        alert(data.error || "Échec de l'annulation.");
      }
    } catch (e) {
      console.error(e);
      alert("Erreur lors de l'annulation.");
    } finally {
      setShowDeleteConfirm(null);
    }
  };

  const submitReview = async (bookingId: string, rating: number, comment: string) => {
    const res = await fetch(`/api/bookings/${bookingId}/review`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ rating, comment }),
    });
    const data = await res.json();
    if (!res.ok) {
      alert(data.error || "Échec de l'envoi de l'avis.");
      return;
    }
    setBookings((prev) =>
      prev.map((b) => (b.id === bookingId ? { ...b, review: { id: data.id, rating: data.rating, comment: data.comment, approved: false } } : b)),
    );
    setReviewBooking(null);
  };

  const navItems = [
    { key: "bookings" as const, label: "Mes réservations", icon: Calendar },
    { key: "new" as const, label: "Nouvelle réservation", icon: Plus },
  ];

  return (
    <div className="min-h-screen bg-calma-sand font-hanken flex">
      {/* Mobile menu button */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-white rounded-xl shadow-lg border border-calma-border"
      >
        {sidebarOpen ? <X className="w-5 h-5 text-calma-terracotta" /> : <Menu className="w-5 h-5 text-calma-taupe" />}
      </button>

      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar — deep terracotta, the traveler space's identity color */}
      <aside
        className={`
          fixed lg:relative z-40 w-72 bg-gradient-to-b from-[#4A2818] via-[#5C3620] to-[#4A2818] text-calma-cream flex flex-col shadow-2xl
          transition-transform duration-300 ease-in-out
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        `}
      >
        <div className="p-6 border-b border-white/10">
          <div className="flex items-center space-x-3 mb-2">
            <div className="w-12 h-12 rounded-xl bg-calma-terracotta flex items-center justify-center shadow-lg">
              <LayoutDashboard className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="font-fraunces text-xl font-normal text-calma-cream">Mon espace</h2>
              <p className="text-xs text-calma-cream/50">Calma Trip</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-4">
          <div className="mb-6">
            <p className="text-xs uppercase tracking-wider text-calma-cream/40 mb-3 px-4">Menu</p>
            <div className="space-y-1.5">
              {navItems.map((item) => (
                <button
                  key={item.key}
                  onClick={() => {
                    setActiveTab(item.key);
                    setSidebarOpen(false);
                  }}
                  className={`w-full group flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-300 ${
                    activeTab === item.key
                      ? "bg-calma-terracotta/[.18] text-calma-cream border border-calma-terracotta/25"
                      : "text-calma-cream/70 hover:bg-white/5 hover:text-calma-cream"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <item.icon className={`w-5 h-5 transition-colors ${activeTab === item.key ? "text-calma-terracotta-soft" : ""}`} />
                    <span className="font-medium text-sm">{item.label}</span>
                  </div>
                  {activeTab === item.key && <div className="w-1.5 h-1.5 rounded-full bg-calma-terracotta-soft" />}
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className="text-xs uppercase tracking-wider text-calma-cream/40 mb-3 px-4">Navigation</p>
            <div className="space-y-1.5">
              <Link
                href="/"
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-calma-cream/70 hover:bg-white/5 hover:text-calma-cream transition-all duration-300"
              >
                <ChevronRight className="w-5 h-5 rotate-180" />
                <span className="font-medium text-sm">Retour au site</span>
              </Link>
              <button
                onClick={() => signOut({ callbackUrl: "/" })}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-calma-cream/70 hover:bg-red-500/10 hover:text-red-300 transition-all duration-300"
              >
                <LogOut className="w-5 h-5" />
                <span className="font-medium text-sm">Se déconnecter</span>
              </button>
            </div>
          </div>
        </nav>

        <div className="p-4 border-t border-white/10">
          <p className="text-xs text-center text-calma-cream/40">© 2026 Calma Trip</p>
        </div>
      </aside>

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
                    <p className="text-sm font-semibold text-calma-ink">{session?.user?.name ?? "Voyageur"}</p>
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
                    <p className="text-xs text-calma-taupe uppercase tracking-wider">{stat.label}</p>
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
                    <div key={trip.id} className="bg-white rounded-xl p-3 shadow-sm flex items-center gap-3 border border-calma-border">
                      <div className="w-10 h-10 rounded-lg bg-calma-terracotta flex items-center justify-center">
                        <Car className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-calma-ink">{trip.service}</p>
                        <p className="text-xs text-calma-taupe">
                          {new Date(trip.date).toLocaleDateString("fr-FR", { day: "numeric", month: "short", year: "numeric" })} à {trip.time}
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
                          <Calendar className="w-4 h-4 text-calma-terracotta" />
                          À venir
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
                    <p className="text-calma-taupe mt-2">Remplissez le formulaire pour réserver votre prochain trajet</p>
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

      {/* Cancel confirmation modal */}
      {showDeleteConfirm && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in"
          onClick={() => setShowDeleteConfirm(null)}
        >
          <div className="bg-white rounded-2xl p-6 max-w-md w-full animate-scale-up" onClick={(e) => e.stopPropagation()}>
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-100 flex items-center justify-center">
                <Trash2 className="w-8 h-8 text-red-500" />
              </div>
              <h3 className="text-xl font-bold text-calma-ink mb-2">Annuler la réservation</h3>
              <p className="text-calma-taupe mb-6">Êtes-vous sûr de vouloir annuler cette réservation ? Cette action est irréversible.</p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowDeleteConfirm(null)}
                  className="flex-1 px-4 py-2.5 border border-calma-border text-calma-ink rounded-xl font-medium hover:bg-calma-sand transition-colors"
                >
                  Non, garder
                </button>
                <button
                  onClick={() => handleCancelBooking(showDeleteConfirm)}
                  className="flex-1 px-4 py-2.5 bg-red-500 text-white rounded-xl font-medium hover:bg-red-600 transition-colors"
                >
                  Oui, annuler
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Activity details modal */}
      {detailsBooking && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in"
          onClick={() => setDetailsBooking(null)}
        >
          <div className="bg-white rounded-2xl max-w-lg w-full animate-scale-up overflow-hidden" onClick={(e) => e.stopPropagation()}>
            {(() => {
              const info = serviceDetailsFor(detailsBooking.service);
              return (
                <>
                  {info?.image && (
                    <div className="relative h-44 w-full bg-calma-sand">
                      <img src={info.image} alt={detailsBooking.service} className="h-full w-full object-cover" />
                    </div>
                  )}
                  <div className="p-6">
                    <div className="mb-3 flex items-start justify-between gap-3">
                      <h3 className="text-xl font-bold text-calma-ink">{detailsBooking.service}</h3>
                      <button onClick={() => setDetailsBooking(null)} className="text-calma-taupe hover:text-calma-ink">
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                    <div className="mb-4 flex flex-wrap gap-2">
                      <BookingStatusBadge status={detailsBooking.status} />
                      {info?.category && (
                        <span className="rounded-full bg-calma-olive/10 px-3 py-1 text-xs font-semibold text-calma-olive">{info.category}</span>
                      )}
                      {info?.duration && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-calma-sand px-3 py-1 text-xs font-semibold text-calma-taupe">
                          <Clock className="w-3 h-3" />
                          {info.duration}
                        </span>
                      )}
                    </div>
                    <p className="text-sm leading-relaxed text-calma-taupe">
                      {info?.description ?? "Détails de l'activité non disponibles pour le moment."}
                    </p>
                    <div className="mt-5 grid grid-cols-2 gap-3 rounded-xl bg-calma-sand/60 p-4 text-sm">
                      <div>
                        <p className="text-xs uppercase tracking-wide text-calma-taupe">Date</p>
                        <p className="font-medium text-calma-ink">
                          {new Date(detailsBooking.date).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs uppercase tracking-wide text-calma-taupe">Heure</p>
                        <p className="font-medium text-calma-ink">{detailsBooking.time}</p>
                      </div>
                      <div className="col-span-2">
                        <p className="text-xs uppercase tracking-wide text-calma-taupe">Trajet</p>
                        <p className="font-medium text-calma-ink">{detailsBooking.from} → {detailsBooking.to}</p>
                      </div>
                    </div>
                  </div>
                </>
              );
            })()}
          </div>
        </div>
      )}

      {/* Review modal */}
      {reviewBooking && (
        <ReviewModal
          booking={reviewBooking}
          onClose={() => setReviewBooking(null)}
          onSubmit={(rating, comment) => submitReview(reviewBooking.id, rating, comment)}
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
