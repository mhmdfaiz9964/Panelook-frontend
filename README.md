# Panelook.lk Frontend & Admin Portal

> **Modern, High-Performance Storefront & Unified Logistics Back-Office for Panelook.lk — Sri Lanka's Premier Laptop Display & Component Platform.**  
> Built with **Next.js 16 (App Router)**, **React 19**, **TypeScript 5**, **Tailwind CSS 4**, and **Framer Motion**.

---

## Table of Contents
1. [Architecture & Highlights](#architecture--highlights)
2. [Tech Stack & Dependencies](#tech-stack--dependencies)
3. [Project Directory Layout](#project-directory-layout)
4. [Environment Configuration](#environment-configuration)
5. [Local Development](#local-development)
6. [API Integration & How APIs Are Used](#api-integration--how-apis-are-used)
   - [Public Storefront Integration](#1-public-storefront-integration)
   - [Authentication & Session Flow](#2-authentication--session-flow)
   - [Admin Portal & Back-Office Operations](#3-admin-portal--back-office-operations)
   - [PDF Invoices & Shipping Labels](#4-pdf-invoices--shipping-labels)
7. [cPanel / Apache Shared Hosting Deployment](#cpanel--apache-shared-hosting-deployment)
   - [Building for Static Export](#step-1-build-the-static-site)
   - [Deploying Main Storefront (panelook.lk)](#step-2-deploy-main-storefront-to-public_html)
   - [Important .htaccess Routing Rules](#step-3-important-htaccess-routing-rules)
   - [Deploying Admin Subdomain (admin.panelook.lk)](#step-4-deploy-admin-subdomain)
8. [Linux VPS Deployment (Nginx / Node.js)](#linux-vps-deployment-nginx--nodejs)
   - [Option A: High-Speed Static Nginx (Recommended)](#option-a-high-speed-static-nginx-recommended)
   - [Option B: Node.js SSR Server with PM2](#option-b-nodejs-ssr-server-with-pm2)
9. [Developer Guide & Component Library](#developer-guide--component-library)
10. [Troubleshooting & FAQ](#troubleshooting--faq)

---

## Architecture & Highlights

The frontend serves two primary audiences within a single, highly-optimized codebase:
1. **Public Customer Storefront (`/`)**:
   - Ultra-fast product browsing with instant client-side filtering (Brand, Screen Size, Pin Count, Resolution, Refresh Rate).
   - **Interactive Display Finder**: Guided wizard allowing laptop owners and repair technicians to match laptop model numbers with exact replacement display panels.
   - **Localized Checkout**: Sri Lankan address book, District and City selectors, automated shipping fee calculation, and Cash on Delivery (COD) / Bank Transfer options.
   - **Direct WhatsApp Commerce**: Pre-configured WhatsApp order buttons with dynamic product title, SKU, and compatibility links.
2. **Back-Office Admin & Logistics Portal (`/admin`)**:
   - Dashboard analytics: revenue metrics, order statuses, low-stock alerts.
   - Complete lifecycle order management (`pending` -> `confirmed` -> `dispatched` -> `delivered`).
   - Shipment tracking & courier assignment (Domex, Pronto, Koombiyo).
   - Multi-Warehouse stock transfers and inward purchase receipts.
   - Quotes and WhatsApp chat inquiry conversion into sales orders.
   - Printable PDF tax invoices and thermal shipping labels.

### Zero-Server-Overhead Static Export Architecture
Configured with `output: "export"` in `next.config.ts`, the application compiles to high-performance, pre-rendered HTML/CSS/JS (`out/` folder). This delivers:
- Zero Node.js server dependencies required on production hosting.
- Instant TTFB (Time to First Byte) on any static web server or CDN.
- Dynamic SPA routing on the client side with `.htaccess` rewrite fallbacks.

---

## Tech Stack & Dependencies

| Layer | Library / Framework | Version |
| :--- | :--- | :--- |
| **Framework** | Next.js (App Router) | `16.3.2` |
| **UI Library** | React & React DOM | `19.2.8` |
| **Language** | TypeScript | `^5` |
| **Styling** | Tailwind CSS & PostCSS | `^4.0` |
| **Icons** | Lucide React | `^1.33.0` |
| **Animations**| Framer Motion | `^13.1.1` |
| **Class Merge** | clsx & tailwind-merge | `^2.1` / `^3.6` |

---

## Project Directory Layout

```text
frontend/
├── public/                     # Static icons, brand logos, banners, placeholders
├── src/
│   ├── app/                    # Next.js 16 App Router
│   │   ├── page.tsx            # Storefront Homepage
│   │   ├── products/           # Product Catalog & Search
│   │   ├── product/[slug]/     # Dynamic Single Product Page
│   │   ├── display-finder/     # Laptop Screen Compatibility Matcher
│   │   ├── cart/               # Shopping Cart
│   │   ├── checkout/           # Checkout & Sri Lanka Shipping
│   │   ├── order-success/      # Order Confirmation & Invoice Link
│   │   ├── account/            # Customer Portal (Orders, Profile, Addresses)
│   │   ├── contact/            # Contact & Support Info
│   │   └── admin/              # Complete Back-Office Portal
│   │       ├── layout.tsx      # Admin Auth Guard & Sidebar Navigation
│   │       ├── login/          # Staff / Admin Authentication
│   │       ├── dashboard/      # Analytics & KPI Cards
│   │       ├── orders/         # Order Processing & Waybills
│   │       ├── shipments/      # Logistics & Courier Dispatch
│   │       ├── products/       # Products Management & Image Uploads
│   │       ├── inventory/      # Stock Auditing & Multi-Warehouse Transfers
│   │       ├── purchases/      # Supplier Purchase Orders & Inward Receipts
│   │       ├── quotes/         # B2B Quotations Management
│   │       ├── whatsapp/       # WhatsApp Inquiries & Conversion
│   │       ├── reports/        # Sales, Profits, and Stock Reports
│   │       └── settings/       # Store Configuration & System Health
│   ├── components/             # Reusable UI & Admin Components
│   │   ├── Navbar.tsx          # Store Header & Search Bar
│   │   ├── Footer.tsx          # Store Footer & Quick Links
│   │   ├── ProductCard.tsx     # Display Item Card with Quick Add & Specs
│   │   ├── FilterDrawer.tsx    # Mobile Faceted Search Filter Drawer
│   │   ├── StickyMobileActionBar.tsx # Mobile Bottom Action Bar
│   │   └── admin/              # Admin-Specific UI Components
│   │       └── AdminResourceManager.tsx # Unified CRUD Data Table
│   └── lib/
│       ├── config.ts           # Centralized API URLs, store constants, PDF URLs
│       ├── api.ts              # API Client fetchers & Bearer token injectors
│       ├── cartStore.ts        # Client-side Shopping Cart State Manager
│       └── utils.ts            # Formatting helpers (LKR currency, dates)
├── admin-subdomain.htaccess    # Apache rewrite rules for admin subdomain
├── next.config.ts              # Next.js export & image optimization configuration
└── package.json
```

---

## Environment Configuration

Create `.env.local` for local development or configure environment variables in your build pipeline:

```env
# URL pointing to the Laravel Backend API
NEXT_PUBLIC_API_URL=https://admin.panelook.lk/api

# (Optional) Explicit Admin API URL if hosted on a separate path
NEXT_PUBLIC_ADMIN_API_URL=https://admin.panelook.lk/api/admin
```

> **Note**: For local development against a local Laravel server, set:
> ```env
> NEXT_PUBLIC_API_URL=http://localhost:8000/api
> ```

---

## Local Development

### 1. Install Dependencies
```bash
cd frontend
npm install
```

### 2. Run Next.js Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

- Storefront: `http://localhost:3000`
- Admin Login: `http://localhost:3000/admin/login`
- Display Finder: `http://localhost:3000/display-finder`

### 3. Build & Test Static Export
```bash
npm run build
```
This generates the ready-to-deploy static assets in the `out/` folder.

---

## API Integration & How APIs Are Used

All API communication is centralized in `src/lib/config.ts` and `src/lib/api.ts`.

### 1. Public Storefront Integration
- **Homepage (`GET /api/homepage`)**: Fetches banner slides, top categories, brand carousels, and latest stock.
- **Product Catalog (`GET /api/products`)**: Sends query parameters (`brand`, `size`, `pin`, `category`, `sort`, `search`) for real-time filtering.
- **Single Product View (`GET /api/products/{slug}`)**: Loads full technical specifications (resolution, connector type, backlight, surface finish, compatible models).
- **Display Finder (`GET /api/display-finder`)**: Sends hardware parameters (`brand_id`, `model_name`, `pin_id`, `size_id`) to find verified compatible screens.
- **Checkout Process**:
  1. `GET /api/locations/provinces` & `GET /api/locations/districts` populate address dropdowns.
  2. `POST /api/shipping/calculate` calculates exact delivery rates dynamically.
  3. `POST /api/coupons/validate` verifies promo codes.
  4. `POST /api/checkout` submits customer payload and returns the confirmed `order_number`.

### 2. Authentication & Session Flow
- When logging in via `/admin/login` or `/account/login`, the frontend sends credentials to `POST /api/admin/login` or `POST /api/auth/login`.
- The returned Sanctum token is saved in `localStorage` under `admin_token` or `auth_token`.
- `AdminLayout` (`src/app/admin/layout.tsx`) performs client-side verification on route transitions:
  - If no token exists, the user is redirected to `/admin/login`.
  - Authorized requests attach the header:
    ```http
    Authorization: Bearer <TOKEN>
    Accept: application/json
    ```

### 3. Admin Portal & Back-Office Operations
- **Dashboard (`GET /api/admin/dashboard`)**: Displays total revenue, pending orders count, dispatch status, low-stock warnings.
- **Order Processing (`POST /api/admin/orders/{id}/status`)**: Allows staff to change order states (`pending` -> `confirmed` -> `dispatched` -> `delivered` -> `cancelled`).
- **Product Catalog Management (`POST/PUT /api/admin/products`)**: Multi-part image uploading via `POST /api/admin/upload-image`.
- **Inventory & Transfers**:
  - `GET /api/admin/inventory`: Live stock ledger.
  - `POST /api/admin/stock-transfers`: Initiate transfers between warehouses.
- **Quotes & WhatsApp Conversion**:
  - `POST /api/admin/whatsapp-orders/{id}/convert`: Converts a WhatsApp customer message directly into an active sales order.

### 4. PDF Invoices & Shipping Labels
Helper functions in `src/lib/config.ts` construct direct download URLs:
- `getInvoiceUrl(orderId)`: `GET /api/orders/{id}/invoice`
- `getShippingNoteUrl(orderId)`: `GET /api/orders/{id}/shipping-note`
- `getShippingLabelUrl(orderId)`: `GET /api/admin/shipments/{id}/label`

---

## cPanel / Apache Shared Hosting Deployment

Because Panelook.lk uses `output: "export"`, deploying to standard cPanel shared hosting requires no Node.js processes, daemons, or PM2!

### Step 1: Build the Static Site
Run the production build on your machine or CI/CD:
```bash
cd frontend
npm run build
```
This compiles the entire frontend into the `frontend/out/` directory.

### Step 2: Deploy Main Storefront to `public_html`
1. Open cPanel **File Manager**.
2. Navigate to your website root: `/public_html/`.
3. Upload all files and folders from inside `frontend/out/`.
4. Ensure the `.htaccess` file included in `out/` is uploaded to the root of `public_html/`.

### Step 3: Important `.htaccess` Routing Rules
The included `.htaccess` in `out/` is critical for client-side routing on Apache servers:
```apache
Options -Indexes
DirectoryIndex index.html

<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /

  # Security headers
  Header always set X-Content-Type-Options "nosniff"
  Header always set X-Frame-Options "SAMEORIGIN"
  Header always set Referrer-Policy "strict-origin-when-cross-origin"

  # Serve existing static files
  RewriteCond %{REQUEST_FILENAME} -f
  RewriteRule ^ - [L]

  # Dynamic Product Route Fallback:
  # Allows newly added products to load dynamically without rebuilding static files!
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule ^product/([^/]+)/?$ product/index.html [L,QSA]

  # Dynamic Customer Orders Fallback
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule ^account/orders/([^/]+)/?$ account/orders/view/index.html [L,QSA]

  # Rewrite Clean URLs (e.g. /checkout -> /checkout.html)
  RewriteCond %{REQUEST_FILENAME}.html -f
  RewriteRule ^(.*)$ $1.html [L]

  # SPA Fallback
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule ^ index.html [L]

  ErrorDocument 404 /404.html
</IfModule>
```

### Step 4: Deploy Admin Subdomain
If you have configured `admin.panelook.lk` as a subdomain pointing to the same or a separate folder:
1. Upload the same `out/` contents to the subdomain document root (e.g., `/public_html/admin.panelook.lk/`).
2. Copy `admin-subdomain.htaccess` from the repository root, rename it to `.htaccess`, and place it in the subdomain root:
```apache
RewriteEngine On
# Redirect visiting https://admin.panelook.lk/ directly to https://admin.panelook.lk/admin/
RewriteRule ^$ /admin/ [R=302,L]
```
3. When staff visit `https://admin.panelook.lk`, they are automatically redirected into the admin authentication flow.

---

## Linux VPS Deployment (Nginx / Node.js)

### Option A: High-Speed Static Nginx (Recommended)
This method is extremely fast, consumes almost zero RAM, and easily handles thousands of concurrent requests.

#### 1. Upload Build
```bash
# On your local machine:
npm run build
rsync -avz --delete out/ user@your-vps-ip:/var/www/panelook-frontend/
```

#### 2. Configure Nginx Server Block
Create `/etc/nginx/sites-available/panelook-frontend.conf`:
```nginx
server {
    listen 80;
    server_name panelook.lk www.panelook.lk;
    root /var/www/panelook-frontend;
    index index.html;

    # Security Headers
    add_header X-Frame-Options "SAMEORIGIN";
    add_header X-Content-Type-Options "nosniff";
    add_header Referrer-Policy "strict-origin-when-cross-origin";

    # Gzip Compression
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml image/svg+xml;

    # Static assets cache
    location /_next/static/ {
        expires 1y;
        add_header Cache-Control "public, max-age=31536000, immutable";
    }

    # Dynamic Product Fallback
    location ~* ^/product/[^/]+/?$ {
        try_files /product/index.html =404;
    }

    # Customer Orders Dynamic Fallback
    location ~* ^/account/orders/[^/]+/?$ {
        try_files /account/orders/view/index.html =404;
    }

    # Standard Clean URLs and SPA Fallback
    location / {
        try_files $uri $uri/ $uri.html /index.html =404;
    }
}
```

Enable and reload Nginx:
```bash
sudo ln -s /etc/nginx/sites-available/panelook-frontend.conf /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

#### 3. Enable SSL with Certbot
```bash
sudo certbot --nginx -d panelook.lk -d www.panelook.lk
```

---

### Option B: Node.js SSR Server with PM2
If you disable `output: "export"` in `next.config.ts` to use server-side rendering:

```bash
# 1. Install PM2 globally
sudo npm install -g pm2

# 2. Build on VPS
npm install
npm run build

# 3. Start Next.js with PM2
pm2 start npm --name "panelook-frontend" -- start -- -p 3000
pm2 save
pm2 startup
```

Configure Nginx reverse proxy:
```nginx
location / {
    proxy_pass http://127.0.0.1:3000;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection 'upgrade';
    proxy_set_header Host $host;
    proxy_cache_bypass $http_upgrade;
}
```

---

## Developer Guide & Component Library

### 1. `AdminResourceManager` Component
All standard admin CRUD tables (Banners, Categories, Brands, Sizes, Pins, Models, Warehouses, Suppliers, Staff Users) leverage the centralized `AdminResourceManager.tsx` component:
- Integrated search & pagination
- Modal-based creation and editing forms
- Automatic deletion confirmation modals
- Live status badges & toast notifications

### 2. Adding a New Product Filter
To add new hardware attributes (e.g. Refresh Rate or Touchscreen):
1. Add the column/attribute to the backend API response.
2. Update the type definitions in `src/types/product.ts`.
3. Add the filter checkbox in `src/components/FilterDrawer.tsx` and `src/app/products/page.tsx`.

---

## Troubleshooting & FAQ

#### 1. Clicking an item shows 404 on page refresh in production
- **Cause**: Apache or Nginx is trying to look for a physical file instead of falling back to Next.js client routing.
- **Fix**: Verify that `.htaccess` is present in the document root (cPanel) or that `try_files` is configured as shown above (Nginx).

#### 2. Products added in Admin show 404 on the public storefront
- **Cause**: Static export generates HTML pages at build time. When a new product is added later, its pre-built HTML file does not exist on disk.
- **Fix**: The included `.htaccess` rewrite rule `RewriteRule ^product/([^/]+)/?$ product/index.html [L,QSA]` solves this by routing requests to the generic product view template, which fetches the latest data via client API!

#### 3. Admin shows CORS errors when saving data
- Verify that `NEXT_PUBLIC_API_URL` points to `https://admin.panelook.lk/api` (matching the SSL certificate).
- Verify that the Laravel backend has `https://panelook.lk` and `https://admin.panelook.lk` in its CORS configuration.

---

## License

This software is proprietary and confidential.  
Copyright © 2026 **Panelook.lk**. All rights reserved.
