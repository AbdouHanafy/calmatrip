import type { Metadata } from 'next';
import '@/styles/index.css';
import { AuthProvider } from '@/components/providers/AuthProvider';
import { MarketplaceProvider } from "@/components/marketplace/Marketplacecontext";

export const metadata: Metadata = {
  title: 'Calmatrip — Premium Transport & Excursions',
  description: 'Book reliable airport transfers, excursions, and premium local services with Calmatrip.',
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
              {children}
                </MarketplaceProvider>
            </main>
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}
