# CHANGELOG

All notable changes to Member 1 (Agent Developer) work, in chronological order.

## Day 6-7 (27-28 Jul 2026) - Reception Foundation
- `reception.tools.js`: 5-tool schema (check_availability, create_booking, find_booking, cancel_booking, reschedule_booking). Design decisions: 12h AM/PM time format, find_booking as separate model-visible tool.
- `reception.prompt.js` v0: initial system prompt, 10 hard rules.

## Day 8-9 (29-30 Jul 2026) - Testing & Fixes
- Full 15-test regression run against v0 prompt.
- Fix: relative dates ("tomorrow") were not resolving - todayDate was never injected into the prompt. Added todayDate parameter.
- Fix: multi-intent messages triggered two tool calls instead of one clarifying question. Strengthened Rule 3 with a concrete example.
- Changelog comment added inside reception.prompt.js itself.

## Day 10 (31 Jul 2026) - v1 Freeze
- Tagged `reception-v1`.
- `docs/reception-agent.md` written.

## Day 12-15 (4-7 Aug 2026) - Agent Loop Build
- `reception.agent.js`: full loop, all 4 booking tools wired to mocks.
- `llm.service.js`: fixed thought_signature preservation bug across multi-turn Gemini tool calls (affects all agents, not just Reception).
- `reception.mocks.js`: mock implementations for all tools.

## Task 25 (13 Aug 2026) - Safety Guards
- Business-hours guard and double-booking guard added in code (not just prompt), per handbook Task 25. Verified with 5 direct unit checks, zero API cost.

## Task 27-28 (18 Aug 2026) - Failure Handling & Isolation
- `executeTool()` wrapped in try/catch for LLM/service failure handling.
- Multi-tenancy isolation via `mockBookingOwners` Map - prevents cross-business cancel/reschedule.
- Both verified via Jest (7/7 tests passing across 3 test files).

## Day 21-22 (Aug 2026) - Memory & No-Availability
- `buildMessageWindow()`: 10-turn conversation memory windowing.
- Graceful no-availability handling: mock + Rule 11 (suggest nearby dates instead of dead-end apology).

## Day 23 / Task 17 (30 Aug - 1 Sep 2026) - Fallback/Clarification
- Added Rule 12 to `reception.prompt.js`: anti-hallucination, ask ONE clarifying question on ambiguous/off-topic input.
- Behaviorally verified against 4 test inputs ("hey", "is it open", "can you help", "what's the weather today") - all passed, zero unwarranted tool calls.

## Day 31-33 (1 Sep 2026) - Onboarding & Insight Agents
- `onboarding.agent.js`: strict JSON extraction from messy business descriptions. Tested against 5 varied inputs (clean, missing prices, informal/Hinglish, WhatsApp chat dump, missing info) - all correctly returned null for undetermined fields, no hallucination.
- `insight.agent.js` v1: LLM-based summarization from pre-aggregated mock stats.

## Task 19-20 (1 Sep 2026) - Retention Agent
- `retention.agent.js`: built and tested with mock inactive-customer data - draft messages verified for personalization, tone, no discount promises.
- Wired to real `getInactiveCustomers()` from M2's `firestore.service.js` (found on backend-m2 branch). Code-complete but end-to-end untested - M2's `config/firebase.js` is still an empty placeholder.

## Task 25-26 (1 Sep 2026) - Revenue Agent
- `revenue.agent.js`: built mock-backed (calendar gap detection). Verified with real API test - produced specific, actionable owner-facing alert.

## Task 33 completion (8 Sep 2026) - Insight Agent Aggregation Fix
- Moved statistics aggregation from "trust the LLM" to explicit code (`computeStats()`), per handbook's design principle that the LLM should only summarize, never calculate.
- Verified with unit test against mock raw `{bookings, customers}` data, zero API cost.

## Task 31/35 (8 Sep 2026) - Documentation
- Added `docs/retention-agent.md`, `docs/revenue-agent.md`, `docs/insight-agent.md`, `docs/onboarding-agent.md`.

## Known Outstanding
- Days 16-17 (Reception real WhatsApp/Calendar wiring): blocked, M2's Calendar service does not exist yet.
- Retention Agent real end-to-end test: blocked, M2's Firebase config is empty.
- `config/firebase.js`, `config/googleCalendar.js`: still 0-byte placeholders on M2's side as of last check.