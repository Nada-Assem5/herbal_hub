# Pure Botanica Project Analysis & Architecture Report

This report provides a detailed breakdown of the **Pure Botanica** (internally identified as `Herbal-Hub`) codebase, a full-stack monorepo designed to help parents select appropriate botanical wellness supplements for children ages 3–12 through an interactive assessment and questionnaire.

---

## 1. Project Overview
### Purpose & Functionality
**Pure Botanica** is an e-commerce and wellness assessment application for children's botanical gummies (*Focus Gummies* and *Mineral Gummies*). 
- **Interactive Questionnaire**: Parents fill out a 5-step form answering queries about their children's demographics, behavior (hyperactivity, concentration difficulty), diet, and daily routine.
- **Dynamic Scoring and Recommendations**: The application evaluates these answers against custom business logic, mapping results to focus or mineral deficiencies and recommending either one or both formulas.
- **Admin Dashboard**: Provides authenticated administrators with interactive charts (age, gender, symptom distributions), query lists with fuzzy search filters, individual entry detail popups, and the capability to export all questionnaire data as a CSV stream.

### Overall Architecture
The codebase is structured as a TypeScript-first monorepo managed under **pnpm workspaces**. It decouples application layers to promote reuse and strict type-safety:
- **Shared Contracts (`lib/api-spec`)**: Contains the API definition (`openapi.yaml`) which dictates request/response types.
- **Shared Code Generators (`lib/api-zod`, `lib/api-client-react`)**: Generates runtime Zod validators and React Query hooks directly from the API specification file.
- **Shared Database Schema (`lib/db`)**: Holds the PostgreSQL definition utilizing Drizzle ORM.
- **API Server (`artifacts/api-server`)**: Back-end Express application that handles endpoint requests, routes data to the DB, runs scoring logic, and holds session authentication state.
- **Frontend App (`artifacts/pure-botanica`)**: React front-end application built with Vite and Tailwind CSS.
- **Mockup Preview (`artifacts/mockup-sandbox`)**: Custom sandbox to render component mockups.

---

## 2. Workspace Structure
The monorepo contains the following workspace packages defined in `pnpm-workspace.yaml`:

### 1. `artifacts/pure-botanica`
- **Purpose**: Main web client where users browse products, fill out assessments, read results, and where administrators log in to manage entries.
- **Tech Stack**: React 19.1, Vite 7.3, wouter (routing), Tailwind CSS (styling), Framer Motion (animations), Recharts (dashboard visualization), and Radix UI primitives.
- **Connections**: Calls endpoints served by `api-server` using React Query client hooks imported from `@workspace/api-client-react`.

### 2. `artifacts/api-server`
- **Purpose**: Web API backend serving public questionnaire endpoints and secure admin dashboard management.
- **Tech Stack**: Node.js, Express 5.2, express-session (session-based authentication), Pino (logging), and esbuild (bundler).
- **Connections**: Connects to the database using `@workspace/db` and imports validation schemas from `@workspace/api-zod`.

### 3. `artifacts/mockup-sandbox`
- **Purpose**: Dev utility sandbox designed to preview individual React components.
- **Tech Stack**: React 19.1, Vite 7.3, Tailwind CSS.
- **Connections**: Isolated sandbox tool using Replit cartographer components (empty by default).

### 4. `lib/db`
- **Purpose**: Local database client handling persistence and model type definitions.
- **Tech Stack**: Direct JSON file storage, TypeScript.
- **Connections**: Imported by `api-server` to run database insert, read, and delete operations.

### 5. `lib/api-spec`
- **Purpose**: Single source of truth containing the API specification.
- **Tech Stack**: OpenAPI 3.1.0, Orval 8.21 (codegen).
- **Connections**: Drives automated generation of schemas in `lib/api-zod` and React client query hooks in `lib/api-client-react`.

### 6. `lib/api-zod`
- **Purpose**: Type definitions and Zod validation schemas for API routing payloads.
- **Tech Stack**: Zod 3.25.
- **Connections**: Imported by `api-server` to parse and validate HTTP requests.

### 7. `lib/api-client-react`
- **Purpose**: React Query hooks and client fetch mutator wrappers.
- **Tech Stack**: `@tanstack/react-query` 5.90, React 19.1.
- **Connections**: Imported and used by `pure-botanica` to execute API requests to the server.

