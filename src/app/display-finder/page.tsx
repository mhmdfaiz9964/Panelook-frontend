'use client';

import React, { useState } from 'react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { ProductCard } from '@/components/ProductCard';
import { fetchProducts } from '@/lib/api';
import { Product } from '@/types';
import { Monitor, Check, ArrowRight, RotateCcw } from 'lucide-react';

export default function DisplayFinderPage() {
  const [step, setStep] = useState(1);
  const [brand, setBrand] = useState('');
  const [model, setModel] = useState('');
  const [size, setSize] = useState('');
  const [pin, setPin] = useState('');
  const [touch, setTouch] = useState('');
  const [ips, setIps] = useState(false);

  const [results, setResults] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const handleFinish = async () => {
    setLoading(true);
    const { data } = await fetchProducts({
      brand,
      size,
      pin,
      touch,
      ips,
      search: model,
    });
    setResults(data);
    setLoading(false);
    setSearched(true);
  };

  const handleReset = () => {
    setStep(1);
    setBrand('');
    setModel('');
    setSize('');
    setPin('');
    setTouch('');
    setIps(false);
    setResults([]);
    setSearched(false);
  };

  const brandsList = ['HP', 'Dell', 'Lenovo', 'ASUS', 'Acer', 'MSI'];
  const sizesList = ['14"', '15.6"', '17.3"'];
  const pinsList = ['30-pin', '40-pin'];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <Header />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex-1 w-full">
        
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center mx-auto mb-3 shadow-lg shadow-blue-500/20">
            <Monitor className="w-6 h-6" />
          </div>
          <h1 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Display Finder Wizard
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1">
            Answer a few quick questions to find 100% compatible screen replacements for your laptop.
          </p>
        </div>

        {/* Wizard Container */}
        {!searched ? (
          <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-sm space-y-8">
            
            {/* Step Progress Bar */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <span className="text-xs font-black text-blue-600 uppercase tracking-wider">
                Step {step} of 5
              </span>
              <button
                onClick={handleReset}
                className="text-xs font-bold text-slate-400 hover:text-rose-600 flex items-center gap-1"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Start Over</span>
              </button>
            </div>

            {/* Step 1: Brand */}
            {step === 1 && (
              <div className="space-y-4">
                <h3 className="text-lg font-black text-slate-900">Step 1: Select Laptop Brand</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {brandsList.map((b) => (
                    <button
                      key={b}
                      onClick={() => {
                        setBrand(b.toLowerCase());
                        setStep(2);
                      }}
                      className={`p-4 rounded-2xl border font-black text-sm text-center transition-all ${
                        brand.toLowerCase() === b.toLowerCase()
                          ? 'border-blue-600 bg-blue-50 text-blue-700 shadow-xs'
                          : 'border-slate-200 hover:border-slate-300 text-slate-800'
                      }`}
                    >
                      {b}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Step 2: Screen Size */}
            {step === 2 && (
              <div className="space-y-4">
                <h3 className="text-lg font-black text-slate-900">Step 2: Select Display Size</h3>
                <div className="grid grid-cols-3 gap-3">
                  {sizesList.map((s) => (
                    <button
                      key={s}
                      onClick={() => {
                        setSize(s);
                        setStep(3);
                      }}
                      className={`p-4 rounded-2xl border font-black text-sm text-center transition-all ${
                        size === s
                          ? 'border-blue-600 bg-blue-50 text-blue-700 shadow-xs'
                          : 'border-slate-200 hover:border-slate-300 text-slate-800'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Step 3: Pin Type */}
            {step === 3 && (
              <div className="space-y-4">
                <h3 className="text-lg font-black text-slate-900">Step 3: Select Pin Type</h3>
                <div className="grid grid-cols-2 gap-3">
                  {pinsList.map((p) => (
                    <button
                      key={p}
                      onClick={() => {
                        setPin(p);
                        setStep(4);
                      }}
                      className={`p-4 rounded-2xl border font-black text-sm text-center transition-all ${
                        pin === p
                          ? 'border-blue-600 bg-blue-50 text-blue-700 shadow-xs'
                          : 'border-slate-200 hover:border-slate-300 text-slate-800'
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Step 4: Touch Type */}
            {step === 4 && (
              <div className="space-y-4">
                <h3 className="text-lg font-black text-slate-900">Step 4: Touch Screen Compatibility</h3>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => {
                      setTouch('Touch');
                      setStep(5);
                    }}
                    className="p-4 rounded-2xl border border-slate-200 hover:border-blue-600 font-black text-sm text-slate-800"
                  >
                    Touch Screen
                  </button>
                  <button
                    onClick={() => {
                      setTouch('Non-Touch');
                      setStep(5);
                    }}
                    className="p-4 rounded-2xl border border-slate-200 hover:border-blue-600 font-black text-sm text-slate-800"
                  >
                    Non-Touch (Standard)
                  </button>
                </div>
              </div>
            )}

            {/* Step 5: IPS & Finish */}
            {step === 5 && (
              <div className="space-y-6">
                <h3 className="text-lg font-black text-slate-900">Step 5: Panel Type Preference</h3>
                <label className="flex items-center gap-3 p-4 rounded-2xl border border-slate-200 bg-slate-50 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={ips}
                    onChange={(e) => setIps(e.target.checked)}
                    className="w-5 h-5 accent-blue-600"
                  />
                  <div>
                    <span className="font-bold text-sm text-slate-900 block">IPS Panel (Recommended)</span>
                    <span className="text-xs text-slate-500">Wide viewing angles and accurate color representation.</span>
                  </div>
                </label>

                <button
                  onClick={handleFinish}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-2xl shadow-lg shadow-blue-500/20 text-sm flex items-center justify-center gap-2"
                >
                  <span>Find Compatible Displays</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}

          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-black text-slate-900">
                Compatible Displays ({results.length} found)
              </h2>
              <button
                onClick={handleReset}
                className="bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-bold px-4 py-2 rounded-xl"
              >
                Search Again
              </button>
            </div>

            {results.length === 0 ? (
              <div className="bg-white p-8 rounded-2xl text-center border border-slate-200">
                <p className="text-sm font-bold text-slate-700">No matching displays found for your selected criteria.</p>
                <p className="text-xs text-slate-500 mt-1">Please ask our team directly on WhatsApp for custom display panel sourcing!</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {results.map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
            )}
          </div>
        )}

      </main>

      <Footer />
    </div>
  );
}
