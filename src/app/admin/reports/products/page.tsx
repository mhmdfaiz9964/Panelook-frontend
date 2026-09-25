'use client';

import React, { useEffect, useState } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { adminFetch } from '@/lib/adminApi';
import { Loader2, Trophy } from 'lucide-react';

interface Row { product_name: string; units_sold: number; revenue: number; }

export default function ProductReportPage() {
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await adminFetch('/admin/reports/products');
        const json = await res.json();
        if (json.success) setRows(json.data);
      } catch { /* empty state shown if unreachable */ }
      setLoading(false);
    })();
  }, []);

  return (
    <AdminLayout title="Product Reports">
      <p className="text-sm text-[#66708A] font-medium mb-5">Best-selling products by units sold and revenue, computed from actual order line items.</p>

      <div className="bg-white rounded-xl border border-[#E7EAF3] shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-[#F8F9FC] border-b border-[#E7EAF3]">
                <th className="px-4 py-3 text-[11px] font-bold text-[#66708A] uppercase tracking-wider">Rank</th>
                <th className="px-4 py-3 text-[11px] font-bold text-[#66708A] uppercase tracking-wider">Product</th>
                <th className="px-4 py-3 text-[11px] font-bold text-[#66708A] uppercase tracking-wider">Units Sold</th>
                <th className="px-4 py-3 text-[11px] font-bold text-[#66708A] uppercase tracking-wider">Revenue</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={4} className="px-4 py-10 text-center text-sm text-[#66708A] font-medium"><Loader2 className="w-4 h-4 animate-spin inline mr-2" />Loading...</td></tr>
              ) : rows.length === 0 ? (
                <tr><td colSpan={4} className="px-4 py-10 text-center text-sm text-[#66708A] font-medium">No sales data yet.</td></tr>
              ) : (
                rows.map((r, i) => (
                  <tr key={r.product_name} className="border-b border-[#E7EAF3] last:border-b-0 hover:bg-[#F8F9FC] transition-colors">
                    <td className="px-4 py-3">
                      {i < 3 ? <Trophy className={`w-4 h-4 ${i === 0 ? 'text-amber-500' : i === 1 ? 'text-slate-400' : 'text-orange-700'}`} /> : <span className="text-[13px] text-[#66708A]">#{i + 1}</span>}
                    </td>
                    <td className="px-4 py-3 text-[13px] font-semibold text-[#17203D]">{r.product_name}</td>
                    <td className="px-4 py-3 text-[13px] text-[#66708A]">{r.units_sold}</td>
                    <td className="px-4 py-3 text-[13px] font-bold text-[#17203D]">LKR {Number(r.revenue).toLocaleString()}</td>
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
