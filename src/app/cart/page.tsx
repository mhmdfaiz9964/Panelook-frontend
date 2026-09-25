'use client';

import React from 'react';
import Link from 'next/link';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { useCart } from '@/context/CartContext';
import { ShoppingBag, Trash2, ArrowRight, MessageCircle } from 'lucide-react';

export default function CartPage() {
  const { cart, removeFromCart, updateQuantity, clearCart, subtotal, grandTotal, generateWhatsAppLink } = useCart();

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 flex-1 w-full">
        
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mb-6">
          Your Order Cart
        </h1>

        {cart.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 shadow-2xs max-w-lg mx-auto">
            <ShoppingBag className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <h2 className="text-xl font-black text-slate-800">Your cart is currently empty</h2>
            <p className="text-xs text-slate-500 mt-1 mb-6">Explore our genuine display stock and add items to your cart.</p>
            <Link
              href="/shop"
              className="bg-blue-600 text-white font-bold px-6 py-3 rounded-2xl shadow-md text-sm hover:bg-blue-700 transition-colors"
            >
              Browse Shop
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Left Items Table */}
            <div className="lg:col-span-8 space-y-4">
              <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-2xs">
                
                <div className="p-4 sm:p-6 border-b border-slate-100 flex items-center justify-between">
                  <span className="text-sm font-black text-slate-900">Items ({cart.length})</span>
                  <button
                    onClick={clearCart}
                    className="text-xs font-bold text-rose-600 hover:underline"
                  >
                    Clear All
                  </button>
                </div>

                <div className="divide-y divide-slate-100">
                  {cart.map((item, idx) => (
                    <div key={idx} className="p-4 sm:p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                      
                      <div className="flex items-center gap-4 w-full sm:w-auto">
                        <img
                          src={item.product.main_image}
                          alt={item.product.name}
                          className="w-16 h-16 rounded-xl object-contain bg-slate-50 border border-slate-200 p-1 shrink-0"
                        />
                        <div>
                          <h3 className="text-sm font-black text-slate-900 line-clamp-1">{item.product.name}</h3>
                          <p className="text-xs font-medium text-slate-500">
                            {item.product.display_size} | {item.product.pin_type} | Panel: {item.product.panel_number}
                          </p>
                          <span className="text-xs font-black text-blue-600 mt-1 block">
                            LKR {item.unit_price.toLocaleString()}
                          </span>
                        </div>
                      </div>

                      {/* Quantity & Actions */}
                      <div className="flex items-center justify-between w-full sm:w-auto gap-4">
                        <div className="flex items-center border border-slate-300 rounded-xl bg-slate-50">
                          <button
                            onClick={() => updateQuantity(item.product.id, item.quantity - 1, item.variation?.id)}
                            className="px-3 py-1 font-bold text-slate-700 hover:bg-slate-200 rounded-l-xl"
                          >
                            -
                          </button>
                          <span className="px-3 py-1 font-black text-xs text-slate-900">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.product.id, item.quantity + 1, item.variation?.id)}
                            className="px-3 py-1 font-bold text-slate-700 hover:bg-slate-200 rounded-r-xl"
                          >
                            +
                          </button>
                        </div>

                        <span className="text-sm font-black text-slate-900 w-24 text-right">
                          LKR {(item.unit_price * item.quantity).toLocaleString()}
                        </span>

                        <button
                          onClick={() => removeFromCart(item.product.id, item.variation?.id)}
                          className="p-2 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                    </div>
                  ))}
                </div>

              </div>
            </div>

            {/* Right Summary Sidebar */}
            <div className="lg:col-span-4 space-y-4">
              <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-2xs space-y-4">
                <h2 className="text-base font-black text-slate-900 border-b border-slate-100 pb-3">
                  Order Summary
                </h2>

                <div className="space-y-2 text-xs font-semibold text-slate-600">
                  <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span>LKR {subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Islandwide Delivery:</span>
                    <span>LKR 650</span>
                  </div>
                  <div className="flex justify-between text-slate-900 font-black text-sm pt-2 border-t border-slate-100">
                    <span>Grand Total:</span>
                    <span className="text-blue-600">LKR {grandTotal.toLocaleString()}</span>
                  </div>
                </div>

                <div className="space-y-2 pt-2">
                  <Link
                    href="/checkout"
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 rounded-2xl shadow-md text-xs flex items-center justify-center gap-2"
                  >
                    <span>Proceed to Checkout</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>

                  <a
                    href={generateWhatsAppLink()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3.5 rounded-2xl shadow-md text-xs flex items-center justify-center gap-2"
                  >
                    <MessageCircle className="w-4 h-4 fill-white" />
                    <span>Order via WhatsApp</span>
                  </a>
                </div>
              </div>
            </div>

          </div>
        )}

      </main>

      <Footer />
    </div>
  );
}
