'use client';
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
  Edit,
  Trash2,
  User,
  Star,
  Award,
  TrendingUp,
  ChevronRight,
  Phone,
  Mail,
  Settings,

  Menu,
  Headphones,
} from "lucide-react";
import Link from "next/link";
import { Navbar } from '@/components/layouts/Navbar';
import { Footer } from '@/components/layouts/Footre';
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
};

export default function UserDashboard() {
  const { data: session, status } = useSession();
  const [activeTab, setActiveTab] = useState<"bookings" | "new">("bookings");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);

  const [bookings, setBookings] = useState<Booking[]>([]);

  const fetchBookings = async () => {
  if (!session?.user?.email) return;

  try {
    const res = await fetch(`/api/bookings?email=${encodeURIComponent(session.user.email)}`);

    if (res.ok) {
      const data = await res.json();
      setBookings(data.map((b: any) => ({
        id: b.id.toString(),
        service: b.service || "Airport Transfer",
        date: b.date.split('T')[0],
        time: b.time, // already stored as a string like "09:00"
        from: b.fromLocation || "Unknown",
        to: b.toLocation || "Unknown",
        status: b.status.toLowerCase(),
        price: b.price ? `${b.price} TND` : "TBD",
        passengers: b.passengers?.toString(),
      })));
    }
  } catch (e) {
    console.error(e);
  }
};

