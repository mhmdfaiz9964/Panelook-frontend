'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

export function PromotionalBannerGrid() {
  return (
    <section className="py-6 sm:py-8 bg-slate-50 border-b border-slate-200/80">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Full size 2 equal columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          
          {/* Column 1 (Same Size) */}
          <Link
            href="/shop"
            className="group block relative w-full aspect-[2/1] rounded-[4px] overflow-hidden border border-slate-200 bg-slate-900 shadow-xs hover:border-blue-600 transition-colors"
          >
            <Image
              src="/images/home-banner-01.jpeg"
              alt="Panelook.lk - Fast Islandwide Delivery & Safe Packaging"
              fill
              className="object-cover object-center group-hover:scale-[1.02] transition-transform duration-300"
              sizes="(max-width: 768px) 100vw, (max-width: 1440px) 50vw, 700px"
            />
          </Link>

          {/* Column 2 (Same Size) */}
          <Link
            href="/shop?touch=Touch"
            className="group block relative w-full aspect-[2/1] rounded-[4px] overflow-hidden border border-slate-200 bg-slate-900 shadow-xs hover:border-blue-600 transition-colors"
          >
            <Image
              src="/images/home-banner-02.jpeg"
              alt="Panelook.lk - Genuine Laptop Displays Range"
              fill
              className="object-cover object-center group-hover:scale-[1.02] transition-transform duration-300"
              sizes="(max-width: 768px) 100vw, (max-width: 1440px) 50vw, 700px"
            />
          </Link>

        </div>
      </div>
    </section>
  );
}
