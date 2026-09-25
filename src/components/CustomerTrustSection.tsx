'use client';

import React from 'react';
import { Users, Clock, Truck, Star, CheckCircle } from 'lucide-react';

export function CustomerTrustSection() {
  const stats = [
    {
      icon: Users,
      value: '1,000+',
      label: 'Satisfied Customers',
      sublabel: 'Laptop owners & technicians islandwide',
      color: 'text-blue-600',
    },
    {
      icon: Clock,
      value: '6+',
      label: 'Years of Experience',
      sublabel: 'Specialized in laptop LCD replacement',
      color: 'text-purple-600',
    },
    {
      icon: Truck,
      value: 'Islandwide',
      label: 'Safe Courier Delivery',
      sublabel: 'Shockproof custom display packaging',
      color: 'text-emerald-600',
    },
    {
      icon: Star,
      value: '4.8 / 5.0',
      label: 'Customer Rating',
      sublabel: 'Over 500+ verified panel deliveries',
      color: 'text-amber-500',
    },
  ];

  return (
    <section className="py-8 sm:py-10 bg-white border-b border-slate-200/80">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center mb-6 sm:mb-8">
          <div className="inline-flex items-center gap-1.5 bg-blue-50 text-blue-700 text-[11px] font-bold px-2.5 py-1 rounded-[2px] border border-blue-100 mb-2">
            <CheckCircle className="w-3.5 h-3.5 text-blue-600" />
            <span>Sri Lanka&apos;s Verified Display Specialist</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight uppercase">
            Trusted by Customers Across Sri Lanka
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1">
            Delivering authentic laptop displays to individuals, repair centers, and corporate IT teams
          </p>
        </div>

        {/* 4 Trust Metrics */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {stats.map((st, idx) => {
            const Icon = st.icon;
            return (
              <div
                key={idx}
                className="bg-slate-50 border border-slate-200 rounded-[4px] p-4 sm:p-5 flex flex-col items-center text-center hover:border-slate-300 transition-colors"
              >
                <div className="w-11 h-11 rounded-[3px] bg-white border border-slate-200 flex items-center justify-center mb-3 shadow-2xs">
                  <Icon className={`w-5 h-5 ${st.color}`} />
                </div>
                <div className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                  {st.value}
                </div>
                <div className="text-xs sm:text-sm font-bold text-slate-800 mt-0.5">
                  {st.label}
                </div>
                <p className="text-[11px] text-slate-500 font-medium mt-1 leading-tight">
                  {st.sublabel}
                </p>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
