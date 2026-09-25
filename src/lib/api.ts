import { Product, Category, Brand, Order, FilterState, Banner } from '@/types';
import { API_BASE_URL } from './config';

// Realistic Fallback Data matching Seeders & Reference UI Images
export const MOCK_PRODUCTS: Product[] = [
  {
    id: 1,
    name: 'B156XW04 V.8',
    slug: 'b156xw04-v8',
    sku: 'DSP-B156XW04-V8',
    main_image: '/images/products/panel-b156xw04.png',
    status: 'active',
    is_featured: true,
    selling_price: 15500,
    original_price: 18500,
    rating: 4.8,
    reviews: 56,
    stock_quantity: 12,
    panel_number: 'B156XW04 V.8',
    laptop_model: 'HP Pavilion 15 / Dell Inspiron 15',
    display_size: '15.6"',
    pin_type: '30-pin',
    display_type: 'TN',
    touch_type: 'Non-Touch',
    resolution: '1366x768',
    warranty: '3-12 Months Warranty',
  },
  {
    id: 2,
    name: 'N156HCE-GN1',
    slug: 'n156hce-gn1',
    sku: 'DSP-N156HCE-GN1',
    main_image: '/images/products/panel-n156hce.png',
    status: 'active',
    is_featured: true,
    selling_price: 28500,
    rating: 4.7,
    reviews: 38,
    stock_quantity: 8,
    panel_number: 'N156HCE-GN1',
    laptop_model: 'Lenovo Ideapad 330 / ThinkPad E580',
    display_size: '15.6"',
    pin_type: '30-pin',
    display_type: 'IPS',
    touch_type: 'Non-Touch',
    resolution: '1920x1080',
    warranty: '3-12 Months Warranty',
  },
  {
    id: 3,
    name: 'LP156WF9-SPK1',
    slug: 'lp156wf9-spk1',
    sku: 'DSP-LP156WF9-SPK1',
    main_image: '/images/products/panel-lp156wf9.png',
    status: 'active',
    is_featured: true,
    is_new: true,
    selling_price: 35000,
    rating: 4.8,
    reviews: 29,
    stock_quantity: 5,
    panel_number: 'LP156WF9-SPK1',
    laptop_model: 'ASUS ZenBook 15 / HP Envy x360',
    display_size: '15.6"',
    pin_type: '30-pin',
    display_type: 'IPS',
    touch_type: 'Touch',
    resolution: '1920x1080',
    warranty: '3-12 Months Warranty',
  },
  {
    id: 4,
    name: 'LM156LFGL01',
    slug: 'lm156lfgl01',
    sku: 'DSP-LM156LFGL01',
    main_image: '/images/products/panel-lm156lfgl01.png',
    status: 'active',
    is_featured: false,
    selling_price: 32000,
    rating: 4.7,
    reviews: 41,
    stock_quantity: 2, // Low stock
    panel_number: 'LM156LFGL01',
    laptop_model: 'MSI GF63 Thin / Acer Nitro 5',
    display_size: '15.6"',
    pin_type: '40-pin',
    display_type: 'IPS',
    touch_type: 'Non-Touch',
    resolution: '1920x1080',
    warranty: '3-12 Months Warranty',
  },
  {
    id: 5,
    name: 'B173HAN04.0',
    slug: 'b173han04-0',
    sku: 'DSP-B173HAN04-0',
    main_image: '/images/products/panel-b173han04.png',
    status: 'active',
    is_featured: true,
    is_new: true,
    selling_price: 38500,
    rating: 4.6,
    reviews: 22,
    stock_quantity: 10,
    panel_number: 'B173HAN04.0',
    laptop_model: 'Dell G7 17 / HP Omen 17',
    display_size: '17.3"',
    pin_type: '40-pin',
    display_type: 'IPS',
    touch_type: 'Non-Touch',
    resolution: '1920x1080',
    warranty: '3-12 Months Warranty',
  },
  {
    id: 6,
    name: 'NV140FHM-N48',
    slug: 'nv140fhm-n48',
    sku: 'DSP-NV140FHM-N48',
    main_image: '/images/products/panel-nv140fhm.png',
    status: 'active',
    is_featured: true,
    selling_price: 24900,
    original_price: 29500,
    rating: 4.8,
    reviews: 33,
    stock_quantity: 15,
    panel_number: 'NV140FHM-N48',
    laptop_model: 'HP EliteBook 840 G5 / Dell Latitude 7490',
    display_size: '14"',
    pin_type: '30-pin',
    display_type: 'IPS',
    touch_type: 'Non-Touch',
    resolution: '1920x1080',
    warranty: '3-12 Months Warranty',
  }
];

