'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Package,
  Boxes,
  Tags,
  Laptop,
  Ruler,
  Cable,
  SlidersHorizontal,
  Warehouse,
  Building2,
  ClipboardPenLine,
  ArrowLeftRight,
  ShoppingCart,
  FileText,
  Users,
  MessageCircle,
  Truck,
  ClipboardList,
  Receipt,
  Image as ImageIcon,
  TicketPercent,
  Sparkles,
  ChartColumn,
  UserRound,
  ShieldCheck,
  Settings,
  Activity,
  ExternalLink,
  X,
} from 'lucide-react';
import { Logo } from '../Logo';

interface NavItem {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}

interface NavGroup {
  title: string;
  items: NavItem[];
}

const NAV_GROUPS: NavGroup[] = [
  {
    title: 'PRODUCTS',
    items: [
      { label: 'Products', href: '/admin/products', icon: Package },
      { label: 'Categories', href: '/admin/categories', icon: Boxes },
      { label: 'Brands', href: '/admin/brands', icon: Tags },
      { label: 'Models', href: '/admin/models', icon: Laptop },
      { label: 'Sizes', href: '/admin/sizes', icon: Ruler },
      { label: 'Panel Pins', href: '/admin/panel-pins', icon: Cable },
      { label: 'Attributes', href: '/admin/attributes', icon: SlidersHorizontal },
    ],
  },
  {
    title: 'INVENTORY',
    items: [
      { label: 'Stock Management', href: '/admin/inventory', icon: Warehouse },
      { label: 'Warehouses', href: '/admin/warehouses', icon: Building2 },
      { label: 'Stock Adjustments', href: '/admin/inventory/adjustments', icon: ClipboardPenLine },
      { label: 'Stock Transfers', href: '/admin/inventory/transfers', icon: ArrowLeftRight },
    ],
  },
  {
    title: 'SALES',
    items: [
      { label: 'Orders', href: '/admin/orders', icon: ShoppingCart },
      { label: 'Quotes', href: '/admin/quotes', icon: FileText },
      { label: 'Customers', href: '/admin/customers', icon: Users },
      { label: 'WhatsApp Orders', href: '/admin/whatsapp-orders', icon: MessageCircle },
    ],
  },
  {
    title: 'LOGISTICS',
    items: [
      { label: 'Shipments & Dispatch', href: '/admin/shipping', icon: Truck },
    ],
  },
  {
    title: 'PURCHASES',
    items: [
      { label: 'Suppliers', href: '/admin/suppliers', icon: Truck },
      { label: 'Purchase Orders', href: '/admin/purchase-orders', icon: ClipboardList },
      { label: 'Receipts', href: '/admin/purchase-receipts', icon: Receipt },
    ],
  },
  {
    title: 'MARKETING',
    items: [
      { label: 'Banners', href: '/admin/banners', icon: ImageIcon },
      { label: 'Coupons', href: '/admin/coupons', icon: TicketPercent },
      { label: 'Promotions', href: '/admin/promotions', icon: Sparkles },
    ],
  },
  {
    title: 'REPORTS',
    items: [
      { label: 'Sales Reports', href: '/admin/reports/sales', icon: ChartColumn },
      { label: 'Order Reports', href: '/admin/reports/orders', icon: ChartColumn },
      { label: 'Product Reports', href: '/admin/reports/products', icon: ChartColumn },
      { label: 'Inventory Reports', href: '/admin/reports/inventory', icon: ChartColumn },
      { label: 'Customer Reports', href: '/admin/reports/customers', icon: ChartColumn },
      { label: 'Purchase Reports', href: '/admin/reports/purchases', icon: ChartColumn },
      { label: 'Profit Reports', href: '/admin/reports/profit', icon: ChartColumn },
    ],
  },
  {
    title: 'SYSTEM',
    items: [
      { label: 'Users', href: '/admin/users', icon: UserRound },
      { label: 'Roles & Permissions', href: '/admin/roles', icon: ShieldCheck },
      { label: 'Settings', href: '/admin/settings', icon: Settings },
      { label: 'Activity Logs', href: '/admin/activity-logs', icon: Activity },
    ],
  },
];

interface AdminSidebarProps {
  mobileOpen?: boolean;
  onCloseMobile?: () => void;
}

export function AdminSidebar({ mobileOpen, onCloseMobile }: AdminSidebarProps) {
  const pathname = usePathname();

  const content = (
    <div className="w-[264px] bg-white border-r border-slate-200/80 h-full flex flex-col shrink-0">
      {/* Logo */}
      <div className="h-16 px-5 border-b border-slate-200/80 flex items-center justify-between">
        <Logo markClassName="w-8 h-8" nameClassName="text-base" taglineClassName="text-[6.5px]" />
        <button
          onClick={onCloseMobile}
          className="lg:hidden p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors"
          aria-label="Close sidebar"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 py-3 space-y-4 text-xs font-sans">
        <Link
          href="/admin"
          onClick={onCloseMobile}
          className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs sm:text-[13px] font-semibold transition-all ${
            pathname === '/admin'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'text-slate-700 hover:bg-slate-100/80 hover:text-slate-900'
          }`}
        >
          <LayoutDashboard className="w-[17px] h-[17px] shrink-0" />
          <span>Dashboard</span>
        </Link>

        {NAV_GROUPS.map((group) => (
          <div key={group.title} className="space-y-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block px-3 pt-1">
              {group.title}
            </span>
            <ul className="space-y-0.5">
              {group.items.map((item) => {
                const isActive = pathname === item.href;
                const Icon = item.icon;
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      onClick={onCloseMobile}
                      className={`flex items-center gap-2.5 px-3 py-1.5 rounded-lg text-xs sm:text-[13px] font-medium transition-all ${
                        isActive
                          ? 'bg-blue-600 text-white font-semibold shadow-xs'
                          : 'text-slate-600 hover:bg-slate-100/80 hover:text-slate-900'
                      }`}
                    >
                      <Icon className="w-[15px] h-[15px] shrink-0" />
                      <span>{item.label}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      {/* Footer */}
      <div className="p-3.5 border-t border-slate-200/80 space-y-2 bg-slate-50/50">
        <a
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-2 px-3 rounded-lg text-xs flex items-center justify-center gap-1.5 shadow-xs transition-colors"
        >
          <span>View Public Store</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
        <p className="text-center text-[10px] text-slate-400 font-medium">
          &copy; 2026 Panelook.lk &bull; Admin v2.0
        </p>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:block h-screen sticky top-0">{content}</aside>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="fixed inset-0 bg-slate-900/60" onClick={onCloseMobile} />
          <div className="fixed inset-y-0 left-0 shadow-2xl">{content}</div>
        </div>
      )}
    </>
  );
}
