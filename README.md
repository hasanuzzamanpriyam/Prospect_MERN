# PROSPCT - MERN Stack Prospect Intelligence Platform

A comprehensive B2B prospect intelligence platform built with the MERN stack (MongoDB, Express.js, React, Node.js) featuring advanced search, team collaboration, admin management, and payment integrations.

## 🚀 Features

### Core Features
- **Advanced Search & Filtering** - Search companies/contacts with 30+ filters (technology, revenue, funding, job postings, etc.)
- **Contact & Company Management** - Import, enrich, verify, and export leads
- **Team Collaboration** - Invite team members, role-based access control (owner/admin/member)
- **Lists & Folders** - Organize prospects into custom lists and folders
- **Real-time Updates** - Socket.io powered live notifications and updates

### Authentication & Authorization
- **Multi-provider Auth** - Email/password, Google OAuth, LinkedIn OAuth, Telegram
- **JWT-based Sessions** - Secure access tokens with automatic refresh
- **Role-based Access** - User, Admin, Super Admin roles with granular permissions
- **Team-based Permissions** - Workspace-level access control

### Admin Panel
- **User Management** - View, add, update, delete users and teams
- **Plan Management** - Create/edit pricing plans (Free, Starter, Custom)
- **Subscription & Billing** - View transactions, subscriptions, payment history
- **Settings** - Configure SMTP, payment gateways, OAuth, feature flags
- **Analytics Dashboard** - Revenue, user growth, usage metrics

### Payment Integrations
- **Stripe** - Credit card payments, subscriptions, webhooks
- **FastSpring** - Global payment processing
- **CoinPayments** - Cryptocurrency payments
- **Heleket** - Crypto payment gateway
- **PayPro Global** - Alternative payment processor
- **Vouchers & Coupons** - Discount codes and special deals

### Search & Data
- **Elasticsearch** - Primary search backend with MongoDB fallback
- **Data Enrichment** - Company/contact enrichment via APIs
- **Email Verification** - Bulk and single email verification
- **CSV Import/Export** - Bulk data operations
- **Saved Searches** - Save and reuse complex queries

## 🛠 Tech Stack

### Frontend
| Technology | Version | Purpose |
|------------|---------|---------|
| React | 18.3.1 | UI library |
| Vite | 5.4.1 | Build tool & dev server |
| TailwindCSS | 3.4.10 | Utility-first CSS |
| React Router | 6.26.1 | Client-side routing |
| TanStack Query | 5.51.23 | Server state management |
| Zustand | 4.5.5 | Client state management |
| Socket.io Client | 4.8.3 | Real-time communication |
| Recharts | 3.7.0 | Data visualization |
| Framer Motion | 12.38.0 | Animations |

### Backend
| Technology | Version | Purpose |
|------------|---------|---------|
| Node.js | 18+ | Runtime |
| Express.js | 4.19.2 | Web framework |
| MongoDB | 6.8.0 | Primary database |
| Mongoose | 8.6.1 | ODM |
| Redis | 4.7.0 / ioredis 5.4.1 | Caching & queues |
| Elasticsearch | 8.19.1 | Search engine |
| Bull | 4.16.3 | Job queues |
| Socket.io | 4.8.0 | Real-time server |
| JWT | 9.0.3 | Authentication |
| bcryptjs | 2.4.3 | Password hashing |

### Infrastructure
- **CI/CD**: GitHub Actions
- **Process Manager**: PM2 (production)
- **Reverse Proxy**: Nginx (production)
- **SSL**: Let's Encrypt / Cloudflare

## 📦 Project Structure

```
PROSPCT/
├── client/                 # React frontend
│   ├── public/            # Static assets
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   ├── pages/         # Page components
│   │   ├── hooks/         # Custom React hooks
│   │   ├── services/      # API services
│   │   ├── store/         # Zustand state store
│   │   ├── utils/         # Utility functions
│   │   ├── payment/       # Payment integrations
│   │   ├── App.jsx        # Main app component
│   │   └── main.jsx       # Entry point
│   ├── package.json
│   ├── vite.config.js
│   └── tailwind.config.js
│
├── server/                 # Express backend
│   ├── config/            # Configuration files
│   ├── controllers/       # Route controllers
│   ├── middleware/        # Express middleware
│   ├── models/            # Mongoose models
│   ├── routes/            # API routes
│   ├── services/          # Business logic
│   ├── utils/             # Utility functions
│   ├── scripts/           # Database scripts
│   ├── seeders/           # Database seeders
│   ├── jobs/              # Cron jobs
│   ├── queues/            # Bull job queues
│   ├── server.js          # Entry point
│   └── package.json
│
├── docs/                   # Documentation
├── .github/workflows/      # CI/CD pipelines
├── .gitignore
└── README.md
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- MongoDB 6+
- Redis 7+
- (Optional) Elasticsearch 8+

### Installation

```bash
# Clone repository
git clone https://github.com/hasanuzzamanpriyam/Prospect_MERN.git
cd Prospect_MERN

# Setup MongoDB admin user (run once)
# mongosh
# use admin
# db.createUser({ user: "ProspctAdmin", pwd: "Prospct.io@007", roles: ["root"] })

# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install

# Configure environment variables
# Server
cp ../server/.env.example ../server/.env
# Edit ../server/.env with your values

