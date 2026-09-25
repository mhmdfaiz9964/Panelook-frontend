'use client';

import React from 'react';
import { AdminResourceManager } from '@/components/admin/AdminResourceManager';

export default function AdminSuppliersPage() {
  return (
    <AdminResourceManager
      title="Suppliers"
      singularLabel="Supplier"
      description="Vendors and manufacturers you purchase stock from."
      apiPath="/admin/suppliers"
      emptyLabel="suppliers"
      columns={[
        { key: 'name', label: 'Supplier' },
        { key: 'contact_person', label: 'Contact Person' },
        { key: 'phone', label: 'Phone' },
        { key: 'city', label: 'City' },
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
        { key: 'name', label: 'Supplier Name', type: 'text', required: true },
        { key: 'contact_person', label: 'Contact Person', type: 'text' },
        { key: 'phone', label: 'Phone', type: 'text' },
        { key: 'email', label: 'Email', type: 'text' },
        { key: 'address', label: 'Address', type: 'textarea' },
        { key: 'city', label: 'City', type: 'text' },
        { key: 'country', label: 'Country', type: 'text', placeholder: 'Sri Lanka' },
        { key: 'tax_id', label: 'Tax ID', type: 'text' },
        { key: 'notes', label: 'Notes', type: 'textarea' },
      ]}
    />
  );
}
