"use client";
import { useEffect, useState } from "react";
import { Mail, Phone, Calendar, TrendingUp, Star } from "lucide-react";
import { CollectionEditor } from "@/components/admin/collection/CollectionEditor";
import { getInitials, type Client } from "@/components/admin/clients/types";

export default function AdminClientEditPage({ id }: { id: string }) {
  const [client, setClient] = useState<Client | null | undefined>(undefined);
  const [status, setStatus] = useState<"active" | "blocked">("active");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetch(`/api/admin/clients/${id}`)
      .then((res) => (res.ok ? res.json() : { data: null }))
      .then((json) => {
        setClient(json.data ?? null);
        if (json.data) setStatus(json.data.status);
      });
  }, [id]);

  const handleSave = async () => {
    setSaving(true);
    setSaved(false);
    try {
      const res = await fetch(`/api/admin/clients/${id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) throw new Error();
      setSaved(true);
    } catch {
      alert("Failed to update status. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  if (client === undefined) {
    return <div className="h-96 animate-pulse rounded-2xl bg-calma-border/40" />;
  }
  if (!client) {
    return (
      <div className="rounded-2xl border border-calma-border bg-white p-12 text-center text-calma-taupe">
        Client not found.
      </div>
    );
  }

  return (
    <CollectionEditor
      title={client.name}
      subtitle={`Client ID ${client.id}`}
      backHref="/admin/clients"
      backLabel="All clients"
      onSave={handleSave}
      saving={saving}
      saveLabel="Save status"
      savedMessage={saved ? "Saved." : null}
      statusFields={[
        {
          label: "Account status",
          value: status,
          options: [
            { value: "active", label: "Active" },
            { value: "blocked", label: "Blocked" },
          ],
          onChange: (v) => setStatus(v as "active" | "blocked"),
        },
      ]}
    >
      <div className="flex items-center gap-4 border-b border-calma-border pb-6">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-calma-terracotta to-calma-success">
          <span className="text-xl font-bold text-white">{getInitials(client.name)}</span>
        </div>
        <div>
          <h2 className="font-fraunces text-lg font-normal text-calma-ink">{client.name}</h2>
          <p className="text-sm text-calma-taupe">
            {client.status === "active" ? "Active account" : "Blocked account"}
          </p>
        </div>
      </div>

      <div>
        <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-calma-ink">
          <Mail className="h-4 w-4 text-admin-gold" />
          Contact
        </h3>
        <div className="space-y-2 rounded-xl bg-calma-sand p-4 text-sm">
          <div className="flex items-center gap-3">
            <Mail className="h-4 w-4 text-calma-taupe" />
            {client.email}
          </div>
          <div className="flex items-center gap-3">
            <Phone className="h-4 w-4 text-calma-taupe" />
            {client.phone}
          </div>
          <div className="flex items-center gap-3">
            <Calendar className="h-4 w-4 text-calma-taupe" />
            Registered on {new Date(client.registeredDate).toLocaleDateString("en-GB")}
          </div>
        </div>
      </div>

      <div>
        <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-calma-ink">
          <TrendingUp className="h-4 w-4 text-admin-gold" />
          Statistics
        </h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="rounded-xl bg-calma-sand p-4 text-center">
            <p className="text-2xl font-bold text-admin-navy">{client.totalBookings}</p>
            <p className="text-xs text-calma-taupe">Bookings</p>
          </div>
          <div className="rounded-xl bg-calma-sand p-4 text-center">
            <p className="text-2xl font-bold text-admin-gold">{client.totalSpent || 0} TND</p>
            <p className="text-xs text-calma-taupe">Total spent</p>
          </div>
        </div>
      </div>

      {client.favoriteService && (
        <div>
          <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-calma-ink">
            <Star className="h-4 w-4 text-admin-gold" />
            Favorite service
          </h3>
          <p className="rounded-xl bg-calma-sand p-3 text-sm text-calma-ink">
            {client.favoriteService}
          </p>
        </div>
      )}
    </CollectionEditor>
  );
}
