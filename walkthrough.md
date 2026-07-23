# Pure Botànica — Project Walkthrough

> A bilingual (Arabic / English) herbal gummies e-commerce and assessment platform for children's wellness.

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Monorepo Architecture](#2-monorepo-architecture)
3. [Shared Libraries (`lib/`)](#3-shared-libraries-lib)
4. [Backend — API Server (`artifacts/api-server`)](#4-backend--api-server)
5. [Frontend — Pure Botànica (`artifacts/pure-botanica`)](#5-frontend--pure-botànica)
6. [Database Layer — MongoDB](#6-database-layer--mongodb)
7. [Assessment Scoring Algorithm](#7-assessment-scoring-algorithm)
8. [Local Development Setup](#8-local-development-setup)
9. [MongoDB Setup (Atlas)](#9-mongodb-setup-atlas)
10. [Seeding Existing Data](#10-seeding-existing-data)
11. [Vercel Deployment](#11-vercel-deployment)
12. [Environment Variables Reference](#12-environment-variables-reference)
13. [Project File Map](#13-project-file-map)

---

## 1. Project Overview

**Pure Botànica** is an online storefront for two herbal glycerite gummy products:

| Product | Theme | Purpose |
|---|---|---|
| **Focus Gummies** | Strawberry / Red | Calm, centred concentration for study time |
| **Mineral Gummies** | Green | Physical recovery, restful sleep, healthy growth |

The app includes a multi-step **child wellness assessment** that scores a parent's answers and recommends the most suitable product (Focus, Mineral, or Both). An **admin dashboard** lets the store owner review all submitted assessments, view analytics, and export data as CSV.

---

## 2. Monorepo Architecture

The project is an **npm workspace monorepo** with two deployment targets and four shared libraries.

```
Herbal-Hub/                        ← workspace root
├── package.json                   ← npm workspaces config
├── tsconfig.base.json             ← shared TypeScript base
│
├── artifacts/                     ← deployable apps
│   ├── api-server/                ← 🖥️  Express backend  →  Vercel (Node.js)
│   └── pure-botanica/             ← 🌐  React frontend   →  Vercel (Vite)
│
├── lib/                           ← shared internal packages
│   ├── db/                        ← MongoDB/Mongoose data layer
│   ├── api-zod/                   ← Zod schemas for all API contracts
│   ├── api-client-react/          ← TanStack Query hooks for the frontend
│   └── api-spec/                  ← OpenAPI spec + Orval code-gen config
│
└── scripts/                       ← workspace-level utility scripts
```

### Workspace package names

| Package | Name |
|---|---|
| `artifacts/api-server` | `@workspace/api-server` |
| `artifacts/pure-botanica` | `@workspace/pure-botanica` |
| `lib/db` | `@workspace/db` |
| `lib/api-zod` | `@workspace/api-zod` |
| `lib/api-client-react` | `@workspace/api-client-react` |
| `lib/api-spec` | `@workspace/api-spec` |
| `scripts` | `@workspace/scripts` |

---

## 3. Shared Libraries (`lib/`)

### `lib/db` — Database Layer

Exposes all MongoDB read/write operations via Mongoose. The backend imports this package directly; no ORM migrations are needed.

**Key exports:**

```ts
connectDB()                          // lazy-connect to MongoDB Atlas
getProducts()                        // fetch all products (auto-seeds defaults)
getAllAssessments()                   // all assessments, unordered
insertAssessment(input)              // create + auto-increment numeric id
getAssessmentById(id)                // single lookup
deleteAssessmentById(id)             // delete by numeric id
getAllAssessmentsSortedByDateDesc()  // for CSV export
listAssessments({ search, recommendation, page, limit })  // paginated admin list
```

**MongoDB collections:**

| Collection | Description |
|---|---|
| `products` | 2 product documents (seeded automatically on first run) |
| `assessments` | One document per submitted assessment form |

---

### `lib/api-zod` — API Contracts

All request bodies, response shapes, and URL params are defined here as **Zod schemas**. Both the backend (validation) and the frontend (type inference) depend on this package.

Notable schemas:
- `SubmitAssessmentBody` / `SubmitAssessmentResponse`
- `GetAssessmentParams` / `GetAssessmentResponse`
- `AdminLoginBody` / `AdminLoginResponse`
- `ListAdminAssessmentsQueryParams` / `ListAdminAssessmentsResponse`
- `GetAdminStatsResponse`
- `HealthCheckResponse`

---

### `lib/api-client-react` — React Query Hooks

Pre-built TanStack Query hooks that wrap the API client. The frontend uses these instead of calling `fetch` directly, getting caching, loading states, and error handling for free.

---

### `lib/api-spec` — OpenAPI Spec

`openapi.yaml` is the single source of truth for the API surface. `orval` is configured to auto-generate TypeScript clients from it.

To regenerate after updating the spec:
```bash
npm run codegen -w @workspace/api-spec
```

---

## 4. Backend — API Server

**Stack:** Express 5, TypeScript, esbuild, pino (structured logging), express-session

**Entry point:** `artifacts/api-server/src/index.ts`  
**App setup:** `artifacts/api-server/src/app.ts`

### Middleware stack (in order)

1. `pino-http` — structured request logging
2. `cors` — open origin with credentials
3. `express-session` — cookie-based session for admin auth
4. `express.json()` / `express.urlencoded()` — body parsing

### API Routes

All routes are mounted under `/api`:

#### Public routes

| Method | Path | Description |
|---|---|---|
| `GET` | `/api/healthz` | Health check → `{ status: "ok" }` |
| `GET` | `/api/products` | List all products |
| `GET` | `/api/products/:id` | Single product by string id |
| `POST` | `/api/assessments` | Submit an assessment form |
| `GET` | `/api/assessments/:id` | Get one assessment result by numeric id |

#### Admin auth routes

| Method | Path | Description |
|---|---|---|
| `POST` | `/api/admin/login` | Login with password → sets session cookie |
| `POST` | `/api/admin/logout` | Destroy session |
| `GET` | `/api/admin/me` | Check if session is authenticated |

#### Admin protected routes (require session)

| Method | Path | Description |
|---|---|---|
| `GET` | `/api/admin/stats` | Aggregate analytics (counts, distributions) |
| `GET` | `/api/admin/assessments` | Paginated list with search + filter |
| `GET` | `/api/admin/assessments/export` | Download all as CSV |
| `GET` | `/api/admin/assessments/:id` | Single assessment detail |
| `DELETE` | `/api/admin/assessments/:id` | Delete an assessment |

### Build process

The backend is bundled with **esbuild** into a single `dist/index.mjs` before deployment:

```bash
npm run build        # runs build.mjs via esbuild
npm run start        # node --enable-source-maps ./dist/index.mjs
npm run dev          # build + start in development mode
```

`build.mjs` externalises native modules (sharp, better-sqlite3, etc.) and uses `esbuild-plugin-pino` to correctly bundle pino's worker threads.

---

## 5. Frontend — Pure Botànica

**Stack:** React 19, Vite 7, TailwindCSS 4, Radix UI, Framer Motion, TanStack Query, Wouter (routing), Zod, react-hook-form

**Entry point:** `artifacts/pure-botanica/src/main.tsx`

### Pages

| Route | File | Description |
|---|---|---|
| `/` | `pages/home.tsx` | Landing page — hero, product highlights, CTA |
| `/products` | `pages/products.tsx` | Product catalogue with animated jar viewer |
| `/contact` | `pages/contact.tsx` | Contact / inquiry form |
| `/assessment` | `pages/assessment.tsx` | Multi-step child wellness questionnaire |
| `/results/:id` | `pages/results.tsx` | Personalised product recommendation results |
| `/admin/login` | `pages/admin-login.tsx` | Admin password login |
| `/admin` | `pages/admin-dashboard.tsx` | Analytics dashboard + assessment management |

### App-level providers

```
QueryClientProvider        (TanStack Query)
  └── LangProvider         (Arabic / English toggle)
       └── TooltipProvider (Radix)
            └── WouterRouter
                 └── Shell (nav + footer layout)
                      └── <page routes>
```

### Internationalisation

`src/lib/lang-context.tsx` provides a `useLang()` hook. All UI strings live in `src/lib/translations.ts` with Arabic (`ar`) and English (`en`) keys. The language toggle is in the Shell navigation.

### API Proxy (development)

In development, Vite proxies `/api` requests to `http://localhost:8080`. In production, `VITE_API_URL` points to the deployed backend.

---

## 6. Database Layer — MongoDB

The `lib/db` package uses **Mongoose** with two schema models:

### Product schema

```
id          String (unique)   — "focus-gummies" / "mineral-gummies"
name        String
category    String
theme       String
netWeight   String
count       String
description String
mainImage   String            — filename of closed-jar image
openImage   String            — filename of open-jar image
images      { main, open }
price       Number
```

### Assessment schema

```
id              Number (unique, auto-increment)
parentName      String
email           String
phone           String | null
childName       String
age             Number
gender          String
activityLevel   String
focusDifficulty String
hyperactivity   String
homework        String
diet            String
vegetables      String
supplements     String
allergies       String | null
medications     String | null
notes           String | null
focusScore      Number        — calculated by scoring engine
mineralScore    Number        — calculated by scoring engine
recommendation  "focus" | "mineral" | "both"
createdAt       Date
```

### Connection

`connectDB()` is called lazily before the first DB operation. The connection is cached via a module-level promise — one connection per process. In Vercel serverless, Mongoose efficiently re-uses connections across invocations when the environment is warm.

---

## 7. Assessment Scoring Algorithm

The scoring logic lives in `artifacts/api-server/src/lib/scoring.ts`. It is **pure functions** — stateless and easy to unit-test.

### How scoring works

Each of the 7 questionnaire answers awards independent points to either the **Focus** score or the **Mineral** score:

| Question | Affects | Max pts |
|---|---|---|
| Activity level | Focus | 3 |
| Focus difficulty | Focus | 3 |
| Hyperactivity | Focus | 3 |
| Homework difficulty | Focus | 3 |
| Diet quality | Mineral | 3 |
| Vegetable intake | Mineral | 3 |
| Taking supplements | Mineral | 2 |

**Thresholds:**
- Focus threshold: **≥ 6 / 12**
- Mineral threshold: **≥ 4 / 8**

**Recommendation logic:**

```
focus ≥ threshold AND mineral ≥ threshold  →  "both"
focus ≥ threshold only                     →  "focus"
mineral ≥ threshold only                   →  "mineral"
neither threshold met                      →  higher relative ratio wins
```

---

## 8. Local Development Setup

### Prerequisites

- **Node.js** ≥ 20
- **npm** ≥ 10
- A **MongoDB URI** (local instance or Atlas free tier)

### Step 1 — Clone and install

```bash
git clone <repo-url>
cd Herbal-Hub
npm install
```

> The `preinstall` script runs automatically and syncs product images from `src/assets` to `public/images`.

### Step 2 — Configure environment

```bash
cp artifacts/api-server/.env.example artifacts/api-server/.env
```

Edit `artifacts/api-server/.env`:

```env
PORT=8080
SESSION_SECRET=any-random-32-char-string
ADMIN_PASSWORD=your-admin-password
NODE_ENV=development
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/herbalhub?retryWrites=true&w=majority
```

### Step 3 — Seed the database (first time only)

```bash
cd artifacts/api-server
npm run seed
```

This reads `db.json` and upserts all products and assessment records into MongoDB. It is **idempotent** — safe to run multiple times.

### Step 4 — Start the backend

```bash
cd artifacts/api-server
npm run dev
# Listening on http://localhost:8080
```

### Step 5 — Start the frontend

In a second terminal:

```bash
cd artifacts/pure-botanica
npm run dev
# Listening on http://localhost:5173
```

API calls to `/api/*` are proxied automatically to the backend.

---

## 9. MongoDB Setup (Atlas)

1. Go to [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas) → sign in (free M0 tier is sufficient)
2. **Create a new project** → **Build a Cluster** → choose **M0 Free**
3. Under **Database Access**, create a user with **read/write** privileges
4. Under **Network Access**, add your IP (or `0.0.0.0/0` for development)
5. Click **Connect** → **Drivers** → copy the connection string
6. Replace `<username>`, `<password>`, `<cluster>` with your values and set the DB name to `herbalhub`

**Example URI:**
```
mongodb+srv://myuser:mypassword@cluster0.abcde.mongodb.net/herbalhub?retryWrites=true&w=majority
```

---

## 10. Seeding Existing Data

`artifacts/api-server/db.json` contains the original data snapshot — 2 products and 6 assessment records collected during the Replit/JSON-file era.

To import them into MongoDB:

```bash
cd artifacts/api-server
npm run seed
```

The seed script (`seed-mongodb.ts`) uses **upsert** operations keyed on `id`, so it is safe to run multiple times without creating duplicates.

---

## 11. Vercel Deployment

Each app is deployed as its own **independent Vercel project** pointing at its subdirectory.

### 11a. Deploy the Backend

1. Vercel dashboard → **Add New Project** → import the repo
2. Set **Root Directory** to `artifacts/api-server`
3. Add **Environment Variables**:

   | Variable | Value |
   |---|---|
   | `MONGODB_URI` | your Atlas connection string |
   | `SESSION_SECRET` | a random 32+ character string |
   | `ADMIN_PASSWORD` | your chosen admin password |
   | `NODE_ENV` | `production` |

4. Click **Deploy** — note the URL, e.g. `https://herbalhub-api.vercel.app`

### 11b. Deploy the Frontend

1. Vercel dashboard → **Add New Project** → import the same repo
2. Set **Root Directory** to `artifacts/pure-botanica`
3. Add **Environment Variables**:

   | Variable | Value |
   |---|---|
   | `VITE_API_URL` | URL of your deployed backend |

4. Click **Deploy**

> Every push to `main` triggers automatic re-deployments of both projects.  
> Pull requests get preview deployments automatically.

---

## 12. Environment Variables Reference

### Backend (`artifacts/api-server/.env`)

| Variable | Required | Default | Description |
|---|---|---|---|
| `MONGODB_URI` | ✅ | — | MongoDB Atlas connection string |
| `PORT` | ❌ | `8080` | Port the Express server listens on |
| `SESSION_SECRET` | ✅ | `dev-secret-change-me` | Signs the session cookie — use a strong random string in production |
| `ADMIN_PASSWORD` | ✅ | `purebotanica2024` | Password for the admin dashboard |
| `NODE_ENV` | ❌ | `development` | Set to `production` on Vercel |

### Frontend (Vite env vars)

| Variable | Required | Default | Description |
|---|---|---|---|
| `VITE_API_URL` | Production only | `http://localhost:8080` | Base URL of the deployed backend |
| `BASE_PATH` | ❌ | `/` | Vite base path — for sub-path deployments |
| `PORT` | ❌ | `5173` | Dev server port |

---

## 13. Project File Map

```
Herbal-Hub/
│
├── package.json                        ← npm workspaces root
├── .npmrc                              ← legacy-peer-deps=true
├── tsconfig.base.json                  ← shared TS compiler options
├── tsconfig.json                       ← root TS project references
├── walkthrough.md                      ← you are here
│
├── scripts/
│   ├── preinstall.js                   ← image sync + cleanup (auto-runs on npm install)
│   └── src/hello.ts                    ← example workspace script
│
├── lib/
│   ├── db/
│   │   └── src/
│   │       ├── index.ts                ← all MongoDB CRUD functions (Mongoose)
│   │       └── schema/
│   │           ├── assessments.ts      ← Zod schema + Assessment interface
│   │           └── index.ts
│   ├── api-zod/
│   │   └── src/
│   │       ├── index.ts                ← re-exports all Zod schemas
│   │       └── generated/             ← Orval-generated schemas
│   ├── api-client-react/
│   │   └── src/index.ts               ← TanStack Query hooks
│   └── api-spec/
│       ├── openapi.yaml               ← OpenAPI 3 specification
│       └── orval.config.ts            ← Orval code-gen config
│
└── artifacts/
    │
    ├── api-server/
    │   ├── vercel.json                ← backend Vercel deployment config
    │   ├── package.json
    │   ├── build.mjs                  ← esbuild bundler script
    │   ├── seed-mongodb.ts            ← one-time db.json → MongoDB migration
    │   ├── db.json                    ← original data snapshot
    │   ├── .env                       ← local secrets (git-ignored)
    │   ├── .env.example               ← template for .env
    │   └── src/
    │       ├── index.ts               ← HTTP server entry point
    │       ├── app.ts                 ← Express app + middleware
    │       ├── lib/
    │       │   ├── logger.ts          ← pino logger instance
    │       │   └── scoring.ts         ← assessment scoring algorithm
    │       └── routes/
    │           ├── index.ts           ← router aggregator
    │           ├── health.ts          ← GET /api/healthz
    │           ├── products.ts        ← GET /api/products[/:id]
    │           ├── assessments.ts     ← POST /api/assessments, GET /api/assessments/:id
    │           └── admin/
    │               └── index.ts       ← all /api/admin/* routes
    │
    └── pure-botanica/
        ├── vercel.json                ← frontend Vercel deployment config
        ├── package.json
        ├── vite.config.ts             ← Vite config (proxy, aliases, build)
        ├── index.html                 ← SPA entry HTML
        ├── components.json            ← shadcn/ui config
        ├── public/
        │   └── images/                ← product images served statically
        └── src/
            ├── main.tsx               ← React root mount
            ├── App.tsx                ← router + providers
            ├── index.css              ← global styles + Tailwind base
            ├── assets/                ← bundled image assets
            ├── pages/
            │   ├── home.tsx
            │   ├── products.tsx
            │   ├── contact.tsx
            │   ├── assessment.tsx
            │   ├── results.tsx
            │   ├── admin-login.tsx
            │   ├── admin-dashboard.tsx
            │   └── not-found.tsx
            ├── components/
            │   ├── layout/Shell.tsx   ← nav + footer wrapper
            │   ├── animated-product-jar.tsx
            │   └── ui/                ← shadcn/ui component library
            ├── hooks/                 ← custom React hooks
            └── lib/
                ├── lang-context.tsx   ← Arabic/English language provider
                ├── translations.ts    ← all UI strings (ar + en)
                └── utils.ts           ← cn() helper (clsx + tailwind-merge)
```
