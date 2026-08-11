# Reception Agent — v1 Documentation

**Status:** Frozen as `reception-v1` (git tag), 11 Aug 2026
**Files covered:** `reception.prompt.js`, `reception.tools.js`

---

## Overview

The Reception Agent handles real-time customer messages over WhatsApp/
Instagram: detecting intent (booking, cancellation, reschedule, FAQ),
calling the appropriate tool, and replying naturally. This doc covers the
prompt design, tool schemas, and known limitations of v1.

---

## System Prompt Summary

Built as a **function** (`buildReceptionPrompt(business, todayDate)`),
not a static string, since Nudge OS is multi-tenant — business name,
category, services, and hours are injected per call.

### Tone
Warm but professional. Short messages, no walls of text, brisk and
efficient.

### Hard Rules (10 total)
1. Never invent/confirm a booking without service + date + time all
   explicitly confirmed.
2. Never quote a price/service/hour not present in business data.
3. Multi-intent messages → ask ONE clarifying question, never guess or
   fire multiple tool calls. (Strengthened in v0.2 with a concrete
   example after a real test failure — see Changelog.)
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

### Changelog (from the prompt file itself)
- **v0** (Day 7): initial draft, 10 rules, no few-shot examples
- **v0.1** (Day 8): fixed missing `todayDate` injection — relative dates
  were not resolving because the prompt promised "today's date will be
  provided" but nothing actually injected it
- **v0.2** (Day 8): fixed multi-intent handling — model was calling two
  tools instead of asking one clarifying question; strengthened Rule 3
  with a concrete example

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
- Time format: 12-hour with AM/PM (e.g. `"03:00 PM"`) — deviates from the
  original handbook's 24h default, deliberate choice
- `find_booking` is a separate, model-visible tool (not embedded inside
  cancel/reschedule) — deliberate choice, trade-off is 5 tools instead of
  4 for the model to pick from

---

## Test Results (Day 8 full regression, 15 test cases)

**14/14 testable cases pass.** 1 case (`multiturn_memory`) intentionally
deferred — requires conversation memory (Task 15 / Day 21), not yet
built. Not a real failure, documented in the test file itself.

Coverage included: typos, Hinglish, multi-intent, ambiguous dates,
FAQ (in-data and out-of-data), vague greetings, off-topic messages,
identity checks, and find_booking edge cases (no name given).

---

## Known Limitations (v1)

1. **No conversation memory yet.** Each test call is single-turn. A
   customer correcting themselves mid-conversation ("actually make that
   a facial") won't be handled correctly until Task 15 is built.
2. **No real business-hours/double-booking guard in code.** These
   checks currently rely on the prompt only (Rule 1, Rule 2) — per
   handbook Task 25, this needs to move into code (`executeTool()`)
   before production, since prompt rules can be misread by the model in
   edge cases.
3. **Not yet wired to real services.** All testing so far uses a mock
   `dummyBusiness` object. No real Firestore/Calendar/WhatsApp
   integration exists yet (blocked on Member 2's services + a live
   WhatsApp webhook).
4. **Tool call arguments not deeply verified.** Test script confirms
   which tool was called, but doesn't deeply assert the exact arguments
   (e.g. exact resolved date) were correct in every case — spot-checked
   manually only.
5. **Gemini free-tier quota constraints.** 5 requests/minute AND 20
   requests/day hard caps. Full regression runs (15 calls) consume most
   of a day's quota — testing must be paced accordingly.

---

## Fallback Behavior

- LLM API failure → `llm.service.js` returns `{ ok: false, error }`;
  agent-side caller must convert this to a friendly reply (not yet
  wired — belongs in `reception.agent.js`, Task 27).
- Ambiguous/off-topic/unclear input → model asks one clarifying question
  or plainly declines, per Rules 3 and 9. Verified working in testing.

---

## Next Steps (per handbook)
- Day 12: build `reception.agent.js` skeleton (loop wiring, no real tool
  execution yet)
- Day 13-15: mock-backed tool execution for all 4 booking tools
- Day 16-17: wire to real M2 services + real WhatsApp test (blocked
  until Member 2's Firestore/Calendar services and a live webhook exist)
