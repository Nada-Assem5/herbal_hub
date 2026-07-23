TASK: Fix the DATABASE_URL error, harden secrets, verify all scoring 
scenarios, and prepare the app for production deployment.

═══════════════════════════════════════════
PART 0 — FIX IMMEDIATE BLOCKER: DATABASE_URL MISSING
═══════════════════════════════════════════
Current error: "Database connection is not configured. DATABASE_URL is 
missing" thrown from lib/db/src/index.ts around line 28.

1. Confirm whether a local Postgres instance is actually running and 
   accessible (check if Postgres service/container is up).
2. Confirm a `.env` file exists in the correct location (api-server root, 
   or workspace root depending on how dotenv is loaded) and that it's 
   actually being read at startup — check if dotenv/config is imported 
   before lib/db initializes.
3. Set DATABASE_URL to a real local connection string, e.g.:
   DATABASE_URL="postgresql://username:password@localhost:5432/purebotanica"
4. Re-run `pnpm --filter @workspace/db run push` to sync schema after 
   confirming the connection string works.
5. Restart both api-server and frontend dev servers and confirm a test 
   submission succeeds end-to-end (no more 500 error).

═══════════════════════════════════════════
PART 1 — HARDEN SECRETS (before any deployment)
═══════════════════════════════════════════
1. Replace SESSION_SECRET default ("dev-secret-change-me") with a strong, 
   randomly generated 32+ character secret. Generate one securely (e.g. 
   via crypto.randomBytes) rather than hardcoding a placeholder string in 
   code — it must come from an environment variable with NO insecure 
   fallback in production.
2. Replace ADMIN_PASSWORD default ("purebotanica2024") the same way — 
   remove the hardcoded fallback entirely when NODE_ENV=production, and 
   throw a startup error if it's missing in production (fail loudly, not 
   silently, like DATABASE_URL already does).
3. Audit app.ts / index.ts for any other hardcoded secrets, API keys, or 
   default credentials and flag them.
4. Confirm session cookies use `secure: true` and `httpOnly: true` when 
   NODE_ENV=production, and that SameSite is set appropriately.

═══════════════════════════════════════════
PART 2 — VERIFY ALL 3 SCORING SCENARIOS END-TO-END
═══════════════════════════════════════════
Once DATABASE_URL is fixed, submit three test assessments and confirm 
each renders the correct result on results.tsx:

1. FOCUS-only: answers that push focusScore >= 6 (threshold) but 
   mineralScore stays below 4. Confirm only Focus Gummies is recommended, 
   with correct progress bar values shown.
2. MINERAL-only: answers that push mineralScore >= 4 but focusScore stays 
   below 6. Confirm only Mineral Gummies is recommended.
3. BUNDLE: answers that push both scores past their thresholds 
   simultaneously. Confirm both products are shown as a bundle 
   recommendation, not just one.
4. Also test a LOW-SCORE case (neither threshold crossed) and confirm the 
   "light recommendation" copy displays correctly instead of erroring out.
5. For each scenario, confirm the "Why We Recommend This" text correctly 
   references the specific answers that drove the score (not generic 
   boilerplate).

═══════════════════════════════════════════
PART 3 — PRODUCTION DEPLOYMENT READINESS CHECKLIST
═══════════════════════════════════════════
Go through and confirm/fix each:

1. Environment variables: produce a `.env.example` file (without real 
   values) documenting every required var (DATABASE_URL, SESSION_SECRET, 
   ADMIN_PASSWORD, PORT, BASE_PATH, NODE_ENV) so deployment is 
   reproducible.
2. NODE_ENV=production is set correctly in the deploy target, and confirm 
   nothing in the codebase behaves incorrectly under it (e.g. cookie 
   `secure: true` requires HTTPS — confirm the deploy target actually 
   serves over HTTPS).
3. CORS: confirm allowed origins in production are restricted to the 
   real production frontend domain, not left open/wildcard.
4. Database: confirm migrations run automatically or are documented as a 
   manual pre-deploy step; confirm connection pooling settings are 
   reasonable for expected traffic.
5. Error handling: confirm unhandled exceptions in the API don't leak 
   stack traces or internal file paths to the client in production (the 
   current DATABASE_URL error message exposed an internal file path — 
   `lib/db/src/index.ts:28:15` — in the raw response; sanitize error 
   responses in production to return a generic message while logging 
   full details server-side only).
6. Rate limiting: confirm public endpoints (POST /api/assessments) have 
   basic rate limiting to prevent abuse/spam submissions.
7. Build verification: run the full production build (`pnpm run build` 
   for both api-server and pure-botanica) and confirm no errors before 
   considering deployment-ready.
8. Confirm admin dashboard is not publicly linked/discoverable and 
   requires the hardened ADMIN_PASSWORD to access.

DELIVERABLE:
- DATABASE_URL error resolved and end-to-end submission confirmed 
  working.
- Both secrets hardened with no insecure production fallback.
- All 4 scoring scenarios (Focus, Mineral, Bundle, Low-score) tested and 
  confirmed correct.
- Production readiness checklist completed with pass/fail per item and 
  a `.env.example` file delivered.