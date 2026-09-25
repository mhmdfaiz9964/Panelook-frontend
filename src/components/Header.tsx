'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import {
  ShoppingBag,
  Search,
  Menu,
  X,
  MessageCircle,
  ChevronDown,
  LifeBuoy,
  PackageSearch,
  UserCircle2,
  Clock,
  TrendingUp,
  Monitor,
  Tag,
  Phone,
  ShieldCheck,
  Truck,
  RotateCcw,
} from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useCustomerAuth } from '@/context/CustomerAuthContext';
import { MobileDrawer } from './MobileDrawer';

const POPULAR_SEARCHES = [
  'B156XW04 V.8',
  'N156HCE-GN1',
  '15.6 FHD IPS',
  'HP Pavilion 15',
  '30-pin IPS',
  'Touch display',
  'Dell Inspiron 15',
  '40-pin 144Hz',
];

const RECENT_SEARCHES = [
  'B156XW04',
  'Lenovo 15.6 IPS',
  '14.0 LED 30 pin',
];

const SUGGESTED_BRANDS = [
  { name: 'HP', count: '140+ Displays', href: '/shop?brand=HP' },
  { name: 'Dell', count: '120+ Displays', href: '/shop?brand=Dell' },
  { name: 'Lenovo', count: '95+ Displays', href: '/shop?brand=Lenovo' },
  { name: 'ASUS', count: '80+ Displays', href: '/shop?brand=ASUS' },
  { name: 'Acer', count: '65+ Displays', href: '/shop?brand=Acer' },
];

const ALL_CATEGORIES_MENU = [
  { name: 'Laptop Displays (10.1" - 18.0")', href: '/shop' },
  { name: 'Touch Screen Assemblies', href: '/shop?touch=Touch' },
  { name: 'IPS & High Color Panels', href: '/shop?ips=1' },
  { name: '30-Pin Connector Displays', href: '/shop?pin=30-pin' },
  { name: '40-Pin Gaming & FHD Displays', href: '/shop?pin=40-pin' },
  { name: '14.0" Laptop Screens', href: '/shop?size=14' },
  { name: '15.6" Standard & Slim Screens', href: '/shop?size=15.6' },
  { name: '16.0" & 16.1" Modern Panels', href: '/shop?size=16' },
  { name: '17.3" Workstation Displays', href: '/shop?size=17.3' },
  { name: 'Display EDP Cables & Converters', href: '/shop?category=cables' },
  { name: 'Screen Replacement Tools & Adhesives', href: '/shop?category=tools' },
];

