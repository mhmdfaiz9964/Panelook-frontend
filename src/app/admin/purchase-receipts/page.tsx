'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { adminFetch } from '@/lib/adminApi';
import { Loader2 } from 'lucide-react';

interface ReceiptItem { id: number; received_quantity: number; purchase_order_item?: { product?: { name: string } } }
interface ReceiptRow {
  id: number;
  receipt_number: string;
  received_date: string;
  purchase_order?: { po_number: string; supplier?: { name: string } };
  items?: ReceiptItem[];
  receiver?: { name: string };
}

export default function AdminPurchaseReceiptsPage() {
  const [receipts, setReceipts] = useState<ReceiptRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    (async () => {
      try {
        const res = await adminFetch('/admin/purchase-receipts');
        const json = await res.json();
        if (json.success) setReceipts(json.data);
        else setError('Could not load receipts.');
      } catch {
        setError('Backend API is unreachable.');
      }
      setLoading(false);
    })();
  }, []);

  return (
    <AdminLayout title="Receipts">
      <p className="text-sm text-[#66708A] font-medium mb-5">
        Goods-received records. New receipts are created from the &quot;Receive&quot; action on a{' '}
        <Link href="/admin/purchase-orders" className="text-[#5425F5] font-semibold hover:underline">Purchase Order</Link>.
      </p>

      {error && <div className="mb-4 bg-amber-50 border border-amber-200 text-amber-800 text-xs font-semibold px-4 py-3 rounded-xl">{error}</div>}

      <div className="bg-white rounded-xl border border-[#E7EAF3] shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-[#F8F9FC] border-b border-[#E7EAF3]">
                <th className="px-4 py-3 text-[11px] font-bold text-[#66708A] uppercase tracking-wider">Receipt #</th>
                <th className="px-4 py-3 text-[11px] font-bold text-[#66708A] uppercase tracking-wider">Purchase Order</th>
                <th className="px-4 py-3 text-[11px] font-bold text-[#66708A] uppercase tracking-wider">Supplier</th>
                <th className="px-4 py-3 text-[11px] font-bold text-[#66708A] uppercase tracking-wider">Items Received</th>
                <th className="px-4 py-3 text-[11px] font-bold text-[#66708A] uppercase tracking-wider">Received By</th>
                <th className="px-4 py-3 text-[11px] font-bold text-[#66708A] uppercase tracking-wider">Date</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={6} className="px-4 py-10 text-center text-sm text-[#66708A] font-medium"><Loader2 className="w-4 h-4 animate-spin inline mr-2" />Loading...</td></tr>
              ) : receipts.length === 0 ? (
                <tr><td colSpan={6} className="px-4 py-10 text-center text-sm text-[#66708A] font-medium">No receipts recorded yet.</td></tr>
              ) : (
                receipts.map((r) => (
                  <tr key={r.id} className="border-b border-[#E7EAF3] last:border-b-0 hover:bg-[#F8F9FC] transition-colors">
                    <td className="px-4 py-3 text-[13px] font-bold text-[#5425F5]">{r.receipt_number}</td>
                    <td className="px-4 py-3 text-[13px] text-[#17203D]">{r.purchase_order?.po_number || '—'}</td>
                    <td className="px-4 py-3 text-[13px] text-[#17203D]">{r.purchase_order?.supplier?.name || '—'}</td>
                    <td className="px-4 py-3 text-[12px] text-[#66708A]">
                      {(r.items || []).map((i) => `${i.purchase_order_item?.product?.name} (${i.received_quantity})`).join(', ') || '—'}
                    </td>
                    <td className="px-4 py-3 text-[13px] text-[#66708A]">{r.receiver?.name || 'System'}</td>
                    <td className="px-4 py-3 text-[12px] text-[#66708A]">{r.received_date}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
}
