'use client';

import React, { useEffect, useState } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { adminFetch } from '@/lib/adminApi';
import { Loader2 } from 'lucide-react';

interface SalesData {
  gross_sales: number;
  discounts: number;
  shipping: number;
  net_sales: number;
  order_count: number;
  average_order_value: number;
  by_day: { date: string; sales: number; orders: number }[];
}

export default function SalesReportPage() {
  const [data, setData] = useState<SalesData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await adminFetch('/admin/reports/sales');
        const json = await res.json();
        if (json.success) setData(json.data);
      } catch { /* card shows loading state indefinitely if unreachable */ }
      setLoading(false);
    })();
  }, []);

  const maxSales = data ? Math.max(...data.by_day.map((d) => d.sales), 1) : 1;

  return (
    <AdminLayout title="Sales Reports">
      <p className="text-sm text-[#66708A] font-medium mb-5">Revenue breakdown across all non-cancelled orders.</p>

      {loading ? (
        <div className="bg-white rounded-xl border border-[#E7EAF3] p-10 text-center text-sm text-[#66708A] font-medium"><Loader2 className="w-4 h-4 animate-spin inline mr-2" />Loading...</div>
      ) : data && (
        <>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {[
              { label: 'Gross Sales', value: data.gross_sales },
              { label: 'Discounts', value: data.discounts },
              { label: 'Shipping', value: data.shipping },
              { label: 'Net Sales', value: data.net_sales },
            ].map((c) => (
              <div key={c.label} className="bg-white p-4 rounded-xl border border-[#E7EAF3] shadow-2xs">
                <span className="text-[12px] font-semibold text-[#66708A]">{c.label}</span>
                <div className="text-[20px] font-bold text-[#17203D] mt-1">LKR {c.value.toLocaleString()}</div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
            <div className="bg-white p-4 rounded-xl border border-[#E7EAF3] shadow-2xs">
              <span className="text-[12px] font-semibold text-[#66708A]">Order Count</span>
              <div className="text-[20px] font-bold text-[#17203D] mt-1">{data.order_count}</div>
            </div>
            <div className="bg-white p-4 rounded-xl border border-[#E7EAF3] shadow-2xs">
              <span className="text-[12px] font-semibold text-[#66708A]">Average Order Value</span>
              <div className="text-[20px] font-bold text-[#17203D] mt-1">LKR {data.average_order_value.toLocaleString()}</div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-[#E7EAF3] shadow-2xs p-5">
            <h2 className="text-base font-semibold text-[#17203D] mb-4">Daily Sales</h2>
            {data.by_day.length === 0 ? (
              <p className="text-sm text-[#66708A] font-medium">No sales recorded yet.</p>
            ) : (
              <div className="space-y-2">
                {data.by_day.map((d) => (
                  <div key={d.date} className="flex items-center gap-3">
                    <span className="text-[12px] text-[#66708A] font-medium w-24 shrink-0">{d.date}</span>
                    <div className="flex-1 bg-[#F8F9FC] rounded-full h-6 relative overflow-hidden">
                      <div className="bg-[#5425F5] h-full rounded-full" style={{ width: `${(d.sales / maxSales) * 100}%` }} />
                    </div>
                    <span className="text-[12px] font-bold text-[#17203D] w-28 text-right shrink-0">LKR {d.sales.toLocaleString()}</span>
                    <span className="text-[11px] text-[#66708A] w-16 text-right shrink-0">{d.orders} orders</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </AdminLayout>
  );
}
