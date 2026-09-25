'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Heart,
  ShoppingCart,
  Star,
  Check,
} from 'lucide-react';
import { Product } from '@/types';
import { useCart } from '@/context/CartContext';
import { getBrandInfo } from '@/lib/brand';
import { useRouter } from 'next/navigation';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();
  const router = useRouter();
  const [liked, setLiked] = useState(false);
  const [added, setAdded] = useState(false);

  const isLowStock = product.stock_quantity <= 3 && product.stock_quantity > 0;
  const isOutOfStock = product.stock_quantity === 0;
  const brandName = product.brand?.name || getBrandInfo(product.laptop_model).name || 'Universal Display';
  const displaySize = product.display_size || product.screen_size || '';
  const discountPct =
    product.original_price && product.original_price > product.selling_price
      ? Math.round(((product.original_price - product.selling_price) / product.original_price) * 100)
      : null;

  // Genuine LCD panel image fallback
  const displayImage = product.main_image || product.images_relation?.[0]?.image_url || '/images/products/panel-b156xw04.png';

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    addToCart(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <div className="bg-white rounded-[3px] border border-slate-200/90 hover:border-slate-400 hover:shadow-sm transition-all flex flex-col group relative overflow-hidden h-full w-full">

      {/* Top Status Row: In Stock pill on left, Wishlist on right */}
      <div className="flex items-center justify-between gap-1 px-2.5 pt-2.5 z-10">
        <div className="flex items-center gap-1.5">
          {isOutOfStock ? (
            <span className="bg-rose-50 text-rose-700 text-[10px] font-bold px-2 py-0.5 rounded-full border border-rose-200">
              Out of Stock
            </span>
          ) : isLowStock ? (
            <span className="bg-amber-50 text-amber-800 text-[10px] font-bold px-2 py-0.5 rounded-full border border-amber-200">
              Low Stock
            </span>
          ) : (
            <span className="bg-emerald-50 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-200 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              In Stock
            </span>
          )}
        </div>

        <button
          onClick={(e) => { e.preventDefault(); setLiked(!liked); }}
          className="p-1 text-slate-400 hover:text-rose-500 transition-colors shrink-0 cursor-pointer"
          aria-label="Wishlist"
        >
          <Heart className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${liked ? 'fill-rose-500 text-rose-500' : ''}`} />
        </button>
      </div>

      {/* Product Image: Clean white background, 55-65% height, object-contain */}
      <Link href={`/product/${product.slug}`} className="block relative px-2.5 pt-1.5">
        <div className="relative w-full aspect-4/3 bg-white flex items-center justify-center p-2 group-hover:scale-[1.03] transition-transform duration-200">
          <img
            src={displayImage}
            alt={product.name}
            className="w-full h-full object-contain"
            loading="lazy"
          />
        </div>
      </Link>

      {/* Product Info */}
      <div className="px-2.5 pb-2.5 pt-1 flex flex-col flex-1">

        {/* Brand Tag */}
        <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-0.5">
          {brandName}
        </div>

        {/* Title */}
        <Link href={`/product/${product.slug}`}>
          <h3 className="text-xs sm:text-sm font-bold text-slate-900 leading-snug line-clamp-2 group-hover:text-blue-600 transition-colors">
            {product.name}
          </h3>
        </Link>

        {/* Specifications: 2 Clean Lines */}
        <div className="text-[11px] text-slate-500 font-medium mt-1 leading-tight space-y-0.5">
          <p className="line-clamp-1">
            {displaySize} {product.resolution?.includes('1920') ? 'FHD' : (product.resolution || '')} {product.pin_type ? `• ${product.pin_type}` : ''}
          </p>
          <p className="line-clamp-1 text-slate-400">
            {product.touch_type || 'Non-Touch'} • {product.display_type || 'IPS'} • Bottom-Right Connector
          </p>
        </div>

        {/* Star Rating */}
        <div className="flex items-center gap-1 mt-1.5">
          <div className="flex items-center text-amber-400">
            <Star className="w-3 h-3 fill-amber-400" />
            <Star className="w-3 h-3 fill-amber-400" />
            <Star className="w-3 h-3 fill-amber-400" />
            <Star className="w-3 h-3 fill-amber-400" />
            <Star className="w-3 h-3 fill-amber-400" />
          </div>
          <span className="text-[10px] font-bold text-slate-700">4.8</span>
          <span className="text-[10px] text-slate-400">(56)</span>
        </div>

        {/* Price Row */}
        <div className="flex items-baseline gap-1.5 mt-2">
          <span className="text-sm sm:text-base font-black text-slate-900">
            LKR {product.selling_price.toLocaleString()}
          </span>
          {discountPct && (
            <span className="text-[10px] font-semibold text-slate-400 line-through">
              LKR {product.original_price!.toLocaleString()}
            </span>
          )}
        </div>

        {/* KOKO Pay Badge */}
        <div className="mt-1">
          <span className="inline-block bg-slate-100 text-slate-600 text-[9px] font-bold px-1.5 py-0.5 rounded-[2px]">
            KOKO Pay Available
          </span>
        </div>

        {/* Rectangular Add to Cart Button (Box-shaped: rounded-[3px]) */}
        <div className="mt-2.5 pt-1">
          <button
            onClick={handleAddToCart}
            disabled={isOutOfStock}
            className={`w-full py-1.5 sm:py-2 rounded-[3px] text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
              added
                ? 'bg-emerald-600 text-white'
                : isOutOfStock
                ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700 text-white active:bg-blue-800'
            }`}
          >
            {added ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>Added</span>
              </>
            ) : (
              <>
                <ShoppingCart className="w-3.5 h-3.5" />
                <span>Add to Cart</span>
              </>
            )}
          </button>
        </div>

      </div>
    </div>
  );
}
