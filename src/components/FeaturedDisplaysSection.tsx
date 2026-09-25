'use client';

import React from 'react';
import Link from 'next/link';
import { Product } from '@/types';
import { ProductCard } from './ProductCard';
import { Sparkles, ArrowRight } from 'lucide-react';

interface FeaturedDisplaysSectionProps {
  products: Product[];
}

export function FeaturedDisplaysSection({ products }: FeaturedDisplaysSectionProps) {
  const featured = products.filter((p) => p.is_featured || p.is_new).slice(0, 6);
  const displayList = featured.length > 0 ? featured : products.slice(0, 6);

  if (displayList.length === 0) return null;

  return (
    <section className="py-6 sm:py-8 bg-white border-b border-slate-200/80">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex items-center justify-between mb-4 sm:mb-5">
          <div>
            <h2 className="text-sm sm:text-base font-black text-slate-900 tracking-wider uppercase flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-blue-600" />
              <span>Featured Displays</span>
            </h2>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              Verified original manufacturer panels currently in stock with immediate dispatch
            </p>
          </div>
          <Link
            href="/shop?sort=featured"
            className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 hover:underline shrink-0"
          >
            <span>View All</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* 5-6 Column Desktop Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6 gap-2.5 sm:gap-3">
          {displayList.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

      </div>
    </section>
  );
}
