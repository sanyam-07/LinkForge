# 🔗 LinkForge — Production-Oriented MERN Stack URL Shortener & Real-Time Analytics Platform

> **"Turn long links into shareable, trackable, intelligent URLs."**

LinkForge is a full-stack, production-oriented URL shortener and link management platform built with the **MERN Stack** (MongoDB, Express.js, React, Node.js). It provides instant link shortening, custom alias branding, automated link expiration, real-time Socket.IO click analytics, Redis caching with graceful MongoDB fallback, BullMQ background lifecycle job processing, OpenAI-powered link intelligence, and interactive Swagger/OpenAPI documentation.

---

## 🏛️ System Architecture

```
                               ┌────────────────────────┐
                               │   React / Vite Client  │
                               │   (Dashboard & UI)     │
                               └───────────┬────────────┘
                                           │
                                 HTTP / WebSockets
                                           │
                                           ▼
                               ┌────────────────────────┐
                               │  Express.js REST API   │
                               │  & Socket.IO Engine    │
                               └───────────┬────────────┘
                                           │
         ┌──────────────────┬──────────────┼──────────────┬──────────────────┐
         │                  │              │              │                  │
         ▼                  ▼              ▼              ▼                  ▼
┌─────────────────┐ ┌──────────────┐ ┌──────────┐ ┌──────────────┐ ┌──────────────────┐
│  MongoDB Store  │ │ Redis Cache  │ │ Socket.IO│ │ BullMQ Queue │ │ OpenAI API (SDK) │
│  (Users/URLs/   │ │ (url:<code >)│ │ Realtime │ │ (Lifecycle   │ │ (URL Analysis &  │
│   Clicks)       │ │  + Fallback  │ │ Streaming│ │   Worker)    │ │   AI Insights)   │
└─────────────────┘ └──────────────┘ └──────────┘ └──────────────┘ └──────────────────┘
```

### Component Roles

- **React/Vite Frontend**: Responsive SaaS user interface supporting light/dark theme persistence, real-time live click updates via Socket.IO, interactive analytics charts with Recharts, QR code rendering, and AI Assistant drawers.
- **Express.js REST API**: Handles user authentication, URL shortening, custom alias collisions, analytics retrieval, rate limiting, and HTTP redirections.
- **MongoDB & Mongoose**: Primary database storing user profiles, short URL records, and detailed click event logs.
- **Redis & ioredis**: High-performance caching layer (`url:<shortCode>`) that bypasses database reads on link redirection. Automatically falls back to MongoDB when Redis is unavailable.
- **Socket.IO Engine**: Real-time event streaming server broadcasting live click events (`click:recorded`) to user dashboards and link analytics rooms (`link:${shortCode}`).
- **BullMQ & Worker**: Asynchronous queue processor (`url-lifecycle-queue`) executing scheduled URL expiration and activation background tasks via `server/workers/urlWorker.js`.
- **OpenAI Integration**: Server-side API integration (`gpt-4o-mini`) offering AI-generated alias suggestions, destination category tagging, click analytics summaries, and marketing campaign UTM parameters.

---

## 🌟 Features Overview

- ⚡ **Instant URL Shortening**: Generates unique, 6-character URL-safe base62 codes.
- 🎨 **Custom Aliases**: Allows user-defined custom branded short links (e.g. `linkforge/mybrand`).
- ⏳ **Automated Expiration**: Supports expiration options (1 day, 7 days, 30 days, custom date, or never).
- 🔐 **Real User Authentication**: JWT-based authentication with bcrypt password hashing and token verification.
- 🛡️ **Multi-Tenant User Data Isolation**: Strict user-level URL ownership and authorization checks preventing cross-user data access.
- ⚡ **Real-Time Click Analytics**: Instant Socket.IO event broadcasting to dashboards and link-specific analytics pages.
- 🔴 **Redis Speed Cache & Fallback**: Fast cache reads on redirect with seamless MongoDB fallback when Redis is offline.
- 🐂 **BullMQ Lifecycle Queue**: Background worker process managing delayed link activation and expiration jobs.
- 🧠 **OpenAI Link Assistant & Insights**: Server-side AI endpoint suite providing automated URL analysis, traffic insights, and UTM campaign strategies.
- 📱 **QR Code Generator & Web Share API**: High-resolution QR code rendering with PNG downloads and native device sharing.
- 📄 **Swagger / OpenAPI Documentation**: Interactive API documentation test bench accessible at `/api-docs`.
- 🛡️ **Production Security**: Helmet HTTP headers, CORS policies, centralized error handling, and express rate limiting.

