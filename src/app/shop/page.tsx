'use client';

import React, { useState, useEffect, Suspense, useCallback } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Header } from '@/components/Header';
import { ProductCard } from '@/components/ProductCard';
import { Footer } from '@/components/Footer';
import { StickyMobileActionBar } from '@/components/StickyMobileActionBar';
import { FixedMobileBottomNav } from '@/components/FixedMobileBottomNav';
import { CategoryBar } from '@/components/CategoryBar';
import { fetchProducts } from '@/lib/api';
import { MASTER_SCREEN_SIZES, normalizeScreenSize } from '@/lib/constants';
import { Product } from '@/types';
import {
  Search,
  Filter,
  X,
  SlidersHorizontal,
  ChevronDown,
  RotateCcw,
  Check,
} from 'lucide-react';

const AVAILABLE_BRANDS = [
  { id: 'hp', name: 'HP' },
  { id: 'dell', name: 'Dell' },
  { id: 'lenovo', name: 'Lenovo' },
  { id: 'asus', name: 'ASUS' },
  { id: 'acer', name: 'Acer' },
  { id: 'msi', name: 'MSI' },
  { id: 'apple', name: 'Apple' },
];

const PIN_TYPES = ['30-pin', '40-pin'];
const PANEL_TYPES = ['IPS', 'OLED', 'TN'];
const PRODUCT_TYPES = [
  { id: 'laptop-display', name: 'Laptop Display' },
  { id: 'macbook-display', name: 'MacBook Display' },
  { id: 'touch-screen', name: 'Touch Screen' },
  { id: 'oled-panel', name: 'OLED Panel' },
  { id: 'display-assembly', name: 'Display Assembly' },
];

function ShopContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);

  // Filters state initialized from URL search params
  const initialSearch = searchParams.get('search') || '';
  const initialBrand = searchParams.get('brand') ? searchParams.get('brand')!.split(',').filter(Boolean) : [];
  const initialSizes = (searchParams.get('screen_size') || searchParams.get('size') || '')
    .split(',')
    .filter(Boolean)
    .map(normalizeScreenSize);
  const initialPin = searchParams.get('pin') ? searchParams.get('pin')!.split(',').filter(Boolean) : [];
  const initialTouch = searchParams.get('touch') || '';
  const initialDisplayType = searchParams.get('display_type') || (searchParams.get('ips') === '1' ? 'IPS' : '');
  const initialProductType = searchParams.get('product_type') || '';
  const initialSort = searchParams.get('sort') || 'popular';

  const [search, setSearch] = useState(initialSearch);
  const [selectedBrands, setSelectedBrands] = useState<string[]>(initialBrand);
  const [selectedSizes, setSelectedSizes] = useState<string[]>(initialSizes);
  const [selectedPins, setSelectedPins] = useState<string[]>(initialPin);
  const [touch, setTouch] = useState<string>(initialTouch);
  const [displayType, setDisplayType] = useState<string>(initialDisplayType);
  const [productType, setProductType] = useState<string>(initialProductType);
  const [sort, setSort] = useState(initialSort);

  // Synchronize URL query parameters without full page reload
  const syncUrl = useCallback(
    (params: Record<string, string | null>) => {
      const current = new URLSearchParams(window.location.search);
      Object.entries(params).forEach(([key, value]) => {
        if (!value) {
          current.delete(key);
        } else {
          current.set(key, value);
        }
      });
      const queryStr = current.toString();
      const newUrl = queryStr ? `/shop?${queryStr}` : '/shop';
      window.history.replaceState(null, '', newUrl);
    },
    []
  );

  const loadProducts = useCallback(async () => {
    setLoading(true);
    const result = await fetchProducts({
      search,
      brand: selectedBrands.join(','),
      screen_size: selectedSizes.join(','),
      pin: selectedPins.join(','),
      touch,
      display_type: displayType,
      product_type: productType,
      sort,
    });
    setProducts(result.data);
    setTotalCount(result.total);
    setLoading(false);
  }, [search, selectedBrands, selectedSizes, selectedPins, touch, displayType, productType, sort]);

  useEffect(() => {
    loadProducts();
    syncUrl({
      search: search || null,
      brand: selectedBrands.length > 0 ? selectedBrands.join(',') : null,
      screen_size: selectedSizes.length > 0 ? selectedSizes.join(',') : null,
      pin: selectedPins.length > 0 ? selectedPins.join(',') : null,
      touch: touch || null,
      display_type: displayType || null,
      product_type: productType || null,
      sort: sort !== 'popular' ? sort : null,
    });
  }, [loadProducts, syncUrl, search, selectedBrands, selectedSizes, selectedPins, touch, displayType, productType, sort]);

  const toggleBrand = (b: string) => {
    setSelectedBrands((prev) =>
      prev.includes(b) ? prev.filter((item) => item !== b) : [...prev, b]
    );
  };

  const toggleSize = (sizeStr: string) => {
    const norm = normalizeScreenSize(sizeStr);
    setSelectedSizes((prev) =>
      prev.includes(norm) ? prev.filter((item) => item !== norm) : [...prev, norm]
    );
  };

  const togglePin = (p: string) => {
    setSelectedPins((prev) =>
      prev.includes(p) ? prev.filter((item) => item !== p) : [...prev, p]
    );
  };

  const clearAllFilters = () => {
    setSearch('');
    setSelectedBrands([]);
    setSelectedSizes([]);
    setSelectedPins([]);
    setTouch('');
    setDisplayType('');
    setProductType('');
    setSort('popular');
  };

  const hasActiveFilters = Boolean(
    search ||
    selectedBrands.length > 0 ||
    selectedSizes.length > 0 ||
    selectedPins.length > 0 ||
    touch ||
    displayType ||
    productType
  );

  const handleCategorySelect = (id: string) => {
    if (id === 'all') {
      clearAllFilters();
    } else if (id === 'touch') {
      setTouch(touch === 'Touch' ? '' : 'Touch');
    } else if (id === 'ips') {
      setDisplayType(displayType === 'IPS' ? '' : 'IPS');
    } else if (id === '30-pin') {
      togglePin('30-pin');
    } else if (id === '40-pin') {
      togglePin('40-pin');
    } else if (id === '14') {
      toggleSize('14.0');
    } else if (id === '15.6') {
      toggleSize('15.6');
    } else if (id === '17.3') {
      toggleSize('17.3');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans pb-28 lg:pb-0 overflow-x-hidden w-full">
      <Header />

      <main className="max-w-[1440px] mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-6 flex-1 w-full space-y-4">
        {/* Search Bar */}
        <div className="relative flex items-center w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none" />
          <input
            type="text"
            placeholder="Search by panel number, laptop model, brand, screen size (e.g. 15.6), pin or connector..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-12 py-2.5 bg-white text-xs sm:text-sm font-medium border border-slate-300 rounded-[3px] shadow-2xs focus:outline-hidden focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition-all"
          />
          <button
            type="button"
            onClick={() => setFilterDrawerOpen(true)}
            className="absolute right-2 p-1.5 text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-[3px] transition-colors cursor-pointer"
            aria-label="Filter Options"
          >
            <SlidersHorizontal className="w-4 h-4" />
          </button>
        </div>

        {/* Responsive Wrapped Filter Chips */}
        <div className="flex flex-wrap items-center gap-1.5 w-full py-1 text-xs">
          {/* Brand Filter Badges */}
          {selectedBrands.map((b) => (
            <span
              key={b}
              className="inline-flex items-center gap-1 bg-blue-50 text-blue-800 border border-blue-200 font-bold px-2.5 py-1 rounded-[3px]"
            >
              <span>{b.toUpperCase()}</span>
              <button onClick={() => toggleBrand(b)} className="hover:text-rose-600 cursor-pointer">
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}

          {/* Size Filter Badges */}
          {selectedSizes.map((s) => (
            <span
              key={s}
              className="inline-flex items-center gap-1 bg-blue-50 text-blue-800 border border-blue-200 font-bold px-2.5 py-1 rounded-[3px]"
            >
              <span>{s}&quot;</span>
              <button onClick={() => toggleSize(s)} className="hover:text-rose-600 cursor-pointer">
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}

          {/* Pin Badges */}
          {selectedPins.map((p) => (
            <span
              key={p}
              className="inline-flex items-center gap-1 bg-blue-50 text-blue-800 border border-blue-200 font-bold px-2.5 py-1 rounded-[3px]"
            >
              <span>{p}</span>
              <button onClick={() => togglePin(p)} className="hover:text-rose-600 cursor-pointer">
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}

          {/* Touch Badge */}
          {touch && (
            <span className="inline-flex items-center gap-1 bg-blue-50 text-blue-800 border border-blue-200 font-bold px-2.5 py-1 rounded-[3px]">
              <span>{touch}</span>
              <button onClick={() => setTouch('')} className="hover:text-rose-600 cursor-pointer">
                <X className="w-3 h-3" />
              </button>
            </span>
          )}

          {/* Panel Type Badge */}
          {displayType && (
            <span className="inline-flex items-center gap-1 bg-blue-50 text-blue-800 border border-blue-200 font-bold px-2.5 py-1 rounded-[3px]">
              <span>{displayType}</span>
              <button onClick={() => setDisplayType('')} className="hover:text-rose-600 cursor-pointer">
                <X className="w-3 h-3" />
              </button>
            </span>
          )}

          {/* Product Type Badge */}
          {productType && (
            <span className="inline-flex items-center gap-1 bg-blue-50 text-blue-800 border border-blue-200 font-bold px-2.5 py-1 rounded-[3px]">
              <span className="capitalize">{productType.replace('-', ' ')}</span>
              <button onClick={() => setProductType('')} className="hover:text-rose-600 cursor-pointer">
                <X className="w-3 h-3" />
              </button>
            </span>
          )}

          {/* Search Term Badge */}
          {search && (
            <span className="inline-flex items-center gap-1 bg-slate-100 text-slate-800 border border-slate-300 font-bold px-2.5 py-1 rounded-[3px]">
              <span>&ldquo;{search}&rdquo;</span>
              <button onClick={() => setSearch('')} className="hover:text-rose-600 cursor-pointer">
                <X className="w-3 h-3" />
              </button>
            </span>
          )}

          {/* Clear All Button */}
          {hasActiveFilters && (
            <button
              onClick={clearAllFilters}
              className="inline-flex items-center gap-1 text-xs font-bold text-rose-600 hover:text-rose-700 hover:underline px-2 py-1 cursor-pointer"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Clear All</span>
            </button>
          )}
        </div>

        {/* Quick Category Bar */}
        <div className="-mx-3 sm:mx-0">
          <CategoryBar onSelectCategory={handleCategorySelect} />
        </div>

        {/* Result Header & Sort Selector: Responsive flex-wrap */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-2 pb-1 w-full">
          <span className="text-xs sm:text-sm font-black text-slate-900">
            {totalCount} Results Found
          </span>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-500 hidden sm:inline">Sort:</span>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="bg-white border border-slate-300 text-xs font-bold text-slate-800 rounded-[3px] px-2.5 py-1.5 shadow-2xs focus:outline-hidden cursor-pointer"
            >
              <option value="popular">Popularity</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="newest">Newest Arrivals</option>
            </select>
          </div>
        </div>

        {/* Layout: Sidebar + Product Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start w-full">
          {/* Desktop Filter Sidebar */}
          <aside className="hidden lg:block lg:col-span-3 space-y-5 bg-white p-4 rounded-[4px] border border-slate-200/90 shadow-2xs sticky top-24 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                <SlidersHorizontal className="w-3.5 h-3.5 text-blue-600" />
                <span>Filters</span>
              </h3>
              {hasActiveFilters && (
                <button onClick={clearAllFilters} className="text-xs font-bold text-rose-600 hover:underline cursor-pointer">
                  Reset
                </button>
              )}
            </div>

            {/* Screen Size Section (15 Master Sizes) */}
            <div>
              <h4 className="text-xs font-black text-slate-700 uppercase tracking-wider mb-2">Screen Size</h4>
              <div className="space-y-1.5 max-h-56 overflow-y-auto pr-1 text-xs font-semibold text-slate-600">
                {MASTER_SCREEN_SIZES.map((sizeLabel) => {
                  const norm = normalizeScreenSize(sizeLabel);
                  const isChecked = selectedSizes.includes(norm);
                  return (
                    <label key={sizeLabel} className="flex items-center justify-between gap-2 cursor-pointer hover:text-blue-600 py-0.5">
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => toggleSize(sizeLabel)}
                          className="accent-blue-600 w-3.5 h-3.5 rounded-[2px] cursor-pointer"
                        />
                        <span>{sizeLabel}</span>
                      </div>
                    </label>
                  );
                })}
              </div>
            </div>

            {/* Brand Section */}
            <div className="border-t border-slate-100 pt-4">
              <h4 className="text-xs font-black text-slate-700 uppercase tracking-wider mb-2">Brand</h4>
              <div className="space-y-1.5 text-xs font-semibold text-slate-600">
                {AVAILABLE_BRANDS.map((b) => (
                  <label key={b.id} className="flex items-center gap-2 cursor-pointer hover:text-blue-600 py-0.5">
                    <input
                      type="checkbox"
                      checked={selectedBrands.includes(b.id)}
                      onChange={() => toggleBrand(b.id)}
                      className="accent-blue-600 w-3.5 h-3.5 rounded-[2px] cursor-pointer"
                    />
                    <span>{b.name}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Product Types */}
            <div className="border-t border-slate-100 pt-4">
              <h4 className="text-xs font-black text-slate-700 uppercase tracking-wider mb-2">Product Type</h4>
              <div className="space-y-1.5 text-xs font-semibold text-slate-600">
                {PRODUCT_TYPES.map((pt) => (
                  <label key={pt.id} className="flex items-center gap-2 cursor-pointer hover:text-blue-600 py-0.5">
                    <input
                      type="radio"
                      name="product_type"
                      checked={productType === pt.id}
                      onChange={() => setProductType(productType === pt.id ? '' : pt.id)}
                      className="accent-blue-600 w-3.5 h-3.5 cursor-pointer"
                    />
                    <span>{pt.name}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Pin Count */}
            <div className="border-t border-slate-100 pt-4">
              <h4 className="text-xs font-black text-slate-700 uppercase tracking-wider mb-2">Connector Pins</h4>
              <div className="space-y-1.5 text-xs font-semibold text-slate-600">
                {PIN_TYPES.map((p) => (
                  <label key={p} className="flex items-center gap-2 cursor-pointer hover:text-blue-600 py-0.5">
                    <input
                      type="checkbox"
                      checked={selectedPins.includes(p)}
                      onChange={() => togglePin(p)}
                      className="accent-blue-600 w-3.5 h-3.5 rounded-[2px] cursor-pointer"
                    />
                    <span>{p}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Panel & Touch Features */}
            <div className="border-t border-slate-100 pt-4 space-y-2">
              <h4 className="text-xs font-black text-slate-700 uppercase tracking-wider mb-2">Features</h4>
              <label className="flex items-center gap-2 text-xs font-semibold text-slate-600 cursor-pointer">
                <input
                  type="checkbox"
                  checked={touch === 'Touch'}
                  onChange={(e) => setTouch(e.target.checked ? 'Touch' : '')}
                  className="accent-blue-600 w-3.5 h-3.5 rounded-[2px] cursor-pointer"
                />
                <span>Touch Screen</span>
              </label>
              <label className="flex items-center gap-2 text-xs font-semibold text-slate-600 cursor-pointer">
                <input
                  type="checkbox"
                  checked={displayType === 'IPS'}
                  onChange={(e) => setDisplayType(e.target.checked ? 'IPS' : '')}
                  className="accent-blue-600 w-3.5 h-3.5 rounded-[2px] cursor-pointer"
                />
                <span>IPS Wide Angle</span>
              </label>
            </div>
          </aside>

          {/* Product Grid Area */}
          <section className="lg:col-span-9 w-full">
            {loading ? (
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-2.5 sm:gap-3">
                {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
                  <div key={n} className="bg-white rounded-[3px] p-4 h-72 animate-pulse border border-slate-200" />
                ))}
              </div>
            ) : products.length === 0 ? (
              <div className="bg-white rounded-[4px] p-8 sm:p-12 text-center border border-slate-200/90 shadow-2xs">
                <Filter className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <h3 className="text-base sm:text-lg font-black text-slate-800">No Display Panels Found</h3>
                <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                  We could not find matching displays for your selected criteria. Try resetting filters or searching with another term.
                </p>
                <button
                  onClick={clearAllFilters}
                  className="mt-4 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-4 py-2.5 rounded-[3px] cursor-pointer shadow-xs inline-flex items-center gap-1.5"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset All Filters</span>
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-2.5 sm:gap-3">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </section>
        </div>
      </main>

      {/* Mobile Filter Drawer / Bottom Sheet */}
      {filterDrawerOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex justify-end">
          <div
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity"
            onClick={() => setFilterDrawerOpen(false)}
          />
          <div className="relative w-full max-w-sm bg-white h-full shadow-2xl p-4 sm:p-5 overflow-y-auto flex flex-col justify-between z-10 animate-in slide-in-from-right duration-200">
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
                  <SlidersHorizontal className="w-4 h-4 text-blue-600" />
                  <span>Filter Displays</span>
                </h3>
                <button
                  onClick={() => setFilterDrawerOpen(false)}
                  className="p-1 rounded-[3px] text-slate-400 hover:text-slate-700"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Master Screen Sizes in Mobile Drawer */}
              <div>
                <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider mb-2">Screen Size</h4>
                <div className="grid grid-cols-3 gap-1.5 text-xs font-bold">
                  {MASTER_SCREEN_SIZES.map((sizeLabel) => {
                    const norm = normalizeScreenSize(sizeLabel);
                    const isSelected = selectedSizes.includes(norm);
                    return (
                      <button
                        key={sizeLabel}
                        onClick={() => toggleSize(sizeLabel)}
                        className={`py-2 px-1 rounded-[3px] border text-center text-[11px] font-bold transition-colors cursor-pointer ${
                          isSelected
                            ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                            : 'bg-slate-50 border-slate-200 text-slate-700'
                        }`}
                      >
                        {sizeLabel}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Brand in Mobile Drawer */}
              <div className="border-t border-slate-100 pt-3">
                <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider mb-2">Brand</h4>
                <div className="grid grid-cols-2 gap-1.5 text-xs font-bold">
                  {AVAILABLE_BRANDS.map((b) => {
                    const isSelected = selectedBrands.includes(b.id);
                    return (
                      <button
                        key={b.id}
                        onClick={() => toggleBrand(b.id)}
                        className={`py-2 px-2 rounded-[3px] border text-center uppercase text-xs transition-colors cursor-pointer ${
                          isSelected
                            ? 'bg-blue-600 text-white border-blue-600'
                            : 'bg-slate-50 border-slate-200 text-slate-700'
                        }`}
                      >
                        {b.name}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Connector Pin */}
              <div className="border-t border-slate-100 pt-3">
                <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider mb-2">Connector</h4>
                <div className="grid grid-cols-2 gap-1.5 text-xs font-bold">
                  {PIN_TYPES.map((p) => {
                    const isSelected = selectedPins.includes(p);
                    return (
                      <button
                        key={p}
                        onClick={() => togglePin(p)}
                        className={`py-2 px-2 rounded-[3px] border text-center text-xs transition-colors cursor-pointer ${
                          isSelected
                            ? 'bg-blue-600 text-white border-blue-600'
                            : 'bg-slate-50 border-slate-200 text-slate-700'
                        }`}
                      >
                        {p}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Features */}
              <div className="border-t border-slate-100 pt-3 space-y-2">
                <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider mb-2">Features</h4>
                <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={touch === 'Touch'}
                    onChange={(e) => setTouch(e.target.checked ? 'Touch' : '')}
                    className="accent-blue-600 w-4 h-4 rounded-[2px]"
                  />
                  <span>Touch Screen</span>
                </label>
                <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={displayType === 'IPS'}
                    onChange={(e) => setDisplayType(e.target.checked ? 'IPS' : '')}
                    className="accent-blue-600 w-4 h-4 rounded-[2px]"
                  />
                  <span>IPS Wide Angle</span>
                </label>
              </div>
            </div>

            {/* Drawer Bottom Actions */}
            <div className="pt-4 border-t border-slate-100 flex items-center gap-2 mt-4">
              <button
                onClick={clearAllFilters}
                className="flex-1 py-2.5 border border-slate-200 rounded-[3px] text-xs font-bold text-slate-700 flex items-center justify-center gap-1 cursor-pointer hover:bg-slate-50"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset</span>
              </button>
              <button
                onClick={() => setFilterDrawerOpen(false)}
                className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-[3px] text-xs font-bold shadow-xs cursor-pointer"
              >
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
      <StickyMobileActionBar onToggleFilter={() => setFilterDrawerOpen(!filterDrawerOpen)} />
      <FixedMobileBottomNav />
    </div>
  );
}

export default function ShopPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-slate-500 font-bold">Loading Panelook Shop...</div>}>
      <ShopContent />
    </Suspense>
  );
}
