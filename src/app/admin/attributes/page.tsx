'use client';

import React from 'react';
import { AdminResourceManager } from '@/components/admin/AdminResourceManager';

export default function AdminAttributesPage() {
  return (
    <AdminResourceManager
      title="Attributes"
      description="Custom product attributes used for specifications and filtering."
      apiPath="/admin/attributes"
      emptyLabel="attributes"
      defaultValues={{ status: true, required: false, filterable: true, type: 'select' }}
      columns={[
        { key: 'name', label: 'Attribute' },
        { key: 'type', label: 'Type', render: (r) => <span className="capitalize">{r.type}</span> },
        { key: 'values', label: 'Values', render: (r) => (r.values || []).join(', ') || '—' },
        { key: 'filterable', label: 'Filterable', render: (r) => (r.filterable ? 'Yes' : 'No') },
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
        { key: 'name', label: 'Attribute Name', type: 'text', required: true, placeholder: 'e.g. Panel Type' },
        {
          key: 'type',
          label: 'Type',
          type: 'select',
          required: true,
          options: [
            { label: 'Text', value: 'text' },
            { label: 'Number', value: 'number' },
            { label: 'Select', value: 'select' },
            { label: 'Multi-select', value: 'multiselect' },
            { label: 'Boolean', value: 'boolean' },
          ],
        },
        { key: 'values', label: 'Values', type: 'tags', placeholder: 'IPS, TN, OLED', help: 'Comma-separated (for Select / Multi-select types)' },
        { key: 'required', label: 'Required', type: 'checkbox', help: 'Must be set when adding a product' },
        { key: 'filterable', label: 'Filterable', type: 'checkbox', help: 'Shown as a shop filter' },
        { key: 'sort_order', label: 'Sort Order', type: 'number' },
      ]}
    />
  );
}
