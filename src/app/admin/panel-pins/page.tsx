'use client';

import React from 'react';
import { AdminResourceManager } from '@/components/admin/AdminResourceManager';

export default function AdminPanelPinsPage() {
  return (
    <AdminResourceManager
      title="Panel Pins"
      description="Connector pin types used to match displays to laptop models."
      apiPath="/admin/panel-pins"
      emptyLabel="panel pins"
      columns={[
        { key: 'name', label: 'Pin Type' },
        { key: 'pin_count', label: 'Pin Count' },
        { key: 'description', label: 'Description' },
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
        { key: 'name', label: 'Pin Name', type: 'text', required: true, placeholder: 'e.g. 30-Pin' },
        { key: 'pin_count', label: 'Pin Count', type: 'number', placeholder: '30' },
        { key: 'description', label: 'Description', type: 'textarea' },
        { key: 'sort_order', label: 'Sort Order', type: 'number' },
      ]}
    />
  );
}