### 8. `scripts`
- **Purpose**: Workspace scripting utilities.
- **Tech Stack**: TSX (TypeScript Execute), shell scripting.
- **Connections**: Provides git hook automation (e.g. `post-merge.sh`).

---

## 3. Tech Stack & Versioning
- **Package Manager**: **pnpm** (workspaces mode). It resolves global packages from a shared catalog and eliminates package duplication.
- **Programming Language**: **TypeScript 5.9** (strict configuration shared via `tsconfig.base.json`).
- **Core Frameworks & Libraries**:
  - **React**: `19.1.0` (mandated version to maintain compatibility with expo/vite components).
  - **Express**: `^5.2.1` (used for asynchronous routing and native promise resolving).
  - **Vite**: `^7.3.2` (drives frontend and sandbox hot reloading).
  - **Drizzle ORM**: `^0.45.2` (Lightweight SQL mappings and query builders).
  - **Zod**: `^3.25.76` (Runtime parsing and typing).
  - **React Query**: `^5.90.21` (Remote server-state synchronizations).
- **Build Tools**:
  - **esbuild**: `0.27.3` (used to compile the api-server into ESM files).
  - **vite**: `^7.3.2` (used to bundle React frontend client bundles).

---

## 4. How Each Part Works

### 1. `lib/db`
- **Entry point**: `src/index.ts` (exposes local JSON file storage helper functions).
- **Key Folders**:
  - `src/schema/`: Houses schema definitions. `assessments.ts` defines and exports insertion types (`InsertAssessment`) and model types (`Assessment`).
- **Environment Variables**:
  - `JSON_DB_PATH`: **Optional**. Path to the local JSON database file (defaults to `db.json` in the current working directory).

### 2. `lib/api-spec`
- **Entry point**: `openapi.yaml` (OpenAPI specification).
- **Configuration**: `orval.config.ts` (defines output targets for both React client hooks and Zod schemas).

### 3. `artifacts/api-server`
- **Entry point**: `src/index.ts` (initializes app listener on server port).
- **Key Folders**:
  - `src/app.ts`: Hooks up body parsers, CORS rules, http loggers (Pino), and cookie session stores.
  - `src/lib/`: Custom modules. Contains `scoring.ts` (business scoring formula calculation) and `logger.ts` (Pino logger configuration).
  - `src/routes/`: Express endpoints. Handles `assessments.ts` (submissions), `health.ts` (monitoring), and `admin/index.ts` (dashboard analytics and details).
- **Environment Variables**:
  - `PORT`: **Required**. Server port listener.
  - `JSON_DB_PATH`: **Optional**. Path to the local JSON database file.
  - `SESSION_SECRET`: **Optional** (defaults to `"dev-secret-change-me"`). Used to encrypt express-session cookies.
  - `ADMIN_PASSWORD`: **Optional** (defaults to `"purebotanica2024"`). Validates admin dashboard login requests.
  - `NODE_ENV`: **Optional**. In `"production"`, session cookies enforce `secure: true` (HTTPS).

### 4. `artifacts/pure-botanica`
- **Entry point**: `src/main.tsx` (mounts client React DOM) and `index.html`.
- **Key Folders**:
  - `src/App.tsx`: Sets up wouter routing endpoints, TanStack query clients, and multi-language context providers.
  - `src/pages/`: Page containers including `home.tsx`, `products.tsx`, `assessment.tsx`, `results.tsx`, and `admin-dashboard.tsx`.
  - `src/components/ui/`: Components library wrapping styling classes around input elements, buttons, and visual overlays.
  - `src/lib/`: Multi-language dictionary files (`translations.ts`) and lang selection context (`lang-context.tsx`).
- **Environment Variables**:
  - `PORT`: **Required**. Port for the Vite dev server.
  - `BASE_PATH`: **Required**. App context root path (e.g. `/` or a sub-path).

---

## 5. How to Run the Project Locally

### Step-by-Step Setup Instructions
1. **Clone and Install Dependencies**:
   Ensure you have Node.js (v24 recommended) and `pnpm` installed.
   ```bash
   pnpm install
   ```
