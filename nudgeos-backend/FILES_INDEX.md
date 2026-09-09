# FILES INDEX - agents/ and services/

Every file Member 1 owns, one entry per file, with purpose and status.

## Reception Agent

- `src/agents/reception/reception.tools.js` - 5-tool JSON schema for the LLM (check_availability, create_booking, find_booking, cancel_booking, reschedule_booking). Status: frozen (reception-v1).
- `src/agents/reception/reception.prompt.js` - Builds system prompt with 12 hard rules (tone, booking constraints, multi-intent handling, anti-hallucination/clarification, date resolution, time formatting, bookingId lookup, disambiguation, out-of-scope handling, human-pretense guard, no-availability suggestion, general fallback). Status: v1 frozen, Rule 12 behaviorally verified.
- `src/agents/reception/reception.agent.js` - Core execution loop: `handleReceptionMessage()` builds prompt, calls LLM, executes tool_use via `executeTool()`, handles the two-turn tool_use/tool_result round-trip, includes conversation memory windowing (`buildMessageWindow`, 10-turn) and try/catch failure handling.
- `src/agents/reception/reception.mocks.js` - Mock implementations of all 5 tools, plus business-hours guard, double-booking guard, and multi-tenancy isolation (`mockBookingOwners` Map).
- `src/agents/reception/reception.agent.test.js` - Jest: Task 27 failure-mode handling.
- `src/agents/reception/reception.isolation.test.js` - Jest: Task 28 multi-tenancy isolation (7 checks).
- `src/agents/reception/reception.llm-failure.test.js` - Jest: LLM API failure fallback reply.

## Retention Agent

- `src/agents/retention/retention.agent.js` - `runRetentionAgent()`: drafts personalized win-back messages for inactive customers (25-30 days). Wired to real `getInactiveCustomers()` from M2's firestore.service.js. Status: code complete, draft-quality verified with mock data, end-to-end real-data test BLOCKED (M2's config/firebase.js empty).

## Revenue Agent

- `src/agents/revenue/revenue.agent.js` - `runRevenueAgent()`: detects calendar gap patterns, drafts owner-facing alerts. Mock-backed (`mockGetCalendarGaps`). Status: verified with real API test, good quality output. Real Calendar service integration BLOCKED (M2's calendar.service.js does not exist yet).

## Insight Agent

- `src/agents/insight/insight.agent.js` - `runInsightAgent()`: aggregates raw bookings/customers into structured stats via `computeStats()` (in code, not LLM), then LLM summarizes into a headline. Wired to real `getBusinessStatsRaw()` from M2's firestore.service.js. Status: aggregation logic unit-tested, LLM summarization step verified, full end-to-end real-data test BLOCKED (M2's Firebase config empty).

## Onboarding Agent

- `src/agents/onboarding/onboarding.agent.js` - `runOnboardingAgent()`: extracts structured JSON (services, prices, hours) from free-text/messy business descriptions. Status: tested against 5 varied inputs (clean, missing prices, informal Hinglish, WhatsApp chat dump, missing info) - 5/5 correct, no hallucinated values, missing fields correctly null.

## Shared Services

- `src/services/llm.service.js` - Gemini adapter presenting an Anthropic-shaped interface (`callAgent()`). Fixed: thought_signature preservation across multi-turn tool calls (Gemini 3.x requirement).

## Local-Only (Not Committed)

- `src/services/firestore.service.js` - M2's real Firestore service, copied locally for testing/reference only. Gitignored intentionally to avoid merge conflicts when M2's branch eventually merges to main. Exports: getDoc, setDoc, queryCollection, getInactiveCustomers, getBusinessStatsRaw, writeBooking.

## Documentation

- `docs/reception-agent.md` - v1 documentation.
- `docs/retention-agent.md`, `docs/revenue-agent.md`, `docs/insight-agent.md`, `docs/onboarding-agent.md` - per-agent documentation (Task 31/35).

## Known Blockers (M2-side)

- `config/firebase.js`, `config/googleCalendar.js` - still 0-byte placeholders as of last check.
- `services/calendar.service.js` - does not exist yet on backend-m2 branch.