'use client';

import React, { useEffect, useState } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { adminFetch } from '@/lib/adminApi';
import { Loader2, Plus, X, Trash2, FileCheck } from 'lucide-react';

interface Option { id: number; name: string; selling_price?: number; }
interface QuoteItem { product_name: string; quantity: number; unit_price: number; }
interface QuoteRow {
  id: number;
  quote_number: string;
  customer_name: string;
  customer_phone: string;
  total: number;
  status: string;
  converted_order_id: number | null;
  items?: QuoteItem[];
}

const STATUSES = ['Draft', 'Sent', 'Accepted', 'Expired', 'Converted'];
const STATUS_BADGE: Record<string, string> = {
  Draft: 'bg-slate-200 text-slate-700',
  Sent: 'bg-blue-100 text-blue-800',
  Accepted: 'bg-emerald-100 text-emerald-800',
  Expired: 'bg-rose-100 text-rose-800',
  Converted: 'bg-purple-100 text-purple-800',
};

const emptyLine = { product_id: '', product_name: '', quantity: 1, unit_price: '' };

export default function AdminQuotesPage() {
  const [quotes, setQuotes] = useState<QuoteRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [products, setProducts] = useState<Option[]>([]);

  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState({ customer_name: '', customer_phone: '', customer_email: '', expiry_date: '', notes: '' });
  const [lines, setLines] = useState([{ ...emptyLine }]);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState('');

  const [convertTarget, setConvertTarget] = useState<QuoteRow | null>(null);
  const [convertForm, setConvertForm] = useState({ shipping_address: '', city: '', district: '' });
  const [converting, setConverting] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const res = await adminFetch('/admin/quotes');
      const json = await res.json();
      if (json.success) setQuotes(json.data);
      else setError('Could not load quotes.');
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
      } catch { /* dropdown stays empty */ }
    })();
  }, []);

  const addLine = () => setLines([...lines, { ...emptyLine }]);
  const removeLine = (idx: number) => setLines(lines.filter((_, i) => i !== idx));
  const updateLine = (idx: number, key: string, value: any) => {
    const next = [...lines];
    (next[idx] as any)[key] = value;
    if (key === 'product_id') {
      const p = products.find((pr) => String(pr.id) === value);
      if (p) {
        next[idx].product_name = p.name;
        next[idx].unit_price = String(p.selling_price ?? '');
      }
    }
    setLines(next);
  };

  const lineTotal = lines.reduce((sum, l) => sum + (Number(l.quantity) || 0) * (Number(l.unit_price) || 0), 0);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setFormError('');
    try {
      const res = await adminFetch('/admin/quotes', {
        method: 'POST',
        body: JSON.stringify({
          ...form,
          items: lines.map((l) => ({
            product_id: l.product_id ? Number(l.product_id) : null,
            product_name: l.product_name,
            quantity: Number(l.quantity),
            unit_price: Number(l.unit_price),
          })),
        }),
      });
      const json = await res.json();
      if (json.success) {
        setModalOpen(false);
        setForm({ customer_name: '', customer_phone: '', customer_email: '', expiry_date: '', notes: '' });
        setLines([{ ...emptyLine }]);
        load();
      } else {
        setFormError(json.message || 'Could not create quote.');
      }
    } catch {
      setFormError('Could not reach the backend API.');
    }
    setSaving(false);
  };

  const updateStatus = async (id: number, status: string) => {
    try {
      const res = await adminFetch(`/admin/quotes/${id}/status`, { method: 'POST', body: JSON.stringify({ status }) });
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
      const res = await adminFetch(`/admin/quotes/${convertTarget.id}/convert`, { method: 'POST', body: JSON.stringify(convertForm) });
      const json = await res.json();
      if (json.success) {
        setConvertTarget(null);
        setConvertForm({ shipping_address: '', city: '', district: '' });
        load();
      } else {
        alert(json.message || 'Could not convert quote.');
      }
    } catch {
      alert('Could not reach the backend API.');
    }
    setConverting(false);
  };

  return (
    <AdminLayout title="Quotes">
      <div className="flex items-center justify-between mb-5 gap-4 flex-wrap">
        <p className="text-sm text-[#66708A] font-medium">Price quotes for customers, convertible into real orders.</p>
        <button onClick={() => setModalOpen(true)} className="flex items-center gap-1.5 bg-[#5425F5] hover:bg-[#6D3CFF] text-white font-semibold text-[13px] px-4 py-2.5 rounded-lg shadow-xs transition-colors">
          <Plus className="w-4 h-4" /> New Quote
        </button>
      </div>

      {error && <div className="mb-4 bg-amber-50 border border-amber-200 text-amber-800 text-xs font-semibold px-4 py-3 rounded-xl">{error}</div>}

      <div className="bg-white rounded-xl border border-[#E7EAF3] shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-[#F8F9FC] border-b border-[#E7EAF3]">
                <th className="px-4 py-3 text-[11px] font-bold text-[#66708A] uppercase tracking-wider">Quote #</th>
                <th className="px-4 py-3 text-[11px] font-bold text-[#66708A] uppercase tracking-wider">Customer</th>
                <th className="px-4 py-3 text-[11px] font-bold text-[#66708A] uppercase tracking-wider">Total</th>
                <th className="px-4 py-3 text-[11px] font-bold text-[#66708A] uppercase tracking-wider">Status</th>
                <th className="px-4 py-3 text-[11px] font-bold text-[#66708A] uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={5} className="px-4 py-10 text-center text-sm text-[#66708A] font-medium"><Loader2 className="w-4 h-4 animate-spin inline mr-2" />Loading...</td></tr>
              ) : quotes.length === 0 ? (
                <tr><td colSpan={5} className="px-4 py-10 text-center text-sm text-[#66708A] font-medium">No quotes yet.</td></tr>
              ) : (
                quotes.map((q) => (
                  <tr key={q.id} className="border-b border-[#E7EAF3] last:border-b-0 hover:bg-[#F8F9FC] transition-colors">
                    <td className="px-4 py-3 text-[13px] font-bold text-[#5425F5]">{q.quote_number}</td>
                    <td className="px-4 py-3 text-[13px] text-[#17203D]">{q.customer_name}</td>
                    <td className="px-4 py-3 text-[13px] font-bold text-[#17203D]">LKR {Number(q.total).toLocaleString()}</td>
                    <td className="px-4 py-3">
                      <select
                        value={q.status}
                        onChange={(e) => updateStatus(q.id, e.target.value)}
                        disabled={!!q.converted_order_id}
                        className={`text-[11px] font-bold px-2 py-1 rounded-full border-0 cursor-pointer disabled:cursor-not-allowed ${STATUS_BADGE[q.status] || 'bg-slate-100 text-slate-700'}`}
                      >
                        {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </td>
                    <td className="px-4 py-3 text-right">
                      {q.converted_order_id ? (
                        <span className="text-[11px] font-bold text-emerald-600">Converted</span>
                      ) : (
                        <button onClick={() => setConvertTarget(q)} className="inline-flex items-center gap-1.5 text-[11px] font-bold text-[#5425F5] hover:bg-purple-50 px-2.5 py-1.5 rounded-lg">
                          <FileCheck className="w-3.5 h-3.5" /> Convert to Order
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
              <h3 className="text-base font-semibold text-[#17203D]">New Quote</h3>
              <button onClick={() => setModalOpen(false)} className="p-1 text-[#66708A] hover:text-[#17203D]"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={submit} className="p-5 space-y-4">
              {formError && <div className="bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold px-3 py-2.5 rounded-lg">{formError}</div>}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[12px] font-semibold text-[#17203D] mb-1.5">Customer Name</label>
                  <input required value={form.customer_name} onChange={(e) => setForm({ ...form, customer_name: e.target.value })} className="w-full h-10 px-3 border border-[#DDE2EE] rounded-lg text-[13px] focus:outline-hidden focus:border-[#5425F5]" />
                </div>
                <div>
                  <label className="block text-[12px] font-semibold text-[#17203D] mb-1.5">Phone</label>
                  <input value={form.customer_phone} onChange={(e) => setForm({ ...form, customer_phone: e.target.value })} className="w-full h-10 px-3 border border-[#DDE2EE] rounded-lg text-[13px] focus:outline-hidden focus:border-[#5425F5]" />
                </div>
                <div>
                  <label className="block text-[12px] font-semibold text-[#17203D] mb-1.5">Email</label>
                  <input value={form.customer_email} onChange={(e) => setForm({ ...form, customer_email: e.target.value })} className="w-full h-10 px-3 border border-[#DDE2EE] rounded-lg text-[13px] focus:outline-hidden focus:border-[#5425F5]" />
                </div>
                <div>
                  <label className="block text-[12px] font-semibold text-[#17203D] mb-1.5">Expiry Date</label>
                  <input type="date" value={form.expiry_date} onChange={(e) => setForm({ ...form, expiry_date: e.target.value })} className="w-full h-10 px-3 border border-[#DDE2EE] rounded-lg text-[13px] focus:outline-hidden focus:border-[#5425F5]" />
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
                      <select value={line.product_id} onChange={(e) => updateLine(idx, 'product_id', e.target.value)} className="flex-1 h-9 px-2 border border-[#DDE2EE] rounded-lg text-[12px] focus:outline-hidden focus:border-[#5425F5]">
                        <option value="">Custom item / select product</option>
                        {products.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
                      </select>
                      <input required value={line.product_name} onChange={(e) => updateLine(idx, 'product_name', e.target.value)} placeholder="Item name" className="w-32 h-9 px-2 border border-[#DDE2EE] rounded-lg text-[12px] focus:outline-hidden focus:border-[#5425F5]" />
                      <input required type="number" min={1} value={line.quantity} onChange={(e) => updateLine(idx, 'quantity', e.target.value)} placeholder="Qty" className="w-14 h-9 px-2 border border-[#DDE2EE] rounded-lg text-[12px] focus:outline-hidden focus:border-[#5425F5]" />
                      <input required type="number" min={0} value={line.unit_price} onChange={(e) => updateLine(idx, 'unit_price', e.target.value)} placeholder="Price" className="w-24 h-9 px-2 border border-[#DDE2EE] rounded-lg text-[12px] focus:outline-hidden focus:border-[#5425F5]" />
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
                {saving ? 'Creating...' : 'Create Quote'}
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
              <h3 className="text-base font-semibold text-[#17203D]">Convert Quote to Order</h3>
              <button onClick={() => setConvertTarget(null)} className="p-1 text-[#66708A] hover:text-[#17203D]"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={submitConvert} className="p-5 space-y-4">
              <p className="text-[13px] text-[#66708A]">{convertTarget.quote_number} &middot; {convertTarget.customer_name} &middot; LKR {Number(convertTarget.total).toLocaleString()}</p>
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
                {converting ? 'Converting...' : 'Convert to Order'}
              </button>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
