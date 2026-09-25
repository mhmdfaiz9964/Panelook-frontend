'use client';

import React, { useEffect, useState } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { adminFetch } from '@/lib/adminApi';
import { Loader2, Plus, X } from 'lucide-react';

interface LogRow {
  id: number;
  previous_quantity: number;
  change_quantity: number;
  new_quantity: number;
  reason: string;
  created_at: string;
  product?: { name: string; sku: string };
  user?: { name: string };
}

interface ProductOption { id: number; name: string; stock_quantity: number; }

const REASON_LABEL: Record<string, string> = {
  stock_in: 'Stock In',
  sale: 'Sale',
  adjustment: 'Adjustment',
  damaged: 'Damage',
  returned: 'Return',
  correction: 'Correction',
};

export default function AdminStockAdjustmentsPage() {
  const [logs, setLogs] = useState<LogRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [products, setProducts] = useState<ProductOption[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [productId, setProductId] = useState('');
  const [changeQty, setChangeQty] = useState(0);
  const [reason, setReason] = useState('adjustment');
  const [saving, setSaving] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const res = await adminFetch('/admin/inventory');
      const json = await res.json();
      if (json.success) setLogs(json.data.data);
      else setError('Could not load adjustment history.');
    } catch {
      setError('Backend API is unreachable.');
    }
    setLoading(false);
  };

  useEffect(() => {
    load();
    (async () => {
      try {
        const res = await adminFetch('/admin/products');
        const json = await res.json();
        if (json.success) setProducts(json.data.data);
      } catch { /* dropdown just stays empty */ }
    })();
  }, []);

  const selectedProduct = products.find((p) => String(p.id) === productId);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await adminFetch('/admin/inventory/update', {
        method: 'POST',
        body: JSON.stringify({ product_id: Number(productId), change_quantity: changeQty, reason }),
      });
      const json = await res.json();
      if (json.success) {
        setModalOpen(false);
        setProductId('');
        setChangeQty(0);
        load();
      } else {
        alert(json.message || 'Could not save adjustment.');
      }
    } catch {
      alert('Could not reach the backend API.');
    }
    setSaving(false);
  };

  return (
    <AdminLayout title="Stock Adjustments">
      <div className="flex items-center justify-between mb-5 gap-4 flex-wrap">
        <p className="text-sm text-[#66708A] font-medium">Full history of manual stock corrections.</p>
        <button
          onClick={() => setModalOpen(true)}
          className="flex items-center gap-1.5 bg-[#5425F5] hover:bg-[#6D3CFF] text-white font-semibold text-[13px] px-4 py-2.5 rounded-lg shadow-xs transition-colors"
        >
          <Plus className="w-4 h-4" /> New Adjustment
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
                <th className="px-4 py-3 text-[11px] font-bold text-[#66708A] uppercase tracking-wider">Product</th>
                <th className="px-4 py-3 text-[11px] font-bold text-[#66708A] uppercase tracking-wider">Reason</th>
                <th className="px-4 py-3 text-[11px] font-bold text-[#66708A] uppercase tracking-wider">Previous</th>
                <th className="px-4 py-3 text-[11px] font-bold text-[#66708A] uppercase tracking-wider">Change</th>
                <th className="px-4 py-3 text-[11px] font-bold text-[#66708A] uppercase tracking-wider">New</th>
                <th className="px-4 py-3 text-[11px] font-bold text-[#66708A] uppercase tracking-wider">By</th>
                <th className="px-4 py-3 text-[11px] font-bold text-[#66708A] uppercase tracking-wider">Date</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={7} className="px-4 py-10 text-center text-sm text-[#66708A] font-medium"><Loader2 className="w-4 h-4 animate-spin inline mr-2" />Loading...</td></tr>
              ) : logs.length === 0 ? (
                <tr><td colSpan={7} className="px-4 py-10 text-center text-sm text-[#66708A] font-medium">No stock adjustments recorded yet.</td></tr>
              ) : (
                logs.map((l) => (
                  <tr key={l.id} className="border-b border-[#E7EAF3] last:border-b-0 hover:bg-[#F8F9FC] transition-colors">
                    <td className="px-4 py-3 text-[13px] font-semibold text-[#17203D]">{l.product?.name || '—'}</td>
                    <td className="px-4 py-3 text-[12px] text-[#66708A] capitalize">{REASON_LABEL[l.reason] || l.reason}</td>
                    <td className="px-4 py-3 text-[13px] text-[#66708A]">{l.previous_quantity}</td>
                    <td className={`px-4 py-3 text-[13px] font-bold ${l.change_quantity >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                      {l.change_quantity >= 0 ? '+' : ''}{l.change_quantity}
                    </td>
                    <td className="px-4 py-3 text-[13px] font-bold text-[#17203D]">{l.new_quantity}</td>
                    <td className="px-4 py-3 text-[12px] text-[#66708A]">{l.user?.name || 'System'}</td>
                    <td className="px-4 py-3 text-[12px] text-[#66708A]">{new Date(l.created_at).toLocaleString('en-GB')}</td>
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
              <h3 className="text-base font-semibold text-[#17203D]">New Stock Adjustment</h3>
              <button onClick={() => setModalOpen(false)} className="p-1 text-[#66708A] hover:text-[#17203D]"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={submit} className="p-5 space-y-4">
              <div>
                <label className="block text-[12px] font-semibold text-[#17203D] mb-1.5">Product</label>
                <select required value={productId} onChange={(e) => setProductId(e.target.value)} className="w-full h-10 px-3 border border-[#DDE2EE] rounded-lg text-[13px] focus:outline-hidden focus:border-[#5425F5]">
                  <option value="">Select product</option>
                  {products.map((p) => <option key={p.id} value={p.id}>{p.name} (current: {p.stock_quantity})</option>)}
                </select>
              </div>
              <div>
                <label className="block text-[12px] font-semibold text-[#17203D] mb-1.5">Adjustment Type</label>
                <select value={reason} onChange={(e) => setReason(e.target.value)} className="w-full h-10 px-3 border border-[#DDE2EE] rounded-lg text-[13px] focus:outline-hidden focus:border-[#5425F5]">
                  <option value="stock_in">Stock In</option>
                  <option value="damaged">Damage</option>
                  <option value="returned">Return</option>
                  <option value="correction">Correction</option>
                </select>
              </div>
              <div>
                <label className="block text-[12px] font-semibold text-[#17203D] mb-1.5">Quantity (negative to reduce)</label>
                <input type="number" value={changeQty} onChange={(e) => setChangeQty(Number(e.target.value))} className="w-full h-10 px-3 border border-[#DDE2EE] rounded-lg text-[13px] focus:outline-hidden focus:border-[#5425F5]" />
              </div>
              {selectedProduct && (
                <div className="bg-[#F8F9FC] rounded-lg p-3 text-[13px] flex items-center justify-between">
                  <span className="text-[#66708A]">Current: <b className="text-[#17203D]">{selectedProduct.stock_quantity}</b></span>
                  <span className="text-[#66708A]">New: <b className="text-[#17203D]">{Math.max(0, selectedProduct.stock_quantity + changeQty)}</b></span>
                </div>
              )}
              <button type="submit" disabled={saving || !productId} className="w-full bg-[#5425F5] hover:bg-[#6D3CFF] text-white font-semibold text-[13px] py-2.5 rounded-lg transition-colors disabled:opacity-60">
                {saving ? 'Saving...' : 'Apply Adjustment'}
              </button>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
