// lib/whatsapp.ts
// Sends automated WhatsApp notifications via Twilio's WhatsApp Business API.
// Twilio credentials are optional in local/dev environments — without this
// guard, any route importing this module would crash on load if unset.

import twilio from "twilio";

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const whatsappFrom = process.env.TWILIO_WHATSAPP_FROM; // e.g. "whatsapp:+14155238886"

const twilioConfigured = !!accountSid && !!authToken && !!whatsappFrom;

const client = twilioConfigured ? twilio(accountSid, authToken) : null;

if (!twilioConfigured) {
  console.warn("[whatsapp] Twilio not configured — WhatsApp notifications are disabled.");
}

function toWhatsAppAddress(phone: string): string {
  const trimmed = phone.trim();
  return trimmed.startsWith("whatsapp:") ? trimmed : `whatsapp:${trimmed}`;
}

// ─── Envoyer un message WhatsApp automatisé ────────────────────
export async function sendWhatsAppMessage(toPhone: string, body: string): Promise<boolean> {
  if (!twilioConfigured || !client) return false;
  if (!toPhone?.trim()) return false;

  try {
    await client.messages.create({
      from: whatsappFrom,
      to: toWhatsAppAddress(toPhone),
      body,
    });
    return true;
  } catch (error) {
    console.error("[whatsapp] Failed to send message:", error);
    return false;
  }
}
