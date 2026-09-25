'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { FixedMobileBottomNav } from '@/components/FixedMobileBottomNav';
import { useCustomerAuth } from '@/context/CustomerAuthContext';
import { Package, User, MapPin, Shield, LogOut, LayoutDashboard, Loader2 } from 'lucide-react';

interface AccountLayoutProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}

const NAV_ITEMS = [
  { href: '/account', label: 'Overview', icon: LayoutDashboard },
  { href: '/account/orders', label: 'My Orders', icon: Package },
  { href: '/account/profile', label: 'Profile Details', icon: User },
  { href: '/account/addresses', label: 'Saved Addresses', icon: MapPin },
  { href: '/account/security', label: 'Security & Password', icon: Shield },
];

export function AccountLayout({ title, subtitle, children }: AccountLayoutProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isAuthenticated, isLoading, logout } = useCustomerAuth();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace('/login');
    }
  }, [isLoading, isAuthenticated, router]);

  if (isLoading || !user) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center font-sans">
        <div className="text-center space-y-3">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto" />
          <p className="text-xs font-bold text-slate-500">Loading your account...</p>
        </div>
      </div>
    );
  }

  const handleLogout = async () => {
    await logout();
    router.push('/');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 flex-1 w-full">
        {/* Page Header */}
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              {title}
            </h1>
            {subtitle && (
              <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1">
                {subtitle}
              </p>
            )}
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs font-bold text-slate-500 bg-white border border-slate-200 px-3 py-1.5 rounded-xl shadow-2xs">
              Account: <strong className="text-slate-900">{user.name}</strong>
            </span>
            <button
              onClick={handleLogout}
              className="text-xs font-bold text-rose-600 hover:text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 px-3 py-1.5 rounded-xl flex items-center gap-1.5 cursor-pointer transition"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Log Out</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Navigation Sidebar */}
          <div className="lg:col-span-3 space-y-2">
            <div className="bg-white rounded-3xl p-3 border border-slate-200 shadow-2xs space-y-1">
              {NAV_ITEMS.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-bold transition ${
                      isActive
                        ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                    }`}
                  >
                    <Icon className="w-4 h-4 shrink-0" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </div>

            {/* Support Widget */}
            <div className="bg-blue-50 border border-blue-200 rounded-3xl p-5 text-xs text-blue-900 space-y-2">
              <span className="font-black text-blue-950 block">Need Screen Assistance?</span>
              <p className="text-blue-800 text-[11px] leading-relaxed">
                Contact our Colombo technical team for part verification or custom screen orders.
              </p>
              <a
                href="https://wa.me/94766025870"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-blue-600 text-white font-bold px-4 py-2 rounded-xl text-[11px] shadow-sm hover:bg-blue-700 transition mt-1"
              >
                WhatsApp 076 602 5870
              </a>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-9">{children}</div>
        </div>
      </main>

      <Footer />
      <FixedMobileBottomNav />
    </div>
  );
}
