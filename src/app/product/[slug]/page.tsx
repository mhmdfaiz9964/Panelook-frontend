import React, { Suspense } from 'react';
import { fetchProducts, MOCK_PRODUCTS } from '@/lib/api';
import ProductDetailClient from './ProductDetailClient';
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

// Required for static export (output: 'export'): tells Next.js which
// /product/[slug] pages to pre-render at build time.
export async function generateStaticParams() {
  try {
    const { data } = await fetchProducts();
    if (data.length > 0) {
      return data.map((p) => ({ slug: p.slug }));
    }
  } catch {
    // fall through to mock data below
  }
  return MOCK_PRODUCTS.map((p) => ({ slug: p.slug }));
}

export default function ProductDetailPage() {
  return (
    <Suspense fallback={<ProductLoadingFallback />}>
      <ProductDetailClient />
    </Suspense>
  );
}
