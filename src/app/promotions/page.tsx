'use client';

import React, { useState } from 'react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { FixedMobileBottomNav } from '@/components/FixedMobileBottomNav';
import { MessageCircle, ShieldCheck, Truck, CreditCard, Sparkles, Monitor, Layers, Cpu, Award, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function PromotionsPage() {
  const [activeTab, setActiveTab] = useState('all');

  const banners = [
    {
      id: 1,
      title: '1. Main Website Hero Banner',
      headline: 'Perfect Match. Perfect Vision.',
      subtext: 'Find the exact laptop display for your device. Search by panel number, laptop model, brand, size or pin type.',
      cta: 'Shop Laptop Displays',
      category: 'website',
      bg: 'from-blue-600 to-indigo-700 text-white',
      badge: '100% Genuine | Warranty | Islandwide Delivery | Secure Payment',
    },
    {
      id: 2,
      title: '2. Laptop Display Promotion Banner',
      headline: 'Upgrade Your Laptop Screen',
      subtext: 'Premium replacement displays for HP, Dell, Lenovo, ASUS, Acer & MSI.',
      cta: 'Shop Displays',
      category: 'promotions',
      bg: 'from-slate-900 to-blue-950 text-white',
      badge: 'Starting from LKR 12,500',
    },
    {
      id: 3,
      title: '3. Panel Number Search Banner',
      headline: 'Know Your Panel Number? Find It Fast.',
      subtext: 'Search by panel number (e.g., B156XW04 V.8) and find the exact compatible display.',
      cta: 'Search Panel',
      category: 'features',
      bg: 'from-indigo-600 to-purple-700 text-white',
      badge: 'Exact Match Guarantee',
    },
    {
      id: 4,
      title: '6. 30-Pin vs 40-Pin Technical Comparison Banner',
      headline: '30-Pin or 40-Pin?',
      subtext: '30-PIN (FHD / HD Standard) vs 40-PIN (QHD / 144Hz / Touch). Choose the correct connector before ordering.',
      cta: 'View Pin Types',
      category: 'technical',
      bg: 'from-slate-900 via-indigo-950 to-slate-900 text-white',
      badge: 'Technical Specs Guide',
    },
    {
      id: 5,
      title: '7. IPS Display Banner',
      headline: 'Experience Better Colors With IPS',
      subtext: 'Sharp colors. Wide viewing angles. Better viewing experience.',
      cta: 'Shop IPS Displays',
      category: 'features',
      bg: 'from-cyan-600 to-blue-700 text-white',
      badge: 'IPS Wide Angle',
    },
    {
      id: 6,
      title: '8. Touch Screen Banner',
      headline: 'Make Your Laptop Touch-Ready',
      subtext: 'Original digitizer touch assembly screens for HP Envy, ASUS ZenBook & Dell Inspiron Touch.',
      cta: 'Shop Touch Displays',
      category: 'features',
      bg: 'from-purple-600 to-pink-600 text-white',
      badge: 'Touch Compatible',
    },
    {
      id: 7,
      title: '15. Warranty Banner',
      headline: 'Shop With Confidence',
      subtext: 'Warranty support on selected laptop display panels.',
      cta: 'View Warranty Terms',
      category: 'trust',
      bg: 'from-emerald-600 to-teal-700 text-white',
      badge: '3–12 Months Warranty',
    },
    {
      id: 8,
      title: '16. Islandwide Delivery Banner',
      headline: 'Islandwide Laptop Display Delivery',
      subtext: 'Fast & safe doorstep courier delivery across all 25 districts of Sri Lanka.',
      cta: 'Order Now',
      category: 'trust',
      bg: 'from-blue-700 to-slate-900 text-white',
      badge: 'Fast & Safe Delivery',
    },
    {
      id: 9,
      title: '18. Wholesale & Bulk Orders Banner',
      headline: 'Wholesale & Bulk Orders',
      subtext: 'Special pricing for laptop repair shops, technicians, dealers and businesses in Sri Lanka.',
      cta: 'Wholesale Inquiry',
      category: 'b2b',
      bg: 'from-amber-600 to-orange-700 text-white',
      badge: 'B2B Special Rates',
    },
    {
      id: 10,
      title: '25. KOKO Pay Installment Banner',
      headline: 'Buy Now With KOKO Pay',
      subtext: 'Flexible payment options for your laptop display purchase. Pay in 3 easy interest-free installments.',
      cta: 'Buy With KOKO Pay',
      category: 'payments',
      bg: 'from-blue-600 via-indigo-600 to-purple-600 text-white',
      badge: '3 Easy Installments | 0% Interest',
    },
  ];

  const socialMediaGraphics = [
    { title: 'New Product', tag: 'NEW ARRIVAL', text: 'New Laptop Display Stock Arrived' },
    { title: 'Best Seller', tag: 'POPULAR', text: 'Customer Favorite Panels' },
    { title: 'Price Promotion', tag: 'BEST DEAL', text: 'Displays From LKR 12,500' },
    { title: 'HP Displays', tag: 'HP BRAND', text: 'Genuine HP Laptop Screens' },
    { title: 'Dell Displays', tag: 'DELL BRAND', text: 'Original Dell Inspiron/Latitude Panels' },
    { title: 'Lenovo Displays', tag: 'LENOVO BRAND', text: 'ThinkPad & IdeaPad Display Stock' },
    { title: 'ASUS Displays', tag: 'ASUS BRAND', text: 'ASUS ZenBook & ROG Screens' },
    { title: 'Acer Displays', tag: 'ACER BRAND', text: 'Acer Nitro & Aspire LCD Panels' },
    { title: 'MSI Displays', tag: 'MSI BRAND', text: '144Hz MSI Gaming Panels' },
  ];

  const filteredBanners = activeTab === 'all' ? banners : banners.filter((b) => b.category === activeTab);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 flex-1 w-full space-y-12">
        
        {/* Header Title */}
        <div className="text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 text-blue-700 font-bold text-xs mb-3">
            <Sparkles className="w-4 h-4" />
            <span>Panelook.lk Graphics System</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            AI Graphics & Banner System
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 font-medium mt-2">
            Complete marketing banners, technical comparison graphics, social media posts, and payment strips built for Sri Lanka’s #1 laptop display store.
          </p>
        </div>

        {/* Filter Category Tabs */}
        <div className="flex items-center justify-center gap-2 overflow-x-auto no-scrollbar py-2">
          {['all', 'website', 'promotions', 'features', 'technical', 'trust', 'b2b', 'payments'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-xl text-xs font-bold capitalize transition-all shrink-0 cursor-pointer ${
                activeTab === tab
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                  : 'bg-white text-slate-700 border border-slate-200 hover:border-slate-300'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Banners Display Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
          {filteredBanners.map((b) => (
            <div
              key={b.id}
              className={`relative overflow-hidden rounded-3xl p-6 sm:p-8 bg-gradient-to-r ${b.bg} shadow-xl flex flex-col justify-between space-y-6 group hover:scale-[1.01] transition-transform`}
            >
              <div>
                <span className="text-[10px] font-black tracking-widest uppercase bg-white/20 px-3 py-1 rounded-full text-white inline-block mb-3">
                  {b.title}
                </span>
                <h3 className="text-2xl font-black tracking-tight">{b.headline}</h3>
                <p className="text-xs font-medium text-white/80 mt-2 leading-relaxed">{b.subtext}</p>
              </div>

              <div className="pt-4 border-t border-white/20 flex flex-wrap items-center justify-between gap-3">
                <span className="text-[11px] font-extrabold bg-white/10 px-3 py-1 rounded-xl">
                  {b.badge}
                </span>
                <Link
                  href="/shop"
                  className="bg-white text-slate-900 font-extrabold px-4 py-2.5 rounded-xl text-xs flex items-center gap-1.5 shadow-md hover:bg-slate-100 transition-colors"
                >
                  <span>{b.cta}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Social Media 1:1 Square Posts Section */}
        <div className="pt-10 border-t border-slate-200 space-y-6">
          <div>
            <h2 className="text-2xl font-black text-slate-900">Social Media Graphics (1:1 Posts)</h2>
            <p className="text-xs text-slate-500 font-medium">Ready-to-use square promotional graphics for Instagram & Facebook campaigns.</p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {socialMediaGraphics.map((post, idx) => (
              <div
                key={idx}
                className="bg-white rounded-2xl p-4 border border-slate-200 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between aspect-square"
              >
                <div>
                  <span className="bg-blue-50 text-blue-700 text-[9px] font-black px-2 py-0.5 rounded-md border border-blue-200 uppercase">
                    {post.tag}
                  </span>
                  <h4 className="text-sm font-black text-slate-900 mt-2">{post.title}</h4>
                  <p className="text-xs text-slate-500 font-medium mt-1">{post.text}</p>
                </div>
                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] font-bold text-blue-600">
                  <span>Panelook.lk</span>
                  <span>Order Now &rarr;</span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </main>

      <Footer />
      <FixedMobileBottomNav />
    </div>
  );
}
