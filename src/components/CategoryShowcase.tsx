'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Layers, ArrowRight } from 'lucide-react';

interface CategoryItem {
  id: string;
  name: string;
  slug: string;
  image: string;
  itemCount: string;
}

const CATEGORIES: CategoryItem[] = [
  {
    id: 'laptop-displays',
    name: 'Laptop Displays',
    slug: '/shop',
    image: '/images/categories/cat-laptop-displays.png',
    itemCount: '350+ Panels',
  },
  {
    id: 'touch-screen',
    name: 'Touch Screen',
    slug: '/shop?touch=Touch',
    image: '/images/categories/cat-touch-displays.png',
    itemCount: '80+ Assemblies',
  },
  {
    id: 'ips-panels',
    name: 'IPS Panels',
    slug: '/shop?ips=1',
    image: '/images/categories/cat-ips-displays.png',
    itemCount: '190+ Models',
  },
  {
    id: '30-pin',
    name: '30-Pin Displays',
    slug: '/shop?pin=30-pin',
    image: '/images/categories/cat-30pin-displays.png',
    itemCount: 'EDP Standard',
  },
  {
    id: '40-pin',
    name: '40-Pin Displays',
    slug: '/shop?pin=40-pin',
    image: '/images/categories/cat-40pin-displays.png',
    itemCount: 'LVDS & 144Hz',
  },
  {
    id: '14-inch',
    name: '14 Inch',
    slug: '/shop?size=14',
    image: '/images/products/panel-nv140fhm.png',
    itemCount: '90+ Displays',
  },
  {
    id: '15-6-inch',
    name: '15.6 Inch',
    slug: '/shop?size=15.6',
    image: '/images/products/panel-b156xw04.png',
    itemCount: '320+ Displays',
  },
  {
    id: '16-inch',
    name: '16 Inch',
    slug: '/shop?size=16',
    image: '/images/products/panel-lm156lfgl01.png',
    itemCount: '45+ Displays',
  },
  {
    id: '17-3-inch',
    name: '17.3 Inch',
    slug: '/shop?size=17.3',
    image: '/images/products/panel-b173han04.png',
    itemCount: '60+ Displays',
  },
  {
    id: 'display-cables',
    name: 'Display Cables',
    slug: '/shop?category=cables',
    image: '/images/categories/cat-gaming-displays.png',
    itemCount: 'EDP Cables',
  },
  {
    id: 'accessories',
    name: 'Laptop Accessories',
    slug: '/shop?category=accessories',
    image: '/images/products/panel-touch-assembly.png',
    itemCount: 'Tools & Tapes',
  },
];

export function CategoryShowcase() {
  return (
    <section className="py-6 sm:py-8 bg-white border-b border-slate-200/90">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex items-center justify-between mb-4 sm:mb-5">
          <div>
            <h2 className="text-sm sm:text-base font-black text-slate-900 tracking-wider uppercase flex items-center gap-2">
              <Layers className="w-4 h-4 text-blue-600" />
              <span>Shop by Category</span>
            </h2>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              Select category to discover genuine laptop panels by size, connector and panel technology
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

        {/* Compact AliExpress-style Category Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-11 gap-2.5 sm:gap-3">
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.id}
              href={cat.slug}
              className="group flex flex-col items-center bg-white rounded-[4px] p-2.5 border border-slate-200 hover:border-blue-600 hover:shadow-sm hover:-translate-y-0.5 transition-all duration-200"
            >
              {/* Category Image (90-120px) */}
              <div className="relative w-full h-[85px] sm:h-[95px] bg-slate-50/70 mb-2 flex items-center justify-center overflow-hidden border border-slate-100 rounded-[2px]">
                <Image
                  src={cat.image}
                  alt={`Panelook.lk ${cat.name}`}
                  fill
                  className="object-contain p-2 group-hover:scale-105 transition-transform duration-200"
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 100px"
                />
              </div>

              {/* Category Title & Count */}
              <h3 className="text-[12px] sm:text-[13px] font-bold text-slate-900 group-hover:text-blue-600 text-center line-clamp-1 transition-colors px-0.5">
                {cat.name}
              </h3>
              <span className="text-[10px] text-slate-400 font-medium mt-0.5 text-center line-clamp-1">
                {cat.itemCount}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
