import type { Metadata } from 'next';
import { Inter, Poppins } from 'next/font/google';
import './globals.css';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

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
        <div className="min-h-screen flex flex-col">
          <Header />
          <main className="flex-1">
            {children}
          </main>
          <Footer />
        </div>
      </body>
    </html>
  );
}