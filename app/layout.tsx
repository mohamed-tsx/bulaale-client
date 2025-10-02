import type { Metadata } from 'next';
import { Inter, Poppins } from 'next/font/google';
import './globals.css';
import ClientLayout from '@/components/layout/ClientLayout';
import { Toaster } from '@/components/ui/toaster';
import { ErrorHandlerProvider } from '@/lib/contexts/error-handler-context';
import ErrorBoundary from '@/components/ErrorBoundary';

const poppins = Poppins({ subsets: ['latin'], weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'] });

export const metadata: Metadata = {
  title: 'Bulaale Baby Care - Premium Baby Products',
  description: 'Premium baby care products for your little ones. Quality, safety, and comfort you can trust.',
  keywords: 'baby care, baby products, infant care, baby essentials, Somalia',
  authors: [{ name: 'Bulaale Baby Care' }],
  openGraph: {
    title: 'Bulaale Baby Care - Premium Baby Products',
    description: 'Premium baby care products for your little ones. Quality, safety, and comfort you can trust.',
    type: 'website',
    locale: 'en_US',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={poppins.className}>
        <ErrorHandlerProvider>
          <ClientLayout>
            {children}
          </ClientLayout>
          <Toaster />
        </ErrorHandlerProvider>
      </body>
    </html>
  );
}