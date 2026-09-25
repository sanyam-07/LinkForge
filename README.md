# 🔗 LinkForge — Enterprise MERN Stack URL Shortener, AI Assistant & Real-Time Analytics Platform

> **"Turn long links into simple, shareable, intelligent URLs."**

LinkForge is a full-featured, enterprise-grade URL Shortener platform built with the **MERN Stack** (MongoDB, Express.js, React, Node.js) and extended with **Redis Caching**, **Socket.IO Real-Time Streaming**, **BullMQ Job Queues**, **OpenAI GPT-4o Link Intelligence**, and **Swagger OpenAPI Documentation**.

---

## 🌟 Key Features

### ⚡ Core URL Management
- **Instant URL Shortening**: Generates unique, 6-character URL-safe base62 codes.
- **Custom Aliases**: User-defined custom branded short links (e.g. `linkforge/mybrand`).
- **Automated Link Expiration**: Expiration schedules (1 day, 7 days, 30 days, custom date, or never).
- **QR Code Generation**: Client-side QR code generation with instant PNG download.
- **Web Share API**: One-click native sharing on mobile and desktop devices.
- **Dark & Light Mode**: Fluid visual identity with theme persistence.

### 🚀 Enterprise Extensions
- 🔴 **Redis Speed Cache**: High-performance caching layer (`url:<shortCode>`) that bypasses MongoDB on redirects, with graceful MongoDB fallback if Redis is offline.
- ⚡ **Socket.IO Real-Time Updates**: Instant live click notifications broadcasted to user dashboards and link analytics rooms (`analytics:update`, `click:recorded`).
- 🐂 **BullMQ Background Lifecycle Queue**: Asynchronous worker thread processing background link expiration and scheduled activation jobs.
- 🧠 **OpenAI GPT-4o AI Link Intelligence**:
  - **AI Link Assistant**: Analyzes destinations, predicts clickworthiness, and suggests optimized aliases and tags.
  - **AI Analytics Insights**: Automated diagnostic breakdowns of traffic patterns, top devices, and geographic distributions.
  - **AI Campaign Generator**: Generates custom UTM parameter strategies and audience targeting advice.
- 📄 **Interactive Swagger / OpenAPI 3.0 Documentation**: Live API test bench accessible at `/api-docs`.
- 🛡️ **API Versioning & Rate Limiting**: Endpoint aliasing under `/api/v1/*` and strict AI rate limiting (`aiLimiter`).

---

## 🛠️ Technology Stack

### Frontend
- **Framework**: React 18 + Vite
- **Routing**: React Router DOM v6
- **Styling**: Tailwind CSS v3 + Custom CSS Variables
- **Icons**: Lucide React
- **Charts**: Recharts
- **Animations**: Framer Motion
- **Real-Time Client**: Socket.IO Client
- **QR Code**: `qrcode.react`
- **HTTP Client**: Axios (Centralized instance with JWT interceptors)

### Backend
- **Runtime**: Node.js & Express.js
- **Database**: MongoDB & Mongoose ORM
- **Cache & Queue Storage**: Redis & `ioredis`
- **Background Jobs**: BullMQ (`url-lifecycle-queue`)
- **Real-Time Engine**: Socket.IO Server
- **AI Integration**: Official OpenAI Node SDK (`openai`)
- **Documentation**: `swagger-ui-express` & `swagger-jsdoc`
- **Auth & Security**: JWT, `bcryptjs`, `helmet`, `cors`, `express-rate-limit`

---

## 📂 Project Structure

