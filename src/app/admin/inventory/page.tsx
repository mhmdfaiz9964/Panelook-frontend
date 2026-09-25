'use client';

import React, { useEffect, useState } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { adminFetch } from '@/lib/adminApi';
import { Loader2, Search, PackagePlus, X } from 'lucide-react';

interface ProductRow {
  id: number;
  name: string;
  sku: string;
  main_image: string;
  stock_quantity: number;
  min_stock: number;
}

export default function AdminStockManagementPage() {
  const [products, setProducts] = useState<ProductRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [error, setError] = useState('');
  const [adjustTarget, setAdjustTarget] = useState<ProductRow | null>(null);
  const [changeQty, setChangeQty] = useState(0);
  const [reason, setReason] = useState('stock_in');
  const [saving, setSaving] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const res = await adminFetch(`/admin/products${search ? `?search=${encodeURIComponent(search)}` : ''}`);
      const json = await res.json();
      if (json.success) setProducts(json.data.data);
      else setError('Could not load stock data.');
    } catch {
      setError('Backend API is unreachable.');
    }
    setLoading(false);
  };

  useEffect(() => {
    const t = setTimeout(load, 300);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  const totalUnits = products.reduce((s, p) => s + p.stock_quantity, 0);
  const inStockCount = products.filter((p) => p.stock_quantity > p.min_stock).length;
  const lowStockCount = products.filter((p) => p.stock_quantity > 0 && p.stock_quantity <= p.min_stock).length;
  const outStockCount = products.filter((p) => p.stock_quantity === 0).length;

  const openAdjust = (p: ProductRow) => {
    setAdjustTarget(p);
    setChangeQty(0);
    setReason('stock_in');
  };

  const submitAdjust = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!adjustTarget) return;
    setSaving(true);
    try {
      const res = await adminFetch('/admin/inventory/update', {
        method: 'POST',
        body: JSON.stringify({ product_id: adjustTarget.id, change_quantity: changeQty, reason }),
      });
      const json = await res.json();
      if (json.success) {
        setAdjustTarget(null);
        load();
      } else {
        alert(json.message || 'Could not update stock.');
      }
    } catch {
      alert('Could not reach the backend API.');
    }
    setSaving(false);
  };

  return (
    <AdminLayout title="Stock Management">
      <p className="text-sm text-[#66708A] font-medium mb-5">Live stock levels across your product catalogue.</p>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
        <div className="bg-white p-4 rounded-xl border border-[#E7EAF3] shadow-2xs">
          <span className="text-[12px] font-semibold text-[#66708A]">Total Units</span>
          <div className="text-[20px] font-bold text-[#17203D] mt-1">{totalUnits}</div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-[#E7EAF3] shadow-2xs">
          <span className="text-[12px] font-semibold text-[#66708A]">In Stock</span>
          <div className="text-[20px] font-bold text-emerald-600 mt-1">{inStockCount}</div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-[#E7EAF3] shadow-2xs">
          <span className="text-[12px] font-semibold text-[#66708A]">Low Stock</span>
          <div className="text-[20px] font-bold text-amber-600 mt-1">{lowStockCount}</div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-[#E7EAF3] shadow-2xs">
          <span className="text-[12px] font-semibold text-[#66708A]">Out of Stock</span>
          <div className="text-[20px] font-bold text-rose-600 mt-1">{outStockCount}</div>
        </div>
      </div>

      <div className="relative max-w-sm mb-4">
        <Search className="w-4 h-4 text-[#66708A] absolute left-3 top-3" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search products..."
          className="w-full pl-9 pr-4 h-10 border border-[#DDE2EE] rounded-lg text-[13px] focus:outline-hidden focus:border-[#5425F5]"
        />
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
                <th className="px-4 py-3 text-[11px] font-bold text-[#66708A] uppercase tracking-wider">SKU</th>
                <th className="px-4 py-3 text-[11px] font-bold text-[#66708A] uppercase tracking-wider">Current Stock</th>
                <th className="px-4 py-3 text-[11px] font-bold text-[#66708A] uppercase tracking-wider">Minimum</th>
                <th className="px-4 py-3 text-[11px] font-bold text-[#66708A] uppercase tracking-wider">Status</th>
                <th className="px-4 py-3 text-[11px] font-bold text-[#66708A] uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={6} className="px-4 py-10 text-center text-sm text-[#66708A] font-medium"><Loader2 className="w-4 h-4 animate-spin inline mr-2" />Loading...</td></tr>
              ) : products.length === 0 ? (
                <tr><td colSpan={6} className="px-4 py-10 text-center text-sm text-[#66708A] font-medium">No products found.</td></tr>
              ) : (
                products.map((p) => {
                  const isOut = p.stock_quantity === 0;
                  const isLow = !isOut && p.stock_quantity <= p.min_stock;
                  return (
                    <tr key={p.id} className="border-b border-[#E7EAF3] last:border-b-0 hover:bg-[#F8F9FC] transition-colors">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <img src={p.main_image} alt="" className="w-9 h-9 rounded-lg object-contain bg-slate-50 border border-[#E7EAF3] p-1" />
                          <span className="text-[13px] font-semibold text-[#17203D]">{p.name}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-[12px] text-[#66708A] font-mono">{p.sku}</td>
                      <td className="px-4 py-3 text-[14px] font-bold text-[#17203D]">{p.stock_quantity}</td>
                      <td className="px-4 py-3 text-[13px] text-[#66708A]">{p.min_stock}</td>
                      <td className="px-4 py-3">
                        <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${isOut ? 'bg-rose-100 text-rose-800' : isLow ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'}`}>
                          {isOut ? 'Out of Stock' : isLow ? 'Low Stock' : 'In Stock'}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <button
                          onClick={() => openAdjust(p)}
                          className="inline-flex items-center gap-1.5 text-[11px] font-bold text-[#5425F5] hover:bg-purple-50 px-2.5 py-1.5 rounded-lg"
                        >
                          <PackagePlus className="w-3.5 h-3.5" />
                          Adjust
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {adjustTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs" onClick={() => setAdjustTarget(null)} />
          <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-sm">
            <div className="px-5 py-4 border-b border-[#E7EAF3] flex items-center justify-between">
              <h3 className="text-base font-semibold text-[#17203D]">Adjust Stock</h3>
              <button onClick={() => setAdjustTarget(null)} className="p-1 text-[#66708A] hover:text-[#17203D]"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={submitAdjust} className="p-5 space-y-4">
              <p className="text-[13px] font-semibold text-[#17203D]">{adjustTarget.name}</p>

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
                <label className="block text-[12px] font-semibold text-[#17203D] mb-1.5">Quantity Change (use negative to reduce)</label>
                <input
                  type="number"
                  value={changeQty}
                  onChange={(e) => setChangeQty(Number(e.target.value))}
                  className="w-full h-10 px-3 border border-[#DDE2EE] rounded-lg text-[13px] focus:outline-hidden focus:border-[#5425F5]"
                />
              </div>

              <div className="bg-[#F8F9FC] rounded-lg p-3 text-[13px] flex items-center justify-between">
                <span className="text-[#66708A]">Current: <b className="text-[#17203D]">{adjustTarget.stock_quantity}</b></span>
                <span className="text-[#66708A]">Change: <b className={changeQty >= 0 ? 'text-emerald-600' : 'text-rose-600'}>{changeQty >= 0 ? '+' : ''}{changeQty}</b></span>
                <span className="text-[#66708A]">New: <b className="text-[#17203D]">{Math.max(0, adjustTarget.stock_quantity + changeQty)}</b></span>
              </div>

              <button type="submit" disabled={saving} className="w-full bg-[#5425F5] hover:bg-[#6D3CFF] text-white font-semibold text-[13px] py-2.5 rounded-lg transition-colors disabled:opacity-60">
                {saving ? 'Saving...' : 'Apply Adjustment'}
              </button>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
