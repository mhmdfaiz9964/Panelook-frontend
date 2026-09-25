'use client';

import React from 'react';
import { AdminResourceManager } from '@/components/admin/AdminResourceManager';

export default function AdminWarehousesPage() {
  return (
    <AdminResourceManager
      title="Warehouses"
      singularLabel="Warehouse"
      description="Storage locations that hold your inventory."
      apiPath="/admin/warehouses"
      emptyLabel="warehouses"
      columns={[
        { key: 'name', label: 'Warehouse' },
        { key: 'code', label: 'Code' },
        { key: 'contact_person', label: 'Contact Person' },
        { key: 'phone', label: 'Phone' },
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
        { key: 'name', label: 'Warehouse Name', type: 'text', required: true, placeholder: 'e.g. Colombo Main Warehouse' },
        { key: 'code', label: 'Code', type: 'text', required: true, placeholder: 'WH-CMB' },
        { key: 'address', label: 'Address', type: 'textarea' },
        { key: 'contact_person', label: 'Contact Person', type: 'text' },
        { key: 'phone', label: 'Phone', type: 'text' },
      ]}
    />
  );
}
