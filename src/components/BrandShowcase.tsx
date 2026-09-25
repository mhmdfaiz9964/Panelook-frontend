'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, Laptop } from 'lucide-react';

interface BrandItem {
  name: string;
  slug: string;
  logoElement: React.ReactNode;
}

const BRANDS: BrandItem[] = [
  {
    name: 'HP',
    slug: 'HP',
    logoElement: (
      <div className="w-11 h-11 rounded-full bg-[#0096D6] flex items-center justify-center text-white font-black italic text-base tracking-tighter shadow-xs">
        hp
      </div>
    ),
  },
  {
    name: 'Dell',
    slug: 'Dell',
    logoElement: (
      <div className="w-11 h-11 rounded-full border-2 border-[#007DB8] flex items-center justify-center text-[#007DB8] font-black text-xs tracking-wider">
        DELL
      </div>
    ),
  },
  {
    name: 'Lenovo',
    slug: 'Lenovo',
    logoElement: (
      <div className="bg-[#E2231A] text-white font-bold text-xs px-2.5 py-1 rounded-[2px] tracking-wide">
        Lenovo
      </div>
    ),
  },
  {
    name: 'ASUS',
    slug: 'ASUS',
    logoElement: (
      <div className="text-[#00539B] font-black tracking-widest text-base italic">
        ASUS
      </div>
    ),
  },
  {
    name: 'Acer',
    slug: 'Acer',
    logoElement: (
      <div className="text-[#83B81A] font-black tracking-tight text-base">
        acer
      </div>
    ),
  },
  {
    name: 'MSI',
    slug: 'MSI',
    logoElement: (
      <div className="text-[#E61C24] font-black tracking-wider text-base">
        msi
      </div>
    ),
  },
  {
    name: 'Samsung',
    slug: 'Samsung',
    logoElement: (
      <div className="text-[#0C2340] font-black tracking-widest text-sm uppercase">
        SAMSUNG
      </div>
    ),
  },
  {
    name: 'LG Display',
    slug: 'LG',
    logoElement: (
      <div className="text-[#A50034] font-black tracking-wider text-base flex items-center gap-1">
        <span className="w-6 h-6 rounded-full border border-[#A50034] flex items-center justify-center text-xs font-bold">LG</span>
        <span className="text-xs">Display</span>
      </div>
    ),
  },
  {
    name: 'BOE',
    slug: 'BOE',
    logoElement: (
      <div className="text-[#003A70] font-black tracking-widest text-base">
        BOE
      </div>
    ),
  },
  {
    name: 'AUO',
    slug: 'AUO',
    logoElement: (
      <div className="text-[#F26522] font-black tracking-widest text-base">
        AUO
      </div>
    ),
  },
];

export function BrandShowcase() {
  return (
    <section id="brands" className="py-6 sm:py-8 bg-white border-b border-slate-200/80">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex items-center justify-between mb-4 sm:mb-5">
          <div>
            <h2 className="text-sm sm:text-base font-black text-slate-900 tracking-wider uppercase flex items-center gap-2">
              <Laptop className="w-4 h-4 text-blue-600" />
              <span>Top Laptop Display Brands</span>
            </h2>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              OEM &amp; replacement panels for major laptop manufacturers and panel fabricators
            </p>
          </div>
          <Link
            href="/shop"
            className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 hover:underline shrink-0"
          >
            <span>View All</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* 10-Brand Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-5 lg:grid-cols-10 gap-2.5 sm:gap-3">
          {BRANDS.map((brand) => (
            <Link
              key={brand.slug}
              href={`/shop?brand=${encodeURIComponent(brand.slug)}`}
              className="bg-white border border-slate-200 rounded-[4px] h-16 sm:h-20 flex flex-col items-center justify-center p-2 hover:border-blue-600 hover:shadow-xs transition-all group"
            >
              <div className="group-hover:scale-105 transition-transform flex items-center justify-center">
                {brand.logoElement}
              </div>
              <span className="text-[10px] font-bold text-slate-500 group-hover:text-blue-600 mt-1">
                {brand.name}
              </span>
            </Link>
          ))}
        </div>

      </div>
    </section>
  );
}
