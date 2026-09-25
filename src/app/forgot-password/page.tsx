'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Mail, ArrowLeft, CheckCircle2, AlertCircle } from 'lucide-react';
import { Logo } from '@/components/Logo';
import { API_BASE_URL } from '@/lib/config';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch(`${API_BASE_URL}/auth/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setSubmitted(true);
      } else {
        setError(data.message || 'Unable to submit request. Please try again.');
      }
    } catch {
      setError('Network connection error. Please verify your connection.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-3 sm:p-6 font-sans">
      <div className="w-full max-w-md bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xl space-y-6">

        <div className="text-center space-y-3">
          <div className="flex justify-center">
            <Logo markClassName="w-10 h-10" nameClassName="text-2xl" taglineClassName="text-[8px]" />
          </div>

          <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">
              Reset Password
            </h1>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              {submitted
                ? "We've sent password reset instructions to your email"
                : "Enter your email and we'll send you a reset link"}
            </p>
          </div>
        </div>

        {submitted ? (
          <div className="space-y-5">
            <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-5 flex flex-col items-center text-center gap-2">
              <CheckCircle2 className="w-8 h-8 text-emerald-600" />
              <p className="text-xs font-bold text-emerald-800">
                Check your inbox at <span className="font-black">{email}</span> for a link to reset your password.
              </p>
            </div>
            <Link
              href="/login"
              className="w-full flex items-center justify-center gap-2 bg-primary-gradient text-white font-extrabold py-3.5 rounded-2xl shadow-lg shadow-purple-500/25 text-sm"
            >
              Back to Login
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold p-3.5 rounded-2xl flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}
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
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-blue-600 focus:outline-hidden"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary-gradient text-white font-extrabold py-3.5 rounded-2xl shadow-lg shadow-purple-500/25 text-sm hover:opacity-95 transition-all cursor-pointer"
            >
              {loading ? 'Sending...' : 'Send Reset Link'}
            </button>

            <Link
              href="/login"
              className="flex items-center justify-center gap-1.5 text-xs font-bold text-slate-500 hover:text-blue-600 pt-2"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Login</span>
            </Link>
          </form>
        )}
      </div>
    </div>
  );
}
