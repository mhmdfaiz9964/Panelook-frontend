'use client';

import React, { useEffect, useState } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { adminFetch } from '@/lib/adminApi';
import { Loader2 } from 'lucide-react';

interface TopCustomer { customer_name: string; customer_phone: string; order_count: number; total_spent: number; }

export default function CustomerReportPage() {
  const [data, setData] = useState<{ total_customers: number; top_customers: TopCustomer[] } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await adminFetch('/admin/reports/customers');
        const json = await res.json();
        if (json.success) setData(json.data);
      } catch { /* stays loading if unreachable */ }
      setLoading(false);
    })();
  }, []);

  return (
    <AdminLayout title="Customer Reports">
      <p className="text-sm text-[#66708A] font-medium mb-5">Top customers ranked by lifetime order value.</p>

      {loading ? (
        <div className="bg-white rounded-xl border border-[#E7EAF3] p-10 text-center text-sm text-[#66708A] font-medium"><Loader2 className="w-4 h-4 animate-spin inline mr-2" />Loading...</div>
      ) : data && (
        <>
          <div className="bg-white p-4 rounded-xl border border-[#E7EAF3] shadow-2xs mb-5 max-w-xs">
            <span className="text-[12px] font-semibold text-[#66708A]">Registered Customer Accounts</span>
            <div className="text-[20px] font-bold text-[#17203D] mt-1">{data.total_customers}</div>
          </div>

          <div className="bg-white rounded-xl border border-[#E7EAF3] shadow-2xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-[#F8F9FC] border-b border-[#E7EAF3]">
                    <th className="px-4 py-3 text-[11px] font-bold text-[#66708A] uppercase tracking-wider">Customer</th>
                    <th className="px-4 py-3 text-[11px] font-bold text-[#66708A] uppercase tracking-wider">Phone</th>
                    <th className="px-4 py-3 text-[11px] font-bold text-[#66708A] uppercase tracking-wider">Orders</th>
                    <th className="px-4 py-3 text-[11px] font-bold text-[#66708A] uppercase tracking-wider">Total Spent</th>
                  </tr>
                </thead>
                <tbody>
                  {data.top_customers.length === 0 ? (
                    <tr><td colSpan={4} className="px-4 py-10 text-center text-sm text-[#66708A] font-medium">No orders recorded yet.</td></tr>
                  ) : (
                    data.top_customers.map((c) => (
                      <tr key={c.customer_phone} className="border-b border-[#E7EAF3] last:border-b-0 hover:bg-[#F8F9FC] transition-colors">
                        <td className="px-4 py-3 text-[13px] font-semibold text-[#17203D]">{c.customer_name}</td>
                        <td className="px-4 py-3 text-[13px] text-[#66708A]">{c.customer_phone}</td>
                        <td className="px-4 py-3 text-[13px] text-[#66708A]">{c.order_count}</td>
                        <td className="px-4 py-3 text-[13px] font-bold text-[#17203D]">LKR {Number(c.total_spent).toLocaleString()}</td>
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
