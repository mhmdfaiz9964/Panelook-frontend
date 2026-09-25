'use client';

import React, { useEffect, useState } from 'react';
import { AccountLayout } from '@/components/account/AccountLayout';
import { useCustomerAuth } from '@/context/CustomerAuthContext';
import { getApiUrl, getInvoiceUrl } from '@/lib/config';
import { Package, Download, ArrowRight, Loader2, Search, ExternalLink } from 'lucide-react';
import Link from 'next/link';

export default function AccountOrdersPage() {
  const { token } = useCustomerAuth();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    if (!token) return;
    (async () => {
      try {
        const res = await fetch(getApiUrl('/customer/orders'), {
          headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' },
        });
        if (res.ok) {
          const json = await res.json();
          if (json.success) setOrders(json.data || []);
        }
      } catch {
        // handle
      } finally {
        setLoading(false);
      }
    })();
  }, [token]);

  const filtered = orders.filter((o) => {
    if (!search) return true;
    const s = search.toLowerCase();
    return (
      o.order_number?.toLowerCase().includes(s) ||
      o.shipping_address?.toLowerCase().includes(s) ||
      o.items?.some((i: any) => i.product_name?.toLowerCase().includes(s))
    );
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Delivered':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'Shipped':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'Processing':
      case 'Confirmed':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Cancelled':
        return 'bg-rose-100 text-rose-800 border-rose-200';
      default:
        return 'bg-amber-100 text-amber-800 border-amber-200';
    }
  };

  return (
    <AccountLayout
      title="My Orders"
      subtitle="Complete history of your laptop display orders and shipments."
    >
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-2xs space-y-6">
        {/* Search Bar */}
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div className="relative flex-1 min-w-[240px]">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by order number or panel model..."
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-blue-600 focus:outline-hidden transition"
            />
          </div>

          <span className="text-xs font-bold text-slate-500">
            Total Orders: <strong className="text-slate-900">{filtered.length}</strong>
          </span>
        </div>

        {loading ? (
          <div className="py-16 text-center text-xs font-bold text-slate-500">
            <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2 text-blue-600" />
            Fetching orders...
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-16 text-center space-y-3">
            <Package className="w-12 h-12 text-slate-300 mx-auto" />
            <p className="text-xs font-bold text-slate-500">No orders match your query.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filtered.map((ord) => (
              <div
                key={ord.id}
                className="p-5 rounded-2xl border border-slate-200 bg-slate-50 hover:bg-white hover:border-blue-200 transition space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200/60 pb-3">
                  <div>
                    <div className="flex items-center gap-2.5">
                      <span className="font-black text-slate-900 text-sm">
                        {ord.order_number}
                      </span>
                      <span
                        className={`text-[10px] font-black px-2.5 py-0.5 rounded-full border ${getStatusBadge(
                          ord.order_status
                        )}`}
                      >
                        {ord.order_status}
                      </span>
                    </div>
                    <span className="text-xs text-slate-500 font-medium block mt-0.5">
                      Placed on {new Date(ord.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>

                  <div className="text-left sm:text-right">
                    <span className="text-xs text-slate-400 font-bold block">Total Amount</span>
                    <span className="text-base font-black text-blue-600">
                      LKR {Number(ord.grand_total).toLocaleString()}
                    </span>
                  </div>
                </div>

                {/* Items preview */}
                <div className="space-y-2 text-xs">
                  {ord.items?.map((item: any) => (
                    <div key={item.id} className="flex items-center justify-between">
                      <span className="font-bold text-slate-800">
                        {item.quantity}x {item.product_name}
                      </span>
                      <span className="font-semibold text-slate-500">
                        LKR {Number(item.subtotal).toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Shipment Info Banner */}
                {ord.tracking_number && (
                  <div className="bg-purple-50 border border-purple-200 p-3 rounded-xl flex items-center justify-between text-xs text-purple-900">
                    <div className="font-semibold">
                      <span>Courier: <strong>{ord.courier_name}</strong></span>
                      <span className="mx-2">•</span>
                      <span>Tracking: <strong>#{ord.tracking_number}</strong></span>
                    </div>
                    {ord.shipment?.tracking_link && (
                      <a
                        href={ord.shipment.tracking_link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-purple-700 hover:text-purple-900 font-black flex items-center gap-1 underline"
                      >
                        <span>Live Tracking</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                )}

                {/* Actions Footer */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                  <span className="text-[11px] font-semibold text-slate-500">
                    Payment: <strong className="text-slate-800">{ord.payment_method}</strong> ({ord.payment_status})
                  </span>

                  <div className="flex items-center gap-2">
                    <a
                      href={getInvoiceUrl(ord.id)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs font-bold text-slate-700 hover:text-blue-600 bg-white border border-slate-200 hover:border-blue-300 px-3 py-2 rounded-xl flex items-center gap-1 shadow-2xs transition"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Invoice PDF</span>
                    </a>

                    <Link
                      href={`/account/orders/${ord.id}`}
                      className="text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 px-3.5 py-2 rounded-xl flex items-center gap-1 shadow-sm transition"
                    >
                      <span>View Full Order</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AccountLayout>
  );
}
