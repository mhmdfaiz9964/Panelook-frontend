'use client';

import React from 'react';
import { ShieldCheck, Award, Truck, Lock, Headphones } from 'lucide-react';

export function WhyChooseUs() {
  const benefits = [
    {
      icon: ShieldCheck,
      title: '100% Genuine Displays',
      subtitle: 'Original & Quality Panels',
      color: 'text-blue-600 bg-blue-50 border-blue-200',
    },
    {
      icon: Award,
      title: 'Warranty',
      subtitle: '3–12 Months Warranty',
      color: 'text-purple-600 bg-purple-50 border-purple-200',
    },
    {
      icon: Truck,
      title: 'Islandwide Delivery',
      subtitle: 'Fast & Safe Delivery',
      color: 'text-blue-600 bg-blue-50 border-blue-200',
    },
    {
      icon: Lock,
      title: 'Secure Payments',
      subtitle: '100% Protected',
      color: 'text-emerald-600 bg-emerald-50 border-emerald-200',
    },
    {
      icon: Headphones,
      title: 'Expert Support',
      subtitle: "We're Here to Help",
      color: 'text-indigo-600 bg-indigo-50 border-indigo-200',
    },
  ];

  return (
    <section id="features" className="py-8 sm:py-10 bg-slate-50 border-b border-slate-200/80">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center mb-6">
          <h2 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight uppercase">
            Why Choose Panelook.lk?
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1">
            Sri Lanka&apos;s most reliable partner for genuine laptop replacement displays
          </p>
        </div>

        {/* 5 Benefits Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {benefits.map((b, idx) => {
            const Icon = b.icon;
            return (
              <div
                key={idx}
                className="bg-white rounded-[4px] p-4 border border-slate-200 shadow-2xs hover:border-blue-600 hover:shadow-xs transition-all flex flex-col items-center text-center group"
              >
                <div className={`w-10 h-10 rounded-[3px] flex items-center justify-center mb-2.5 border ${b.color} group-hover:scale-105 transition-transform`}>
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="text-xs sm:text-sm font-bold text-slate-900">{b.title}</h3>
                <p className="text-[11px] font-medium text-slate-500 mt-0.5">{b.subtitle}</p>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
