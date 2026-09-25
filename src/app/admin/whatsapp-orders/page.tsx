'use client';

import React, { useEffect, useState } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { adminFetch } from '@/lib/adminApi';
import { Loader2, Plus, X, ShoppingCart } from 'lucide-react';

interface WhatsappOrderRow {
  id: number;
  customer_name: string;
  customer_phone: string;
  product_inquiry: string;
  quantity: number;
  amount: number | null;
  status: string;
  converted_order_id: number | null;
  created_at: string;
}

const STATUSES = ['New', 'Contacted', 'Confirmed', 'Processing', 'Completed', 'Cancelled'];
const STATUS_BADGE: Record<string, string> = {
  New: 'bg-blue-100 text-blue-800',
  Contacted: 'bg-amber-100 text-amber-800',
  Confirmed: 'bg-indigo-100 text-indigo-800',
  Processing: 'bg-purple-100 text-purple-800',
  Completed: 'bg-emerald-100 text-emerald-800',
  Cancelled: 'bg-rose-100 text-rose-800',
};

export default function AdminWhatsappOrdersPage() {
  const [items, setItems] = useState<WhatsappOrderRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState({ customer_name: '', customer_phone: '', product_inquiry: '', quantity: 1, amount: '' });
  const [saving, setSaving] = useState(false);
  const [convertTarget, setConvertTarget] = useState<WhatsappOrderRow | null>(null);
  const [convertForm, setConvertForm] = useState({ shipping_address: '', city: '', district: '', unit_price: '' });
  const [converting, setConverting] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const res = await adminFetch('/admin/whatsapp-orders');
      const json = await res.json();
      if (json.success) setItems(json.data);
      else setError('Could not load WhatsApp orders.');
    } catch {
      setError('Backend API is unreachable.');
    }
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await adminFetch('/admin/whatsapp-orders', { method: 'POST', body: JSON.stringify(form) });
      const json = await res.json();
      if (json.success) {
        setModalOpen(false);
        setForm({ customer_name: '', customer_phone: '', product_inquiry: '', quantity: 1, amount: '' });
        load();
      } else {
        alert(json.message || 'Could not save.');
      }
    } catch {
      alert('Could not reach the backend API.');
    }
    setSaving(false);
  };

  const updateStatus = async (id: number, status: string) => {
    try {
      const res = await adminFetch(`/admin/whatsapp-orders/${id}/status`, { method: 'POST', body: JSON.stringify({ status }) });
      const json = await res.json();
      if (json.success) load();
    } catch {
      alert('Could not reach the backend API.');
    }
  };

  const submitConvert = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!convertTarget) return;
    setConverting(true);
    try {
      const res = await adminFetch(`/admin/whatsapp-orders/${convertTarget.id}/convert`, {
        method: 'POST',
        body: JSON.stringify(convertForm),
      });
      const json = await res.json();
      if (json.success) {
        setConvertTarget(null);
        setConvertForm({ shipping_address: '', city: '', district: '', unit_price: '' });
        load();
      } else {
        alert(json.message || 'Could not convert to order.');
      }
    } catch {
      alert('Could not reach the backend API.');
    }
    setConverting(false);
  };

  return (
    <AdminLayout title="WhatsApp Orders">
      <div className="flex items-center justify-between mb-5 gap-4 flex-wrap">
        <p className="text-sm text-[#66708A] font-medium">Inquiries received via WhatsApp, ready to convert into orders.</p>
        <button onClick={() => setModalOpen(true)} className="flex items-center gap-1.5 bg-[#5425F5] hover:bg-[#6D3CFF] text-white font-semibold text-[13px] px-4 py-2.5 rounded-lg shadow-xs transition-colors">
          <Plus className="w-4 h-4" /> Log Inquiry
        </button>
      </div>

      {error && <div className="mb-4 bg-amber-50 border border-amber-200 text-amber-800 text-xs font-semibold px-4 py-3 rounded-xl">{error}</div>}

      <div className="bg-white rounded-xl border border-[#E7EAF3] shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-[#F8F9FC] border-b border-[#E7EAF3]">
                <th className="px-4 py-3 text-[11px] font-bold text-[#66708A] uppercase tracking-wider">Customer</th>
                <th className="px-4 py-3 text-[11px] font-bold text-[#66708A] uppercase tracking-wider">Mobile</th>
                <th className="px-4 py-3 text-[11px] font-bold text-[#66708A] uppercase tracking-wider">Product</th>
                <th className="px-4 py-3 text-[11px] font-bold text-[#66708A] uppercase tracking-wider">Qty</th>
                <th className="px-4 py-3 text-[11px] font-bold text-[#66708A] uppercase tracking-wider">Status</th>
                <th className="px-4 py-3 text-[11px] font-bold text-[#66708A] uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={6} className="px-4 py-10 text-center text-sm text-[#66708A] font-medium"><Loader2 className="w-4 h-4 animate-spin inline mr-2" />Loading...</td></tr>
              ) : items.length === 0 ? (
                <tr><td colSpan={6} className="px-4 py-10 text-center text-sm text-[#66708A] font-medium">No WhatsApp inquiries logged yet.</td></tr>
              ) : (
                items.map((w) => (
                  <tr key={w.id} className="border-b border-[#E7EAF3] last:border-b-0 hover:bg-[#F8F9FC] transition-colors">
                    <td className="px-4 py-3 text-[13px] font-semibold text-[#17203D]">{w.customer_name}</td>
                    <td className="px-4 py-3 text-[13px] text-[#66708A]">{w.customer_phone}</td>
                    <td className="px-4 py-3 text-[13px] text-[#17203D] max-w-[220px] truncate">{w.product_inquiry}</td>
                    <td className="px-4 py-3 text-[13px] text-[#66708A]">{w.quantity}</td>
                    <td className="px-4 py-3">
                      <select
                        value={w.status}
                        onChange={(e) => updateStatus(w.id, e.target.value)}
                        disabled={!!w.converted_order_id}
                        className={`text-[11px] font-bold px-2 py-1 rounded-full border-0 cursor-pointer disabled:cursor-not-allowed ${STATUS_BADGE[w.status] || 'bg-slate-100 text-slate-700'}`}
                      >
                        {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </td>
                    <td className="px-4 py-3 text-right">
                      {w.converted_order_id ? (
                        <span className="text-[11px] font-bold text-emerald-600">Converted</span>
                      ) : (
                        <button
                          onClick={() => setConvertTarget(w)}
                          className="inline-flex items-center gap-1.5 text-[11px] font-bold text-[#5425F5] hover:bg-purple-50 px-2.5 py-1.5 rounded-lg"
                        >
                          <ShoppingCart className="w-3.5 h-3.5" /> Create Order
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs" onClick={() => setModalOpen(false)} />
          <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-sm">
            <div className="px-5 py-4 border-b border-[#E7EAF3] flex items-center justify-between">
              <h3 className="text-base font-semibold text-[#17203D]">Log WhatsApp Inquiry</h3>
              <button onClick={() => setModalOpen(false)} className="p-1 text-[#66708A] hover:text-[#17203D]"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={submit} className="p-5 space-y-4">
              <div>
                <label className="block text-[12px] font-semibold text-[#17203D] mb-1.5">Customer Name</label>
                <input required value={form.customer_name} onChange={(e) => setForm({ ...form, customer_name: e.target.value })} className="w-full h-10 px-3 border border-[#DDE2EE] rounded-lg text-[13px] focus:outline-hidden focus:border-[#5425F5]" />
              </div>
              <div>
                <label className="block text-[12px] font-semibold text-[#17203D] mb-1.5">Mobile Number</label>
                <input required value={form.customer_phone} onChange={(e) => setForm({ ...form, customer_phone: e.target.value })} className="w-full h-10 px-3 border border-[#DDE2EE] rounded-lg text-[13px] focus:outline-hidden focus:border-[#5425F5]" />
              </div>
              <div>
                <label className="block text-[12px] font-semibold text-[#17203D] mb-1.5">Product Inquiry</label>
                <textarea required rows={2} value={form.product_inquiry} onChange={(e) => setForm({ ...form, product_inquiry: e.target.value })} className="w-full px-3 py-2 border border-[#DDE2EE] rounded-lg text-[13px] focus:outline-hidden focus:border-[#5425F5] resize-none" placeholder="e.g. 15.6&quot; FHD display for HP Pavilion" />
              </div>
              <div>
                <label className="block text-[12px] font-semibold text-[#17203D] mb-1.5">Quantity</label>
                <input type="number" min={1} value={form.quantity} onChange={(e) => setForm({ ...form, quantity: Number(e.target.value) })} className="w-full h-10 px-3 border border-[#DDE2EE] rounded-lg text-[13px] focus:outline-hidden focus:border-[#5425F5]" />
              </div>
              <button type="submit" disabled={saving} className="w-full bg-[#5425F5] hover:bg-[#6D3CFF] text-white font-semibold text-[13px] py-2.5 rounded-lg transition-colors disabled:opacity-60">
                {saving ? 'Saving...' : 'Save Inquiry'}
              </button>
            </form>
          </div>
        </div>
      )}

      {convertTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs" onClick={() => setConvertTarget(null)} />
          <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-sm">
            <div className="px-5 py-4 border-b border-[#E7EAF3] flex items-center justify-between">
              <h3 className="text-base font-semibold text-[#17203D]">Create Order from Inquiry</h3>
              <button onClick={() => setConvertTarget(null)} className="p-1 text-[#66708A] hover:text-[#17203D]"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={submitConvert} className="p-5 space-y-4">
              <p className="text-[13px] text-[#66708A]">{convertTarget.customer_name} &middot; {convertTarget.product_inquiry} &times; {convertTarget.quantity}</p>
              <div>
                <label className="block text-[12px] font-semibold text-[#17203D] mb-1.5">Unit Price (LKR)</label>
                <input required type="number" value={convertForm.unit_price} onChange={(e) => setConvertForm({ ...convertForm, unit_price: e.target.value })} className="w-full h-10 px-3 border border-[#DDE2EE] rounded-lg text-[13px] focus:outline-hidden focus:border-[#5425F5]" />
              </div>
              <div>
                <label className="block text-[12px] font-semibold text-[#17203D] mb-1.5">Shipping Address</label>
                <textarea required rows={2} value={convertForm.shipping_address} onChange={(e) => setConvertForm({ ...convertForm, shipping_address: e.target.value })} className="w-full px-3 py-2 border border-[#DDE2EE] rounded-lg text-[13px] focus:outline-hidden focus:border-[#5425F5] resize-none" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[12px] font-semibold text-[#17203D] mb-1.5">City</label>
                  <input required value={convertForm.city} onChange={(e) => setConvertForm({ ...convertForm, city: e.target.value })} className="w-full h-10 px-3 border border-[#DDE2EE] rounded-lg text-[13px] focus:outline-hidden focus:border-[#5425F5]" />
                </div>
                <div>
                  <label className="block text-[12px] font-semibold text-[#17203D] mb-1.5">District</label>
                  <input required value={convertForm.district} onChange={(e) => setConvertForm({ ...convertForm, district: e.target.value })} className="w-full h-10 px-3 border border-[#DDE2EE] rounded-lg text-[13px] focus:outline-hidden focus:border-[#5425F5]" />
                </div>
              </div>
              <button type="submit" disabled={converting} className="w-full bg-[#5425F5] hover:bg-[#6D3CFF] text-white font-semibold text-[13px] py-2.5 rounded-lg transition-colors disabled:opacity-60">
                {converting ? 'Creating Order...' : 'Create Order'}
              </button>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
