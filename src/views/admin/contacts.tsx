"use client";
import { useEffect, useState, useCallback } from "react";
import {
  Mail,
  MailOpen,
  Trash2,
  Phone,
  Calendar,
  AlertCircle,
  X,
  Loader2,
  Inbox,
} from "lucide-react";
import {
  CollectionList,
  type CollectionColumn,
} from "@/components/admin/collection/CollectionList";
import { DeleteConfirmModal } from "@/components/admin/collection/DeleteConfirmModal";

type Contact = {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  subject: string;
  message: string;
  isRead: boolean;
  createdAt: string;
};

const subjectLabels: Record<string, string> = {
  reservation: "Booking",
  information: "Information request",
  reclamation: "Complaint",
  devis: "Quote request",
  autre: "Other",
};

export default function AdminContactsPage() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "unread" | "read">("all");
  const [selected, setSelected] = useState<Contact | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<Contact | null>(null);
  const [deleting, setDeleting] = useState(false);

  const fetchContacts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const params = new URLSearchParams();
      if (filter === "unread") params.set("isRead", "false");
      if (filter === "read") params.set("isRead", "true");

      const res = await fetch(`/api/contact?${params.toString()}`);
      if (!res.ok) throw new Error("Failed to load messages");
      const data = await res.json();
      setContacts(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load messages");
    } finally {
      setLoading(false);
    }
  }, [filter]);

  useEffect(() => {
    fetchContacts();
  }, [fetchContacts]);

  const openMessage = async (contact: Contact) => {
    setSelected(contact);
    if (!contact.isRead) {
      try {
        const res = await fetch(`/api/contact/${contact.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ isRead: true }),
        });
        if (res.ok) {
          setContacts((prev) =>
            prev.map((c) => (c.id === contact.id ? { ...c, isRead: true } : c)),
          );
          setSelected((prev) =>
            prev && prev.id === contact.id ? { ...prev, isRead: true } : prev,
          );
        }
      } catch {
        // non-blocking — message still opens even if the read-toggle fails
      }
    }
  };

  const toggleRead = async (contact: Contact, e?: React.MouseEvent) => {
    e?.stopPropagation();
    const nextIsRead = !contact.isRead;
    try {
      const res = await fetch(`/api/contact/${contact.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isRead: nextIsRead }),
      });
      if (!res.ok) throw new Error();
      setContacts((prev) =>
        prev.map((c) => (c.id === contact.id ? { ...c, isRead: nextIsRead } : c)),
      );
    } catch {
      setError("Failed to update message status");
    }
  };

  const deleteContact = async () => {
    if (!deleteConfirm) return;
    const id = deleteConfirm.id;
    setDeleting(true);
    try {
      const res = await fetch(`/api/contact/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      setContacts((prev) => prev.filter((c) => c.id !== id));
      setDeleteConfirm(null);
      if (selected?.id === id) setSelected(null);
    } catch {
      setError("Failed to delete message");
    } finally {
      setDeleting(false);
    }
  };

  const filteredContacts = contacts.filter((c) => {
    const term = search.toLowerCase();
    return (
      c.name.toLowerCase().includes(term) ||
      c.email.toLowerCase().includes(term) ||
      c.message.toLowerCase().includes(term)
    );
  });

  const unreadCount = contacts.filter((c) => !c.isRead).length;

  const contactColumns: CollectionColumn<Contact>[] = [
    {
      key: "sender",
      label: "From",
      render: (contact) => (
        <div className="flex items-start gap-3">
          <div className="mt-0.5 shrink-0">
            {contact.isRead ? (
              <MailOpen className="h-4 w-4 text-calma-taupe" />
            ) : (
              <Mail className="h-4 w-4 text-[#F2994A]" />
            )}
          </div>
          <div className="min-w-0">
            <p
              className={`font-semibold ${!contact.isRead ? "text-calma-ink" : "text-calma-taupe"}`}
            >
              {contact.name}
            </p>
            <p className="text-xs text-calma-taupe">{contact.email}</p>
          </div>
        </div>
      ),
    },
    {
      key: "subject",
      label: "Subject",
      render: (contact) => (
        <span className="text-sm text-calma-ink">
          {subjectLabels[contact.subject] ?? contact.subject}
        </span>
      ),
    },
    {
      key: "message",
      label: "Message",
      render: (contact) => (
        <span className="line-clamp-1 max-w-xs text-sm text-calma-taupe">{contact.message}</span>
      ),
    },
    {
      key: "date",
      label: "Received",
      render: (contact) => (
        <span className="flex items-center gap-1 text-xs text-calma-taupe">
          <Calendar className="h-3 w-3" />
          {new Date(contact.createdAt).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
          })}
        </span>
      ),
    },
    {
      key: "read",
      label: "",
      render: (contact) => (
        <button
          onClick={(e) => toggleRead(contact, e)}
          className="rounded-lg p-1.5 text-calma-taupe transition-all hover:bg-[#F2994A]/10 hover:text-[#F2994A]"
          title={contact.isRead ? "Mark as unread" : "Mark as read"}
        >
          {contact.isRead ? <Mail className="h-4 w-4" /> : <MailOpen className="h-4 w-4" />}
        </button>
      ),
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-[#F2994A]" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {error && (
        <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <p className="text-sm flex-1">{error}</p>
          <button onClick={() => setError(null)} className="p-1 hover:bg-red-100 rounded-lg">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-[#F2994A] via-[#5E8B63] to-[#D9A441] bg-clip-text text-transparent">
            Messages
          </h1>
          <p className="text-calma-taupe mt-1">
            {unreadCount > 0
              ? `${unreadCount} unread message${unreadCount > 1 ? "s" : ""}`
              : "All messages read"}
          </p>
        </div>
      </div>

      {/* Filter tabs */}
      <div className="flex w-fit gap-2 rounded-xl bg-calma-sand p-1">
        {(["all", "unread", "read"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`rounded-lg px-4 py-2 text-sm font-medium capitalize transition-all ${
              filter === f
                ? "bg-white text-calma-ink shadow-md"
                : "text-calma-taupe hover:text-calma-ink"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      <CollectionList
        items={filteredContacts}
        getId={(c) => c.id}
        columns={contactColumns}
        searchTerm={search}
        onSearchChange={setSearch}
        searchPlaceholder="Search by name, email, or message..."
        onRowClick={openMessage}
        onDeleteRequest={setDeleteConfirm}
        emptyIcon={Inbox}
        emptyTitle="No messages found"
      />

      {/* Message Detail Modal */}
      {selected && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
          onClick={() => setSelected(null)}
        >
          <div
            className="bg-white rounded-2xl p-6 max-w-lg w-full max-h-[85vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-lg font-bold text-calma-ink">{selected.name}</h3>
                <p className="text-sm text-calma-taupe">{selected.email}</p>
                {selected.phone && (
                  <p className="text-sm text-calma-taupe flex items-center gap-1 mt-1">
                    <Phone className="w-3 h-3" /> {selected.phone}
                  </p>
                )}
              </div>
              <button
                onClick={() => setSelected(null)}
                className="p-2 hover:bg-calma-sand rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-calma-taupe" />
              </button>
            </div>

            <div className="mb-4">
              <span className="inline-flex items-center px-3 py-1 rounded-lg text-xs font-medium bg-[#F2994A]/10 text-[#F2994A]">
                {subjectLabels[selected.subject] ?? selected.subject}
              </span>
            </div>

            <p className="text-calma-ink leading-relaxed whitespace-pre-wrap mb-6">
              {selected.message}
            </p>

            <div className="flex items-center justify-between pt-4 border-t border-calma-border">
              <span className="text-xs text-calma-taupe flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                {new Date(selected.createdAt).toLocaleDateString("en-US", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
              <button
                onClick={() => setDeleteConfirm(selected)}
                className="flex items-center gap-2 px-4 py-2 text-red-500 hover:bg-red-50 rounded-xl text-sm font-medium transition-colors"
              >
                <Trash2 className="w-4 h-4" />
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {deleteConfirm && (
        <DeleteConfirmModal
          itemLabel={`${deleteConfirm.name} — ${subjectLabels[deleteConfirm.subject] ?? deleteConfirm.subject}`}
          isDeleting={deleting}
          onCancel={() => setDeleteConfirm(null)}
          onConfirm={deleteContact}
        />
      )}
    </div>
  );
}
