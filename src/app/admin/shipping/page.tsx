'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { adminFetch } from '@/lib/adminApi';
import { getShippingNoteUrl, getShippingLabelUrl } from '@/lib/config';
import {
  Truck,
  Package,
  Search,
  Filter,
  Printer,
  FileText,
  ExternalLink,
  Loader2,
  CheckCircle2,
  Clock,
  AlertCircle,
  X,
} from 'lucide-react';

interface ShipmentRow {
  id: number;
  shipment_number: string;
  order_id: number;
  tracking_number: string | null;
  shipping_fee: number;
  status: string;
  dispatch_date: string | null;
  delivered_date: string | null;
  order: {
    id: number;
    order_number: string;
    customer_name: string;
    customer_phone: string;
    shipping_address: string;
    city: string;
    district: string;
    payment_method: string;
    grand_total: number;
    items?: any[];
  };
  courier?: {
    id: number;
    name: string;
    tracking_url?: string;
  };
  shipping_method?: {
    name: string;
  };
}

const STATUS_BADGES: Record<string, string> = {
  Pending: 'bg-amber-100 text-amber-800 border-amber-200',
  'Ready to Pack': 'bg-blue-100 text-blue-800 border-blue-200',
  Packed: 'bg-indigo-100 text-indigo-800 border-indigo-200',
  Dispatched: 'bg-purple-100 text-purple-800 border-purple-200',
  'In Transit': 'bg-cyan-100 text-cyan-800 border-cyan-200',
  Delivered: 'bg-emerald-100 text-emerald-800 border-emerald-200',
  Returned: 'bg-rose-100 text-rose-800 border-rose-200',
  Failed: 'bg-rose-100 text-rose-800 border-rose-200',
};

