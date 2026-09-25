'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Layers, ArrowRight } from 'lucide-react';

interface CollectionItem {
  title: string;
  subtitle: string;
  image: string;
  href: string;
  badge: string;
}

const COLLECTIONS: CollectionItem[] = [
  {
    title: 'Laptop Displays 10.1"–18.0"',
    subtitle: 'Wide Size Range for all laptop brands & models in Sri Lanka',
    image: '/images/home-banner-center-01.jpeg',
    href: '/shop',
    badge: 'Comprehensive Range',
  },
  {
    title: 'Touch Display Assembly',
    subtitle: 'Digitizer & Glass complete screen assemblies with warranty',
    image: '/images/home-banner-03.jpeg',
    href: '/shop?touch=Touch',
    badge: 'Touch Solutions',
  },
  {
    title: '30-Pin & 40-Pin Displays',
    subtitle: 'Standard EDP and LVDS connector options ready for dispatch',
    image: '/images/home-banner-04.jpeg',
    href: '/shop?pin=30-pin',
    badge: 'Connectors',
  },
  {
    title: 'IPS & FHD Premium Panels',
    subtitle: 'Vibrant color gamut & 178° viewing angles for crisp visuals',
    image: '/images/home-banner-01.jpeg',
    href: '/shop?ips=1',
    badge: 'High Resolution',
  },
];

export function FeaturedCollections() {
  return (
    <section className="py-6 sm:py-8 bg-slate-50 border-b border-slate-200/80">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex items-center justify-between mb-4 sm:mb-5">
          <div>
            <h2 className="text-sm sm:text-base font-black text-slate-900 tracking-wider uppercase flex items-center gap-2">
              <Layers className="w-4 h-4 text-blue-600" />
              <span>Featured Collections</span>
            </h2>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              Curated display lineups engineered for exact compatibility and performance
            </p>
          </div>
          <Link
            href="/shop"
            className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 hover:underline shrink-0"
          >
            <span>All Collections</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* 4 Collection Cards: Image Only by Default, Contents Animated on Hover, Border Radius 5px */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4">
          {COLLECTIONS.map((col, idx) => (
            <Link
              key={idx}
              href={col.href}
              className="group relative block w-full h-[200px] sm:h-[220px] lg:h-[240px] rounded-[5px] overflow-hidden border border-slate-200 hover:border-blue-600 shadow-xs hover:shadow-md transition-all duration-300 bg-slate-900"
            >
              {/* Background Image (Shows only this by default) */}
              <Image
                src={col.image}
                alt={col.title}
                fill
                className="object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 360px"
              />

              {/* Hover Animated Overlay with Contents */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/95 via-slate-950/60 to-transparent p-4 sm:p-5 flex flex-col justify-end opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-out">
                <div className="transform translate-y-3 group-hover:translate-y-0 transition-transform duration-300 ease-out space-y-1.5">
                  <span className="inline-block bg-blue-600 text-white text-[10px] font-black uppercase px-2 py-0.5 rounded-[3px] tracking-wider shadow-xs">
                    {col.badge}
                  </span>
                  <h3 className="text-sm sm:text-base font-black text-white leading-snug drop-shadow-sm">
                    {col.title}
                  </h3>
                  <p className="text-[11px] text-slate-200 font-medium line-clamp-2 leading-relaxed">
                    {col.subtitle}
                  </p>
                  <div className="pt-2 flex items-center gap-1.5 text-xs font-bold text-blue-400 group-hover:text-blue-300">
                    <span>Explore Collection</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

      </div>
    </section>
  );
}
