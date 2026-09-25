'use client';

import React from 'react';
import { AdminResourceManager } from '@/components/admin/AdminResourceManager';

export default function AdminSizesPage() {
  return (
    <AdminResourceManager
      title="Sizes"
      description="The display sizes customers can filter and search by."
      apiPath="/admin/sizes"
      emptyLabel="sizes"
      columns={[
        { key: 'label', label: 'Size' },
        { key: 'sort_order', label: 'Sort Order' },
        {
          key: 'status',
          label: 'Status',
          render: (r) => (
            <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${r.status ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-600'}`}>
              {r.status ? 'Active' : 'Disabled'}
            </span>
          ),
        },
      ]}
      fields={[
        { key: 'label', label: 'Size Label', type: 'text', required: true, placeholder: 'e.g. 15.6"' },
        { key: 'sort_order', label: 'Sort Order', type: 'number' },
      ]}
    />
  );
}
