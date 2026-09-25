'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { AccountLayout } from '@/components/account/AccountLayout';
import { useCustomerAuth } from '@/context/CustomerAuthContext';
import { getApiUrl, getInvoiceUrl } from '@/lib/config';
import { Package, Download, Truck, CheckCircle2, Clock, ArrowLeft, ExternalLink, MapPin, CreditCard, ShieldCheck } from 'lucide-react';
import Link from 'next/link';

export default function OrderDetailClient() {
  const params = useParams();
  const router = useRouter();
  const { token } = useCustomerAuth();

  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const orderId = params?.id as string;

  useEffect(() => {
    if (!token || !orderId) return;
    (async () => {
      try {
        const res = await fetch(getApiUrl(`/customer/orders/${orderId}`), {
          headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' },
        });
        if (res.ok) {
          const json = await res.json();
          if (json.success) {
            setOrder(json.data);
          } else {
            setError(json.message || 'Order not found.');
          }
        } else {
          setError('Could not load order details.');
        }
      } catch {
        setError('Network error loading order.');
      } finally {
        setLoading(false);
      }
    })();
  }, [token, orderId]);

  const TIMELINE_STEPS = ['Pending', 'Confirmed', 'Processing', 'Packed', 'Shipped', 'Delivered'];

  const getStepIndex = (status: string) => {
    const idx = TIMELINE_STEPS.indexOf(status);
    return idx === -1 ? 0 : idx;
  };

  return (
    <AccountLayout
      title={order ? `Order #${order.order_number}` : 'Order Details'}
      subtitle="Detailed breakdown of your purchased displays and tracking timeline."
    >
      <div className="space-y-6">
        <Link
          href="/account/orders"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-blue-600 transition"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to All Orders</span>
        </Link>

        {loading ? (
          <div className="bg-white rounded-3xl p-16 text-center text-xs font-bold text-slate-500 border border-slate-200">
            Loading order details...
          </div>
        ) : error || !order ? (
          <div className="bg-white rounded-3xl p-12 text-center space-y-3 border border-slate-200">
            <Package className="w-10 h-10 text-rose-500 mx-auto" />
            <p className="text-sm font-bold text-slate-900">{error || 'Order not found.'}</p>
            <Link
              href="/account/orders"
              className="inline-block bg-blue-600 text-white font-bold px-4 py-2 rounded-xl text-xs"
            >
              Return to Orders
            </Link>
          </div>
        ) : (
          <>
            {/* Top Summary Card */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-2xs space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
                <div>
                  <span className="text-xs text-slate-400 font-bold block">Order Number</span>
                  <h2 className="text-xl font-black text-slate-900">{order.order_number}</h2>
                  <span className="text-xs text-slate-500 font-medium mt-0.5 block">
                    Placed on {new Date(order.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <a
                    href={getInvoiceUrl(order.id)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 px-4 py-2.5 rounded-2xl flex items-center gap-1.5 shadow-sm transition"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download Invoice PDF</span>
                  </a>
                </div>
              </div>

              {/* Progress Timeline */}
              <div className="py-4">
                <span className="text-xs font-black text-slate-700 block mb-3 uppercase tracking-wider">
                  Fulfillment Status Pipeline
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-6 gap-2">
                  {TIMELINE_STEPS.map((step, idx) => {
                    const currentIdx = getStepIndex(order.order_status);
                    const isCompleted = idx <= currentIdx && order.order_status !== 'Cancelled';
                    const isCurrent = idx === currentIdx && order.order_status !== 'Cancelled';

                    return (
                      <div
                        key={step}
                        className={`p-3 rounded-2xl border text-center transition ${
                          isCurrent
                            ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                            : isCompleted
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                            : 'bg-slate-50 text-slate-400 border-slate-200'
                        }`}
                      >
                        <span className="text-[10px] font-extrabold block">
                          Step {idx + 1}
                        </span>
                        <span className="text-xs font-black block mt-0.5">
                          {step}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Courier Tracking Box */}
              {order.tracking_number && (
                <div className="bg-purple-50 border border-purple-200 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-purple-900">
                  <div className="space-y-0.5">
                    <span className="text-[10px] font-black uppercase text-purple-600 tracking-wider block">
                      Dispatched with Islandwide Tracking
                    </span>
                    <div className="font-bold text-sm text-purple-950">
                      Courier: {order.courier_name} • Waybill #{order.tracking_number}
                    </div>
                    <span className="text-purple-700 text-[11px] block">
                      Shipment Status: {order.shipment?.status || 'In Transit'}
                    </span>
                  </div>

                  {order.shipment?.tracking_link && (
                    <a
                      href={order.shipment.tracking_link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-purple-600 hover:bg-purple-700 text-white font-bold px-4 py-2 rounded-xl flex items-center gap-1.5 self-start sm:self-center text-xs shadow-sm transition"
                    >
                      <span>Track on Courier Site</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  )}
                </div>
              )}
            </div>

            {/* Items Table */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-2xs space-y-4">
              <h3 className="text-base font-black text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
                <Package className="w-5 h-5 text-blue-600" />
                <span>Items in this Order ({order.items?.length || 0})</span>
              </h3>

              <div className="divide-y divide-slate-100">
                {order.items?.map((item: any) => (
                  <div key={item.id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                    <div className="space-y-1">
                      <div className="font-black text-slate-900 text-sm">
                        {item.product_name}
                      </div>
                      {item.variation_details && (
                        <div className="flex flex-wrap gap-2 text-[11px] text-slate-500 font-semibold">
                          {item.variation_details.panel_number && (
                            <span className="bg-slate-100 px-2 py-0.5 rounded-md">Panel: {item.variation_details.panel_number}</span>
                          )}
                          {item.variation_details.display_size && (
                            <span className="bg-slate-100 px-2 py-0.5 rounded-md">Size: {item.variation_details.display_size}</span>
                          )}
                          {item.variation_details.pin_type && (
                            <span className="bg-slate-100 px-2 py-0.5 rounded-md">Pin: {item.variation_details.pin_type}</span>
                          )}
                          {item.variation_details.display_type && (
                            <span className="bg-slate-100 px-2 py-0.5 rounded-md">Type: {item.variation_details.display_type}</span>
                          )}
                        </div>
                      )}
                      <span className="text-slate-400 font-medium block">
                        Unit Price: LKR {Number(item.unit_price).toLocaleString()} × {item.quantity} unit(s)
                      </span>
                    </div>

                    <div className="font-black text-slate-900 text-sm sm:text-right">
                      LKR {Number(item.subtotal).toLocaleString()}
                    </div>
                  </div>
                ))}
              </div>

              {/* Price Calculation Summary */}
              <div className="border-t border-slate-100 pt-4 space-y-2 max-w-xs ml-auto text-xs text-slate-600">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span className="font-bold text-slate-900">LKR {Number(order.subtotal).toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping Fee:</span>
                  <span className="font-bold text-slate-900">
                    {Number(order.shipping_cost) === 0 ? 'FREE' : `LKR ${Number(order.shipping_cost).toLocaleString()}`}
                  </span>
                </div>
                {Number(order.discount) > 0 && (
                  <div className="flex justify-between text-emerald-600 font-bold">
                    <span>Discount {order.coupon_code ? `(${order.coupon_code})` : ''}:</span>
                    <span>- LKR {Number(order.discount).toLocaleString()}</span>
                  </div>
                )}
                <div className="flex justify-between border-t border-slate-200 pt-2 text-sm font-black text-slate-900">
                  <span>Grand Total:</span>
                  <span className="text-blue-600">LKR {Number(order.grand_total).toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* Delivery & Payment Details Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-2xs space-y-3">
                <div className="flex items-center gap-2 text-slate-900 font-black text-sm border-b border-slate-100 pb-2.5">
                  <MapPin className="w-4 h-4 text-blue-600" />
                  <span>Delivery Address</span>
                </div>
                <div className="text-xs text-slate-700 space-y-1">
                  <span className="font-bold text-slate-900 block">{order.customer_name}</span>
                  <span>Phone: {order.customer_phone}</span>
                  <p className="text-slate-600">{order.shipping_address}</p>
                  <p className="font-semibold text-slate-800">
                    {order.city}, {order.district}{order.province ? ` (${order.province} Province)` : ''}
                  </p>
                  {order.notes && (
                    <div className="bg-slate-50 p-2 rounded-xl text-[11px] text-slate-500 mt-2">
                      <strong>Delivery Instructions:</strong> {order.notes}
                    </div>
                  )}
                </div>
              </div>

              <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-2xs space-y-3">
                <div className="flex items-center gap-2 text-slate-900 font-black text-sm border-b border-slate-100 pb-2.5">
                  <CreditCard className="w-4 h-4 text-blue-600" />
                  <span>Payment & Warranty</span>
                </div>
                <div className="text-xs text-slate-700 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Method:</span>
                    <span className="font-bold text-slate-900">{order.payment_method}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Payment Status:</span>
                    <span className="font-bold text-slate-900">{order.payment_status}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Shipping Method:</span>
                    <span className="font-bold text-slate-900">{order.shipping_method_name || 'Standard Courier'}</span>
                  </div>
                  <div className="mt-3 bg-emerald-50 border border-emerald-200 p-3 rounded-2xl flex items-center gap-2 text-emerald-800 text-[11px] font-bold">
                    <ShieldCheck className="w-4 h-4 shrink-0 text-emerald-600" />
                    <span>Includes 6 Months Replacement Warranty against manufacturing defects.</span>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </AccountLayout>
  );
}
