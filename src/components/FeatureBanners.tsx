'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';

const BANNERS = [
  {
    image: '/images/promo-card-1.jpeg',
    title: 'Matching Displays for Any Laptop',
    href: '/display-finder',
    cta: 'Find Compatible Screen',
  },
  {
    image: '/images/promo-card-2.jpeg',
    title: '30-Pin & 40-Pin FHD / IPS Touch',
    href: '/shop',
    cta: 'Shop Pin Types',
  },
  {
    image: '/images/promo-card-3.jpeg',
    title: 'Trusted for 6+ Years Across Sri Lanka',
    href: '/about',
    cta: 'Why Choose Us',
  },
];

export function FeatureBanners() {
  return (
    <section className="py-8 sm:py-10 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {BANNERS.map((b, idx) => (
            <div
              key={idx}
              className="group relative overflow-hidden rounded-3xl bg-white border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
            >
              <div className="relative w-full aspect-4/5 overflow-hidden bg-slate-100">
                <Image
                  src={b.image}
                  alt={b.title}
                  fill
                  className="object-contain p-2 group-hover:scale-103 transition-transform duration-500"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
              </div>

              <div className="p-4 bg-white border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs font-black text-slate-800 truncate mr-2">
                  {b.title}
                </span>
                <Link
                  href={b.href}
                  className="text-xs font-bold text-blue-600 group-hover:text-blue-700 flex items-center gap-1 shrink-0"
                >
                  <span>{b.cta}</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
