'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Mail, Lock, Eye, EyeOff, User, Phone, MapPin, Loader2, ArrowRight, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useCustomerAuth } from '@/context/CustomerAuthContext';
import Image from 'next/image';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';

export default function RegisterPage() {
  const router = useRouter();
  const { register, isAuthenticated } = useCustomerAuth();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(true);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});

  React.useEffect(() => {
    if (isAuthenticated) {
      router.replace('/account');
    }
  }, [isAuthenticated, router]);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setFieldErrors({});

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters long.');
      return;
    }

    if (!agreedToTerms) {
      setError('Please agree to the Terms & Conditions to proceed.');
      return;
    }

    setLoading(true);

    const result = await register({
      name: fullName,
      email,
      phone,
      password,
      password_confirmation: confirmPassword,
      address,
    });

    setLoading(false);

    if (result.success) {
      router.push('/account');
    } else {
      setError(result.message || 'Registration failed. Please check the inputs.');
      if (result.errors) {
        setFieldErrors(result.errors);
      }
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans">
      <Header />
      <div className="flex-1 flex items-center justify-center p-3 sm:p-6 my-4 sm:my-8">
        <div className="w-full max-w-5xl bg-white rounded-3xl border border-slate-200 shadow-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-12">
          
          {/* LEFT SIDE: Promotional Banner Showcase */}
          <div className="hidden lg:flex lg:col-span-5 relative bg-slate-950 overflow-hidden flex-col justify-between p-8 text-white">
            <Image
              src="/images/auth-side-banner.jpeg"
              alt="Panelook.lk Account Benefits"
              fill
              className="object-cover object-top opacity-70"
              priority
            />
            <div className="absolute inset-0 bg-linear-to-t from-slate-950 via-slate-900/50 to-slate-950/40" />

            {/* Top Pill */}
            <div className="relative z-10">
              <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-md px-3.5 py-1.5 rounded-full text-xs font-black border border-white/20 shadow-sm">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>Sri Lanka&apos;s Trusted Display Partner</span>
              </div>
            </div>

            {/* Bottom Content */}
            <div className="relative z-10 space-y-3.5">
              <div className="bg-emerald-600/90 backdrop-blur-md px-3.5 py-1.5 rounded-full text-[11px] font-black w-fit shadow-sm flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Instant 3–12 Month Warranty Registration</span>
              </div>
              <h2 className="text-xl xl:text-2xl font-black leading-tight text-white drop-shadow-sm">
                Genuine Tested Laptop Replacement Displays
              </h2>
              <p className="text-xs text-slate-200 font-medium leading-relaxed">
                Register to track dispatches in real-time, view verified compatibility, and receive wholesale pricing.
              </p>

              <div className="pt-2 border-t border-white/15 flex items-center justify-between text-xs font-bold text-slate-300">
                <span>✓ 100% Original Displays</span>
                <span>✓ Islandwide Express</span>
              </div>
            </div>
          </div>

          {/* RIGHT SIDE: Registration Form */}
          <div className="lg:col-span-7 p-6 sm:p-10 flex flex-col justify-between bg-white">
            <div>
              {/* Centered Logo */}
              <div className="flex flex-col items-center justify-center pt-1 mb-4">
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

              <div className="mb-5 text-center">
                <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                  Create Customer Account
                </h1>
                <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1">
                  Register to track laptop screen dispatches and access genuine warranty.
                </p>
              </div>

              {error && (
                <div className="mb-4 bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold p-3.5 rounded-2xl flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <form onSubmit={handleRegister} className="space-y-3.5">
                {/* Full Name */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Full Name *
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="e.g. Ruwan Perera"
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-blue-600 focus:outline-hidden transition"
                    />
                  </div>
                  {fieldErrors.name && (
                    <span className="text-[11px] text-rose-600 font-semibold block mt-0.5">{fieldErrors.name[0]}</span>
                  )}
                </div>

                {/* Email & Phone grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Email Address *
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="e.g. ruwan@example.com"
                        className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-blue-600 focus:outline-hidden transition"
                      />
                    </div>
                    {fieldErrors.email && (
                      <span className="text-[11px] text-rose-600 font-semibold block mt-0.5">{fieldErrors.email[0]}</span>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Phone / Mobile *
                    </label>
                    <div className="relative">
                      <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                      <input
                        type="tel"
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="e.g. 077 123 4567"
                        className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-blue-600 focus:outline-hidden transition"
                      />
                    </div>
                    {fieldErrors.phone && (
                      <span className="text-[11px] text-rose-600 font-semibold block mt-0.5">{fieldErrors.phone[0]}</span>
                    )}
                  </div>
                </div>

                {/* Address */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Delivery Address / City
                  </label>
                  <div className="relative">
                    <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                    <input
                      type="text"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder="e.g. 45 Galle Road, Colombo"
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-blue-600 focus:outline-hidden transition"
                    />
                  </div>
                </div>

                {/* Password & Confirm Password */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Password *
                    </label>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Min 8 characters"
                        className="w-full pl-10 pr-9 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-blue-600 focus:outline-hidden transition"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-3 text-slate-400 hover:text-slate-600"
                      >
                        {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                    {fieldErrors.password && (
                      <span className="text-[11px] text-rose-600 font-semibold block mt-0.5">{fieldErrors.password[0]}</span>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Confirm Password *
                    </label>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Confirm password"
                        className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-blue-600 focus:outline-hidden transition"
                      />
                    </div>
                  </div>
                </div>

                {/* Terms checkbox */}
                <div className="flex items-center gap-2 pt-1">
                  <input
                    type="checkbox"
                    id="terms"
                    checked={agreedToTerms}
                    onChange={(e) => setAgreedToTerms(e.target.checked)}
                    className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500"
                  />
                  <label htmlFor="terms" className="text-[11px] text-slate-600 font-semibold">
                    I agree to the{' '}
                    <Link href="/terms" className="text-blue-600 font-bold hover:underline">
                      Terms & Conditions
                    </Link>{' '}
                    and 6-Month Display Warranty Policy.
                  </label>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-bold py-3 px-4 rounded-2xl text-xs shadow-md shadow-blue-500/20 flex items-center justify-center gap-2 cursor-pointer transition"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Creating account...</span>
                    </>
                  ) : (
                    <>
                      <span>Register Account</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* Footer Navigation */}
            <div className="pt-4 border-t border-slate-100 mt-5 text-center text-xs text-slate-600 font-semibold">
              Already have an account?{' '}
              <Link href="/login" className="text-blue-600 font-bold hover:underline">
                Log In &rarr;
              </Link>
            </div>
          </div>

        </div>
      </div>
      <Footer />
    </div>
  );
}
