'use client';

import React, { useEffect, useState } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { adminFetch } from '@/lib/adminApi';
import { Loader2 } from 'lucide-react';

interface LogRow {
  id: number;
  action: string;
  module: string;
  record_label: string | null;
  created_at: string;
  user?: { name: string };
}

export default function AdminActivityLogsPage() {
  const [logs, setLogs] = useState<LogRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    (async () => {
      try {
        const res = await adminFetch('/admin/activity-logs');
        const json = await res.json();
        if (json.success) setLogs(json.data.data);
        else setError('Could not load activity logs.');
      } catch {
        setError('Backend API is unreachable.');
      }
      setLoading(false);
    })();
  }, []);

  return (
    <AdminLayout title="Activity Logs">
      <p className="text-sm text-[#66708A] font-medium mb-5">
        A record of admin actions across the system. Logging currently covers order status changes and stock adjustments &mdash;
        broader coverage (product edits, settings changes) is planned for a follow-up.
      </p>

      {error && <div className="mb-4 bg-amber-50 border border-amber-200 text-amber-800 text-xs font-semibold px-4 py-3 rounded-xl">{error}</div>}

      <div className="bg-white rounded-xl border border-[#E7EAF3] shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-[#F8F9FC] border-b border-[#E7EAF3]">
                <th className="px-4 py-3 text-[11px] font-bold text-[#66708A] uppercase tracking-wider">User</th>
                <th className="px-4 py-3 text-[11px] font-bold text-[#66708A] uppercase tracking-wider">Action</th>
                <th className="px-4 py-3 text-[11px] font-bold text-[#66708A] uppercase tracking-wider">Module</th>
                <th className="px-4 py-3 text-[11px] font-bold text-[#66708A] uppercase tracking-wider">Record</th>
                <th className="px-4 py-3 text-[11px] font-bold text-[#66708A] uppercase tracking-wider">Date</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={5} className="px-4 py-10 text-center text-sm text-[#66708A] font-medium"><Loader2 className="w-4 h-4 animate-spin inline mr-2" />Loading...</td></tr>
              ) : logs.length === 0 ? (
                <tr><td colSpan={5} className="px-4 py-10 text-center text-sm text-[#66708A] font-medium">No activity recorded yet.</td></tr>
              ) : (
                logs.map((l) => (
                  <tr key={l.id} className="border-b border-[#E7EAF3] last:border-b-0 hover:bg-[#F8F9FC] transition-colors">
                    <td className="px-4 py-3 text-[13px] font-semibold text-[#17203D]">{l.user?.name || 'System'}</td>
                    <td className="px-4 py-3 text-[13px] text-[#17203D]">{l.action}</td>
                    <td className="px-4 py-3 text-[12px] text-[#66708A]">{l.module}</td>
                    <td className="px-4 py-3 text-[13px] text-[#17203D]">{l.record_label || '—'}</td>
                    <td className="px-4 py-3 text-[12px] text-[#66708A]">{new Date(l.created_at).toLocaleString('en-GB')}</td>
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
