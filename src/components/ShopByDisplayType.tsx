'use client';

import React from 'react';
import Link from 'next/link';
import { Eye, ArrowRight } from 'lucide-react';

interface TypeCard {
  title: string;
  badge: string;
  desc: string;
  href: string;
}

const DISPLAY_TYPES: TypeCard[] = [
  { title: 'IPS Panel', badge: 'Wide View', desc: '178° viewing angle & vivid colors', href: '/shop?ips=1' },
  { title: 'TN Panel', badge: 'Standard', desc: 'Affordable standard replacement', href: '/shop?type=TN' },
  { title: 'OLED Display', badge: 'Ultra Deep', desc: 'Infinite contrast & deep blacks', href: '/shop?type=OLED' },
  { title: 'FHD (1080p)', badge: '1920×1080', desc: 'Sharp full high-definition panels', href: '/shop?resolution=1920x1080' },
  { title: 'HD (768p)', badge: '1366×768', desc: 'Standard laptop resolution', href: '/shop?resolution=1366x768' },
  { title: 'Touch Screen', badge: 'Digitizer', desc: 'With touch digitizer sensor', href: '/shop?touch=Touch' },
  { title: 'Non-Touch', badge: 'Standard', desc: 'Classic non-touch display panels', href: '/shop?touch=Non-Touch' },
  { title: 'Anti-Glare', badge: 'Matte', desc: 'Matte finish with zero reflections', href: '/shop?finish=Matte' },
  { title: '120Hz Gaming', badge: 'High Refresh', desc: 'Smooth competitive laptop gaming', href: '/shop?refresh=120Hz' },
  { title: '144Hz Gaming', badge: 'Esports', desc: 'Pro esports 144Hz gaming screens', href: '/shop?refresh=144Hz' },
];

export function ShopByDisplayType() {
  return (
    <section className="py-6 sm:py-8 bg-white border-b border-slate-200/80">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex items-center justify-between mb-4 sm:mb-5">
          <div>
            <h2 className="text-sm sm:text-base font-black text-slate-900 tracking-wider uppercase flex items-center gap-2">
              <Eye className="w-4 h-4 text-blue-600" />
              <span>Shop by Display Type</span>
            </h2>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              Find replacement screens filtered by panel technology, refresh rate, and surface finish
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

        {/* 10-Type Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-10 gap-2.5 sm:gap-3">
          {DISPLAY_TYPES.map((type) => (
            <Link
              key={type.title}
              href={type.href}
              className="bg-slate-50 hover:bg-white border border-slate-200 hover:border-blue-600 rounded-[4px] p-2.5 flex flex-col justify-between hover:shadow-xs transition-all group"
            >
              <div>
                <span className="inline-block bg-white group-hover:bg-blue-50 text-blue-600 text-[9px] font-black uppercase px-1.5 py-0.5 rounded-[2px] border border-slate-200 group-hover:border-blue-200">
                  {type.badge}
                </span>
                <h3 className="text-xs sm:text-[13px] font-bold text-slate-900 group-hover:text-blue-600 transition-colors mt-1.5 line-clamp-1">
                  {type.title}
                </h3>
              </div>
              <p className="text-[10px] text-slate-400 font-medium mt-1 line-clamp-2 leading-tight">
                {type.desc}
              </p>
            </Link>
          ))}
        </div>

      </div>
    </section>
  );
}
