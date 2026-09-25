'use client';

import React, { useEffect, useState } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { adminFetch } from '@/lib/adminApi';
import { Loader2 } from 'lucide-react';

interface ProfitData { revenue: number; cost: number; gross_profit: number; margin_pct: number; }

export default function ProfitReportPage() {
  const [data, setData] = useState<ProfitData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await adminFetch('/admin/reports/profit');
        const json = await res.json();
        if (json.success) setData(json.data);
      } catch { /* stays loading if unreachable */ }
      setLoading(false);
    })();
  }, []);

  return (
    <AdminLayout title="Profit Reports">
      <p className="text-sm text-[#66708A] font-medium mb-5">Gross profit computed from order revenue minus product cost price.</p>

      {loading ? (
        <div className="bg-white rounded-xl border border-[#E7EAF3] p-10 text-center text-sm text-[#66708A] font-medium"><Loader2 className="w-4 h-4 animate-spin inline mr-2" />Loading...</div>
      ) : data && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-xl border border-[#E7EAF3] shadow-2xs">
            <span className="text-[12px] font-semibold text-[#66708A]">Revenue</span>
            <div className="text-[20px] font-bold text-[#17203D] mt-1">LKR {data.revenue.toLocaleString()}</div>
          </div>
          <div className="bg-white p-4 rounded-xl border border-[#E7EAF3] shadow-2xs">
            <span className="text-[12px] font-semibold text-[#66708A]">Cost of Goods</span>
            <div className="text-[20px] font-bold text-[#17203D] mt-1">LKR {data.cost.toLocaleString()}</div>
          </div>
          <div className="bg-white p-4 rounded-xl border border-[#E7EAF3] shadow-2xs">
            <span className="text-[12px] font-semibold text-[#66708A]">Gross Profit</span>
            <div className="text-[20px] font-bold text-emerald-600 mt-1">LKR {data.gross_profit.toLocaleString()}</div>
          </div>
          <div className="bg-white p-4 rounded-xl border border-[#E7EAF3] shadow-2xs">
            <span className="text-[12px] font-semibold text-[#66708A]">Margin</span>
            <div className="text-[20px] font-bold text-[#17203D] mt-1">{data.margin_pct}%</div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
