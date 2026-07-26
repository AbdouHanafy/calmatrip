"use client";

import { useEffect, useRef, useState } from "react";
import { Bell } from "lucide-react";
import { useRouter } from "next/navigation";
import { createPortal } from "react-dom";

type Notification = {
  id: number;
  title: string;
  body: string;
  link?: string;
  isRead: boolean;
  type: string;
  createdAt: string;
};

export default function NotificationBell() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // ─── Fetch notifs ────────────────────────────────────────────
  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/notifications");
      const data = await res.json();
      setNotifications(data.notifications);
      setUnreadCount(data.unreadCount);
    } finally {
      setLoading(false);
    }
  };

  // ─── Chargement initial + flux temps réel (SSE) ───────────────
  useEffect(() => {
    fetchNotifications();

    const source = new EventSource("/api/notifications/stream");
    source.onmessage = (event) => {
      try {
        const notif: Notification = JSON.parse(event.data);
        setNotifications((prev) => [notif, ...prev.filter((n) => n.id !== notif.id)]);
        setUnreadCount((prev) => prev + (notif.isRead ? 0 : 1));
      } catch {
        // ignore malformed payloads
      }
    };
    // EventSource retries automatically on drop — no manual reconnect needed.

    return () => source.close();
  }, []);

  // ─── Fermer si clic extérieur ─────────────────────────────────
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // ─── Marquer une notif comme lue ─────────────────────────────
  const markAsRead = async (id: number) => {
    await fetch(`/api/notifications/${id}/read`, { method: "PATCH" });
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, isRead: true } : n)));
    setUnreadCount((prev) => Math.max(0, prev - 1));
  };

  // ─── Tout marquer comme lu ───────────────────────────────────
  const markAllAsRead = async () => {
    await fetch("/api/notifications/read-all", { method: "PATCH" });
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    setUnreadCount(0);
  };

  // ─── Clic sur une notif ──────────────────────────────────────
  const handleClick = async (notif: Notification) => {
    if (!notif.isRead) await markAsRead(notif.id);
    setOpen(false);
    if (notif.link) router.push(notif.link);
  };

  // ─── Temps relatif ───────────────────────────────────────────
  const timeAgo = (date: string) => {
    const diff = Date.now() - new Date(date).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return "À l'instant";
    if (mins < 60) return `Il y a ${mins}min`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `Il y a ${hours}h`;
    return `Il y a ${Math.floor(hours / 24)}j`;
  };

  // Calculer la position du dropdown
  const getDropdownPosition = () => {
    if (!buttonRef.current) return {};
    const rect = buttonRef.current.getBoundingClientRect();
    return {
      position: "fixed" as const,
      top: rect.bottom + 8,
      right: window.innerWidth - rect.right,
      zIndex: 99999,
    };
  };

  return (
    <>
      {/* ─── Cloche ─────────────────────────────────────────── */}
      <button
        ref={buttonRef}
        onClick={() => setOpen((prev) => !prev)}
        className="relative p-2 rounded-full hover:bg-gray-100 transition-colors"
        aria-label="Notifications"
      >
        <Bell className="w-6 h-6 text-gray-600" />
        {unreadCount > 0 && (
          <span
            className="absolute -top-1 -right-1 bg-red-500 text-white text-xs
                           font-bold rounded-full min-w-[18px] h-[18px] flex
                           items-center justify-center px-1 leading-none"
          >
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}
      </button>

      {/* ─── Dropdown avec Portal ───────────────────────────── */}
      {open &&
        typeof document !== "undefined" &&
        createPortal(
          <div
            ref={dropdownRef}
            style={getDropdownPosition()}
            className="w-80 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
              <span className="font-semibold text-gray-800">Notifications</span>
              {unreadCount > 0 && (
                <button onClick={markAllAsRead} className="text-xs text-blue-600 hover:underline">
                  Tout marquer lu
                </button>
              )}
            </div>

            {/* Liste */}
            <div className="max-h-96 overflow-y-auto divide-y divide-gray-50">
              {loading && notifications.length === 0 ? (
                <div className="py-8 text-center text-sm text-gray-400">Chargement...</div>
              ) : notifications.length === 0 ? (
                <div className="py-8 text-center text-sm text-gray-400">Aucune notification</div>
              ) : (
                notifications.map((notif) => (
                  <button
                    key={notif.id}
                    onClick={() => handleClick(notif)}
                    className={`w-full text-left px-4 py-3 flex gap-3 hover:bg-gray-50
                              transition-colors ${!notif.isRead ? "bg-blue-50/60" : ""}`}
                  >
                    {/* Dot non-lu */}
                    <div className="mt-1 flex-shrink-0">
                      <span
                        className={`block w-2 h-2 rounded-full mt-1
                        ${!notif.isRead ? "bg-blue-500" : "bg-transparent"}`}
                      />
                    </div>

                    {/* Contenu */}
                    <div className="flex-1 min-w-0">
                      <p
                        className={`text-sm ${!notif.isRead ? "font-semibold text-gray-900" : "text-gray-700"}`}
                      >
                        {notif.title}
                      </p>
                      <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">{notif.body}</p>
                      <p className="text-xs text-gray-400 mt-1">{timeAgo(notif.createdAt)}</p>
                    </div>
                  </button>
                ))
              )}
            </div>
          </div>,
          document.body,
        )}
    </>
  );
}
