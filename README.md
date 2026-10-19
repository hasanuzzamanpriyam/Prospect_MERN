# PROSPCT - MERN Stack Prospect Intelligence Platform

A comprehensive B2B prospect intelligence platform built with the MERN stack (MongoDB, Express.js, React, Node.js) featuring advanced search, team collaboration, admin management, and payment integrations.

## 🚀 Features

### Core Features
- **Advanced Search & Filtering** - Search companies/contacts with 30+ filters (technology, revenue, funding, job postings, location, seniority, industry, etc.)
- **MongoDB-Native Search** - No ElasticSearch dependency; uses compound indexes, two-stage pagination, and Redis caching over 70M+ contacts
- **Contact & Company Management** - Import, enrich, verify, and export leads with credit-based system
- **Team Collaboration** - Invite team members, role-based access control (Owner/Admin/Member/Standalone) with shared workspace model
- **Lists & Folders** - Organize prospects into custom lists and folders with sharing
- **Real-time Updates** - Socket.io powered live notifications, credit updates, and team events

### Authentication & Authorization
- **Multi-provider Auth** - Email/password, Google OAuth, LinkedIn OAuth, Telegram
- **JWT-based Sessions** - Secure access tokens with automatic refresh (30-day expiry)
- **Role-based Access** - User, Admin, Super Admin roles with granular permissions
- **Team-based Permissions** - Workspace-level access control (members use owner's credits/data)

### Admin Panel
- **User Management** - View, add, update, delete users and teams
- **Plan Management** - Create/edit pricing plans (Free, Starter, Growth, Custom)
- **Subscription & Billing** - View transactions, subscriptions, payment history
- **System Settings** - Configure SMTP, payment gateways, OAuth, feature flags, payment methods, UI branding
- **Analytics Dashboard** - Revenue charts, user growth, usage metrics with Recharts
- **Special Deals & Vouchers** - Create deals, approve redemption requests, manage voucher generation API

### Payment Integrations
- **Stripe** - Credit card payments, subscriptions, webhooks, SCA support
- **FastSpring** - Global payment processing with webhook queue (Bull/Redis)
- **CoinPayments** - Cryptocurrency payments
- **Heleket** - Crypto payment gateway
- **PayPro Global** - Alternative payment processor
- **Vouchers & Coupons** - Discount codes, special deals, external voucher API (`/admin/special-deals/requests`)

### Search & Data
- **MongoDB-Native Search** - Aggregation pipelines over `contacts_v5` (61M docs) with `companies_cache` (2.3M companies)
- **Two-Stage Pagination** - Batch fetch (25→100 rows) + cursor-based pagination for instant results
- **Filter Caching** - Redis-backed progressive filter narrowing with `idset:v1` keys
- **Data Enrichment** - Background company data enrichment via `setImmediate`
- **Email/Phone Verification** - Bulk and single verification with credit deduction
- **CSV Import/Export** - Bulk data operations with PapaParse and xlsx
- **Saved Searches** - Save and reuse complex queries with sharing

## 🛠 Tech Stack

### Frontend
| Technology | Version | Purpose |
|------------|---------|---------|
| React | 18.3.1 | UI library |
| Vite | 5.4.8 | Build tool & dev server (code splitting, lazy loading, esbuild minify) |
| TailwindCSS | 3.4.10 | Utility-first CSS |
| React Router | 6.26.1 | Client-side routing (lazy-loaded routes) |
| TanStack Query | 5.51.23 | Server state management, caching, retries |
| Zustand | 4.5.5 | Client state management (auth, credits, UI) |
| Socket.io Client | 4.8.3 | Real-time communication |
| Recharts | 3.7.0 | Data visualization (admin charts) |
| Framer Motion | 12.38.0 | Animations |
| Lucide React | 0.574.0 | Icon library (tree-shaken) |
| React Hook Form | 7.x | Form validation (with Zod) |
| Axios | 1.7.4 | HTTP client with interceptors |

### Backend
| Technology | Version | Purpose |
|------------|---------|---------|
| Node.js | 18+ (LTS) | Runtime |
| Express.js | 4.19.2 | Web framework |
| MongoDB | 7.0 | Primary database (70M+ docs, 88 GB) |
| Mongoose | 8.6.1 | ODM with compound indexes |
| Redis | 4.7.0 (client) / ioredis 5.4.1 (Bull) | Caching, queues, sessions |
| Bull | 4.16.3 | Job queues (FastSpring webhooks, renewals) |
| Socket.io | 4.8.0 | Real-time server (restricted CORS) |
| JWT | 9.0.3 | Authentication (HS256, 30-day) |
| bcryptjs | 2.4.3 | Password hashing (12 rounds) |
| Helmet | 8.1.0 | Security headers |
| express-rate-limit | 8.3.2 | Rate limiting (general, auth, password reset) |
| Winston | 3.19.0 | Structured logging |
| Multer | 1.4.5 | File uploads |
| Nodemailer | 8.0.1 | SMTP emails |

### Infrastructure
- **CI/CD**: GitHub Actions (auto-deploy to VPS)
- **Process Manager**: PM2 (cluster mode, max-old-space-size=4096, max-restarts=10)
- **Reverse Proxy**: Nginx (gzip, caching, rate limiting, security headers)
- **SSL**: Let's Encrypt / Cloudflare
- **Monitoring**: `/health` endpoint, MongoDB profiling (slowms=200)

## 📦 Project Structure

```
PROSPCT/
├── client/                 # React frontend
│   ├── public/             # Static assets (robots.txt, favicon)
│   ├── src/
│   │   ├── components/     # Reusable UI components (admin, search, contact, company, etc.)
│   │   ├── pages/          # Page components (auth, dashboard, payment, admin)
│   │   ├── hooks/          # Custom React hooks (useFilterLogic, useList, useCheckout, etc.)
│   │   ├── services/       # API services (searchServices, fastSpringService, paymentWindowService)
│   │   ├── store/          # Zustand state store (auth, credits, UI, team)
│   │   ├── utils/          # Utility functions (logger, shareableUrl, dataEnrichment, etc.)
│   │   ├── payment/        # Payment integrations (StripeProvider, FastSpringGateway)
│   │   ├── App.jsx         # Main app component (lazy-loaded routes + Suspense)
│   │   └── main.jsx        # Entry point
│   ├── package.json
│   ├── vite.config.js      # Optimized build config (manualChunks, code splitting)
│   └── tailwind.config.js
│
├── server/                 # Express backend
│   ├── config/             # Configuration (db, elasticsearch, multer, cookie)
│   ├── controllers/        # Route controllers (30+)
│   ├── middleware/         # Express middleware (auth, admin, rbac, workspace, error handling)
│   ├── models/             # Mongoose models (28 models)
│   ├── routes/             # API routes (25+ route files)
│   ├── services/           # Business logic (searchService, stripeService, fastSpringService, etc.)
│   ├── utils/              # Utility functions (redisClient, socket, systemSettings, searchQueryBuilder, logger)
│   ├── scripts/            # Database scripts (enable-profiling, seed-database)
│   ├── jobs/               # Cron jobs (renewPackages)
│   ├── queues/             # Bull job queues (fastSpringQueue)
│   ├── server.js           # Entry point (startup race fix, health endpoint)
│   └── package.json
│
├── docs/                   # Documentation
│   ├── search-architecture.md        # 464-line search system deep-dive
│   ├── special-deals-voucher-system.md # 257-line voucher system docs
│   ├── search-filters.md             # Filter reference
│   ├── companies-filters.md          # Company filter reference
│   └── search-filters-audit.md       # Filter audit
├── .github/workflows/      # CI/CD pipelines
├── .gitignore
├── package.json            # Root package.json (concurrently for unified dev)
└── README.md
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ (LTS)
- MongoDB 7.0+
- Redis 7+ (local or Redis Labs)
- 4 GB+ RAM (for MongoDB working set)

### Installation

```bash
# Clone repository
git clone https://github.com/hasanuzzamanpriyam/Prospect_MERN.git
cd Prospect_MERN

# Install ALL dependencies (root + client + server)
npm install

# Configure environment variables
# Server
cp server/.env.example server/.env
# Edit server/.env with your values (see Environment Variables below)

# Client
cp client/.env.example client/.env.local
# Edit client/.env.local with your values
```

### Environment Variables

#### Server (`server/.env`)
```env
# Database
MONGODB_URI=mongodb://username:password@host:27017/prospct?authSource=admin

# JWT (min 32 chars for secret, 16 for invite)
JWT_SECRET=your-super-secret-jwt-key-min-32-chars
INVITE_TOKEN_SECRET=your-invite-secret-min-16-chars

# Redis (local recommended for production)
REDIS_HOST=127.0.0.1
REDIS_PORT=6379
REDIS_PASSWORD=

# Frontend URL (for CORS, redeem links)
FRONTEND_URL=http://localhost:5173
ALLOWED_ORIGINS=http://localhost:5173,http://localhost:5174

# Stripe (get from https://dashboard.stripe.com/apikeys)
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# FastSpring (for production payments)
FASTSPRING_ACCESS_KEY=...
FASTSPRING_STOREFRONT=...
FASTSPRING_WEBHOOK_SECRET=...
FASTSPRING_PRIVATE_KEY=...

# OAuth (get from respective developer consoles)
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
LINKEDIN_CLIENT_ID=...
LINKEDIN_CLIENT_SECRET=...

# SMTP (for emails)
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=...
SMTP_PASS=...
SMTP_FROM="Prospct <noreply@prospct.io>"
RECEIVER_EMAIL=admin@prospct.io

# Optional: Voucher API Key (enables X-Api-Key auth on /admin/special-deals/requests)
VOUCHER_API_KEY=your-voucher-api-key
```

#### Client (`client/.env.local`)
```env
VITE_API_URL=http://localhost:4000
VITE_WS_URL=ws://localhost:4000
VITE_GOOGLE_CLIENT_ID=...
VITE_LINKEDIN_CLIENT_ID=...
VITE_DEBUG=true
VITE_ALLOW_INSECURE_HTTP=true
VITE_ENFORCE_HTTPS=false
```

### Seed Database (Required for First Run)

```bash
cd server
node scripts/seed-database.js
```

This creates:
- Free, Starter, Growth plans
- System settings with default payment methods
- **Admin user**: `admin@prospct.io` / `admin123`
- Test user (if configured)

### Run Development Servers (Single Command)

```bash
# From project root - runs both client (Vite) and server (nodemon)
npm run dev

# Or individually:
npm run dev:server  # Backend only (http://localhost:4000)
npm run dev:client  # Frontend only (http://localhost:5173)
```

### Access the App

| Page | URL | Credentials |
|------|-----|-------------|
| Main App | http://localhost:5173 | - |
| User Login | http://localhost:5173/login | (register new) |
| Admin Login | http://localhost:5173/admin-login | admin@prospct.io / admin123 |
| Admin Dashboard | http://localhost:5173/admin/dashboard | Admin credentials |
| Health Check | http://localhost:4000/health | - |
| Voucher API | http://localhost:4000/admin/special-deals/requests | X-Api-Key header |

## 🏗 Production Deployment

### Build Frontend
```bash
npm run build
# Output in client/dist/ (code-split chunks, gzipped)
```

### Production Environment Variables
```env
# Server
NODE_ENV=production
MONGODB_URI=mongodb://user:pass@host:port/db?authSource=admin
JWT_SECRET=very-long-random-string-min-64-chars
INVITE_TOKEN_SECRET=very-long-random-string-min-32-chars
REDIS_HOST=your-redis-host
REDIS_PASSWORD=your-redis-password
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
FRONTEND_URL=https://app.prospct.io
ALLOWED_ORIGINS=https://app.prospct.io,https://get.prospct.io
VOUCHER_API_KEY=secure-random-key
```

### PM2 Configuration (Production)
```bash
# Install socket.io-redis adapter for cluster mode
cd server && npm install socket.io-redis

# Start in cluster mode (uses all CPU cores)
pm2 start server.js -i max --name prospct-backend \
  --max-old-space-size=4096 \
  --max-restarts 10 \
  --kill-timeout 5000 \
  --watch false

# Save PM2 config
pm2 save
pm2 startup
```

### Nginx Configuration (Production)
```nginx
# /etc/nginx/sites-available/prospct
server {
    server_name app.prospct.io;

    # Block .env scanning
    location ~ /\.env { deny all; return 404; }

    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/javascript application/json application/xml application/xml+rss;

    # Static asset caching
    location /assets/ {
        root /var/PROSPCT/client/dist;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # Security headers
    add_header X-Content-Type-Options nosniff;
    add_header X-Frame-Options DENY;
    add_header X-XSS-Protection "1; mode=block";
    add_header Referrer-Policy strict-origin-when-cross-origin;

    # Frontend
    location / {
        root /var/PROSPCT/client/dist;
        try_files $uri /index.html;
    }

    # Rate limiting
    limit_req_zone $binary_remote_addr zone=api:10m rate=100r/s;
    limit_req_zone $binary_remote_addr zone=auth:10m rate=10r/s;

    # API
    location /api/ {
        limit_req zone=api burst=20 nodelay;
        proxy_pass http://localhost:4000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "";
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Auth endpoints (stricter)
    location /api/auth/ {
        limit_req zone=auth burst=5 nodelay;
        proxy_pass http://localhost:4000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "";
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Voucher API (external)
    location /admin/special-deals/requests {
        add_header 'Access-Control-Allow-Origin' '*' always;
        add_header 'Access-Control-Allow-Methods' 'GET, POST, OPTIONS' always;
        add_header 'Access-Control-Allow-Headers' 'DNT,User-Agent,X-Requested-With,If-Modified-Since,Cache-Control,Content-Type,Range,Authorization,X-Api-Key' always;
        
        if ($request_method = 'OPTIONS') {
            add_header 'Access-Control-Allow-Origin' '*';
            add_header 'Access-Control-Allow-Methods' 'GET, POST, OPTIONS';
            add_header 'Access-Control-Allow-Headers' 'DNT,User-Agent,X-Requested-With,If-Modified-Since,Cache-Control,Content-Type,Range,Authorization,X-Api-Key';
            add_header 'Access-Control-Max-Age' 1728000;
            add_header 'Content-Type' 'text/plain; charset=utf-8';
            add_header 'Content-Length' 0;
            return 204;
        }
        
        proxy_pass http://localhost:4000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # WebSocket
    location /socket.io/ {
        proxy_pass http://localhost:4000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # SSL (Let's Encrypt)
    listen 443 ssl;
    ssl_certificate /etc/letsencrypt/live/app.prospct.io/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/app.prospct.io/privkey.pem;
    include /etc/letsencrypt/options-ssl-nginx.conf;
    ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem;
}

server {
    listen 80;
    server_name app.prospct.io;
    return 301 https://$host$request_uri;
}
```

### System-Level Optimizations (VPS)
```bash
# 1. Create 4GB swap (prevents OOM kills)
sudo fallocate -l 4G /swapfile && sudo chmod 600 /swapfile && sudo mkswap /swapfile && sudo swapon /swapfile
echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab

# 2. Enable MongoDB profiling (slow queries > 200ms)
cd /var/PROSPCT/server && node scripts/enable-profiling.js

# 3. Create compound indexes for 7-8 filter combos (run in mongosh)
# db.contacts_v5.createIndex(
#   { "_source.person_location_country": 1, "_source.person_title": 1, 
#     "_source.person_seniority": 1, "_source.person_email_status_cd": 1 },
#   { background: true }
# )
# db.contacts_v5.createIndex(
#   { "_source.person_location_city": 1, "_source.person_title": 1, 
#     "_source.person_seniority": 1 },
#   { background: true }
# )

# 4. Test nginx config and reload
sudo nginx -t && sudo systemctl reload nginx
```

## 📚 API Documentation

### Base URL
```
Development: http://localhost:4000/api
Production:  https://app.prospct.io/api
```

### Health & Monitoring
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/health` | None | Health check (DB, memory, uptime) |
| GET | `/api/admin/api-health` | Admin | External API health (Stripe, SMTP, etc.) |

### Authentication Endpoints
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/auth/register` | Register new user |
| POST | `/auth/login` | User login (JWT + refresh) |
| POST | `/auth/adminLogin` | Admin login (JWT, role=admin) |
| POST | `/auth/google-auth` | Google OAuth |
| POST | `/auth/linkedin` | LinkedIn OAuth |
| POST | `/auth/verify-token` | Verify user access token |
| POST | `/auth/verify-admin-token` | Verify admin access token |
| POST | `/auth/forgot-password` | Request password reset |
| POST | `/auth/reset-password` | Reset password |
| POST | `/auth/logout` | Invalidate token |

### Search Endpoints
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/search/batch` | Batch search (25 rows + cursor) |
| POST | `/search/batch/next` | Next batch via cursor |
| POST | `/search/count` | Total/saved/new counts (with retry) |
| POST | `/search/companies` | Unique company search |
| GET | `/search/suggestions/:type` | Filter suggestions (industry, city, etc.) |

### Saved Items
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/saved` | Save contacts (individual or batch) |
| GET | `/saved` | List saved contacts |
| DELETE | `/saved` | Delete saved contacts |
| DELETE | `/saved/all` | Delete all saved contacts |

### Companies
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/companies/save` | Save companies (batch) |
| GET | `/companies` | List saved companies |
| DELETE | `/companies` | Delete saved companies |

### Credits
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/credits` | Get user/team credits |
| POST | `/credits/deduct` | Deduct credits (email, phone, verification, export) |
| GET | `/credits/ledger` | Credit transaction history |

### Admin Endpoints
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/admin/users` | List all users |
| GET | `/admin/users/teams` | List all teams |
| GET | `/admin/plans` | List plans |
| POST | `/admin/plans` | Create plan |
| GET | `/admin/settings` | Get system settings |
| PUT | `/admin/settings` | Update system settings |
| POST | `/admin/settings/test` | Test API connections |
| POST | `/admin/settings/test-email` | Send test email |

### Special Deals & Vouchers
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/special-deals/` | Admin | List all deals |
| POST | `/api/special-deals/add` | Admin | Create deal |
| POST | `/api/special-deals/redeem` | User | Direct redeem code |
| POST | `/admin/special-deals/requests` | X-Api-Key | **External voucher generation** |
| GET | `/api/vouchers/validate/:code` | Public | Validate voucher |
| POST | `/api/vouchers/redeem` | User | Redeem voucher |
| POST | `/api/vouchers/register-and-redeem` | Public | Register + redeem |

### FastSpring Webhook
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/payment/fastspring/webhook` | HMAC | Order completed, subscription events |

## 🔐 Security Features

- **Helmet.js** - Security headers (CSP, HSTS, X-Frame-Options, etc.)
- **Rate Limiting** - Express-rate-limit (general: 400/15min, auth: 15/15min, password reset: 3/hr)
- **Nginx Rate Limiting** - API: 100r/s, Auth: 10r/s
- **CORS** - Configurable allowed origins (no wildcards in production)
- **JWT** - HS256, 30-day expiry, role validation
- **bcrypt** - Password hashing (12 rounds)
- **Input Validation** - Express-validator on all routes
- **Webhook Verification** - Stripe signature, FastSpring HMAC-SHA256
- **Socket.IO CORS** - Restricted to allowed origins
- **Redis SCAN** - Non-blocking cache invalidation (no KEYS)
- **Health Endpoint** - `/health` for load balancer checks

## 🧪 Testing & Quality

```bash
# Run server tests
cd server && npm test

# Run client tests
cd client && npm test

# Lint
cd client && npm run lint

# Type check (if TypeScript)
# cd client && npx tsc --noEmit
```

## 📝 Scripts

### Root
| Command | Description |
|---------|-------------|
| `npm run dev` | **Unified dev** - runs client + server concurrently |
| `npm run dev:server` | Backend only (nodemon) |
| `npm run dev:client` | Frontend only (Vite) |
| `npm run build` | Production build client |
| `npm run start` | Production server |

### Server
| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server with nodemon |
| `npm start` | Start production server |
| `npm run tunnel` | Localtunnel for webhook testing |

### Client
| Command | Description |
|---------|-------------|
| `npm run dev` | Start Vite dev server (HMR) |
| `npm run build` | Build for production (code-split, minified) |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint |

## 📊 Performance Characteristics

| Metric | Value |
|--------|-------|
| MongoDB Documents | 70,735,974 (contacts_v5: 61M) |
| DB Size (disk) | ~88 GB (compressed) |
| Index Size | ~20 GB |
| Redis Cache TTL | Search: 120s, Count: 120s, Saved IDs: 60s |
| Search Timeout | Stage 1: 5s, Stage 2: 60s, Count: 15s |
| Batch Size | 25 initial, auto-load up to 100 |
| Frontend Bundle | ~800 KB JS (gzipped: ~200 KB) |
| CSS Bundle | ~120 KB (gzipped: ~19 KB) |

## 📈 Key Optimizations Applied

1. **Frontend**: Code splitting (manualChunks), React.lazy + Suspense, esbuild minify, CSS code split
2. **Backend**: Startup race fix, health endpoint, reduced socketTimeoutMS (300s→30s)
3. **Search**: COUNT_TIMEOUT_MS 3s→15s, Redis TTL reductions, SCAN instead of KEYS
4. **Database**: Compound indexes for common filter combos (country+title+seniority+emailStatus)
5. **Infrastructure**: Nginx gzip, caching, rate limiting, security headers, PM2 cluster mode
6. **Real-time**: Socket.IO CORS restricted, Redis adapter for clustering

## 🤝 Contributing

1. Fork the repository
2. Create feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

### Code Style
- ESLint + Prettier configured
- Follow existing patterns
- Write meaningful commit messages (conventional commits)
- Update documentation for new features

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [React](https://react.dev/)
- [Express.js](https://expressjs.com/)
- [MongoDB](https://www.mongodb.com/)
- [TailwindCSS](https://tailwindcss.com/)
- [TanStack Query](https://tanstack.com/query)
- [Socket.io](https://socket.io/)
- [Vite](https://vitejs.dev/)
- All open-source contributors

## 📞 Support

- **Email**: support@prospct.io
- **Issues**: [GitHub Issues](https://github.com/hasanuzzamanpriyam/Prospect_MERN/issues)
- **Documentation**: [docs/](docs/) folder
- **Voucher API Guide**: [guide.md](guide.md)

---

**Built with ❤️ by the PROSPCT Team**