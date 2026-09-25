'use client';

import React, { useState } from 'react';
import { ChevronRight, Monitor, Hand, Cable, Cpu } from 'lucide-react';

interface CategoryBarProps {
  onSelectCategory?: (categoryKey: string) => void;
}

interface FilterItem {
  id: string;
  label: string;
  badgeContent?: React.ReactNode;
  url: string;
}

export function CategoryBar({ onSelectCategory }: CategoryBarProps) {
  const [activePill, setActivePill] = useState('all');

  const filters: FilterItem[] = [
    {
      id: 'all',
      label: 'All Displays',
      url: '/shop',
      badgeContent: (
        <div className="w-8 h-6 rounded-[2px] border-2 border-blue-600 flex items-center justify-center bg-blue-50">
          <Monitor className="w-3.5 h-3.5 text-blue-600" />
        </div>
      ),
    },
    {
      id: 'touch',
      label: 'Touch',
      url: '/shop?touch=Touch',
      badgeContent: (
        <div className="w-8 h-6 rounded-[2px] border-2 border-indigo-500 flex items-center justify-center bg-indigo-50">
          <Hand className="w-3.5 h-3.5 text-indigo-600" />
        </div>
      ),
    },
    {
      id: 'ips',
      label: 'IPS',
      url: '/shop?ips=1',
      badgeContent: (
        <div className="w-8 h-6 rounded-[2px] border-2 border-emerald-500 flex items-center justify-center bg-emerald-50 text-[9px] font-black text-emerald-700">
          IPS
        </div>
      ),
    },
    {
      id: '30-pin',
      label: '30-Pin',
      url: '/shop?pin=30-pin',
      badgeContent: (
        <div className="w-8 h-6 rounded-[2px] border-2 border-pink-500 flex items-center justify-center bg-pink-50">
          <Cable className="w-3.5 h-3.5 text-pink-600" />
        </div>
      ),
    },
    {
      id: '40-pin',
      label: '40-Pin',
      url: '/shop?pin=40-pin',
      badgeContent: (
        <div className="w-8 h-6 rounded-[2px] border-2 border-teal-500 flex items-center justify-center bg-teal-50">
          <Cpu className="w-3.5 h-3.5 text-teal-600" />
        </div>
      ),
    },
    {
      id: '14',
      label: '14"',
      url: '/shop?size=14',
      badgeContent: (
        <div className="w-8 h-6 rounded-[2px] border border-slate-300 flex items-center justify-center bg-slate-100 text-[10px] font-black text-slate-800">
          14&quot;
        </div>
      ),
    },
    {
      id: '15.6',
      label: '15.6"',
      url: '/shop?size=15.6',
      badgeContent: (
        <div className="w-8 h-6 rounded-[2px] border border-slate-300 flex items-center justify-center bg-slate-100 text-[10px] font-black text-slate-800">
          15.6&quot;
        </div>
      ),
    },
    {
      id: '16',
      label: '16"',
      url: '/shop?size=16',
      badgeContent: (
        <div className="w-8 h-6 rounded-[2px] border border-slate-300 flex items-center justify-center bg-slate-100 text-[10px] font-black text-slate-800">
          16&quot;
        </div>
      ),
    },
    {
      id: '17.3',
      label: '17.3"',
      url: '/shop?size=17.3',
      badgeContent: (
        <div className="w-8 h-6 rounded-[2px] border border-slate-300 flex items-center justify-center bg-slate-100 text-[10px] font-black text-slate-800">
          17.3&quot;
        </div>
      ),
    },
    {
      id: '18',
      label: '18"',
      url: '/shop?size=18',
      badgeContent: (
        <div className="w-8 h-6 rounded-[2px] border border-slate-300 flex items-center justify-center bg-slate-100 text-[10px] font-black text-slate-800">
          18&quot;
        </div>
      ),
    },
  ];

  const handlePillClick = (item: FilterItem) => {
    setActivePill(item.id);
    if (onSelectCategory) {
      onSelectCategory(item.id);
    } else {
      window.location.href = item.url;
    }
  };

  return (
    <section className="py-3 sm:py-4 bg-white border-b border-slate-200/70">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2 sm:gap-2.5 overflow-x-auto no-scrollbar py-0.5">
          {filters.map((cat) => {
            const isActive = activePill === cat.id;

            return (
              <button
                key={cat.id}
                onClick={() => handlePillClick(cat)}
                className={`flex flex-col items-center justify-center min-w-[82px] sm:min-w-[94px] py-1.5 px-2 rounded-[3px] border transition-all shrink-0 cursor-pointer group ${
                  isActive
                    ? 'bg-blue-50/80 border-blue-600 shadow-xs'
                    : 'bg-white border-slate-200 hover:border-slate-400 hover:shadow-xs'
                }`}
              >
                <div className="mb-1 group-hover:scale-105 transition-transform">
                  {cat.badgeContent}
                </div>
                <span className={`text-[11px] font-bold whitespace-nowrap ${
                  isActive ? 'text-blue-700' : 'text-slate-700 group-hover:text-blue-600'
                }`}>
                  {cat.label}
                </span>
              </button>
            );
          })}

          <a
            href="/shop"
            className="w-8 h-8 rounded-[3px] bg-white border border-slate-200 shadow-xs flex items-center justify-center text-slate-500 hover:text-blue-600 hover:border-blue-300 transition-all shrink-0 ml-1"
            aria-label="View All Displays"
          >
            <ChevronRight className="w-4 h-4" />
          </a>
        </div>
      </div>
    </section>
  );
}
