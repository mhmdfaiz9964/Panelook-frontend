'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ShieldCheck, Lock, Mail, ArrowRight, Eye, EyeOff, Loader2, KeyRound, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { adminLogin, setAdminSession } from '@/lib/adminApi';
import { Logo } from '@/components/Logo';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('admin@example.com');
  const [password, setPassword] = useState('ChangeMe123!');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const json = await adminLogin(email, password);
      setLoading(false);

      if (json.success) {
        setAdminSession(json.data.access_token, json.data.user);
        router.push('/admin');
      } else {
        setError(json.message || 'Invalid admin credentials');
      }
    } catch (e) {
      setLoading(false);
      setError('Could not reach the admin API. Is the backend server running?');
    }
  };

  const fillDemoCredentials = () => {
    setEmail('admin@example.com');
    setPassword('ChangeMe123!');
    setError('');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between items-center px-4 py-8 sm:py-12 font-sans relative overflow-hidden">
      {/* Subtle Background Accent */}
      <div className="absolute inset-0 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:20px_20px] opacity-60 pointer-events-none" />
      <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-blue-100/50 rounded-full blur-3xl pointer-events-none" />

      {/* Top Header Placeholder */}
      <div className="w-full max-w-[440px] flex items-center justify-between z-10 mb-4 sm:mb-6">
        <Link href="/" className="inline-flex items-center gap-2 group">
          <Logo markClassName="w-8 h-8" nameClassName="text-base" taglineClassName="text-[6px]" />
        </Link>
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-blue-50 border border-blue-200 text-blue-700 text-[11px] font-bold rounded-full">
          <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
          Admin Portal
        </span>
      </div>

      {/* Main Login Card */}
      <div className="w-full max-w-[440px] bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/90 shadow-xl shadow-slate-200/60 z-10 space-y-6">
        
        {/* Title Header */}
        <div className="text-left space-y-1">
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Sign In to Panelook
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 font-medium">
            Authorized management portal & inventory control
          </p>
        </div>

        {/* Development Credentials Quick-Fill Box */}
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 text-xs text-slate-600 space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-bold text-slate-800 flex items-center gap-1.5">
              <KeyRound className="w-3.5 h-3.5 text-blue-600" />
              Demo Credentials
            </span>
            <button
              type="button"
              onClick={fillDemoCredentials}
              className="inline-flex items-center gap-1 px-2 py-0.5 bg-blue-600 hover:bg-blue-700 text-white rounded text-[10px] font-bold transition-colors cursor-pointer"
            >
              <Sparkles className="w-3 h-3" />
              Auto-fill
            </button>
          </div>
          <div className="grid grid-cols-2 gap-2 text-[11px] font-medium pt-1">
            <div className="bg-white px-2 py-1 rounded border border-slate-200 truncate">
              <span className="text-slate-400 block text-[9px] uppercase font-bold">Email</span>
              <span className="text-slate-800 font-semibold truncate">admin@example.com</span>
            </div>
            <div className="bg-white px-2 py-1 rounded border border-slate-200 truncate">
              <span className="text-slate-400 block text-[9px] uppercase font-bold">Password</span>
              <span className="text-slate-800 font-semibold truncate">ChangeMe123!</span>
            </div>
          </div>
        </div>

        {error && (
          <div className="bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold p-3 rounded-xl flex items-start gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500 mt-1.5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Admin Email
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@panelook.lk"
                className="w-full pl-10 pr-3.5 py-2.5 sm:py-3 bg-white border border-slate-200 hover:border-slate-300 focus:border-blue-600 focus:ring-3 focus:ring-blue-100 rounded-xl text-xs sm:text-sm font-semibold text-slate-900 transition-all focus:outline-hidden"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full pl-10 pr-10 py-2.5 sm:py-3 bg-white border border-slate-200 hover:border-slate-300 focus:border-blue-600 focus:ring-3 focus:ring-blue-100 rounded-xl text-xs sm:text-sm font-semibold text-slate-900 transition-all focus:outline-hidden"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-3.5 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 active:scale-[0.99] text-white font-bold py-3 sm:py-3.5 rounded-xl shadow-md shadow-blue-600/20 text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-70"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Authenticating...</span>
              </>
            ) : (
              <>
                <span>Sign In to Admin Portal</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="text-center pt-1 border-t border-slate-100">
          <Link
            href="/"
            className="text-xs font-bold text-slate-500 hover:text-blue-600 inline-flex items-center gap-1.5 transition-colors"
          >
            &larr; Return to Public Storefront
          </Link>
        </div>

      </div>

      {/* Footer info */}
      <div className="w-full max-w-[440px] text-center pt-6 z-10">
        <p className="text-[11px] text-slate-400 font-medium">
          &copy; 2026 Panelook.lk &bull; Secured with TLS 256-bit encryption
        </p>
      </div>
    </div>
  );
}
