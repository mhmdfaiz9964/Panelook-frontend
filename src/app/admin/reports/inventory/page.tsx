'use client';

import React, { useEffect, useState } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { adminFetch } from '@/lib/adminApi';
import { Loader2 } from 'lucide-react';

interface InvData {
  total_units: number;
  stock_value_cost: number;
  stock_value_retail: number;
  low_stock_count: number;
  out_of_stock_count: number;
}

export default function InventoryReportPage() {
  const [data, setData] = useState<InvData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await adminFetch('/admin/reports/inventory');
        const json = await res.json();
        if (json.success) setData(json.data);
      } catch { /* stays loading if unreachable */ }
      setLoading(false);
    })();
  }, []);

  return (
    <AdminLayout title="Inventory Reports">
      <p className="text-sm text-[#66708A] font-medium mb-5">Stock value and health across your entire catalogue.</p>

      {loading ? (
        <div className="bg-white rounded-xl border border-[#E7EAF3] p-10 text-center text-sm text-[#66708A] font-medium"><Loader2 className="w-4 h-4 animate-spin inline mr-2" />Loading...</div>
      ) : data && (
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="bg-white p-4 rounded-xl border border-[#E7EAF3] shadow-2xs">
            <span className="text-[12px] font-semibold text-[#66708A]">Total Units in Stock</span>
            <div className="text-[20px] font-bold text-[#17203D] mt-1">{data.total_units}</div>
          </div>
          <div className="bg-white p-4 rounded-xl border border-[#E7EAF3] shadow-2xs">
            <span className="text-[12px] font-semibold text-[#66708A]">Stock Value (Cost)</span>
            <div className="text-[20px] font-bold text-[#17203D] mt-1">LKR {data.stock_value_cost.toLocaleString()}</div>
          </div>
          <div className="bg-white p-4 rounded-xl border border-[#E7EAF3] shadow-2xs">
            <span className="text-[12px] font-semibold text-[#66708A]">Stock Value (Retail)</span>
            <div className="text-[20px] font-bold text-[#17203D] mt-1">LKR {data.stock_value_retail.toLocaleString()}</div>
          </div>
          <div className="bg-white p-4 rounded-xl border border-[#E7EAF3] shadow-2xs">
            <span className="text-[12px] font-semibold text-[#66708A]">Low Stock Items</span>
            <div className="text-[20px] font-bold text-amber-600 mt-1">{data.low_stock_count}</div>
          </div>
          <div className="bg-white p-4 rounded-xl border border-[#E7EAF3] shadow-2xs">
            <span className="text-[12px] font-semibold text-[#66708A]">Out of Stock Items</span>
            <div className="text-[20px] font-bold text-rose-600 mt-1">{data.out_of_stock_count}</div>
          </div>
          <div className="bg-white p-4 rounded-xl border border-[#E7EAF3] shadow-2xs">
            <span className="text-[12px] font-semibold text-[#66708A]">Potential Margin</span>
            <div className="text-[20px] font-bold text-emerald-600 mt-1">LKR {(data.stock_value_retail - data.stock_value_cost).toLocaleString()}</div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
