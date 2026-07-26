"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { ShieldCheck, Shield, Search } from "lucide-react";

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

  const toggleRole = async (user: AdminUser) => {
    const nextRole = user.role === "ADMIN" ? "USER" : "ADMIN";
    if (nextRole === "USER" && !confirm(`Retirer les droits admin à ${user.name ?? user.email} ?`))
      return;
    if (nextRole === "ADMIN" && !confirm(`Donner les droits admin à ${user.name ?? user.email} ?`))
      return;

    setBusyId(user.id);
    setError(null);
    const res = await fetch(`/api/admin/users/${user.id}/role`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ role: nextRole }),
    });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error ?? "Une erreur est survenue.");
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

  return (
    <div className="mx-auto max-w-4xl p-6">
      <div className="mb-8">
        <h1 className="font-fraunces text-2xl font-normal text-calma-ink">Accès administrateurs</h1>
        <p className="mt-1 text-sm text-calma-taupe">
          {admins.length} administrateur{admins.length !== 1 ? "s" : ""} actif
          {admins.length !== 1 ? "s" : ""}
        </p>
      </div>

      <div className="relative mb-6">
        <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-calma-taupe" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Rechercher un utilisateur..."
          className="w-full rounded-xl border border-calma-border py-2.5 pl-10 pr-4 text-sm text-calma-ink focus:border-calma-terracotta focus:outline-none"
        />
      </div>

      {error && (
        <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-16 animate-pulse rounded-2xl bg-calma-sand" />
          ))}
        </div>
      ) : (
        <div className="space-y-6">
          {admins.length > 0 && (
            <div>
              <h2 className="mb-3 flex items-center gap-2 text-sm font-semibold text-calma-ink">
                <ShieldCheck className="h-4 w-4 text-calma-terracotta" />
                Administrateurs
              </h2>
              <div className="space-y-2">
                {admins.map((user) => (
                  <UserRow
                    key={user.id}
                    user={user}
                    isSelf={user.id === session?.user?.id}
                    busy={busyId === user.id}
                    onToggle={() => toggleRole(user)}
                  />
                ))}
              </div>
            </div>
          )}

          <div>
            <h2 className="mb-3 flex items-center gap-2 text-sm font-semibold text-calma-ink">
              <Shield className="h-4 w-4 text-calma-taupe" />
              Utilisateurs
            </h2>
            {others.length === 0 ? (
              <p className="text-sm text-calma-taupe">Aucun utilisateur trouvé.</p>
            ) : (
              <div className="space-y-2">
                {others.map((user) => (
                  <UserRow
                    key={user.id}
                    user={user}
                    isSelf={user.id === session?.user?.id}
                    busy={busyId === user.id}
                    onToggle={() => toggleRole(user)}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function UserRow({
  user,
  isSelf,
  busy,
  onToggle,
}: {
  user: AdminUser;
  isSelf: boolean;
  busy: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="flex items-center gap-4 rounded-2xl border border-calma-border bg-white p-4">
      <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-calma-olive/10 text-sm font-bold text-calma-olive">
        {(user.name ?? user.email ?? "?").charAt(0).toUpperCase()}
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate font-medium text-calma-ink">
          {user.name ?? "—"} {isSelf && <span className="text-xs text-calma-taupe">(vous)</span>}
        </p>
        <p className="truncate text-xs text-calma-taupe">{user.email}</p>
      </div>
      <span
        className={`flex-shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold ${
          user.role === "ADMIN"
            ? "bg-calma-terracotta/10 text-calma-terracotta"
            : "bg-calma-sand text-calma-taupe"
        }`}
      >
        {user.role === "ADMIN" ? "Admin" : "Utilisateur"}
      </span>
      <button
        onClick={onToggle}
        disabled={busy || (isSelf && user.role === "ADMIN")}
        title={
          isSelf && user.role === "ADMIN"
            ? "Vous ne pouvez pas retirer vos propres droits"
            : undefined
        }
        className={`flex-shrink-0 rounded-xl px-3 py-1.5 text-xs font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-40 ${
          user.role === "ADMIN"
            ? "bg-red-50 text-red-600 hover:bg-red-100"
            : "bg-calma-terracotta text-white hover:bg-calma-terracotta-deep"
        }`}
      >
        {busy ? "..." : user.role === "ADMIN" ? "Retirer admin" : "Promouvoir admin"}
      </button>
    </div>
  );
}
