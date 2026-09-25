'use client';

import React, { useEffect, useState } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { adminFetch } from '@/lib/adminApi';
import { Loader2, Plus, X, Trash2, PackageCheck } from 'lucide-react';

interface Option { id: number; name: string; }
interface POItem { id: number; product_id: number; quantity: number; received_quantity: number; unit_cost: number; subtotal: number; product?: Option; }
interface PORow {
  id: number;
  po_number: string;
  order_date: string;
  expected_date: string | null;
  total: number;
  status: string;
  supplier?: Option;
  warehouse?: Option;
  items?: POItem[];
}

const STATUSES = ['Draft', 'Ordered', 'Partially Received', 'Received', 'Cancelled'];
const STATUS_BADGE: Record<string, string> = {
  Draft: 'bg-slate-200 text-slate-700',
  Ordered: 'bg-blue-100 text-blue-800',
  'Partially Received': 'bg-amber-100 text-amber-800',
  Received: 'bg-emerald-100 text-emerald-800',
  Cancelled: 'bg-rose-100 text-rose-800',
};

const emptyLine = { product_id: '', quantity: 1, unit_cost: '' };

export default function AdminPurchaseOrdersPage() {
  const [orders, setOrders] = useState<PORow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [suppliers, setSuppliers] = useState<Option[]>([]);
  const [warehouses, setWarehouses] = useState<Option[]>([]);
  const [products, setProducts] = useState<Option[]>([]);

  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState<any>({ supplier_id: '', warehouse_id: '', order_date: new Date().toISOString().slice(0, 10), expected_date: '', notes: '' });
  const [lines, setLines] = useState([{ ...emptyLine }]);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState('');

  const [receiveTarget, setReceiveTarget] = useState<PORow | null>(null);
  const [receiveQtys, setReceiveQtys] = useState<Record<number, number>>({});
  const [receiving, setReceiving] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const res = await adminFetch('/admin/purchase-orders');
      const json = await res.json();
      if (json.success) setOrders(json.data);
      else setError('Could not load purchase orders.');
    } catch {
      setError('Backend API is unreachable.');
    }
    setLoading(false);
  };

  useEffect(() => {
    load();
    (async () => {
      try {
        const [s, w, p] = await Promise.all([
          adminFetch('/admin/suppliers').then((r) => r.json()),
          adminFetch('/admin/warehouses').then((r) => r.json()),
          adminFetch('/admin/products').then((r) => r.json()),
        ]);
        if (s.success) setSuppliers(s.data);
        if (w.success) setWarehouses(w.data);
        if (p.success) setProducts(p.data.data);
      } catch { /* dropdowns stay empty */ }
    })();
  }, []);

  const addLine = () => setLines([...lines, { ...emptyLine }]);
  const removeLine = (idx: number) => setLines(lines.filter((_, i) => i !== idx));
  const updateLine = (idx: number, key: string, value: any) => {
    const next = [...lines];
    (next[idx] as any)[key] = value;
    setLines(next);
  };

  const lineTotal = lines.reduce((sum, l) => sum + (Number(l.quantity) || 0) * (Number(l.unit_cost) || 0), 0);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setFormError('');
    try {
      const res = await adminFetch('/admin/purchase-orders', {
        method: 'POST',
        body: JSON.stringify({
          ...form,
          items: lines.map((l) => ({ product_id: Number(l.product_id), quantity: Number(l.quantity), unit_cost: Number(l.unit_cost) })),
        }),
      });
      const json = await res.json();
      if (json.success) {
        setModalOpen(false);
        setForm({ supplier_id: '', warehouse_id: '', order_date: new Date().toISOString().slice(0, 10), expected_date: '', notes: '' });
        setLines([{ ...emptyLine }]);
        load();
      } else {
        setFormError(json.message || 'Could not create purchase order.');
      }
    } catch {
      setFormError('Could not reach the backend API.');
    }
    setSaving(false);
  };

  const updateStatus = async (id: number, status: string) => {
    try {
      const res = await adminFetch(`/admin/purchase-orders/${id}/status`, { method: 'POST', body: JSON.stringify({ status }) });
      const json = await res.json();
      if (json.success) load();
    } catch {
      alert('Could not reach the backend API.');
    }
  };

  const openReceive = async (po: PORow) => {
    try {
      const res = await adminFetch(`/admin/purchase-orders/${po.id}`);
      const json = await res.json();
      if (json.success) {
        setReceiveTarget(json.data);
        const initial: Record<number, number> = {};
        json.data.items.forEach((i: POItem) => { initial[i.id] = Math.max(0, i.quantity - i.received_quantity); });
        setReceiveQtys(initial);
      }
    } catch {
      alert('Could not load purchase order details.');
    }
  };

  const submitReceive = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!receiveTarget) return;
    setReceiving(true);
    try {
      const res = await adminFetch(`/admin/purchase-orders/${receiveTarget.id}/receive`, {
        method: 'POST',
        body: JSON.stringify({
          items: Object.entries(receiveQtys).map(([id, qty]) => ({ purchase_order_item_id: Number(id), received_quantity: qty })),
        }),
      });
      const json = await res.json();
      if (json.success) {
        setReceiveTarget(null);
        load();
      } else {
        alert(json.message || 'Could not record receipt.');
      }
    } catch {
      alert('Could not reach the backend API.');
    }
    setReceiving(false);
  };

  return (
    <AdminLayout title="Purchase Orders">
      <div className="flex items-center justify-between mb-5 gap-4 flex-wrap">
        <p className="text-sm text-[#66708A] font-medium">Orders placed with suppliers to restock inventory.</p>
        <button onClick={() => setModalOpen(true)} className="flex items-center gap-1.5 bg-[#5425F5] hover:bg-[#6D3CFF] text-white font-semibold text-[13px] px-4 py-2.5 rounded-lg shadow-xs transition-colors">
          <Plus className="w-4 h-4" /> New Purchase Order
        </button>
      </div>

      {error && <div className="mb-4 bg-amber-50 border border-amber-200 text-amber-800 text-xs font-semibold px-4 py-3 rounded-xl">{error}</div>}

      <div className="bg-white rounded-xl border border-[#E7EAF3] shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-[#F8F9FC] border-b border-[#E7EAF3]">
                <th className="px-4 py-3 text-[11px] font-bold text-[#66708A] uppercase tracking-wider">PO Number</th>
                <th className="px-4 py-3 text-[11px] font-bold text-[#66708A] uppercase tracking-wider">Supplier</th>
                <th className="px-4 py-3 text-[11px] font-bold text-[#66708A] uppercase tracking-wider">Order Date</th>
                <th className="px-4 py-3 text-[11px] font-bold text-[#66708A] uppercase tracking-wider">Total</th>
                <th className="px-4 py-3 text-[11px] font-bold text-[#66708A] uppercase tracking-wider">Status</th>
                <th className="px-4 py-3 text-[11px] font-bold text-[#66708A] uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={6} className="px-4 py-10 text-center text-sm text-[#66708A] font-medium"><Loader2 className="w-4 h-4 animate-spin inline mr-2" />Loading...</td></tr>
              ) : orders.length === 0 ? (
                <tr><td colSpan={6} className="px-4 py-10 text-center text-sm text-[#66708A] font-medium">No purchase orders yet.</td></tr>
              ) : (
                orders.map((po) => (
                  <tr key={po.id} className="border-b border-[#E7EAF3] last:border-b-0 hover:bg-[#F8F9FC] transition-colors">
                    <td className="px-4 py-3 text-[13px] font-bold text-[#5425F5]">{po.po_number}</td>
                    <td className="px-4 py-3 text-[13px] text-[#17203D]">{po.supplier?.name || '—'}</td>
                    <td className="px-4 py-3 text-[12px] text-[#66708A]">{po.order_date}</td>
                    <td className="px-4 py-3 text-[13px] font-bold text-[#17203D]">LKR {Number(po.total).toLocaleString()}</td>
                    <td className="px-4 py-3">
                      <select
                        value={po.status}
                        onChange={(e) => updateStatus(po.id, e.target.value)}
                        className={`text-[11px] font-bold px-2 py-1 rounded-full border-0 cursor-pointer ${STATUS_BADGE[po.status] || 'bg-slate-100 text-slate-700'}`}
                      >
                        {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </td>
                    <td className="px-4 py-3 text-right">
                      {po.status !== 'Received' && po.status !== 'Cancelled' && (
                        <button onClick={() => openReceive(po)} className="inline-flex items-center gap-1.5 text-[11px] font-bold text-[#5425F5] hover:bg-purple-50 px-2.5 py-1.5 rounded-lg">
                          <PackageCheck className="w-3.5 h-3.5" /> Receive
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
          <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-xl max-h-[88vh] overflow-y-auto">
            <div className="px-5 py-4 border-b border-[#E7EAF3] flex items-center justify-between sticky top-0 bg-white">
              <h3 className="text-base font-semibold text-[#17203D]">New Purchase Order</h3>
              <button onClick={() => setModalOpen(false)} className="p-1 text-[#66708A] hover:text-[#17203D]"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={submit} className="p-5 space-y-4">
              {formError && <div className="bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold px-3 py-2.5 rounded-lg">{formError}</div>}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[12px] font-semibold text-[#17203D] mb-1.5">Supplier</label>
                  <select required value={form.supplier_id} onChange={(e) => setForm({ ...form, supplier_id: e.target.value })} className="w-full h-10 px-3 border border-[#DDE2EE] rounded-lg text-[13px] focus:outline-hidden focus:border-[#5425F5]">
                    <option value="">Select supplier</option>
                    {suppliers.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-[12px] font-semibold text-[#17203D] mb-1.5">Warehouse</label>
                  <select value={form.warehouse_id} onChange={(e) => setForm({ ...form, warehouse_id: e.target.value })} className="w-full h-10 px-3 border border-[#DDE2EE] rounded-lg text-[13px] focus:outline-hidden focus:border-[#5425F5]">
                    <option value="">Select warehouse</option>
                    {warehouses.map((w) => <option key={w.id} value={w.id}>{w.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-[12px] font-semibold text-[#17203D] mb-1.5">Order Date</label>
                  <input required type="date" value={form.order_date} onChange={(e) => setForm({ ...form, order_date: e.target.value })} className="w-full h-10 px-3 border border-[#DDE2EE] rounded-lg text-[13px] focus:outline-hidden focus:border-[#5425F5]" />
                </div>
                <div>
                  <label className="block text-[12px] font-semibold text-[#17203D] mb-1.5">Expected Date</label>
                  <input type="date" value={form.expected_date} onChange={(e) => setForm({ ...form, expected_date: e.target.value })} className="w-full h-10 px-3 border border-[#DDE2EE] rounded-lg text-[13px] focus:outline-hidden focus:border-[#5425F5]" />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-[12px] font-semibold text-[#17203D]">Items</label>
                  <button type="button" onClick={addLine} className="text-[11px] font-bold text-[#5425F5] hover:underline flex items-center gap-1"><Plus className="w-3 h-3" /> Add Line</button>
                </div>
                <div className="space-y-2">
                  {lines.map((line, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <select required value={line.product_id} onChange={(e) => updateLine(idx, 'product_id', e.target.value)} className="flex-1 h-9 px-2 border border-[#DDE2EE] rounded-lg text-[12px] focus:outline-hidden focus:border-[#5425F5]">
                        <option value="">Product</option>
                        {products.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
                      </select>
                      <input required type="number" min={1} value={line.quantity} onChange={(e) => updateLine(idx, 'quantity', e.target.value)} placeholder="Qty" className="w-16 h-9 px-2 border border-[#DDE2EE] rounded-lg text-[12px] focus:outline-hidden focus:border-[#5425F5]" />
                      <input required type="number" min={0} value={line.unit_cost} onChange={(e) => updateLine(idx, 'unit_cost', e.target.value)} placeholder="Cost" className="w-24 h-9 px-2 border border-[#DDE2EE] rounded-lg text-[12px] focus:outline-hidden focus:border-[#5425F5]" />
                      <button type="button" onClick={() => removeLine(idx)} disabled={lines.length === 1} className="p-1.5 text-[#66708A] hover:text-rose-600 disabled:opacity-30"><Trash2 className="w-3.5 h-3.5" /></button>
                    </div>
                  ))}
                </div>
                <div className="text-right text-[13px] font-bold text-[#17203D] pt-2">Total: LKR {lineTotal.toLocaleString()}</div>
              </div>

              <div>
                <label className="block text-[12px] font-semibold text-[#17203D] mb-1.5">Notes</label>
                <textarea rows={2} value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} className="w-full px-3 py-2 border border-[#DDE2EE] rounded-lg text-[13px] focus:outline-hidden focus:border-[#5425F5] resize-none" />
              </div>

              <button type="submit" disabled={saving} className="w-full bg-[#5425F5] hover:bg-[#6D3CFF] text-white font-semibold text-[13px] py-2.5 rounded-lg transition-colors disabled:opacity-60">
                {saving ? 'Creating...' : 'Create Purchase Order'}
              </button>
            </form>
          </div>
        </div>
      )}

      {receiveTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs" onClick={() => setReceiveTarget(null)} />
          <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-md">
            <div className="px-5 py-4 border-b border-[#E7EAF3] flex items-center justify-between">
              <h3 className="text-base font-semibold text-[#17203D]">Receive {receiveTarget.po_number}</h3>
              <button onClick={() => setReceiveTarget(null)} className="p-1 text-[#66708A] hover:text-[#17203D]"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={submitReceive} className="p-5 space-y-4">
              {(receiveTarget.items || []).map((item) => {
                const remaining = item.quantity - item.received_quantity;
                return (
                  <div key={item.id} className="bg-[#F8F9FC] rounded-lg p-3">
                    <p className="text-[13px] font-semibold text-[#17203D]">{item.product?.name}</p>
                    <p className="text-[11px] text-[#66708A] mb-2">Ordered: {item.quantity} &middot; Already received: {item.received_quantity} &middot; Remaining: {remaining}</p>
                    <input
                      type="number"
                      min={0}
                      max={remaining}
                      value={receiveQtys[item.id] ?? 0}
                      onChange={(e) => setReceiveQtys({ ...receiveQtys, [item.id]: Number(e.target.value) })}
                      className="w-full h-9 px-3 border border-[#DDE2EE] rounded-lg text-[13px] focus:outline-hidden focus:border-[#5425F5]"
                    />
                  </div>
                );
              })}
              <button type="submit" disabled={receiving} className="w-full bg-[#5425F5] hover:bg-[#6D3CFF] text-white font-semibold text-[13px] py-2.5 rounded-lg transition-colors disabled:opacity-60">
                {receiving ? 'Recording...' : 'Confirm Receipt'}
              </button>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