useEffect(() => {
  fetchBookings();
}, [session?.user?.email]);

  useEffect(() => {
    fetchBookings();
  }, []);

  const [newBooking, setNewBooking] = useState({
    service: "",
    date: "",
    time: "",
    from: "",
    to: "",
    passengers: "1",
    specialRequests: "",
  });

  const getStatusBadge = (status: Booking["status"]) => {
    const styles = {
      confirmed: "bg-gradient-to-r from-[#4CAF50]/10 to-[#45A049]/10 text-[#4CAF50] border-[#4CAF50]/20",
      pending: "bg-gradient-to-r from-[#FFD700]/10 to-[#FFC107]/10 text-[#FFD700] border-[#FFD700]/20",
      cancelled: "bg-gradient-to-r from-red-500/10 to-red-600/10 text-red-500 border-red-500/20",
    };

    const icons = {
      confirmed: CheckCircle,
      pending: AlertCircle,
      cancelled: XCircle,
    };

    const labels = {
      confirmed: "Confirmed",
      pending: "Pending",
      cancelled: "Cancelled",
    };

    const Icon = icons[status];

    return (
      <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium border ${styles[status]}`}>
        <Icon className="w-4 h-4 mr-1.5" />
        {labels[status]}
      </span>
    );
  };

  const handleSubmitBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Build proper ISO datetime string out of date and time
      const datetime = new Date(`${newBooking.date}T${newBooking.time}`).toISOString();
      const payload = {
        userId: 1, // hardcoded for UI purposes
        serviceId: 1, // ideally chosen from select, mapped properly
        date: datetime,
        pickupLocation: newBooking.from,
        dropoffLocation: newBooking.to,
        passengers: parseInt(newBooking.passengers) || 1,
        status: "PENDING"
      };

      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        alert("✅ Booking created successfully! Our team will contact you within 30 minutes.");
        setNewBooking({ service: "", date: "", time: "", from: "", to: "", passengers: "1", specialRequests: "" });
        setActiveTab("bookings");
        fetchBookings();
      } else {
        alert("Failed to submit booking.");
      }
    } catch (e) {
      console.error(e);
      alert("Error submitting booking.");
    }
  };

  const stats = [
    {
      label: "Total Bookings",
      value: bookings.length,
      icon: Calendar,
      gradient: "from-[#87CEEB] to-[#4CAF50]",
      textColor: "text-[#87CEEB]",
      bgGradient: "from-[#87CEEB] to-[#4CAF50]",
    },
    {
      label: "Confirmed",
      value: bookings.filter((b) => b.status === "confirmed").length,
      icon: CheckCircle,
      gradient: "from-[#4CAF50] to-[#45A049]",
      textColor: "text-[#4CAF50]",
      bgGradient: "from-[#4CAF50] to-[#45A049]",
    },
    {
      label: "Pending",
      value: bookings.filter((b) => b.status === "pending").length,
      icon: AlertCircle,
      gradient: "from-[#FFD700] to-[#FFC107]",
      textColor: "text-[#FFD700]",
      bgGradient: "from-[#FFD700] to-[#FFC107]",
    },
    {
      label: "Cancelled",
      value: bookings.filter((b) => b.status === "cancelled").length,
      icon: XCircle,
      gradient: "from-red-500 to-red-600",
      textColor: "text-red-500",
      bgGradient: "from-red-500 to-red-600",
    },
  ];

  const upcomingTrips = bookings.filter(b => b.status === "confirmed").slice(0, 2);

  const handleCancelBooking = async (id: string) => {
  try {
    const res = await fetch(`/api/bookings/${id}/cancel`, { method: "PATCH" });
    const data = await res.json();

    if (res.ok) {
      setBookings(prev => prev.map(b => b.id === id ? { ...b, status: "cancelled" } : b));
    } else {
      alert(data.error || "Failed to cancel booking.");
    }
  } catch (e) {
    console.error(e);
    alert("Error cancelling booking.");
  } finally {
    setShowDeleteConfirm(null);
  }
};

  return (
    <>
    <Navbar />
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Header Section */}
      <div className="relative bg-gradient-to-br from-[#0A1A2F] via-[#0F2740] to-[#1B4F6E] text-white overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="dashboard-pattern" x="0" y="0" width="60" height="60" patternUnits="userSpaceOnUse">
                <path d="M30 0 L45 15 L30 30 L15 15 Z" fill="#87CEEB" fillOpacity="0.3" />
                <circle cx="30" cy="30" r="2" fill="#FFD700" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#dashboard-pattern)" />
          </svg>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex justify-between items-start md:items-center gap-4">
  <div className="flex items-center gap-4">
    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#87CEEB] to-[#4CAF50] flex items-center justify-center shadow-lg">
      <User className="w-8 h-8 text-white" />
    </div>

    <div>
      <h1 className="text-2xl md:text-3xl font-bold">
        Hello, {session?.user?.name} 👋
      </h1>
      <p className="text-gray-300 text-sm">
        Welcome to your personal space
      </p>
    </div>
  </div>

  <NotificationBell />
</div>
        </div>

        {/* Push Notifications Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <PushToggle />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 z-10 " >
        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-8">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="group bg-white rounded-2xl p-5 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100"
            >
              <div className="flex items-start justify-between mb-3 z-20">
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wider">{stat.label}</p>
                  <p className={`text-3xl font-bold mt-1 ${stat.textColor}`}>{stat.value}</p>
                </div>
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${stat.bgGradient} flex items-center justify-center opacity-80 group-hover:opacity-100 transition-opacity`}>
                  <stat.icon className="w-5 h-5 text-white" />
                </div>
              </div>
              <div className="w-full h-1 bg-gray-100 rounded-full overflow-hidden">
                <div className={`h-full bg-gradient-to-r ${stat.gradient} rounded-full transition-all duration-500`} style={{ width: `${Math.min((stat.value / bookings.length) * 100, 100)}%` }}></div>
              </div>
            </div>
          ))}
        </div>

        {/* Main Content Card */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Tabs */}
          <div className="border-b border-gray-200">
            <div className="flex">
              <button
                onClick={() => setActiveTab("bookings")}
                className={`px-6 md:px-8 py-4 md:py-5 font-semibold transition-all relative ${
                  activeTab === "bookings"
                    ? "text-[#87CEEB]"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <span>My Bookings</span>
                </div>
                {activeTab === "bookings" && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-[#87CEEB] to-[#4CAF50] rounded-full"></div>
                )}
              </button>
              <button
                onClick={() => setActiveTab("new")}
                className={`px-6 md:px-8 py-4 md:py-5 font-semibold transition-all relative ${
                  activeTab === "new"
                    ? "text-[#87CEEB]"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                <div className="flex items-center gap-2">
                  <Plus className="w-4 h-4" />
                  <span>New Booking</span>
                </div>
                {activeTab === "new" && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-[#87CEEB] to-[#4CAF50] rounded-full"></div>
                )}
              </button>
            </div>
          </div>

          {/* Upcoming Trips Banner */}
          {activeTab === "bookings" && upcomingTrips.length > 0 && (
            <div className="bg-gradient-to-r from-[#87CEEB]/5 via-[#4CAF50]/5 to-[#FFD700]/5 border-b border-gray-100 p-4 md:p-6">
              <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-[#87CEEB]" />
                Upcoming trips
              </h3>
              <div className="flex flex-wrap gap-4">
                {upcomingTrips.map((trip) => (
                  <div key={trip.id} className="bg-white rounded-xl p-3 shadow-sm flex items-center gap-3 border border-gray-100">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-[#87CEEB] to-[#4CAF50] flex items-center justify-center">
                      <Car className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900">{trip.service}</p>
                      <p className="text-xs text-gray-500">{new Date(trip.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} at {trip.time}</p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-gray-400" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Bookings List */}
          {activeTab === "bookings" && (
            <div className="p-4 md:p-6">
              {bookings.length === 0 ? (
                <div className="text-center py-12">
                  <Car className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 mb-4">No bookings at the moment</p>
                  <button
                    onClick={() => setActiveTab("new")}
                    className="px-6 py-3 bg-gradient-to-r from-[#87CEEB] to-[#4CAF50] text-white rounded-xl font-semibold hover:shadow-lg transition-all duration-300"
                  >
                    Create a Booking
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {bookings.map((booking) => (
                    <div
                      key={booking.id}
                      className="border border-gray-200 rounded-xl p-4 md:p-6 hover:shadow-lg transition-all duration-300 bg-white"
                    >
                      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#87CEEB] to-[#4CAF50] flex items-center justify-center">
                                <Car className="w-5 h-5 text-white" />
                              </div>
                              <h3 className="text-lg font-bold text-gray-900">{booking.service}</h3>
                            </div>
                            {getStatusBadge(booking.status)}
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                            <div className="flex items-center text-gray-600">
                              <Calendar className="w-4 h-4 mr-2 text-[#87CEEB]" />
                              <span>{new Date(booking.date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
                            </div>
                            <div className="flex items-center text-gray-600">
                              <Clock className="w-4 h-4 mr-2 text-[#87CEEB]" />
                              <span>{booking.time}</span>
                            </div>
                            <div className="flex items-start md:col-span-2">
                              <MapPin className="w-4 h-4 mr-2 text-[#87CEEB] mt-0.5 flex-shrink-0" />
                              <div>
                                <div className="font-medium text-gray-900">Departure: {booking.from}</div>
                                <div className="text-gray-500 mt-1">Destination: {booking.to}</div>
                              </div>
                            </div>
                          </div>

                          {(booking.driver || booking.vehicle) && (
                            <div className="mt-4 pt-3 border-t border-gray-100 flex flex-wrap gap-4 text-xs">
                              {booking.driver && (
                                <div className="flex items-center gap-1 text-gray-500">
                                  <User className="w-3 h-3" />
                                  <span>Driver: {booking.driver}</span>
                                </div>
                              )}
                              {booking.vehicle && (
                                <div className="flex items-center gap-1 text-gray-500">
                                  <Car className="w-3 h-3" />
                                  <span>Vehicle: {booking.vehicle}</span>
                                </div>
                              )}
                            </div>
                          )}
                        </div>

                        <div className="flex flex-row lg:flex-col items-center lg:items-end gap-3 lg:gap-2">
                          <div className="text-xl font-bold bg-gradient-to-r from-[#87CEEB] to-[#4CAF50] bg-clip-text text-transparent">
                            {booking.price}
                          </div>
                          {booking.status !== "cancelled" && (
                            <div className="flex gap-2">
                              <button className="p-2 text-[#87CEEB] hover:bg-[#87CEEB]/10 rounded-lg transition-all duration-200">
                                <Edit className="w-4 h-4" />
                              </button>
                              <button 
                                onClick={() => setShowDeleteConfirm(booking.id)}
                                className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-all duration-200"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* New Booking Form */}
          {activeTab === "new" && (
            <div className="p-4 md:p-8">
              <div className="max-w-3xl mx-auto">
                <div className="text-center mb-8">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-r from-[#87CEEB] to-[#4CAF50] flex items-center justify-center">
                    <Car className="w-8 h-8 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">New Booking</h2>
                  <p className="text-gray-600 mt-2">Fill out the form below to book your next trip</p>
                </div>

                <BookingForm />
              </div>
            </div>
          )}
        </div>

        {/* Quick Support Card */}
        <div className="mt-8 bg-gradient-to-r from-[#87CEEB]/10 via-[#4CAF50]/10 to-[#FFD700]/10 rounded-2xl p-6 border border-gray-100">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-[#87CEEB] to-[#4CAF50] flex items-center justify-center">
                <Headphones className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Need help?</h3>
                <p className="text-sm text-gray-600">Our team is available 24/7 to assist you</p>
              </div>
            </div>
            <div className="flex gap-3">
              <a href="tel:+21621622972" className="px-5 py-2.5 bg-white text-[#87CEEB] rounded-xl font-medium hover:shadow-md transition-all duration-300 flex items-center gap-2 border border-gray-200">
                <Phone className="w-4 h-4" />
                <span>Call</span>
              </a>
              <Link href={`https://wa.me/21621622972`} className="px-5 py-2.5 bg-gradient-to-r from-[#87CEEB] to-[#4CAF50] text-white rounded-xl font-medium hover:shadow-lg transition-all duration-300 flex items-center gap-2">
                <Mail className="w-4 h-4" />
                <span>whatsapp</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in" onClick={() => setShowDeleteConfirm(null)}>
          <div className="bg-white rounded-2xl p-6 max-w-md w-full animate-scale-up" onClick={(e) => e.stopPropagation()}>
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-100 flex items-center justify-center">
                <Trash2 className="w-8 h-8 text-red-500" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Cancel booking</h3>
              <p className="text-gray-600 mb-6">
                Are you sure you want to cancel this booking? This action is irreversible.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowDeleteConfirm(null)}
                  className="flex-1 px-4 py-2.5 border border-gray-200 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors"
                >
                  No, keep it
                </button>
                <button
                  onClick={() => {
                    handleCancelBooking(showDeleteConfirm);
                  }}
                  className="flex-1 px-4 py-2.5 bg-red-500 text-white rounded-xl font-medium hover:bg-red-600 transition-colors"
                >
                  Yes, cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes scale-up {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-out forwards;
        }
        .animate-scale-up {
          animation: scale-up 0.3s ease-out forwards;
        }
      `}</style>
    </div>
    <Footer />
    </>
  );
}
