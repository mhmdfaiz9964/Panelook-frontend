import type { Metadata } from 'next';
import { Lato } from 'next/font/google';
import './globals.css';
import { CartProvider } from '@/context/CartContext';
import { CustomerAuthProvider } from '@/context/CustomerAuthContext';

const lato = Lato({
  subsets: ['latin'],
  weight: ['300', '400', '700', '900'],
  variable: '--font-lato',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Panelook.lk | Laptop Displays in Sri Lanka | Genuine Panels with Warranty',
  description:
    'Shop genuine laptop displays in Sri Lanka. Find 10.1"–18" laptop screens, IPS, FHD, Touch, 30-Pin and 40-Pin displays with warranty and islandwide delivery.',
  keywords: [
    'laptop display Sri Lanka',
    'laptop screen replacement',
    'genuine laptop panels',
    'B156XW04',
    'N156HCE-GN1',
    'HP display',
    'Dell screen',
    'Lenovo display',
    '30 pin display',
    '40 pin display',
    'touch screen laptop display',
    'IPS display panel Sri Lanka',
  ],
  openGraph: {
    title: 'Panelook.lk | Laptop Displays in Sri Lanka | Genuine Panels with Warranty',
    description:
      'Shop genuine laptop displays in Sri Lanka. Find 10.1"–18" laptop screens, IPS, FHD, Touch, 30-Pin and 40-Pin displays with warranty and islandwide delivery.',
    images: ['/images/logo.jpeg'],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${lato.variable} scroll-smooth`}>
      <body className={`${lato.className} antialiased selection:bg-blue-600 selection:text-white bg-slate-50 font-sans`}>
        <CustomerAuthProvider>
          <CartProvider>
            {children}
          </CartProvider>
        </CustomerAuthProvider>
      </body>
    </html>
  );
}
