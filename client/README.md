# PROSPCT Client - React + Vite Frontend

Production-ready React 18 frontend for the PROSPCT B2B prospect intelligence platform.

## 🚀 Quick Start

```bash
# From project root (recommended)
npm run dev:client

# Or from client directory
cd client
npm install
npm run dev
```

Runs on **http://localhost:5173** (or next available port)

## 🛠 Tech Stack

| Category | Technology |
|----------|------------|
| **Framework** | React 18.3.1 |
| **Build Tool** | Vite 5.4.8 |
| **Styling** | TailwindCSS 3.4.10 |
| **Routing** | React Router 6.26.1 |
| **State (Server)** | TanStack Query 5.51.23 |
| **State (Client)** | Zustand 4.5.5 |
| **Real-time** | Socket.io Client 4.8.3 |
| **Forms** | React Hook Form + Zod |
| **Charts** | Recharts 3.7.0 |
| **Icons** | Lucide React 0.574.0 (tree-shaken) |
| **Animations** | Framer Motion 12.38.0 |
| **HTTP** | Axios 1.7.4 |

## 📦 Project Structure

```
client/
├── public/                 # Static assets
│   ├── robots.txt          # SEO + security (blocks .env, admin, api)
│   └── favicon.ico
├── src/
│   ├── components/         # Reusable UI components
│   │   ├── admin/          # Admin panel components (dashboard, users, plans, settings)
│   │   ├── authComponents/ # Login, register, OAuth components
│   │   ├── common/         # Shared components (Header, CreditBar, CountrySelector, etc.)
│   │   ├── company/        # Company table, sidebar, export
│   │   ├── contact/        # Contact table, sidebar, select bar
│   │   ├── enrich/         # Enrichment profile, verification
│   │   ├── layout/         # Layout components (MainLayout, AdminLayout, Auth guards)
│   │   ├── lists/          # Lists & folders UI
│   │   ├── plans-and-billings/ # Pricing, checkout, credits
│   │   ├── search/         # Search filters, results table, lead profile
│   │   └── verifyComponents/ # Email/phone verification UI
│   ├── pages/              # Route-level page components
│   │   ├── auth/           # Login, Register, ResetPassword, AdminLogin
│   │   ├── dashboard/      # Dashboard, Search, Contacts, Companies, Lists, Settings
│   │   └── payment/        # FastSpringCheckout, VoucherThankYou, Redeem
│   ├── hooks/              # Custom React hooks
│   │   ├── useFilterLogic.js      # Search filter state management
│   │   ├── useList.js             # List/folder operations
│   │   ├── useCheckout.js         # Payment flow
│   │   ├── useFetchPackages.js    # Plan data fetching
│   │   ├── useDebounce.js         # Debounced search
│   │   ├── useFeatureAccess.js    # Role-based feature flags
│   │   ├── useCreditDeduction.js  # Credit deduction mutations
│   │   └── useNotificationSocket.js # Socket.io connection
│   ├── services/           # API services
│   │   ├── searchServices.js      # Search, count, companies API
│   │   ├── fastSpringService.js   # FastSpring checkout
│   │   └── paymentWindowService.js # Popup payment window
│   ├── store/              # Zustand stores
│   │   └── store.js        # Auth, credits, UI, team, admin state
│   ├── utils/              # Utilities
│   │   ├── logger.js           # Structured logging (replaces console)
│   │   ├── shareableUrl.js       # URL state encoding/decoding
│   │   ├── dataEnrichment.js     # Contact data enrichment helpers
│   │   ├── export.js             # CSV export helpers
│   │   ├── checkLoginStatus.js   # User session validation
│   │   └── checkAdminLoginStatus.js # Admin session validation
│   ├── payment/            # Payment providers
│   │   ├── provider/StripeProvider.jsx
│   │   └── gateway/FastSpringGateway.jsx
│   ├── App.jsx             # Root component (lazy routes + Suspense)
│   └── main.jsx            # Entry point
├── .env.example            # Environment template
├── .env.local              # Local overrides (gitignored)
├── package.json
├── vite.config.js          # Optimized build config
├── tailwind.config.js
├── postcss.config.js
└── eslint.config.js
```

## ⚡ Vite Configuration Highlights

```javascript
// vite.config.js
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
          ui: ['lucide-react', 'framer-motion', 'react-icons'],
          charts: ['recharts'],
          csv: ['papaparse', '@json2csv/plainjs', 'xlsx'],
          utils: ['axios', 'zustand', 'lz-string', 'crypto-js'],
          payment: ['@stripe/react-stripe-js', '@stripe/stripe-js', 'jsencrypt'],
        },
      },
    },
    chunkSizeWarningLimit: 500,
    target: 'es2020',
    minify: 'esbuild',
    cssCodeSplit: true,
    sourcemap: false,
  },
  optimizeDeps: {
    include: ['lucide-react'],
  },
});
```

