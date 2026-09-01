"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { CollectionEditor } from "@/components/admin/collection/CollectionEditor";
import { DeleteConfirmModal } from "@/components/admin/collection/DeleteConfirmModal";
import { whatsappLink, type Booking } from "@/components/admin/bookings/types";
import { MessageCircle } from "lucide-react";

const STATUS_OPTIONS = [
  { value: "pending", label: "Pending" },
  { value: "confirmed", label: "Confirmed" },
  { value: "completed", label: "Completed" },
  { value: "cancelled", label: "Cancelled" },
];

const PAYMENT_OPTIONS = [
  { value: "pending", label: "Payment pending" },
  { value: "paid", label: "Paid" },
  { value: "refunded", label: "Refunded" },
];

function Field({ label, value }: { label: string; value: string | number | null | undefined }) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-wider text-calma-taupe">{label}</p>
      <p className="text-sm text-calma-ink">{value ?? "—"}</p>
    </div>
  );
}

export default function AdminBookingEditPage({ id }: { id: string }) {
  const router = useRouter();
  const [booking, setBooking] = useState<Booking | null | undefined>(undefined);
  const [status, setStatus] = useState("pending");
  const [paymentStatus, setPaymentStatus] = useState("pending");
  const [driver, setDriver] = useState("");
  const [vehicle, setVehicle] = useState("");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  useEffect(() => {
    fetch(`/api/bookings/${id}`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data: Booking | null) => {
        setBooking(data);
        if (data) {
          setStatus(data.status);
          setPaymentStatus(data.paymentStatus);
          setDriver(data.driver ?? "");
          setVehicle(data.vehicle ?? "");
        }
      });
  }, [id]);

  const handleSave = async () => {
    setSaving(true);
    setSaved(false);
    try {
      const res = await fetch(`/api/bookings/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status, paymentStatus, driver, vehicle }),
      });
      if (!res.ok) throw new Error();
      setSaved(true);
    } catch {
      alert("Failed to save. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    setDeleteError(null);
    try {
      const res = await fetch(`/api/admin/bookings?id=${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      router.push("/admin/bookings");
    } catch {
      setDeleteError("Suppression impossible — réessayez.");
    } finally {
      setDeleting(false);
    }
  };

  if (booking === undefined) {
    return <div className="h-96 animate-pulse rounded-2xl bg-calma-border/40" />;
  }

  if (!booking) {
    return (
      <div className="rounded-2xl border border-calma-border bg-white p-12 text-center text-calma-taupe">
        Booking not found.
      </div>
    );
  }

  return (
    <>
      <CollectionEditor
        title={`#${booking.id} — ${booking.service}`}
        subtitle={`Booked on ${new Date(booking.createdAt).toLocaleDateString("en-GB")}`}
        backHref="/admin/bookings"
        backLabel="All bookings"
        onSave={handleSave}
        saving={saving}
        saveLabel="Save changes"
        savedMessage={saved ? "Saved." : null}
        onDeleteRequest={() => setShowDelete(true)}
        deleteLabel="Delete booking"
        statusFields={[
          { label: "Status", value: status, options: STATUS_OPTIONS, onChange: setStatus },
          {
            label: "Payment",
            value: paymentStatus,
            options: PAYMENT_OPTIONS,
            onChange: setPaymentStatus,
          },
        ]}
        sidebarExtra={
          booking.customerPhone ? (
            <a
              href={whatsappLink(booking.customerPhone, booking.customerName)}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 rounded-xl bg-admin-gold px-4 py-2.5 text-sm font-semibold text-white no-underline transition-colors hover:bg-admin-gold-deep"
            >
              <MessageCircle className="h-4 w-4" />
              WhatsApp
            </a>
          ) : undefined
        }
      >
        <div>
          <h2 className="mb-3 text-sm font-semibold text-calma-ink">Client</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <Field label="Name" value={booking.customerName} />
            <Field label="Email" value={booking.customerEmail} />
            <Field label="Phone" value={booking.customerPhone} />
          </div>
        </div>

        <div className="border-t border-calma-border pt-6">
          <h2 className="mb-3 text-sm font-semibold text-calma-ink">Trip</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <Field label="Date" value={new Date(booking.date).toLocaleDateString("en-GB")} />
            <Field label="Time" value={booking.time} />
            <Field label="Passengers" value={booking.passengers} />
            <Field label="From" value={booking.fromLocation} />
            <Field label="To" value={booking.toLocation} />
            <Field label="Price" value={booking.price} />
            {booking.tripType === "round-trip" && (
              <>
                <Field
                  label="Return date"
                  value={
                    booking.returnDate
                      ? new Date(booking.returnDate).toLocaleDateString("en-GB")
                      : null
                  }
                />
                <Field label="Return time" value={booking.returnTime} />
              </>
            )}
          </div>
          {booking.specialRequests && (
            <div className="mt-4">
              <p className="text-xs font-semibold uppercase tracking-wider text-calma-taupe">
                Special requests
              </p>
              <p className="text-sm text-calma-ink">{booking.specialRequests}</p>
            </div>
          )}
        </div>

        <div className="border-t border-calma-border pt-6">
          <h2 className="mb-3 text-sm font-semibold text-calma-ink">Operations</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-calma-taupe">
                Driver
              </label>
              <input
                value={driver}
                onChange={(e) => setDriver(e.target.value)}
                className="w-full rounded-lg border border-calma-border px-3 py-2 text-sm focus:border-admin-gold focus:outline-none"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-calma-taupe">
                Vehicle
              </label>
              <input
                value={vehicle}
                onChange={(e) => setVehicle(e.target.value)}
                className="w-full rounded-lg border border-calma-border px-3 py-2 text-sm focus:border-admin-gold focus:outline-none"
              />
            </div>
          </div>
        </div>
      </CollectionEditor>

      {showDelete && (
        <DeleteConfirmModal
          itemLabel={`#${booking.id} — ${booking.service}`}
          isDeleting={deleting}
          errorMessage={deleteError}
          onCancel={() => setShowDelete(false)}
          onConfirm={handleDelete}
        />
      )}
    </>
  );
}
