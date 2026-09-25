'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, Sparkles, Layers } from 'lucide-react';

interface SizeCard {
  size: string;
  label: string;
  category: string;
  resolution: string;
  count: string;
  tag?: string;
  tagColor?: string;
  iconRatio: string; // width to height ratio representation
}

const DISPLAY_SIZES: SizeCard[] = [
  {
    size: '10.1',
    label: '10.1"',
    category: 'Mini / Netbook',
    resolution: '1024×600 / HD',
    count: '28 Panels',
    iconRatio: 'w-8 h-6',
  },
  {
    size: '11.6',
    label: '11.6"',
    category: 'Chromebook',
    resolution: 'HD 1366×768',
    count: '45 Panels',
    iconRatio: 'w-8.5 h-6',
  },
  {
    size: '12.5',
    label: '12.5"',
    category: 'Ultraportable',
    resolution: 'HD / FHD IPS',
    count: '35 Panels',
    iconRatio: 'w-9 h-6',
  },
  {
    size: '13.3',
    label: '13.3"',
    category: 'Ultrabook',
    resolution: 'FHD / 2K IPS',
    count: '85 Panels',
    iconRatio: 'w-9.5 h-6.5',
  },
  {
    size: '14',
    label: '14.0"',
    category: 'Business Slim',
    resolution: 'FHD 1920×1080',
    count: '145 Panels',
    tag: 'Popular',
    tagColor: 'bg-blue-600 text-white',
    iconRatio: 'w-10 h-6.5',
  },
  {
    size: '15.6',
    label: '15.6"',
    category: 'Standard & Gaming',
    resolution: 'FHD / 144Hz',
    count: '320 Panels',
    tag: 'Top Selling',
    tagColor: 'bg-emerald-600 text-white',
    iconRatio: 'w-11 h-7',
  },
  {
    size: '16',
    label: '16.0"',
    category: '16:10 Creator',
    resolution: 'WQXGA / QHD',
    count: '65 Panels',
    tag: 'Trending',
    tagColor: 'bg-purple-600 text-white',
    iconRatio: 'w-11.5 h-7.5',
  },
  {
    size: '17.3',
    label: '17.3"',
    category: 'Workstation',
    resolution: 'FHD / 4K Gaming',
    count: '90 Panels',
    tag: 'Gaming',
    tagColor: 'bg-indigo-600 text-white',
    iconRatio: 'w-12 h-7.5',
  },
  {
    size: '18',
    label: '18.0"',
    category: 'Pro Desktop Repl.',
    resolution: 'QHD+ 240Hz',
    count: '20 Panels',
    tag: 'New',
    tagColor: 'bg-amber-500 text-slate-900 font-extrabold',
    iconRatio: 'w-12.5 h-8',
  },
];

export function ShopBySize() {
  return (
    <section id="sizes" className="py-8 sm:py-10 bg-slate-50 border-b border-slate-200/80">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
          <div>
            <div className="inline-flex items-center gap-1.5 text-blue-600 text-[11px] font-black uppercase tracking-wider mb-1">
              <Layers className="w-3.5 h-3.5" />
              <span>Diagonal Screen Dimensions</span>
            </div>
            <h2 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight uppercase">
              Shop Displays by Size
            </h2>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              Select your laptop display size to browse 100% compatible genuine replacement panels
            </p>
          </div>

          <Link
            href="/shop"
            className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 hover:underline shrink-0 self-start sm:self-auto"
          >
            <span>View All Sizes</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* 9 Modern Size Cards with Icons & 5px Border Radius */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-9 gap-3">
          {DISPLAY_SIZES.map((item) => (
            <Link
              key={item.size}
              href={`/shop?size=${encodeURIComponent(item.size)}`}
              className="group relative bg-white rounded-[5px] border border-slate-200/90 hover:border-blue-600 p-3 sm:p-3.5 flex flex-col justify-between hover:shadow-md hover:-translate-y-1 transition-all duration-200 overflow-hidden"
            >
              {/* Optional Top Tag */}
              {item.tag && (
                <span
                  className={`absolute top-0 right-0 text-[9px] font-black uppercase px-2 py-0.5 rounded-bl-[4px] shadow-2xs ${item.tagColor}`}
                >
                  {item.tag}
                </span>
              )}

              {/* Modern Vector Screen Icon */}
              <div className="pt-1 pb-2 flex items-center justify-center">
                <div className="w-14 h-12 rounded-[4px] bg-slate-50 group-hover:bg-blue-50/70 border border-slate-200 group-hover:border-blue-300 flex items-center justify-center transition-colors shadow-2xs">
                  {/* Laptop Display Wireframe Icon with Diagonal Indicator */}
                  <div className={`relative ${item.iconRatio} max-w-[42px] max-h-[28px] rounded-[2px] border-2 border-slate-400 group-hover:border-blue-600 bg-white group-hover:bg-blue-600/10 flex items-center justify-center transition-all`}>
                    {/* Inner Screen Glow & Aspect Lines */}
                    <div className="w-full h-full flex items-center justify-center relative overflow-hidden">
                      <span className="text-[8px] font-black text-slate-600 group-hover:text-blue-700 tracking-tighter">
                        {item.label}
                      </span>
                      {/* Diagonal dimension ruler hint */}
                      <span className="absolute inset-x-0 bottom-0 h-0.5 bg-blue-600/30 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Size Title & Metadata */}
              <div className="text-center mt-1">
                <div className="flex items-baseline justify-center gap-0.5">
                  <span className="text-lg sm:text-xl font-black text-slate-900 group-hover:text-blue-600 transition-colors leading-none tracking-tight">
                    {item.label}
                  </span>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
                    INCH
                  </span>
                </div>

                <span className="block text-[11px] font-bold text-slate-700 mt-1 truncate">
                  {item.category}
                </span>

                <span className="block text-[9px] text-slate-400 font-medium truncate mt-0.5">
                  {item.resolution}
                </span>
              </div>

              {/* Bottom Stock Count & Hover Accent */}
              <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-[10px]">
                <span className="font-bold text-blue-600 group-hover:text-blue-700">
                  {item.count}
                </span>
                <ArrowRight className="w-3 h-3 text-slate-300 group-hover:text-blue-600 group-hover:translate-x-0.5 transition-all" />
              </div>

              {/* Bottom Active Accent Line */}
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 opacity-0 group-hover:opacity-100 transition-opacity" />
            </Link>
          ))}
        </div>

      </div>
    </section>
  );
}