2. **Configure Environment Variables**:
   Provide the following variables. (In a local terminal, you can export them, set them in your shell, or configure a `.env` file).
   - Backend:
     ```bash
     PORT="8080"
     SESSION_SECRET="your-secure-session-key"
     ADMIN_PASSWORD="your-admin-password"
     # JSON_DB_PATH="./db.json" (optional)
     ```
   - Frontend (`pure-botanica`):
     ```bash
     PORT="5173"
     BASE_PATH="/"
     ```
4. **Build Common Libraries**:
   Before running applications, compile the library workspaces to resolve dependencies.
   ```bash
   pnpm run typecheck:libs
   ```
5. **Start Dev Servers**:
   Run the backend api-server and the frontend client simultaneously in separate terminals:
   - Backend:
     ```bash
     pnpm --filter @workspace/api-server run dev
     ```
   - Frontend:
     ```bash
     pnpm --filter @workspace/pure-botanica run dev
     ```

### Platform-Specific Considerations
- **Environment Variable Declarations**:
  In `artifacts/api-server/package.json`, the dev script is defined as:
  `export NODE_ENV=development && pnpm run build && pnpm run start`.
  - **macOS/Linux**: Runs successfully using standard bash/zsh export.
  - **Windows (PowerShell)**: Will crash with an error that `export` is not recognized. Windows developers should run `cross-env` or manually declare `$env:NODE_ENV="development"` before calling the build script.
- **Git Hooks Execution**:
  `scripts/post-merge.sh` is written as a Unix shell script. It will fail to run on raw Windows command prompts without MSYS2, WSL, or Git Bash configured as the default executor.

---

## 6. Data Flow & API Structure

```
                     +----------------------------+
                     |  pure-botanica (Frontend)  |
                     +--------------+-------------+
                                    |
            1. submits assessment   |  2. fetches result
            via POST /api/assess    |  via GET /api/assess/:id
                                    v
                     +--------------+-------------+
                     |    api-server (Backend)    |
                     +-----+--------+-------+-----+
                           |        |       |
      [Compute Scoring] <--+        |       +--> [Verify Sessions]
                                    v
                     +----------------------------+
                     |    Database (Local JSON)   |
                     +----------------------------+
```

### Backend Endpoints
- **`GET /api/healthz`**: Public ping check to monitor health.
- **`POST /api/assessments`**: Public submission. Computes score and records the entry.
- **`GET /api/assessments/:id`**: Retrieves public results using ID.
- **`POST /api/admin/login`**: Authenticates admin credentials.
- **`POST /api/admin/logout`**: Destroys active admin session.
- **`GET /api/admin/me`**: Fetches admin login verification.
- **`GET /api/admin/stats`**: Pulls compiled demographics and score charts data.
- **`GET /api/admin/assessments`**: Searchable/paginated list query.
- **`GET /api/admin/assessments/:id`**: Gets a detailed single record.
- **`DELETE /api/admin/assessments/:id`**: Deletes a single record.
- **`GET /api/admin/assessments/export`**: Returns CSV binary of all data entries.

### Consumption Method
The React frontend incorporates Orval-generated Axios-like custom-fetch wrappers. They query endpoints using the TanStack query bindings (e.g. `useGetAssessment`, `useSubmitAssessment`) and trigger automatic background data fetching and state sync.

---

## 7. Known Issues & TODOs
- **Code Comments (TODO/FIXME)**:
  - In `artifacts/api-server/.replit-artifact/artifact.toml` line 2:
    `previewPath = "/api" # TODO - should be excluded from preview in the first place`.
- **Incomplete / Placeholder Elements**:
  - **Mockup Sandbox**: The `mockup-sandbox` module does not contain any components within its mockups rendering directory (`artifacts/mockup-sandbox/src/components/mockups` is absent). It serves as an empty boilerplate.
  - **Images**: The product details page and results screen load static images from `attached_assets/generated_images/focus-gummies.png` and `mineral-gummies.png` representing mock placeholders.
  - **CSV Export Format**: The express route `/admin/assessments/export` includes code resolving an `xlsx` format parameter but defaults to sending standard `csv` data in both cases (`const filename = format === "xlsx" ? "assessments.csv" : "assessments.csv"`).