---

## 🛠️ Technology Stack

### Frontend
| Technology | Version | Purpose |
|---|---|---|
| **React** | `^18.3.1` | UI Library |
| **Vite** | `^6.0.7` | Frontend Build Tooling & HMR |
| **React Router DOM** | `^6.28.1` | Client-Side SPA Routing |
| **Tailwind CSS** | `^3.4.17` | Utility-First CSS Framework |
| **Axios** | `^1.7.9` | HTTP Client with Interceptors |
| **Recharts** | `^2.15.0` | Analytics Charts & Data Visualization |
| **Framer Motion** | `^11.15.0` | Page Animations & UI Transitions |
| **Lucide React** | `^0.469.0` | Icon Package |
| **Socket.IO Client** | `^4.8.1` | WebSockets Client |
| **qrcode.react** | `^4.2.0` | Client-Side QR Code Generator |

### Backend
| Technology | Version | Purpose |
|---|---|---|
| **Node.js** | `v18+` | Server Runtime |
| **Express.js** | `^4.21.2` | Web Framework |
| **MongoDB & Mongoose** | `^8.9.3` | Database & ORM |
| **bcryptjs** | `^2.4.3` | Password Hashing |
| **jsonwebtoken** | `^9.0.2` | Authentication Tokens |
| **ioredis** | `^5.4.2` | Redis Client |
| **Socket.IO** | `^4.8.1` | Real-Time Engine |
| **BullMQ** | `^5.34.4` | Background Job Queue |
| **OpenAI SDK** | `^4.77.0` | Official OpenAI Node Library |
| **Swagger UI Express & JSDoc** | `^5.0.1` / `^6.2.8` | OpenAPI Documentation |
| **Helmet** | `^8.0.0` | HTTP Security Headers |
| **CORS** | `^2.8.5` | Cross-Origin Resource Sharing |
| **express-rate-limit** | `^7.5.0` | Request Rate Limiting |
| **express-useragent** | `^1.0.15` | User Agent Parsing |
| **validator** | `^13.12.0` | String & URL Validation |

---

## 🔐 Real User Authentication & Authorization

LinkForge relies on real user authentication backed by MongoDB and JSON Web Tokens (JWT).

- **User Registration (`POST /api/auth/register`)**: Validates name presence, email format regex, email uniqueness, and password length ($\ge 6$ characters). Passwords are securely hashed with `bcryptjs` (10 salt rounds) before saving.
- **User Login (`POST /api/auth/login`)**: Authenticates against MongoDB user credentials using `bcrypt.compare` and issues a signed JWT token (`30d` expiration).
- **Current User Profile (`GET /api/auth/me`)**: Returns the authenticated user's profile details (`_id`, `name`, `email`, `createdAt`).
- **JWT Secret Security**: Enforced via `server/utils/getJwtSecret.js`. In production (`NODE_ENV === 'production'`), if `JWT_SECRET` is omitted from environment variables, the server throws a fatal configuration error and halts startup.
- **User Ownership & Isolation**: When creating a URL (`POST /api/urls`), the backend assigns `user = req.user._id` directly from the validated JWT token rather than trusting a `userId` supplied in the request body. All URL operations (`GET`, `PUT`, `DELETE`, `Analytics`) check ownership (`url.user.toString() === req.user._id.toString()`) and reject unauthorized access with an HTTP `403 Forbidden` response.

---

## 🔗 Core URL Management Features

- **Base62 Short Code Generation**: Automatically creates non-sequential, 6-character short codes using custom cryptographic random bytes.
- **Custom Branded Aliases**: Supports user-defined custom aliases (e.g. `linkforge/mybrand`) with character validation (3-20 characters, alphanumeric, hyphens, underscores) and system keyword collision prevention.
- **Expiration Policies**: Allows links to expire automatically after 1 day, 7 days, 30 days, on a custom date, or remain active indefinitely. Expired links redirect visitors to an informative expired status page (`/expired?reason=expired`).
- **URL Lifecycle Controls**: Users can toggle URL active status (`isActive`) at any time to temporarily enable or disable redirection (`/expired?reason=disabled`).
- **QR Code Generator**: Displays high-resolution QR codes inside a modal component with single-click PNG download capabilities.
- **Web Share API**: Native mobile/desktop link sharing via `navigator.share()` with fallback clipboard copy functionality.

---

## ⚡ Real-Time Click Analytics

Real-time analytics updates are powered by Socket.IO without requiring page refreshes.

