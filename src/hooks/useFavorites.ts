"use client";

import { useCallback, useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter, usePathname } from "next/navigation";

export type FavoriteType = "product" | "place" | "event" | "museum" | "service";

interface FavoriteRow {
  itemType: FavoriteType;
  itemId: number;
}

const key = (itemType: FavoriteType, itemId: number) => `${itemType}:${itemId}`;

// Account-linked favorites, shared across every content type (Marketplace
// products, Explorer places/events/museums/services). Requires a session —
// toggling while logged out redirects to /login.
export function useFavorites() {
  const { status } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const [ids, setIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status !== "authenticated") {
      setIds(new Set());
      setLoading(status === "loading");
      return;
    }
    setLoading(true);
    fetch("/api/favorites")
      .then((res) => (res.ok ? res.json() : []))
      .then((rows: FavoriteRow[]) => {
        setIds(new Set(rows.map((r) => key(r.itemType, r.itemId))));
      })
      .catch(() => setIds(new Set()))
      .finally(() => setLoading(false));
  }, [status]);

  const isFavorited = useCallback(
    (itemType: FavoriteType, itemId: number) => ids.has(key(itemType, itemId)),
    [ids],
  );

  const favoritedIds = useCallback(
    (itemType: FavoriteType) =>
      Array.from(ids)
        .filter((k) => k.startsWith(`${itemType}:`))
        .map((k) => parseInt(k.split(":")[1], 10)),
    [ids],
  );

  const toggleFavorite = useCallback(
    async (itemType: FavoriteType, itemId: number) => {
      if (status !== "authenticated") {
        router.push(`/login?callbackUrl=${encodeURIComponent(pathname || "/")}`);
        return;
      }

      const k = key(itemType, itemId);
      const wasFavorited = ids.has(k);

      // Optimistic update
      setIds((prev) => {
        const next = new Set(prev);
        if (wasFavorited) next.delete(k);
        else next.add(k);
        return next;
      });

      try {
        if (wasFavorited) {
          await fetch("/api/favorites", {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ itemType, itemId }),
          });
        } else {
          await fetch("/api/favorites", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ itemType, itemId }),
          });
        }
      } catch {
        // Roll back on failure
        setIds((prev) => {
          const next = new Set(prev);
          if (wasFavorited) next.add(k);
          else next.delete(k);
          return next;
        });
      }
    },
    [ids, status, router, pathname],
  );

  return {
    isFavorited,
    toggleFavorite,
    favoritedIds,
    loading,
    isAuthenticated: status === "authenticated",
  };
}
