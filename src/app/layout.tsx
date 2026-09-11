import "@/styles/index.css";
import { AuthProvider } from "@/components/providers/AuthProvider";
import { MarketplaceProvider } from "@/components/marketplace/Marketplacecontext";
import ServiceWorkerRegister from "@/components/ServiceWorkerRegister";
import PublicUtilities from "@/components/layouts/PublicUtilities";
import type { Metadata, Viewport } from "next";
import Script from "next/script";
import { SITE, organizationSchema } from "@/lib/seo";
import { Cormorant_Garamond, Raleway } from "next/font/google";
import { getPublishedNavigations } from "@/features/cms/services/navigation";
import { NavigationProvider } from "@/features/cms/components/navigation/NavigationProvider";
import { getSiteSettings } from "@/features/cms/services/settings";
import { SiteSettingsProvider } from "@/features/cms/components/settings/SiteSettingsProvider";

// Editorial serif — headings, quotes, prices, atmospheric titles.
const cormorantGaramond = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  variable: "--font-cormorant",
  display: "swap",
});

// UI sans — nav, buttons, labels, body copy. Aliased onto every legacy
// font-hanken/font-poppins/font-space class in src/styles/index.css.
const raleway = Raleway({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-raleway",
  display: "swap",
});

export async function generateMetadata(): Promise<Metadata> {
  const { general, branding } = await getSiteSettings();
  return {
    title: {
      template: `%s | ${general.siteName}`,
      default: `${general.siteName} — Stress-Free Travel in Tunisia`,
    },
    description: general.siteDescription,
    keywords: SITE.keywords.join(", "),
    authors: [{ name: general.siteName, url: SITE.url }],
    creator: general.siteName,
    publisher: general.siteName,
    metadataBase: new URL(SITE.url),
    openGraph: {
      type: "website",
      siteName: general.siteName,
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
        ...(branding.faviconUrl && branding.faviconUrl !== "/icons/favicon.svg"
          ? [{ url: branding.faviconUrl }]
          : [{ url: "/icons/favicon.svg", type: "image/svg+xml" }]),
        { url: "/icons/favicon-96x96.png", sizes: "96x96", type: "image/png" },
      ],
      apple: "/icons/apple-touch-icon.png",
      shortcut: "/icons/favicon.ico",
    },
    ...(process.env.NEXT_PUBLIC_GSC_VERIFICATION
      ? { verification: { google: process.env.NEXT_PUBLIC_GSC_VERIFICATION } }
      : {}),
    category: "travel",
    classification: "Travel & Tourism",
    referrer: "origin-when-cross-origin",
    formatDetection: { telephone: true, email: true, address: true },
  };
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: SITE.themeColor,
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const navigations = await getPublishedNavigations(["main", "footer-explore", "footer-company"]);
  const settings = await getSiteSettings();
  return (
    <html
      lang="fr"
      dir="ltr"
      suppressHydrationWarning
      className={`${cormorantGaramond.variable} ${raleway.variable}`}
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
            __html: JSON.stringify(
              organizationSchema({
                name: settings.general.siteName,
                description: settings.general.siteDescription,
                phone: settings.contact.phone,
                email: settings.contact.email,
                sameAs: [
                  settings.social.facebook,
                  settings.social.instagram,
                  settings.social.tiktok,
                  settings.social.youtube,
                ].filter((url): url is string => !!url),
              }),
            ),
          }}
        />
      </head>

      {/* ✅ Single <body> only */}
      <body>
        <AuthProvider>
          <ServiceWorkerRegister />
          <div className="min-h-screen flex flex-col bg-gray-50">
            <main className="flex-1 w-full relative">
              <SiteSettingsProvider settings={settings}>
                <NavigationProvider navigations={navigations}>
                  <MarketplaceProvider>
                    {children}
                    <PublicUtilities />
                  </MarketplaceProvider>
                </NavigationProvider>
              </SiteSettingsProvider>
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
