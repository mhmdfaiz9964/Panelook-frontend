'use client';

import React, { useEffect, useState } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { adminFetch } from '@/lib/adminApi';
import { Loader2, Search } from 'lucide-react';

interface CustomerRow {
  id: number;
  name: string;
  email: string;
  phone: string;
  orders_count: number;
  total_spent: number | null;
  created_at: string;
}

export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState<CustomerRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [error, setError] = useState('');

  const load = async () => {
    setLoading(true);
    try {
      const res = await adminFetch(`/admin/customers${search ? `?search=${encodeURIComponent(search)}` : ''}`);
      const json = await res.json();
      if (json.success) setCustomers(json.data.data);
      else setError('Could not load customers.');
    } catch {
      setError('Backend API is unreachable.');
    }
    setLoading(false);
  };

  useEffect(() => {
    const t = setTimeout(load, 300);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  const initials = (name: string) => name.split(' ').map((n) => n[0]).slice(0, 2).join('').toUpperCase();

  return (
    <AdminLayout title="Customers">
      <p className="text-sm text-[#66708A] font-medium mb-5">Registered customer accounts and their order history.</p>

      <div className="relative max-w-sm mb-4">
        <Search className="w-4 h-4 text-[#66708A] absolute left-3 top-3" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search name, email, phone..."
          className="w-full pl-9 pr-4 h-10 border border-[#DDE2EE] rounded-lg text-[13px] focus:outline-hidden focus:border-[#5425F5]"
        />
      </div>

      {error && (
        <div className="mb-4 bg-amber-50 border border-amber-200 text-amber-800 text-xs font-semibold px-4 py-3 rounded-xl">{error}</div>
      )}

      <div className="bg-white rounded-xl border border-[#E7EAF3] shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-[#F8F9FC] border-b border-[#E7EAF3]">
                <th className="px-4 py-3 text-[11px] font-bold text-[#66708A] uppercase tracking-wider">Customer</th>
                <th className="px-4 py-3 text-[11px] font-bold text-[#66708A] uppercase tracking-wider">Email</th>
                <th className="px-4 py-3 text-[11px] font-bold text-[#66708A] uppercase tracking-wider">Mobile</th>
                <th className="px-4 py-3 text-[11px] font-bold text-[#66708A] uppercase tracking-wider">Orders</th>
                <th className="px-4 py-3 text-[11px] font-bold text-[#66708A] uppercase tracking-wider">Total Spent</th>
                <th className="px-4 py-3 text-[11px] font-bold text-[#66708A] uppercase tracking-wider">Joined</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={6} className="px-4 py-10 text-center text-sm text-[#66708A] font-medium"><Loader2 className="w-4 h-4 animate-spin inline mr-2" />Loading...</td></tr>
              ) : customers.length === 0 ? (
                <tr><td colSpan={6} className="px-4 py-10 text-center text-sm text-[#66708A] font-medium">No customer accounts yet. Customers appear here once they register via the storefront.</td></tr>
              ) : (
                customers.map((c) => (
                  <tr key={c.id} className="border-b border-[#E7EAF3] last:border-b-0 hover:bg-[#F8F9FC] transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-[#5425F5] text-white text-[10px] font-black flex items-center justify-center shrink-0">
                          {initials(c.name)}
                        </div>
                        <span className="text-[13px] font-semibold text-[#17203D]">{c.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-[13px] text-[#66708A]">{c.email}</td>
                    <td className="px-4 py-3 text-[13px] text-[#66708A]">{c.phone || '—'}</td>
                    <td className="px-4 py-3 text-[13px] font-semibold text-[#17203D]">{c.orders_count}</td>
                    <td className="px-4 py-3 text-[13px] font-bold text-[#17203D]">LKR {Number(c.total_spent || 0).toLocaleString()}</td>
                    <td className="px-4 py-3 text-[12px] text-[#66708A]">{new Date(c.created_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</td>
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
