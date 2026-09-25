'use client';

import React, { useEffect, useState } from 'react';
import { AdminResourceManager } from '@/components/admin/AdminResourceManager';
import { adminFetch } from '@/lib/adminApi';

export default function AdminModelsPage() {
  const [brandOptions, setBrandOptions] = useState<{ label: string; value: string | number }[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const res = await adminFetch('/admin/brands');
        const json = await res.json();
        if (json.success) {
          setBrandOptions(json.data.map((b: any) => ({ label: b.name, value: b.id })));
        }
      } catch {
        // AdminResourceManager will surface a connectivity error on its own load
      }
      setLoaded(true);
    })();
  }, []);

  if (!loaded) return null;

  return (
    <AdminResourceManager
      title="Models"
      description="Laptop models mapped to brands, used for compatibility search."
      apiPath="/admin/models"
      emptyLabel="models"
      columns={[
        { key: 'model_name', label: 'Model' },
        { key: 'brand', label: 'Brand', render: (r) => r.brand?.name || '—' },
        { key: 'model_number', label: 'Model Number' },
        { key: 'compatible_sizes', label: 'Sizes', render: (r) => (r.compatible_sizes || []).join(', ') || '—' },
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
        { key: 'model_name', label: 'Model Name', type: 'text', required: true, placeholder: 'e.g. Pavilion 15' },
        { key: 'brand_id', label: 'Brand', type: 'select', options: brandOptions },
        { key: 'model_number', label: 'Model Number', type: 'text', placeholder: 'e.g. 15-eg0001' },
        { key: 'series', label: 'Series', type: 'text', placeholder: 'e.g. Pavilion' },
        { key: 'compatible_sizes', label: 'Compatible Sizes', type: 'tags', placeholder: '15.6", 14"', help: 'Comma-separated' },
      ]}
    />
  );
}
