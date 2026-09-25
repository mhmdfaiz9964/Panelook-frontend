'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { StickyMobileActionBar } from '@/components/StickyMobileActionBar';
import { FixedMobileBottomNav } from '@/components/FixedMobileBottomNav';
import { ProductCarousel } from '@/components/ProductCarousel';
import { fetchProductBySlug, MOCK_PRODUCTS } from '@/lib/api';
import { Product } from '@/types';
import { useCart } from '@/context/CartContext';
import {
  Heart,
  ShoppingBag,
  MessageCircle,
  ShieldCheck,
  CheckCircle2,
  Truck,
  Lock,
  ChevronRight,
  ChevronDown,
  Star,
  Zap,
  HelpCircle,
  Monitor,
  Image as ImageIcon,
  Plug,
  Layers,
  Hand,
  RefreshCw,
  Palette,
  Award,
  Laptop,
  RotateCcw,
  Headset,
} from 'lucide-react';

const SPEC_ROWS = (product: Product) => [
  { icon: Monitor, label: 'Panel Size', value: `${product.display_size || product.screen_size || ''} Inch` },
  { icon: Laptop, label: 'Brand', value: product.brand?.name || 'Universal Display' },
  { icon: Layers, label: 'Product Type', value: product.product_type?.name || 'Laptop Display' },
  { icon: ImageIcon, label: 'Resolution', value: product.resolution || 'FHD 1920x1080' },
  { icon: Plug, label: 'Connector Pin', value: product.pin_type || '30-Pin' },
  { icon: Layers, label: 'Panel Type', value: product.display_type || 'IPS' },
  { icon: Hand, label: 'Touch Support', value: product.touch_type || 'Non-Touch' },
  { icon: RefreshCw, label: 'Refresh Rate', value: product.refresh_rate || '60Hz' },
  { icon: Palette, label: 'Surface', value: product.panel_surface || 'Matte Anti-Glare' },
  { icon: ShieldCheck, label: 'Condition', value: 'A+ Grade (100% Original)' },
  { icon: Award, label: 'Warranty', value: product.warranty || '3 Months' },
];

