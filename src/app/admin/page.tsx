'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { adminFetch } from '@/lib/adminApi';
import {
  ShoppingCart,
  CircleDollarSign,
  Package,
  Layers,
  UsersRound,
  TrendingUp,
  TrendingDown,
  ChevronDown,
  ArrowUpRight,
  ArrowDownRight,
  Minus,
} from 'lucide-react';

interface DashboardData {
  total_sales: number;
  today_sales: number;
  total_orders: number;
  pending_orders: number;
  total_products: number;
  low_stock_count: number;
  out_of_stock_count: number;
  total_customers: number;
  recent_orders: {
    id: number;
    order_number: string;
    customer_name: string;
    grand_total: number;
    order_status: string;
    created_at: string;
  }[];
}

const STATUS_BADGE: Record<string, string> = {
  Pending: 'bg-amber-50 text-amber-700 border border-amber-200',
  Processing: 'bg-blue-50 text-blue-700 border border-blue-200',
  Packed: 'bg-indigo-50 text-indigo-700 border border-indigo-200',
  Shipped: 'bg-purple-50 text-purple-700 border border-purple-200',
  Delivered: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
  Cancelled: 'bg-rose-50 text-rose-700 border border-rose-200',
  Returned: 'bg-slate-100 text-slate-700 border border-slate-200',
};

const TOP_PRODUCTS = [
  {
    image: '/images/promo-card-1.jpeg',
    name: 'B156XW04 V.8',
    specs: '15.6" FHD 30-pin',
    sold: 342,
    revenue: 1539000,
  },
  {
    image: '/images/promo-card-2.jpeg',
    name: 'N156HCE-GN1',
    specs: '15.6" FHD 30-pin',
    sold: 298,
    revenue: 1192000,
  },
  {
    image: '/images/promo-card-3.jpeg',
    name: 'LP156WF9-SPK1',
    specs: '15.6" FHD 30-pin',
    sold: 267,
    revenue: 1069000,
  },
  {
    image: '/images/promo-center.jpeg',
    name: 'B140XTN03.1',
    specs: '14.0" HD 40-pin',
    sold: 198,
    revenue: 693000,
  },
  {
    image: '/images/banner-sizes-range.jpeg',
    name: 'LTN156HL02',
    specs: '15.6" HD 40-pin',
    sold: 176,
    revenue: 598000,
  },
];

const TOP_BRANDS = [
  { name: 'LG Display', symbol: 'LG', products: 542, sales: 'LKR 2,156,000', color: 'bg-rose-600 text-white' },
  { name: 'BOE', symbol: 'BOE', products: 489, sales: 'LKR 1,876,000', color: 'bg-blue-600 text-white font-serif' },
  { name: 'Innolux', symbol: 'INL', products: 412, sales: 'LKR 1,654,000', color: 'bg-sky-600 text-white font-sans' },
  { name: 'AUO', symbol: 'AUO', products: 398, sales: 'LKR 1,432,000', color: 'bg-indigo-700 text-white font-black' },
  { name: 'Samsung', symbol: 'SAM', products: 287, sales: 'LKR 1,038,000', color: 'bg-blue-900 text-white font-semibold' },
];

