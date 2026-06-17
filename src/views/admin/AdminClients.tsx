'use client';
import { useState, useEffect } from "react";
import { 
  Search, 
  Mail, 
  Phone, 
  Calendar, 
  Eye, 
  Ban, 
  CheckCircle, 
  Users, 
  TrendingUp,
  UserCheck,
  UserX,
  Star,
  Clock,
  Filter,
  Download,
  ChevronLeft,
  ChevronRight,
  MoreVertical,
  MessageCircle,
  X
} from "lucide-react";

type Client = {
  id: string;
  name: string;
  email: string;
  phone: string;
  registeredDate: string;
  totalBookings: number;
  status: "active" | "blocked";
  lastBooking?: string;
  totalSpent?: number;
  favoriteService?: string;
};
type StatCard = {
  label: string;
  value: number;
  icon: any;
  gradient: string;
  change: string;
};

export default function AdminClients() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchClients = async () => {
  try {
    setLoading(true);

    const res = await fetch("/api/admin/clients");

    const data = await res.json();

    if (data.success) {
      setClients(data.data);
    }
  } catch (error) {
    console.error(error);
  } finally {
    setLoading(false);
  }
};

useEffect(() => {
  fetchClients();
}, []);

useEffect(() => {
  const timeout = setTimeout(async () => {
    const res = await fetch(
      `/api/admin/clients?search=${searchTerm}&status=${selectedStatus}`
    );

    const data = await res.json();

    if (data.success) {
      setClients(data.data);
    }
  }, 500);

  return () => clearTimeout(timeout);
}, [searchTerm, selectedStatus]);




  const [dashboardStats, setDashboardStats] = useState({
  totalClients: 0,
  activeClients: 0,
  blockedClients: 0,
  totalBookings: 0,
});
const stats: StatCard[] = [
  {
    label: "Total Clients",
    value: dashboardStats.totalClients,
    icon: Users,
    gradient: "from-[#87CEEB] to-[#4CAF50]",
    change: "+15%",
  },
  {
    label: "Active Clients",
    value: dashboardStats.activeClients,
    icon: UserCheck,
    gradient: "from-[#4CAF50] to-[#45A049]",
    change: "Available",
  },
  {
    label: "Blocked Clients",
    value: dashboardStats.blockedClients,
    icon: UserX,
    gradient: "from-red-500 to-red-600",
    change: "To review",
  },
  {
    label: "Total Bookings",
    value: dashboardStats.totalBookings,
    icon: TrendingUp,
    gradient: "from-[#FFD700] to-[#FFC107]",
    change: "+28%",
  },
];

const fetchStats = async () => {
  const res = await fetch(
    "/api/admin/clients/stats"
  );

  const data = await res.json();

  setDashboardStats(data);
};

