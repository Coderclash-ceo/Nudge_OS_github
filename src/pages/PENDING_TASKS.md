# Pending / Blocked Tasks

## M3-10 (Day 19) — Wire every dashboard API call through authMiddleware

**Status:** ⏸️ BLOCKED — waiting on M2's backend (authMiddleware.js) to be ready

**What needs to happen:**

1. Confirm `getIdToken()` is called fresh on every API request (not cached)
2. Add global `request()` function in `src/api/client.js` that:
   - Attaches `Authorization: Bearer <token>` header to every call
   - On 401 response → sign out + redirect to `/login`
   - On 500 response → show page-level error (do NOT sign out)
3. Verify via browser DevTools Network tab — every request should carry the auth header

**Blocked because:** Need M2's live backend API (`/api/*` routes) and `VITE_API_BASE_URL` to actually test this.

**When to revisit:** As soon as M2 confirms their backend + authMiddleware.js is deployed/running.

---

_Last updated: Day 18/19 — Sep 2026_

---

## M3-13 (Days 23–25) — Deploy to Vercel (staging)

**Status:** ⏸️ BLOCKED — waiting on GitHub org access to `Coderclash-ceo`

**What needs to happen:**
1. Vercel needs access to the `Coderclash-ceo/Nudge_OS_github` repo
2. Repo owner (`Coderclash-ceo` account) must install/configure the Vercel GitHub App and grant access to this specific repo
3. Once access is granted, import repo into Vercel, set Firebase env vars, deploy from `frontend-m3` branch (not `main`)
4. `VITE_API_BASE_URL` stays pointed at localhost/blank until M2's staging backend URL is available

**Blocked because:** Repo is owned by `Coderclash-ceo`, not my personal GitHub account — Vercel's GitHub App can only be granted access by the repo/org owner.

**When to revisit:** As soon as `Coderclash-ceo` account holder can configure Vercel access, or gives explicit instructions on how to proceed.

_Last updated: Day 23 — Sep 2026_