```
url-shortener/
├── client/
│   ├── src/
│   │   ├── components/       # UI components (Navbar, Footer, UrlForm, UrlTable, QrCodeModal, etc.)
│   │   ├── pages/            # Views (Home, Dashboard, Analytics, Login, Register, ExpiredLink, etc.)
│   │   ├── services/         # API modules (api.js, authService, urlService, analyticsService, aiService, socket.js)
│   │   ├── context/          # AuthContext & ThemeContext
│   │   ├── hooks/            # Custom React hooks (useAuth, useTheme)
│   │   ├── utils/            # Formatters and constants
│   │   ├── App.jsx           # Routing configuration
│   │   └── main.jsx          # App entry point
│   ├── package.json
│   └── vite.config.js
│
├── server/
│   ├── config/               # Database (db.js) & Swagger spec (swagger.js)
│   ├── controllers/          # Business logic (authController, urlController, analyticsController, aiController)
│   ├── middleware/           # Auth, error, and rate-limit middlewares
│   ├── models/               # Mongoose schemas (User, Url, Click)
│   ├── queues/               # BullMQ lifecycle queue setup (urlQueue.js)
│   ├── workers/              # Standalone job worker process (urlWorker.js)
│   ├── routes/               # Routes (authRoutes, urlRoutes, analyticsRoutes, aiRoutes)
│   ├── services/             # Redis client wrapper (redisService.js)
│   ├── socket.js             # Socket.IO initialization & event emitters
│   ├── seed/                 # DB seed script (seed.js)
│   ├── server.js             # Main HTTP + Socket.IO server entrypoint
│   ├── package.json
│   └── .env.example          # Environment variable template
│
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites
- **Node.js**: v18+ installed
- **MongoDB**: Local MongoDB instance or MongoDB Atlas connection string
- **Redis Server** *(Optional)*: Recommended for production caching & BullMQ workers. If offline, the application safely degrades to MongoDB.
- **OpenAI API Key** *(Optional)*: Required for AI Assistant & Analytics Insights features.

---

### 1. Environment Configuration

Create a `.env` file in the `server/` directory:

```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/linkforge
JWT_SECRET=your_jwt_secret_key_here
BASE_URL=http://localhost:5000
CLIENT_URL=http://localhost:5173

# Optional Enterprise Extensions
REDIS_URL=redis://127.0.0.1:6379
OPENAI_API_KEY=your_openai_api_key_here
```

---

### 2. Backend Installation & Database Seeding

Navigate to `server/`:

```bash
cd server
npm install
```

Seed initial demo accounts and sample link analytics:

```bash
npm run seed
```

Start the Express + Socket.IO server:

```bash
npm run dev
```
*Server runs at `http://localhost:5000`.*
*Swagger API documentation available at `http://localhost:5000/api-docs`.*

*(Optional)* Run the BullMQ background job worker in a separate terminal:

```bash
npm run worker
```

---

### 3. Frontend Installation

In a new terminal window, navigate to `client/`:

```bash
cd client
npm install
npm run dev
```
*Frontend runs at `http://localhost:5173`.*

---

## 🔑 Demo Account Credentials

Log in directly using the pre-seeded account:

- **Email**: `demo@linkforge.com`
- **Password**: `password123`

---

## 📡 API Reference & Versioning

All endpoints support versioned access via `/api/v1/*` in addition to standard `/api/*`. Full interactive testing is available via Swagger at `/api-docs`.

### Authentication
| Method | Endpoint | Description | Access |
|---|---|---|---|
| `POST` | `/api/v1/auth/register` | Register a new user | Public |
| `POST` | `/api/v1/auth/login` | Authenticate user & receive JWT | Public |
| `GET` | `/api/v1/auth/me` | Fetch current user profile | Private |

### URL Management
| Method | Endpoint | Description | Access |
|---|---|---|---|
| `POST` | `/api/v1/urls` | Shorten a long URL | Public / Auth |
| `GET` | `/api/v1/urls` | List all URLs for authenticated user | Private |
| `PUT` | `/api/v1/urls/:id` | Update destination, expiration, or status | Private |
| `DELETE` | `/api/v1/urls/:id` | Delete short URL and click history | Private |

### AI Link Intelligence
| Method | Endpoint | Description | Access |
|---|---|---|---|
| `POST` | `/api/v1/ai/analyze-url` | Generate AI title, alias, and tags | Private |
| `POST` | `/api/v1/ai/analytics-insights` | Generate diagnostic traffic insights | Private |
| `POST` | `/api/v1/ai/suggest-campaign` | Generate UTM campaign strategy | Private |

---

## 📜 License

Distributed under the MIT License.
