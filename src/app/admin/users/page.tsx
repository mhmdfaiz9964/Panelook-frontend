'use client';

import React from 'react';
import { AdminResourceManager } from '@/components/admin/AdminResourceManager';

const ROLE_OPTIONS = [
  { label: 'Super Admin', value: 'super_admin' },
  { label: 'Admin', value: 'admin' },
  { label: 'Sales Manager', value: 'sales_manager' },
  { label: 'Inventory Manager', value: 'inventory_manager' },
  { label: 'Purchase Manager', value: 'purchase_manager' },
  { label: 'Content Manager', value: 'content_manager' },
  { label: 'Support Agent', value: 'support_agent' },
];

export default function AdminUsersPage() {
  return (
    <AdminResourceManager
      title="Users"
      singularLabel="User"
      description="Staff accounts with access to this admin portal."
      apiPath="/admin/users"
      emptyLabel="users"
      defaultValues={{ role: 'admin' }}
      columns={[
        { key: 'name', label: 'Name' },
        { key: 'email', label: 'Email' },
        { key: 'phone', label: 'Phone', render: (r) => r.phone || '—' },
        { key: 'role', label: 'Role', render: (r) => <span className="capitalize">{String(r.role).replace('_', ' ')}</span> },
      ]}
      fields={[
        { key: 'name', label: 'Full Name', type: 'text', required: true },
        { key: 'email', label: 'Email', type: 'text', required: true },
        { key: 'phone', label: 'Mobile', type: 'text' },
        { key: 'role', label: 'Role', type: 'select', required: true, options: ROLE_OPTIONS },
        { key: 'password', label: 'Password', type: 'text', placeholder: 'Leave blank to keep unchanged when editing', help: 'Minimum 8 characters' },
      ]}
    />
  );
}
