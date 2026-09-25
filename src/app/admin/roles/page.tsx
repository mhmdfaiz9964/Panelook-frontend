'use client';

import React from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Info } from 'lucide-react';

const ROLES = ['Super Admin', 'Admin', 'Sales Manager', 'Inventory Manager', 'Purchase Manager', 'Support Agent'];
const PERMISSIONS: { module: string; access: string[] }[] = [
  { module: 'Products & Catalog', access: ['Full', 'Full', 'View', 'View', 'View', 'View'] },
  { module: 'Orders', access: ['Full', 'Full', 'Full', 'View', 'View', 'Full'] },
  { module: 'Inventory', access: ['Full', 'Full', 'View', 'Full', 'View', 'No'] },
  { module: 'Customers', access: ['Full', 'Full', 'Full', 'View', 'No', 'Full'] },
  { module: 'Purchases & Suppliers', access: ['Full', 'Full', 'No', 'View', 'Full', 'No'] },
  { module: 'Marketing', access: ['Full', 'Full', 'Full', 'No', 'No', 'No'] },
  { module: 'Reports', access: ['Full', 'Full', 'View', 'View', 'View', 'View'] },
  { module: 'Users & Settings', access: ['Full', 'Limited', 'No', 'No', 'No', 'No'] },
];

const ACCESS_STYLE: Record<string, string> = {
  Full: 'bg-emerald-100 text-emerald-800',
  View: 'bg-blue-100 text-blue-800',
  Limited: 'bg-amber-100 text-amber-800',
  No: 'bg-slate-200 text-slate-500',
};

export default function AdminRolesPage() {
  return (
    <AdminLayout title="Roles & Permissions">
      <p className="text-sm text-[#66708A] font-medium mb-4">
        Reference permission matrix for staff roles used across the admin. Roles are already assignable per-user on
        the Users page.
      </p>

      <div className="flex items-start gap-2.5 bg-blue-50 border border-blue-200 text-blue-800 text-xs font-semibold px-4 py-3 rounded-xl mb-5">
        <Info className="w-4 h-4 shrink-0 mt-0.5" />
        <span>
          This matrix is informational, not yet backend-enforced. Laravel Policies that actually gate each module by
          role are planned for a follow-up phase &mdash; today every admin-role user can reach every module.
        </span>
      </div>

      <div className="bg-white rounded-xl border border-[#E7EAF3] shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-[#F8F9FC] border-b border-[#E7EAF3]">
                <th className="px-4 py-3 text-[11px] font-bold text-[#66708A] uppercase tracking-wider">Permission</th>
                {ROLES.map((r) => (
                  <th key={r} className="px-4 py-3 text-[11px] font-bold text-[#66708A] uppercase tracking-wider text-center">{r}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {PERMISSIONS.map((p) => (
                <tr key={p.module} className="border-b border-[#E7EAF3] last:border-b-0">
                  <td className="px-4 py-3 text-[13px] font-semibold text-[#17203D] whitespace-nowrap">{p.module}</td>
                  {p.access.map((a, i) => (
                    <td key={i} className="px-4 py-3 text-center">
                      <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${ACCESS_STYLE[a]}`}>{a}</span>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
}