- **Global Event Broadcasting**: When a short URL is clicked (`GET /:shortCode`), the backend records click metrics and emits a `click:recorded` event with `{ shortCode, urlId, clicks, timestamp, device, browser, operatingSystem, referrer }`.
- **Dashboard Synchronization**: The `Dashboard.jsx` socket listener processes `click:recorded` events and updates the target URL's click count in React state, recalculating total workspace clicks instantly.
- **Room-Based Link Streaming**: When a user views an analytics page (`/analytics/:shortCode`), the frontend joins the specific room `link:${shortCode}` using `socket.emit('join:link', shortCode)`. The server emits `analytics:update` to that room specifically.
- **Socket Liveness Indicator**: Both Dashboard and Analytics pages monitor socket state (`connect`, `disconnect`, `connect_error`) to display an accurate `● LIVE STREAM` / `○ OFFLINE` status badge.

---

## 🔴 Redis Speed Cache & MongoDB Fallback

- **Redirect Caching**: Short URL mappings (`url:<shortCode>`) are cached in Redis (`ioredis`) for 1 hour. On redirection, the server checks Redis first to bypass database queries.
- **Cache Invalidation**: Updating or deleting a URL immediately purges the corresponding Redis cache key via `delCache('url:<shortCode>')`.
- **Automatic Fallback**: `server/services/redisService.js` initializes Redis lazily. If a Redis server is offline or unavailable, the application logs a warning and seamlessly falls back to MongoDB for all reads and writes without crashing or throwing errors.

---

## 🐂 BullMQ Background Jobs & Worker

- **Background Lifecycle Queue**: LinkForge uses BullMQ (`url-lifecycle-queue`) to offload delayed URL state changes.
- **Scheduled Expiration & Activation**: When a link is created or updated with an expiration schedule, `scheduleUrlExpiration` enqueues a delayed job in BullMQ.
- **Standalone Worker Process**: Run via `server/workers/urlWorker.js` (`npm run worker`), the worker process handles `expire-url-job` and `activate-url-job` tasks asynchronously, updating MongoDB records and invalidating Redis caches when expiration timers trigger.

---

## 🧠 OpenAI Link Assistant & AI Analytics Engine

Server-side AI features are powered by OpenAI (`gpt-4o-mini`) using the official `openai` SDK. `OPENAI_API_KEY` is maintained strictly on the backend.

- **URL Analysis (`POST /api/ai/analyze-url`)**: Analyzes long destination URLs to generate an optimized short alias, destination category, content tags, description, and campaign title.
- **AI Analytics Insights (`POST /api/ai/analytics-insights`)**: Analyzes calculated click metrics (today, week, month, device/browser/OS distribution) to produce a concise executive summary, key findings, and strategic recommendations.
- **Campaign UTM Generator (`POST /api/ai/suggest-campaign`)**: Generates marketing campaign metadata, suggested aliases, tags, and UTM parameters (`utm_source`, `utm_medium`, `utm_campaign`) based on a target marketing goal.
- **Service Resilience**: If `OPENAI_API_KEY` is missing from environment variables, AI endpoints respond with an HTTP `503 Service Unavailable` message without affecting non-AI features.

---

## 📄 Swagger / OpenAPI Documentation

- **Interactive API Documentation**: Live Swagger UI is hosted at **`/api-docs`** using `swagger-ui-express` and `swagger-jsdoc`.
- **API Versioning**: Endpoints are accessible via standard `/api/*` as well as versioned `/api/v1/*` route aliases.

---

## 📡 API Reference

### Authentication
| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `POST` | `/api/v1/auth/register` | Register a new user account | Public |
| `POST` | `/api/v1/auth/login` | Authenticate user & receive JWT token | Public |
| `GET` | `/api/v1/auth/me` | Fetch currently authenticated user profile | Private (`Bearer JWT`) |
| `POST` | `/api/v1/auth/logout` | Logout user | Public |

### URL Management
| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `POST` | `/api/v1/urls` | Shorten a long URL (assigns `req.user._id`) | Optional Auth |
| `GET` | `/api/v1/urls` | List all URLs owned by authenticated user | Private (`Bearer JWT`) |
| `GET` | `/api/v1/urls/:id` | Get single URL details (ownership checked) | Private (`Bearer JWT`) |
| `PUT` | `/api/v1/urls/:id` | Update URL destination, expiration, or status | Private (`Bearer JWT`) |
| `DELETE` | `/api/v1/urls/:id` | Delete URL and related click logs | Private (`Bearer JWT`) |

### Redirection & Analytics
| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `GET` | `/:shortCode` | Redirect to original URL & log click metrics | Public |
| `GET` | `/api/v1/analytics/:shortCode` | Fetch click analytics breakdown (ownership checked) | Private (`Bearer JWT`) |

