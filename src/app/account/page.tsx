'use client';

import React, { useEffect, useState } from 'react';
import { AccountLayout } from '@/components/account/AccountLayout';
import { useCustomerAuth } from '@/context/CustomerAuthContext';
import { getApiUrl, getInvoiceUrl } from '@/lib/config';
import { Package, Download, Clock, ArrowRight, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import Link from 'next/link';

export default function AccountOverviewPage() {
  const { user, token } = useCustomerAuth();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

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
        // error handled
      } finally {
        setLoading(false);
      }
    })();
  }, [token]);

  const recentOrders = orders.slice(0, 5);

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
      title="Account Dashboard"
      subtitle="Overview of your orders, delivery status, and warranty profile."
    >
      <div className="space-y-6">
        {/* KPI Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-2xs space-y-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
              Total Orders
            </span>
            <div className="text-3xl font-black text-slate-900">
              {orders.length}
            </div>
            <span className="text-[11px] text-slate-400 font-semibold block">
              Lifetime placed orders
            </span>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-2xs space-y-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
              Total Purchases
            </span>
            <div className="text-3xl font-black text-blue-600">
              LKR{' '}
              {orders
                .filter((o) => o.order_status !== 'Cancelled')
                .reduce((acc, o) => acc + (Number(o.grand_total) || 0), 0)
                .toLocaleString()}
            </div>
            <span className="text-[11px] text-slate-400 font-semibold block">
              Completed transactions
            </span>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-2xs space-y-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
              Warranty Status
            </span>
            <div className="text-lg font-black text-emerald-600 flex items-center gap-1.5 mt-1">
              <CheckCircle2 className="w-5 h-5" />
              <span>Active Coverage</span>
            </div>
            <span className="text-[11px] text-slate-400 font-semibold block">
              6 Months Genuine Replacement
            </span>
          </div>
        </div>

        {/* Profile Details Quick Card */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-4">
            <h2 className="text-base font-black text-slate-900">Profile Summary</h2>
            <Link
              href="/account/profile"
              className="text-xs font-bold text-blue-600 hover:underline"
            >
              Edit Details &rarr;
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div>
              <span className="text-slate-400 font-bold block mb-0.5">Customer Name</span>
              <span className="font-extrabold text-slate-900">{user?.name}</span>
            </div>
            <div>
              <span className="text-slate-400 font-bold block mb-0.5">Email</span>
              <span className="font-extrabold text-slate-900">{user?.email}</span>
            </div>
            <div>
              <span className="text-slate-400 font-bold block mb-0.5">Phone</span>
              <span className="font-extrabold text-slate-900">{user?.phone || 'Not provided'}</span>
            </div>
          </div>
        </div>

        {/* Recent Orders Section */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-2xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div className="flex items-center gap-2">
              <Package className="w-5 h-5 text-blue-600" />
              <h2 className="text-base font-black text-slate-900">Recent Orders</h2>
            </div>
            {orders.length > 5 && (
              <Link
                href="/account/orders"
                className="text-xs font-bold text-blue-600 hover:underline"
              >
                View All Orders &rarr;
              </Link>
            )}
          </div>

          {loading ? (
            <div className="py-12 text-center text-xs font-bold text-slate-500">
              <Loader2 className="w-5 h-5 animate-spin mx-auto mb-2 text-blue-600" />
              Loading your order history...
            </div>
          ) : recentOrders.length === 0 ? (
            <div className="py-12 text-center space-y-3">
              <Package className="w-10 h-10 text-slate-300 mx-auto" />
              <p className="text-xs font-bold text-slate-500">No orders placed yet.</p>
              <Link
                href="/shop"
                className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold px-5 py-2.5 rounded-2xl text-xs shadow-md transition"
              >
                Browse Laptop Displays &rarr;
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {recentOrders.map((ord) => (
                <div
                  key={ord.id}
                  className="p-4 rounded-2xl border border-slate-200 bg-slate-50 hover:bg-white hover:border-blue-200 transition flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
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

                    <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 font-medium">
                      <span>{new Date(ord.created_at).toLocaleDateString('en-GB')}</span>
                      <span>•</span>
                      <span>{ord.items?.length || 1} item(s)</span>
                      <span>•</span>
                      <span className="font-bold text-blue-600">
                        LKR {Number(ord.grand_total).toLocaleString()}
                      </span>
                      <span>•</span>
                      <span>Payment: {ord.payment_status}</span>
                    </div>

                    {ord.tracking_number && (
                      <div className="text-[11px] font-bold text-purple-700 mt-1">
                        Courier: {ord.courier_name || 'Standard Courier'} | Tracking: #{ord.tracking_number}
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-center">
                    <a
                      href={getInvoiceUrl(ord.id)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs font-bold text-slate-700 hover:text-blue-600 bg-white border border-slate-200 hover:border-blue-300 px-3 py-2 rounded-xl flex items-center gap-1 shadow-2xs transition"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Invoice</span>
                    </a>
                    <Link
                      href={`/account/orders/${ord.id}`}
                      className="text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 px-3.5 py-2 rounded-xl flex items-center gap-1 shadow-sm transition"
                    >
                      <span>Details</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </AccountLayout>
  );
}
