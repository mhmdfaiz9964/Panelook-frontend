'use client';

import React, { useEffect, useState } from 'react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { useCart } from '@/context/CartContext';
import { useCustomerAuth } from '@/context/CustomerAuthContext';
import { LocationSelector, LocationData } from '@/components/checkout/LocationSelector';
import { getApiUrl, getInvoiceUrl, STORE_CONFIG } from '@/lib/config';
import {
  CheckCircle2,
  MessageCircle,
  Download,
  ArrowRight,
  Truck,
  ShieldCheck,
  CreditCard,
  Tag,
  Loader2,
  MapPin,
  AlertCircle,
  Package,
  Check,
  Sparkles,
} from 'lucide-react';
import Link from 'next/link';

export default function CheckoutPage() {
  const { cart, subtotal, clearCart } = useCart();
  const { user, token, isAuthenticated } = useCustomerAuth();

  // Contact Information
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [whatsappPhone, setWhatsappPhone] = useState('');

  // Delivery Address
  const [savedAddresses, setSavedAddresses] = useState<any[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<number | 'new'>('new');
  const [addressLine1, setAddressLine1] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [notes, setNotes] = useState('');

  // Location Hierarchy (Province -> District -> City)
  const [location, setLocation] = useState<LocationData>({
    provinceId: '',
    provinceName: '',
    districtId: '',
    districtName: '',
    cityId: '',
    cityName: '',
    postalCode: '',
  });

  // Shipping Methods
  const [shippingMethods, setShippingMethods] = useState<any[]>([]);
  const [selectedMethodId, setSelectedMethodId] = useState<number | null>(null);
  const [shippingCost, setShippingCost] = useState<number>(650);
  const [shippingLoading, setShippingLoading] = useState(false);

  // Coupons
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<{ code: string; discount: number } | null>(null);
  const [couponLoading, setCouponLoading] = useState(false);
  const [couponError, setCouponError] = useState('');

  // Payment Method
  const [paymentMethod, setPaymentMethod] = useState<'COD' | 'BankTransfer' | 'WhatsApp'>('COD');

  // Submission & Idempotency
  const [idempotencyKey] = useState(() => (typeof crypto !== 'undefined' ? crypto.randomUUID() : `idemp-${Date.now()}`));
  const [loading, setLoading] = useState(false);
  const [orderError, setOrderError] = useState('');
  const [placedOrder, setPlacedOrder] = useState<any>(null);
  const [whatsappUrl, setWhatsappUrl] = useState('');

  // 1. AUTO-GET customer details from auth or local session
  useEffect(() => {
    // If authenticated user exists, prefill automatically
    if (user) {
      if (user.name && !customerName) setCustomerName(user.name);
      if (user.email && !customerEmail) setCustomerEmail(user.email);
      if (user.phone && !customerPhone) setCustomerPhone(user.phone);
      if (user.phone && !whatsappPhone) setWhatsappPhone(user.phone);
      if (user.address && !addressLine1) setAddressLine1(user.address);
    } else {
      // Check local cache for returning visitors
      try {
        const cachedName = localStorage.getItem('panelook_checkout_name');
        const cachedEmail = localStorage.getItem('panelook_checkout_email');
        const cachedPhone = localStorage.getItem('panelook_checkout_phone');
        if (cachedName && !customerName) setCustomerName(cachedName);
        if (cachedEmail && !customerEmail) setCustomerEmail(cachedEmail);
        if (cachedPhone && !customerPhone) setCustomerPhone(cachedPhone);
      } catch {
        // ignore storage errors
      }
    }
  }, [user]);

  // Persist guest inputs so returning customers auto-fill
  const handleNameChange = (val: string) => {
    setCustomerName(val);
    try {
      localStorage.setItem('panelook_checkout_name', val);
    } catch {}
  };

  const handleEmailChange = (val: string) => {
    setCustomerEmail(val);
    try {
      localStorage.setItem('panelook_checkout_email', val);
    } catch {}
  };

  const handlePhoneChange = (val: string) => {
    setCustomerPhone(val);
    try {
      localStorage.setItem('panelook_checkout_phone', val);
    } catch {}
  };

  // 2. Fetch saved customer addresses if logged in
  useEffect(() => {
    if (!token) return;
    (async () => {
      try {
        const res = await fetch(getApiUrl('/customer/addresses'), {
          headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' },
        });
        if (res.ok) {
          const json = await res.json();
          if (json.success && json.data.length > 0) {
            setSavedAddresses(json.data);
            const def = json.data.find((a: any) => a.is_default) || json.data[0];
            setSelectedAddressId(def.id);
            applySavedAddress(def);
          }
        }
      } catch {
        // ignore
      }
    })();
  }, [token]);

  const applySavedAddress = (addr: any) => {
    setAddressLine1(addr.address_line_1 || '');
    setPostalCode(addr.postal_code || '');
    setLocation({
      provinceId: addr.province_id || '',
      provinceName: addr.province?.name || '',
      districtId: addr.district_id || '',
      districtName: addr.district?.name || '',
      cityId: addr.city_id || '',
      cityName: addr.city?.name || '',
      postalCode: addr.postal_code || '',
    });
  };

  // 3. When location district changes, load authoritative shipping methods
  useEffect(() => {
    (async () => {
      setShippingLoading(true);
      try {
        const districtParam = location.districtName ? `?district=${encodeURIComponent(location.districtName)}` : '';
        const res = await fetch(getApiUrl(`/shipping/methods${districtParam}`));
        if (res.ok) {
          const json = await res.json();
          if (json.success && json.data.length > 0) {
            setShippingMethods(json.data);
            const defaultMethod = json.data[0];
            setSelectedMethodId(defaultMethod.id);
            calculateAuthoritativeShipping(defaultMethod.id);
          }
        } else {
          // Fallback shipping methods
          setShippingMethods([
            { id: 1, name: 'Islandwide Safe Courier', price: 650, estimated_days: '2-3 Days', description: 'Shockproof packing' },
            { id: 2, name: 'Express Same-Day Delivery (Colombo District)', price: 950, estimated_days: '1 Day', description: 'Priority dispatch' },
          ]);
          setSelectedMethodId(1);
          setShippingCost(650);
        }
      } catch {
        setShippingMethods([
          { id: 1, name: 'Islandwide Safe Courier', price: 650, estimated_days: '2-3 Days', description: 'Shockproof packing' },
        ]);
        setSelectedMethodId(1);
        setShippingCost(650);
      } finally {
        setShippingLoading(false);
      }
    })();
  }, [location.districtName]);

  // 4. Calculate authoritative shipping from backend
  const calculateAuthoritativeShipping = async (methodId: number) => {
    try {
      const res = await fetch(getApiUrl('/shipping/calculate'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          shipping_method_id: methodId,
          district: location.districtName,
          city: location.cityName,
          subtotal: subtotal,
        }),
      });
      if (res.ok) {
        const json = await res.json();
        if (json.success && typeof json.data.shipping_cost === 'number') {
          setShippingCost(json.data.shipping_cost);
        }
      }
    } catch {
      // ignore
    }
  };

  const handleMethodSelect = (methodId: number) => {
    setSelectedMethodId(methodId);
    const m = shippingMethods.find((item) => item.id === methodId);
    if (m) setShippingCost(Number(m.price));
    calculateAuthoritativeShipping(methodId);
  };

  // 5. Handle Coupon Apply
  const handleApplyCoupon = async (e?: React.FormEvent | React.MouseEvent | React.KeyboardEvent) => {
    if (e && 'preventDefault' in e) e.preventDefault();
    if (!couponCode.trim()) return;
    setCouponLoading(true);
    setCouponError('');
    try {
      const res = await fetch(getApiUrl('/checkout/validate-coupon'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ code: couponCode.trim(), subtotal }),
      });
      const json = await res.json();
      setCouponLoading(false);
      if (res.ok && json.success) {
        setAppliedCoupon({
          code: couponCode.trim().toUpperCase(),
          discount: json.data.discount_amount || 500,
        });
        setCouponCode('');
      } else {
        setCouponError(json.message || 'Invalid or expired discount code.');
      }
    } catch {
      setCouponLoading(false);
      setCouponError('Error validating coupon. Please try again.');
    }
  };

  const discountAmount = appliedCoupon ? appliedCoupon.discount : 0;
  const grandTotal = Math.max(0, subtotal + shippingCost - discountAmount);

  // 6. Handle Place Order
  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setOrderError('');

    if (!customerName || !customerEmail || !customerPhone) {
      setOrderError('Please enter your full name, email, and mobile phone number.');
      return;
    }
    if (!location.provinceName || !location.districtName || !location.cityName) {
      setOrderError('Please select your Province, District, and City.');
      return;
    }
    if (!addressLine1) {
      setOrderError('Please enter your complete street / delivery address.');
      return;
    }
    if (cart.length === 0) {
      setOrderError('Your cart is empty.');
      return;
    }

    setLoading(true);

    const orderPayload = {
      idempotency_key: idempotencyKey,
      customer_name: customerName,
      customer_email: customerEmail,
      customer_phone: customerPhone,
      whatsapp_phone: whatsappPhone || customerPhone,
      shipping_address: addressLine1,
      postal_code: postalCode || location.postalCode || '00000',
      province_id: location.provinceId || null,
      province: location.provinceName,
      district_id: location.districtId || null,
      district: location.districtName,
      city_id: location.cityId || null,
      city: location.cityName,
      shipping_method_id: selectedMethodId,
      payment_method: paymentMethod,
      notes: notes,
      coupon_code: appliedCoupon ? appliedCoupon.code : null,
      items: cart.map((item) => ({
        product_id: item.product.id,
        variation_id: item.variation?.id,
        quantity: item.quantity,
      })),
    };

    try {
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      };
      if (token) headers['Authorization'] = `Bearer ${token}`;

      const res = await fetch(getApiUrl('/checkout'), {
        method: 'POST',
        headers,
        body: JSON.stringify(orderPayload),
      });

      const json = await res.json();
      setLoading(false);

      if (res.ok && json.success) {
        setPlacedOrder(json.data.order);
        setWhatsappUrl(json.data.whatsapp_url || '');
        clearCart();
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        setOrderError(json.message || 'Order checkout failed. Please check the provided information.');
      }
    } catch {
      setLoading(false);
      setOrderError('Network error submitting order. Please retry.');
    }
  };

  // Shared "No-border input with just 2px bottom border" styling
  const inputClass =
    'w-full px-3.5 py-3 bg-slate-50/70 hover:bg-slate-100/70 focus:bg-white border-0 border-b-2 border-slate-300 focus:border-b-2 focus:border-blue-600 rounded-t-[3px] font-bold text-slate-900 placeholder:text-slate-400 placeholder:font-normal focus:outline-none transition-all duration-150 text-sm';
  const labelClass = 'block text-xs font-black uppercase tracking-wider text-slate-700 mb-1.5';

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <Header />

      <main className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 flex-1 w-full">
        {placedOrder ? (
          /* ==================================================== */
          /* ORDER CONFIRMATION SCREEN (Box-Shaped)               */
          /* ==================================================== */
          <div className="bg-white rounded-[4px] p-6 sm:p-10 border border-slate-200 shadow-sm text-center space-y-6 max-w-2xl mx-auto">
            <div className="w-14 h-14 rounded-[4px] bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-xs">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div>
              <span className="bg-emerald-50 text-emerald-800 text-[10px] font-black px-3 py-1 rounded-[2px] border border-emerald-200 uppercase tracking-wider">
                Order Confirmed
              </span>
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight mt-3">
                Order #{placedOrder.order_number}
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1">
                Thank you, {placedOrder.customer_name}! Your laptop display order has been safely placed.
              </p>
            </div>

            {/* Summary Box */}
            <div className="bg-slate-50 p-4 sm:p-5 rounded-[4px] border border-slate-200 text-left text-xs font-semibold text-slate-700 space-y-2.5">
              <div className="flex justify-between">
                <span className="text-slate-500">Contact Mobile:</span>
                <span className="font-bold text-slate-900">{placedOrder.customer_phone}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Delivery Address:</span>
                <span className="font-bold text-slate-900 text-right">
                  {placedOrder.shipping_address}, {placedOrder.city}, {placedOrder.district}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Payment Option:</span>
                <span className="font-bold text-slate-900">
                  {placedOrder.payment_method === 'COD' ? 'Cash on Delivery (COD)' : placedOrder.payment_method}
                </span>
              </div>
              <div className="flex justify-between border-t border-slate-200 pt-2 font-black text-sm text-slate-900">
                <span>Grand Total:</span>
                <span className="text-blue-600">LKR {Number(placedOrder.grand_total).toLocaleString()}</span>
              </div>
            </div>

            {/* CTAs */}
            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              {whatsappUrl && (
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold px-5 py-3 rounded-[3px] shadow-sm text-xs flex items-center gap-2 cursor-pointer transition"
                >
                  <MessageCircle className="w-4 h-4 fill-white" />
                  <span>Confirm on WhatsApp</span>
                </a>
              )}

              <a
                href={getInvoiceUrl(placedOrder.id)}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-5 py-3 rounded-[3px] shadow-sm text-xs flex items-center gap-2 cursor-pointer transition"
              >
                <Download className="w-4 h-4" />
                <span>Download Invoice PDF</span>
              </a>

              <Link
                href="/shop"
                className="bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold px-5 py-3 rounded-[3px] text-xs transition"
              >
                Return to Shop
              </Link>
            </div>
          </div>
        ) : cart.length === 0 ? (
          /* EMPTY CART SCREEN */
          <div className="bg-white rounded-[4px] p-10 text-center space-y-4 max-w-md mx-auto border border-slate-200 shadow-xs">
            <Package className="w-12 h-12 text-slate-300 mx-auto" />
            <h2 className="text-lg font-black text-slate-900">Your Cart is Empty</h2>
            <p className="text-xs text-slate-500">
              Please select compatible laptop replacement displays before proceeding to checkout.
            </p>
            <Link
              href="/shop"
              className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold px-5 py-2.5 rounded-[3px] text-xs shadow-xs transition"
            >
              Browse Laptop Displays &rarr;
            </Link>
          </div>
        ) : (
          /* ==================================================== */
          /* PRODUCTION CHECKOUT FORM                             */
          /* ==================================================== */
          <form onSubmit={handlePlaceOrder} className="space-y-6">
            <div>
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight uppercase">
                Order Checkout
              </h1>
              <p className="text-xs text-slate-500 font-medium mt-0.5">
                Fast &amp; safe delivery of genuine laptop displays across Sri Lanka.
              </p>
            </div>

            {orderError && (
              <div className="bg-rose-50 border border-rose-200 text-rose-800 text-xs font-bold p-3.5 rounded-[3px] flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>{orderError}</span>
              </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Left Column: Form Fields */}
              <div className="lg:col-span-7 space-y-6">
                
                {/* Customer & Delivery Form Card */}
                <div className="bg-white rounded-[4px] p-5 sm:p-7 border border-slate-200 shadow-xs space-y-5">
                  <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                    <h2 className="text-xs sm:text-sm font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-blue-600" />
                      <span>Customer &amp; Delivery Details</span>
                    </h2>
                    {!isAuthenticated && (
                      <Link href="/login" className="text-xs font-bold text-blue-600 hover:underline">
                        Log In for Saved Details &rarr;
                      </Link>
                    )}
                  </div>

                  {/* Saved Address Selector (if logged in) */}
                  {savedAddresses.length > 0 && (
                    <div className="space-y-2 mb-4 text-xs">
                      <label className="block font-bold text-slate-700">Choose Saved Location:</label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {savedAddresses.map((addr) => (
                          <div
                            key={addr.id}
                            onClick={() => {
                              setSelectedAddressId(addr.id);
                              applySavedAddress(addr);
                            }}
                            className={`p-2.5 rounded-[3px] border cursor-pointer transition ${
                              selectedAddressId === addr.id
                                ? 'bg-blue-50 border-blue-600 text-blue-900 font-bold'
                                : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-white'
                            }`}
                          >
                            <span className="block font-black">{addr.type} Address</span>
                            <span className="block text-[11px] truncate text-slate-500">
                              {addr.address_line_1}, {addr.city?.name}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* EXACT FIELDS: EACH ON ITS OWN ROW WITH 2PX BOTTOM BORDER */}
                  <div className="space-y-4">
                    
                    {/* ROW 1: Full Name - Auto Get */}
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <label className={labelClass}>Full Name *</label>
                        {customerName && (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-[2px] border border-blue-200">
                            <Sparkles className="w-3 h-3 text-blue-600" />
                            Auto-filled
                          </span>
                        )}
                      </div>
                      <input
                        type="text"
                        required
                        value={customerName}
                        onChange={(e) => handleNameChange(e.target.value)}
                        placeholder="e.g. Kasun Fernando"
                        className={inputClass}
                      />
                    </div>

                    {/* ROW 2: Email - Auto Get */}
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <label className={labelClass}>Email Address *</label>
                        {customerEmail && (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-[2px] border border-blue-200">
                            <Sparkles className="w-3 h-3 text-blue-600" />
                            Auto-filled
                          </span>
                        )}
                      </div>
                      <input
                        type="email"
                        required
                        value={customerEmail}
                        onChange={(e) => handleEmailChange(e.target.value)}
                        placeholder="e.g. kasun@example.com"
                        className={inputClass}
                      />
                    </div>

                    {/* ROW 3: Mobile Number */}
                    <div>
                      <label className={labelClass}>Mobile Number *</label>
                      <input
                        type="tel"
                        required
                        value={customerPhone}
                        onChange={(e) => handlePhoneChange(e.target.value)}
                        placeholder="e.g. 077 123 4567 or 076 602 5870"
                        className={inputClass}
                      />
                    </div>

                    {/* ROW 4, 5, 6: Province, District, City (Each selection on its own row) */}
                    <LocationSelector
                      value={location}
                      onChange={(loc) => {
                        setLocation(loc);
                        if (loc.postalCode && !postalCode) {
                          setPostalCode(loc.postalCode);
                        }
                      }}
                      required
                    />

                    {/* ROW 7: Street / Delivery Address */}
                    <div>
                      <label className={labelClass}>
                        Street Address (House / Shop No, Road) *
                      </label>
                      <input
                        type="text"
                        required
                        value={addressLine1}
                        onChange={(e) => setAddressLine1(e.target.value)}
                        placeholder="e.g. No. 45/2, Galle Road, Bambalapitiya"
                        className={inputClass}
                      />
                    </div>

                    {/* ROW 8: Postal Code */}
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <label className={labelClass}>Postal Code</label>
                        {location.postalCode && (
                          <span className="text-[10px] text-slate-400 font-medium">
                            City Code: {location.postalCode}
                          </span>
                        )}
                      </div>
                      <input
                        type="text"
                        value={postalCode}
                        onChange={(e) => setPostalCode(e.target.value)}
                        placeholder="e.g. 00400"
                        className={inputClass}
                      />
                    </div>

                    {/* ROW 9: Order Notes / Delivery Instructions */}
                    <div>
                      <label className={labelClass}>
                        Order Notes / Delivery Instructions
                      </label>
                      <textarea
                        rows={2}
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        placeholder="e.g. Call before delivery / Deliver between 10AM-4PM / Near landmark"
                        className={`${inputClass} resize-none`}
                      />
                    </div>

                  </div>
                </div>

                {/* Shipping Methods Card */}
                <div className="bg-white rounded-[4px] p-5 sm:p-7 border border-slate-200 shadow-xs space-y-4">
                  <h2 className="text-xs sm:text-sm font-black text-slate-900 uppercase tracking-wider border-b border-slate-200 pb-3 flex items-center gap-2">
                    <Truck className="w-4 h-4 text-blue-600" />
                    <span>Shipping Method</span>
                  </h2>

                  {shippingLoading ? (
                    <div className="py-4 text-center text-xs font-bold text-slate-400 flex items-center justify-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Updating delivery rates...</span>
                    </div>
                  ) : (
                    <div className="space-y-2.5">
                      {shippingMethods.map((method) => (
                        <label
                          key={method.id}
                          className={`flex items-center justify-between p-3.5 rounded-[3px] border cursor-pointer transition ${
                            selectedMethodId === method.id
                              ? 'bg-blue-50/80 border-blue-600 shadow-2xs'
                              : 'bg-white border-slate-200 hover:border-slate-300'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <input
                              type="radio"
                              name="shippingMethod"
                              checked={selectedMethodId === method.id}
                              onChange={() => handleMethodSelect(method.id)}
                              className="w-4 h-4 text-blue-600"
                            />
                            <div>
                              <span className="text-xs font-black text-slate-900 block">
                                {method.name}
                              </span>
                              <span className="text-[11px] text-slate-500 font-medium">
                                {method.estimated_days} • {method.description}
                              </span>
                            </div>
                          </div>
                          <span className="text-xs font-black text-blue-600">
                            {Number(method.price) === 0 ? 'FREE' : `LKR ${Number(method.price).toLocaleString()}`}
                          </span>
                        </label>
                      ))}
                    </div>
                  )}
                </div>

                {/* Payment Method Card */}
                <div className="bg-white rounded-[4px] p-5 sm:p-7 border border-slate-200 shadow-xs space-y-4">
                  <h2 className="text-xs sm:text-sm font-black text-slate-900 uppercase tracking-wider border-b border-slate-200 pb-3 flex items-center gap-2">
                    <CreditCard className="w-4 h-4 text-blue-600" />
                    <span>Payment Method</span>
                  </h2>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {[
                      {
                        id: 'COD',
                        title: 'Cash on Delivery',
                        subtitle: 'Pay cash upon receiving parcel',
                      },
                      {
                        id: 'BankTransfer',
                        title: 'Bank Transfer',
                        subtitle: 'Direct deposit to Commercial Bank',
                      },
                      {
                        id: 'WhatsApp',
                        title: 'WhatsApp Order',
                        subtitle: 'Confirm details via WhatsApp',
                      },
                    ].map((pm) => (
                      <div
                        key={pm.id}
                        onClick={() => setPaymentMethod(pm.id as any)}
                        className={`p-3.5 rounded-[3px] border cursor-pointer transition flex flex-col justify-between ${
                          paymentMethod === pm.id
                            ? 'bg-blue-50 border-blue-600 text-blue-900 shadow-2xs'
                            : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'
                        }`}
                      >
                        <div className="space-y-1">
                          <span className="text-xs font-black block">{pm.title}</span>
                          <span className="text-[11px] text-slate-500 leading-tight block">
                            {pm.subtitle}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>

                  {paymentMethod === 'BankTransfer' && (
                    <div className="bg-blue-50 border border-blue-200 p-3.5 rounded-[3px] text-xs text-blue-900 space-y-1 mt-2">
                      <span className="font-black block text-blue-950">Bank Account Transfer Details:</span>
                      <div>Bank: <strong>Commercial Bank of Ceylon</strong> (Bambalapitiya Branch)</div>
                      <div>Account Name: <strong>Panelook Lanka (Pvt) Ltd</strong></div>
                      <div>Account Number: <strong>1000 2938 4821</strong></div>
                      <p className="text-[11px] text-blue-800 pt-1">
                        Please upload or WhatsApp your deposit receipt after completing the order.
                      </p>
                    </div>
                  )}
                </div>

              </div>

              {/* Right Column: Order Summary & Coupon (Box-Shaped) */}
              <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-24">
                
                {/* Order Summary Box */}
                <div className="bg-white rounded-[4px] p-5 sm:p-6 border border-slate-200 shadow-xs space-y-5">
                  <h2 className="text-xs sm:text-sm font-black text-slate-900 uppercase tracking-wider border-b border-slate-200 pb-3">
                    Order Summary ({cart.length} item{cart.length > 1 ? 's' : ''})
                  </h2>

                  {/* Cart Items Preview */}
                  <div className="divide-y divide-slate-100 max-h-60 overflow-y-auto space-y-2 pr-1">
                    {cart.map((item) => (
                      <div key={item.product.id} className="pt-2 flex items-center justify-between text-xs">
                        <div className="space-y-0.5">
                          <span className="font-extrabold text-slate-900 block truncate max-w-[220px]">
                            {item.product.name}
                          </span>
                          <span className="text-[11px] text-slate-400 font-semibold block">
                            Qty: {item.quantity} • {item.product.display_size} ({item.product.pin_type})
                          </span>
                        </div>
                        <span className="font-black text-slate-900">
                          LKR {(item.unit_price * item.quantity).toLocaleString()}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Coupon Code Box */}
                  <div className="border-t border-slate-100 pt-4">
                    <div className="flex gap-2">
                      <div className="relative flex-1">
                        <Tag className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                        <input
                          type="text"
                          value={couponCode}
                          onChange={(e) => setCouponCode(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              handleApplyCoupon(e);
                            }
                          }}
                          placeholder="Promo code (e.g. FIRST10)"
                          className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-[3px] text-xs font-bold text-slate-900 uppercase placeholder:normal-case focus:bg-white focus:border-blue-600 focus:outline-hidden"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={handleApplyCoupon}
                        disabled={couponLoading}
                        className="bg-slate-900 hover:bg-slate-800 disabled:bg-slate-400 text-white font-bold px-4 py-2 rounded-[3px] text-xs cursor-pointer transition"
                      >
                        {couponLoading ? '...' : 'Apply'}
                      </button>
                    </div>

                    {couponError && (
                      <span className="text-[11px] text-rose-600 font-semibold block mt-1.5">
                        {couponError}
                      </span>
                    )}

                    {appliedCoupon && (
                      <div className="bg-emerald-50 border border-emerald-200 p-2.5 rounded-[3px] text-xs font-bold text-emerald-800 flex items-center justify-between mt-2">
                        <span>Coupon &quot;{appliedCoupon.code}&quot; Applied!</span>
                        <span>- LKR {appliedCoupon.discount.toLocaleString()}</span>
                      </div>
                    )}
                  </div>

                  {/* Price Calculations */}
                  <div className="border-t border-slate-100 pt-4 space-y-2 text-xs text-slate-600">
                    <div className="flex justify-between">
                      <span>Items Subtotal:</span>
                      <span className="font-bold text-slate-900">LKR {subtotal.toLocaleString()}</span>
                    </div>

                    <div className="flex justify-between">
                      <span>Delivery Fee:</span>
                      <span className="font-bold text-slate-900">
                        {shippingCost === 0 ? 'FREE' : `LKR ${shippingCost.toLocaleString()}`}
                      </span>
                    </div>

                    {discountAmount > 0 && (
                      <div className="flex justify-between text-emerald-600 font-bold">
                        <span>Discount:</span>
                        <span>- LKR {discountAmount.toLocaleString()}</span>
                      </div>
                    )}

                    <div className="flex justify-between border-t border-slate-200 pt-3 text-base font-black text-slate-900">
                      <span>Total Amount:</span>
                      <span className="text-blue-600">LKR {grandTotal.toLocaleString()}</span>
                    </div>
                  </div>

                  {/* Place Order CTA Button */}
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-bold py-3.5 px-4 rounded-[3px] text-xs shadow-sm flex items-center justify-center gap-2 cursor-pointer transition"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Processing Order Safely...</span>
                      </>
                    ) : (
                      <>
                        <span>Place Order — LKR {grandTotal.toLocaleString()}</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>

                  <div className="bg-slate-50 p-3 rounded-[3px] border border-slate-200 text-center space-y-1">
                    <div className="flex items-center justify-center gap-1.5 text-xs font-bold text-slate-700">
                      <ShieldCheck className="w-4 h-4 text-emerald-600" />
                      <span>6 Months Genuine Display Warranty</span>
                    </div>
                    <span className="text-[10px] text-slate-400 font-semibold block">
                      Islandwide courier dispatch with verified shockproof packing.
                    </span>
                  </div>
                </div>

              </div>
            </div>
          </form>
        )}
      </main>

      <Footer />
    </div>
  );
}
