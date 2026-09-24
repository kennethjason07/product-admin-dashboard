# 🛍️ Product Admin Dashboard

A production-quality, fully responsive **Product Admin Dashboard** built with **Next.js 16 (App Router)**, **TypeScript**, **Tailwind CSS**, and **Axios**, integrated with the [DummyJSON API](https://dummyjson.com).

Designed with performance, accessibility, clean architecture, and technical interview clarity in mind — without using third-party state libraries like Redux, SWR, React Query, or UI table packages.

---

## 🚀 Key Features

* **🔐 Authentication & Session Persistence**
  * Mock login with pre-filled demo credentials (`emilys` / `emilyspass`).
  * Token storage in `localStorage` & cookies for route protection middleware.
  * Auto-redirect unauthenticated users to `/login` with `callbackUrl` preservation.
  * Header avatar & user profile display with quick logout.

* **📦 Product Catalog & Dashboard**
  * **Dual View Layout:** Adaptive HTML table for desktop screens and clean card grid for mobile devices.
  * **URL State Synchronization:** All search queries, filters, sorting options, and pagination states sync dynamically with browser URL search parameters (`?search=...&category=...&sort=price&order=desc&page=1`).
  * **Race-Condition Safe Search:** Uses `AbortController` in Axios requests to cancel outdated in-flight requests during rapid typing.
  * **Debounced Search Input:** Custom hook delays API dispatch by 400ms to conserve network requests.

* **✨ Full CRUD Capabilities**
  * **Create Product (`/products/new`):** Client-side validated form with image preview, category select, and auto-generated IDs.
  * **Read Product (`/products/[id]`):** Rich details page featuring image gallery, stock badges, discount highlights, warranty & shipping specs, and customer reviews.
  * **Edit Product (`/products/edit/[id]`):** Pre-populates form with existing product details; supports instant updates.
  * **Delete Product (`/products` & `/products/[id]`):** Accessible confirmation modal with focus trap, escape key support, loading state, and optimistic local store removal.
  * **Local State Overrides (`ProductContext`):** Since DummyJSON is a read-only mock API, created, updated, and deleted products are persisted locally in `localStorage` and merged seamlessly with server data across navigation.

* **🎨 Responsive Design & UX**
  * Custom Tailwind CSS design tokens with custom HSL/HEX color palettes, soft glassmorphism accents, subtle micro-animations, and custom scrollbars.
  * Accessible UI with keyboard focus indicators, screen reader ARIA attributes, and accessible modal overlays.
  * Skeleton loader placeholders for desktop table rows and mobile card lists.

---

## 🛠️ Tech Stack & Rationale

| Technology | Purpose | Rationale |
| :--- | :--- | :--- |
| **Next.js 16 (App Router)** | Framework | File-based routing, layout inheritance, SSR/CSR optimizations, and server/client boundary separation. |
| **TypeScript** | Language | End-to-end type safety, explicit interfaces (`Product`, `User`, `Category`), and auto-completion. |
| **Tailwind CSS** | Styling | Utility-first CSS for custom styling, responsive breakpoints (`sm`, `md`, `lg`, `xl`), and fast build times. |
| **Axios** | HTTP Client | Request/Response interceptors for global auth tokens, centralized error normalization, and native `AbortController` support. |
| **Lucide React** | Icons | Lightweight, customizable SVG icons. |
| **Native React State & Context** | State Management | Pure React `useState`, `useContext`, `useCallback`, `useTransition` to meet zero external state library requirements. |

---

## 📁 Project Structure

```
product-admin-dashboard/
├── src/
│   ├── app/
│   │   ├── layout.tsx            # Root layout with Auth & Product Providers
│   │   ├── page.tsx              # Home page (redirects to /products)
│   │   ├── login/
│   │   │   └── page.tsx          # Login page with demo credentials
│   │   └── products/
│   │       ├── page.tsx          # Dashboard catalog (Table & Cards)
│   │       ├── new/
│   │       │   └── page.tsx      # Add Product page
│   │       ├── [id]/
│   │       │   └── page.tsx      # Product Details page
│   │       └── edit/
│   │           └── [id]/
│   │               └── page.tsx  # Edit Product page
│   ├── components/
│   │   ├── auth/
│   │   │   └── LoginForm.tsx
│   │   ├── common/
│   │   │   ├── ConfirmDeleteModal.tsx
│   │   │   ├── EmptyState.tsx
│   │   │   ├── ErrorState.tsx
│   │   │   ├── LoadingState.tsx
│   │   │   └── Pagination.tsx
│   │   ├── layout/
│   │   │   └── Header.tsx
│   │   └── products/
│   │       ├── CategoryFilter.tsx
│   │       ├── ProductActions.tsx
│   │       ├── ProductCard.tsx
│   │       ├── ProductForm.tsx
│   │       ├── ProductRow.tsx
│   │       ├── ProductTable.tsx
│   │       ├── SearchBar.tsx
│   │       └── SortControl.tsx
│   ├── context/
│   │   ├── AuthContext.tsx       # Auth state, login/logout, user persistence
│   │   └── ProductContext.tsx    # Local CRUD overrides (created, updated, deleted)
│   ├── hooks/
│   │   ├── useAuth.ts
│   │   ├── useCategories.ts
│   │   ├── useDebounce.ts
│   │   └── useProducts.ts
│   ├── lib/
│   │   ├── api/
│   │   │   ├── auth.ts           # DummyJSON auth API requests
│   │   │   └── products.ts       # DummyJSON product API requests
│   │   └── axios.ts              # Configured Axios instance with interceptors
│   ├── types/
│   │   └── index.ts              # Global TypeScript declarations
│   └── utils/
│       └── url.ts                # Safe URL query parameter parser & builder
├── .env.example
├── next.config.ts
├── tailwind.config.ts
└── tsconfig.json
```

---

## ⚡ Getting Started

### Prerequisites
* Node.js **18.x** or higher
* npm, yarn, pnpm, or bun

### Installation & Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/kennethjason07/product-admin-dashboard.git
   cd product-admin-dashboard
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   Copy `.env.example` to `.env.local`:
   ```bash
   cp .env.example .env.local
   ```
   *Contents of `.env.local`:*
   ```env
   NEXT_PUBLIC_API_BASE_URL=https://dummyjson.com
   ```

4. **Run the development server:**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

5. **Build for production:**
   ```bash
   npm run build
   npm run start
   ```

---

## 💡 Key Architectural Decisions & Interview Highlights

### 1. Separatation of API Layer & Components
API calls are isolated inside `src/lib/api/` (`auth.ts`, `products.ts`). UI components do not make direct Axios calls; they use custom hooks (`useProducts`, `useCategories`) or service functions.

### 2. Handling Non-Persistent API (DummyJSON)
DummyJSON endpoints (`POST /products/add`, `PUT /products/id`, `DELETE /products/id`) return success payloads but do not persist mutations on their server.
To solve this cleanly, `ProductContext` stores local additions, updates, and deletion IDs in `localStorage`. The custom hook `useProducts` applies these overrides over fetched API results seamlessly.

### 3. Safe URL Parameter Synchronization
All filter/page states are driven by URL search parameters using Next.js `useSearchParams()` and `useTransition()`. Navigating backwards/forwards retains exact filter & page states. Deep links can be shared directly.

### 4. Race Condition Protection
During search filtering, fast key presses can trigger out-of-order network responses. `useProducts` uses native `AbortController` passed into Axios requests so stale responses are automatically discarded.

---

## 📄 License
MIT License. Built as a technical assignment.
