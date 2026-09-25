'use client';

import React from 'react';
import { AdminResourceManager } from '@/components/admin/AdminResourceManager';

export default function AdminBrandsPage() {
  return (
    <AdminResourceManager
      title="Brands"
      description="Manage the laptop brands your displays are compatible with."
      apiPath="/admin/brands"
      emptyLabel="brands"
      columns={[
        { key: 'name', label: 'Brand' },
        { key: 'slug', label: 'Slug' },
        { key: 'products_count', label: 'Products', render: (r) => r.products_count ?? 0 },
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
        { key: 'name', label: 'Brand Name', type: 'text', required: true, placeholder: 'e.g. HP' },
        { key: 'logo', label: 'Logo URL', type: 'text', placeholder: '/brands/hp.svg' },
        { key: 'description', label: 'Description', type: 'textarea' },
      ]}
    />
  );
}
