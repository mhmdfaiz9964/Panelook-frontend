'use client';

import React, { useEffect, useState } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { adminFetch } from '@/lib/adminApi';
import { Loader2, X, Search, Package } from 'lucide-react';

interface OrderItemRow {
  id: number;
  product_name: string;
  quantity: number;
  unit_price: number;
  subtotal: number;
}

interface OrderRow {
  id: number;
  order_number: string;
  customer_name: string;
  customer_phone: string;
  customer_email: string;
  shipping_address: string;
  city: string;
  district: string;
  payment_method: string;
  payment_status: string;
  shipping_status: string;
  order_status: string;
  subtotal: number;
  shipping_cost: number;
  grand_total: number;
  created_at: string;
  items?: OrderItemRow[];
}

const STATUSES = ['Pending', 'Confirmed', 'Processing', 'Packed', 'Shipped', 'Delivered', 'Cancelled', 'Returned'];

const STATUS_BADGE: Record<string, string> = {
  Pending: 'bg-amber-100 text-amber-800',
  Confirmed: 'bg-blue-100 text-blue-800',
  Processing: 'bg-blue-100 text-blue-800',
  Packed: 'bg-indigo-100 text-indigo-800',
  Shipped: 'bg-purple-100 text-purple-800',
  Delivered: 'bg-emerald-100 text-emerald-800',
  Cancelled: 'bg-rose-100 text-rose-800',
  Returned: 'bg-slate-200 text-slate-700',
};

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<OrderRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [detail, setDetail] = useState<OrderRow | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [updating, setUpdating] = useState(false);

  const loadOrders = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.append('search', search);
      if (statusFilter) params.append('status', statusFilter);
      const res = await adminFetch(`/admin/orders?${params.toString()}`);
      const json = await res.json();
      if (json.success) setOrders(json.data.data);
      else setError('Could not load orders.');
    } catch {
      setError('Backend API is unreachable.');
    }
    setLoading(false);
  };

  useEffect(() => {
    const t = setTimeout(loadOrders, 300);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, statusFilter]);

  const openDetail = async (id: number) => {
    setDetailLoading(true);
    setDetail(null);
    try {
      const res = await adminFetch(`/admin/orders/${id}`);
      const json = await res.json();
      if (json.success) setDetail(json.data);
    } catch {
      alert('Could not load order details.');
    }
    setDetailLoading(false);
  };

  const updateStatus = async (newStatus: string) => {
    if (!detail) return;
    setUpdating(true);
    try {
      const res = await adminFetch(`/admin/orders/${detail.id}/status`, {
        method: 'POST',
        body: JSON.stringify({ order_status: newStatus }),
      });
      const json = await res.json();
      if (json.success) {
        setDetail({ ...detail, order_status: newStatus });
        loadOrders();
      } else {
        alert(json.message || 'Could not update status.');
      }
    } catch {
      alert('Could not reach the backend API.');
    }
    setUpdating(false);
  };

  return (
    <AdminLayout title="Orders">
      <p className="text-sm text-[#66708A] font-medium mb-5">Manage and fulfil customer orders.</p>

      <div className="flex items-center gap-3 mb-4 flex-wrap">
        <div className="relative max-w-sm flex-1 min-w-[220px]">
          <Search className="w-4 h-4 text-[#66708A] absolute left-3 top-3" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search order #, customer, phone..."
            className="w-full pl-9 pr-4 h-10 border border-[#DDE2EE] rounded-lg text-[13px] focus:outline-hidden focus:border-[#5425F5]"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="h-10 px-3 border border-[#DDE2EE] rounded-lg text-[13px] text-[#17203D] focus:outline-hidden focus:border-[#5425F5]"
        >
          <option value="">All Statuses</option>
          {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      {error && (
        <div className="mb-4 bg-amber-50 border border-amber-200 text-amber-800 text-xs font-semibold px-4 py-3 rounded-xl">{error}</div>
      )}

      <div className="bg-white rounded-xl border border-[#E7EAF3] shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-[#F8F9FC] border-b border-[#E7EAF3]">
                <th className="px-4 py-3 text-[11px] font-bold text-[#66708A] uppercase tracking-wider">Order ID</th>
                <th className="px-4 py-3 text-[11px] font-bold text-[#66708A] uppercase tracking-wider">Customer</th>
                <th className="px-4 py-3 text-[11px] font-bold text-[#66708A] uppercase tracking-wider">Amount</th>
                <th className="px-4 py-3 text-[11px] font-bold text-[#66708A] uppercase tracking-wider">Payment</th>
                <th className="px-4 py-3 text-[11px] font-bold text-[#66708A] uppercase tracking-wider">Status</th>
                <th className="px-4 py-3 text-[11px] font-bold text-[#66708A] uppercase tracking-wider">Date</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={6} className="px-4 py-10 text-center text-sm text-[#66708A] font-medium"><Loader2 className="w-4 h-4 animate-spin inline mr-2" />Loading...</td></tr>
              ) : orders.length === 0 ? (
                <tr><td colSpan={6} className="px-4 py-10 text-center text-sm text-[#66708A] font-medium">No orders found.</td></tr>
              ) : (
                orders.map((o) => (
                  <tr key={o.id} onClick={() => openDetail(o.id)} className="border-b border-[#E7EAF3] last:border-b-0 hover:bg-[#F8F9FC] transition-colors cursor-pointer">
                    <td className="px-4 py-3 text-[13px] font-bold text-[#5425F5]">#{o.order_number}</td>
                    <td className="px-4 py-3 text-[13px] text-[#17203D] font-medium">{o.customer_name}</td>
                    <td className="px-4 py-3 text-[13px] font-bold text-[#17203D]">LKR {Number(o.grand_total).toLocaleString()}</td>
                    <td className="px-4 py-3 text-[12px] text-[#66708A]">{o.payment_method} &middot; {o.payment_status}</td>
                    <td className="px-4 py-3">
                      <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${STATUS_BADGE[o.order_status] || 'bg-slate-100 text-slate-700'}`}>
                        {o.order_status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-[12px] text-[#66708A]">{new Date(o.created_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {(detail || detailLoading) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs" onClick={() => setDetail(null)} />
          <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-xl max-h-[88vh] overflow-y-auto">
            {detailLoading ? (
              <div className="p-10 text-center text-sm text-[#66708A] font-medium">
                <Loader2 className="w-5 h-5 animate-spin inline mr-2" />Loading order...
              </div>
            ) : detail && (
              <>
                <div className="px-5 py-4 border-b border-[#E7EAF3] flex items-center justify-between sticky top-0 bg-white">
                  <div>
                    <h3 className="text-base font-semibold text-[#17203D]">Order #{detail.order_number}</h3>
                    <p className="text-[11px] text-[#66708A]">{new Date(detail.created_at).toLocaleString('en-GB')}</p>
                  </div>
                  <button onClick={() => setDetail(null)} className="p-1 text-[#66708A] hover:text-[#17203D]"><X className="w-5 h-5" /></button>
                </div>

                <div className="p-5 space-y-5">
                  <div>
                    <label className="text-[11px] font-black text-[#66708A] uppercase tracking-wider block mb-2">Order Status</label>
                    <div className="flex flex-wrap gap-1.5">
                      {STATUSES.map((s) => (
                        <button
                          key={s}
                          disabled={updating}
                          onClick={() => updateStatus(s)}
                          className={`text-[11px] font-bold px-3 py-1.5 rounded-full border transition-colors disabled:opacity-50 ${
                            detail.order_status === s
                              ? 'bg-[#5425F5] border-[#5425F5] text-white'
                              : 'bg-white border-[#DDE2EE] text-[#66708A] hover:border-[#5425F5]'
                          }`}
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-[#F8F9FC] rounded-lg p-3.5">
                      <h4 className="text-[11px] font-black text-[#66708A] uppercase tracking-wider mb-1.5">Customer</h4>
                      <p className="text-[13px] font-semibold text-[#17203D]">{detail.customer_name}</p>
                      <p className="text-[12px] text-[#66708A]">{detail.customer_phone}</p>
                      <p className="text-[12px] text-[#66708A]">{detail.customer_email}</p>
                    </div>
                    <div className="bg-[#F8F9FC] rounded-lg p-3.5">
                      <h4 className="text-[11px] font-black text-[#66708A] uppercase tracking-wider mb-1.5">Shipping</h4>
                      <p className="text-[13px] text-[#17203D]">{detail.shipping_address}</p>
                      <p className="text-[12px] text-[#66708A]">{detail.city}, {detail.district}</p>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-[11px] font-black text-[#66708A] uppercase tracking-wider mb-2 flex items-center gap-1.5">
                      <Package className="w-3.5 h-3.5" /> Items
                    </h4>
                    <div className="border border-[#E7EAF3] rounded-lg overflow-hidden">
                      {(detail.items || []).map((item) => (
                        <div key={item.id} className="flex items-center justify-between px-3.5 py-2.5 border-b border-[#E7EAF3] last:border-b-0 text-[13px]">
                          <div>
                            <span className="font-semibold text-[#17203D]">{item.product_name}</span>
                            <span className="text-[#66708A]"> &times; {item.quantity}</span>
                          </div>
                          <span className="font-bold text-[#17203D]">LKR {Number(item.subtotal).toLocaleString()}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="border-t border-[#E7EAF3] pt-3 space-y-1 text-[13px]">
                    <div className="flex justify-between text-[#66708A]"><span>Subtotal</span><span>LKR {Number(detail.subtotal).toLocaleString()}</span></div>
                    <div className="flex justify-between text-[#66708A]"><span>Shipping</span><span>LKR {Number(detail.shipping_cost).toLocaleString()}</span></div>
                    <div className="flex justify-between font-bold text-[#17203D] text-[15px] pt-1"><span>Total</span><span>LKR {Number(detail.grand_total).toLocaleString()}</span></div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