export default function AdminShippingPage() {
  const [shipments, setShipments] = useState<ShipmentRow[]>([]);
  const [couriers, setCouriers] = useState<any[]>([]);
  const [kpis, setKpis] = useState<any>({
    total: 0,
    pending: 0,
    ready_to_pack: 0,
    dispatched: 0,
    delivered: 0,
    returned: 0,
  });

  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  // Assign Courier Modal State
  const [courierModalOpen, setCourierModalOpen] = useState(false);
  const [selectedShipment, setSelectedShipment] = useState<ShipmentRow | null>(null);
  const [selectedCourierId, setSelectedCourierId] = useState('');
  const [trackingNumber, setTrackingNumber] = useState('');
  const [assigning, setAssigning] = useState(false);

  // Status Change Modal State
  const [statusModalOpen, setStatusModalOpen] = useState(false);
  const [newStatus, setNewStatus] = useState('');
  const [statusNotes, setStatusNotes] = useState('');
  const [updating, setUpdating] = useState(false);

  const loadShipments = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.append('search', search);
      if (statusFilter) params.append('status', statusFilter);

      const res = await adminFetch(`/admin/shipments?${params.toString()}`);
      const json = await res.json();
      if (json.success) {
        setShipments(json.data.data || []);
        if (json.kpis) setKpis(json.kpis);
      }
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  };

  const loadCouriers = async () => {
    try {
      const res = await adminFetch('/admin/couriers');
      const json = await res.json();
      if (json.success) setCouriers(json.data || []);
    } catch {
      // ignore
    }
  };

  useEffect(() => {
    loadShipments();
    loadCouriers();
  }, [statusFilter]);

  useEffect(() => {
    const t = setTimeout(loadShipments, 400);
    return () => clearTimeout(t);
  }, [search]);

  const handleAssignCourier = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedShipment || !selectedCourierId || !trackingNumber.trim()) return;

    setAssigning(true);
    try {
      const res = await adminFetch(`/admin/shipments/${selectedShipment.id}/assign-courier`, {
        method: 'POST',
        body: JSON.stringify({
          courier_id: selectedCourierId,
          tracking_number: trackingNumber.trim(),
        }),
      });
      const json = await res.json();
      if (json.success) {
        setCourierModalOpen(false);
        loadShipments();
      } else {
        alert(json.message || 'Failed to assign courier');
      }
    } catch {
      alert('Error updating courier assignment');
    } finally {
      setAssigning(false);
    }
  };

  const handleUpdateStatus = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedShipment || !newStatus) return;

    setUpdating(true);
    try {
      const res = await adminFetch(`/admin/shipments/${selectedShipment.id}/status`, {
        method: 'POST',
        body: JSON.stringify({ status: newStatus, notes: statusNotes }),
      });
      const json = await res.json();
      if (json.success) {
        setStatusModalOpen(false);
        loadShipments();
      } else {
        alert(json.message || 'Failed to update status');
      }
    } catch {
      alert('Error updating shipment status');
    } finally {
      setUpdating(false);
    }
  };

  return (
    <AdminLayout title="Shipments & Dispatch Logistics">
      <div className="space-y-6">
        {/* KPI Widget Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-6 gap-3">
          {[
            { label: 'All Shipments', val: kpis.total, color: 'text-slate-900', bg: 'bg-white' },
            { label: 'Pending', val: kpis.pending, color: 'text-amber-600', bg: 'bg-amber-50' },
            { label: 'Ready to Pack', val: kpis.ready_to_pack, color: 'text-blue-600', bg: 'bg-blue-50' },
            { label: 'Dispatched', val: kpis.dispatched, color: 'text-purple-600', bg: 'bg-purple-50' },
            { label: 'Delivered', val: kpis.delivered, color: 'text-emerald-600', bg: 'bg-emerald-50' },
            { label: 'Returned', val: kpis.returned, color: 'text-rose-600', bg: 'bg-rose-50' },
          ].map((k) => (
            <div key={k.label} className={`${k.bg} p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-1`}>
              <span className="text-[11px] font-bold text-slate-500 uppercase block">{k.label}</span>
              <div className={`text-2xl font-black ${k.color}`}>{k.val}</div>
            </div>
          ))}
        </div>

        {/* Filters & Search */}
        <div className="bg-white rounded-3xl p-4 border border-slate-200 shadow-2xs flex flex-wrap items-center justify-between gap-3">
          <div className="relative flex-1 min-w-[280px]">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by shipment #, order #, customer, or waybill..."
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-blue-600 focus:outline-hidden"
            />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto">
            {['', 'Pending', 'Ready to Pack', 'Dispatched', 'Delivered', 'Returned'].map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition cursor-pointer ${
                  statusFilter === st
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {st || 'All Statuses'}
              </button>
            ))}
          </div>
        </div>

        {/* Shipments Data Table */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-2xs overflow-hidden">
          {loading ? (
            <div className="py-20 text-center text-xs font-bold text-slate-500">
              <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2 text-blue-600" />
              Loading shipments...
            </div>
          ) : shipments.length === 0 ? (
            <div className="py-20 text-center space-y-2">
              <Truck className="w-10 h-10 text-slate-300 mx-auto" />
              <p className="text-xs font-bold text-slate-500">No shipments match your filter.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-extrabold text-[11px] uppercase tracking-wider">
                    <th className="py-3.5 px-4">Shipment #</th>
                    <th className="py-3.5 px-4">Order #</th>
                    <th className="py-3.5 px-4">Customer & Destination</th>
                    <th className="py-3.5 px-4">Courier & Waybill</th>
                    <th className="py-3.5 px-4">Delivery Fee</th>
                    <th className="py-3.5 px-4">Status</th>
                    <th className="py-3.5 px-4 text-right">Logistics Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                  {shipments.map((s) => (
                    <tr key={s.id} className="hover:bg-slate-50/80 transition">
                      <td className="py-4 px-4 font-black text-slate-900">
                        {s.shipment_number}
                      </td>
                      <td className="py-4 px-4 font-bold text-blue-600">
                        <Link href={`/admin/orders`} className="hover:underline">
                          {s.order?.order_number}
                        </Link>
                      </td>
                      <td className="py-4 px-4">
                        <div className="font-black text-slate-900">{s.order?.customer_name}</div>
                        <div className="text-[11px] text-slate-500">{s.order?.customer_phone}</div>
                        <div className="text-[11px] text-slate-600 font-bold">
                          {s.order?.city}, {s.order?.district}
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        {s.courier ? (
                          <div className="space-y-0.5">
                            <span className="font-black text-purple-900 bg-purple-100 px-2 py-0.5 rounded-md text-[10px]">
                              {s.courier.name}
                            </span>
                            <div className="font-mono text-[11px] text-slate-700 font-bold">
                              #{s.tracking_number || 'No Waybill'}
                            </div>
                          </div>
                        ) : (
                          <span className="text-slate-400 font-bold italic">Not assigned</span>
                        )}
                      </td>
                      <td className="py-4 px-4 font-black text-slate-900">
                        {Number(s.shipping_fee) === 0 ? (
                          <span className="text-emerald-600">FREE</span>
                        ) : (
                          `LKR ${Number(s.shipping_fee).toLocaleString()}`
                        )}
                      </td>
                      <td className="py-4 px-4">
                        <span
                          className={`text-[10px] font-black px-2.5 py-1 rounded-full border ${
                            STATUS_BADGES[s.status] || 'bg-slate-100 text-slate-700'
                          }`}
                        >
                          {s.status}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* Assign Courier Button */}
                          <button
                            onClick={() => {
                              setSelectedShipment(s);
                              setSelectedCourierId(s.courier?.id?.toString() || '');
                              setTrackingNumber(s.tracking_number || '');
                              setCourierModalOpen(true);
                            }}
                            className="bg-purple-50 hover:bg-purple-100 text-purple-700 font-bold px-2.5 py-1.5 rounded-xl border border-purple-200 text-[11px] transition cursor-pointer"
                            title="Assign Courier & Waybill"
                          >
                            Courier
                          </button>

                          {/* Update Status Button */}
                          <button
                            onClick={() => {
                              setSelectedShipment(s);
                              setNewStatus(s.status);
                              setStatusNotes('');
                              setStatusModalOpen(true);
                            }}
                            className="bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold px-2.5 py-1.5 rounded-xl border border-blue-200 text-[11px] transition cursor-pointer"
                          >
                            Status
                          </button>

                          {/* Packing Slip PDF */}
                          <a
                            href={getShippingNoteUrl(s.order_id)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1.5 rounded-xl text-slate-500 hover:text-blue-600 hover:bg-slate-100 transition"
                            title="Print Packing Slip"
                          >
                            <FileText className="w-4 h-4" />
                          </a>

                          {/* Shipping Box Label PDF */}
                          <a
                            href={getShippingLabelUrl(s.id)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1.5 rounded-xl text-slate-500 hover:text-purple-600 hover:bg-slate-100 transition"
                            title="Print Box Shipping Label"
                          >
                            <Printer className="w-4 h-4" />
                          </a>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Courier Assignment Modal */}
        {courierModalOpen && selectedShipment && (
          <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl border border-slate-200">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="text-base font-black text-slate-900">
                  Assign Courier Partner
                </h3>
                <button onClick={() => setCourierModalOpen(false)} className="text-slate-400 p-1">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="text-xs text-slate-600 space-y-1 bg-slate-50 p-3 rounded-2xl">
                <div>Shipment: <strong>{selectedShipment.shipment_number}</strong></div>
                <div>Recipient: <strong>{selectedShipment.order?.customer_name}</strong> ({selectedShipment.order?.city})</div>
              </div>

              <form onSubmit={handleAssignCourier} className="space-y-4 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Select Courier Company *</label>
                  <select
                    required
                    value={selectedCourierId}
                    onChange={(e) => setSelectedCourierId(e.target.value)}
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900"
                  >
                    <option value="">Select Courier</option>
                    {couriers.map((c) => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Tracking Number / Waybill ID *</label>
                  <input
                    type="text"
                    required
                    value={trackingNumber}
                    onChange={(e) => setTrackingNumber(e.target.value)}
                    placeholder="e.g. DX-8492048 or PR-2918"
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900"
                  />
                  <span className="text-[11px] text-slate-400 block mt-1">
                    Assigning courier automatically updates order to &quot;Shipped&quot; and notifies customer tracking.
                  </span>
                </div>

                <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setCourierModalOpen(false)}
                    className="px-4 py-2 font-bold text-slate-600 hover:bg-slate-100 rounded-xl"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={assigning}
                    className="bg-purple-600 hover:bg-purple-700 text-white font-bold px-5 py-2 rounded-xl flex items-center gap-1.5 shadow-sm"
                  >
                    {assigning && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                    <span>Confirm Dispatch</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Status Update Modal */}
        {statusModalOpen && selectedShipment && (
          <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl border border-slate-200">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="text-base font-black text-slate-900">
                  Update Shipment Status
                </h3>
                <button onClick={() => setStatusModalOpen(false)} className="text-slate-400 p-1">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleUpdateStatus} className="space-y-4 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">New Shipment Status *</label>
                  <select
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value)}
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900"
                  >
                    {['Pending', 'Ready to Pack', 'Packed', 'Dispatched', 'In Transit', 'Delivered', 'Returned', 'Failed'].map((st) => (
                      <option key={st} value={st}>{st}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Status Comment / Dispatch Notes</label>
                  <textarea
                    rows={3}
                    value={statusNotes}
                    onChange={(e) => setStatusNotes(e.target.value)}
                    placeholder="e.g. Package verified with shockproof casing and handed to courier branch."
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-900"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setStatusModalOpen(false)}
                    className="px-4 py-2 font-bold text-slate-600 hover:bg-slate-100 rounded-xl"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={updating}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-5 py-2 rounded-xl flex items-center gap-1.5 shadow-sm"
                  >
                    {updating && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                    <span>Save Status</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