**Results:**
- **Main bundle**: ~800 KB (gzipped: ~200 KB) — down from 2.4 MB
- **Lazy chunks**: 60+ page chunks (1-100 KB each)
- **CSS**: Split per chunk (~120 KB total, gzipped: ~19 KB)

## 🔐 Authentication Flow

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Login     │────▶│  JWT Token  │────▶│  Zustand    │
│  (email/    │     │  (30 days)  │     │  Store      │
│  OAuth)     │     │  HttpOnly   │     │  (auth,     │
└─────────────┘     │  Cookie     │     │  credits)   │
                    └─────────────┘     └─────────────┘
                           │                    │
                           ▼                    ▼
                    ┌─────────────┐     ┌─────────────┐
                    │ Auto-refresh │     │ Socket.io   │
                    │  on 401      │     │  (credits,  │
                    └─────────────┘     │  notifications)│
                                        └─────────────┘
```

## 🎯 Key Features

### Lazy-Loaded Routes
All routes use `React.lazy()` + `<Suspense>` for code splitting:
```jsx
const Dashboard = lazy(() => import("./pages/dashboard/Dashboard"));
const SearchPage = lazy(() => import("./pages/dashboard/SearchPage"));
// ... 60+ lazy-loaded components
```

### Search & Filtering
- **Debounced filters** (300ms) via `useFilterLogic`
- **Batch fetch** (25 rows) + auto-load up to 100
- **Cursor pagination** for infinite scroll
- **Count retry** (7 retries × 5s = 35s max wait)
- **Saved filter state** in URL (shareable links)

### Real-time (Socket.io)
```javascript
// Auto-connects on auth
useNotificationSocket();

// Listens for:
- creditUpdate        // Credit balance changes
- teamInvite          // Team invitations
- verificationComplete // Bulk verification done
- exportReady         // CSV export complete
```

### Payment Integrations
- **Stripe**: Elements + PaymentIntent flow
- **FastSpring**: SBL (Session-Based Link) + webhook queue
- **Vouchers**: External API → `/admin/special-deals/requests` → redeem

## 📝 Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start Vite dev server (HMR) |
| `npm run build` | Production build (code-split, minified) |
| `npm run preview` | Preview production build locally |
| `npm run lint` | Run ESLint |

## 🌍 Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `VITE_API_URL` | Backend API base URL | `http://localhost:4000` |
| `VITE_WS_URL` | WebSocket URL | `ws://localhost:4000` |
| `VITE_GOOGLE_CLIENT_ID` | Google OAuth client ID | - |
| `VITE_LINKEDIN_CLIENT_ID` | LinkedIn OAuth client ID | - |
| `VITE_DEBUG` | Enable debug logging | `true` |
| `VITE_ALLOW_INSECURE_HTTP` | Allow HTTP in dev | `true` |
| `VITE_ENFORCE_HTTPS` | Force HTTPS in prod | `false` |

## 🏗 Production Build

```bash
npm run build
```

**Output:** `client/dist/`
- `index.html` (2 KB)
- `assets/` - JS chunks (vendor, ui, charts, csv, utils, payment + 60+ lazy chunks)
- `assets/` - CSS chunks (per JS chunk)
- `*.svg` - Country flags (138 files, optimized)

**Deploy:** Serve `dist/` via Nginx with:
```nginx
location / {
    root /var/PROSPCT/client/dist;
    try_files $uri /index.html;
}

location /assets/ {
    expires 1y;
    add_header Cache-Control "public, immutable";
}
```

## 🧪 Testing

```bash
# Unit tests (when configured)
npm test

# E2E tests (when configured)
npm run test:e2e

# Type checking (if migrating to TypeScript)
npx tsc --noEmit
```

## 📚 Related Documentation

- **Root README**: [../README.md](../README.md) - Full project docs
- **Search Architecture**: [../docs/search-architecture.md](../docs/search-architecture.md)
- **Voucher System**: [../docs/special-deals-voucher-system.md](../docs/special-deals-voucher-system.md)
- **Voucher API Guide**: [../guide.md](../guide.md)
- **UI Role Rules**: [../server/UI_ROLE_RULES.md](../server/UI_ROLE_RULES.md)

## 🔧 Common Issues

| Issue | Solution |
|-------|----------|
| Port 5173 in use | Vite auto-increments (5174, 5175...) |
| Stripe HTTPS warning | Normal in dev; use `VITE_ALLOW_INSECURE_HTTP=true` |
| Socket.io CORS error | Check `ALLOWED_ORIGINS` in server `.env` |
| Large bundle warning | Check `manualChunks` in `vite.config.js` |
| Lazy load fails | Ensure `<Suspense>` wraps `<Routes>` in `App.jsx` |

## 📄 License

MIT License - see [../LICENSE](../LICENSE)