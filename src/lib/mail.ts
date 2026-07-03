import nodemailer from "nodemailer";

// ---- Transporteur SMTP (OVH / Gmail) ----
// Variables d'environnement attendues dans .env :
// SMTP_HOST=ssl0.ovh.net (ou smtp.gmail.com)
// SMTP_PORT=465
// SMTP_SECURE=true
// SMTP_USER=contact@calmatrip.com
// SMTP_PASS=xxxxxxxx
// MAIL_FROM="Calma Trip <contact@calmatrip.com>"

export const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT || 465),
  secure: process.env.SMTP_SECURE !== "false", // true pour le port 465
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export interface BookingConfirmationData {
  customerName: string;
  customerEmail: string;
  serviceTitle: string;
  tripType: "one-way" | "round-trip";
  date: string; // ISO ou "YYYY-MM-DD"
  time: string;
  returnDate?: string | null;
  returnTime?: string | null;
  fromLocation: string;
  toLocation: string;
  passengers: number;
  price?: string | null;
  bookingId: string | number;
}

function formatDate(dateStr: string) {
  try {
    return new Date(dateStr).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  } catch {
    return dateStr;
  }
}

export function buildBookingConfirmationHtml(data: BookingConfirmationData) {
  const {
    customerName,
    serviceTitle,
    tripType,
    date,
    time,
    returnDate,
    returnTime,
    fromLocation,
    toLocation,
    passengers,
    price,
    bookingId,
  } = data;

  const isRoundTrip = tripType === "round-trip";

  return `
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>Reservation Confirmed</title>
</head>
<body style="margin:0; padding:0; background-color:#f4f6f5; font-family: 'Helvetica Neue', Arial, sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f6f5; padding:32px 0;">
    <tr>
      <td align="center">
        <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="background-color:#ffffff; border-radius:16px; overflow:hidden; box-shadow:0 4px 20px rgba(0,0,0,0.06);">

          <!-- Header / Logo -->
          <tr>
            <td align="center" style="background:linear-gradient(135deg,#0A1A2F,#1B4F6E); padding:36px 24px;">
              <img src="https://calmatrip.com/images/logo-gazelle-white.png" alt="Calma Trip" width="72" style="display:block; margin:0 auto 12px;" />
              <p style="color:#87CEEB; font-size:11px; letter-spacing:3px; text-transform:uppercase; margin:0;">Calma Trip</p>
            </td>
          </tr>

          <!-- Title -->
          <tr>
            <td style="padding:32px 40px 8px;">
              <h1 style="font-size:20px; color:#1E3A3A; margin:0 0 4px;">Your Reservation is Confirmed</h1>
              <p style="color:#6b7280; font-size:14px; margin:0;">Asslema ${customerName},</p>
            </td>
          </tr>

          <!-- Intro -->
          <tr>
            <td style="padding:8px 40px 24px;">
              <p style="color:#4b5563; font-size:14px; line-height:1.6; margin:0;">
                Thank you for choosing Calma Trip. We are delighted to confirm your upcoming reservation
                and look forward to providing you with a peaceful, authentic Tunisian experience.
              </p>
            </td>
          </tr>

          <!-- Booking details card -->
          <tr>
            <td style="padding:0 40px 24px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f9fafb; border-radius:12px; border:1px solid #eef1f0;">
                <tr>
                  <td style="padding:20px 24px;">
                    <p style="margin:0 0 12px; font-size:11px; font-weight:700; letter-spacing:1px; text-transform:uppercase; color:#4CAF50;">
                      Booking #${bookingId} &middot; ${isRoundTrip ? "Round Trip" : "One Way"}
                    </p>

                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="font-size:14px; color:#374151;">
                      <tr>
                        <td style="padding:6px 0; width:120px; color:#9ca3af;">Service</td>
                        <td style="padding:6px 0; font-weight:600;">${serviceTitle}</td>
                      </tr>
                      <tr>
                        <td style="padding:6px 0; color:#9ca3af;">Departure</td>
                        <td style="padding:6px 0; font-weight:600;">${formatDate(date)} at ${time}</td>
                      </tr>
                      ${
                        isRoundTrip && returnDate
                          ? `<tr>
                              <td style="padding:6px 0; color:#9ca3af;">Return</td>
                              <td style="padding:6px 0; font-weight:600;">${formatDate(returnDate)}${returnTime ? " at " + returnTime : ""}</td>
                            </tr>`
                          : ""
                      }
                      <tr>
                        <td style="padding:6px 0; color:#9ca3af;">From</td>
                        <td style="padding:6px 0; font-weight:600;">${fromLocation}</td>
                      </tr>
                      <tr>
                        <td style="padding:6px 0; color:#9ca3af;">To</td>
                        <td style="padding:6px 0; font-weight:600;">${toLocation}</td>
                      </tr>
                      <tr>
                        <td style="padding:6px 0; color:#9ca3af;">Passengers</td>
                        <td style="padding:6px 0; font-weight:600;">${passengers}</td>
                      </tr>
                      ${
                        price
                          ? `<tr>
                              <td style="padding:6px 0; color:#9ca3af;">Price</td>
                              <td style="padding:6px 0; font-weight:700; color:#4CAF50;">${price}</td>
                            </tr>`
                          : ""
                      }
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Calma Promise -->
          <tr>
            <td style="padding:0 40px 24px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#87CEEB0D; border-left:3px solid #87CEEB; border-radius:8px;">
                <tr>
                  <td style="padding:16px 20px;">
                    <p style="margin:0 0 4px; font-size:13px; font-weight:700; color:#1E6091;">The Calma Promise</p>
                    <p style="margin:0; font-size:13px; color:#4b5563; line-height:1.6;">
                      At Calma Trip, we believe your journey should be as serene as the destination.
                      Our team is dedicated to your comfort and peace of mind.
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Support -->
          <tr>
            <td style="padding:0 40px 32px;">
              <p style="margin:0 0 4px; font-size:13px; font-weight:700; color:#1E3A3A;">Need Assistance?</p>
              <p style="margin:0; font-size:13px; color:#4b5563; line-height:1.6;">
                We offer support in English, French, and Arabic to ensure your travel remains effortless.
                Should you need to modify your plans or if you have any questions, simply reply to this email.
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color:#0A1A2F; padding:24px 40px; text-align:center;">
              <p style="margin:0 0 4px; color:#ffffff; font-size:14px; font-weight:600;">We look forward to welcoming you soon.</p>
              <p style="margin:0; color:#87CEEB; font-size:12px;">Warmly, The Calma Trip Team</p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`;
}

export async function sendBookingConfirmationEmail(data: BookingConfirmationData) {
  const html = buildBookingConfirmationHtml(data);

  await transporter.sendMail({
    from: process.env.MAIL_FROM,
    to: data.customerEmail,
    subject: "Your Calma Trip Reservation is Confirmed",
    html,
  });
}