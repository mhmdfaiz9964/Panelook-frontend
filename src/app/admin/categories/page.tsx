'use client';

import React from 'react';
import { AdminResourceManager } from '@/components/admin/AdminResourceManager';

export default function AdminCategoriesPage() {
  return (
    <AdminResourceManager
      title="Categories"
      singularLabel="Category"
      description="Organize your catalogue into browsable categories with dedicated images."
      apiPath="/admin/categories"
      emptyLabel="categories"
      columns={[
        {
          key: 'image',
          label: 'Image',
          render: (r) =>
            r.image ? (
              <div className="w-10 h-10 rounded-lg overflow-hidden bg-slate-100 border border-slate-200 p-1 flex items-center justify-center">
                <img src={r.image} alt={r.name} className="w-full h-full object-contain" />
              </div>
            ) : (
              <span className="text-xs text-slate-400 italic">No image</span>
            ),
        },
        { key: 'name', label: 'Category' },
        { key: 'slug', label: 'Slug' },
        { key: 'products_count', label: 'Products', render: (r) => r.products_count ?? 0 },
        { key: 'sort_order', label: 'Sort Order' },
        {
          key: 'status',
          label: 'Status',
          render: (r) => (
            <span
              className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                r.status ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-600'
              }`}
            >
              {r.status ? 'Active' : 'Disabled'}
            </span>
          ),
        },
      ]}
      fields={[
        { key: 'name', label: 'Name', type: 'text', required: true, placeholder: 'e.g. Laptop Displays' },
        {
          key: 'image',
          label: 'Image URL',
          type: 'text',
          placeholder: '/images/promo-card-1.jpeg',
          help: 'e.g. /images/promo-card-1.jpeg, /images/promo-center.jpeg, /images/promo-card-2.jpeg',
        },
        { key: 'description', label: 'Description', type: 'textarea' },
        { key: 'sort_order', label: 'Sort Order', type: 'number' },
      ]}
    />
  );
}
