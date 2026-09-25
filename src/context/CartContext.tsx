'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { CartItem, Product, ProductVariation } from '@/types';
import { MOCK_PRODUCTS } from '@/lib/api';

interface CartContextType {
  cart: CartItem[];
  addToCart: (product: Product, variation?: ProductVariation, quantity?: number) => void;
  removeFromCart: (productId: number, variationId?: number) => void;
  updateQuantity: (productId: number, quantity: number, variationId?: number) => void;
  clearCart: () => void;
  totalItems: number;
  subtotal: number;
  grandTotal: number;
  generateWhatsAppLink: (customerInfo?: { name?: string; phone?: string }) => string;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  // Pre-seed cart with 3 items matching the exact reference mockup badge count (3 items = LKR 78,000)
  const [cart, setCart] = useState<CartItem[]>([
    { product: MOCK_PRODUCTS[0], quantity: 1, unit_price: 15500 }, // B156XW04 V.8 (15,500)
    { product: MOCK_PRODUCTS[1], quantity: 1, unit_price: 28500 }, // N156HCE-GN1 (28,500)
    { product: MOCK_PRODUCTS[2], quantity: 1, unit_price: 34000 }, // LP156WF9-SPK1 (34,000) -> Sum = 78,000!
  ]);

  useEffect(() => {
    const saved = localStorage.getItem('panelook_cart');
    if (saved) {
      try {
        setCart(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to parse saved cart', e);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('panelook_cart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = (product: Product, variation?: ProductVariation, quantity = 1) => {
    setCart((prev) => {
      const existingIndex = prev.findIndex(
        (item) => item.product.id === product.id && item.variation?.id === variation?.id
      );

      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex].quantity += quantity;
        return updated;
      }

      return [
        ...prev,
        {
          product,
          variation,
          quantity,
          unit_price: variation ? variation.price : product.selling_price,
        },
      ];
    });
  };

  const removeFromCart = (productId: number, variationId?: number) => {
    setCart((prev) =>
      prev.filter(
        (item) => !(item.product.id === productId && (!variationId || item.variation?.id === variationId))
      )
    );
  };

  const updateQuantity = (productId: number, quantity: number, variationId?: number) => {
    if (quantity <= 0) {
      removeFromCart(productId, variationId);
      return;
    }
    setCart((prev) =>
      prev.map((item) => {
        if (item.product.id === productId && (!variationId || item.variation?.id === variationId)) {
          return { ...item, quantity };
        }
        return item;
      })
    );
  };

  const clearCart = () => setCart([]);

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = cart.reduce((sum, item) => sum + item.unit_price * item.quantity, 0);
  const grandTotal = subtotal + (cart.length > 0 ? 650 : 0);

  const generateWhatsAppLink = (customerInfo?: { name?: string; phone?: string }) => {
    let msg = `*NEW ORDER — PANELOOK.LK*\n\n`;
    if (cart.length === 0) {
      msg += `Hello! I would like to inquire about laptop display stock availability.`;
    } else {
      msg += `I would like to place an order for the following items:\n\n`;
      cart.forEach((item, index) => {
        msg += `*${index + 1}. ${item.product.name}*\n`;
        msg += `Panel #: ${item.product.panel_number}\n`;
        msg += `Size: ${item.product.display_size} | Pin: ${item.product.pin_type} | ${item.product.display_type}\n`;
        msg += `Qty: ${item.quantity} x LKR ${item.unit_price.toLocaleString()}\n\n`;
      });
      msg += `*Subtotal:* LKR ${subtotal.toLocaleString()}\n`;
      msg += `*Islandwide Delivery:* LKR 650\n`;
      msg += `*Total Amount:* LKR ${grandTotal.toLocaleString()}\n\n`;
      if (customerInfo?.name) msg += `Name: ${customerInfo.name}\n`;
      if (customerInfo?.phone) msg += `Phone: ${customerInfo.phone}\n`;
    }

    return `https://wa.me/94766025870?text=${encodeURIComponent(msg)}`;
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalItems,
        subtotal,
        grandTotal,
        generateWhatsAppLink,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
