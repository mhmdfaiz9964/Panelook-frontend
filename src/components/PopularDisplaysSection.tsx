'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Product } from '@/types';
import { ProductCard } from './ProductCard';
import { Star, ArrowRight } from 'lucide-react';

interface PopularDisplaysSectionProps {
  products: Product[];
}

const TABS = ['All', 'FHD', 'Touch', 'IPS', '30-Pin', '40-Pin'];

export function PopularDisplaysSection({ products }: PopularDisplaysSectionProps) {
  const [activeTab, setActiveTab] = useState('All');

  const filteredProducts = products.filter((p) => {
    if (activeTab === 'All') return true;
    if (activeTab === 'FHD') return p.resolution?.toLowerCase().includes('1920') || p.resolution?.toLowerCase().includes('fhd');
    if (activeTab === 'Touch') return p.touch_type?.toLowerCase().includes('touch');
    if (activeTab === 'IPS') return p.display_type?.toLowerCase().includes('ips');
    if (activeTab === '30-Pin') return p.pin_type?.toLowerCase().includes('30');
    if (activeTab === '40-Pin') return p.pin_type?.toLowerCase().includes('40');
    return true;
  });

  const displayList = filteredProducts.length > 0 ? filteredProducts.slice(0, 10) : products.slice(0, 10);

  return (
    <section className="py-6 sm:py-8 bg-white border-b border-slate-200/80">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 sm:mb-5">
          <div>
            <h2 className="text-sm sm:text-base font-black text-slate-900 tracking-wider uppercase flex items-center gap-2">
              <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
              <span>Popular Laptop Displays</span>
            </h2>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              Most requested replacement screens with verified compatibility
            </p>
          </div>

          <div className="flex items-center gap-4">
            {/* Filter Tabs */}
            <div className="flex items-center gap-1 overflow-x-auto no-scrollbar py-1">
              {TABS.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-3 py-1 rounded-[3px] text-xs font-bold transition-colors cursor-pointer whitespace-nowrap ${
                    activeTab === tab
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            <Link
              href="/shop"
              className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 hover:underline shrink-0"
            >
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* 5-Column Desktop, 3-Column Tablet, 2-Column Mobile Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 xl:grid-cols-5 gap-2.5 sm:gap-3">
          {displayList.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

      </div>
    </section>
  );
}
