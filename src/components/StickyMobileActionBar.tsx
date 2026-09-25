'use client';

import React from 'react';
import Link from 'next/link';
import { SlidersHorizontal, ShoppingBag, MessageCircle } from 'lucide-react';
import { useCart } from '@/context/CartContext';

interface StickyMobileActionBarProps {
  onToggleFilter?: () => void;
}

export function StickyMobileActionBar({ onToggleFilter }: StickyMobileActionBarProps) {
  const { totalItems, subtotal, generateWhatsAppLink } = useCart();

  return (
    <div className="fixed bottom-[calc(3.5rem+env(safe-area-inset-bottom,0px)+0.25rem)] left-0 right-0 z-40 lg:hidden px-2 pb-1 pointer-events-none">
      <div className="max-w-md mx-auto pointer-events-auto">
        <div className="grid grid-cols-12 gap-1.5 items-stretch">
          
          {/* Left: Filter Button */}
          {onToggleFilter && (
            <button
              onClick={onToggleFilter}
              className="col-span-3 bg-white border border-slate-300 text-slate-900 font-bold px-1.5 py-1.5 rounded-[4px] shadow-md text-[11px] flex items-center justify-center gap-1 shrink-0 active:scale-95 transition-transform cursor-pointer min-w-0"
              aria-label="Toggle filters"
            >
              <SlidersHorizontal className="w-3.5 h-3.5 text-slate-800 shrink-0" />
              <span className="truncate">Filter</span>
            </button>
          )}

          {/* Center: View Order */}
          <Link
            href="/cart"
            className={`${onToggleFilter ? 'col-span-5' : 'col-span-7'} bg-primary-gradient text-white font-bold py-1.5 px-2 rounded-[4px] shadow-md shadow-purple-600/30 text-[11px] flex items-center justify-center gap-1.5 active:scale-95 transition-transform min-w-0`}
            aria-label={`View order with ${totalItems} items`}
          >
            <ShoppingBag className="w-3.5 h-3.5 shrink-0" />
            <div className="text-center leading-tight truncate">
              <span className="block font-bold text-[10px] truncate">Order ({totalItems})</span>
              <span className="block font-black text-[11px] truncate">LKR {subtotal.toLocaleString()}</span>
            </div>
          </Link>

          {/* Right: Order on WhatsApp Button */}
          <a
            href={generateWhatsAppLink()}
            target="_blank"
            rel="noopener noreferrer"
            className={`${onToggleFilter ? 'col-span-4' : 'col-span-5'} bg-[#22c55e] hover:bg-[#16a34a] text-white font-bold py-1.5 px-1.5 rounded-[4px] shadow-md shadow-emerald-500/30 flex items-center justify-center gap-1 active:scale-95 transition-transform text-[11px] min-w-0`}
            aria-label="Order on WhatsApp"
          >
            <MessageCircle className="w-3.5 h-3.5 fill-white shrink-0" />
            <div className="text-left leading-tight truncate">
              <span className="block text-[9px] font-medium leading-none truncate">Order on</span>
              <span className="block text-[11px] font-black leading-none mt-0.5 truncate">WhatsApp</span>
            </div>
          </a>

        </div>
      </div>
    </div>
  );
}
