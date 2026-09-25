/**
 * Centralized API & System Configuration for Panelook.lk
 * Single source of truth for API routes, image helpers, and store details.
 */

export const API_BASE_URL: string =
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/+$/, '') || 'https://admin.panelook.lk/api';

export const ADMIN_API_URL: string =
  process.env.NEXT_PUBLIC_ADMIN_API_URL?.replace(/\/+$/, '') ||
  (process.env.NEXT_PUBLIC_API_URL
    ? (process.env.NEXT_PUBLIC_API_URL.endsWith('/api')
        ? `${process.env.NEXT_PUBLIC_API_URL.replace(/\/+$/, '')}/admin`
        : `${process.env.NEXT_PUBLIC_API_URL.replace(/\/+$/, '')}/api/admin`)
    : 'https://admin.panelook.lk/api/admin');

export const STORE_CONFIG = {
  name: 'Panelook.lk',
  tagline: "Sri Lanka's Trusted Laptop Display Partner",
  phone: '+94 77 123 4567',
  whatsapp: '94766025870',
  whatsappDisplay: '076 602 5870',
  email: 'info@panelook.lk',
  address: 'Colombo, Sri Lanka',
  currency: 'LKR',
  warrantyStandard: '6 Months Warranty',
} as const;

export function getApiUrl(path: string): string {
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${API_BASE_URL}${cleanPath}`;
}

export function getAdminApiUrl(path: string): string {
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  const base = ADMIN_API_URL.replace(/\/+$/, '');

  // Prevent double '/admin/admin' if base already ends with /admin and path starts with /admin
  if (base.endsWith('/admin') && cleanPath.startsWith('/admin')) {
    return `${base}${cleanPath.substring(6)}`;
  }
  return `${base}${cleanPath}`;
}

export function getInvoiceUrl(orderId: number | string): string {
  return getApiUrl(`/orders/${orderId}/invoice`);
}

export function getShippingNoteUrl(orderId: number | string): string {
  return getApiUrl(`/orders/${orderId}/shipping-note`);
}

export function getShippingLabelUrl(orderId: number | string): string {
  return getAdminApiUrl(`/shipments/${orderId}/label`);
}