export async function fetchProducts(filters?: Partial<FilterState>): Promise<{ data: Product[]; total: number }> {
  try {
    const params = new URLSearchParams();
    if (filters?.search) params.append('search', filters.search);
    if (filters?.brand) params.append('brand', filters.brand);
    if (filters?.screen_size) params.append('screen_size', filters.screen_size);
    else if (filters?.size) params.append('size', filters.size);
    if (filters?.pin) params.append('pin', filters.pin);
    if (filters?.touch) params.append('touch', filters.touch);
    if (filters?.ips) params.append('ips', '1');
    if (filters?.display_type) params.append('display_type', filters.display_type);
    if (filters?.category) params.append('category', filters.category);
    if (filters?.product_type) params.append('product_type', filters.product_type);
    if (filters?.sort) params.append('sort', filters.sort);
    if (filters?.minPrice) params.append('min_price', filters.minPrice.toString());
    if (filters?.maxPrice) params.append('max_price', filters.maxPrice.toString());

    const res = await fetch(`${API_BASE_URL}/products?${params.toString()}`, { cache: 'no-store' });
    if (res.ok) {
      const json = await res.json();
      if (json.success) {
        return { data: json.data || [], total: json.meta?.total !== undefined ? json.meta.total : (json.data?.length || 0) };
      }
    }
  } catch (e) {
    console.warn('API fetch error, using fallback products dataset', e);
  }

  // Client-side filtering fallback
  let items = [...MOCK_PRODUCTS];
  if (filters?.search) {
    const s = filters.search.toLowerCase();
    items = items.filter(i => i.name.toLowerCase().includes(s) || i.panel_number.toLowerCase().includes(s) || i.laptop_model.toLowerCase().includes(s));
  }
  if (filters?.brand) {
    items = items.filter(i => i.laptop_model.toLowerCase().includes(filters.brand!.toLowerCase()));
  }
  if (filters?.screen_size || filters?.size) {
    const sz = filters?.screen_size || filters?.size;
    items = items.filter(i => i.display_size?.includes(sz!));
  }
  if (filters?.pin) {
    items = items.filter(i => i.pin_type === filters.pin);
  }
  if (filters?.touch) {
    items = items.filter(i => i.touch_type === filters.touch);
  }
  if (filters?.ips) {
    items = items.filter(i => i.display_type === 'IPS');
  }

  return { data: items, total: items.length };
}

export async function fetchProductBySlug(slug: string): Promise<Product | null> {
  try {
    const res = await fetch(`${API_BASE_URL}/products/${slug}`);
    if (res.ok) {
      const json = await res.json();
      if (json.success) return json.data;
    }
  } catch (e) {
    console.warn('API offline, finding product locally', e);
  }
  return MOCK_PRODUCTS.find(p => p.slug === slug) || null;
}

