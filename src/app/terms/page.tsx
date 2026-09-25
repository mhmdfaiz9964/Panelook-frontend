import React from 'react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { FixedMobileBottomNav } from '@/components/FixedMobileBottomNav';

export const metadata = {
  title: 'Terms & Conditions | Panelook.lk',
};

const sections = [
  {
    title: '1. Orders & Payment',
    body: 'By placing an order on Panelook.lk, you confirm the panel number, laptop model, and specifications you provide are accurate. Orders are confirmed once payment is received or, for Cash on Delivery, once dispatched. We reserve the right to cancel orders where stock is unavailable.',
  },
  {
    title: '2. Product Condition',
    body: 'All displays are graded A+ (100% Original) unless stated otherwise. Listed specifications (resolution, pin type, panel type, touch capability) are provided in good faith based on manufacturer data and physical inspection.',
  },
  {
    title: '3. Warranty',
    body: 'Displays carry a 3–12 month warranty against manufacturing defects, as described on our Warranty & Returns page. Warranty does not cover physical or liquid damage, or damage from incorrect installation.',
  },
  {
    title: '4. Pricing',
    body: 'Prices are listed in LKR and are inclusive of VAT unless stated otherwise. Prices may change without notice; the price at the time of order confirmation applies.',
  },
  {
    title: '5. Limitation of Liability',
    body: 'Panelook.lk is not liable for damage caused during self-installation of a purchased display. We recommend professional installation for warranty-sensitive repairs.',
  },
];

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <Header />

      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-14 flex-1 w-full space-y-6">
        <div className="space-y-2">
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">Terms &amp; Conditions</h1>
          <p className="text-xs text-slate-500 font-medium">Last updated: August 2026</p>
        </div>

        <div className="panelook-card p-6 sm:p-8 space-y-6">
          {sections.map((s) => (
            <div key={s.title} className="space-y-1.5">
              <h2 className="text-sm font-black text-slate-900">{s.title}</h2>
              <p className="text-xs text-slate-600 font-medium leading-relaxed">{s.body}</p>
            </div>
          ))}
        </div>
      </main>

      <Footer />
      <FixedMobileBottomNav />
    </div>
  );
}
