export interface Brand {
  id: number;
  name: string;
  slug: string;
  logo?: string;
  description?: string;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  description?: string;
  image?: string;
}

export interface ProductType {
  id: number;
  name: string;
  slug: string;
  description?: string;
  status?: boolean;
  sort_order?: number;
}

export interface Banner {
  id: number;
  title: string;
  subtitle?: string;
  desktop_image: string;
  mobile_image?: string;
  button_text?: string;
  button_url?: string;
  sort_order?: number;
  status: boolean;
}

export interface ProductLaptopModel {
  id: number;
  product_id: number;
  model_name: string;
}

export interface ProductPartNumber {
  id: number;
  product_id: number;
  part_number: string;
}

export interface ProductTag {
  id: number;
  product_id: number;
  tag: string;
}

export interface ProductImage {
  id: number;
  product_id: number;
  image_url: string;
  image_type: string;
  sort_order: number;
}

export interface ProductVariation {
  id: number;
  product_id: number;
  sku: string;
  panel_number?: string;
  laptop_model?: string;
  brand?: string;
  display_size?: string;
  pin_type?: string;
  touch_type?: string;
  display_type?: string;
  resolution?: string;
  price: number;
  sale_price?: number;
  stock_quantity: number;
  image?: string;
}

export interface Product {
  id: number;
  name: string;
  slug: string;
  sku: string;
  category_id?: number;
  brand_id?: number;
  product_type_id?: number;
  category?: Category;
  brand?: Brand;
  product_type?: ProductType;
  description?: string;
  short_description?: string;
  main_image: string;
  images?: string[];
  status: string;
  is_featured: boolean;
  is_new?: boolean;
  is_sale?: boolean;
  cost_price?: number;
  selling_price: number;
  sale_price?: number;
  original_price?: number;
  rating?: number;
  reviews?: number;
  stock_quantity: number;
  min_stock?: number;
  panel_number: string;
  laptop_model: string;
  display_size: string;
  screen_size?: string;
  pin_type: string;
  display_type: string;
  touch_type: string;
  resolution: string;
  refresh_rate?: string;
  connector?: string;
  panel_surface?: string;
  warranty: string;
  condition?: string;
  laptop_models?: ProductLaptopModel[];
  part_numbers?: ProductPartNumber[];
  tags?: ProductTag[];
  images_relation?: ProductImage[];
  variations?: ProductVariation[];
}

export interface CartItem {
  product: Product;
  variation?: ProductVariation;
  quantity: number;
  unit_price: number;
}

export interface OrderItem {
  id?: number;
  product_id: number;
  product_name: string;
  variation_details?: any;
  quantity: number;
  unit_price: number;
  subtotal: number;
}

export interface Order {
  id: number;
  order_number: string;
  invoice_number?: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  shipping_address: string;
  city: string;
  district: string;
  postal_code?: string;
  notes?: string;
  payment_method: string;
  payment_status: string;
  shipping_status: string;
  order_status: string;
  subtotal: number;
  shipping_cost: number;
  discount: number;
  grand_total: number;
  created_at: string;
  items: OrderItem[];
}

export interface FilterState {
  search: string;
  brand: string;
  model?: string;
  category?: string;
  size: string;
  screen_size?: string;
  pin: string;
  touch: string;
  ips: boolean;
  display_type?: string;
  product_type?: string;
  minPrice: number;
  maxPrice: number;
  sort: string;
}
