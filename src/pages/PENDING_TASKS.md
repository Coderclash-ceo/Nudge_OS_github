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
