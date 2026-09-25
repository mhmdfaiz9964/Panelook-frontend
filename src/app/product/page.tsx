'use client';

import React, { Suspense } from 'react';
import ProductDetailClient from './[slug]/ProductDetailClient';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';

function ProductLoadingFallback() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <Header />
      <div className="flex-1 flex items-center justify-center p-12 text-center text-slate-500 font-bold">
        Loading Display Panel Details...
      </div>
      <Footer />
    </div>
  );
}

export default function ProductDynamicFallbackPage() {
  return (
    <Suspense fallback={<ProductLoadingFallback />}>
      <ProductDetailClient />
    </Suspense>
  );
}
