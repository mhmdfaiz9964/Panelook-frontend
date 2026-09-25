'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { CheckCircle2, ShieldCheck, Truck, Lock, ArrowRight, ChevronDown } from 'lucide-react';

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-blue-50/60 via-white to-slate-50 pt-8 pb-12 lg:pt-12 lg:pb-20">
      
      {/* Background Decorative Spheres */}
      <div className="absolute top-10 right-10 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-80 h-80 bg-indigo-400/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left Text Column */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            
            {/* Tag Badge */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-100/80 text-blue-700 font-bold text-xs shadow-2xs border border-blue-200"
            >
              <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
              <span>Sri Lanka&apos;s Trusted Laptop Display Store</span>
            </motion.div>

            {/* Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-[1.1]"
            >
              Perfect Match.<br />
              Perfect{' '}
              <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Vision.
              </span>
            </motion.h1>

            {/* Subtext */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-slate-600 text-base sm:text-lg max-w-xl mx-auto lg:mx-0 font-medium"
            >
              Find the right laptop display for your device.<br className="hidden sm:inline" />
              Search by panel number, model, brand, size or pin type.<br className="hidden sm:inline" />
              100% Genuine Displays with Warranty.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2"
            >
              <Link
                href="/shop"
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-7 py-3.5 rounded-2xl shadow-lg shadow-blue-500/25 flex items-center gap-2 hover:scale-103 transition-all text-sm"
              >
                <span>Shop Laptop Displays</span>
                <ChevronDown className="w-4 h-4" />
              </Link>
              <Link
                href="#find-display"
                className="bg-white hover:bg-slate-50 text-slate-800 font-bold px-7 py-3.5 rounded-2xl border border-slate-300/80 shadow-xs flex items-center gap-2 hover:border-slate-400 transition-all text-sm"
              >
                Find Your Display
              </Link>
            </motion.div>

            {/* Feature Trust Pills Grid */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-6 border-t border-slate-200/60"
            >
              <div className="flex items-center gap-2 text-left">
                <div className="w-9 h-9 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-4.5 h-4.5 text-blue-600" />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900">100% Genuine</div>
                  <div className="text-[10px] text-slate-500">Original Displays</div>
                </div>
              </div>
              <div className="flex items-center gap-2 text-left">
                <div className="w-9 h-9 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-4.5 h-4.5 text-blue-600" />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900">Warranty</div>
                  <div className="text-[10px] text-slate-500">3–12 Months</div>
                </div>
              </div>
              <div className="flex items-center gap-2 text-left">
                <div className="w-9 h-9 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center shrink-0">
                  <Truck className="w-4.5 h-4.5 text-blue-600" />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900">Islandwide Delivery</div>
                  <div className="text-[10px] text-slate-500">Fast &amp; Safe</div>
                </div>
              </div>
              <div className="flex items-center gap-2 text-left">
                <div className="w-9 h-9 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center shrink-0">
                  <Lock className="w-4.5 h-4.5 text-blue-600" />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900">Secure Payment</div>
                  <div className="text-[10px] text-slate-500">100% Protected</div>
                </div>
              </div>
            </motion.div>

          </div>

          {/* Right Visual 3D Laptop Display Presentation */}
          <div className="lg:col-span-5 relative flex justify-center">
            
            {/* In Stock Badge floating top right */}
            <div className="absolute top-2 right-4 z-20 bg-emerald-50 text-emerald-700 border border-emerald-300 text-xs font-extrabold px-3 py-1 rounded-full shadow-xs flex items-center gap-1.5 animate-bounce">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span>In Stock</span>
            </div>

            {/* Laptop 3D pedestal container */}
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.7 }}
              className="relative w-full max-w-md aspect-4/3 flex items-center justify-center"
            >
              {/* 3D Glowing ring background */}
              <div className="absolute w-72 h-72 sm:w-80 sm:h-80 rounded-full border-4 border-blue-400/30 bg-gradient-to-tr from-blue-500/10 to-purple-500/10 shadow-2xl animate-pulse" />

              {/* Floating Glass Cube Decorations */}
              <div className="hidden sm:block absolute -top-4 -left-8 w-10 h-10 rounded-lg bg-gradient-to-br from-blue-300/50 to-purple-300/40 border border-white/60 shadow-lg backdrop-blur-sm rotate-12 animate-bounce" style={{ animationDuration: '3.5s' }} />
              <div className="hidden sm:block absolute top-1/3 -right-10 w-8 h-8 rounded-lg bg-gradient-to-br from-purple-300/50 to-blue-300/40 border border-white/60 shadow-lg backdrop-blur-sm -rotate-12 animate-bounce" style={{ animationDuration: '4s', animationDelay: '0.5s' }} />
              <div className="hidden sm:block absolute -bottom-6 left-1/4 w-6 h-6 rounded-md bg-gradient-to-br from-indigo-300/50 to-blue-300/40 border border-white/60 shadow-lg backdrop-blur-sm rotate-45 animate-bounce" style={{ animationDuration: '3s', animationDelay: '1s' }} />

              {/* Laptop Display Mockup Image */}
              <img
                src="/images/promo-center.jpeg"
                alt="Panelook Laptop Display Screen Sri Lanka"
                className="w-4/5 object-contain relative z-10 drop-shadow-2xl hover:scale-105 transition-transform duration-500 rounded-2xl border border-white/50 shadow-2xl"
              />

              {/* Floating Spec Badges matching Reference Mockup */}
              <div className="absolute top-10 -left-2 z-20 bg-white/90 backdrop-blur-md px-3.5 py-1.5 rounded-xl border border-slate-200 shadow-lg text-xs font-bold text-slate-800 hidden sm:block">
                💻 14&quot; IPS Display
              </div>
              <div className="absolute bottom-16 -left-4 z-20 bg-white/90 backdrop-blur-md px-3.5 py-1.5 rounded-xl border border-slate-200 shadow-lg text-xs font-bold text-slate-800 hidden sm:block">
                ⚡ 40-Pin Connector
              </div>
              <div className="absolute top-24 -right-4 z-20 bg-white/90 backdrop-blur-md px-3.5 py-1.5 rounded-xl border border-slate-200 shadow-lg text-xs font-bold text-slate-800 hidden sm:block">
                ✨ Touch Compatible
              </div>
              <div className="absolute bottom-6 right-2 z-20 bg-blue-600 text-white px-4 py-1.5 rounded-xl shadow-xl text-xs font-extrabold hidden sm:block">
                LKR 24,900
              </div>
            </motion.div>

          </div>

        </div>
      </div>
    </section>
  );
}
