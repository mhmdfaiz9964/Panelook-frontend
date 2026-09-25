import React from 'react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { FixedMobileBottomNav } from '@/components/FixedMobileBottomNav';
import { ShieldCheck, RotateCcw, XCircle, CheckCircle2 } from 'lucide-react';

export const metadata = {
  title: 'Warranty & Returns | Panelook.lk',
};

const covered = [
  'Dead pixels covering more than 3 clusters',
  'Backlight failure or uneven brightness',
  'Display not powering on when correctly installed',
  'Manufacturing defects present at delivery',
];

const notCovered = [
  'Physical damage from drops, pressure, or bending',
  'Water or liquid damage',
  'Damage from incorrect installation by the customer',
  'Cosmetic scratches that do not affect display function',
];

export default function WarrantyPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <Header />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-14 flex-1 w-full space-y-8">
        <div className="text-center space-y-2">
          <ShieldCheck className="w-9 h-9 text-blue-600 mx-auto" />
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">Warranty &amp; Returns</h1>
          <p className="text-xs sm:text-sm text-slate-500 font-medium max-w-xl mx-auto">
            Every display sold on Panelook.lk includes a 3–12 month warranty depending on grade and product type.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="panelook-card p-6 space-y-3">
            <div className="flex items-center gap-2 text-emerald-700">
              <CheckCircle2 className="w-5 h-5" />
              <h2 className="text-sm font-black">Covered Under Warranty</h2>
            </div>
            <ul className="space-y-2 text-xs text-slate-600 font-medium">
              {covered.map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="panelook-card p-6 space-y-3">
            <div className="flex items-center gap-2 text-rose-700">
              <XCircle className="w-5 h-5" />
              <h2 className="text-sm font-black">Not Covered</h2>
            </div>
            <ul className="space-y-2 text-xs text-slate-600 font-medium">
              {notCovered.map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-400 mt-1.5 shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="panelook-card p-6 space-y-3">
          <div className="flex items-center gap-2 text-blue-700">
            <RotateCcw className="w-5 h-5" />
            <h2 className="text-sm font-black">7-Day Return Policy</h2>
          </div>
          <p className="text-xs text-slate-600 font-medium leading-relaxed">
            If your panel doesn&apos;t match your laptop model or arrives faulty, contact us within 7 days of
            delivery for a free replacement or full refund. Message us on WhatsApp with your order number and
            a short description or photo of the issue, and our team will arrange collection and a replacement.
          </p>
        </div>
      </main>

      <Footer />
      <FixedMobileBottomNav />
    </div>
  );
}