# Client
cp .env.example .env.local
# Edit .env.local with your values
```

### Environment Variables

#### Server (.env)
```env
# Database
MONGODB_URI=mongodb://ProspctAdmin:Prospct.io@007@127.0.0.1:27017/prospct?authSource=admin

# JWT
JWT_SECRET=your-super-secret-jwt-key-min-32-chars
INVITE_TOKEN_SECRET=your-invite-secret-min-16-chars

# Redis
REDIS_HOST=127.0.0.1
REDIS_PORT=6379
REDIS_PASSWORD=

# Stripe (get from https://dashboard.stripe.com/apikeys)
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# OAuth (get from respective developer consoles)
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
LINKEDIN_CLIENT_ID=...
LINKEDIN_CLIENT_SECRET=...

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:5173
ALLOWED_ORIGINS=http://localhost:5173
```

#### Client (.env.local)
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
- Free & Starter plans
- System settings
- Admin user: `admin@prospct.local` / `Admin@123`
- Test user: `test@prospct.local` / `Test@123`

### Run Development Servers

**Terminal 1 - Backend:**
```bash
cd server
npm run dev
# Runs on http://localhost:4000
```

**Terminal 2 - Frontend:**
```bash
cd client
npm run dev
# Runs on http://localhost:5173
```

### Access the App

| Page | URL | Credentials |
|------|-----|-------------|
| Main App | http://localhost:5173 | - |
| User Login | http://localhost:5173/login | test@prospct.local / Test@123 |
| Admin Login | http://localhost:5173/admin-login | admin@prospct.local / Admin@123 |
| Admin Dashboard | http://localhost:5173/admin/dashboard | Admin credentials |

## 🏗 Production Deployment

### Build Frontend
```bash
cd client
npm run build
# Output in client/dist/
```

### Production Environment Variables
```env
# Server
NODE_ENV=production
MONGODB_URI=mongodb://user:pass@host:port/db?authSource=admin
JWT_SECRET=very-long-random-string-min-64-chars
REDIS_HOST=your-redis-host
STRIPE_SECRET_KEY=sk_live_...
FRONTEND_URL=https://yourdomain.com
ALLOWED_ORIGINS=https://yourdomain.com,https://www.yourdomain.com
```

### Run with PM2
```bash
# Server
cd server
pm2 start server.js --name prospct-api

# Or with ecosystem file
pm2 start ecosystem.config.js
```

### Nginx Configuration
```nginx
server {
    listen 80;
    server_name yourdomain.com;

    # Frontend
    location / {
        root /path/to/client/dist;
        try_files $uri $uri/ /index.html;
    }

    # API
    location /api/ {
        proxy_pass http://localhost:4000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    # WebSocket
    location /socket.io/ {
        proxy_pass http://localhost:4000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
    }
}
```

## 📚 API Documentation

### Base URL
```
Development: http://localhost:4000/api
Production:  https://api.yourdomain.com/api
```

### Authentication Endpoints
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/auth/register` | Register new user |
| POST | `/auth/login` | User login |
| POST | `/auth/adminLogin` | Admin login |
| POST | `/auth/google-auth` | Google OAuth |
| POST | `/auth/linkedin` | LinkedIn OAuth |
| POST | `/auth/verify-token` | Verify access token |
| POST | `/auth/verify-admin-token` | Verify admin token |
| POST | `/auth/forgot-password` | Request password reset |
| POST | `/auth/reset-password` | Reset password |

### User Endpoints
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/users/me` | Get current user |
| GET | `/users` | List users (admin) |
| PUT | `/users/:id` | Update user (admin) |

### Search Endpoints
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/search` | Search companies/contacts |
| GET | `/search/filters` | Get available filters |
| POST | `/saved-searches` | Save a search |
| GET | `/saved-searches` | List saved searches |

### Admin Endpoints
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/admin/users` | List all users |
| GET | `/admin/users/teams` | List all teams |
| GET | `/admin/plans` | List plans |
| POST | `/admin/plans` | Create plan |
| GET | `/admin/settings` | Get system settings |
| PUT | `/admin/settings` | Update system settings |

## 🔐 Security Features

- **Helmet.js** - Security headers
- **Rate Limiting** - Express-rate-limit (general, auth, password reset)
- **CORS** - Configurable allowed origins
- **JWT** - Secure token-based auth with rotation
- **bcrypt** - Password hashing (12 rounds)
- **Input Validation** - Express-validator on all routes
- **Webhook Verification** - Stripe signature validation

## 🧪 Testing

```bash
# Run server tests
cd server
npm test

# Run client tests
cd client
npm test
```

## 📝 Scripts

### Server
| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server with nodemon |
| `npm start` | Start production server |
| `npm run seed` | Run database seeder |

### Client
| Command | Description |
|---------|-------------|
| `npm run dev` | Start Vite dev server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint |

## 🤝 Contributing

1. Fork the repository
2. Create feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

### Code Style
- ESLint + Prettier configured
- Follow existing patterns
- Write meaningful commit messages
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
- All open-source contributors

## 📞 Support

- **Email**: support@prospct.com
- **Issues**: [GitHub Issues](https://github.com/hasanuzzamanpriyam/Prospect_MERN/issues)
- **Documentation**: [Wiki](https://github.com/hasanuzzamanpriyam/Prospect_MERN/wiki)

---

**Built with ❤️ by the PROSPCT Team**