### AI Link Intelligence
| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `POST` | `/api/v1/ai/analyze-url` | Generate AI title, alias, and tags | Private (`Bearer JWT`) |
| `POST` | `/api/v1/ai/analytics-insights` | Generate AI diagnostic traffic report | Private (`Bearer JWT`) |
| `POST` | `/api/v1/ai/suggest-campaign` | Generate AI UTM campaign parameters | Private (`Bearer JWT`) |

---

## 🛡️ Security & Rate Limiting

- **JWT Token Verification**: Authenticates API requests using signed JWT tokens stored securely on the client.
- **bcrypt Password Hashing**: Hashes passwords with 10 salt rounds before storage.
- **Helmet HTTP Headers**: Configures security headers for cross-origin resource protection.
- **CORS Policies**: Explicitly restricts cross-origin access to configured frontend domain origins (`CLIENT_URL`).
- **Rate Limiting (`express-rate-limit`)**:
  - `authLimiter`: Limits authentication attempts (15 requests per 15 minutes).
  - `urlCreateLimiter`: Limits URL creation requests (30 requests per 15 minutes).
  - `aiLimiter`: Limits OpenAI endpoint usage (10 requests per 15 minutes).
- **Input Validation**: Sanitizes and validates URLs using `validator` and custom regex rules.

---

## 🔑 Environment Variables

### Server Configuration (`server/.env`)
```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/linkforge
JWT_SECRET=your_secure_jwt_secret_key_here
BASE_URL=http://localhost:5000
CLIENT_URL=http://localhost:5173

# Optional Infrastructure Extensions
REDIS_URL=redis://127.0.0.1:6379
OPENAI_API_KEY=your_openai_api_key_here
```

### Client Configuration (`client/.env`)
```env
VITE_API_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000
```

---

## 📂 Project Structure

```
url-shortener/
├── client/
│   ├── src/
│   │   ├── components/       # Reusable UI components (Navbar, Footer, UrlForm, UrlTable, QrCodeModal, etc.)
│   │   ├── pages/            # View pages (Home, Dashboard, Analytics, Login, Register, ExpiredLink, NotFound)
│   │   ├── services/         # Client services (api.js, authService, urlService, analyticsService, aiService, socket.js)
│   │   ├── context/          # AuthContext & ThemeContext
│   │   ├── hooks/            # Custom hooks (useAuth, useTheme)
│   │   ├── utils/            # Formatters and helper functions
│   │   ├── App.jsx           # Client router configuration
│   │   └── main.jsx          # React app entry point
│   ├── .env.example
│   ├── package.json
│   └── vite.config.js
│
├── server/
│   ├── config/               # Database setup (db.js) & Swagger spec (swagger.js)
│   ├── controllers/          # Route logic (authController, urlController, analyticsController, aiController)
│   ├── middleware/           # Auth, error, and rate-limit middlewares
│   ├── models/               # Mongoose schemas (User, Url, Click)
│   ├── queues/               # BullMQ lifecycle queue (urlQueue.js)
│   ├── workers/              # Standalone background worker process (urlWorker.js)
│   ├── routes/               # Express API routes (authRoutes, urlRoutes, analyticsRoutes, aiRoutes)
│   ├── services/             # Redis client & caching functions (redisService.js)
│   ├── socket.js             # Socket.IO initialization & event emitters
│   ├── utils/                # Short code generator, URL validator, JWT secret helper
│   ├── seed/                 # Development seed script (seed.js)
│   ├── test-user-isolation.js# Multi-tenant user data isolation test
│   ├── server.js             # Main HTTP + Socket.IO server entry point
│   ├── .env.example
│   └── package.json
│
├── .gitignore
└── README.md
```

---

## 🚀 Local Development Setup

### Prerequisites
- **Node.js**: `v18+` installed
- **MongoDB**: Local MongoDB instance (`mongodb://127.0.0.1:27017`) or MongoDB Atlas URI
- **Redis** *(Optional)*: Installed locally or via Docker. Required for Redis caching and BullMQ background jobs.

---

### Step-by-Step Installation

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/sanyam-07/LinkForge.git
   cd LinkForge
   ```

2. **Configure Environment Variables**:
   - Create `server/.env` using `server/.env.example` as a template.
   - Create `client/.env` using `client/.env.example` as a template.

3. **Install Server Dependencies**:
   ```bash
   cd server
   npm install
   ```

4. **Install Client Dependencies**:
   ```bash
   cd ../client
   npm install
   ```

5. **Start MongoDB**: Ensure your local MongoDB daemon is running or update `MONGO_URI` in `server/.env`.

6. **Start Backend Server**:
   ```bash
   cd ../server
   npm run dev
   ```
   *Express + Socket.IO server will start on `http://localhost:5000`.*
   *Swagger API documentation will be available at `http://localhost:5000/api-docs`.*

