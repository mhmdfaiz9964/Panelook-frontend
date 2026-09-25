'use client';

import React, { useEffect, useState } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { adminFetch } from '@/lib/adminApi';
import { Loader2 } from 'lucide-react';

const STATUS_COLOR: Record<string, string> = {
  Pending: 'bg-amber-500', Confirmed: 'bg-blue-500', Processing: 'bg-blue-500',
  Packed: 'bg-indigo-500', Shipped: 'bg-purple-500', Delivered: 'bg-emerald-500',
  Cancelled: 'bg-rose-500', Returned: 'bg-slate-400',
};

export default function OrderReportPage() {
  const [data, setData] = useState<{ total: number; by_status: Record<string, number> } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await adminFetch('/admin/reports/orders');
        const json = await res.json();
        if (json.success) setData(json.data);
      } catch { /* stays in loading state if unreachable */ }
      setLoading(false);
    })();
  }, []);

  return (
    <AdminLayout title="Order Reports">
      <p className="text-sm text-[#66708A] font-medium mb-5">Order volume broken down by fulfilment status.</p>

      {loading ? (
        <div className="bg-white rounded-xl border border-[#E7EAF3] p-10 text-center text-sm text-[#66708A] font-medium"><Loader2 className="w-4 h-4 animate-spin inline mr-2" />Loading...</div>
      ) : data && (
        <div className="bg-white rounded-xl border border-[#E7EAF3] shadow-2xs p-5">
          <div className="mb-5">
            <span className="text-[12px] font-semibold text-[#66708A]">Total Orders</span>
            <div className="text-[24px] font-bold text-[#17203D]">{data.total}</div>
          </div>
          <div className="space-y-3">
            {Object.entries(data.by_status).map(([status, count]) => (
              <div key={status} className="flex items-center gap-3">
                <span className="text-[13px] font-semibold text-[#17203D] w-28 shrink-0">{status}</span>
                <div className="flex-1 bg-[#F8F9FC] rounded-full h-5 relative overflow-hidden">
                  <div className={`h-full rounded-full ${STATUS_COLOR[status] || 'bg-slate-400'}`} style={{ width: `${(count / data.total) * 100}%` }} />
                </div>
                <span className="text-[13px] font-bold text-[#17203D] w-10 text-right shrink-0">{count}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
