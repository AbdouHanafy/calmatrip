import "@/styles/index.css";
import { AuthProvider } from "@/components/providers/AuthProvider";
import { MarketplaceProvider } from "@/components/marketplace/Marketplacecontext";
import InstallPWA from "@/components/ui/InstallPWA";
import ServiceWorkerRegister from "@/components/ServiceWorkerRegister";
import FloatingWhatsApp from "@/components/ui/FloatingWhatsApp";
import type { Metadata, Viewport } from "next";
import Script from "next/script";
import { SITE, organizationSchema } from "@/lib/seo";
import { Fraunces, Poppins, Hanken_Grotesk, Space_Grotesk } from "next/font/google";

const fraunces = Fraunces({
  subsets: ["latin"],
  weight: ["400", "600"],
  style: ["normal", "italic"],
  variable: "--font-fraunces",
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-space",
  display: "swap",
});

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["700"],
  variable: "--font-poppins",
  display: "swap",
});

const hankenGrotesk = Hanken_Grotesk({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-hanken",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    template: `%s | ${SITE.name}`,
    default: `${SITE.name} — Stress-Free Travel in Tunisia`,
  },
  description: SITE.description,
  keywords: SITE.keywords.join(", "),
  authors: [{ name: SITE.name, url: SITE.url }],
  creator: SITE.name,
  publisher: SITE.name,
  metadataBase: new URL(SITE.url),
  openGraph: {
    type: "website",
    siteName: SITE.name,
    locale: "en_US",
    alternateLocale: ["fr_FR", "ar_TN"],
  },
  twitter: {
    card: "summary_large_image",
    site: SITE.twitterHandle,
  },
  manifest: "/site.webmanifest",
  icons: {
    icon: [
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: "/apple-touch-icon.png",
    shortcut: "/favicon.ico",
  },
  ...(process.env.NEXT_PUBLIC_GSC_VERIFICATION
    ? { verification: { google: process.env.NEXT_PUBLIC_GSC_VERIFICATION } }
    : {}),
  category: "travel",
  classification: "Travel & Tourism",
  referrer: "origin-when-cross-origin",
  formatDetection: { telephone: true, email: true, address: true },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: SITE.themeColor,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${fraunces.variable} ${poppins.variable} ${hankenGrotesk.variable} ${spaceGrotesk.variable}`}
    >
      <head>
        {/* Preconnect */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />

        {/* Geo tags — Tunisia */}
        <meta name="geo.region" content="TN" />
        <meta name="geo.placename" content="Hammamet, Tunisia" />
        <meta name="geo.position" content="36.4;10.6" />
        <meta name="ICBM" content="36.4, 10.6" />

        {/* Language */}
        <meta httpEquiv="content-language" content="en, fr, ar" />

        {/* Organization JSON-LD */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationSchema()),
          }}
        />
      </head>

      {/* ✅ Single <body> only */}
      <body>
        <AuthProvider>
          <ServiceWorkerRegister />
          <div className="min-h-screen flex flex-col bg-gray-50">
            <main className="flex-1 w-full relative">
              <MarketplaceProvider>
                <InstallPWA />
                {children}
                <FloatingWhatsApp />
              </MarketplaceProvider>
            </main>
          </div>
        </AuthProvider>

        {/* ✅ GA4 — inside <body>, after app content */}
        {process.env.NEXT_PUBLIC_GA_ID && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`}
              strategy="afterInteractive"
            />
            <Script id="ga4-init" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${process.env.NEXT_PUBLIC_GA_ID}', {
                  page_path: window.location.pathname,
                });
              `}
            </Script>
          </>
        )}
      </body>
    </html>
  );
}