export default function ProductDetailClient() {
  const params = useParams();
  const { addToCart } = useCart();

  // Multi-tier slug resolution supporting:
  // 1. Static route params (e.g. /product/[slug])
  // 2. URL search params (e.g. /product?slug=xyz)
  // 3. Apache/LiteSpeed rewrites from /product/<new-slug> to /product/index.html
  const [currentSlug, setCurrentSlug] = useState<string>(() => {
    if (params?.slug && typeof params.slug === 'string' && params.slug !== 'index' && params.slug !== 'view') {
      return params.slug;
    }
    return '';
  });

  const [product, setProduct] = useState<Product | null>(null);
  const [selectedImage, setSelectedImage] = useState<string>('');
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const [showAllSpecs, setShowAllSpecs] = useState(false);
  const [modelSearch, setModelSearch] = useState('');
  const [loading, setLoading] = useState(true);

  // Inspect window location if params didn't provide the slug
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // 1. Check query parameter ?slug=...
      const query = new URLSearchParams(window.location.search).get('slug');
      if (query) {
        setCurrentSlug(query);
        return;
      }

      // 2. Check pathname /product/<slug>
      const segments = window.location.pathname.split('/').filter(Boolean);
      const productIdx = segments.indexOf('product');
      if (productIdx !== -1 && segments[productIdx + 1]) {
        const pathSlug = decodeURIComponent(segments[productIdx + 1]);
        if (pathSlug !== 'index' && pathSlug !== 'view') {
          setCurrentSlug(pathSlug);
          return;
        }
      }
    }
  }, [params]);

  useEffect(() => {
    if (currentSlug) {
      setLoading(true);
      fetchProductBySlug(currentSlug).then((p) => {
        setProduct(p);
        if (p) {
          const main = p.main_image || p.images_relation?.[0]?.image_url || '/images/products/panel-b156xw04.png';
          setSelectedImage(main);
        }
        setLoading(false);
      }).catch(() => {
        setProduct(null);
        setLoading(false);
      });
    } else {
      // If after checking there's no slug, don't hang on loading
      const timer = setTimeout(() => {
        if (!currentSlug) setLoading(false);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [currentSlug]);

  if (loading) {
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

  if (!product) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
        <Header />
        <div className="flex-1 flex items-center justify-center p-12 text-center">
          <h2 className="text-xl font-black text-slate-800">Product Not Found</h2>
        </div>
        <Footer />
      </div>
    );
  }

  const handleAddToCart = () => {
    addToCart(product, undefined, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const getWhatsAppUrl = () => {
    const msg = `Hello Panelook.lk,\n\nI want to order:\n*Product:* ${product.name}\n*SKU:* ${product.sku || 'N/A'}\n*Size:* ${product.display_size || product.screen_size || ''}\n*Pin:* ${product.pin_type || ''}\n*Price:* LKR ${product.selling_price.toLocaleString()}\n*Qty:* ${quantity}\n\nPlease confirm availability!`;
    return `https://wa.me/94766025870?text=${encodeURIComponent(msg)}`;
  };

  const getWholesaleUrl = () => {
    const msg = `Hello Panelook.lk Wholesale Dept,\n\nI am a laptop technician / repair shop inquiring about bulk pricing for *${product.name}* (SKU: ${product.sku || 'N/A'}).`;
    return `https://wa.me/94766025870?text=${encodeURIComponent(msg)}`;
  };

  // Build dynamic gallery list
  const thumbnails: string[] = [];
  if (product.main_image) thumbnails.push(product.main_image);
  if (product.images_relation && product.images_relation.length > 0) {
    product.images_relation.forEach((img) => {
      if (img.image_url && !thumbnails.includes(img.image_url)) {
        thumbnails.push(img.image_url);
      }
    });
  }
  if (product.images && Array.isArray(product.images)) {
    product.images.forEach((img) => {
      if (typeof img === 'string' && !thumbnails.includes(img)) {
        thumbnails.push(img);
      }
    });
  }
  if (thumbnails.length === 0) {
    thumbnails.push('/images/products/panel-b156xw04.png');
  }

  // Extract laptop models
  const laptopModels: string[] = [];
  if (product.laptop_models && product.laptop_models.length > 0) {
    product.laptop_models.forEach((m) => {
      if (m.model_name && !laptopModels.includes(m.model_name)) laptopModels.push(m.model_name);
    });
  } else if (product.laptop_model) {
    product.laptop_model.split(',').forEach((m) => {
      const trimmed = m.trim();
      if (trimmed && !laptopModels.includes(trimmed)) laptopModels.push(trimmed);
    });
  }

  // Extract part numbers
  const partNumbers: string[] = [];
  if (product.part_numbers && product.part_numbers.length > 0) {
    product.part_numbers.forEach((p) => {
      if (p.part_number && !partNumbers.includes(p.part_number)) partNumbers.push(p.part_number);
    });
  } else if (product.panel_number) {
    product.panel_number.split(',').forEach((p) => {
      const trimmed = p.trim();
      if (trimmed && !partNumbers.includes(trimmed)) partNumbers.push(trimmed);
    });
  }

  // Filtered laptop models if user searches inside details
  const filteredModels = modelSearch.trim()
    ? laptopModels.filter((m) => m.toLowerCase().includes(modelSearch.toLowerCase()))
    : laptopModels;

  const displaySize = product.display_size || product.screen_size || '';
  const brandName = product.brand?.name || 'Universal Display';
  const productTypeName = product.product_type?.name || 'Laptop Display';

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <Header />

      {/* Main Container */}
      <main className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8 flex-1 w-full space-y-6">
        
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center gap-1.5 text-[11px] sm:text-xs font-semibold text-blue-600 overflow-x-auto no-scrollbar">
          <Link href="/" className="hover:underline">Home</Link>
          <ChevronRight className="w-3 h-3 text-slate-400 shrink-0" />
          <Link href={`/shop?screen_size=${displaySize}`} className="hover:underline">{displaySize}&quot; Displays</Link>
          <ChevronRight className="w-3 h-3 text-slate-400 shrink-0" />
          <span className="text-slate-500 font-medium">{productTypeName}</span>
          <ChevronRight className="w-3 h-3 text-slate-400 shrink-0" />
          <span className="text-slate-500 font-medium">{brandName}</span>
          <ChevronRight className="w-3 h-3 text-slate-400 shrink-0" />
          <span className="text-slate-700 font-bold truncate max-w-[200px]">{product.name}</span>
        </nav>

        {/* ============================= */}
        {/* DESKTOP LAYOUT (lg and above) */}
        {/* ============================= */}
        <div className="hidden lg:grid lg:grid-cols-[2.1fr_1.35fr_1.35fr] lg:gap-6 lg:items-start">

          {/* Column A: Gallery */}
          <div className="space-y-4">
            <div className="flex gap-3">
              {/* Vertical Thumbnails */}
              <div className="flex flex-col gap-2 shrink-0">
                {thumbnails.map((thumb, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(thumb)}
                    className={`w-16 h-16 rounded-[3px] border-2 overflow-hidden bg-slate-50 p-1 transition-all cursor-pointer ${
                      selectedImage === thumb ? 'border-blue-600 shadow-xs' : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <img src={thumb} alt="" className="w-full h-full object-contain" />
                  </button>
                ))}
              </div>

              {/* Main Image */}
              <div className="relative flex-1 aspect-4/3 rounded-[3px] bg-white border border-slate-200/90 p-6 flex items-center justify-center overflow-hidden">
                <span className="absolute top-3 left-3 bg-emerald-50 text-emerald-800 text-[10px] font-bold px-2.5 py-0.5 rounded-full border border-emerald-200 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  In Stock
                </span>
                <button className="absolute top-3 right-3 p-1.5 text-slate-400 hover:text-rose-500 transition-colors cursor-pointer">
                  <Heart className="w-5 h-5" />
                </button>
                <img
                  src={selectedImage}
                  alt={product.name}
                  className="w-full h-full object-contain"
                />
              </div>
            </div>

            {/* Trust Row Below Gallery */}
            <div className="grid grid-cols-4 gap-3 pt-4 border-t border-slate-200">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-blue-600 shrink-0" />
                <div>
                  <div className="text-[11px] font-bold text-slate-900">100% Genuine</div>
                  <div className="text-[9px] text-slate-500 font-medium">Original Panels</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Award className="w-4 h-4 text-blue-600 shrink-0" />
                <div>
                  <div className="text-[11px] font-bold text-slate-900">3&ndash;12 Months</div>
                  <div className="text-[9px] text-slate-500 font-medium">Warranty</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-blue-600 shrink-0" />
                <div>
                  <div className="text-[11px] font-bold text-slate-900">Islandwide</div>
                  <div className="text-[9px] text-slate-500 font-medium">Delivery</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Lock className="w-4 h-4 text-blue-600 shrink-0" />
                <div>
                  <div className="text-[11px] font-bold text-slate-900">Secure</div>
                  <div className="text-[9px] text-slate-500 font-medium">Payments</div>
                </div>
              </div>
            </div>
          </div>

          {/* Column B: Product Info & Specs */}
          <div className="space-y-4">
            <span className="inline-flex items-center gap-1 bg-blue-50 text-blue-800 text-[10px] font-bold px-2 py-0.5 rounded-[2px] border border-blue-200">
              <Zap className="w-3 h-3 fill-blue-600 text-blue-600" />
              Top Selling
            </span>

            <div className="space-y-1.5">
              <h1 className="text-xl xl:text-2xl font-black text-slate-900 tracking-tight">
                {product.name}
              </h1>
              <p className="text-xs font-semibold text-slate-500">
                {product.display_size} FHD • {product.resolution} • {product.pin_type} • {product.touch_type || 'Non-Touch'} • {product.display_type || 'IPS'}
              </p>
              <div className="flex items-center gap-2 pt-0.5 text-xs font-bold text-slate-700">
                <div className="flex items-center text-amber-400">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star key={s} className="w-3.5 h-3.5 fill-amber-400 stroke-amber-400" />
                  ))}
                </div>
                <span className="text-slate-900">4.8</span>
                <span className="text-slate-400 font-medium">(56 Reviews)</span>
              </div>
            </div>

            <div className="divide-y divide-slate-100 text-xs font-medium">
              {SPEC_ROWS(product).map((row) => (
                <div key={row.label} className="py-2 flex items-center justify-between gap-4">
                  <span className="text-slate-500 font-semibold flex items-center gap-2">
                    <row.icon className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    {row.label}
                  </span>
                  <span className="font-bold text-slate-900 text-right">{row.value}</span>
                </div>
              ))}
            </div>

            {/* Compatible Laptop Models Section */}
            <div className="bg-slate-50 border border-slate-200 rounded-[3px] p-3 space-y-2">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-1.5 font-bold text-xs text-slate-900">
                  <Laptop className="w-4 h-4 text-blue-600 shrink-0" />
                  <span>Compatible Laptop Models ({laptopModels.length})</span>
                </div>
                {laptopModels.length > 4 && (
                  <input
                    type="text"
                    placeholder="Search model..."
                    value={modelSearch}
                    onChange={(e) => setModelSearch(e.target.value)}
                    className="text-[11px] px-2 py-0.5 border border-slate-300 rounded bg-white w-28 focus:outline-blue-500"
                  />
                )}
              </div>
              {laptopModels.length > 0 ? (
                <div className="flex flex-wrap gap-1.5 max-h-32 overflow-y-auto pr-1">
                  {filteredModels.map((model, idx) => (
                    <span
                      key={idx}
                      className="bg-white border border-slate-200 text-slate-800 text-[10px] font-semibold px-2 py-0.5 rounded shadow-2xs"
                    >
                      {model}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-[11px] text-slate-500 italic">Universal standard panel interface.</p>
              )}
            </div>

            {/* Part Numbers Section */}
            {partNumbers.length > 0 && (
              <div className="bg-purple-50/50 border border-purple-200 rounded-[3px] p-3 space-y-1.5">
                <div className="font-bold text-xs text-purple-950 flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-purple-700 shrink-0" />
                  <span>Compatible Part Numbers ({partNumbers.length})</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {partNumbers.map((part, idx) => (
                    <span
                      key={idx}
                      className="bg-white border border-purple-200 text-purple-900 text-[10px] font-bold px-2 py-0.5 rounded"
                    >
                      {part}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Product Description if present */}
            {product.description && (
              <div className="pt-2 border-t border-slate-100">
                <h4 className="text-xs font-bold text-slate-800 mb-1">Product Description</h4>
                <p className="text-xs text-slate-600 leading-relaxed whitespace-pre-line">
                  {product.description}
                </p>
              </div>
            )}
          </div>

          {/* Column C: Purchase Card (Box-shaped marketplace design) */}
          <div className="bg-white rounded-[3px] border border-slate-200/90 shadow-sm p-4 space-y-3.5 sticky top-24">
            <div>
              <span className="text-2xl font-black text-slate-900 block">
                LKR {product.selling_price.toLocaleString()}
              </span>
              <span className="text-[10px] text-slate-400 font-semibold">
                (Inclusive of VAT)
              </span>
            </div>

            <div className="pt-2.5 border-t border-slate-100">
              <span className="text-xs font-bold text-slate-500 block">Stock Status</span>
              <span className="text-xs font-black text-emerald-600">In Stock (25+ Available)</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-600">Quantity</span>
              <div className="flex items-center border border-slate-300 rounded-[3px] bg-white">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-2.5 py-1 font-bold text-slate-700 hover:bg-slate-100 text-sm cursor-pointer"
                >
                  &minus;
                </button>
                <span className="px-2.5 py-1 font-black text-xs text-slate-900">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-2.5 py-1 font-bold text-slate-700 hover:bg-slate-100 text-sm cursor-pointer"
                >
                  +
                </button>
              </div>
            </div>

            <button
              onClick={handleAddToCart}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 rounded-[3px] shadow-xs text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>{added ? 'Added to Order!' : 'Add to Order'}</span>
            </button>

            <Link
              href="/checkout?payment=koko"
              className="w-full bg-slate-50 hover:bg-slate-100 border border-slate-300 text-slate-800 font-bold py-2.5 rounded-[3px] text-xs flex items-center justify-center gap-1.5 transition-colors"
            >
              <span>Buy Now with</span>
              <span className="font-black italic text-purple-700 tracking-tighter">KOKO</span>
              <span>Pay</span>
            </Link>

            <div className="relative flex items-center justify-center">
              <div className="border-t border-slate-200 w-full" />
              <span className="bg-white px-2 text-[10px] font-semibold text-slate-400 shrink-0">or</span>
            </div>

            <a
              href={getWhatsAppUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="block p-3 rounded-[3px] bg-emerald-50 border border-emerald-200 hover:bg-emerald-100/80 transition-colors group"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-[2px] bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                  <MessageCircle className="w-4 h-4 fill-white" />
                </div>
                <div>
                  <div className="text-xs font-bold text-emerald-900">Order on WhatsApp</div>
                  <div className="text-[10px] text-emerald-700 font-medium">Get fast reply &amp; place your order</div>
                </div>
              </div>
            </a>

            <div className="p-3 rounded-[3px] border border-slate-200 bg-slate-50 space-y-2">
              <div>
                <div className="text-xs font-bold text-slate-900">Wholesale / Bulk Order</div>
                <div className="text-[10px] text-slate-500 font-medium">Special pricing for technicians &amp; repair centers.</div>
              </div>
              <a
                href={getWholesaleUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full bg-white border border-slate-300 hover:border-slate-400 text-slate-800 font-bold py-2 rounded-[3px] text-xs flex items-center justify-center gap-1.5 transition-colors"
              >
                <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
                <span>Contact on WhatsApp</span>
              </a>
            </div>
          </div>

        </div>

        {/* ================================ */}
        {/* MOBILE / TABLET LAYOUT (below lg) */}
        {/* ================================ */}
        <div className="lg:hidden bg-white rounded-[3px] p-3.5 sm:p-6 border border-slate-200 shadow-2xs space-y-5">

          {/* Main Gallery Container */}
          <div className="space-y-2.5">
            <div className="relative w-full aspect-4/3 sm:aspect-16/9 rounded-[3px] bg-white border border-slate-200/90 p-4 flex items-center justify-center overflow-hidden">
              
              {/* In Stock Badge */}
              <span className="absolute top-2.5 left-2.5 bg-emerald-50 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-200 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                In Stock
              </span>

              {/* Wishlist Heart */}
              <button className="absolute top-2.5 right-2.5 p-1.5 text-slate-400 hover:text-rose-500 transition-colors cursor-pointer">
                <Heart className="w-5 h-5" />
              </button>

              {/* Product Image */}
              <img
                src={selectedImage}
                alt={product.name}
                className="w-full h-full object-contain"
              />

              {/* Gallery Counter */}
              <span className="absolute bottom-2.5 right-2.5 bg-slate-900/70 backdrop-blur-md text-white text-[10px] font-bold px-2 py-0.5 rounded-[2px]">
                1 / {thumbnails.length}
              </span>
            </div>

            {/* Thumbnails Row */}
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
              {thumbnails.map((thumb, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(thumb)}
                  className={`w-14 h-14 sm:w-16 sm:h-16 rounded-[3px] border-2 overflow-hidden bg-slate-50 p-1 shrink-0 transition-all ${
                    selectedImage === thumb ? 'border-blue-600 shadow-xs' : 'border-slate-200'
                  }`}
                >
                  <img src={thumb} alt="" className="w-full h-full object-contain" />
                </button>
              ))}
            </div>
          </div>

          {/* Product Header & Rating */}
          <div className="space-y-1.5 border-b border-slate-100 pb-3.5">
            <span className="inline-flex items-center gap-1 bg-blue-50 text-blue-800 text-[10px] font-bold px-2 py-0.5 rounded-[2px] border border-blue-200">
              <Zap className="w-3 h-3 fill-blue-600 text-blue-600" />
              Top Selling
            </span>

            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              {product.name}
            </h1>

            <p className="text-xs font-semibold text-slate-500">
              {product.display_size} FHD • {product.resolution} • {product.pin_type} • {product.touch_type || 'Non-Touch'} • {product.display_type || 'IPS'}
            </p>

            {/* Rating Stars */}
            <div className="flex items-center gap-1.5 pt-0.5 text-xs font-bold text-slate-700">
              <div className="flex items-center text-amber-400">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star key={s} className="w-3.5 h-3.5 fill-amber-400 stroke-amber-400" />
                ))}
              </div>
              <span className="text-slate-900">4.8</span>
              <span className="text-slate-400 font-medium">(56 Reviews)</span>
            </div>
          </div>

          {/* Specifications Table */}
          <div className="space-y-3">
            <div className="divide-y divide-slate-100 text-xs font-medium">
              <div className="py-2 flex items-center justify-between">
                <span className="text-slate-500 font-semibold flex items-center gap-2">
                  <Monitor className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  Panel Size
                </span>
                <span className="font-bold text-slate-900">{displaySize} Inch</span>
              </div>
              <div className="py-2 flex items-center justify-between">
                <span className="text-slate-500 font-semibold flex items-center gap-2">
                  <Laptop className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  Brand
                </span>
                <span className="font-bold text-slate-900">{brandName}</span>
              </div>
              <div className="py-2 flex items-center justify-between">
                <span className="text-slate-500 font-semibold flex items-center gap-2">
                  <Layers className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  Product Type
                </span>
                <span className="font-bold text-slate-900">{productTypeName}</span>
              </div>
              <div className="py-2 flex items-center justify-between">
                <span className="text-slate-500 font-semibold flex items-center gap-2">
                  <ImageIcon className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  Resolution
                </span>
                <span className="font-bold text-slate-900">{product.resolution || 'FHD 1920x1080'}</span>
              </div>
              <div className="py-2 flex items-center justify-between">
                <span className="text-slate-500 font-semibold flex items-center gap-2">
                  <Plug className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  Connector
                </span>
                <span className="font-bold text-slate-900">{product.pin_type || '30-Pin'}</span>
              </div>
              <div className="py-2 flex items-center justify-between">
                <span className="text-slate-500 font-semibold flex items-center gap-2">
                  <Layers className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  Panel Type
                </span>
                <span className="font-bold text-slate-900">{product.display_type || 'IPS'}</span>
              </div>
              <div className="py-2 flex items-center justify-between">
                <span className="text-slate-500 font-semibold flex items-center gap-2">
                  <Hand className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  Touch
                </span>
                <span className="font-bold text-slate-900">{product.touch_type || 'Non-Touch'}</span>
              </div>
              <div className="py-2 flex items-center justify-between">
                <span className="text-slate-500 font-semibold flex items-center gap-2">
                  <RefreshCw className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  Refresh Rate
                </span>
                <span className="font-bold text-slate-900">{product.refresh_rate || '60Hz'}</span>
              </div>
              <div className="py-2 flex items-center justify-between">
                <span className="text-slate-500 font-semibold flex items-center gap-2">
                  <Award className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  Warranty
                </span>
                <span className="font-bold text-slate-900">{product.warranty || '3 Months'}</span>
              </div>
            </div>

            {/* Mobile Laptop Models Box */}
            <div className="bg-slate-50 border border-slate-200 rounded-[3px] p-3 space-y-2">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-1.5 font-bold text-xs text-slate-900">
                  <Laptop className="w-4 h-4 text-blue-600 shrink-0" />
                  <span>Compatible Models ({laptopModels.length})</span>
                </div>
                {laptopModels.length > 4 && (
                  <input
                    type="text"
                    placeholder="Search..."
                    value={modelSearch}
                    onChange={(e) => setModelSearch(e.target.value)}
                    className="text-[10px] px-1.5 py-0.5 border border-slate-300 rounded bg-white w-24 focus:outline-blue-500"
                  />
                )}
              </div>
              {laptopModels.length > 0 ? (
                <div className="flex flex-wrap gap-1 max-h-28 overflow-y-auto pr-1">
                  {filteredModels.map((model, idx) => (
                    <span
                      key={idx}
                      className="bg-white border border-slate-200 text-slate-800 text-[10px] font-medium px-1.5 py-0.5 rounded shadow-2xs"
                    >
                      {model}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-[10px] text-slate-500 italic">Universal standard display panel.</p>
              )}
            </div>

            {/* Mobile Part Numbers Box */}
            {partNumbers.length > 0 && (
              <div className="bg-purple-50/50 border border-purple-200 rounded-[3px] p-2.5 space-y-1.5">
                <div className="font-bold text-xs text-purple-950 flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-purple-700 shrink-0" />
                  <span>Part Numbers ({partNumbers.length})</span>
                </div>
                <div className="flex flex-wrap gap-1">
                  {partNumbers.map((part, idx) => (
                    <span
                      key={idx}
                      className="bg-white border border-purple-200 text-purple-900 text-[10px] font-bold px-1.5 py-0.5 rounded"
                    >
                      {part}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Product Description */}
            {product.description && (
              <div className="pt-2 border-t border-slate-100">
                <h4 className="text-xs font-bold text-slate-800 mb-1">Description</h4>
                <p className="text-[11px] text-slate-600 leading-relaxed whitespace-pre-line">
                  {product.description}
                </p>
              </div>
            )}
          </div>

          {/* Pricing & Quantity Box */}
          <div className="bg-slate-50 p-3.5 sm:p-4 rounded-[3px] border border-slate-200 flex items-center justify-between">
            <div>
              <span className="text-xl sm:text-2xl font-black text-slate-900 block">
                LKR {product.selling_price.toLocaleString()}
              </span>
              <span className="text-[10px] text-slate-400 font-semibold">
                (Inclusive of VAT)
              </span>
            </div>

            {/* Quantity Selector */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-600">Quantity</span>
              <div className="flex items-center border border-slate-300 rounded-[3px] bg-white">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-2.5 py-1 font-bold text-slate-700 hover:bg-slate-100 text-sm cursor-pointer"
                >
                  −
                </button>
                <span className="px-2.5 py-1 font-black text-xs text-slate-900">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-2.5 py-1 font-bold text-slate-700 hover:bg-slate-100 text-sm cursor-pointer"
                >
                  +
                </button>
              </div>
            </div>
          </div>

          {/* Dual Column Action Buttons */}
          <div className="grid grid-cols-2 gap-2.5 pt-1">
            {/* Left Column: Add to Cart */}
            <div className="space-y-1.5">
              <button
                onClick={handleAddToCart}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 px-2.5 rounded-[3px] shadow-xs text-xs flex items-center justify-center gap-1.5 active:bg-blue-800 transition-colors cursor-pointer"
              >
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>{added ? 'Added!' : 'Add to Cart'}</span>
              </button>
              <Link
                href="/checkout?payment=koko"
                className="w-full bg-white border border-slate-300 hover:bg-slate-50 text-slate-800 font-bold py-2.5 px-2 rounded-[3px] text-xs flex items-center justify-center gap-1 transition-colors text-center"
              >
                <span className="font-black italic text-purple-700 tracking-tighter text-xs">KOKO</span>
                <span className="text-[10px] font-bold">Pay</span>
              </Link>
            </div>

            {/* Right Column: Order / Inquiry */}
            <div className="space-y-1.5">
              <a
                href={getWhatsAppUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full bg-[#22c55e] hover:bg-[#16a34a] text-white font-bold py-2.5 px-2.5 rounded-[3px] shadow-xs text-xs flex items-center justify-center gap-1.5 transition-colors"
              >
                <MessageCircle className="w-3.5 h-3.5 fill-white" />
                <span className="truncate">WhatsApp Order</span>
              </a>
              <a
                href={getWholesaleUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full bg-white border border-slate-300 hover:bg-slate-50 text-slate-800 font-bold py-2.5 px-2 rounded-[3px] text-xs flex items-center justify-center gap-1 transition-colors text-center"
              >
                <MessageCircle className="w-3 h-3 text-emerald-600" />
                <span className="truncate">Wholesale</span>
              </a>
            </div>
          </div>

          {/* Trust Features Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-3.5 border-t border-slate-100">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 shrink-0" />
              <div>
                <div className="text-[10px] font-bold text-slate-900">100% Genuine</div>
                <div className="text-[9px] text-slate-500 font-medium">Original Panels</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Truck className="w-3.5 h-3.5 text-blue-600 shrink-0" />
              <div>
                <div className="text-[10px] font-bold text-slate-900">Islandwide Delivery</div>
                <div className="text-[9px] text-slate-500 font-medium">Fast &amp; Safe</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Lock className="w-3.5 h-3.5 text-blue-600 shrink-0" />
              <div>
                <div className="text-[10px] font-bold text-slate-900">Secure Payments</div>
                <div className="text-[9px] text-slate-500 font-medium">100% Protected</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-3.5 h-3.5 text-blue-600 shrink-0" />
              <div>
                <div className="text-[10px] font-bold text-slate-900">Warranty</div>
                <div className="text-[9px] text-slate-500 font-medium">3–12 Months</div>
              </div>
            </div>
          </div>

        </div>

        {/* Similar Displays You May Like */}
        <div className="pt-4 space-y-3.5">
          <div className="flex items-center justify-between">
            <h2 className="text-sm sm:text-base font-black text-slate-900 uppercase tracking-wider">
              Similar Displays You May Like
            </h2>
            <Link href="/shop" className="text-xs font-bold text-blue-600 hover:underline flex items-center gap-1">
              <span>View All</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <ProductCarousel products={MOCK_PRODUCTS.filter((p) => p.slug !== product.slug)} />
        </div>

        {/* Bottom Trust Band (Box-shaped marketplace strip) */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 bg-white border border-slate-200/90 rounded-[3px] p-4 shadow-2xs">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-blue-600 shrink-0" />
            <div>
              <div className="text-xs font-bold text-slate-900">100% Genuine Panels</div>
              <div className="text-[10px] text-slate-500 font-medium">Original &amp; Authentic Products</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Truck className="w-4 h-4 text-blue-600 shrink-0" />
            <div>
              <div className="text-xs font-bold text-slate-900">Fast &amp; Safe Delivery</div>
              <div className="text-[10px] text-slate-500 font-medium">Islandwide Delivery</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Lock className="w-4 h-4 text-blue-600 shrink-0" />
            <div>
              <div className="text-xs font-bold text-slate-900">Secure Payments</div>
              <div className="text-[10px] text-slate-500 font-medium">100% Protected</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <RotateCcw className="w-4 h-4 text-blue-600 shrink-0" />
            <div>
              <div className="text-xs font-bold text-slate-900">7 Day Easy Returns</div>
              <div className="text-[10px] text-slate-500 font-medium">Hassle Free Returns</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Headset className="w-4 h-4 text-blue-600 shrink-0" />
            <div>
              <div className="text-xs font-bold text-slate-900">Expert Support</div>
              <div className="text-[10px] text-slate-500 font-medium">We&apos;re Here to Help</div>
            </div>
          </div>
        </div>

      </main>

      <Footer />
      <StickyMobileActionBar />
      <FixedMobileBottomNav />
    </div>
  );
}
