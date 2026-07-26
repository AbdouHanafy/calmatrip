import {
  Mail,
  Phone,
  Calendar,
  Eye,
  Ban,
  CheckCircle,
  Users,
  Star,
  Clock,
  ChevronLeft,
  ChevronRight,
  MessageCircle,
} from "lucide-react";
import { getInitials, getStatusBadge, type Client } from "./types";

interface ClientsTableProps {
  clients: Client[];
  onViewDetails: (client: Client) => void;
  onToggleStatus: (id: string, status: "active" | "blocked") => void;
}

export function ClientsTable({ clients, onViewDetails, onToggleStatus }: ClientsTableProps) {
  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-calma-border">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gradient-to-r from-calma-sand to-white border-b border-calma-border">
            <tr>
              {[
                "Client",
                "Contact",
                "Registered",
                "Bookings",
                "Total Spent",
                "Status",
                "Actions",
              ].map((h) => (
                <th
                  key={h}
                  className="px-6 py-4 text-left text-xs font-semibold text-calma-taupe uppercase tracking-wider"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {clients.map((client) => {
              const statusBadge = getStatusBadge(client.status);
              const StatusIcon = statusBadge.icon;

              return (
                <tr key={client.id} className="hover:bg-calma-sand transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#F2994A]/10 to-[#5E8B63]/10 flex items-center justify-center">
                        <span className="text-sm font-bold text-[#F2994A]">
                          {getInitials(client.name)}
                        </span>
                      </div>
                      <div>
                        <div className="font-semibold text-calma-ink">{client.name}</div>
                        {client.lastBooking && (
                          <div className="flex items-center gap-1 text-xs text-calma-taupe mt-0.5">
                            <Clock className="w-3 h-3" />
                            <span>
                              Last: {new Date(client.lastBooking).toLocaleDateString("en-US")}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <div className="flex items-center gap-2 text-calma-taupe mb-1">
                      <Mail className="w-3.5 h-3.5 text-calma-taupe" />
                      <span className="text-xs">{client.email}</span>
                    </div>
                    <div className="flex items-center gap-2 text-calma-taupe">
                      <Phone className="w-3.5 h-3.5 text-calma-taupe" />
                      <span className="text-xs">{client.phone}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <div className="flex items-center gap-2 text-calma-taupe">
                      <Calendar className="w-3.5 h-3.5 text-calma-taupe" />
                      <span>{new Date(client.registeredDate).toLocaleDateString("en-US")}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1">
                      <span className="inline-flex items-center justify-center min-w-[48px] px-3 py-1.5 rounded-lg text-sm font-semibold bg-gradient-to-r from-[#F2994A]/10 to-[#5E8B63]/10 text-[#F2994A]">
                        {client.totalBookings}
                      </span>
                      {client.favoriteService && (
                        <div className="flex items-center gap-1 text-xs text-calma-taupe">
                          <Star className="w-3 h-3 text-[#D9A441]" />
                          <span>{client.favoriteService}</span>
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-semibold text-[#5E8B63]">
                      {client.totalSpent ? `${client.totalSpent} TND` : "—"}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center px-2.5 py-1.5 rounded-lg text-xs font-medium border ${statusBadge.bg} ${statusBadge.text} ${statusBadge.border}`}
                    >
                      <StatusIcon className="w-3 h-3 mr-1" />
                      {statusBadge.label}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => onViewDetails(client)}
                        className="p-2 text-calma-taupe hover:text-[#F2994A] hover:bg-[#F2994A]/10 rounded-lg transition-all"
                        title="View details"
                        aria-label={`Voir les détails de ${client.name}`}
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onToggleStatus(client.id, client.status)}
                        className={`p-2 rounded-lg transition-all ${
                          client.status === "active"
                            ? "text-red-500 hover:bg-red-50"
                            : "text-green-500 hover:bg-green-50"
                        }`}
                        title={client.status === "active" ? "Block" : "Unblock"}
                        aria-label={
                          client.status === "active"
                            ? `Bloquer ${client.name}`
                            : `Débloquer ${client.name}`
                        }
                      >
                        {client.status === "active" ? (
                          <Ban className="w-4 h-4" />
                        ) : (
                          <CheckCircle className="w-4 h-4" />
                        )}
                      </button>
                      <button
                        className="p-2 text-calma-taupe hover:text-[#5E8B63] hover:bg-[#5E8B63]/10 rounded-lg transition-all"
                        title="Send message"
                        aria-label={`Envoyer un message à ${client.name}`}
                      >
                        <MessageCircle className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {clients.length === 0 && (
        <div className="text-center py-12">
          <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-calma-sand flex items-center justify-center">
            <Users className="w-10 h-10 text-calma-taupe" />
          </div>
          <p className="text-calma-taupe">No clients found</p>
          <p className="text-sm text-calma-taupe mt-1">Try changing your search or filters</p>
        </div>
      )}

      {clients.length > 0 && (
        <div className="px-6 py-4 border-t border-calma-border flex items-center justify-between">
          <p className="text-sm text-calma-taupe">
            Showing <span className="font-medium">{clients.length}</span> out of{" "}
            <span className="font-medium">{clients.length}</span> clients
          </p>
          <div className="flex gap-2">
            <button
              aria-label="Page précédente"
              className="p-2 border border-calma-border rounded-lg hover:bg-calma-sand transition-colors disabled:opacity-50"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button className="px-3 py-2 bg-[#F2994A]/10 text-[#F2994A] rounded-lg font-medium">
              1
            </button>
            <button className="px-3 py-2 border border-calma-border rounded-lg hover:bg-calma-sand transition-colors">
              2
            </button>
            <button
              aria-label="Page suivante"
              className="p-2 border border-calma-border rounded-lg hover:bg-calma-sand transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
