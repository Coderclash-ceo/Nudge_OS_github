# Reception Agent — v1 Documentation

**Status:** Frozen as `reception-v1` (git tag). Last updated: 9 Sep 2026
**Files covered:** `reception.prompt.js`, `reception.tools.js`, `reception.agent.js`, `reception.mocks.js`

---

## Overview

The Reception Agent handles real-time customer messages over WhatsApp/
Instagram: detecting intent (booking, cancellation, reschedule, FAQ),
calling the appropriate tool, and replying naturally. This doc covers the
prompt design, tool schemas, agent loop, and known limitations.

---

## System Prompt Summary

Built as a **function** (`buildReceptionPrompt(business, todayDate)`),
not a static string, since Nudge OS is multi-tenant - business name,
category, services, and hours are injected per call.

### Tone
Warm but professional. Short messages, no walls of text, brisk and
efficient.

### Hard Rules (12 total)
1. Never invent/confirm a booking without service + date + time all
   explicitly confirmed.
2. Never quote a price/service/hour not present in business data.
3. Multi-intent messages -> ask ONE clarifying question, never guess or
   fire multiple tool calls. (Strengthened in v0.2 with a concrete
   example after a real test failure - see Changelog.)
4. Always restate confirmed booking details before calling
   `create_booking`.
5. Resolve relative dates ("tomorrow", "Friday") to YYYY-MM-DD using the
   injected `todayDate` before calling any tool.
6. Time always formatted with explicit AM/PM (12-hour), never bare
   numbers or 24-hour format.
7. Never call `cancel_booking`/`reschedule_booking` without a real
   `bookingId` from a prior `find_booking` call in the same conversation.
8. If `find_booking` returns `multiple_matches`, ask which booking before
   proceeding.
9. Decline plainly, no fabrication, for anything out of scope.
10. Never claim to be human if asked directly.
11. If `check_availability` returns no slots, proactively suggest nearby
    dates instead of a dead-end apology.
12. If uncertain what the customer wants, ask exactly ONE short
    clarifying question. Never call booking tools without every required
    detail explicitly confirmed.

### Changelog (from the prompt file itself)
- **v0** (Day 7): initial draft, 10 rules, no few-shot examples
- **v0.1** (Day 8): fixed missing `todayDate` injection
- **v0.2** (Day 8): fixed multi-intent handling - strengthened Rule 3
- **v0.3** (Day 22): added Rule 11 - graceful no-availability handling
- **v0.4** (Day 23 / Task 17): added Rule 12 - fallback/clarification,
  anti-hallucination

---

## Agent Loop (`reception.agent.js`)

- `handleReceptionMessage(business, conversationHistory, incomingMessage)`
  is the exported entry point. Builds prompt, calls LLM, executes any
  tool_use, handles the two-turn tool_use/tool_result round-trip.
- `executeTool(name, input, business)` - all 5 tools now consistently
  receive the full `business` object (fixed 9 Sep 2026 - `check_availability`
  previously did not receive it, unlike the other 4 tools; corrected for
  future Calendar-service compatibility since different businesses will
  need different calendars).
- Conversation memory: `buildMessageWindow(fullHistory, incomingMessage, maxTurns=10)`
  - last 10 turns + new message sent to the LLM each call.
- Failure handling: `executeTool` wrapped in try/catch; both `callAgent`
  calls check `result.ok` before proceeding. Verified via Jest.

---

## Tool Schemas (5 tools)

| Tool | Purpose | Required Fields |
|---|---|---|
| `check_availability` | Check open slots for a service/date | service, date |
| `create_booking` | Book a confirmed appointment | customerName, service, date, time |
| `find_booking` | Look up an existing booking's ID | customerName |
| `cancel_booking` | Cancel using a real bookingId | bookingId |
| `reschedule_booking` | Move a booking to new date/time | bookingId, newDate, newTime |

**Design decisions locked at Day 6:**
- Date format: `YYYY-MM-DD`
- Time format: 12-hour with AM/PM - deviates from the original handbook's
  24h default, deliberate choice
- `find_booking` is a separate, model-visible tool (not embedded inside
  cancel/reschedule)

---

## Safety Guards (code-level, Task 25)

Implemented in `reception.mocks.js`, not just the prompt (per handbook:
"a prompt rule can be misread or ignored by the model"):
- `isWithinBusinessHours(business, date, time)` - rejects bookings outside
  business hours
- `isSlotTaken(date, time)` - rejects double-booking
- Both verified with 5 direct unit checks, zero API cost

## Multi-Tenancy Isolation (Task 28)

`mockBookingOwners` Map tracks bookingId -> businessId. Cross-business
cancel/reschedule attempts return `{ error: "not_found" }` rather than
leaking or modifying another business's booking. Verified via Jest
(7/7 tests passing across 3 test files: `reception.agent.test.js`,
`reception.isolation.test.js`, `reception.llm-failure.test.js`).

---

## Test Results

**Day 8 full regression (15 test cases):** 14/14 testable cases pass.
1 case (`multiturn_memory`) was deferred at the time - later verified
once conversation memory was built (Day 21).

**Rule 12 behavioral test (1 Sep 2026):** 4/4 vague/off-topic inputs
correctly handled with zero unwarranted tool calls ("hey", "is it open",
"can you help", "what's the weather today").


**Multi-turn memory test (9 Sep 2026):** 4-turn conversation
(book haircut -> tomorrow -> 3pm+name -> correct to facial) - agent
correctly retained customer name ("Priya") across all subsequent turns
including after a service correction. `buildMessageWindow` confirmed
working end-to-end with real API calls, not just unit-level.

---

## M2 Integration Status (confirmed 9 Sep 2026)

Reviewed M2's `whatsapp.webhook.js` on the `backend-m2` branch directly.
**Confirmed compatible:** M2 calls
`handleReceptionMessage(business, conversationHistory, incomingMessage)`
with the exact signature this agent expects - no mismatch, no changes
needed on either side.

**Still blocking real end-to-end testing:**
1. M2's `config/firebase.js` requires a `GOOGLE_APPLICATION_CREDENTIALS`
   service account file - a secret credential only M2 has, not