export default function AdminDashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [timeRange, setTimeRange] = useState('This Month');

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await adminFetch('/admin/dashboard');
        const json = await res.json();
        if (!cancelled) {
          if (json.success) {
            setData(json.data);
          } else {
            setError('Could not load dashboard data.');
          }
          setLoading(false);
        }
      } catch (e) {
        if (!cancelled) {
          setError('Backend API is unreachable. Showing fallback state.');
          setLoading(false);
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  // Calculate stocks
  const totalProducts = data?.total_products || 2458;
  const lowStock = data?.low_stock_count ?? 86;
  const outOfStock = data?.out_of_stock_count ?? 62;
  const inStock = Math.max(0, totalProducts - lowStock - outOfStock);

  const inStockPct = Math.round((inStock / totalProducts) * 100);
  const lowStockPct = Math.round((lowStock / totalProducts) * 100);
  const outOfStockPct = Math.max(1, 100 - inStockPct - lowStockPct);

  // Fallback orders if none in DB
  const recentOrders =
    data && data.recent_orders && data.recent_orders.length > 0
      ? data.recent_orders
      : [
          {
            id: 1,
            order_number: 'ORD-001245',
            customer_name: 'Nimal Perera',
            grand_total: 45500,
            order_status: 'Pending',
            created_at: '2024-05-23',
          },
          {
            id: 2,
            order_number: 'ORD-001244',
            customer_name: 'Tech Solutions',
            grand_total: 120000,
            order_status: 'Processing',
            created_at: '2024-05-23',
          },
          {
            id: 3,
            order_number: 'ORD-001243',
            customer_name: 'Gayan Weerasinghe',
            grand_total: 78250,
            order_status: 'Shipped',
            created_at: '2024-05-22',
          },
          {
            id: 4,
            order_number: 'ORD-001242',
            customer_name: 'Lakmal Holdings',
            grand_total: 68000,
            order_status: 'Delivered',
            created_at: '2024-05-22',
          },
          {
            id: 5,
            order_number: 'ORD-001241',
            customer_name: 'Chamara Fernando',
            grand_total: 35750,
            order_status: 'Pending',
            created_at: '2024-05-21',
          },
        ];

  return (
    <AdminLayout title="Dashboard">
      {error && (
        <div className="mb-4 bg-amber-50 border border-amber-200 text-amber-800 text-xs font-semibold px-4 py-3 rounded-xl">
          {error}
        </div>
      )}

      {/* 5 KPI Cards Row */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3.5 sm:gap-4 mb-6">
        
        {/* Card 1: Total Orders */}
        <div className="bg-white p-4 sm:p-5 rounded-xl border border-slate-200/80 shadow-xs space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Total Orders</span>
            <div className="w-9 h-9 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <ShoppingCart className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-[26px] font-black text-slate-900 tracking-tight leading-none">
            {loading ? '—' : (data?.total_orders || 1246).toLocaleString()}
          </div>
          <div className="flex items-center gap-1 text-[11px] font-bold text-emerald-600">
            <ArrowUpRight className="w-3.5 h-3.5 shrink-0" />
            <span>18.6%</span>
            <span className="text-slate-400 font-medium">from last month</span>
          </div>
        </div>

        {/* Card 2: Total Sales */}
        <div className="bg-white p-4 sm:p-5 rounded-xl border border-slate-200/80 shadow-xs space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Total Sales</span>
            <div className="w-9 h-9 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <CircleDollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-[26px] font-black text-slate-900 tracking-tight leading-none">
            {loading ? '—' : `LKR ${(data?.total_sales || 8456750).toLocaleString()}`}
          </div>
          <div className="flex items-center gap-1 text-[11px] font-bold text-emerald-600">
            <ArrowUpRight className="w-3.5 h-3.5 shrink-0" />
            <span>22.8%</span>
            <span className="text-slate-400 font-medium">from last month</span>
          </div>
        </div>

        {/* Card 3: Total Products */}
        <div className="bg-white p-4 sm:p-5 rounded-xl border border-slate-200/80 shadow-xs space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Total Products</span>
            <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Package className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-[26px] font-black text-slate-900 tracking-tight leading-none">
            {loading ? '—' : (data?.total_products || 2458).toLocaleString()}
          </div>
          <div className="flex items-center gap-1 text-[11px] font-bold text-slate-500">
            <Minus className="w-3.5 h-3.5 shrink-0 text-slate-400" />
            <span>0.0%</span>
            <span className="text-slate-400 font-medium">from last month</span>
          </div>
        </div>

        {/* Card 4: Low Stock Items */}
        <div className="bg-white p-4 sm:p-5 rounded-xl border border-slate-200/80 shadow-xs space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Low Stock Items</span>
            <div className="w-9 h-9 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
              <Layers className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-[26px] font-black text-slate-900 tracking-tight leading-none">
            {loading ? '—' : (data?.low_stock_count || 86).toLocaleString()}
          </div>
          <div className="flex items-center gap-1 text-[11px] font-bold text-rose-600">
            <ArrowDownRight className="w-3.5 h-3.5 shrink-0" />
            <span>8.1%</span>
            <span className="text-slate-400 font-medium">from last month</span>
          </div>
        </div>

        {/* Card 5: Total Customers */}
        <div className="bg-white p-4 sm:p-5 rounded-xl border border-slate-200/80 shadow-xs space-y-2.5 col-span-2 md:col-span-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Total Customers</span>
            <div className="w-9 h-9 rounded-lg bg-pink-50 text-pink-600 flex items-center justify-center">
              <UsersRound className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-[26px] font-black text-slate-900 tracking-tight leading-none">
            {loading ? '—' : (data?.total_customers || 3682).toLocaleString()}
          </div>
          <div className="flex items-center gap-1 text-[11px] font-bold text-emerald-600">
            <ArrowUpRight className="w-3.5 h-3.5 shrink-0" />
            <span>14.5%</span>
            <span className="text-slate-400 font-medium">from last month</span>
          </div>
        </div>

      </div>

      {/* Middle Row: Sales Overview & Recent Orders */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6 mb-6">
        
        {/* Sales Overview (7 Columns) */}
        <div className="lg:col-span-7 bg-white p-4 sm:p-5 rounded-xl border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h2 className="text-sm sm:text-base font-bold text-slate-900 tracking-tight">Sales Overview</h2>
              <p className="text-[11px] text-slate-400 font-medium">Revenue and volume trends over time</p>
            </div>
            <div className="relative">
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                className="bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-800 rounded-lg px-2.5 py-1.5 focus:outline-hidden focus:border-blue-600 cursor-pointer"
              >
                <option value="This Month">This Month</option>
                <option value="This Week">This Week</option>
                <option value="Last Month">Last Month</option>
              </select>
            </div>
          </div>

          {/* Legend */}
          <div className="flex items-center gap-5 text-xs font-bold pt-0.5">
            <div className="flex items-center gap-2 text-slate-800">
              <span className="w-3.5 h-1 bg-blue-600 rounded-full inline-block" />
              <span>Sales (LKR)</span>
            </div>
            <div className="flex items-center gap-2 text-slate-500">
              <span className="w-3.5 h-0.5 border-t-2 border-dashed border-slate-400 inline-block" />
              <span>Orders</span>
            </div>
          </div>

          {/* SVG Line Chart */}
          <div className="relative h-60 w-full pt-2">
            {/* Left Y-axis labels */}
            <div className="absolute left-0 top-2 bottom-7 flex flex-col justify-between text-[10px] font-bold text-slate-400">
              <span>2.0M</span>
              <span>1.6M</span>
              <span>1.2M</span>
              <span>800K</span>
              <span>400K</span>
              <span>0</span>
            </div>

            {/* Right Y-axis labels */}
            <div className="absolute right-0 top-2 bottom-7 flex flex-col justify-between text-[10px] font-bold text-slate-400">
              <span>250</span>
              <span>200</span>
              <span>150</span>
              <span>100</span>
              <span>50</span>
              <span>0</span>
            </div>

            {/* SVG Plot */}
            <div className="ml-10 mr-8 h-full pb-7">
              <svg className="w-full h-full overflow-visible" viewBox="0 0 500 180" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="blueGlow" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#2563eb" stopOpacity="0.15" />
                    <stop offset="100%" stopColor="#2563eb" stopOpacity="0.0" />
                  </linearGradient>
                </defs>

                {/* Horizontal Grid lines */}
                {[0, 36, 72, 108, 144, 180].map((y) => (
                  <line key={y} x1="0" y1={y} x2="500" y2={y} stroke="#f1f5f9" strokeWidth="1" />
                ))}

                {/* Shaded Area under Sales */}
                <path
                  d="M 0 140 Q 60 110, 120 120 T 250 70 T 380 90 T 440 25 T 500 80 L 500 180 L 0 180 Z"
                  fill="url(#blueGlow)"
                />

                {/* Orders curve (dashed slate) */}
                <path
                  d="M 0 160 Q 60 140, 120 150 T 250 110 T 380 130 T 440 70 T 500 120"
                  fill="none"
                  stroke="#94a3b8"
                  strokeDasharray="4 4"
                  strokeWidth="2"
                />

                {/* Sales curve (solid blue) */}
                <path
                  d="M 0 140 Q 60 110, 120 120 T 250 70 T 380 90 T 440 25 T 500 80"
                  fill="none"
                  stroke="#2563eb"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
              </svg>
            </div>

            {/* X-axis labels */}
            <div className="absolute bottom-0 left-10 right-8 flex justify-between text-[10px] font-bold text-slate-400">
              <span>01 May</span>
              <span>05 May</span>
              <span>09 May</span>
              <span>13 May</span>
              <span>17 May</span>
              <span>21 May</span>
              <span>25 May</span>
              <span>31 May</span>
            </div>
          </div>
        </div>

        {/* Recent Orders (5 Columns) */}
        <div className="lg:col-span-5 bg-white p-4 sm:p-5 rounded-xl border border-slate-200/80 shadow-xs space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h2 className="text-sm sm:text-base font-bold text-slate-900 tracking-tight">Recent Orders</h2>
              <p className="text-[11px] text-slate-400 font-medium">Latest customer transactions</p>
            </div>
            <Link href="/admin/orders" className="text-xs font-bold text-blue-600 hover:text-blue-700">
              View All &rarr;
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-slate-100 text-[10.5px] font-bold text-slate-400 uppercase tracking-wider">
                  <th className="pb-2">Order ID</th>
                  <th className="pb-2">Customer</th>
                  <th className="pb-2">Amount</th>
                  <th className="pb-2">Status</th>
                  <th className="pb-2 text-right">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs font-medium text-slate-800">
                {recentOrders.slice(0, 5).map((ord) => (
                  <tr key={ord.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-2.5 font-bold text-blue-600">
                      <Link href={`/admin/orders/${ord.id}`} className="hover:underline">#{ord.order_number}</Link>
                    </td>
                    <td className="py-2.5 font-semibold text-slate-900 truncate max-w-[110px]">
                      {ord.customer_name}
                    </td>
                    <td className="py-2.5 font-black text-slate-900">
                      LKR {ord.grand_total.toLocaleString()}
                    </td>
                    <td className="py-2.5">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-[4px] ${STATUS_BADGE[ord.order_status] || 'bg-slate-100 text-slate-700'}`}>
                        {ord.order_status}
                      </span>
                    </td>
                    <td className="py-2.5 text-right text-[11px] text-slate-400 font-medium">
                      {ord.created_at.slice(0, 10)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>

      {/* Lower Dashboard (3 Columns): Top Products, Stock Status, Top Brands */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6">
        
        {/* Top Selling Products (5 Columns) */}
        <div className="lg:col-span-5 bg-white p-4 sm:p-5 rounded-xl border border-slate-200/80 shadow-xs space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h2 className="text-sm sm:text-base font-bold text-slate-900 tracking-tight">Top Selling Products</h2>
              <p className="text-[11px] text-slate-400 font-medium">Best performers this month</p>
            </div>
            <Link href="/admin/products" className="text-xs font-bold text-blue-600 hover:text-blue-700">
              View All &rarr;
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-slate-100 text-[10.5px] font-bold text-slate-400 uppercase tracking-wider">
                  <th className="pb-2">Product</th>
                  <th className="pb-2 text-center">Sold</th>
                  <th className="pb-2 text-right">Revenue</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {TOP_PRODUCTS.map((prod, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-2.5 flex items-center gap-2.5">
                      <img
                        src={prod.image}
                        alt=""
                        className="w-9 h-9 rounded-lg border border-slate-200 object-contain p-0.5 bg-slate-50 shrink-0"
                      />
                      <div className="min-w-0">
                        <span className="font-bold text-slate-900 block truncate leading-tight">
                          {prod.name}
                        </span>
                        <span className="text-[10px] text-slate-500 block truncate">
                          {prod.specs}
                        </span>
                      </div>
                    </td>
                    <td className="py-2.5 text-center font-bold text-slate-700">
                      {prod.sold}
                    </td>
                    <td className="py-2.5 text-right font-black text-slate-900">
                      LKR {prod.revenue.toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Stock Status Donut Chart (3 Columns) */}
        <div className="lg:col-span-3 bg-white p-4 sm:p-5 rounded-xl border border-slate-200/80 shadow-xs space-y-3">
          <div className="border-b border-slate-100 pb-3">
            <h2 className="text-sm sm:text-base font-bold text-slate-900 tracking-tight">Stock Status</h2>
            <p className="text-[11px] text-slate-400 font-medium">Current warehouse health</p>
          </div>

          <div className="flex flex-col items-center justify-center py-2 space-y-4">
            <div className="relative w-36 h-36 flex items-center justify-center">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                <circle cx="18" cy="18" r="15.9155" fill="none" stroke="#f1f5f9" strokeWidth="4" />
                {/* In Stock (Emerald) */}
                <circle
                  cx="18"
                  cy="18"
                  r="15.9155"
                  fill="none"
                  stroke="#16a34a"
                  strokeWidth="4"
                  strokeDasharray={`${inStockPct} 100`}
                  strokeLinecap="round"
                />
                {/* Low Stock (Amber) */}
                <circle
                  cx="18"
                  cy="18"
                  r="15.9155"
                  fill="none"
                  stroke="#f59e0b"
                  strokeWidth="4"
                  strokeDasharray={`${lowStockPct} 100`}
                  strokeDashoffset={`-${inStockPct}`}
                  strokeLinecap="round"
                />
                {/* Out of Stock (Rose) */}
                <circle
                  cx="18"
                  cy="18"
                  r="15.9155"
                  fill="none"
                  stroke="#ef4444"
                  strokeWidth="4"
                  strokeDasharray={`${outOfStockPct} 100`}
                  strokeDashoffset={`-${inStockPct + lowStockPct}`}
                  strokeLinecap="round"
                />
              </svg>
            </div>

            <div className="space-y-1.5 text-xs font-semibold text-slate-700 w-full pt-1">
              <div className="flex justify-between items-center">
                <span className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-600" />
                  <span>In Stock</span>
                </span>
                <span className="font-bold text-slate-900">{inStock.toLocaleString()} ({inStockPct}%)</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                  <span>Low Stock</span>
                </span>
                <span className="font-bold text-slate-900">{lowStock} ({lowStockPct}%)</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                  <span>Out of Stock</span>
                </span>
                <span className="font-bold text-slate-900">{outOfStock} ({outOfStockPct}%)</span>
              </div>
            </div>

            <div className="pt-2 text-center border-t border-slate-100 w-full">
              <span className="text-[11px] text-slate-400 font-semibold">Total Panels in DB: </span>
              <span className="text-xs font-black text-slate-900">{totalProducts.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Top Brands (4 Columns) */}
        <div className="lg:col-span-4 bg-white p-4 sm:p-5 rounded-xl border border-slate-200/80 shadow-xs space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h2 className="text-sm sm:text-base font-bold text-slate-900 tracking-tight">Top Brands</h2>
              <p className="text-[11px] text-slate-400 font-medium">By sales revenue volume</p>
            </div>
            <Link href="/admin/brands" className="text-xs font-bold text-blue-600 hover:text-blue-700">
              View All &rarr;
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-slate-100 text-[10.5px] font-bold text-slate-400 uppercase tracking-wider">
                  <th className="pb-2">Brand</th>
                  <th className="pb-2 text-center">Products</th>
                  <th className="pb-2 text-right">Sales</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs font-semibold">
                {TOP_BRANDS.map((brand, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-2.5 flex items-center gap-2.5">
                      <span className={`w-7 h-7 rounded-lg ${brand.color} flex items-center justify-center text-[10px] font-black shrink-0`}>
                        {brand.symbol}
                      </span>
                      <span className="font-bold text-slate-900">{brand.name}</span>
                    </td>
                    <td className="py-2.5 text-center text-slate-500 font-bold">
                      {brand.products}
                    </td>
                    <td className="py-2.5 text-right font-black text-slate-900">
                      {brand.sales}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>

      {/* Admin Footer */}
      <footer className="mt-8 pt-4 pb-2 border-t border-slate-200/80 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 font-medium gap-2">
        <div>&copy; 2026 Panelook.lk. All rights reserved.</div>
        <div className="flex items-center gap-1.5 text-slate-500">
          <span>Proudly engineered in Sri Lanka</span>
          <span>🇱🇰</span>
        </div>
      </footer>
    </AdminLayout>
  );
}
