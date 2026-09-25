'use client';

import React, { useEffect, useState } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { adminFetch } from '@/lib/adminApi';
import { Loader2 } from 'lucide-react';

interface BySupplier { supplier_id: number; order_count: number; total_spent: number; supplier?: { name: string }; }

export default function PurchaseReportPage() {
  const [data, setData] = useState<{ total_orders: number; total_spent: number; by_supplier: BySupplier[] } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await adminFetch('/admin/reports/purchases');
        const json = await res.json();
        if (json.success) setData(json.data);
      } catch { /* stays loading if unreachable */ }
      setLoading(false);
    })();
  }, []);

  return (
    <AdminLayout title="Purchase Reports">
      <p className="text-sm text-[#66708A] font-medium mb-5">Purchase order spend broken down by supplier.</p>

      {loading ? (
        <div className="bg-white rounded-xl border border-[#E7EAF3] p-10 text-center text-sm text-[#66708A] font-medium"><Loader2 className="w-4 h-4 animate-spin inline mr-2" />Loading...</div>
      ) : data && (
        <>
          <div className="grid grid-cols-2 gap-4 mb-5 max-w-md">
            <div className="bg-white p-4 rounded-xl border border-[#E7EAF3] shadow-2xs">
              <span className="text-[12px] font-semibold text-[#66708A]">Total Purchase Orders</span>
              <div className="text-[20px] font-bold text-[#17203D] mt-1">{data.total_orders}</div>
            </div>
            <div className="bg-white p-4 rounded-xl border border-[#E7EAF3] shadow-2xs">
              <span className="text-[12px] font-semibold text-[#66708A]">Total Spent</span>
              <div className="text-[20px] font-bold text-[#17203D] mt-1">LKR {data.total_spent.toLocaleString()}</div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-[#E7EAF3] shadow-2xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-[#F8F9FC] border-b border-[#E7EAF3]">
                    <th className="px-4 py-3 text-[11px] font-bold text-[#66708A] uppercase tracking-wider">Supplier</th>
                    <th className="px-4 py-3 text-[11px] font-bold text-[#66708A] uppercase tracking-wider">Orders</th>
                    <th className="px-4 py-3 text-[11px] font-bold text-[#66708A] uppercase tracking-wider">Total Spent</th>
                  </tr>
                </thead>
                <tbody>
                  {data.by_supplier.length === 0 ? (
                    <tr><td colSpan={3} className="px-4 py-10 text-center text-sm text-[#66708A] font-medium">No purchase orders yet.</td></tr>
                  ) : (
                    data.by_supplier.map((s) => (
                      <tr key={s.supplier_id} className="border-b border-[#E7EAF3] last:border-b-0 hover:bg-[#F8F9FC] transition-colors">
                        <td className="px-4 py-3 text-[13px] font-semibold text-[#17203D]">{s.supplier?.name || '—'}</td>
                        <td className="px-4 py-3 text-[13px] text-[#66708A]">{s.order_count}</td>
                        <td className="px-4 py-3 text-[13px] font-bold text-[#17203D]">LKR {Number(s.total_spent).toLocaleString()}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </AdminLayout>
  );
}
