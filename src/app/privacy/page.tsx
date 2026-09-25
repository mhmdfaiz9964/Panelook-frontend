import React from 'react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { FixedMobileBottomNav } from '@/components/FixedMobileBottomNav';

export const metadata = {
  title: 'Privacy Policy | Panelook.lk',
};

const sections = [
  {
    title: '1. Information We Collect',
    body: 'When you place an order, register, or contact us, we collect your name, phone number, email address, and delivery address. We do not store full payment card details on our servers.',
  },
  {
    title: '2. How We Use Your Information',
    body: 'Your details are used to process orders, arrange delivery, provide customer support, and — with your consent — send order updates via WhatsApp or SMS.',
  },
  {
    title: '3. Data Sharing',
    body: 'We share order details only with the courier partners needed to deliver your parcel. We do not sell customer data to third parties.',
  },
  {
    title: '4. Cookies',
    body: 'We use minimal cookies to keep your cart contents and preferences between visits. You can clear these at any time via your browser settings.',
  },
  {
    title: '5. Your Rights',
    body: 'You can request a copy of the data we hold about you, or ask us to delete your account and associated data, by contacting info@panelook.lk.',
  },
];

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <Header />

      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-14 flex-1 w-full space-y-6">
        <div className="space-y-2">
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">Privacy Policy</h1>
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
