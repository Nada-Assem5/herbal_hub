# Pure Botanica

A full-stack herbal gummies brand website that helps parents find the right botanical supplement for their child (ages 3–12) through an interactive assessment.

## Run & Operate

- `pnpm --filter @workspace/api-server run dev` — run the API server (port 8080)
- `pnpm --filter @workspace/pure-botanica run dev` — run the frontend (port varies)
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from the OpenAPI spec
- Required env: `SESSION_SECRET` — session encryption key (set as Replit secret)
- Optional env: `ADMIN_PASSWORD` — admin dashboard password (default: `purebotanica2024`)
- Optional env: `JSON_DB_PATH` — path to local JSON database file (default: `./db.json`)

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- Frontend: React + Vite, wouter, Tailwind CSS, shadcn/ui, Framer Motion, Recharts
- API: Express 5 + express-session
- DB: Direct local JSON file storage (single flat file model)
- Validation: Zod (`zod/v4`)
- API codegen: Orval (from OpenAPI spec)

## Where things live

- `lib/api-spec/openapi.yaml` — API contract (source of truth)
- `lib/db/src/schema/assessments.ts` — single flat assessments table
- `artifacts/api-server/src/lib/scoring.ts` — modular focus/mineral scoring logic
- `artifacts/api-server/src/routes/assessments.ts` — public assessment routes
- `artifacts/api-server/src/routes/admin/index.ts` — admin routes (auth-gated)
- `artifacts/pure-botanica/src/` — React frontend

## Pages

| Route | Purpose |
|---|---|
| `/` | Home — hero, product showcase, how it works |
| `/products` | About Products — Focus Gummies & Mineral Gummies detail |
| `/assessment` | Multi-step assessment form (5 steps with progress bar) |
| `/results/:id` | Recommendation result with disclaimer |
| `/contact` | Contact form |
| `/admin/login` | Admin login (password-gated) |
| `/admin` | Admin dashboard — stats, charts, assessment table, CSV export |

## Scoring Logic

- **Focus Score**: very_active (+3), focus difficulty often (+3)/sometimes (+1), hyperactivity often (+2)/sometimes (+1), homework no (+2)/sometimes (+1). Threshold ≥ 4 → recommend Focus Gummies.
- **Mineral Score**: diet poor (+3)/average (+1), vegetables 0 (+3)/1 (+1), no supplements (+2). Threshold ≥ 3 → recommend Mineral Gummies.
- If both thresholds met → recommend both products.

## Architecture decisions

- Flat `assessments` table combining parent + child + assessment data — simplifies queries and avoids joins for a single-entity domain.
- Scoring logic is a pure module (`scoring.ts`) so new products can be added by extending `calcFocusScore` / `calcMineralScore` and updating thresholds.
- Admin auth uses server-side express-session (HTTP-only cookie) with `SESSION_SECRET` for CSRF safety.
- CSV export is a plain Express route (not in OpenAPI spec) since it returns binary/text, not JSON.

## User preferences

_Populate as you build._

## Gotchas

- After any `lib/db/src/schema/` change, run `pnpm run typecheck:libs` before the api-server typecheck.
- After any `lib/api-spec/openapi.yaml` change, run codegen before using updated types.
- The `ADMIN_PASSWORD` env var controls dashboard access — set it in Replit secrets for production.
