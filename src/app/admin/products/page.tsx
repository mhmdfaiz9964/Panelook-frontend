'use client';

import React, { useEffect, useState } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { adminFetch, parseApiResponse, adminUploadImage } from '@/lib/adminApi';
import { MASTER_SCREEN_SIZES } from '@/lib/constants';
import {
  Plus,
  Pencil,
  Trash2,
  X,
  Loader2,
  Search,
  ImageOff,
  Upload,
  Check,
  Eye,
  Layers,
  Laptop,
  Star,
  Sparkles,
  ExternalLink,
} from 'lucide-react';

interface Category { id: number; name: string; }
interface Brand { id: number; name: string; }
interface ProductType { id: number; name: string; slug: string; }
interface LaptopModelItem { id?: number; model_name: string; }
interface PartNumberItem { id?: number; part_number: string; }
interface ImageItem { id?: number; image_url: string; image_type?: string; }

interface ProductRow {
  id: number;
  slug?: string;
  name: string;
  sku: string;
  main_image: string;
  category?: Category;
  brand?: Brand;
  product_type?: ProductType;
  selling_price: number;
  stock_quantity: number;
  min_stock: number;
  status: string;
  display_size: string;
  screen_size?: string;
  pin_type: string;
  display_type: string;
  touch_type: string;
  panel_number?: string;
  laptop_model?: string;
  resolution: string;
  warranty: string;
  is_featured: boolean;
  is_new: boolean;
  laptop_models?: LaptopModelItem[];
  part_numbers?: PartNumberItem[];
  images_relation?: ImageItem[];
  images?: string[];
  description?: string;
}

const emptyForm = {
  name: '',
  sku: '',
  category_id: '',
  brand_id: '',
  product_type_id: '1',
  main_image: '',
  gallery_images: [] as string[],
  selling_price: '',
  stock_quantity: '',
  min_stock: 2,
  status: 'active',
  display_size: '15.6 inch',
  pin_type: '30-Pin',
  display_type: 'IPS',
  touch_type: 'Non-Touch',
  resolution: '1920x1080',
  warranty: '3-12 Months',
  laptop_models: [] as string[],
  part_numbers: [] as string[],
  tags: [] as string[],
  description: '',
  is_featured: false,
  is_new: false,
};

