'use client';

import React, { useEffect, useState } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { adminFetch } from '@/lib/adminApi';
import { Loader2, Plus, X, ArrowRight } from 'lucide-react';

interface TransferRow {
  id: number;
  reference: string;
  quantity: number;
  status: string;
  notes: string | null;
  created_at: string;
  product?: { name: string };
  source_warehouse?: { name: string };
  destination_warehouse?: { name: string };
}

interface Option { id: number; name: string; }

const STATUSES = ['Draft', 'Requested', 'Approved', 'In Transit', 'Completed', 'Cancelled'];
const STATUS_BADGE: Record<string, string> = {
  Draft: 'bg-slate-200 text-slate-700',
  Requested: 'bg-amber-100 text-amber-800',
  Approved: 'bg-blue-100 text-blue-800',
  'In Transit': 'bg-purple-100 text-purple-800',
  Completed: 'bg-emerald-100 text-emerald-800',
  Cancelled: 'bg-rose-100 text-rose-800',
};

export default function AdminStockTransfersPage() {
  const [transfers, setTransfers] = useState<TransferRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [warehouses, setWarehouses] = useState<Option[]>([]);
  const [products, setProducts] = useState<Option[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState({ source_warehouse_id: '', destination_warehouse_id: '', product_id: '', quantity: 1, notes: '' });
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState('');

  const load = async () => {
    setLoading(true);
    try {
      const res = await adminFetch('/admin/stock-transfers');
      const json = await res.json();
      if (json.success) setTransfers(json.data);
      else setError('Could not load transfers.');
    } catch {
      setError('Backend API is unreachable.');
    }
    setLoading(false);
  };

  useEffect(() => {
    load();
    (async () => {
      try {
        const [w, p] = await Promise.all([
          adminFetch('/admin/warehouses').then((r) => r.json()),
          adminFetch('/admin/products').then((r) => r.json()),
        ]);
        if (w.success) setWarehouses(w.data);
        if (p.success) setProducts(p.data.data);
      } catch { /* dropdowns just stay empty */ }
    })();
  }, []);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setFormError('');
    try {
      const res = await adminFetch('/admin/stock-transfers', { method: 'POST', body: JSON.stringify(form) });
      const json = await res.json();
      if (json.success) {
        setModalOpen(false);
        setForm({ source_warehouse_id: '', destination_warehouse_id: '', product_id: '', quantity: 1, notes: '' });
        load();
      } else {
        setFormError(json.message || 'Could not create transfer.');
      }
    } catch {
      setFormError('Could not reach the backend API.');
    }
    setSaving(false);
  };

  const updateStatus = async (id: number, status: string) => {
    try {
      const res = await adminFetch(`/admin/stock-transfers/${id}/status`, { method: 'POST', body: JSON.stringify({ status }) });
      const json = await res.json();
      if (json.success) load();
    } catch {
      alert('Could not reach the backend API.');
    }
  };

  return (
    <AdminLayout title="Stock Transfers">
      <div className="flex items-center justify-between mb-5 gap-4 flex-wrap">
        <p className="text-sm text-[#66708A] font-medium">Move stock between warehouses.</p>
        <button
          onClick={() => setModalOpen(true)}
          className="flex items-center gap-1.5 bg-[#5425F5] hover:bg-[#6D3CFF] text-white font-semibold text-[13px] px-4 py-2.5 rounded-lg shadow-xs transition-colors"
        >
          <Plus className="w-4 h-4" /> New Transfer
        </button>
      </div>

      {error && (
        <div className="mb-4 bg-amber-50 border border-amber-200 text-amber-800 text-xs font-semibold px-4 py-3 rounded-xl">{error}</div>
      )}

      <div className="bg-white rounded-xl border border-[#E7EAF3] shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-[#F8F9FC] border-b border-[#E7EAF3]">
                <th className="px-4 py-3 text-[11px] font-bold text-[#66708A] uppercase tracking-wider">Reference</th>
                <th className="px-4 py-3 text-[11px] font-bold text-[#66708A] uppercase tracking-wider">Product</th>
                <th className="px-4 py-3 text-[11px] font-bold text-[#66708A] uppercase tracking-wider">Route</th>
                <th className="px-4 py-3 text-[11px] font-bold text-[#66708A] uppercase tracking-wider">Qty</th>
                <th className="px-4 py-3 text-[11px] font-bold text-[#66708A] uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={5} className="px-4 py-10 text-center text-sm text-[#66708A] font-medium"><Loader2 className="w-4 h-4 animate-spin inline mr-2" />Loading...</td></tr>
              ) : transfers.length === 0 ? (
                <tr><td colSpan={5} className="px-4 py-10 text-center text-sm text-[#66708A] font-medium">No stock transfers yet.</td></tr>
              ) : (
                transfers.map((t) => (
                  <tr key={t.id} className="border-b border-[#E7EAF3] last:border-b-0 hover:bg-[#F8F9FC] transition-colors">
                    <td className="px-4 py-3 text-[13px] font-bold text-[#5425F5]">{t.reference}</td>
                    <td className="px-4 py-3 text-[13px] font-semibold text-[#17203D]">{t.product?.name || '—'}</td>
                    <td className="px-4 py-3 text-[12px] text-[#66708A]">
                      <span className="flex items-center gap-1.5">{t.source_warehouse?.name} <ArrowRight className="w-3 h-3 shrink-0" /> {t.destination_warehouse?.name}</span>
                    </td>
                    <td className="px-4 py-3 text-[13px] font-bold text-[#17203D]">{t.quantity}</td>
                    <td className="px-4 py-3">
                      <select
                        value={t.status}
                        onChange={(e) => updateStatus(t.id, e.target.value)}
                        className={`text-[11px] font-bold px-2 py-1 rounded-full border-0 cursor-pointer ${STATUS_BADGE[t.status] || 'bg-slate-100 text-slate-700'}`}
                      >
                        {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                      </select>
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
              <h3 className="text-base font-semibold text-[#17203D]">New Stock Transfer</h3>
              <button onClick={() => setModalOpen(false)} className="p-1 text-[#66708A] hover:text-[#17203D]"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={submit} className="p-5 space-y-4">
              {formError && <div className="bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold px-3 py-2.5 rounded-lg">{formError}</div>}
              <div>
                <label className="block text-[12px] font-semibold text-[#17203D] mb-1.5">Source Warehouse</label>
                <select required value={form.source_warehouse_id} onChange={(e) => setForm({ ...form, source_warehouse_id: e.target.value })} className="w-full h-10 px-3 border border-[#DDE2EE] rounded-lg text-[13px] focus:outline-hidden focus:border-[#5425F5]">
                  <option value="">Select warehouse</option>
                  {warehouses.map((w) => <option key={w.id} value={w.id}>{w.name}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-[12px] font-semibold text-[#17203D] mb-1.5">Destination Warehouse</label>
                <select required value={form.destination_warehouse_id} onChange={(e) => setForm({ ...form, destination_warehouse_id: e.target.value })} className="w-full h-10 px-3 border border-[#DDE2EE] rounded-lg text-[13px] focus:outline-hidden focus:border-[#5425F5]">
                  <option value="">Select warehouse</option>
                  {warehouses.map((w) => <option key={w.id} value={w.id}>{w.name}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-[12px] font-semibold text-[#17203D] mb-1.5">Product</label>
                <select required value={form.product_id} onChange={(e) => setForm({ ...form, product_id: e.target.value })} className="w-full h-10 px-3 border border-[#DDE2EE] rounded-lg text-[13px] focus:outline-hidden focus:border-[#5425F5]">
                  <option value="">Select product</option>
                  {products.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-[12px] font-semibold text-[#17203D] mb-1.5">Quantity</label>
                <input required type="number" min={1} value={form.quantity} onChange={(e) => setForm({ ...form, quantity: Number(e.target.value) })} className="w-full h-10 px-3 border border-[#DDE2EE] rounded-lg text-[13px] focus:outline-hidden focus:border-[#5425F5]" />
              </div>
              <div>
                <label className="block text-[12px] font-semibold text-[#17203D] mb-1.5">Notes</label>
                <textarea rows={2} value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} className="w-full px-3 py-2 border border-[#DDE2EE] rounded-lg text-[13px] focus:outline-hidden focus:border-[#5425F5] resize-none" />
              </div>
              <button type="submit" disabled={saving} className="w-full bg-[#5425F5] hover:bg-[#6D3CFF] text-white font-semibold text-[13px] py-2.5 rounded-lg transition-colors disabled:opacity-60">
                {saving ? 'Creating...' : 'Create Transfer'}
              </button>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
