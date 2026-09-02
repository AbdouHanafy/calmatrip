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

type NotificationBellProps = {
  tone?: "neutral" | "admin" | "partner";
};

const TONES = {
  neutral: {
    button:
      "text-calma-taupe hover:border-calma-terracotta/30 hover:bg-calma-terracotta/5 hover:text-calma-terracotta",
    action: "text-calma-terracotta",
    unread: "bg-calma-terracotta/5",
    dot: "bg-calma-terracotta",
  },
  admin: {
    button: "text-slate-500 hover:border-admin-gold/30 hover:bg-admin-gold/5 hover:text-admin-gold",
    action: "text-admin-gold-deep",
    unread: "bg-admin-gold/5",
    dot: "bg-admin-gold",
  },
  partner: {
    button: "text-slate-500 hover:border-b2b-teal/30 hover:bg-b2b-teal/5 hover:text-b2b-teal",
    action: "text-b2b-teal",
    unread: "bg-b2b-teal/5",
    dot: "bg-b2b-teal",
  },
} as const;

export default function NotificationBell({ tone = "neutral" }: NotificationBellProps) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const palette = TONES[tone];

  // ─── Fetch notifs ────────────────────────────────────────────
  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/notifications");
      const data = await res.json();
      setNotifications(Array.isArray(data.notifications) ? data.notifications : []);
      setUnreadCount(Number(data.unreadCount) || 0);
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
        className={`relative flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white transition-colors ${palette.button}`}
        aria-label="Notifications"
        aria-expanded={open}
        aria-haspopup="dialog"
        title="Notifications"
      >
        <Bell className="h-[18px] w-[18px]" />
        {unreadCount > 0 && (
          <span className="absolute -right-1.5 -top-1.5 flex h-[17px] min-w-[17px] items-center justify-center rounded-full border-2 border-white bg-red-500 px-0.5 text-[9px] font-bold leading-none text-white">
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
            className="w-[min(22rem,calc(100vw-2rem))] overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_24px_70px_-24px_rgba(15,23,42,.32)]"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3.5">
              <span className="font-semibold text-slate-900">Notifications</span>
              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  className={`text-xs font-semibold hover:underline ${palette.action}`}
                >
                  Tout marquer lu
                </button>
              )}
            </div>

            {/* Liste */}
            <div className="max-h-96 divide-y divide-slate-100 overflow-y-auto">
              {loading && notifications.length === 0 ? (
                <div className="py-8 text-center text-sm text-gray-400">Chargement...</div>
              ) : notifications.length === 0 ? (
                <div className="py-8 text-center text-sm text-gray-400">Aucune notification</div>
              ) : (
                notifications.map((notif) => (
                  <button
                    key={notif.id}
                    onClick={() => handleClick(notif)}
                    className={`flex w-full gap-3 px-4 py-3 text-left transition-colors hover:bg-slate-50 ${!notif.isRead ? palette.unread : ""}`}
                  >
                    {/* Dot non-lu */}
                    <div className="mt-1 flex-shrink-0">
                      <span
                        className={`block w-2 h-2 rounded-full mt-1
                        ${!notif.isRead ? palette.dot : "bg-transparent"}`}
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
