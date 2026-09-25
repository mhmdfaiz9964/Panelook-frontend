'use client';

import React from 'react';
import Link from 'next/link';
import { CreditCard, ArrowRight, ShieldCheck, Zap } from 'lucide-react';

export function KokoPromoBanner() {
  return (
    <section className="py-4 sm:py-5 bg-slate-50 border-b border-slate-200/80">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-[#0B1B4B] via-[#102a78] to-[#155EEF] text-white rounded-[4px] p-4 sm:p-6 shadow-xs border border-blue-900 flex flex-col md:flex-row items-center justify-between gap-4">
          
          {/* Left: KOKO Branding & Heading */}
          <div className="flex items-center gap-3.5 text-center md:text-left">
            <div className="w-12 h-12 rounded-[3px] bg-white text-blue-900 flex items-center justify-center font-black text-xs tracking-tighter shrink-0 shadow-sm">
              <span className="text-sm font-extrabold text-[#155EEF]">KOKO</span>
            </div>
            <div>
              <div className="flex items-center justify-center md:justify-start gap-2">
                <span className="bg-emerald-400 text-slate-900 text-[10px] font-black uppercase px-2 py-0.5 rounded-[2px] tracking-wider">
                  Buy Now, Pay Later
                </span>
                <span className="text-xs text-blue-200 font-medium hidden sm:inline-block">
                  3 Interest-Free Installments
                </span>
              </div>
              <h3 className="text-base sm:text-lg font-black tracking-wide mt-1 text-white">
                KOKO PAY AVAILABLE ON ALL LAPTOP DISPLAYS
              </h3>
            </div>
          </div>

          {/* Center: Value points */}
          <div className="hidden lg:flex items-center gap-6 text-xs text-blue-100 font-medium">
            <div className="flex items-center gap-1.5">
              <Zap className="w-4 h-4 text-amber-300" />
              <span>Instant Approval</span>
            </div>
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-300" />
              <span>0% Interest</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CreditCard className="w-4 h-4 text-blue-300" />
              <span>Debit / Credit Cards</span>
            </div>
          </div>

          {/* Right: CTA */}
          <div className="shrink-0">
            <Link
              href="/shop"
              className="inline-flex items-center gap-1.5 bg-white hover:bg-slate-100 text-[#0B1B4B] font-bold text-xs px-4 py-2.5 rounded-[3px] transition-colors shadow-xs"
            >
              <span>Learn More</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

        </div>
      </div>
    </section>
  );
}
