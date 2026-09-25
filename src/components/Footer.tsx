'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Phone, Mail, MapPin, Clock, MessageCircle } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-white border-t border-slate-200 text-slate-700 pt-12 pb-24 lg:pb-12 relative z-10">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">

        {/* Top Footer: Brand Logo, Description, Social Icons */}
        <div className="pb-8 mb-8 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <Link href="/" className="inline-block">
              <div className="relative w-[180px] sm:w-[210px] h-[50px]">
                <Image
                  src="/images/logo.jpeg"
                  alt="Panelook.lk - Sri Lanka's Trusted Laptop Display Partner"
                  fill
                  className="object-contain object-left"
                  sizes="210px"
                />
              </div>
            </Link>
            <p className="text-xs text-slate-500 max-w-md leading-relaxed">
              Sri Lanka&apos;s trusted laptop display store. Genuine laptop displays with warranty and islandwide delivery.
            </p>
          </div>

          {/* Social Icons */}
          <div className="flex items-center gap-2">
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              className="w-8 h-8 rounded-[3px] bg-slate-100 hover:bg-blue-600 text-slate-600 hover:text-white flex items-center justify-center text-xs font-black transition-colors"
              aria-label="Facebook"
            >
              f
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="w-8 h-8 rounded-[3px] bg-slate-100 hover:bg-pink-600 text-slate-600 hover:text-white flex items-center justify-center text-xs font-black transition-colors"
              aria-label="Instagram"
            >
              ig
            </a>
            <a
              href="https://youtube.com"
              target="_blank"
              rel="noopener noreferrer"
              className="w-8 h-8 rounded-[3px] bg-slate-100 hover:bg-red-600 text-slate-600 hover:text-white flex items-center justify-center text-xs font-black transition-colors"
              aria-label="YouTube"
            >
              yt
            </a>
            <a
              href="https://tiktok.com"
              target="_blank"
              rel="noopener noreferrer"
              className="w-8 h-8 rounded-[3px] bg-slate-100 hover:bg-slate-900 text-slate-600 hover:text-white flex items-center justify-center text-xs font-black transition-colors"
              aria-label="TikTok"
            >
              tk
            </a>
          </div>
        </div>

        {/* 5 Column Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-8 pb-10 border-b border-slate-200/80">

          {/* COLUMN 1: Quick Links */}
          <div>
            <h3 className="text-xs font-black tracking-wider text-slate-900 uppercase mb-3.5">
              Quick Links
            </h3>
            <ul className="space-y-2 text-xs font-medium text-slate-600">
              <li><Link href="/shop" className="hover:text-blue-600 transition-colors">Shop Displays</Link></li>
              <li><Link href="/#brands" className="hover:text-blue-600 transition-colors">Brands</Link></li>
              <li><Link href="/#sizes" className="hover:text-blue-600 transition-colors">Sizes</Link></li>
              <li><Link href="/shop?pin=30-pin" className="hover:text-blue-600 transition-colors">Pin Types</Link></li>
              <li><Link href="/shop?touch=Touch" className="hover:text-blue-600 transition-colors">Touch Displays</Link></li>
              <li><Link href="/shop?category=accessories" className="hover:text-blue-600 transition-colors">Accessories</Link></li>
              <li><Link href="/#bulk-orders" className="hover:text-blue-600 transition-colors">Bulk Orders</Link></li>
            </ul>
          </div>

          {/* COLUMN 2: Customer Service */}
          <div>
            <h3 className="text-xs font-black tracking-wider text-slate-900 uppercase mb-3.5">
              Customer Service
            </h3>
            <ul className="space-y-2 text-xs font-medium text-slate-600">
              <li><Link href="/checkout" className="hover:text-blue-600 transition-colors">Track Order</Link></li>
              <li><Link href="/contact" className="hover:text-blue-600 transition-colors">Help &amp; Support</Link></li>
              <li><Link href="/warranty" className="hover:text-blue-600 transition-colors">Warranty &amp; Returns</Link></li>
              <li><Link href="/shipping" className="hover:text-blue-600 transition-colors">Shipping &amp; Delivery</Link></li>
              <li><Link href="/contact" className="hover:text-blue-600 transition-colors">Contact Us</Link></li>
              <li>
                <a
                  href="https://wa.me/94766025870"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-emerald-600 transition-colors flex items-center gap-1 font-semibold text-emerald-700"
                >
                  <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
                  <span>WhatsApp Support</span>
                </a>
              </li>
            </ul>
          </div>

          {/* COLUMN 3: Company */}
          <div>
            <h3 className="text-xs font-black tracking-wider text-slate-900 uppercase mb-3.5">
              Company
            </h3>
            <ul className="space-y-2 text-xs font-medium text-slate-600">
              <li><Link href="/about" className="hover:text-blue-600 transition-colors">About Us</Link></li>
              <li><Link href="/#why-us" className="hover:text-blue-600 transition-colors">Why Choose Us</Link></li>
              <li><Link href="/terms" className="hover:text-blue-600 transition-colors">Terms &amp; Conditions</Link></li>
              <li><Link href="/privacy" className="hover:text-blue-600 transition-colors">Privacy Policy</Link></li>
              <li><Link href="/contact" className="hover:text-blue-600 transition-colors">Careers</Link></li>
            </ul>
          </div>

          {/* COLUMN 4: Contact Us */}
          <div>
            <h3 className="text-xs font-black tracking-wider text-slate-900 uppercase mb-3.5">
              Contact Us
            </h3>
            <ul className="space-y-2.5 text-xs text-slate-600 font-medium">
              <li className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                <a href="tel:0766025870" className="hover:text-blue-600 font-bold">076 602 5870</a>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                <a href="mailto:info@panelook.lk" className="hover:text-blue-600">info@panelook.lk</a>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="w-3.5 h-3.5 text-blue-600 shrink-0 mt-0.5" />
                <span>Colombo, Sri Lanka</span>
              </li>
              <li className="flex items-start gap-2">
                <Clock className="w-3.5 h-3.5 text-blue-600 shrink-0 mt-0.5" />
                <span>Mon – Sat: 9AM – 6PM</span>
              </li>
            </ul>
          </div>

          {/* COLUMN 5: Payment Methods */}
          <div>
            <h3 className="text-xs font-black tracking-wider text-slate-900 uppercase mb-3.5">
              Payment Methods
            </h3>
            <div className="flex flex-wrap items-center gap-1.5 mb-3">
              <span className="px-2 py-1 bg-slate-100 border border-slate-200 rounded-[2px] text-[10px] font-black text-slate-800">
                VISA
              </span>
              <span className="px-2 py-1 bg-slate-100 border border-slate-200 rounded-[2px] text-[10px] font-black text-slate-800">
                Mastercard
              </span>
              <span className="px-2 py-1 bg-blue-50 text-blue-700 border border-blue-200 rounded-[2px] text-[10px] font-black">
                KOKO
              </span>
              <span className="px-2 py-1 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-[2px] text-[10px] font-bold">
                Cash on Delivery
              </span>
            </div>
            <p className="text-[11px] text-slate-400 leading-snug">
              Encrypted 256-bit SSL transaction security and safe cash handling on delivery.
            </p>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-semibold text-slate-500">
          <div>&copy; 2026 Panelook.lk. All rights reserved.</div>
          <div className="flex items-center gap-1.5">
            <span>Proudly Sri Lankan</span>
            <span className="text-base">🇱🇰</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
