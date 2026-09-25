'use client';

import React from 'react';
import { AdminResourceManager } from '@/components/admin/AdminResourceManager';

export default function AdminCouponsPage() {
  return (
    <AdminResourceManager
      title="Coupons"
      singularLabel="Coupon"
      description="Discount codes customers can apply at checkout."
      apiPath="/admin/coupons"
      emptyLabel="coupons"
      defaultValues={{ status: true, discount_type: 'percentage' }}
      columns={[
        { key: 'code', label: 'Code', render: (r) => <span className="font-mono font-bold">{r.code}</span> },
        { key: 'discount_value', label: 'Discount', render: (r) => r.discount_type === 'percentage' ? `${r.discount_value}%` : `LKR ${Number(r.discount_value).toLocaleString()}` },
        { key: 'used_count', label: 'Used', render: (r) => `${r.used_count}${r.usage_limit ? ` / ${r.usage_limit}` : ''}` },
        { key: 'end_date', label: 'Expires', render: (r) => r.end_date || 'No expiry' },
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
        { key: 'code', label: 'Coupon Code', type: 'text', required: true, placeholder: 'SAVE10' },
        {
          key: 'discount_type',
          label: 'Discount Type',
          type: 'select',
          required: true,
          options: [{ label: 'Percentage', value: 'percentage' }, { label: 'Fixed (LKR)', value: 'fixed' }],
        },
        { key: 'discount_value', label: 'Discount Value', type: 'number', required: true },
        { key: 'min_order', label: 'Minimum Order (LKR)', type: 'number' },
        { key: 'max_discount', label: 'Maximum Discount (LKR)', type: 'number' },
        { key: 'start_date', label: 'Start Date', type: 'text', placeholder: 'YYYY-MM-DD' },
        { key: 'end_date', label: 'End Date', type: 'text', placeholder: 'YYYY-MM-DD' },
        { key: 'usage_limit', label: 'Total Usage Limit', type: 'number' },
        { key: 'per_customer_limit', label: 'Per-Customer Limit', type: 'number' },
      ]}
    />
  );
}
