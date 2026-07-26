import { X, Mail, Phone, Calendar, TrendingUp, Star } from "lucide-react";
import { getInitials, type Client } from "./types";

interface ClientDetailsModalProps {
  client: Client;
  onClose: () => void;
  onToggleStatus: (id: string, status: "active" | "blocked") => void;
}

export function ClientDetailsModal({ client, onClose, onToggleStatus }: ClientDetailsModalProps) {
  return (
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-scale-up"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 bg-white border-b border-calma-border px-6 py-4 flex items-center justify-between">
          <h3 className="text-xl font-bold text-calma-ink">Client Details</h3>
          <button
            onClick={onClose}
            aria-label="Fermer"
            className="p-2 hover:bg-calma-sand rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-calma-taupe" />
          </button>
        </div>

        <div className="p-6">
          {/* Profile Header */}
          <div className="flex items-center gap-4 mb-6 pb-6 border-b border-calma-border">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#F2994A] to-[#5E8B63] flex items-center justify-center">
              <span className="text-2xl font-bold text-white">{getInitials(client.name)}</span>
            </div>
            <div className="flex-1">
              <h4 className="text-2xl font-bold text-calma-ink">{client.name}</h4>
              <div className="flex items-center gap-2 mt-1">
                <span
                  className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                    client.status === "active"
                      ? "bg-[#5E8B63]/10 text-[#5E8B63]"
                      : "bg-red-500/10 text-red-500"
                  }`}
                >
                  {client.status === "active" ? "Active account" : "Blocked account"}
                </span>
                <span className="text-xs text-calma-taupe">ID: {client.id}</span>
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="mb-6">
            <h5 className="text-sm font-semibold text-calma-ink mb-3 flex items-center gap-2">
              <Mail className="w-4 h-4 text-[#F2994A]" />
              Contact Information
            </h5>
            <div className="bg-calma-sand rounded-xl p-4 space-y-2">
              <div className="flex items-center gap-3 text-sm">
                <Mail className="w-4 h-4 text-calma-taupe" />
                <span className="text-calma-ink">{client.email}</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Phone className="w-4 h-4 text-calma-taupe" />
                <span className="text-calma-ink">{client.phone}</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Calendar className="w-4 h-4 text-calma-taupe" />
                <span className="text-calma-ink">
                  Registered on {new Date(client.registeredDate).toLocaleDateString("en-US")}
                </span>
              </div>
            </div>
          </div>

          {/* Statistics */}
          <div className="mb-6">
            <h5 className="text-sm font-semibold text-calma-ink mb-3 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-[#F2994A]" />
              Statistics
            </h5>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gradient-to-r from-[#F2994A]/5 to-[#5E8B63]/5 rounded-xl p-4 text-center">
                <p className="text-2xl font-bold text-[#F2994A]">{client.totalBookings}</p>
                <p className="text-xs text-calma-taupe">Bookings</p>
              </div>
              <div className="bg-gradient-to-r from-[#D9A441]/5 to-[#D9A441]/5 rounded-xl p-4 text-center">
                <p className="text-2xl font-bold text-[#D9A441]">{client.totalSpent || 0} TND</p>
                <p className="text-xs text-calma-taupe">Total spent</p>
              </div>
            </div>
          </div>

          {/* Favorite Service */}
          {client.favoriteService && (
            <div className="mb-6">
              <h5 className="text-sm font-semibold text-calma-ink mb-3 flex items-center gap-2">
                <Star className="w-4 h-4 text-[#D9A441]" />
                Favorite Service
              </h5>
              <div className="bg-gradient-to-r from-[#D9A441]/5 to-transparent rounded-xl p-3">
                <p className="text-calma-ink">{client.favoriteService}</p>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              onClick={() => onToggleStatus(client.id, client.status)}
              className={`flex-1 px-4 py-2.5 rounded-xl font-semibold transition-all duration-300 ${
                client.status === "active"
                  ? "bg-red-500 text-white hover:bg-red-600"
                  : "bg-[#5E8B63] text-white hover:bg-[#4C7350]"
              }`}
            >
              {client.status === "active" ? "Block client" : "Unblock client"}
            </button>
            <button className="flex-1 px-4 py-2.5 border-2 border-calma-border text-calma-ink rounded-xl font-semibold hover:bg-calma-sand transition-all duration-300">
              Send message
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
