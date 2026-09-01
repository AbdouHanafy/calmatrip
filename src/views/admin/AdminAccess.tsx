"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { ShieldCheck, Shield, Users } from "lucide-react";
import {
  CollectionList,
  type CollectionColumn,
} from "@/components/admin/collection/CollectionList";

interface AdminUser {
  id: string;
  name: string | null;
  email: string | null;
  role: "USER" | "ADMIN";
  createdAt: string;
  image: string | null;
}

export default function AdminAccess() {
  const { data: session } = useSession();
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [busyId, setBusyId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [confirmTarget, setConfirmTarget] = useState<AdminUser | null>(null);

  const load = async () => {
    setLoading(true);
    const res = await fetch("/api/admin/users");
    const data = await res.json();
    setUsers(Array.isArray(data) ? data : []);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const applyRoleChange = async () => {
    if (!confirmTarget) return;
    const user = confirmTarget;
    const nextRole = user.role === "ADMIN" ? "USER" : "ADMIN";
    setConfirmTarget(null);
    setBusyId(user.id);
    setError(null);
    const res = await fetch(`/api/admin/users/${user.id}/role`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ role: nextRole }),
    });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error ?? "Something went wrong.");
    } else {
      await load();
    }
    setBusyId(null);
  };

  const filtered = users.filter((u) => {
    const q = search.toLowerCase();
    return (u.name ?? "").toLowerCase().includes(q) || (u.email ?? "").toLowerCase().includes(q);
  });

  const admins = filtered.filter((u) => u.role === "ADMIN");
  const others = filtered.filter((u) => u.role !== "ADMIN");

  const columns = (): CollectionColumn<AdminUser>[] => [
    {
      key: "user",
      label: "User",
      render: (u) => {
        const isSelf = u.id === session?.user?.id;
        return (
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-admin-navy/10 text-sm font-bold text-admin-navy">
              {(u.name ?? u.email ?? "?").charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0">
              <p className="truncate font-medium text-calma-ink">
                {u.name ?? "—"} {isSelf && <span className="text-xs text-calma-taupe">(you)</span>}
              </p>
              <p className="truncate text-xs text-calma-taupe">{u.email}</p>
            </div>
          </div>
        );
      },
    },
    {
      key: "action",
      label: "",
      render: (u) => {
        const isSelf = u.id === session?.user?.id;
        const disabled = busyId === u.id || (isSelf && u.role === "ADMIN");
        return (
          <button
            onClick={() => setConfirmTarget(u)}
            disabled={disabled}
            title={
              isSelf && u.role === "ADMIN" ? "You can't remove your own admin rights" : undefined
            }
            className={`rounded-xl px-3 py-1.5 text-xs font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-40 ${
              u.role === "ADMIN"
                ? "bg-red-50 text-red-600 hover:bg-red-100"
                : "bg-admin-gold text-white hover:bg-admin-gold-deep"
            }`}
          >
            {busyId === u.id ? "…" : u.role === "ADMIN" ? "Remove admin" : "Promote to admin"}
          </button>
        );
      },
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-fraunces text-2xl font-normal text-calma-ink">Admin access</h1>
        <p className="mt-1 text-calma-taupe">
          {admins.length} active administrator{admins.length !== 1 ? "s" : ""}
        </p>
      </div>

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <div>
        <h2 className="mb-3 flex items-center gap-2 text-sm font-semibold text-calma-ink">
          <ShieldCheck className="h-4 w-4 text-admin-gold" />
          Administrators
        </h2>
        <CollectionList
          items={admins}
          getId={(u) => u.id}
          columns={columns()}
          loading={loading}
          searchTerm={search}
          onSearchChange={setSearch}
          searchPlaceholder="Search a user..."
          emptyIcon={ShieldCheck}
          emptyTitle="No administrators found"
        />
      </div>

      <div>
        <h2 className="mb-3 flex items-center gap-2 text-sm font-semibold text-calma-ink">
          <Shield className="h-4 w-4 text-calma-taupe" />
          Users
        </h2>
        <CollectionList
          items={others}
          getId={(u) => u.id}
          columns={columns()}
          loading={loading}
          emptyIcon={Users}
          emptyTitle="No users found"
        />
      </div>

      {confirmTarget && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
          onClick={() => setConfirmTarget(null)}
        >
          <div
            className="w-full max-w-md rounded-2xl bg-white p-6 text-center"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-admin-gold/10">
              <ShieldCheck className="h-8 w-8 text-admin-gold" />
            </div>
            <h3 className="mb-2 text-xl font-bold text-calma-ink">
              {confirmTarget.role === "ADMIN" ? "Remove admin rights?" : "Grant admin rights?"}
            </h3>
            <p className="mb-6 text-calma-taupe">
              {confirmTarget.role === "ADMIN" ? "Revoke" : "Grant"} admin access for{" "}
              <span className="font-semibold text-calma-ink">
                {confirmTarget.name ?? confirmTarget.email}
              </span>
              ?
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setConfirmTarget(null)}
                className="flex-1 rounded-xl border border-calma-border px-4 py-2.5 font-medium text-calma-ink transition-colors hover:bg-calma-sand"
              >
                Cancel
              </button>
              <button
                onClick={applyRoleChange}
                className="flex-1 rounded-xl bg-admin-gold px-4 py-2.5 font-medium text-white transition-colors hover:bg-admin-gold-deep"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