7. **(Optional) Run BullMQ Background Worker**:
   In a separate terminal window:
   ```bash
   cd server
   npm run worker
   ```

8. **Start Frontend Client**:
   In a separate terminal window:
   ```bash
   cd client
   npm run dev
   ```
   *Vite development server will open at `http://localhost:5173`.*

---

## 🌱 Database Seeding (Development Only)

An optional development seed script is included to populate initial sample URLs and click analytics for testing.

- **Run Seed Script**:
  ```bash
  cd server
  npm run seed
  ```
- **Note**: The seed script is strictly intended for local development/testing. It is **not** executed automatically on server startup (`npm run dev`) and is not required for normal user registration and login.

---

## 🧪 Automated Testing

### Multi-Tenant User Data Isolation Test

LinkForge includes a dedicated automated user data isolation test script to verify cross-user data authorization security.

- **Run Isolation Test**:
  ```bash
  cd server
  node test-user-isolation.js
  ```
- **Test Actions**:
  1. Registers two distinct test accounts (`User A` and `User B`).
  2. Creates `Link A` owned by `User A` and `Link B` owned by `User B`.
  3. Verifies that `User A` queries return strictly `Link A`.
  4. Verifies that `User B` queries return strictly `Link B`.
  5. Simulates modification attempts by `User A` on `Link B` and verifies HTTP `403 Forbidden` rejection.
  6. Cleans up test records upon completion.

---

## 🌐 Production Deployment Guidance

*Note: This section outlines the recommended production deployment architecture for LinkForge.*

### Recommended Hosting Architecture

- **Frontend (React / Vite)**: Deploy client build artifacts (`client/dist`) to a static web host or CDN (e.g. Vercel, Netlify, Cloudflare Pages).
- **Backend (Node.js / Express / Socket.IO)**: Deploy the Node server to a Web Service container environment (e.g. Render, Railway, AWS ECS, Heroku) with persistent WebSockets support.
- **Database (MongoDB)**: Managed database cluster via MongoDB Atlas.
- **Cache & Queue (Redis)**: Managed Redis instance via Redis Enterprise Cloud, Upstash, or AWS ElastiCache.
- **Background Worker**: Run `npm run worker` as a separate background process or worker dyno connected to the shared Redis instance.
- **AI Integration**: Set `OPENAI_API_KEY` on the backend server environment variables.

---

## 🌟 Project Highlights

- **Full-Stack MERN Architecture**: Integrated React 18 SPA frontend with Node.js/Express REST API and MongoDB storage.
- **Real User Auth & Authorization**: Secure JWT authentication, bcrypt password hashing, and user-level data isolation.
- **Real-Time Click Analytics**: Socket.IO event streaming broadcasting live clicks to user dashboards and link rooms.
- **Performance Caching with Resilience**: Fast Redis cache lookups (`ioredis`) with seamless, automatic fallback to MongoDB when Redis is offline.
- **Asynchronous Background Processing**: BullMQ worker process executing scheduled URL activation and expiration jobs.
- **AI Link Intelligence**: Server-side OpenAI SDK integration providing automated URL analysis, click insights, and campaign UTM suggestions.
- **Developer Experience & OpenAPI Specs**: Self-documenting API via Swagger UI (`/api-docs`) and versioned route aliases (`/api/v1/*`).

---

## 🔮 Future Enhancements

- [ ] **Custom Domains**: Allow users to connect custom branded domains for short URLs.
- [ ] **Team & Workspace Collaboration**: Multi-user team organizations with role-based permissions (Admin, Editor, Viewer).
- [ ] **Analytics Data Export**: Export click log history to CSV, JSON, and PDF reports.
- [ ] **OAuth2 Social Logins**: Login integration with GitHub, Google, and LinkedIn accounts.
- [ ] **Advanced GeoIP Mapping**: Map visitor IP addresses to country/city level for geographical distribution charts.
- [ ] **Automated CI/CD Pipeline**: GitHub Actions workflows for automated testing and deployment.

---

## 👤 Author

**Sanyam Jain**
- GitHub: [https://github.com/sanyam-07](https://github.com/sanyam-07)

---

## 📜 License

This project is licensed under the **MIT License**.