export function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const { totalItems, generateWhatsAppLink } = useCart();
  const { user, isAuthenticated, logout } = useCustomerAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [categoriesOpen, setCategoriesOpen] = useState(false);

  const searchBoxRef = useRef<HTMLDivElement>(null);

  // Close search suggestions on click outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (searchBoxRef.current && !searchBoxRef.current.contains(e.target as Node)) {
        setIsSearchFocused(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (searchQuery.trim()) {
      setIsSearchFocused(false);
      router.push(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const navLinks = [
    { name: 'Laptop Displays', href: '/shop' },
    { name: 'Touch Screen', href: '/shop?touch=Touch' },
    { name: 'Brands', href: '/#brands' },
    { name: 'Sizes', href: '/#sizes' },
    { name: 'Pin Types', href: '/shop?pin=30-pin' },
    { name: 'Features', href: '/#features' },
    { name: 'Accessories', href: '/shop?category=accessories' },
    { name: 'Bulk Orders', href: '/#bulk-orders' },
    { name: 'About Us', href: '/about' },
    { name: 'Contact Us', href: '/contact' },
  ];

  return (
    <>
      <header className="sticky top-0 z-40 bg-white shadow-xs">
        {/* ====================================================== */}
        {/* 1. TOP UTILITY BAR (Height: 32-36px, Dark Navy #0B1B4B) */}
        {/* ====================================================== */}
        <div className="bg-[#0B1B4B] text-white text-[12px] h-[34px] flex items-center border-b border-navy-900/50">
          <div className="max-w-[1440px] w-full mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
            {/* Left: Tagline */}
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="font-medium tracking-wide">
                Sri Lanka&apos;s Trusted Laptop Display Partner
              </span>
            </div>

            {/* Right: Utility Links (Desktop Only) */}
            <div className="hidden lg:flex items-center gap-5 text-slate-300 font-medium">
              <div className="flex items-center gap-1 hover:text-white transition-colors">
                <Truck className="w-3.5 h-3.5 text-blue-400" />
                <span>Islandwide Delivery</span>
              </div>
              <span className="text-slate-600">•</span>
              <div className="flex items-center gap-1 hover:text-white transition-colors">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>Secure Payments</span>
              </div>
              <span className="text-slate-600">•</span>
              <div className="flex items-center gap-1 hover:text-white transition-colors">
                <RotateCcw className="w-3.5 h-3.5 text-amber-400" />
                <span>Easy Returns</span>
              </div>
              <span className="text-slate-600">•</span>
              <Link href="/contact" className="flex items-center gap-1 hover:text-white transition-colors">
                <LifeBuoy className="w-3.5 h-3.5 text-sky-400" />
                <span>Customer Support</span>
              </Link>
              <span className="text-slate-600">•</span>
              <a
                href="https://wa.me/94766025870?text=Hello%20Panelook.lk%2C%20I%20need%20assistance%20finding%20a%20laptop%20display"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-emerald-400 hover:text-emerald-300 font-bold transition-colors"
              >
                <Phone className="w-3 h-3" />
                <span>WhatsApp: 076 602 5870</span>
              </a>
            </div>
          </div>
        </div>

        {/* ====================================================== */}
        {/* 2. MAIN HEADER (Height: 70-82px, White Background) */}
        {/* ====================================================== */}
        <div className="bg-white border-b border-slate-200/80">
          <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-[74px] sm:h-[80px] gap-3 sm:gap-6">

              {/* Left: Mobile Menu Trigger & REAL LOGO */}
              <div className="flex items-center gap-2 sm:gap-4 shrink-0">
                <button
                  type="button"
                  onClick={() => setMobileMenuOpen(true)}
                  className="lg:hidden p-1.5 text-slate-700 hover:text-blue-600 rounded-[3px] focus:outline-hidden"
                  aria-label="Open Mobile Menu"
                >
                  <Menu className="w-6 h-6" />
                </button>

                <Link href="/" className="flex items-center group">
                  {/* Real Logo with natural aspect ratio constraint */}
                  <div className="relative w-[135px] sm:w-[165px] lg:w-[210px] h-[46px] sm:h-[52px] flex items-center">
                    <Image
                      src="/images/logo.jpeg"
                      alt="Panelook.lk - Sri Lanka's Trusted Laptop Display Partner"
                      fill
                      priority
                      className="object-contain object-left group-hover:opacity-95 transition-opacity"
                      sizes="(max-width: 640px) 140px, (max-width: 1024px) 165px, 210px"
                    />
                  </div>
                </Link>
              </div>

              {/* Center: LARGE SEARCH BOX WITH SUGGESTIONS */}
              <div ref={searchBoxRef} className="hidden md:flex flex-1 max-w-2xl relative">
                <form onSubmit={handleSearchSubmit} className="relative w-full flex items-center">
                  <div className="relative w-full flex items-center">
                    <input
                      type="text"
                      placeholder="Search by panel number, model, brand, size or pin type..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onFocus={() => setIsSearchFocused(true)}
                      className="w-full pl-4 pr-24 py-2.5 bg-white text-xs sm:text-sm text-slate-900 border-2 border-slate-300 rounded-[3px] focus:outline-hidden focus:border-blue-600 transition-colors shadow-2xs placeholder:text-slate-400"
                    />
                    <button
                      type="submit"
                      className="absolute right-1 px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-[2px] flex items-center gap-1.5 text-xs font-bold transition-colors cursor-pointer shadow-xs"
                      aria-label="Search"
                    >
                      <Search className="w-3.5 h-3.5" />
                      <span>Search</span>
                    </button>
                  </div>
                </form>

                {/* SEARCH SUGGESTIONS DROPDOWN */}
                {isSearchFocused && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-slate-200 rounded-[3px] shadow-xl z-50 overflow-hidden text-xs">
                    <div className="p-3 bg-slate-50 border-b border-slate-100 flex items-center justify-between text-slate-500 font-semibold">
                      <span className="flex items-center gap-1.5 text-[11px] uppercase tracking-wider text-slate-600">
                        <TrendingUp className="w-3.5 h-3.5 text-blue-600" />
                        Quick Product Discovery
                      </span>
                      <span className="text-[10px] text-slate-400">Press enter to search</span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-slate-100">
                      {/* Left Column: Popular & Recent */}
                      <div className="p-3 space-y-3">
                        <div>
                          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1">
                            <TrendingUp className="w-3 h-3 text-amber-500" />
                            Popular Searches
                          </p>
                          <div className="flex flex-wrap gap-1.5">
                            {POPULAR_SEARCHES.map((query) => (
                              <button
                                key={query}
                                type="button"
                                onClick={() => {
                                  setSearchQuery(query);
                                  setIsSearchFocused(false);
                                  router.push(`/shop?search=${encodeURIComponent(query)}`);
                                }}
                                className="px-2.5 py-1 bg-slate-100 hover:bg-blue-50 hover:text-blue-600 text-slate-700 rounded-[2px] text-[11px] font-medium transition-colors cursor-pointer text-left"
                              >
                                {query}
                              </button>
                            ))}
                          </div>
                        </div>

                        <div>
                          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                            <Clock className="w-3 h-3 text-slate-400" />
                            Recent Searches
                          </p>
                          <ul className="space-y-1">
                            {RECENT_SEARCHES.map((item) => (
                              <li key={item}>
                                <button
                                  type="button"
                                  onClick={() => {
                                    setSearchQuery(item);
                                    setIsSearchFocused(false);
                                    router.push(`/shop?search=${encodeURIComponent(item)}`);
                                  }}
                                  className="text-slate-600 hover:text-blue-600 flex items-center gap-1.5 py-0.5 w-full text-left cursor-pointer"
                                >
                                  <Search className="w-3 h-3 text-slate-400" />
                                  <span>{item}</span>
                                </button>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      {/* Right Column: Brands & Categories */}
                      <div className="p-3 space-y-3 bg-slate-50/50">
                        <div>
                          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1">
                            <Tag className="w-3 h-3 text-purple-500" />
                            Browse by Brand
                          </p>
                          <div className="grid grid-cols-2 gap-1">
                            {SUGGESTED_BRANDS.map((b) => (
                              <Link
                                key={b.name}
                                href={b.href}
                                onClick={() => setIsSearchFocused(false)}
                                className="p-1.5 hover:bg-white rounded-[2px] text-slate-700 hover:text-blue-600 transition-colors block border border-transparent hover:border-slate-200"
                              >
                                <span className="font-bold text-[11px]">{b.name}</span>
                                <span className="block text-[10px] text-slate-400">{b.count}</span>
                              </Link>
                            ))}
                          </div>
                        </div>

                        <div>
                          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1">
                            <Monitor className="w-3 h-3 text-emerald-500" />
                            Key Categories
                          </p>
                          <div className="flex flex-wrap gap-1">
                            <Link
                              href="/shop?touch=Touch"
                              onClick={() => setIsSearchFocused(false)}
                              className="text-[11px] text-blue-600 hover:underline px-1 py-0.5"
                            >
                              Touch Screens •
                            </Link>
                            <Link
                              href="/shop?ips=1"
                              onClick={() => setIsSearchFocused(false)}
                              className="text-[11px] text-blue-600 hover:underline px-1 py-0.5"
                            >
                              IPS Displays •
                            </Link>
                            <Link
                              href="/shop?pin=30-pin"
                              onClick={() => setIsSearchFocused(false)}
                              className="text-[11px] text-blue-600 hover:underline px-1 py-0.5"
                            >
                              30-Pin EDP •
                            </Link>
                            <Link
                              href="/shop?pin=40-pin"
                              onClick={() => setIsSearchFocused(false)}
                              className="text-[11px] text-blue-600 hover:underline px-1 py-0.5"
                            >
                              40-Pin Gaming
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Right Side: Track Order, LKR, Account, Cart, WhatsApp */}
              <div className="flex items-center gap-2 sm:gap-3 shrink-0">
                {/* Mobile Search Button */}
                <button
                  onClick={() => setSearchOpen(!searchOpen)}
                  className="md:hidden p-2 text-slate-600 hover:text-blue-600 rounded-[3px] hover:bg-slate-100 transition-colors"
                  aria-label="Search"
                >
                  <Search className="w-5 h-5" />
                </button>

                {/* Track Order (Desktop) */}
                <Link
                  href="/checkout"
                  className="hidden xl:flex items-center gap-1.5 text-slate-600 hover:text-blue-600 text-xs font-semibold px-2 py-1 transition-colors"
                >
                  <PackageSearch className="w-4 h-4 text-slate-400" />
                  <span>Track Order</span>
                </Link>

                {/* Help & Support (Desktop) */}
                <Link
                  href="/contact"
                  className="hidden 2xl:flex items-center gap-1.5 text-slate-600 hover:text-blue-600 text-xs font-semibold px-2 py-1 transition-colors"
                >
                  <LifeBuoy className="w-4 h-4 text-slate-400" />
                  <span>Support</span>
                </Link>

                {/* Currency Selector (LKR) */}
                <div className="hidden sm:flex items-center gap-1 px-2 py-1 bg-slate-100 border border-slate-200 rounded-[3px] text-[11px] font-bold text-slate-700">
                  <span className="text-blue-600 font-extrabold">LKR</span>
                  <span className="text-slate-400 text-[10px]">Rs.</span>
                </div>

                {/* Account */}
                {isAuthenticated && user ? (
                  <div className="hidden sm:flex items-center gap-1 text-xs">
                    <Link
                      href="/account"
                      className="flex items-center gap-1.5 font-bold text-slate-800 hover:text-blue-600 px-2 py-1 rounded-[3px] transition-colors"
                    >
                      <UserCircle2 className="w-4 h-4 text-blue-600" />
                      <span className="max-w-[70px] truncate">{user.name.split(' ')[0]}</span>
                    </Link>
                    <button
                      onClick={() => logout()}
                      className="text-slate-400 hover:text-rose-600 text-[11px] cursor-pointer"
                      title="Log Out"
                    >
                      (Exit)
                    </button>
                  </div>
                ) : (
                  <Link
                    href="/login"
                    className="hidden sm:flex items-center gap-1.5 text-xs font-bold text-slate-700 hover:text-blue-600 px-2.5 py-1.5 border border-slate-200 rounded-[3px] hover:border-slate-300 transition-colors"
                  >
                    <UserCircle2 className="w-4 h-4 text-slate-500" />
                    <span>Sign In</span>
                  </Link>
                )}

                {/* Cart Icon */}
                <Link
                  href="/cart"
                  className="flex items-center gap-2 text-slate-700 hover:text-blue-600 px-2 py-1.5 rounded-[3px] hover:bg-slate-50 transition-colors relative"
                  aria-label="View Shopping Cart"
                >
                  <div className="relative">
                    <ShoppingBag className="w-5 h-5 sm:w-6 sm:h-6 text-slate-800" />
                    {totalItems > 0 && (
                      <span className="absolute -top-1.5 -right-2 bg-blue-600 text-white text-[10px] font-black w-4 h-4 sm:w-5 sm:h-5 rounded-full flex items-center justify-center border-2 border-white shadow-xs">
                        {totalItems}
                      </span>
                    )}
                  </div>
                  <div className="hidden lg:flex flex-col text-left leading-tight">
                    <span className="text-[10px] text-slate-400 font-medium">Cart</span>
                    <span className="text-xs font-bold text-slate-900">
                      {totalItems > 0 ? `${totalItems} Items` : '0 Items'}
                    </span>
                  </div>
                </Link>

                {/* WhatsApp Button (Official Green #22C55E / #25D366) */}
                <a
                  href={generateWhatsAppLink()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 bg-[#25D366] hover:bg-[#20bd5a] text-white text-xs font-bold px-3 sm:px-3.5 py-2 rounded-[3px] shadow-sm transition-all hover:scale-[1.02] cursor-pointer shrink-0"
                  aria-label="Order on WhatsApp"
                >
                  <MessageCircle className="w-4 h-4 fill-white" />
                  <span className="hidden sm:inline-block">Order on WhatsApp</span>
                  <span className="sm:hidden text-[11px]">WhatsApp</span>
                </a>

              </div>

            </div>
          </div>
        </div>

        {/* ====================================================== */}
        {/* 3. NAVIGATION BAR (Single Row, White, Thin Bottom Border) */}
        {/* ====================================================== */}
        <div className="hidden lg:block bg-white border-b border-slate-200 text-slate-700 text-xs">
          <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-10">

              {/* Left: All Categories Dropdown + Navigation Links */}
              <div className="flex items-center gap-1 xl:gap-2">

                {/* ☰ All Categories Button */}
                <div
                  className="relative"
                  onMouseEnter={() => setCategoriesOpen(true)}
                  onMouseLeave={() => setCategoriesOpen(false)}
                >
                  <button
                    type="button"
                    onClick={() => setCategoriesOpen(!categoriesOpen)}
                    className="flex items-center gap-2 bg-[#0B1B4B] hover:bg-navy-900 text-white font-bold px-3.5 py-2 rounded-[3px] text-xs transition-colors cursor-pointer"
                  >
                    <span>☰</span>
                    <span>All Categories</span>
                    <ChevronDown className="w-3.5 h-3.5" />
                  </button>

                  {/* Dropdown Menu */}
                  {categoriesOpen && (
                    <div className="absolute top-full left-0 pt-1 w-64 z-50">
                      <div className="bg-white rounded-[3px] border border-slate-200 shadow-xl py-1.5 divide-y divide-slate-100">
                        {ALL_CATEGORIES_MENU.map((cat) => (
                          <Link
                            key={cat.name}
                            href={cat.href}
                            onClick={() => setCategoriesOpen(false)}
                            className="block px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                          >
                            {cat.name}
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Single Row Nav Links */}
                <nav className="flex items-center space-x-1 xl:space-x-3 text-xs font-bold text-slate-700 overflow-x-auto no-scrollbar">
                  {navLinks.map((link) => {
                    const isActive = pathname === link.href;
                    return (
                      <Link
                        key={link.name}
                        href={link.href}
                        className={`px-2.5 py-2.5 transition-colors relative whitespace-nowrap ${
                          isActive
                            ? 'text-blue-600 after:absolute after:bottom-0 after:left-2 after:right-2 after:h-0.5 after:bg-blue-600'
                            : 'hover:text-blue-600'
                        }`}
                      >
                        {link.name}
                      </Link>
                    );
                  })}
                </nav>

              </div>

              {/* Right: Instant WhatsApp Link */}
              <a
                href="https://wa.me/94766025870"
                target="_blank"
                rel="noopener noreferrer"
                className="hidden xl:flex items-center gap-1 text-[11px] font-bold text-emerald-600 hover:text-emerald-700 hover:underline"
              >
                <span>Need assistance? 076 602 5870</span>
              </a>

            </div>
          </div>
        </div>

        {/* ====================================================== */}
        {/* EXPANDABLE MOBILE SEARCH ROW */}
        {/* ====================================================== */}
        {searchOpen && (
          <div className="md:hidden bg-slate-50 border-t border-slate-200 px-4 py-2.5">
            <form onSubmit={handleSearchSubmit} className="flex items-center gap-2">
              <div className="relative flex-1">
                <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search panel number, model, size..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 bg-white text-xs border border-slate-300 rounded-[3px] focus:outline-hidden focus:border-blue-600"
                  autoFocus
                />
              </div>
              <button
                type="submit"
                className="bg-blue-600 text-white text-xs font-bold px-3 py-1.5 rounded-[3px] hover:bg-blue-700 transition-colors"
              >
                Search
              </button>
              <button
                type="button"
                onClick={() => setSearchOpen(false)}
                className="p-1 text-slate-500 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </form>
          </div>
        )}
      </header>

      {/* Mobile Drawer */}
      <MobileDrawer isOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />
    </>
  );
}