export async function placeOrderApi(orderData: any): Promise<{ success: boolean; order?: Order; whatsapp_url?: string; message?: string }> {
  try {
    const res = await fetch(`${API_BASE_URL}/checkout`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(orderData),
    });
    const json = await res.json();
    return json;
  } catch (e) {
    // Generate fallback order response if API server isn't running live
    const orderNumber = `ORD-${Date.now().toString().slice(-8)}`;
    const total = orderData.items.reduce((acc: number, item: any) => acc + (item.unit_price * item.quantity), 0) + 650;
    const waMessage = `Hello Panelook.lk,\n\nI would like to order *#${orderNumber}*:\nCustomer: ${orderData.customer_name}\nMobile: ${orderData.customer_phone}\nTotal: LKR ${total.toLocaleString()}`;
    const waUrl = `https://wa.me/94766025870?text=${encodeURIComponent(waMessage)}`;

    return {
      success: true,
      order: {
        id: Math.floor(Math.random() * 10000),
        order_number: orderNumber,
        customer_name: orderData.customer_name,
        customer_email: orderData.customer_email,
        customer_phone: orderData.customer_phone,
        shipping_address: orderData.shipping_address,
        city: orderData.city,
        district: orderData.district,
        payment_method: orderData.payment_method,
        payment_status: 'Pending',
        shipping_status: 'Pending',
        order_status: 'Pending',
        subtotal: total - 650,
        shipping_cost: 650,
        discount: 0,
        grand_total: total,
        created_at: new Date().toISOString(),
        items: orderData.items,
      },
      whatsapp_url: waUrl,
    };
  }
}

export const DEFAULT_BANNERS: Banner[] = [
  {
    id: 1,
    title: 'Fast Islandwide Delivery Across Sri Lanka',
    subtitle: '06 Month Warranty - Safe Packing Before Shipping',
    desktop_image: '/images/Banner slider 01.jpeg',
    mobile_image: '/images/Banner slider 01.jpeg',
    button_text: 'Order Now',
    button_url: '/shop',
    sort_order: 1,
    status: true,
  },
  {
    id: 2,
    title: 'Laptop Displays 10.1" - 18.0" Wide Size Range',
    subtitle: 'Find the right display for your laptop - HP, Dell, Lenovo, Asus, Acer, MSI',
    desktop_image: '/images/Banner slider 02.jpeg',
    mobile_image: '/images/Banner slider 02.jpeg',
    button_text: 'Shop Displays',
    button_url: '/shop',
    sort_order: 2,
    status: true,
  },
  {
    id: 3,
    title: 'Special Assembly Touch Displays',
    subtitle: 'Complete touch digitizer assemblies & premium replacement panels',
    desktop_image: '/images/home banner 03.jpeg',
    mobile_image: '/images/home banner 03.jpeg',
    button_text: 'Explore Touch Displays',
    button_url: '/shop?touch=Touch',
    sort_order: 3,
    status: true,
  },
];

export async function fetchBanners(): Promise<Banner[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/banners`, { cache: 'no-store' });
    if (res.ok) {
      const json = await res.json();
      if (json.success && Array.isArray(json.data) && json.data.length > 0) {
        return json.data;
      }
    }
  } catch (e) {
    console.warn('API offline or error fetching banners, using fallback', e);
  }
  return DEFAULT_BANNERS;
}

export async function fetchSizes(): Promise<{ id: number; label: string }[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/sizes`, { cache: 'no-store' });
    if (res.ok) {
      const json = await res.json();
      if (json.success && Array.isArray(json.data)) {
        return json.data;
      }
    }
  } catch (e) {
    console.warn('Error fetching sizes', e);
  }
  return [];
}

export async function fetchProductTypes(): Promise<{ id: number; name: string; slug: string }[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/product-types`, { cache: 'no-store' });
    if (res.ok) {
      const json = await res.json();
      if (json.success && Array.isArray(json.data)) {
        return json.data;
      }
    }
  } catch (e) {
    console.warn('Error fetching product types', e);
  }
  return [];
}

export async function fetchCategories(): Promise<Category[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/categories`, { cache: 'no-store' });
    if (res.ok) {
      const json = await res.json();
      if (json.success && Array.isArray(json.data) && json.data.length > 0) {
        return json.data;
      }
    }
  } catch (e) {
    console.warn('API offline or error fetching categories', e);
  }
  return [];
}
