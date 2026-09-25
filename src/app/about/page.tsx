import React from 'react';
import Link from 'next/link';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { FixedMobileBottomNav } from '@/components/FixedMobileBottomNav';
import { ShieldCheck, Truck, Lock, Award, Users, Wrench } from 'lucide-react';

export const metadata = {
  title: 'About Us | Panelook.lk',
  description: "Learn about Panelook.lk, Sri Lanka's trusted laptop display store.",
};

const stats = [
  { label: 'Displays In Stock', value: '2,400+' },
  { label: 'Happy Customers', value: '1,000+' },
  { label: 'Brands Supported', value: '20+' },
  { label: 'Years of Service', value: '5+' },
];

const values = [
  { icon: ShieldCheck, title: '100% Genuine', desc: 'Every panel is tested and graded before it reaches you — no refurbished units sold as new.' },
  { icon: Award, title: 'Warranty Backed', desc: '3–12 months warranty on every display, so you can order with confidence.' },
  { icon: Truck, title: 'Islandwide Delivery', desc: 'Fast, tracked delivery to every district in Sri Lanka.' },
  { icon: Wrench, title: 'Repair-Friendly', desc: 'Built for technicians and repair shops with wholesale pricing and bulk support.' },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <Header />

      <main className="flex-1">
        {/* Hero */}
        <section className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-20 text-center space-y-4">
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight">About Panelook.lk</h1>
            <p className="text-blue-100 text-sm sm:text-base max-w-2xl mx-auto font-medium">
              Sri Lanka&apos;s trusted source for genuine laptop replacement displays — helping repair shops
              and everyday customers find the perfect match, fast.
            </p>
          </div>
        </section>

        {/* Stats */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 sm:-mt-10">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-xl grid grid-cols-2 sm:grid-cols-4 divide-x divide-slate-100">
            {stats.map((s) => (
              <div key={s.label} className="p-5 sm:p-6 text-center">
                <div className="text-xl sm:text-2xl font-black text-blue-600">{s.value}</div>
                <div className="text-[11px] sm:text-xs font-semibold text-slate-500 mt-1">{s.label}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Story */}
        <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-4 text-center">
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">Our Story</h2>
          <p className="text-sm text-slate-600 leading-relaxed font-medium">
            Panelook.lk started with a simple problem: finding the right replacement laptop screen in Sri Lanka
            meant guessing panel numbers, calling around shops, and hoping the part fit. We built a searchable
            catalogue of genuine panels — by panel number, laptop model, brand, size and pin type — so anyone,
            from a first-time customer to a professional repair technician, can find an exact match in minutes.
          </p>
        </section>

        {/* Values */}
        <section className="bg-white border-t border-slate-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight text-center mb-8">
              Why Customers Choose Us
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {values.map((v) => (
                <div key={v.title} className="panelook-card p-5 text-center space-y-2">
                  <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center mx-auto">
                    <v.icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-sm font-black text-slate-900">{v.title}</h3>
                  <p className="text-xs text-slate-500 font-medium leading-relaxed">{v.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 text-center space-y-4">
          <Users className="w-8 h-8 text-blue-600 mx-auto" />
          <h2 className="text-lg sm:text-xl font-black text-slate-900">Still have questions?</h2>
          <p className="text-xs sm:text-sm text-slate-500 font-medium">
            Our team is here to help you find the right display for your laptop.
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 bg-primary-gradient text-white font-extrabold px-6 py-3 rounded-2xl shadow-lg shadow-purple-500/25 text-sm"
          >
            Contact Us
          </Link>
        </section>
      </main>

      <Footer />
      <FixedMobileBottomNav />
    </div>
  );
}
