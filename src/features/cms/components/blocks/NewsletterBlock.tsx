"use client";

import { FormEvent, useState } from "react";

export function NewsletterBlock({ title, description }: { title: string; description: string }) {
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSending(true);
    setMessage("");
    const form = new FormData(event.currentTarget);
    const response = await fetch("/api/newsletter", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: form.get("email") }),
    });
    setMessage(
      response.ok ? "Thank you for subscribing." : "Subscription failed. Please try again.",
    );
    setSending(false);
    if (response.ok) event.currentTarget.reset();
  }
  return (
    <section className="mx-auto my-12 max-w-5xl rounded-3xl bg-admin-navy px-8 py-12 text-center text-white">
      <h2 className="font-fraunces text-3xl">{title}</h2>
      <p className="mt-2 opacity-80">{description}</p>
      <form onSubmit={submit} className="mx-auto mt-6 flex max-w-xl flex-col gap-3 sm:flex-row">
        <label className="sr-only" htmlFor="cms-newsletter-email">
          Email
        </label>
        <input
          id="cms-newsletter-email"
          name="email"
          type="email"
          required
          className="h-12 flex-1 rounded-xl bg-white px-4 text-slate-950"
          placeholder="Email address"
        />
        <button
          disabled={sending}
          className="h-12 rounded-xl bg-admin-gold px-6 font-semibold disabled:opacity-50"
        >
          Subscribe
        </button>
      </form>
      {message && (
        <p role="status" className="mt-3 text-sm">
          {message}
        </p>
      )}
    </section>
  );
}
