'use client';

import React, { useEffect, useState } from 'react';
import { AdminLayout } from './AdminLayout';
import { adminFetch, parseApiResponse, adminUploadImage } from '@/lib/adminApi';
import { Plus, Pencil, Trash2, X, Loader2, Upload, CheckCircle2 } from 'lucide-react';

export interface FieldConfig {
  key: string;
  label: string;
  type: 'text' | 'number' | 'textarea' | 'select' | 'checkbox' | 'tags' | 'image';
  options?: { label: string; value: string | number }[];
  required?: boolean;
  placeholder?: string;
  help?: string;
  recommendedSize?: string;
  folder?: 'products' | 'banners';
}

export interface ColumnConfig {
  key: string;
  label: string;
  render?: (row: any) => React.ReactNode;
}

interface AdminResourceManagerProps {
  title: string;
  singularLabel?: string;
  description: string;
  apiPath: string; // e.g. '/admin/categories'
  columns: ColumnConfig[];
  fields: FieldConfig[];
  defaultValues?: Record<string, any>;
  emptyLabel?: string;
}

export function AdminResourceManager({
  title,
  singularLabel,
  description,
  apiPath,
  columns,
  fields,
  defaultValues = {},
  emptyLabel = 'items',
}: AdminResourceManagerProps) {
  const singular = singularLabel || title.replace(/s$/, '');
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState<Record<string, any>>(defaultValues);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState('');
  const [uploadingField, setUploadingField] = useState<string | null>(null);

  const handleFileUpload = async (key: string, file: File, folder: 'products' | 'banners' = 'banners') => {
    setUploadingField(key);
    try {
      const res = await adminUploadImage(file, folder);
      if (res.success && res.url) {
        setForm((prev) => ({ ...prev, [key]: res.url }));
      } else {
        alert(res.message || 'Image upload failed');
      }
    } catch (err: any) {
      alert(`Failed to upload: ${err.message}`);
    }
    setUploadingField(null);
  };

  const load = async () => {
    setLoading(true);
    try {
      const res = await adminFetch(apiPath);
      const json = await res.json();
      if (json.success) {
        const data = Array.isArray(json.data) ? json.data : json.data?.data || [];
        setItems(data);
      } else {
        setError('Could not load data.');
      }
    } catch {
      setError('Backend API is unreachable.');
    }
    setLoading(false);
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [apiPath]);

  const openCreate = () => {
    setEditingId(null);
    setForm({ status: true, ...defaultValues });
    setFormError('');
    setModalOpen(true);
  };

  const openEdit = (row: any) => {
    setEditingId(row.id);
    setForm({ ...row });
    setFormError('');
    setModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setFormError('');
    try {
      const res = await adminFetch(editingId ? `${apiPath}/${editingId}` : apiPath, {
        method: editingId ? 'PUT' : 'POST',
        body: JSON.stringify(form),
      });
      const parsed = await parseApiResponse(res);
      if (parsed.success) {
        setModalOpen(false);
        load();
      } else {
        setFormError(parsed.message || 'Validation failed. Check the fields and try again.');
      }
    } catch (err: any) {
      setFormError(`Unable to connect to the server: ${err.message || 'Network error'}`);
    }
    setSaving(false);
  };

  const handleDelete = async (row: any) => {
    if (!confirm(`Delete "${row.name || row.label || row.model_name}"? This cannot be undone.`)) return;
    try {
      const res = await adminFetch(`${apiPath}/${row.id}`, { method: 'DELETE' });
      const json = await res.json();
      if (json.success) load();
      else alert(json.message || 'Delete failed.');
    } catch {
      alert('Could not reach the backend API.');
    }
  };

  return (
    <AdminLayout title={title}>
      <div className="flex items-center justify-between mb-5 gap-4 flex-wrap">
        <div>
          <p className="text-sm text-[#66708A] font-medium">{description}</p>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center gap-1.5 bg-[#5425F5] hover:bg-[#6D3CFF] text-white font-semibold text-[13px] px-4 py-2.5 rounded-lg shadow-xs transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add {singular}
        </button>
      </div>

      {error && (
        <div className="mb-4 bg-amber-50 border border-amber-200 text-amber-800 text-xs font-semibold px-4 py-3 rounded-xl">
          {error}
        </div>
      )}

      <div className="bg-white rounded-xl border border-[#E7EAF3] shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-[#F8F9FC] border-b border-[#E7EAF3]">
                {columns.map((c) => (
                  <th key={c.key} className="px-4 py-3 text-[11px] font-bold text-[#66708A] uppercase tracking-wider whitespace-nowrap">
                    {c.label}
                  </th>
                ))}
                <th className="px-4 py-3 text-[11px] font-bold text-[#66708A] uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={columns.length + 1} className="px-4 py-10 text-center text-sm text-[#66708A] font-medium">
                    <Loader2 className="w-4 h-4 animate-spin inline mr-2" />
                    Loading...
                  </td>
                </tr>
              ) : items.length === 0 ? (
                <tr>
                  <td colSpan={columns.length + 1} className="px-4 py-10 text-center text-sm text-[#66708A] font-medium">
                    No {emptyLabel} yet. Click &quot;Add {singular}&quot; to create one.
                  </td>
                </tr>
              ) : (
                items.map((row) => (
                  <tr key={row.id} className="border-b border-[#E7EAF3] last:border-b-0 hover:bg-[#F8F9FC] transition-colors">
                    {columns.map((c) => (
                      <td key={c.key} className="px-4 py-3 text-[13px] text-[#17203D] font-medium">
                        {c.render ? c.render(row) : String(row[c.key] ?? '—')}
                      </td>
                    ))}
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1">
                        <button onClick={() => openEdit(row)} className="p-1.5 text-[#66708A] hover:text-[#5425F5] hover:bg-purple-50 rounded-lg" aria-label="Edit">
                          <Pencil className="w-3.5 h-3.5" />
                        </button>
                        <button onClick={() => handleDelete(row)} className="p-1.5 text-[#66708A] hover:text-rose-600 hover:bg-rose-50 rounded-lg" aria-label="Delete">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs" onClick={() => setModalOpen(false)} />
          <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-lg max-h-[85vh] overflow-y-auto">
            <div className="px-5 py-4 border-b border-[#E7EAF3] flex items-center justify-between sticky top-0 bg-white">
              <h3 className="text-base font-semibold text-[#17203D]">
                {editingId ? `Edit ${singular}` : `Add ${singular}`}
              </h3>
              <button onClick={() => setModalOpen(false)} className="p-1 text-[#66708A] hover:text-[#17203D]">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-5 space-y-4">
              {formError && (
                <div className="bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold px-3 py-2.5 rounded-lg">
                  {formError}
                </div>
              )}

              {fields.map((f) => (
                <div key={f.key}>
                  <label className="block text-[12px] font-semibold text-[#17203D] mb-1.5">
                    {f.label}{f.required && <span className="text-rose-500"> *</span>}
                  </label>

                  {f.type === 'textarea' ? (
                    <textarea
                      rows={3}
                      required={f.required}
                      value={form[f.key] ?? ''}
                      onChange={(e) => setForm({ ...form, [f.key]: e.target.value })}
                      placeholder={f.placeholder}
                      className="w-full h-auto px-3 py-2.5 border border-[#DDE2EE] rounded-lg text-[13px] text-[#17203D] focus:outline-hidden focus:border-[#5425F5] resize-none"
                    />
                  ) : f.type === 'select' ? (
                    <select
                      required={f.required}
                      value={form[f.key] ?? ''}
                      onChange={(e) => setForm({ ...form, [f.key]: e.target.value })}
                      className="w-full h-10 px-3 border border-[#DDE2EE] rounded-lg text-[13px] text-[#17203D] focus:outline-hidden focus:border-[#5425F5]"
                    >
                      <option value="">Select...</option>
                      {f.options?.map((o) => (
                        <option key={o.value} value={o.value}>{o.label}</option>
                      ))}
                    </select>
                  ) : f.type === 'checkbox' ? (
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={!!form[f.key]}
                        onChange={(e) => setForm({ ...form, [f.key]: e.target.checked })}
                        className="w-4 h-4 accent-[#5425F5]"
                      />
                      <span className="text-[13px] text-[#66708A] font-medium">{f.help || 'Enabled'}</span>
                    </label>
                  ) : f.type === 'image' ? (
                    <div className="space-y-2">
                      {f.recommendedSize && (
                        <div className="text-[11px] font-semibold text-purple-700 bg-purple-50 border border-purple-200 px-2.5 py-1 rounded">
                          Recommended: {f.recommendedSize} • JPG / PNG / WebP (Auto-optimized)
                        </div>
                      )}
                      <div className="flex items-center gap-2">
                        <label className="flex items-center gap-1.5 px-3 py-2 border border-dashed border-purple-300 rounded-lg bg-purple-50/50 hover:bg-purple-100/50 text-purple-700 text-xs font-semibold cursor-pointer transition-colors shrink-0">
                          {uploadingField === f.key ? (
                            <>
                              <Loader2 className="w-3.5 h-3.5 animate-spin" />
                              <span>Optimizing WebP...</span>
                            </>
                          ) : (
                            <>
                              <Upload className="w-3.5 h-3.5" />
                              <span>Upload File</span>
                            </>
                          )}
                          <input
                            type="file"
                            accept="image/jpeg,image/png,image/webp,image/jpg"
                            className="hidden"
                            disabled={uploadingField === f.key}
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) handleFileUpload(f.key, file, f.folder || 'banners');
                            }}
                          />
                        </label>
                        <input
                          type="text"
                          value={form[f.key] ?? ''}
                          onChange={(e) => setForm({ ...form, [f.key]: e.target.value })}
                          placeholder={f.placeholder || 'Or paste image URL...'}
                          className="flex-1 h-9 px-2.5 border border-[#DDE2EE] rounded-lg text-xs text-[#17203D] focus:outline-hidden focus:border-[#5425F5]"
                        />
                      </div>
                      {form[f.key] && (
                        <div className="relative w-full max-w-xs h-24 rounded-lg overflow-hidden border border-slate-200 bg-slate-50 p-1 flex items-center justify-center">
                          <img src={form[f.key]} alt="Preview" className="max-w-full max-h-full object-contain" />
                          <button
                            type="button"
                            onClick={() => setForm({ ...form, [f.key]: '' })}
                            className="absolute top-1 right-1 p-1 bg-slate-900/60 hover:bg-rose-600 text-white rounded-full transition-colors cursor-pointer"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      )}
                    </div>
                  ) : f.type === 'tags' ? (
                    <input
                      type="text"
                      value={Array.isArray(form[f.key]) ? form[f.key].join(', ') : (form[f.key] ?? '')}
                      onChange={(e) => setForm({ ...form, [f.key]: e.target.value.split(',').map((v) => v.trim()).filter(Boolean) })}
                      placeholder={f.placeholder || 'Comma-separated values'}
                      className="w-full h-10 px-3 border border-[#DDE2EE] rounded-lg text-[13px] text-[#17203D] focus:outline-hidden focus:border-[#5425F5]"
                    />
                  ) : (
                    <input
                      type={f.type}
                      required={f.required}
                      value={form[f.key] ?? ''}
                      onChange={(e) => setForm({ ...form, [f.key]: f.type === 'number' ? Number(e.target.value) : e.target.value })}
                      placeholder={f.placeholder}
                      className="w-full h-10 px-3 border border-[#DDE2EE] rounded-lg text-[13px] text-[#17203D] focus:outline-hidden focus:border-[#5425F5]"
                    />
                  )}
                  {((f.key === 'desktop_image' || f.key === 'image' || f.key === 'mobile_image') && form[f.key]) && (
                    <div className="mt-2 w-full max-w-[200px] h-20 rounded-lg overflow-hidden border border-slate-200 bg-slate-50 p-1 flex items-center justify-center">
                      <img src={form[f.key]} alt="Preview" className="max-w-full max-h-full object-contain" />
                    </div>
                  )}
                  {f.help && f.type !== 'checkbox' && (
                    <p className="text-[11px] text-[#66708A] mt-1">{f.help}</p>
                  )}
                </div>
              ))}

              {!fields.some((f) => f.key === 'status') && (
                <label className="flex items-center gap-2 cursor-pointer pt-1">
                  <input
                    type="checkbox"
                    checked={form.status !== false}
                    onChange={(e) => setForm({ ...form, status: e.target.checked })}
                    className="w-4 h-4 accent-[#5425F5]"
                  />
                  <span className="text-[13px] text-[#66708A] font-medium">Active</span>
                </label>
              )}

              <div className="flex items-center gap-2 pt-2">
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 bg-[#5425F5] hover:bg-[#6D3CFF] text-white font-semibold text-[13px] py-2.5 rounded-lg transition-colors disabled:opacity-60"
                >
                  {saving ? 'Saving...' : editingId ? 'Save Changes' : 'Create'}
                </button>
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2.5 border border-[#DDE2EE] text-[#17203D] font-semibold text-[13px] rounded-lg hover:bg-slate-50"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
