'use client';

import React from 'react';
import { AdminResourceManager } from '@/components/admin/AdminResourceManager';

export default function AdminBannersPage() {
  return (
    <AdminResourceManager
      title="Banners"
      singularLabel="Banner"
      description="Homepage and promotional banners shown on the storefront slider."
      apiPath="/admin/banners"
      emptyLabel="banners"
      columns={[
        {
          key: 'desktop_image',
          label: 'Preview',
          render: (r) =>
            r.desktop_image ? (
              <div className="w-24 h-12 rounded-lg overflow-hidden bg-slate-100 border border-slate-200 shadow-2xs">
                <img
                  src={r.desktop_image}
                  alt={r.title || 'Banner Preview'}
                  className="w-full h-full object-cover"
                />
              </div>
            ) : (
              <span className="text-xs text-slate-400 italic">No image</span>
            ),
        },
        { key: 'title', label: 'Title' },
        { key: 'subtitle', label: 'Subtitle' },
        { key: 'button_text', label: 'Button' },
        { key: 'sort_order', label: 'Sort Order' },
        {
          key: 'status',
          label: 'Status',
          render: (r) => (
            <span
              className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${
                r.status ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-600'
              }`}
            >
              {r.status ? 'Active' : 'Disabled'}
            </span>
          ),
        },
      ]}
      fields={[
        {
          key: 'title',
          label: 'Title',
          type: 'text',
          required: true,
          placeholder: 'Fast Islandwide Delivery Across Sri Lanka',
        },
        {
          key: 'subtitle',
          label: 'Subtitle',
          type: 'text',
          placeholder: '06 Month Warranty - Safe Packing Before Shipping',
        },
        {
          key: 'desktop_image',
          label: 'Desktop Banner Image',
          type: 'image',
          required: true,
          recommendedSize: '1920 × 600 px',
          folder: 'banners',
          placeholder: 'https://... or /images/banners/...',
          help: 'Recommended: 1920 × 600 px. Formats: JPG, PNG, WebP (Converted to WebP automatically)',
        },
        {
          key: 'mobile_image',
          label: 'Mobile Banner Image',
          type: 'image',
          recommendedSize: '1080 × 600 px',
          folder: 'banners',
          placeholder: 'https://... or /images/banners/...',
          help: 'Recommended: 1080 × 600 px (16:9). Used automatically on mobile devices to prevent cropping.',
        },
        {
          key: 'button_text',
          label: 'Button Text',
          type: 'text',
          placeholder: 'Shop Displays',
        },
        {
          key: 'button_url',
          label: 'Button URL',
          type: 'text',
          placeholder: '/shop',
        },
        {
          key: 'sort_order',
          label: 'Sort Order (e.g. 1, 2, 3)',
          type: 'number',
        },
      ]}
    />
  );
}
