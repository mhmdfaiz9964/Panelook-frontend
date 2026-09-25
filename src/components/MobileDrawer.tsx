'use client';

import React from 'react';
import Link from 'next/link';
import { X, MessageCircle, ChevronRight } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { Logo } from './Logo';

interface MobileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MobileDrawer({ isOpen, onClose }: MobileDrawerProps) {
  const { generateWhatsAppLink } = useCart();

  if (!isOpen) return null;

  const links = [
    { name: 'Home', href: '/' },
    { name: 'Shop All Displays', href: '/shop' },
    { name: 'Display Finder Wizard', href: '/display-finder' },
    { name: 'Laptop Brands', href: '/#brands' },
    { name: '14 Inch Displays', href: '/shop?size=14' },
    { name: '15.6 Inch Displays', href: '/shop?size=15.6' },
    { name: '17.3 Inch Displays', href: '/shop?size=17.3' },
    { name: '30-Pin Displays', href: '/shop?pin=30-pin' },
    { name: '40-Pin Displays', href: '/shop?pin=40-pin' },
    { name: 'My Orders & Account', href: '/account' },
    { name: 'About Us', href: '/about' },
    { name: 'Contact Us', href: '/contact' },
  ];

  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Slide-over panel */}
      <div className="fixed inset-y-0 left-0 w-4/5 max-w-xs bg-white shadow-2xl flex flex-col justify-between animate-in slide-in-from-left duration-300">
        <div>
          {/* Header */}
          <div className="p-4 border-b border-slate-100 flex items-center justify-between">
            <Logo markClassName="w-8 h-8" nameClassName="text-lg" tagline={false} />
            <button
              onClick={onClose}
              className="p-1.5 text-slate-500 hover:text-slate-900 rounded-lg hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Links */}
          <div className="p-3 space-y-1 overflow-y-auto max-h-[calc(100vh-180px)]">
            {links.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={onClose}
                className="flex items-center justify-between px-3 py-2.5 text-sm font-semibold text-slate-700 hover:text-blue-600 hover:bg-blue-50/80 rounded-xl transition-colors"
              >
                <span>{link.name}</span>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </Link>
            ))}
          </div>
        </div>

        {/* Footer CTA */}
        <div className="p-4 border-t border-slate-100 bg-slate-50">
          <a
            href={generateWhatsAppLink()}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm py-3 rounded-xl shadow-md transition-colors"
          >
            <MessageCircle className="w-4 h-4 fill-white" />
            <span>Chat on WhatsApp</span>
          </a>
        </div>
      </div>
    </div>
  );
}
