'use client';

import React from 'react';
import Link from 'next/link';

export function PromoPanels() {
  return (
    <section className="py-6 sm:py-10 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">

          {/* Banner 1: Laptop Displays 10.1" - 18.0" */}
          <Link
            href="/shop"
            className="group block relative rounded-[3px] overflow-hidden border border-slate-200/90 shadow-2xs hover:shadow-xs hover:border-slate-400 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500/40"
          >
            <img
              src="/images/Banner slider 02.jpeg"
              alt="Laptop Displays 10.1 to 18.0 Inch Range - Panelook.lk"
              className="w-full h-auto object-cover group-hover:scale-[1.015] transition-transform duration-500 ease-out"
              loading="lazy"
            />
          </Link>

          {/* Banner 2: Special Assembly Touch Displays */}
          <Link
            href="/shop?touch=Touch"
            className="group block relative rounded-[3px] overflow-hidden border border-slate-200/90 shadow-2xs hover:shadow-xs hover:border-slate-400 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-purple-500/40"
          >
            <img
              src="/images/home banner 03.jpeg"
              alt="Special Assembly Touch Displays Sri Lanka - Panelook.lk"
              className="w-full h-auto object-cover group-hover:scale-[1.015] transition-transform duration-500 ease-out"
              loading="lazy"
            />
          </Link>

        </div>
      </div>
    </section>
  );
}