useEffect(() => {
  fetchStats();
}, []);

  const toggleClientStatus = async (
  clientId: string,
  currentStatus: "active" | "blocked"
) => {
  try {
    const res = await fetch(
      `/api/admin/clients/${clientId}/status`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status:
            currentStatus === "active"
              ? "blocked"
              : "active",
        }),
      }
    );

    const data = await res.json();

    if (data.success) {
      fetchClients();
    }
  } catch (error) {
    console.error(error);
  }
};

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const getStatusBadge = (status: string) => {
    if (status === "active") {
      return {
        bg: "bg-[#4CAF50]/10",
        text: "text-[#4CAF50]",
        border: "border-[#4CAF50]/20",
        icon: CheckCircle,
        label: "Active"
      };
    }
    return {
      bg: "bg-red-500/10",
      text: "text-red-500",
      border: "border-red-500/20",
      icon: Ban,
      label: "Blocked"
    };
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-[#87CEEB] via-[#4CAF50] to-[#FFD700] bg-clip-text text-transparent">
            Manage Clients
          </h1>
          <p className="text-gray-500 mt-1">View and manage your clients</p>
        </div>
        <button className="flex items-center justify-center gap-2 px-5 py-2.5 bg-gradient-to-r from-[#87CEEB] to-[#4CAF50] text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-[#87CEEB]/30 transform hover:scale-105 transition-all duration-300">
          <Download className="w-5 h-5" />
          Export Data
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="group bg-white rounded-2xl p-5 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100"
          >
            <div className="flex items-start justify-between mb-3">
              <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${stat.gradient} flex items-center justify-center opacity-90 group-hover:opacity-100 transition-opacity`}>
                <stat.icon className="w-5 h-5 text-white" />
              </div>
              <span className="text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded-full">
                {stat.change}
              </span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</h3>
            <p className="text-sm text-gray-500">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Search and Filter Bar */}
      <div className="bg-white rounded-2xl shadow-lg p-4 border border-gray-100">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search client by name, email or phone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#87CEEB] focus:border-transparent transition-all"
            />
          </div>
          <div className="flex gap-3">
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#87CEEB] focus:border-transparent bg-white"
            >
              <option value="all">All statuses</option>
              <option value="active">Active</option>
              <option value="blocked">Blocked</option>
            </select>
            <button className="px-4 py-2.5 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors">
              <Filter className="w-4 h-4 text-gray-500" />
            </button>
          </div>
        </div>
      </div>

      {/* Clients Table */}
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gradient-to-r from-gray-50 to-white border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">ID</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Client</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Contact</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Registered</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Bookings</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Total Spent</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {clients.map((client) => {
                const statusBadge = getStatusBadge(client.status);
                const StatusIcon = statusBadge.icon;
                
                return (
                  <tr key={client.id} className="hover:bg-gray-50 transition-colors group">
                    <td className="px-6 py-4">
                      <span className="text-sm font-mono text-gray-500">{client.id}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#87CEEB]/10 to-[#4CAF50]/10 flex items-center justify-center">
                          <span className="text-sm font-bold text-[#87CEEB]">{getInitials(client.name)}</span>
                        </div>
                        <div>
                          <div className="font-semibold text-gray-900">{client.name}</div>
                          {client.lastBooking && (
                            <div className="flex items-center gap-1 text-xs text-gray-400 mt-0.5">
                              <Clock className="w-3 h-3" />
                              <span>Last: {new Date(client.lastBooking).toLocaleDateString('en-US')}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <div className="flex items-center gap-2 text-gray-600 mb-1">
                        <Mail className="w-3.5 h-3.5 text-gray-400" />
                        <span className="text-xs">{client.email}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <Phone className="w-3.5 h-3.5 text-gray-400" />
                        <span className="text-xs">{client.phone}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <div className="flex items-center gap-2 text-gray-600">
                        <Calendar className="w-3.5 h-3.5 text-gray-400" />
                        <span>{new Date(client.registeredDate).toLocaleDateString('en-US')}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1">
                        <span className="inline-flex items-center justify-center min-w-[48px] px-3 py-1.5 rounded-lg text-sm font-semibold bg-gradient-to-r from-[#87CEEB]/10 to-[#4CAF50]/10 text-[#87CEEB]">
                          {client.totalBookings}
                        </span>
                        {client.favoriteService && (
                          <div className="flex items-center gap-1 text-xs text-gray-400">
                            <Star className="w-3 h-3 text-[#FFD700]" />
                            <span>{client.favoriteService}</span>
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-semibold text-[#4CAF50]">
                        {client.totalSpent ? `${client.totalSpent} TND` : "—"}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-1.5 rounded-lg text-xs font-medium border ${statusBadge.bg} ${statusBadge.text} ${statusBadge.border}`}>
                        <StatusIcon className="w-3 h-3 mr-1" />
                        {statusBadge.label}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => {
                            setSelectedClient(client);
                            setShowDetailsModal(true);
                          }}
                          className="p-2 text-gray-500 hover:text-[#87CEEB] hover:bg-[#87CEEB]/10 rounded-lg transition-all"
                          title="View details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() =>
                            toggleClientStatus(
                              client.id,
                              client.status
                            )
                          }
                          className={`p-2 rounded-lg transition-all ${
                            client.status === "active"
                              ? "text-red-500 hover:bg-red-50"
                              : "text-green-500 hover:bg-green-50"
                          }`}
                          title={client.status === "active" ? "Block" : "Unblock"}
                        >
                          {client.status === "active" ? (
                            <Ban className="w-4 h-4" />
                          ) : (
                            <CheckCircle className="w-4 h-4" />
                          )}
                        </button>
                        <button
                          className="p-2 text-gray-500 hover:text-[#4CAF50] hover:bg-[#4CAF50]/10 rounded-lg transition-all"
                          title="Send message"
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

        {/* Empty State */}
        {clients.length === 0 && (
          <div className="text-center py-12">
            <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-gray-100 flex items-center justify-center">
              <Users className="w-10 h-10 text-gray-300" />
            </div>
            <p className="text-gray-500">No clients found</p>
            <p className="text-sm text-gray-400 mt-1">Try changing your search or filters</p>
          </div>
        )}

        {/* Pagination */}
        {clients.length > 0 && (
          <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between">
            <p className="text-sm text-gray-500">
              Showing <span className="font-medium">{clients.length}</span> out of{" "}
              <span className="font-medium">{clients.length}</span> clients
            </p>
            <div className="flex gap-2">
              <button className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50">
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button className="px-3 py-2 bg-[#87CEEB]/10 text-[#87CEEB] rounded-lg font-medium">
                1
              </button>
              <button className="px-3 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                2
              </button>
              <button className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Client Details Modal */}
      {showDetailsModal && selectedClient && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in"
          onClick={() => setShowDetailsModal(false)}
        >
          <div
            className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-scale-up"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between">
              <h3 className="text-xl font-bold text-gray-900">Client Details</h3>
              <button
                onClick={() => setShowDetailsModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <div className="p-6">
              {/* Profile Header */}
              <div className="flex items-center gap-4 mb-6 pb-6 border-b border-gray-100">
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#87CEEB] to-[#4CAF50] flex items-center justify-center">
                  <span className="text-2xl font-bold text-white">
                    {getInitials(selectedClient.name)}
                  </span>
                </div>
                <div className="flex-1">
                  <h4 className="text-2xl font-bold text-gray-900">{selectedClient.name}</h4>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                      selectedClient.status === "active" 
                        ? "bg-[#4CAF50]/10 text-[#4CAF50]" 
                        : "bg-red-500/10 text-red-500"
                    }`}>
                      {selectedClient.status === "active" ? "Active account" : "Blocked account"}
                    </span>
                    <span className="text-xs text-gray-400">ID: {selectedClient.id}</span>
                  </div>
                </div>
              </div>

              {/* Contact Information */}
              <div className="mb-6">
                <h5 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                  <Mail className="w-4 h-4 text-[#87CEEB]" />
                  Contact Information
                </h5>
                <div className="bg-gray-50 rounded-xl p-4 space-y-2">
                  <div className="flex items-center gap-3 text-sm">
                    <Mail className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-700">{selectedClient.email}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <Phone className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-700">{selectedClient.phone}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-700">Registered on {new Date(selectedClient.registeredDate).toLocaleDateString('en-US')}</span>
                  </div>
                </div>
              </div>

              {/* Statistics */}
              <div className="mb-6">
                <h5 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-[#87CEEB]" />
                  Statistics
                </h5>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gradient-to-r from-[#87CEEB]/5 to-[#4CAF50]/5 rounded-xl p-4 text-center">
                    <p className="text-2xl font-bold text-[#87CEEB]">{selectedClient.totalBookings}</p>
                    <p className="text-xs text-gray-500">Bookings</p>
                  </div>
                  <div className="bg-gradient-to-r from-[#FFD700]/5 to-[#FFC107]/5 rounded-xl p-4 text-center">
                    <p className="text-2xl font-bold text-[#FFD700]">{selectedClient.totalSpent || 0} TND</p>
                    <p className="text-xs text-gray-500">Total spent</p>
                  </div>
                </div>
              </div>

              {/* Favorite Service */}
              {selectedClient.favoriteService && (
                <div className="mb-6">
                  <h5 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                    <Star className="w-4 h-4 text-[#FFD700]" />
                    Favorite Service
                  </h5>
                  <div className="bg-gradient-to-r from-[#FFD700]/5 to-transparent rounded-xl p-3">
                    <p className="text-gray-700">{selectedClient.favoriteService}</p>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4">
                <button
                  onClick={() =>
                    toggleClientStatus(
                      selectedClient.id,
                      selectedClient.status
                    )
                  }
                  className={`flex-1 px-4 py-2.5 rounded-xl font-semibold transition-all duration-300 ${
                    selectedClient.status === "active"
                      ? "bg-red-500 text-white hover:bg-red-600"
                      : "bg-[#4CAF50] text-white hover:bg-[#45A049]"
                  }`}
                >
                  {selectedClient.status === "active" ? "Block client" : "Unblock client"}
                </button>
                <button className="flex-1 px-4 py-2.5 border-2 border-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-all duration-300">
                  Send message
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
  );
}
