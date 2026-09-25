'use client';

import React from 'react';
import Link from 'next/link';
import { Building2, ArrowRight, MessageCircle, DollarSign, PackageCheck, Truck, UserCheck } from 'lucide-react';

const B2B_BENEFITS = [
  {
    icon: DollarSign,
    title: 'Wholesale Pricing',
    desc: 'Tiered volume discounts for repair shops & technicians',
  },
  {
    icon: PackageCheck,
    title: 'Large Stock Availability',
    desc: 'Hundreds of display models always in Colombo inventory',
  },
  {
    icon: Truck,
    title: 'Fast Islandwide Delivery',
    desc: 'Priority safe courier dispatch to all 25 districts',
  },
  {
    icon: UserCheck,
    title: 'Dedicated Support',
    desc: 'Direct line to technical engineers for panel matching',
  },
];

export function BulkOrdersSection() {
  const waUrl = 'https://wa.me/94766025870?text=Hello%20Panelook.lk%2C%20I%20am%20a%20business%2Ftechnician%20inquiring%20about%20bulk%20wholesale%20display%20pricing';

  return (
    <section id="bulk-orders" className="py-8 sm:py-10 bg-slate-50 border-b border-slate-200/80">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-[4px] border border-slate-200 p-6 sm:p-8 shadow-xs">
          
          {/* Header Row */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-slate-100">
            <div>
              <div className="flex items-center gap-2 text-blue-600 font-black text-xs uppercase tracking-wider mb-1">
                <Building2 className="w-4 h-4" />
                <span>B2B &amp; Wholesale Partner Program</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                Bulk Orders for Businesses
              </h2>
              <p className="text-slate-500 text-xs sm:text-sm font-medium mt-1 max-w-2xl">
                Special prices for repair shops, resellers and businesses across Sri Lanka.
              </p>
            </div>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-3 shrink-0">
              <Link
                href="/contact"
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-4 py-2.5 rounded-[3px] text-xs sm:text-sm flex items-center gap-1.5 transition-colors shadow-xs"
              >
                <span>Request Bulk Pricing</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
              <a
                href={waUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 font-bold px-4 py-2.5 rounded-[3px] text-xs sm:text-sm flex items-center gap-1.5 transition-colors"
              >
                <MessageCircle className="w-4 h-4 text-emerald-600" />
                <span>Contact on WhatsApp</span>
              </a>
            </div>
          </div>

          {/* 4 Benefits Columns */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-6">
            {B2B_BENEFITS.map((b, idx) => {
              const Icon = b.icon;
              return (
                <div
                  key={idx}
                  className="bg-slate-50 rounded-[3px] p-4 border border-slate-100 flex items-start gap-3"
                >
                  <div className="w-9 h-9 rounded-[2px] bg-white border border-slate-200 flex items-center justify-center shrink-0 text-blue-600 shadow-2xs">
                    <Icon className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-xs sm:text-sm font-bold text-slate-900">
                      {b.title}
                    </h3>
                    <p className="text-[11px] text-slate-500 font-medium mt-0.5 leading-snug">
                      {b.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </div>
    </section>
  );
}
