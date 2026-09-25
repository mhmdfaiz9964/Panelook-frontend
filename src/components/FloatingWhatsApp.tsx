'use client';

import React from 'react';
import { MessageCircle } from 'lucide-react';

export function FloatingWhatsApp() {
  const waUrl = 'https://wa.me/94766025870?text=Hello%20Panelook.lk%2C%20I%20need%20assistance%20finding%20the%20correct%20laptop%20display';

  return (
    <div className="fixed z-50 bottom-20 sm:bottom-6 right-4 sm:right-6">
      <a
        href={waUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="group flex items-center bg-[#25D366] hover:bg-[#20bd5a] text-white p-3 sm:px-4 sm:py-2.5 rounded-full sm:rounded-[4px] shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105 border border-emerald-400"
        aria-label="Chat on WhatsApp with Panelook Technical Support"
      >
        <MessageCircle className="w-6 h-6 sm:w-5 sm:h-5 fill-white shrink-0" />
        
        {/* Desktop Detailed Label */}
        <div className="hidden sm:flex flex-col text-left ml-2.5 leading-tight">
          <span className="text-[10px] font-bold text-emerald-100 uppercase tracking-wider">
            Chat on WhatsApp
          </span>
          <span className="text-xs font-black tracking-wide">
            076 602 5870
          </span>
        </div>
      </a>
    </div>
  );
}