export default function AdminProductsPage() {
  const [products, setProducts] = useState<ProductRow[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [productTypes, setProductTypes] = useState<ProductType[]>([]);
  const [pins, setPins] = useState<{ name: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [error, setError] = useState('');

  // Modal & Form state
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState<typeof emptyForm>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState('');
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});
  const [showPreview, setShowPreview] = useState(false);

  // Chip inputs temporary state
  const [newModel, setNewModel] = useState('');
  const [newPartNumber, setNewPartNumber] = useState('');
  const [uploadingMain, setUploadingMain] = useState(false);
  const [uploadingGallery, setUploadingGallery] = useState(false);
  const [galleryUploadProgress, setGalleryUploadProgress] = useState('');

  const loadProducts = async (q = '') => {
    setLoading(true);
    try {
      const res = await adminFetch(`/admin/products${q ? `?search=${encodeURIComponent(q)}` : ''}`);
      const json = await res.json();
      if (json.success) setProducts(json.data.data);
      else setError('Could not load products.');
    } catch {
      setError('Backend API is unreachable.');
    }
    setLoading(false);
  };

  useEffect(() => {
    loadProducts();
    (async () => {
      try {
        const [c, b, pt, p] = await Promise.all([
          adminFetch('/admin/categories').then((r) => r.json()),
          adminFetch('/admin/brands').then((r) => r.json()),
          fetch('/api/product-types').then((r) => r.json()).catch(() => ({ success: false, data: [] })),
          adminFetch('/admin/panel-pins').then((r) => r.json()),
        ]);
        if (c.success) setCategories(c.data);
        if (b.success) setBrands(b.data);
        if (pt.success) setProductTypes(pt.data);
        if (p.success) setPins(p.data);
      } catch {
        // Fallback gracefully
      }
    })();
  }, []);

  useEffect(() => {
    const t = setTimeout(() => loadProducts(search), 400);
    return () => clearTimeout(t);
  }, [search]);

  const openCreate = () => {
    setEditingId(null);
    setForm(emptyForm);
    setFormError('');
    setFieldErrors({});
    setShowPreview(false);
    setModalOpen(true);
  };

  const openEdit = (p: ProductRow) => {
    setEditingId(p.id);

    // Extract models
    const models: string[] = [];
    if (p.laptop_models && p.laptop_models.length > 0) {
      p.laptop_models.forEach((m) => { if (m.model_name) models.push(m.model_name); });
    } else if (p.laptop_model) {
      p.laptop_model.split(',').forEach((m) => {
        const t = m.trim();
        if (t && !models.includes(t)) models.push(t);
      });
    }

    // Extract part numbers
    const parts: string[] = [];
    if (p.part_numbers && p.part_numbers.length > 0) {
      p.part_numbers.forEach((pt) => { if (pt.part_number) parts.push(pt.part_number); });
    } else if (p.panel_number) {
      p.panel_number.split(',').forEach((pt) => {
        const t = pt.trim();
        if (t && !parts.includes(t)) parts.push(t);
      });
    }

    // Extract gallery images
    const gallery: string[] = [];
    if (p.images_relation && p.images_relation.length > 0) {
      p.images_relation.forEach((img) => {
        if (img.image_url && !gallery.includes(img.image_url)) gallery.push(img.image_url);
      });
    } else if (p.images && Array.isArray(p.images)) {
      p.images.forEach((img) => {
        if (typeof img === 'string' && !gallery.includes(img)) gallery.push(img);
      });
    }

    setForm({
      name: p.name || '',
      sku: p.sku || '',
      category_id: String(p.category?.id || ''),
      brand_id: String(p.brand?.id || ''),
      product_type_id: String(p.product_type?.id || '1'),
      main_image: p.main_image || '',
      gallery_images: gallery,
      selling_price: String(p.selling_price || ''),
      stock_quantity: String(p.stock_quantity ?? ''),
      min_stock: p.min_stock ?? 2,
      status: p.status || 'active',
      display_size: p.display_size || p.screen_size || '15.6 inch',
      pin_type: p.pin_type || '30-Pin',
      display_type: p.display_type || 'IPS',
      touch_type: p.touch_type || 'Non-Touch',
      resolution: p.resolution || '1920x1080',
      warranty: p.warranty || '3-12 Months',
      laptop_models: models,
      part_numbers: parts,
      tags: [],
      description: p.description || '',
      is_featured: Boolean(p.is_featured),
      is_new: Boolean(p.is_new),
    });
    setFormError('');
    setFieldErrors({});
    setShowPreview(false);
    setModalOpen(true);
  };

  // Add laptop model chip
  const handleAddModel = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const trimmed = newModel.trim();
    if (trimmed && !form.laptop_models.includes(trimmed)) {
      setForm({ ...form, laptop_models: [...form.laptop_models, trimmed] });
      setNewModel('');
    }
  };

  const handleRemoveModel = (modelToRemove: string) => {
    setForm({
      ...form,
      laptop_models: form.laptop_models.filter((m) => m !== modelToRemove),
    });
  };

  // Add part number chip
  const handleAddPartNumber = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const trimmed = newPartNumber.trim();
    if (trimmed && !form.part_numbers.includes(trimmed)) {
      setForm({ ...form, part_numbers: [...form.part_numbers, trimmed] });
      setNewPartNumber('');
    }
  };

  const handleRemovePartNumber = (partToRemove: string) => {
    setForm({
      ...form,
      part_numbers: form.part_numbers.filter((p) => p !== partToRemove),
    });
  };

  // Upload main image
  const handleMainImageUpload = async (file: File) => {
    setUploadingMain(true);
    try {
      const res = await adminUploadImage(file, 'products');
      if (res.success && res.url) {
        setForm((prev) => ({ ...prev, main_image: res.url! }));
      } else {
        alert(res.message || 'Main image upload failed.');
      }
    } catch (err: any) {
      alert(`Upload error: ${err.message}`);
    }
    setUploadingMain(false);
  };

  // Upload gallery images (supports single or multiple)
  const handleMultipleGalleryUpload = async (files: FileList | File[]) => {
    const fileList = Array.from(files);
    if (fileList.length === 0) return;

    setUploadingGallery(true);
    const addedUrls: string[] = [];
    const errors: string[] = [];

    for (let i = 0; i < fileList.length; i++) {
      const file = fileList[i];
      setGalleryUploadProgress(`Uploading ${i + 1} of ${fileList.length}...`);
      try {
        const res = await adminUploadImage(file, 'products');
        if (res.success && res.url) {
          addedUrls.push(res.url);
        } else {
          errors.push(`${file.name}: ${res.message || 'Upload failed'}`);
        }
      } catch (err: any) {
        errors.push(`${file.name}: ${err.message}`);
      }
    }

    if (addedUrls.length > 0) {
      setForm((prev) => ({
        ...prev,
        gallery_images: [...prev.gallery_images, ...addedUrls],
      }));
    }

    if (errors.length > 0) {
      alert(`Some uploads failed:\n${errors.join('\n')}`);
    }

    setGalleryUploadProgress('');
    setUploadingGallery(false);
  };

  const handleRemoveGalleryImage = (urlToRemove: string) => {
    setForm((prev) => ({
      ...prev,
      gallery_images: prev.gallery_images.filter((u) => u !== urlToRemove),
    }));
  };

  const handleSetAsMain = (url: string) => {
    setForm((prev) => {
      const oldMain = prev.main_image;
      const newGallery = prev.gallery_images.filter((u) => u !== url);
      if (oldMain && !newGallery.includes(oldMain)) {
        newGallery.push(oldMain);
      }
      return {
        ...prev,
        main_image: url,
        gallery_images: newGallery,
      };
    });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setFormError('');
    setFieldErrors({});

    try {
      const payload: Record<string, any> = {
        name: form.name,
        sku: form.sku,
        category_id: form.category_id ? Number(form.category_id) : null,
        brand_id: form.brand_id ? Number(form.brand_id) : null,
        product_type_id: form.product_type_id ? Number(form.product_type_id) : 1,
        main_image: form.main_image || null,
        images: form.gallery_images || [],
        selling_price: Number(form.selling_price) || 0,
        stock_quantity: Number(form.stock_quantity) || 0,
        min_stock: Number(form.min_stock) || 2,
        status: form.status || 'active',
        display_size: form.display_size || null,
        pin_type: form.pin_type || null,
        display_type: form.display_type || 'IPS',
        touch_type: form.touch_type || 'Non-Touch',
        resolution: form.resolution || null,
        warranty: form.warranty || '3-12 Months',
        laptop_models: form.laptop_models || [],
        part_numbers: form.part_numbers || [],
        tags: form.tags || [],
        description: form.description || null,
        is_featured: Boolean(form.is_featured),
        is_new: Boolean(form.is_new),
      };

      const res = await adminFetch(editingId ? `/admin/products/${editingId}` : '/admin/products', {
        method: editingId ? 'PUT' : 'POST',
        body: JSON.stringify(payload),
      });

      const parsed = await parseApiResponse(res);
      if (parsed.success) {
        setModalOpen(false);
        loadProducts(search);
      } else {
        setFormError(parsed.message || 'Validation failed. Check the fields below.');
        if (parsed.errors) setFieldErrors(parsed.errors);
      }
    } catch (err: any) {
      setFormError(`Unable to connect to the server: ${err.message || 'Network error'}`);
    }
    setSaving(false);
  };

  const handleDelete = async (p: ProductRow) => {
    if (!confirm(`Delete "${p.name}"? This cannot be undone.`)) return;
    try {
      const res = await adminFetch(`/admin/products/${p.id}`, { method: 'DELETE' });
      const parsed = await parseApiResponse(res);
      if (parsed.success) loadProducts(search);
      else alert(parsed.message || 'Delete failed.');
    } catch (err: any) {
      alert(`Could not delete: ${err.message}`);
    }
  };

  const inputClass = 'w-full h-10 px-3 border border-[#DDE2EE] rounded-lg text-[13px] text-[#17203D] focus:outline-hidden focus:border-[#5425F5] bg-white';
  const labelClass = 'block text-[12px] font-semibold text-[#17203D] mb-1.5';

  const selectedBrand = brands.find((b) => String(b.id) === String(form.brand_id));
  const selectedType = productTypes.find((pt) => String(pt.id) === String(form.product_type_id));

  return (
    <AdminLayout title="Products">
      <div className="flex items-center justify-between mb-5 gap-4 flex-wrap">
        <div>
          <p className="text-sm text-[#66708A] font-medium">Manage your laptop displays, MacBook panels, and screens.</p>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center gap-1.5 bg-[#5425F5] hover:bg-[#6D3CFF] text-white font-semibold text-[13px] px-4 py-2.5 rounded-lg shadow-xs transition-colors cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          Add Product
        </button>
      </div>

      <div className="mb-4 relative max-w-sm">
        <Search className="w-4 h-4 text-[#66708A] absolute left-3 top-3" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search products, SKU, 15.6, HP, MacBook..."
          className="w-full pl-9 pr-4 h-10 border border-[#DDE2EE] rounded-lg text-[13px] focus:outline-hidden focus:border-[#5425F5] bg-white"
        />
      </div>

      {error && (
        <div className="mb-4 bg-amber-50 border border-amber-200 text-amber-800 text-xs font-semibold px-4 py-3 rounded-xl">{error}</div>
      )}

      {/* Products Table */}
      <div className="bg-white rounded-xl border border-[#E7EAF3] shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-[#F8F9FC] border-b border-[#E7EAF3]">
                <th className="px-4 py-3 text-[11px] font-bold text-[#66708A] uppercase tracking-wider">Product</th>
                <th className="px-4 py-3 text-[11px] font-bold text-[#66708A] uppercase tracking-wider">SKU</th>
                <th className="px-4 py-3 text-[11px] font-bold text-[#66708A] uppercase tracking-wider">Brand</th>
                <th className="px-4 py-3 text-[11px] font-bold text-[#66708A] uppercase tracking-wider">Screen</th>
                <th className="px-4 py-3 text-[11px] font-bold text-[#66708A] uppercase tracking-wider">Stock</th>
                <th className="px-4 py-3 text-[11px] font-bold text-[#66708A] uppercase tracking-wider">Price</th>
                <th className="px-4 py-3 text-[11px] font-bold text-[#66708A] uppercase tracking-wider">Status</th>
                <th className="px-4 py-3 text-[11px] font-bold text-[#66708A] uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={8} className="px-4 py-10 text-center text-sm text-[#66708A] font-medium"><Loader2 className="w-4 h-4 animate-spin inline mr-2" />Loading displays...</td></tr>
              ) : products.length === 0 ? (
                <tr><td colSpan={8} className="px-4 py-10 text-center text-sm text-[#66708A] font-medium">No displays found matching your query.</td></tr>
              ) : (
                products.map((p) => {
                  const isOut = p.stock_quantity === 0;
                  const isLow = !isOut && p.stock_quantity <= p.min_stock;
                  return (
                    <tr key={p.id} className="border-b border-[#E7EAF3] last:border-b-0 hover:bg-[#F8F9FC] transition-colors">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          {p.main_image ? (
                            <img src={p.main_image} alt="" className="w-10 h-10 rounded-lg object-contain bg-slate-50 border border-[#E7EAF3] p-1 shrink-0" />
                          ) : (
                            <div className="w-10 h-10 rounded-lg bg-slate-50 border border-[#E7EAF3] flex items-center justify-center text-slate-300 shrink-0">
                              <ImageOff className="w-4 h-4" />
                            </div>
                          )}
                          <div className="min-w-0">
                            <div className="text-[13px] font-semibold text-[#17203D] truncate max-w-[220px]">{p.name}</div>
                            <div className="text-[11px] text-[#66708A]">{p.pin_type} • {p.display_type}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-[12px] text-[#66708A] font-mono whitespace-nowrap">{p.sku}</td>
                      <td className="px-4 py-3 text-[13px] text-[#17203D] font-medium whitespace-nowrap">{p.brand?.name || '—'}</td>
                      <td className="px-4 py-3 text-[12px] text-[#17203D] whitespace-nowrap font-medium">{p.display_size || p.screen_size || '—'}</td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${isOut ? 'bg-rose-100 text-rose-800' : isLow ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'}`}>
                          {p.stock_quantity} units
                        </span>
                      </td>
                      <td className="px-4 py-3 text-[13px] font-bold text-[#17203D] whitespace-nowrap">LKR {Number(p.selling_price).toLocaleString()}</td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full capitalize ${p.status === 'active' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-600'}`}>
                          {p.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-right">
                        <div className="flex items-center justify-end gap-1">
                          {p.slug && (
                            <a
                              href={`/product/${p.slug}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-1.5 text-[#66708A] hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                              title="View Live Product Page"
                            >
                              <ExternalLink className="w-3.5 h-3.5" />
                            </a>
                          )}
                          <button onClick={() => openEdit(p)} className="p-1.5 text-[#66708A] hover:text-[#5425F5] hover:bg-purple-50 rounded-lg cursor-pointer" aria-label="Edit">
                            <Pencil className="w-3.5 h-3.5" />
                          </button>
                          <button onClick={() => handleDelete(p)} className="p-1.5 text-[#66708A] hover:text-rose-600 hover:bg-rose-50 rounded-lg cursor-pointer" aria-label="Delete">
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: Create / Edit Product */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs" onClick={() => setModalOpen(false)} />
          <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[92vh] overflow-y-auto z-10 my-auto">

            {/* Modal Header */}
            <div className="px-5 py-3.5 border-b border-[#E7EAF3] flex items-center justify-between sticky top-0 bg-white z-20">
              <div className="flex items-center gap-3">
                <h3 className="text-base font-bold text-[#17203D]">{editingId ? 'Edit Display Product' : 'Add Display Product'}</h3>
                <button
                  type="button"
                  onClick={() => setShowPreview(!showPreview)}
                  className={`text-xs font-semibold px-2.5 py-1 rounded-md border flex items-center gap-1.5 transition-colors cursor-pointer ${showPreview ? 'bg-purple-50 border-purple-300 text-purple-700' : 'border-slate-300 text-slate-600 hover:bg-slate-50'
                    }`}
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>{showPreview ? 'Hide Preview' : 'Show Storefront Preview'}</span>
                </button>
              </div>
              <button onClick={() => setModalOpen(false)} className="p-1 text-[#66708A] hover:text-[#17203D] cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Live Preview Card if toggled */}
            {showPreview && (
              <div className="p-4 bg-slate-50 border-b border-slate-200">
                <div className="text-xs font-bold text-slate-600 mb-2 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-purple-600" />
                  <span>Customer Card Preview:</span>
                </div>
                <div className="max-w-xs bg-white rounded-lg border border-slate-200 p-3 shadow-sm space-y-2">
                  <div className="w-full h-36 bg-slate-50 rounded flex items-center justify-center p-2 border border-slate-100">
                    {form.main_image ? (
                      <img src={form.main_image} alt="" className="w-full h-full object-contain" />
                    ) : (
                      <span className="text-xs text-slate-400">No Image Selected</span>
                    )}
                  </div>
                  <div>
                    <div className="text-[10px] font-bold uppercase text-purple-700">{selectedBrand?.name || 'Universal'} • {selectedType?.name || 'Laptop Display'}</div>
                    <div className="text-xs font-bold text-slate-900 line-clamp-1">{form.name || 'Product Title'}</div>
                    <div className="text-[11px] text-slate-500 font-medium">
                      {form.display_size} • {form.resolution} • {form.pin_type}
                    </div>
                    <div className="text-[10px] text-slate-400">
                      {form.touch_type} • {form.display_type}
                    </div>
                    {form.laptop_models.length > 0 && (
                      <div className="text-[10px] text-blue-600 font-semibold truncate mt-1">
                        Compatible: {form.laptop_models.slice(0, 2).join(', ')}{form.laptop_models.length > 2 ? ' +' : ''}
                      </div>
                    )}
                    <div className="text-sm font-black text-slate-900 mt-1">
                      LKR {Number(form.selling_price || 0).toLocaleString()}
                    </div>
                  </div>
                </div>
              </div>
            )}

            <form onSubmit={handleSave} className="p-5 space-y-6">
              {formError && (
                <div className="bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold p-3 rounded-lg">
                  <div className="font-bold mb-1">{formError}</div>
                  {Object.keys(fieldErrors).length > 0 && (
                    <ul className="list-disc pl-4 space-y-0.5 text-rose-700">
                      {Object.entries(fieldErrors).map(([field, msgs]) => (
                        <li key={field}>
                          <span className="font-bold">{field}</span>: {msgs.join(', ')}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              )}

              {/* SECTION 1: BASIC INFORMATION */}
              <div>
                <h4 className="text-[11px] font-black text-[#66708A] uppercase tracking-wider mb-3 flex items-center gap-1.5">
                  <Laptop className="w-3.5 h-3.5" />
                  Basic Information
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3.5">
                  <div className="sm:col-span-2">
                    <label className={labelClass}>Product Name *</label>
                    <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className={inputClass} placeholder="e.g. HP 15.6 Inch FHD IPS Display (30-Pin)" />
                  </div>

                  <div>
                    <label className={labelClass}>SKU *</label>
                    <input required value={form.sku} onChange={(e) => setForm({ ...form, sku: e.target.value })} className={inputClass} placeholder="DSP-HP15-FHD" />
                  </div>

                  <div>
                    <label className={labelClass}>Brand *</label>
                    <select required value={form.brand_id} onChange={(e) => setForm({ ...form, brand_id: e.target.value })} className={inputClass}>
                      <option value="">Select brand</option>
                      {brands.map((b) => <option key={b.id} value={b.id}>{b.name}</option>)}
                    </select>
                  </div>

                  <div>
                    <label className={labelClass}>Category</label>
                    <select value={form.category_id} onChange={(e) => setForm({ ...form, category_id: e.target.value })} className={inputClass}>
                      <option value="">Select category</option>
                      {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                  </div>

                  <div>
                    <label className={labelClass}>Status</label>
                    <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} className={inputClass}>
                      <option value="active">Active (Visible on Storefront)</option>
                      <option value="draft">Draft (Hidden)</option>
                      <option value="archived">Archived</option>
                    </select>
                  </div>

                  <div className="flex items-center gap-4 sm:col-span-2 pt-2">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" checked={form.is_featured} onChange={(e) => setForm({ ...form, is_featured: e.target.checked })} className="w-4 h-4 accent-[#5425F5]" />
                      <span className="text-[13px] text-[#17203D] font-medium">Show in Featured Displays (Homepage)</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" checked={form.is_new} onChange={(e) => setForm({ ...form, is_new: e.target.checked })} className="w-4 h-4 accent-[#5425F5]" />
                      <span className="text-[13px] text-[#17203D] font-medium">Mark as New Arrival</span>
                    </label>
                  </div>
                </div>
              </div>

              {/* SECTION 2: DISPLAY SPECIFICATIONS & MASTER SCREEN SIZE */}
              <div>
                <h4 className="text-[11px] font-black text-[#66708A] uppercase tracking-wider mb-3 flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5" />
                  Display Specifications (Master Data)
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3.5">
                  {/* Master Screen Size Dropdown */}
                  <div>
                    <label className={labelClass}>Screen Size * (Central Master Data)</label>
                    <select
                      required
                      value={form.display_size}
                      onChange={(e) => setForm({ ...form, display_size: e.target.value })}
                      className={inputClass}
                    >
                      {MASTER_SCREEN_SIZES.map((size) => (
                        <option key={size} value={size}>{size}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className={labelClass}>Connector Pin Type *</label>
                    <select value={form.pin_type} onChange={(e) => setForm({ ...form, pin_type: e.target.value })} className={inputClass}>
                      <option value="30-Pin">30-Pin eDP</option>
                      <option value="40-Pin">40-Pin eDP (Touch / QHD / 4K)</option>
                      <option value="40-Pin LVDS">40-Pin LVDS (Old standard)</option>
                      <option value="40-Pin Touch">40-Pin Touch Screen</option>
                      {pins.map((p) => <option key={p.name} value={p.name}>{p.name}</option>)}
                    </select>
                  </div>

                  <div>
                    <label className={labelClass}>Panel Technology</label>
                    <select value={form.display_type} onChange={(e) => setForm({ ...form, display_type: e.target.value })} className={inputClass}>
                      <option value="IPS">IPS (Wide Viewing Angle)</option>
                      <option value="OLED">OLED (True Black)</option>
                      <option value="TN">TN (Standard)</option>
                      <option value="VA">VA</option>
                    </select>
                  </div>

                  <div>
                    <label className={labelClass}>Touch Support</label>
                    <select value={form.touch_type} onChange={(e) => setForm({ ...form, touch_type: e.target.value })} className={inputClass}>
                      <option value="Non-Touch">Non-Touch</option>
                      <option value="Touch">On-Cell / In-Cell Touch</option>
                    </select>
                  </div>

                  <div>
                    <label className={labelClass}>Resolution</label>
                    <input value={form.resolution} onChange={(e) => setForm({ ...form, resolution: e.target.value })} className={inputClass} placeholder="1920x1080 (FHD)" />
                  </div>

                  <div>
                    <label className={labelClass}>Warranty</label>
                    <input value={form.warranty} onChange={(e) => setForm({ ...form, warranty: e.target.value })} className={inputClass} placeholder="3 Months / 6 Months / 1 Year" />
                  </div>
                </div>
              </div>

              {/* SECTION 3: MULTIPLE COMPATIBLE LAPTOP MODELS */}
              <div className="bg-slate-50 border border-slate-200 rounded-lg p-3.5 space-y-2.5">
                <div className="flex items-center justify-between">
                  <label className="text-[12px] font-bold text-[#17203D]">
                    Compatible Laptop Models (Multiple Support)
                  </label>
                  <span className="text-[11px] text-[#66708A]">{form.laptop_models.length} model(s) added</span>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={newModel}
                    onChange={(e) => setNewModel(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddModel(); } }}
                    placeholder="e.g. HP Pavilion 15, HP 15-cs, MacBook Air A2337..."
                    className="flex-1 h-9 px-3 border border-[#DDE2EE] rounded-lg text-xs text-[#17203D] bg-white focus:outline-hidden focus:border-[#5425F5]"
                  />
                  <button
                    type="button"
                    onClick={handleAddModel}
                    className="px-3 py-2 bg-[#5425F5] hover:bg-[#6D3CFF] text-white text-xs font-semibold rounded-lg shrink-0 cursor-pointer"
                  >
                    + Add Model
                  </button>
                </div>
                {form.laptop_models.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {form.laptop_models.map((model) => (
                      <span
                        key={model}
                        className="inline-flex items-center gap-1.5 bg-white border border-slate-300 text-slate-800 text-[11px] font-semibold px-2 py-0.5 rounded shadow-2xs"
                      >
                        <span>{model}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveModel(model)}
                          className="text-slate-400 hover:text-rose-600 cursor-pointer"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* SECTION 4: MULTIPLE PART NUMBERS */}
              <div className="bg-purple-50/40 border border-purple-200 rounded-lg p-3.5 space-y-2.5">
                <div className="flex items-center justify-between">
                  <label className="text-[12px] font-bold text-purple-950">
                    Manufacturer Part Numbers (Multiple Support)
                  </label>
                  <span className="text-[11px] text-purple-700">{form.part_numbers.length} part number(s)</span>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={newPartNumber}
                    onChange={(e) => setNewPartNumber(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddPartNumber(); } }}
                    placeholder="e.g. B156HAN08.0, NV156FHM-N4K, N156HGA-EA1..."
                    className="flex-1 h-9 px-3 border border-[#DDE2EE] rounded-lg text-xs text-[#17203D] bg-white focus:outline-hidden focus:border-[#5425F5]"
                  />
                  <button
                    type="button"
                    onClick={handleAddPartNumber}
                    className="px-3 py-2 bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold rounded-lg shrink-0 cursor-pointer"
                  >
                    + Add Part #
                  </button>
                </div>
                {form.part_numbers.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {form.part_numbers.map((part) => (
                      <span
                        key={part}
                        className="inline-flex items-center gap-1.5 bg-white border border-purple-300 text-purple-900 text-[11px] font-bold px-2 py-0.5 rounded shadow-2xs"
                      >
                        <span>{part}</span>
                        <button
                          type="button"
                          onClick={() => handleRemovePartNumber(part)}
                          className="text-purple-400 hover:text-rose-600 cursor-pointer"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* SECTION 5: IMAGE UPLOADER & GALLERY */}
              <div className="space-y-4">
                <h4 className="text-[11px] font-black text-[#66708A] uppercase tracking-wider mb-2">
                  Product Images (WebP Optimization)
                </h4>

                {/* Main Image Upload Box */}
                <div className="border border-slate-200 rounded-lg p-3.5 bg-white space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[12px] font-bold text-[#17203D]">Main Display Image</span>
                    <span className="text-[11px] text-purple-700 font-semibold bg-purple-50 border border-purple-200 px-2 py-0.5 rounded">
                      Recommended: 1200 × 1200 px • WebP / JPG / PNG
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <label className="flex items-center gap-1.5 px-3.5 py-2 border border-dashed border-purple-400 rounded-lg bg-purple-50 hover:bg-purple-100 text-purple-700 text-xs font-semibold cursor-pointer transition-colors shrink-0">
                      {uploadingMain ? (
                        <>
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          <span>Converting to WebP...</span>
                        </>
                      ) : (
                        <>
                          <Upload className="w-3.5 h-3.5" />
                          <span>Upload Main Image</span>
                        </>
                      )}
                      <input
                        type="file"
                        accept="image/jpeg,image/png,image/webp,image/jpg"
                        className="hidden"
                        disabled={uploadingMain}
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handleMainImageUpload(file);
                        }}
                      />
                    </label>

                    <input
                      type="text"
                      value={form.main_image}
                      onChange={(e) => setForm({ ...form, main_image: e.target.value })}
                      placeholder="Or paste public Image URL..."
                      className="flex-1 h-9 px-2.5 border border-[#DDE2EE] rounded-lg text-xs text-[#17203D]"
                    />
                  </div>

                  {form.main_image && (
                    <div className="relative w-28 h-28 rounded-lg overflow-hidden border border-slate-200 bg-slate-50 p-1 flex items-center justify-center mt-2">
                      <img src={form.main_image} alt="Main Preview" className="max-w-full max-h-full object-contain" />
                      <button
                        type="button"
                        onClick={() => setForm({ ...form, main_image: '' })}
                        className="absolute top-1 right-1 p-1 bg-slate-900/70 hover:bg-rose-600 text-white rounded-full transition-colors cursor-pointer"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  )}
                </div>

                {/* Gallery Images Upload Box */}
                <div className="border border-slate-200 rounded-lg p-3.5 bg-white space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[12px] font-bold text-[#17203D]">Gallery Images ({form.gallery_images.length})</span>
                    <span className="text-[11px] text-slate-500">Recommended: 1200 × 1200 px</span>
                  </div>

                  <div className="flex flex-wrap items-center gap-3">
                    <label className="inline-flex items-center gap-2 px-3.5 py-2 border border-dashed border-purple-400 rounded-lg bg-purple-50 hover:bg-purple-100 text-purple-700 text-xs font-semibold cursor-pointer transition-colors">
                      {uploadingGallery ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin text-purple-600" />
                          <span className="font-bold">{galleryUploadProgress || 'Uploading images...'}</span>
                        </>
                      ) : (
                        <>
                          <Plus className="w-4 h-4" />
                          <span>+ Upload Multiple Images</span>
                        </>
                      )}
                      <input
                        type="file"
                        multiple
                        accept="image/jpeg,image/png,image/webp,image/jpg"
                        className="hidden"
                        disabled={uploadingGallery}
                        onChange={(e) => {
                          if (e.target.files && e.target.files.length > 0) {
                            handleMultipleGalleryUpload(e.target.files);
                            e.target.value = '';
                          }
                        }}
                      />
                    </label>
                    <span className="text-[11px] text-slate-400">Select one or multiple images at once (auto-converted to WebP)</span>
                  </div>

                  {form.gallery_images.length > 0 && (
                    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2 pt-2">
                      {form.gallery_images.map((imgUrl, idx) => (
                        <div key={idx} className="relative group border border-slate-200 rounded-lg bg-slate-50 p-1 flex flex-col items-center">
                          <div className="w-full aspect-square flex items-center justify-center overflow-hidden">
                            <img src={imgUrl} alt="" className="max-w-full max-h-full object-contain" />
                          </div>
                          <div className="w-full flex items-center justify-between gap-1 mt-1 pt-1 border-t border-slate-100">
                            <button
                              type="button"
                              onClick={() => handleSetAsMain(imgUrl)}
                              className="text-[9px] text-blue-600 hover:underline font-bold"
                            >
                              Set Main
                            </button>
                            <button
                              type="button"
                              onClick={() => handleRemoveGalleryImage(imgUrl)}
                              className="text-[9px] text-rose-600 hover:underline font-bold"
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* SECTION 6: PRICING & INVENTORY */}
              <div>
                <h4 className="text-[11px] font-black text-[#66708A] uppercase tracking-wider mb-3">
                  Pricing &amp; Inventory
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                  <div>
                    <label className={labelClass}>Selling Price (LKR) *</label>
                    <input required type="number" value={form.selling_price} onChange={(e) => setForm({ ...form, selling_price: e.target.value })} className={inputClass} placeholder="18500" />
                  </div>
                  <div>
                    <label className={labelClass}>Stock Quantity *</label>
                    <input required type="number" value={form.stock_quantity} onChange={(e) => setForm({ ...form, stock_quantity: e.target.value })} className={inputClass} placeholder="25" />
                  </div>
                  <div>
                    <label className={labelClass}>Low Stock Alert Threshold</label>
                    <input type="number" value={form.min_stock} onChange={(e) => setForm({ ...form, min_stock: Number(e.target.value) })} className={inputClass} placeholder="2" />
                  </div>
                </div>
              </div>

              {/* SECTION 7: DESCRIPTION */}
              <div>
                <label className={labelClass}>Product Description &amp; Technical Notes</label>
                <textarea
                  rows={3}
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="Detailed specifications, compatibility remarks, installation tips..."
                  className="w-full p-3 border border-[#DDE2EE] rounded-lg text-[13px] text-[#17203D] focus:outline-hidden focus:border-[#5425F5] resize-none"
                />
              </div>

              {/* ACTION BUTTONS */}
              <div className="flex items-center gap-3 pt-3 border-t border-[#E7EAF3]">
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 bg-[#5425F5] hover:bg-[#6D3CFF] text-white font-bold text-sm py-2.5 rounded-lg transition-colors disabled:opacity-60 cursor-pointer shadow-md"
                >
                  {saving ? 'Saving Display...' : editingId ? 'Update Display Product' : 'Create Display Product'}
                </button>
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-5 py-2.5 border border-[#DDE2EE] text-[#17203D] font-semibold text-sm rounded-lg hover:bg-slate-50 cursor-pointer"
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
