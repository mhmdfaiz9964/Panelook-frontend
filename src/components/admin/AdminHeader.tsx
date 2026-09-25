'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Menu, Search, Bell, ChevronDown, LogOut, UserCircle, Settings as SettingsIcon, Activity } from 'lucide-react';
import { clearAdminSession, getAdminUser } from '@/lib/adminApi';

const NOTIFICATIONS = [
  { title: 'New order received', detail: '#ORD-001245 from Nimal Perera', time: '5m ago' },
  { title: 'Low stock alert', detail: 'LM156LFGL01 has 2 units left', time: '1h ago' },
  { title: 'New customer registered', detail: 'Ruwan Silva created an account', time: '3h ago' },
  { title: 'Stock adjustment made', detail: 'B156XW04 V.8 +10 units', time: '5h ago' },
  { title: 'Purchase order received', detail: 'PO-0032 marked as received', time: '1d ago' },
];

interface AdminHeaderProps {
  title: string;
  onOpenMobileMenu: () => void;
}

export function AdminHeader({ title, onOpenMobileMenu }: AdminHeaderProps) {
  const router = useRouter();
  const [notifOpen, setNotifOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [user, setUser] = useState<{ name: string; email: string; role: string } | null>(null);
  const notifRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setUser(getAdminUser());
    const handleClick = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) setNotifOpen(false);
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) setProfileOpen(false);
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const handleLogout = () => {
    clearAdminSession();
    router.push('/admin/login');
  };

  const initials = (user?.name || 'Admin')
    .split(' ')
    .map((n) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  return (
    <header className="h-16 bg-white border-b border-slate-200/80 flex items-center justify-between px-4 sm:px-6 shrink-0 sticky top-0 z-30 font-sans">
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenMobileMenu}
          className="lg:hidden p-2 -ml-2 text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
          aria-label="Open menu"
        >
          <Menu className="w-5 h-5" />
        </button>
        <h1 className="text-base sm:text-xl font-extrabold text-slate-900 tracking-tight">{title}</h1>
      </div>

      <div className="flex items-center gap-2 sm:gap-3">
        {/* Search */}
        <div className="hidden md:flex items-center relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3" />
          <input
            type="text"
            placeholder="Search panels, orders, brands..."
            className="pl-9 pr-14 py-1.5 bg-slate-50 border border-slate-200/80 rounded-lg text-xs font-medium text-slate-800 placeholder-slate-400 w-60 focus:bg-white focus:outline-hidden focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition-all"
          />
          <kbd className="absolute right-2 text-[10px] font-bold text-slate-400 bg-white border border-slate-200 rounded px-1.5 py-0.5">
            Ctrl+/
          </kbd>
        </div>

        {/* Notifications */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => { setNotifOpen(!notifOpen); setProfileOpen(false); }}
            className="relative p-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
            aria-label="Notifications"
          >
            <Bell className="w-4 h-4 sm:w-5 sm:h-5" />
            <span className="absolute top-1 right-1 bg-blue-600 text-white text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center shadow-xs">
              {NOTIFICATIONS.length}
            </span>
          </button>

          {notifOpen && (
            <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl border border-slate-200 shadow-xl overflow-hidden z-50">
              <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between">
                <span className="text-xs font-bold text-slate-900">Notifications</span>
                <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">{NOTIFICATIONS.length} new</span>
              </div>
              <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
                {NOTIFICATIONS.map((n, i) => (
                  <div key={i} className="px-4 py-2.5 hover:bg-slate-50 transition-colors">
                    <div className="text-xs font-semibold text-slate-900">{n.title}</div>
                    <div className="text-[11px] text-slate-500 mt-0.5">{n.detail}</div>
                    <div className="text-[10px] text-slate-400 mt-1 font-medium">{n.time}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Profile */}
        <div className="relative pl-2 sm:pl-3 border-l border-slate-200" ref={profileRef}>
          <button
            onClick={() => { setProfileOpen(!profileOpen); setNotifOpen(false); }}
            className="flex items-center gap-2 cursor-pointer p-1 rounded-lg hover:bg-slate-50 transition-colors"
          >
            <div className="w-8 h-8 rounded-full bg-blue-600 text-white font-black text-xs flex items-center justify-center shrink-0 shadow-xs">
              {initials}
            </div>
            <div className="text-left hidden sm:block">
              <span className="text-xs font-bold text-slate-900 block leading-tight">
                {user?.name || 'Admin'}
              </span>
              <span className="text-[10px] text-slate-500 font-medium capitalize">
                {user?.role?.replace('_', ' ') || 'Super Admin'}
              </span>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden sm:block" />
          </button>

          {profileOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl border border-slate-200 shadow-xl overflow-hidden py-1 z-50 text-xs">
              <button className="w-full flex items-center gap-2.5 px-3.5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50">
                <UserCircle className="w-4 h-4 text-slate-400" />
                Profile
              </button>
              <button className="w-full flex items-center gap-2.5 px-3.5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50">
                <SettingsIcon className="w-4 h-4 text-slate-400" />
                Settings
              </button>
              <button className="w-full flex items-center gap-2.5 px-3.5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50">
                <Activity className="w-4 h-4 text-slate-400" />
                Activity Log
              </button>
              <div className="border-t border-[#E7EAF3] mt-1 pt-1">
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2.5 px-4 py-2 text-[13px] font-medium text-rose-600 hover:bg-rose-50"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
