"use client";

import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix for default Leaflet icons
import iconRetinaUrl from "leaflet/dist/images/marker-icon-2x.png";
import iconUrl from "leaflet/dist/images/marker-icon.png";
import shadowUrl from "leaflet/dist/images/marker-shadow.png";

if (typeof window !== "undefined") {
  delete (L.Icon.Default.prototype as unknown as { _getIconUrl?: unknown })._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: iconRetinaUrl.src || iconRetinaUrl,
    iconUrl: iconUrl.src || iconUrl,
    shadowUrl: shadowUrl.src || shadowUrl,
  });
}

interface Place {
  id: number;
  title: string;
  category: string;
  image: string;
  description: string;
  rating?: number;
  coordinates: {
    lat: number;
    lng: number;
  };
}

interface Props {
  places: Place[];
  userLocation: { lat: number; lng: number } | null;
}

export default function LeafletMap({ places, userLocation }: Props) {
  const mapRef = useRef<HTMLDivElement>(null);
  const leafletMap = useRef<L.Map | null>(null);
  const markersRef = useRef<L.Marker[]>([]);

  // Custom Icon for places - style bleu/beige
  const customIcon =
    typeof window !== "undefined"
      ? new L.Icon({
          iconUrl: "https://cdn-icons-png.flaticon.com/512/3173/3173556.png",
          iconSize: [38, 38],
          iconAnchor: [19, 38],
          popupAnchor: [0, -38],
        })
      : null;

  // Custom Icon for user - style bleu
  const userIcon =
    typeof window !== "undefined"
      ? new L.Icon({
          iconUrl: "https://cdn-icons-png.flaticon.com/512/447/447031.png",
          iconSize: [34, 34],
          iconAnchor: [17, 34],
        })
      : null;

  useEffect(() => {
    if (!mapRef.current) return;

    if (!leafletMap.current) {
      leafletMap.current = L.map(mapRef.current, {
        zoomControl: false,
        scrollWheelZoom: true,
      }).setView([33.8869, 9.5375], 6);

      // Thème bleu/beige personnalisé
      L.tileLayer("https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png", {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>, &copy; CARTO',
      }).addTo(leafletMap.current);

      L.control.zoom({ position: "topleft" }).addTo(leafletMap.current);
    }

    // Clear existing markers
    markersRef.current.forEach((marker) => marker.remove());
    markersRef.current = [];

    // Add places markers
    places.forEach((place) => {
      const popupHtml = `
        <div style="width: 240px; font-family: 'Inter', sans-serif; background: #faf8f5; border-radius: 14px; overflow: hidden; border: 1px solid #e8e0d6;">
          <img src="${place.image}" style="width: 100%; height: 130px; object-fit: cover; border-bottom: 3px solid #2c5f8a;" />
          <div style="padding: 14px 16px;">
            <h3 style="font-weight: 700; font-size: 16px; margin: 0 0 6px 0; color: #1a3a5c;">${place.title}</h3>
            <div style="display: flex; gap: 10px; align-items: center; margin-bottom: 8px;">
              ${place.rating !== undefined ? `<span style="display: flex; align-items: center; gap: 4px; font-size: 14px; font-weight: 600; color: #c89650;">★ ${place.rating}</span>` : ""}
              <span style="font-size: 10px; background: #d4c9b8; padding: 3px 12px; border-radius: 12px; color: #1a3a5c; text-transform: uppercase; font-weight: 600; letter-spacing: 0.5px;">${place.category}</span>
            </div>
            <p style="font-size: 12px; color: #5a6b7a; margin: 0; line-height: 1.6; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;">${place.description}</p>
          </div>
        </div>
      `;

      if (customIcon) {
        const marker = L.marker([place.coordinates.lat, place.coordinates.lng], {
          icon: customIcon,
        })
          .addTo(leafletMap.current!)
          .bindPopup(popupHtml, {
            className: "custom-leaflet-popup",
          });
        markersRef.current.push(marker);
      }
    });

    // Add user location marker
    if (userLocation && userIcon) {
      const userMarker = L.marker([userLocation.lat, userLocation.lng], { icon: userIcon }).addTo(
        leafletMap.current!,
      ).bindPopup(`
          <div style="font-family: 'Inter', sans-serif; padding: 10px 14px; background: #faf8f5; border-radius: 10px; border-left: 4px solid #2c5f8a;">
            <span style="font-weight: 600; color: #1a3a5c;">📍 You are here</span>
          </div>
        `);
      markersRef.current.push(userMarker);

      // Focus on user location
      leafletMap.current.setView([userLocation.lat, userLocation.lng], 13);
    } else if (places.length > 0 && leafletMap.current) {
      // Fit bounds to markers if no user location
      const group = L.featureGroup(markersRef.current);
      if (group.getBounds().isValid()) {
        leafletMap.current.fitBounds(group.getBounds().pad(0.1));
      }
    }

    return () => {
      // We don't remove the map on every render to keep it smooth,
      // but we do clean up markers.
    };
  }, [places, userLocation]);

  // Handle map removal on unmount
  useEffect(() => {
    return () => {
      leafletMap.current?.remove();
      leafletMap.current = null;
    };
  }, []);

  return (
    <div className="relative group">
      <div
        ref={mapRef}
        className="h-[380px] w-full rounded-[2.5rem] overflow-hidden shadow-2xl border-4 border-white sm:h-[480px] lg:h-[600px]"
      />
      <style jsx global>{`
        .custom-leaflet-popup .leaflet-popup-content-wrapper {
          border-radius: 16px;
          padding: 0;
          overflow: hidden;
          box-shadow: 0 10px 40px rgba(26, 58, 92, 0.15);
          border: 1px solid rgba(200, 150, 80, 0.2);
          background: #faf8f5 !important;
        }
        .custom-leaflet-popup .leaflet-popup-content {
          margin: 0;
          padding: 0;
        }
        .custom-leaflet-popup .leaflet-popup-tip {
          background: #faf8f5 !important;
        }
        .leaflet-container {
          background: #e8e4dd !important;
        }

        /* Style des contrôles de zoom - Thème bleu/beige */
        .leaflet-control-zoom a {
          background: #faf8f5 !important;
          color: #1a3a5c !important;
          border: 1px solid #d4c9b8 !important;
          transition: all 0.2s ease;
          font-weight: 600 !important;
        }
        .leaflet-control-zoom a:hover {
          background: #e8e4dd !important;
          border-color: #c89650 !important;
          color: #1a3a5c !important;
        }
        .leaflet-control-zoom {
          box-shadow: 0 4px 16px rgba(26, 58, 92, 0.15) !important;
          border-radius: 12px !important;
          overflow: hidden !important;
          margin: 16px !important;
          border: 1px solid #c89650 !important;
        }

        /* Style des popups */
        .leaflet-popup-content-wrapper {
          background: #faf8f5 !important;
        }

        /* Style du bouton de fermeture des popups */
        .leaflet-popup-close-button {
          color: #1a3a5c !important;
          font-size: 18px !important;
          font-weight: 300 !important;
          transition: all 0.2s ease;
        }
        .leaflet-popup-close-button:hover {
          color: #c89650 !important;
        }

        /* Style des marqueurs survolés */
        .leaflet-marker-icon {
          transition: all 0.3s ease;
          filter: drop-shadow(0 2px 4px rgba(26, 58, 92, 0.2));
        }
        .leaflet-marker-icon:hover {
          transform: scale(1.1);
          filter: drop-shadow(0 4px 8px rgba(26, 58, 92, 0.3));
        }

        /* Style des lignes de la carte */
        .leaflet-tile {
          filter: contrast(0.95) saturate(0.9);
        }
      `}</style>
    </div>
  );
}
