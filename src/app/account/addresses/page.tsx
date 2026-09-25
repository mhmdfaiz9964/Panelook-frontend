'use client';

import React, { useEffect, useState } from 'react';
import { AccountLayout } from '@/components/account/AccountLayout';
import { useCustomerAuth } from '@/context/CustomerAuthContext';
import { getApiUrl } from '@/lib/config';
import { MapPin, Plus, Trash2, Home, Briefcase, Check, Loader2, X, AlertCircle } from 'lucide-react';

export default function AccountAddressesPage() {
  const { token } = useCustomerAuth();
  const [addresses, setAddresses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [type, setType] = useState('Home');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [addressLine1, setAddressLine1] = useState('');
  const [addressLine2, setAddressLine2] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [isDefault, setIsDefault] = useState(false);

  // Provinces, Districts, Cities State
  const [provinces, setProvinces] = useState<any[]>([]);
  const [districts, setDistricts] = useState<any[]>([]);
  const [cities, setCities] = useState<any[]>([]);
  const [selectedProvince, setSelectedProvince] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('');
  const [selectedCity, setSelectedCity] = useState('');

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const loadAddresses = async () => {
    if (!token) return;
    try {
      const res = await fetch(getApiUrl('/customer/addresses'), {
        headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' },
      });
      if (res.ok) {
        const json = await res.json();
        if (json.success) setAddresses(json.data || []);
      }
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAddresses();
    // Load provinces
    (async () => {
      try {
        const res = await fetch(getApiUrl('/locations/provinces'));
        const json = await res.json();
        if (json.success) setProvinces(json.data);
      } catch {
        // ignore
      }
    })();
  }, [token]);

  // When province changes, load districts
  useEffect(() => {
    if (!selectedProvince) {
      setDistricts([]);
      setSelectedDistrict('');
      return;
    }
    (async () => {
      try {
        const res = await fetch(getApiUrl(`/locations/districts?province_id=${selectedProvince}`));
        const json = await res.json();
        if (json.success) setDistricts(json.data);
      } catch {
        // ignore
      }
    })();
  }, [selectedProvince]);

  // When district changes, load cities
  useEffect(() => {
    if (!selectedDistrict) {
      setCities([]);
      setSelectedCity('');
      return;
    }
    (async () => {
      try {
        const res = await fetch(getApiUrl(`/locations/cities?district_id=${selectedDistrict}`));
        const json = await res.json();
        if (json.success) setCities(json.data);
      } catch {
        // ignore
      }
    })();
  }, [selectedDistrict]);

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this delivery address?')) return;
    try {
      await fetch(getApiUrl(`/customer/addresses/${id}`), {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' },
      });
      setAddresses(addresses.filter((a) => a.id !== id));
    } catch {
      alert('Could not delete address.');
    }
  };

  const handleSaveAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;

    setSaving(true);
    setError('');

    try {
      const res = await fetch(getApiUrl('/customer/addresses'), {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          type,
          full_name: fullName,
          phone,
          province_id: selectedProvince || null,
          district_id: selectedDistrict || null,
          city_id: selectedCity || null,
          address_line_1: addressLine1,
          address_line_2: addressLine2,
          postal_code: postalCode,
          is_default: isDefault,
        }),
      });

      const json = await res.json();
      if (res.ok && json.success) {
        setModalOpen(false);
        loadAddresses();
        // Reset form
        setAddressLine1('');
        setAddressLine2('');
        setPostalCode('');
      } else {
        setError(json.message || 'Failed to save address.');
      }
    } catch {
      setError('Network error saving address.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <AccountLayout
      title="Saved Addresses"
      subtitle="Manage shipping locations for quick 1-click checkout dispatches."
    >
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-500">
            Stored Delivery Locations ({addresses.length})
          </span>
          <button
            onClick={() => setModalOpen(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-4 py-2 rounded-2xl text-xs flex items-center gap-1.5 shadow-sm cursor-pointer transition"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Address</span>
          </button>
        </div>

        {loading ? (
          <div className="bg-white rounded-3xl p-16 text-center text-xs font-bold text-slate-500 border border-slate-200">
            <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2 text-blue-600" />
            Loading saved addresses...
          </div>
        ) : addresses.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center space-y-3 border border-slate-200">
            <MapPin className="w-10 h-10 text-slate-300 mx-auto" />
            <p className="text-xs font-bold text-slate-500">No saved addresses yet.</p>
            <button
              onClick={() => setModalOpen(true)}
              className="inline-block bg-blue-600 text-white font-bold px-4 py-2 rounded-xl text-xs cursor-pointer"
            >
              Add First Address
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {addresses.map((addr) => (
              <div
                key={addr.id}
                className="bg-white p-6 rounded-3xl border border-slate-200 shadow-2xs space-y-3 flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 font-black text-xs text-slate-900">
                      {addr.type === 'Work' ? (
                        <Briefcase className="w-4 h-4 text-blue-600" />
                      ) : (
                        <Home className="w-4 h-4 text-blue-600" />
                      )}
                      <span>{addr.type} Address</span>
                    </div>

                    {addr.is_default && (
                      <span className="bg-emerald-50 text-emerald-800 text-[10px] font-black px-2.5 py-0.5 rounded-full border border-emerald-200">
                        Default
                      </span>
                    )}
                  </div>

                  <div className="text-xs text-slate-700 space-y-0.5">
                    <span className="font-bold text-slate-900 block">{addr.full_name}</span>
                    <span className="text-slate-500 block">Phone: {addr.phone}</span>
                    <p className="text-slate-600 mt-1">{addr.address_line_1}</p>
                    {addr.address_line_2 && <p className="text-slate-500">{addr.address_line_2}</p>}
                    <p className="font-semibold text-slate-900">
                      {addr.city?.name || 'City'}, {addr.district?.name || 'District'}
                      {addr.province ? ` (${addr.province.name} Province)` : ''}
                    </p>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-end">
                  <button
                    onClick={() => handleDelete(addr.id)}
                    className="text-xs font-bold text-rose-600 hover:text-rose-700 flex items-center gap-1 cursor-pointer transition"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Delete</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Add Address Modal */}
        {modalOpen && (
          <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-4 shadow-2xl border border-slate-200 animate-in fade-in">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="text-base font-black text-slate-900">Add New Shipping Address</h3>
                <button
                  onClick={() => setModalOpen(false)}
                  className="text-slate-400 hover:text-slate-600 p-1"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {error && (
                <div className="bg-rose-50 border border-rose-200 text-rose-800 text-xs font-bold p-3 rounded-xl flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <form onSubmit={handleSaveAddress} className="space-y-3.5 text-xs">
                {/* Type Selection */}
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Address Label</label>
                  <div className="grid grid-cols-3 gap-2">
                    {['Home', 'Work', 'Other'].map((t) => (
                      <button
                        key={t}
                        type="button"
                        onClick={() => setType(t)}
                        className={`py-2 px-3 rounded-xl font-bold border transition text-center ${
                          type === t
                            ? 'bg-blue-600 text-white border-blue-600'
                            : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Recipient Name *</label>
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Full Name"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-900"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Contact Mobile *</label>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="077 123 4567"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-900"
                    />
                  </div>
                </div>

                {/* 3-Tier Sri Lanka Cascading Location */}
                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Province *</label>
                    <select
                      value={selectedProvince}
                      onChange={(e) => setSelectedProvince(e.target.value)}
                      className="w-full px-2.5 py-2 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-900"
                    >
                      <option value="">Select</option>
                      {provinces.map((p) => (
                        <option key={p.id} value={p.id}>{p.name}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">District *</label>
                    <select
                      disabled={!selectedProvince}
                      value={selectedDistrict}
                      onChange={(e) => setSelectedDistrict(e.target.value)}
                      className="w-full px-2.5 py-2 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-900 disabled:bg-slate-100"
                    >
                      <option value="">Select</option>
                      {districts.map((d) => (
                        <option key={d.id} value={d.id}>{d.name}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">City / Town *</label>
                    <select
                      disabled={!selectedDistrict}
                      value={selectedCity}
                      onChange={(e) => setSelectedCity(e.target.value)}
                      className="w-full px-2.5 py-2 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-900 disabled:bg-slate-100"
                    >
                      <option value="">Select</option>
                      {cities.map((c) => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Street Address Line 1 *</label>
                  <input
                    type="text"
                    required
                    value={addressLine1}
                    onChange={(e) => setAddressLine1(e.target.value)}
                    placeholder="House / Building No, Street Name"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-900"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Address Line 2</label>
                    <input
                      type="text"
                      value={addressLine2}
                      onChange={(e) => setAddressLine2(e.target.value)}
                      placeholder="Apartment, Suite (optional)"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-900"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Postal Code</label>
                    <input
                      type="text"
                      value={postalCode}
                      onChange={(e) => setPostalCode(e.target.value)}
                      placeholder="e.g. 00300"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-900"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <input
                    type="checkbox"
                    id="def"
                    checked={isDefault}
                    onChange={(e) => setIsDefault(e.target.checked)}
                    className="w-4 h-4 text-blue-600 rounded border-slate-300"
                  />
                  <label htmlFor="def" className="font-semibold text-slate-700 cursor-pointer">
                    Set as default delivery address
                  </label>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setModalOpen(false)}
                    className="px-4 py-2 rounded-xl text-slate-600 font-bold hover:bg-slate-100"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-5 py-2 rounded-xl flex items-center gap-1.5 shadow-sm"
                  >
                    {saving && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                    <span>Save Address</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </AccountLayout>
  );
}
