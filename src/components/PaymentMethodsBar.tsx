'use client';

import React from 'react';
import { CreditCard, Banknote, ShieldCheck } from 'lucide-react';

const PAYMENT_METHODS = [
  {
    name: 'Visa',
    type: 'Card Payment',
    badge: (
      <span className="font-black text-blue-800 text-sm tracking-tighter italic">VISA</span>
    ),
  },
  {
    name: 'Mastercard',
    type: 'Card Payment',
    badge: (
      <div className="flex items-center -space-x-1.5">
        <span className="w-4 h-4 rounded-full bg-red-500 inline-block opacity-90" />
        <span className="w-4 h-4 rounded-full bg-amber-500 inline-block opacity-90" />
      </div>
    ),
  },
  {
    name: 'KOKO Pay',
    type: '3 Interest-Free Installments',
    badge: (
      <span className="bg-blue-600 text-white font-extrabold text-[10px] px-1.5 py-0.5 rounded-[2px] tracking-tight">KOKO</span>
    ),
  },
  {
    name: 'Cash on Delivery',
    type: 'Pay upon Islandwide Delivery',
    badge: (
      <Banknote className="w-4 h-4 text-emerald-600" />
    ),
  },
];

export function PaymentMethodsBar() {
  return (
    <section className="py-4 sm:py-5 bg-slate-50 border-b border-slate-200/80">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
          
          {/* Left Title */}
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span className="font-bold text-slate-800">
              100% Secure Checkout &amp; Supported Payment Methods:
            </span>
          </div>

          {/* Right Badges */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            {PAYMENT_METHODS.map((pm, idx) => (
              <div
                key={idx}
                className="bg-white border border-slate-200 rounded-[3px] px-2.5 py-1.5 flex items-center gap-2 shadow-2xs"
              >
                {pm.badge}
                <span className="font-bold text-slate-700 text-[11px]">{pm.name}</span>
                <span className="text-[10px] text-slate-400 font-medium hidden sm:inline-block">
                  ({pm.type})
                </span>
              </div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}
