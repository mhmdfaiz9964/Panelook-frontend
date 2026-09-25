'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  Loader2,
  ShieldCheck,
  Truck,
  RotateCcw,
  AlertCircle,
  CheckCircle2,
} from 'lucide-react';
import { useCustomerAuth } from '@/context/CustomerAuthContext';
import Image from 'next/image';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';

export default function LoginPage() {
  const router = useRouter();
  const { login, isAuthenticated } = useCustomerAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // If already logged in, redirect to account
  React.useEffect(() => {
    if (isAuthenticated) {
      router.replace('/account');
    }
  }, [isAuthenticated, router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await login(email, password);
    setLoading(false);

    if (result.success) {
      router.push('/account');
    } else {
      setError(result.message || 'Invalid email or password.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans">
      <Header />
      <div className="flex-1 flex items-center justify-center p-3 sm:p-6 my-4 sm:my-8">
        <div className="w-full max-w-5xl bg-white rounded-3xl border border-slate-200 shadow-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-12">
          
          {/* LEFT SIDE: Promotional Banner Showcase */}
          <div className="hidden lg:flex lg:col-span-6 relative bg-slate-950 overflow-hidden flex-col justify-between p-8 text-white">
            {/* Background Banner Image */}
            <Image
              src="/images/Login UI Sidesection.jpeg"
              alt="Panelook.lk Original Laptop Displays"
              fill
              className="object-cover object-center opacity-70"
              priority
            />
            <div className="absolute inset-0 bg-linear-to-t from-slate-950 via-slate-900/50 to-slate-950/40" />

            {/* Top Brand Pill */}
            <div className="relative z-10">
              <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-md px-3.5 py-1.5 rounded-full text-xs font-black border border-white/20 shadow-sm">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>Sri Lanka&apos;s #1 Laptop Display Destination</span>
              </div>
            </div>

            {/* Bottom Content & Highlights */}
            <div className="relative z-10 space-y-4">
              <div>
                <h2 className="text-2xl xl:text-3xl font-black leading-tight tracking-tight text-white drop-shadow-sm">
                  100% Genuine Tested <br />Laptop Replacement Screens
                </h2>
                <p className="text-xs xl:text-sm text-slate-200 mt-1.5 font-medium leading-relaxed max-w-md">
                  Over 15+ screen sizes in stock. Express islandwide doorstep delivery with 3 to 12 months genuine replacement warranty.
                </p>
              </div>

              {/* Trust Badges */}
              <div className="grid grid-cols-2 gap-2.5 pt-2">
                <div className="bg-white/10 backdrop-blur-md border border-white/15 rounded-xl p-2.5 flex items-center gap-2.5">
                  <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
                  <div className="min-w-0">
                    <div className="text-[11px] font-bold text-white truncate">100% Genuine</div>
                    <div className="text-[9px] text-slate-300">Tested A+ Panels</div>
                  </div>
                </div>

                <div className="bg-white/10 backdrop-blur-md border border-white/15 rounded-xl p-2.5 flex items-center gap-2.5">
                  <Truck className="w-5 h-5 text-blue-400 shrink-0" />
                  <div className="min-w-0">
                    <div className="text-[11px] font-bold text-white truncate">Fast Delivery</div>
                    <div className="text-[9px] text-slate-300">Across Sri Lanka</div>
                  </div>
                </div>
              </div>

              {/* Customer Social Proof */}
              <div className="bg-white/10 backdrop-blur-md border border-white/15 rounded-xl p-3 flex items-center justify-between">
                <div>
                  <div className="text-xs font-black text-white">Trusted by 1,000+</div>
                  <div className="text-[10px] text-slate-300 font-medium">Technicians &amp; Laptop Owners</div>
                </div>
                <div className="flex items-center -space-x-1.5">
                  <div className="w-6 h-6 rounded-full bg-blue-500 border border-white flex items-center justify-center text-[9px] font-bold text-white">HP</div>
                  <div className="w-6 h-6 rounded-full bg-indigo-500 border border-white flex items-center justify-center text-[9px] font-bold text-white">DL</div>
                  <div className="w-6 h-6 rounded-full bg-purple-500 border border-white flex items-center justify-center text-[9px] font-bold text-white">AP</div>
                  <div className="w-6 h-6 rounded-full bg-emerald-500 border border-white flex items-center justify-center text-[8px] font-black text-white">1K+</div>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT SIDE: Login Form Card */}
          <div className="lg:col-span-6 p-6 sm:p-10 flex flex-col justify-between bg-white">
            <div className="space-y-6">

              {/* Centered Logo (No extra thumbnail image) */}
              <div className="flex flex-col items-center justify-center pt-2">
                <Link href="/" className="inline-flex items-center justify-center">
                  <Image
                    src="/images/logo.jpeg"
                    alt="Panelook.lk"
                    width={180}
                    height={52}
                    className="h-10 sm:h-12 w-auto object-contain"
                    priority
                  />
                </Link>
              </div>

              {/* Headline */}
              <div className="text-center">
                <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight flex items-center justify-center gap-1.5">
                  <span>Welcome Back!</span>
                  <span>👋</span>
                </h1>
                <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1">
                  Login to your Panelook.lk customer account
                </p>
              </div>

              {error && (
                <div className="bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold p-3.5 rounded-2xl flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <form onSubmit={handleLogin} className="space-y-4">
                {/* Email Address */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email"
                      className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-blue-600 focus:outline-hidden transition"
                    />
                  </div>
                </div>

                {/* Password */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-bold text-slate-700">
                      Password
                    </label>
                    <Link href="/forgot-password" className="text-xs font-bold text-blue-600 hover:underline">
                      Forgot Password?
                    </Link>
                  </div>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter your password"
                      className="w-full pl-10 pr-10 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-blue-600 focus:outline-hidden transition"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-3.5 text-slate-400 hover:text-slate-600 cursor-pointer"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Remember me Checkbox */}
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="remember"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 w-4 h-4"
                  />
                  <label htmlFor="remember" className="text-xs font-bold text-slate-700 cursor-pointer select-none">
                    Remember me
                  </label>
                </div>

                {/* Login Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:opacity-95 text-white font-extrabold py-3.5 px-4 rounded-2xl text-sm shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2 cursor-pointer transition active:scale-[0.99]"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Signing in...</span>
                    </>
                  ) : (
                    <span>Login</span>
                  )}
                </button>
              </form>

              {/* Divider: or continue with */}
              <div className="relative flex items-center justify-center my-4">
                <div className="border-t border-slate-200 w-full" />
                <span className="bg-white px-3 text-[11px] font-bold text-slate-400 uppercase tracking-wider shrink-0">
                  or continue with
                </span>
                <div className="border-t border-slate-200 w-full" />
              </div>

              {/* Social Buttons */}
              <div className="space-y-2.5">
                <button
                  type="button"
                  onClick={() => alert('Social authentication available via Google Account.')}
                  className="w-full flex items-center justify-center gap-2.5 py-3 px-4 rounded-2xl border border-slate-200 bg-white hover:bg-slate-50 text-xs font-bold text-slate-700 shadow-2xs transition cursor-pointer"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                    />
                  </svg>
                  <span>Continue with Google</span>
                </button>

                <button
                  type="button"
                  onClick={() => alert('Social authentication available via Facebook Account.')}
                  className="w-full flex items-center justify-center gap-2.5 py-3 px-4 rounded-2xl border border-slate-200 bg-white hover:bg-slate-50 text-xs font-bold text-slate-700 shadow-2xs transition cursor-pointer"
                >
                  <svg className="w-4 h-4 fill-[#1877F2]" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                  <span>Continue with Facebook</span>
                </button>
              </div>

              {/* Don't have an account */}
              <div className="text-center text-xs text-slate-600 font-semibold pt-2">
                Don&apos;t have an account?{' '}
                <Link href="/register" className="text-blue-600 font-bold hover:underline">
                  Register Now
                </Link>
              </div>

            </div>
          </div>

        </div>
      </div>
      <Footer />
    </div>
  );
}
