import React from 'react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { FixedMobileBottomNav } from '@/components/FixedMobileBottomNav';
import { Truck, MapPin, Clock, Package } from 'lucide-react';

export const metadata = {
  title: 'Shipping & Delivery | Panelook.lk',
};

const zones = [
  { area: 'Colombo & Suburbs', time: '1 - 2 business days', cost: 'LKR 350' },
  { area: 'Western Province', time: '2 - 3 business days', cost: 'LKR 500' },
  { area: 'Other Provinces (Islandwide)', time: '3 - 5 business days', cost: 'LKR 650' },
];

export default function ShippingPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <Header />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-14 flex-1 w-full space-y-8">
        <div className="text-center space-y-2">
          <Truck className="w-9 h-9 text-blue-600 mx-auto" />
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">Shipping &amp; Delivery</h1>
          <p className="text-xs sm:text-sm text-slate-500 font-medium max-w-xl mx-auto">
            We deliver genuine, tested laptop displays islandwide with secure, tracked courier service.
          </p>
        </div>

        <div className="panelook-card overflow-hidden">
          <div className="grid grid-cols-3 bg-slate-50 text-[11px] font-black text-slate-500 uppercase px-5 py-3">
            <span>Delivery Zone</span>
            <span>Estimated Time</span>
            <span className="text-right">Cost</span>
          </div>
          {zones.map((z) => (
            <div key={z.area} className="grid grid-cols-3 items-center px-5 py-4 border-t border-slate-100 text-xs font-semibold text-slate-700">
              <span className="flex items-center gap-2"><MapPin className="w-3.5 h-3.5 text-blue-600 shrink-0" />{z.area}</span>
              <span className="flex items-center gap-2 text-slate-500"><Clock className="w-3.5 h-3.5 shrink-0" />{z.time}</span>
              <span className="text-right font-black text-blue-600">{z.cost}</span>
            </div>
          ))}
        </div>

        <div className="panelook-card p-6 space-y-3">
          <div className="flex items-center gap-2 text-blue-700">
            <Package className="w-5 h-5" />
            <h2 className="text-sm font-black">How Displays Are Packed</h2>
          </div>
          <p className="text-xs text-slate-600 font-medium leading-relaxed">
            Every panel is wrapped in anti-static film and shipped in a rigid, corner-protected box to prevent
            flex damage in transit. Orders are dispatched within 24 hours of confirmation, and you&apos;ll receive
            a tracking update via WhatsApp or SMS once your parcel is on the way.
          </p>
        </div>
      </main>

      <Footer />
      <FixedMobileBottomNav />
    </div>
  );
}
