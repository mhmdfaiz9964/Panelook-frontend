'use client';

import React from 'react';
import { ShieldCheck, Award, Truck, Lock, Headphones } from 'lucide-react';

const TRUST_ITEMS = [
  {
    icon: ShieldCheck,
    title: '100% Genuine',
    subtitle: 'Original Laptop Displays',
    color: 'text-blue-600',
  },
  {
    icon: Award,
    title: 'Warranty',
    subtitle: '3–12 Months',
    color: 'text-purple-600',
  },
  {
    icon: Truck,
    title: 'Islandwide Delivery',
    subtitle: 'Fast & Safe',
    color: 'text-blue-600',
  },
  {
    icon: Lock,
    title: 'Secure Payments',
    subtitle: '100% Protected',
    color: 'text-emerald-600',
  },
  {
    icon: Headphones,
    title: 'Expert Support',
    subtitle: "We're Here to Help",
    color: 'text-blue-600',
  },
];

export function TrustStrip() {
  return (
    <section className="bg-white border-y border-slate-200/90 py-3 sm:py-4">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 lg:gap-0 lg:divide-x lg:divide-slate-200">
          {TRUST_ITEMS.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="flex items-center gap-3 px-2 sm:px-4 py-1.5"
              >
                <div className="w-10 h-10 rounded-[3px] bg-slate-50 border border-slate-200/80 flex items-center justify-center shrink-0">
                  <Icon className={`w-5 h-5 ${item.color}`} />
                </div>
                <div className="min-w-0">
                  <h4 className="text-xs sm:text-sm font-black text-slate-900 leading-tight">
                    {item.title}
                  </h4>
                  <p className="text-[11px] sm:text-xs text-slate-500 font-medium leading-tight mt-0.5 truncate">
                    {item.subtitle}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
