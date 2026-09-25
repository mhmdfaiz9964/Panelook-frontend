'use client';

import React from 'react';
import Link from 'next/link';
import { MessageCircle, ArrowRight, Camera } from 'lucide-react';

export function WhatsAppBanner() {
  const waUrl = 'https://wa.me/94766025870?text=Hello%20Panelook.lk%2C%20I%20need%20help%20finding%20the%20correct%20laptop%20display%20replacement';

  return (
    <section className="py-6 sm:py-8 bg-white border-b border-slate-200/80">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-[4px] bg-[#0B1B4B] p-5 sm:p-7 text-white shadow-xs border border-navy-900 flex flex-col md:flex-row items-center justify-between gap-5">
          
          {/* Left Text Content */}
          <div className="flex items-center gap-4 text-center md:text-left z-10">
            <div className="w-12 h-12 rounded-[3px] bg-[#25D366]/20 border border-[#25D366]/40 flex items-center justify-center shrink-0">
              <Camera className="w-6 h-6 text-[#25D366]" />
            </div>
            <div>
              <div className="inline-flex items-center gap-1.5 bg-blue-500/20 text-blue-300 text-[10px] font-black uppercase px-2 py-0.5 rounded-[2px] mb-1">
                <span>Free Technical Identification</span>
              </div>
              <h2 className="text-lg sm:text-xl font-black tracking-tight text-white">
                Can&apos;t Find Your Display Model?
              </h2>
              <p className="text-slate-300 text-xs sm:text-sm font-medium mt-0.5 max-w-xl">
                Send us your laptop model or existing display photo. Our team will help you find the correct replacement.
              </p>
            </div>
          </div>

          {/* Right Action CTAs */}
          <div className="z-10 flex flex-wrap items-center gap-3 shrink-0">
            <a
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold px-4 py-2.5 rounded-[3px] shadow-sm flex items-center gap-2 text-xs sm:text-sm transition-all hover:scale-[1.02] cursor-pointer"
            >
              <MessageCircle className="w-4 h-4 fill-white" />
              <span>Chat on WhatsApp (076 602 5870)</span>
            </a>

            <Link
              href="#find-display"
              className="bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold px-4 py-2.5 rounded-[3px] text-xs sm:text-sm flex items-center gap-1.5 transition-colors"
            >
              <span>Find Your Display</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

        </div>
      </div>
    </section>
  );
}
