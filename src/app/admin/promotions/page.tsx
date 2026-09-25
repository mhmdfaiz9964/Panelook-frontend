'use client';

import React from 'react';
import { AdminResourceManager } from '@/components/admin/AdminResourceManager';

export default function AdminPromotionsPage() {
  return (
    <AdminResourceManager
      title="Promotions"
      singularLabel="Promotion"
      description="Flash sales, clearance and brand/category promotions."
      apiPath="/admin/promotions"
      emptyLabel="promotions"
      defaultValues={{ status: true, type: 'flash_sale', discount_type: 'percentage' }}
      columns={[
        { key: 'name', label: 'Promotion' },
        { key: 'type', label: 'Type', render: (r) => <span className="capitalize">{String(r.type).replace('_', ' ')}</span> },
        { key: 'discount_value', label: 'Discount', render: (r) => r.discount_value ? (r.discount_type === 'percentage' ? `${r.discount_value}%` : `LKR ${Number(r.discount_value).toLocaleString()}`) : '—' },
        { key: 'end_date', label: 'Ends', render: (r) => r.end_date || '—' },
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
        { key: 'name', label: 'Promotion Name', type: 'text', required: true, placeholder: 'Weekend Flash Sale' },
        {
          key: 'type',
          label: 'Type',
          type: 'select',
          required: true,
          options: [
            { label: 'Flash Sale', value: 'flash_sale' },
            { label: 'Weekend Sale', value: 'weekend_sale' },
            { label: 'Brand Sale', value: 'brand_sale' },
            { label: 'Category Sale', value: 'category_sale' },
            { label: 'Clearance', value: 'clearance' },
          ],
        },
        { key: 'description', label: 'Description', type: 'textarea' },
        {
          key: 'discount_type',
          label: 'Discount Type',
          type: 'select',
          options: [{ label: 'Percentage', value: 'percentage' }, { label: 'Fixed (LKR)', value: 'fixed' }],
        },
        { key: 'discount_value', label: 'Discount Value', type: 'number' },
        { key: 'start_date', label: 'Start Date', type: 'text', placeholder: 'YYYY-MM-DD' },
        { key: 'end_date', label: 'End Date', type: 'text', placeholder: 'YYYY-MM-DD' },
        { key: 'banner_image', label: 'Banner Image URL', type: 'text' },
      ]}
    />
  );
}
