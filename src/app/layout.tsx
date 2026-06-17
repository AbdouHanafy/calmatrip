import type { Metadata, Viewport } from 'next';
import '@/styles/index.css';
import { AuthProvider } from '@/components/providers/AuthProvider';
import { MarketplaceProvider } from "@/components/marketplace/Marketplacecontext";
import InstallPWA from "@/components/ui/InstallPWA";

export const metadata: Metadata = {
  title: 'Calmatrip — Premium Transport & Excursions',
  description: 'Book reliable airport transfers, excursions, and premium local services with Calmatrip.',
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Calmatrip",
  },
};

export const viewport: Viewport = {
  themeColor: "#0ea5e9",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          
          <div className="min-h-screen flex flex-col bg-gray-50">
          
            <main className="flex-1 w-full relative">
                <MarketplaceProvider>
                <InstallPWA />
              {children}
                </MarketplaceProvider>
            </main>
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}
