'use client';

import React, { useEffect, useState } from 'react';
import { Header } from '@/components/Header';
import { HeroSlider } from '@/components/HeroSlider';
import { TrustStrip } from '@/components/TrustStrip';
import { CategoryShowcase } from '@/components/CategoryShowcase';
import { DisplayFinderBox } from '@/components/DisplayFinderBox';
import { PromotionalBannerGrid } from '@/components/PromotionalBannerGrid';
import { PopularDisplaysSection } from '@/components/PopularDisplaysSection';
import { KokoPromoBanner } from '@/components/KokoPromoBanner';
import { BrandShowcase } from '@/components/BrandShowcase';
import { ShopBySize } from '@/components/ShopBySize';
import { FeaturedCollections } from '@/components/FeaturedCollections';
import { FeaturedDisplaysSection } from '@/components/FeaturedDisplaysSection';
import { WhyChooseUs } from '@/components/WhyChooseUs';
import { WhatsAppBanner } from '@/components/WhatsAppBanner';
import { BulkOrdersSection } from '@/components/BulkOrdersSection';
import { CustomerTrustSection } from '@/components/CustomerTrustSection';
import { PaymentMethodsBar } from '@/components/PaymentMethodsBar';
import { Footer } from '@/components/Footer';
import { FloatingWhatsApp } from '@/components/FloatingWhatsApp';
import { FixedMobileBottomNav } from '@/components/FixedMobileBottomNav';
import { fetchProducts } from '@/lib/api';
import { Product } from '@/types';

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    fetchProducts().then(({ data }) => setProducts(data));
  }, []);

  return (
    <main className="min-h-screen bg-white flex flex-col font-sans selection:bg-blue-600 selection:text-white">
      {/* Semantic Single H1 for SEO as required by Section 40 */}
      <h1 className="sr-only">
        Perfect Match. Perfect Vision. | Panelook.lk Sri Lanka Laptop Displays
      </h1>

      {/* 1, 2, 3. Header: Top Utility Bar, Main Header, Navigation */}
      <Header />

      {/* 4. Hero Slider (Real uploaded banners, 400-500px desktop, dots & arrows) */}
      <HeroSlider />

      {/* 5. Trust / Service Strip (5 equal columns: 100% Genuine, Warranty, Delivery, Payments, Support) */}
      <TrustStrip />

      {/* 6. Shop by Category (Compact AliExpress-style cards) */}
      <CategoryShowcase />

      {/* 7. Find Your Perfect Display (Dedicated 2-row rectangular search & filter box) */}
      <DisplayFinderBox />

      {/* 8. Promotional Banner Grid (Real uploaded banners: 50% left + 2 stacked right) */}
      <PromotionalBannerGrid />

      {/* 10. Popular Displays (Tabs: All, FHD, Touch, IPS, 30-Pin, 40-Pin with 5-col grid) */}
      <PopularDisplaysSection products={products} />

      {/* 11. KOKO Pay Promotion (Clean rectangular banner: Buy Now Pay Later) */}
      <KokoPromoBanner />

      {/* 12. Top Laptop Brands (HP, Dell, Lenovo, ASUS, Acer, MSI, Samsung, LG, BOE, AUO) */}
      <BrandShowcase />

      {/* 13. Shop by Size (10.1" to 18.0" with display counts) */}
      <ShopBySize />

      {/* 14. Featured Collections (3-4 rectangular collection cards with real images) */}
      <FeaturedCollections />

      {/* 16. Featured Displays (5-6 products data-driven) */}
      <FeaturedDisplaysSection products={products} />

      {/* 17. Why Choose Panelook.lk (5 benefits) */}
      <WhyChooseUs />

      {/* 18. Can't Find Your Display? CTA (WhatsApp 076 602 5870) */}
      <WhatsAppBanner />

      {/* 19. Bulk Orders for Businesses (B2B wholesale pricing, fast delivery) */}
      <BulkOrdersSection />

      {/* 20. Customer Trust (1,000+ Customers, 6+ Years Experience, Islandwide Delivery) */}
      <CustomerTrustSection />

      {/* 21. Payment Methods (Visa, Mastercard, KOKO, Cash on Delivery) */}
      <PaymentMethodsBar />

      {/* 22. Footer (Real logo, 5 columns, Proudly Sri Lankan 🇱🇰) */}
      <Footer />

      {/* 23. Floating WhatsApp (Fixed desktop & floating mobile) */}
      <FloatingWhatsApp />

      {/* Mobile Fixed Bottom Navigation (Home, Shop, Categories, Orders, Account) */}
      <FixedMobileBottomNav />
    </main>
  );
}
