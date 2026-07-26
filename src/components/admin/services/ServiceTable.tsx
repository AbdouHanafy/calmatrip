import NextImage from "next/image";
import {
  Edit,
  Trash2,
  Search,
  Star,
  Clock,
  DollarSign,
  CheckCircle,
  EyeOff,
  ChevronLeft,
  ChevronRight,
  ImageIcon,
} from "lucide-react";
import type { Service } from "./types";
import { parseImages } from "./types";

interface ServiceTableProps {
  services: Service[];
  filteredServices: Service[];
  onEdit: (service: Service) => void;
  onDeleteRequest: (id: number) => void;
  onToggleStatus: (service: Service) => void;
  onTogglePopular: (service: Service) => void;
}

export function ServiceTable({
  services,
  filteredServices,
  onEdit,
  onDeleteRequest,
  onToggleStatus,
  onTogglePopular,
}: ServiceTableProps) {
  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-calma-border">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gradient-to-r from-calma-sand to-white border-b border-calma-border">
            <tr>
              {[
                "ID",
                "Service",
                "Category",
                "Duration",
                "Price",
                "Status",
                "Popular",
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
            {filteredServices.map((service) => {
              const images = parseImages(service.image);
              return (
                <tr key={service.id} className="hover:bg-calma-sand transition-colors group">
                  <td className="px-6 py-4">
                    <span className="text-sm font-mono text-calma-taupe">#{service.id}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      {/* Image stack */}
                      <div className="relative w-10 h-10 flex-shrink-0">
                        {images.length > 0 ? (
                          <>
                            <NextImage
                              src={images[0]}
                              alt=""
                              width={40}
                              height={40}
                              className="w-10 h-10 rounded-xl object-cover border border-calma-border"
                            />
                            {images.length > 1 && (
                              <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-[#F2994A] text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                                +{images.length - 1}
                              </span>
                            )}
                          </>
                        ) : (
                          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#F2994A]/10 to-[#5E8B63]/10 flex items-center justify-center">
                            <ImageIcon className="w-5 h-5 text-calma-taupe" />
                          </div>
                        )}
                      </div>
                      <div>
                        <div className="font-semibold text-calma-ink">{service.title}</div>
                        <div className="text-xs text-calma-taupe max-w-xs truncate">
                          {service.description}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium ${
                        service.category === "Transport"
                          ? "bg-[#F2994A]/10 text-[#F2994A]"
                          : service.category === "Excursion"
                            ? "bg-[#D9A441]/10 text-[#8A6B2E]"
                            : "bg-[#5E8B63]/10 text-[#5E8B63]"
                      }`}
                    >
                      {service.category ?? "—"}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1 text-sm text-calma-taupe">
                      <Clock className="w-3 h-3" />
                      {service.duration || "—"}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1 font-semibold text-[#F2994A]">
                      <DollarSign className="w-3 h-3" />
                      {service.price}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => onToggleStatus(service)}
                      className={`inline-flex items-center px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                        service.active
                          ? "bg-[#5E8B63]/10 text-[#5E8B63] hover:bg-[#5E8B63]/20"
                          : "bg-red-500/10 text-red-500 hover:bg-red-500/20"
                      }`}
                    >
                      {service.active ? (
                        <>
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Active
                        </>
                      ) : (
                        <>
                          <EyeOff className="w-3 h-3 mr-1" />
                          Inactive
                        </>
                      )}
                    </button>
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => onTogglePopular(service)}
                      aria-label={
                        service.popular ? "Retirer des populaires" : "Marquer comme populaire"
                      }
                      aria-pressed={service.popular}
                      className={`p-1.5 rounded-lg transition-all ${service.popular ? "text-[#D9A441] bg-[#D9A441]/10" : "text-calma-taupe hover:text-[#D9A441] hover:bg-[#D9A441]/10"}`}
                    >
                      <Star className="w-4 h-4" />
                    </button>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => onEdit(service)}
                        aria-label={`Modifier ${service.title}`}
                        className="p-2 text-calma-taupe hover:text-[#F2994A] hover:bg-[#F2994A]/10 rounded-lg transition-all"
                        title="Edit"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onDeleteRequest(service.id)}
                        aria-label={`Supprimer ${service.title}`}
                        className="p-2 text-calma-taupe hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {filteredServices.length === 0 && (
        <div className="text-center py-12">
          <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-calma-sand flex items-center justify-center">
            <Search className="w-10 h-10 text-calma-taupe" />
          </div>
          <p className="text-calma-taupe">No services found</p>
          <p className="text-sm text-calma-taupe mt-1">
            {services.length === 0
              ? "Add your first service to get started"
              : "Try changing your search"}
          </p>
        </div>
      )}

      {filteredServices.length > 0 && (
        <div className="px-6 py-4 border-t border-calma-border flex items-center justify-between">
          <p className="text-sm text-calma-taupe">
            Showing <span className="font-medium">{filteredServices.length}</span> of{" "}
            <span className="font-medium">{services.length}</span> services
          </p>
          <div className="flex gap-2">
            <button
              disabled
              className="p-2 border border-calma-border rounded-lg opacity-50 cursor-not-allowed"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button className="px-3 py-2 bg-[#F2994A]/10 text-[#F2994A] rounded-lg font-medium">
              1
            </button>
            <button
              disabled
              className="p-2 border border-calma-border rounded-lg opacity-50 cursor-not-allowed"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
