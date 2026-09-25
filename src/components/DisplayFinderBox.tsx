'use client';

import React, { useState } from 'react';
import { Search, RotateCcw, SlidersHorizontal } from 'lucide-react';

interface DisplayFinderBoxProps {
  onSearch?: (filters: any) => void;
}

export function DisplayFinderBox({ onSearch }: DisplayFinderBoxProps) {
  const [panelNumber, setPanelNumber] = useState('');
  const [laptopModel, setLaptopModel] = useState('');
  const [brand, setBrand] = useState('');
  const [size, setSize] = useState('');
  const [pin, setPin] = useState('');
  const [touch, setTouch] = useState(false);
  const [ips, setIps] = useState(false);
  const [maxPrice, setMaxPrice] = useState(100000);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const filters = {
      search: panelNumber || laptopModel,
      brand,
      size,
      pin,
      touch: touch ? 'Touch' : '',
      ips,
      maxPrice: maxPrice < 100000 ? maxPrice : undefined,
    };

    if (onSearch) {
      onSearch(filters);
    } else {
      const params = new URLSearchParams();
      if (panelNumber) params.append('search', panelNumber);
      if (laptopModel && !panelNumber) params.append('search', laptopModel);
      if (brand) params.append('brand', brand);
      if (size) params.append('size', size);
      if (pin) params.append('pin', pin);
      if (touch) params.append('touch', 'Touch');
      if (ips) params.append('ips', '1');
      if (maxPrice < 100000) params.append('max_price', maxPrice.toString());

      window.location.href = `/shop?${params.toString()}`;
    }
  };

  const handleReset = () => {
    setPanelNumber('');
    setLaptopModel('');
    setBrand('');
    setSize('');
    setPin('');
    setTouch(false);
    setIps(false);
    setMaxPrice(100000);
  };

  const inputClass =
    'w-full h-9 px-3 bg-white border border-slate-300 rounded-[3px] text-xs font-medium text-slate-800 placeholder:text-slate-400 focus:outline-hidden focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition shadow-2xs';
  const selectClass =
    'w-full h-9 px-2.5 bg-white border border-slate-300 rounded-[3px] text-xs font-medium text-slate-700 focus:outline-hidden focus:border-blue-600 transition cursor-pointer shadow-2xs';
  const labelClass = 'block text-[11px] font-bold text-slate-700 mb-1 tracking-tight';

  return (
    <section id="find-display" className="py-6 sm:py-8 bg-slate-50 border-b border-slate-200/80">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-[4px] p-5 sm:p-6 shadow-xs border border-slate-200">
          {/* Header */}
          <div className="mb-4">
            <h2 className="text-sm sm:text-base font-black tracking-wider text-slate-900 uppercase flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4 text-blue-600" />
              <span>Find Your Perfect Display</span>
            </h2>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              Search by panel number, laptop model, brand, size or pin type.
            </p>
          </div>

          <form onSubmit={handleSearchSubmit} className="space-y-4">
            {/* Row 1: 5 Inputs/Dropdowns + Search Button (2-Row Grid on Desktop) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3 items-end">
              <div>
                <label className={labelClass}>Panel Number</label>
                <input
                  type="text"
                  placeholder="e.g. B156XW04 V.8"
                  value={panelNumber}
                  onChange={(e) => setPanelNumber(e.target.value)}
                  className={inputClass}
                />
              </div>

              <div>
                <label className={labelClass}>Laptop Model</label>
                <input
                  type="text"
                  placeholder="e.g. HP Pavilion 15"
                  value={laptopModel}
                  onChange={(e) => setLaptopModel(e.target.value)}
                  className={inputClass}
                />
              </div>

              <div>
                <label className={labelClass}>Brand</label>
                <select value={brand} onChange={(e) => setBrand(e.target.value)} className={selectClass}>
                  <option value="">Select brand</option>
                  <option value="HP">HP</option>
                  <option value="Dell">Dell</option>
                  <option value="Lenovo">Lenovo</option>
                  <option value="ASUS">ASUS</option>
                  <option value="Acer">Acer</option>
                  <option value="MSI">MSI</option>
                  <option value="Samsung">Samsung</option>
                  <option value="LG">LG</option>
                  <option value="BOE">BOE</option>
                  <option value="AUO">AUO</option>
                </select>
              </div>

              <div>
                <label className={labelClass}>Size</label>
                <select value={size} onChange={(e) => setSize(e.target.value)} className={selectClass}>
                  <option value="">Select size</option>
                  <option value="10.1">10.1 Inch</option>
                  <option value="11.6">11.6 Inch</option>
                  <option value="12.5">12.5 Inch</option>
                  <option value="13.3">13.3 Inch</option>
                  <option value="14">14.0 Inch</option>
                  <option value="15.6">15.6 Inch</option>
                  <option value="16">16.0 Inch</option>
                  <option value="17.3">17.3 Inch</option>
                  <option value="18">18.0 Inch</option>
                </select>
              </div>

              <div>
                <label className={labelClass}>Pin Type</label>
                <select value={pin} onChange={(e) => setPin(e.target.value)} className={selectClass}>
                  <option value="">Select pin type</option>
                  <option value="30-pin">30-Pin EDP</option>
                  <option value="40-pin">40-Pin LVDS/EDP</option>
                </select>
              </div>

              <div>
                <button
                  type="submit"
                  className="w-full h-9 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-[3px] flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-xs"
                >
                  <span>Search Displays →</span>
                  <Search className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Row 2: Touch Screen, IPS Panel, Price Range, Reset Filters */}
            <div className="pt-3 border-t border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
              {/* Checkboxes */}
              <div className="flex flex-wrap items-center gap-4">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Features:</span>
                <label className="flex items-center gap-1.5 cursor-pointer font-semibold text-slate-700 select-none">
                  <input
                    type="checkbox"
                    checked={touch}
                    onChange={(e) => setTouch(e.target.checked)}
                    className="rounded-[2px] border-slate-300 text-blue-600 focus:ring-blue-500 w-3.5 h-3.5 cursor-pointer"
                  />
                  <span>Touch Screen</span>
                </label>

                <label className="flex items-center gap-1.5 cursor-pointer font-semibold text-slate-700 select-none">
                  <input
                    type="checkbox"
                    checked={ips}
                    onChange={(e) => setIps(e.target.checked)}
                    className="rounded-[2px] border-slate-300 text-blue-600 focus:ring-blue-500 w-3.5 h-3.5 cursor-pointer"
                  />
                  <span>IPS Panel</span>
                </label>
              </div>

              {/* Price Range */}
              <div className="flex items-center gap-3 w-full md:w-auto md:min-w-[280px]">
                <span className="text-[11px] font-bold text-slate-500 whitespace-nowrap">Price Range (LKR):</span>
                <div className="flex-1 flex flex-col">
                  <input
                    type="range"
                    min="0"
                    max="100000"
                    step="5000"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(Number(e.target.value))}
                    className="w-full accent-blue-600 cursor-pointer h-1.5 bg-slate-200 rounded-lg appearance-none"
                  />
                  <div className="flex justify-between text-[10px] text-slate-400 font-semibold pt-0.5">
                    <span>Min: 0</span>
                    <span className="font-bold text-blue-600">
                      {maxPrice >= 100000 ? 'Max: 100,000+' : `Max: ${maxPrice.toLocaleString()}`}
                    </span>
                  </div>
                </div>
              </div>

              {/* Reset Filters */}
              <button
                type="button"
                onClick={handleReset}
                className="flex items-center gap-1 text-[11px] font-bold text-slate-500 hover:text-rose-600 transition-colors cursor-pointer shrink-0 self-end md:self-center"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset Filters</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
