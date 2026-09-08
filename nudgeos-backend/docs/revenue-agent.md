# Revenue Agent — Documentation

**Type:** Proactive (cron-triggered)
**Trigger:** Daily scheduled run

## Purpose
Scans calendar for underbooked slots/gap patterns, produces internal owner-facing alerts (never sent to customers).

## Prompt Summary
Concrete, specific alerts naming the day/time pattern + one practical suggested action. Max 2 sentences.

## Data Source
Mock `mockGetCalendarGaps()` - real version needs M2's `getCalendarGaps(businessId)` from calendar.service.js, which does not exist yet.

## Tools
None (pure text generation from gap data).

## Status
Verified with real API test - produced specific, actionable alert (e.g. "Thursday afternoons 2-5pm underbooked for 3 weeks, consider a promo").

## Known Limitations
Entirely mock-backed - Calendar service integration blocked on M2.