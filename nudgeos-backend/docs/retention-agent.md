# Retention Agent — Documentation

**Type:** Proactive (cron-triggered, not chat-triggered)
**Trigger:** Daily scheduled run (via M2's cron.js) - iterates every business

## Purpose
Identifies customers inactive 25-30 days, drafts personalized WhatsApp win-back messages.

## Prompt Summary
Warm, personal tone. Mentions customer name + last service if known. No discount promises unless explicitly told. Max 3 sentences. Explicitly avoids sounding like a mass marketing blast.

## Data Source
`getInactiveCustomers(businessId, 25, 30)` from M2's firestore.service.js - code-wired, **not yet end-to-end verified** (M2's config/firebase.js is still an empty placeholder as of 1 Sep 2026).

## Tools
None (no tool-calling, pure text generation).

## Status
- Draft generation: verified with 3 mock customers, all passed quality review (personalized, no hallucinated services, no discount promises)
- Live sending: NOT started (Task 20/21 split - draft-review-first is deliberate per handbook)


## Multi-Language Verification (9 Sep 2026)

Tested with a Hindi/Devanagari service name ("मेहंदी / mehendi") mixed
into an otherwise English prompt. Result: correctly processed, no
encoding issues, model naturally referenced it in English output
without garbling the script. Confirms Gemini adapter handles UTF-8
Devanagari input cleanly end-to-end.


## Known Limitations
- Real Firestore query unverified end-to-end
- No duplicate-send prevention yet (customer flagged inactive on consecutive days could get repeat messages) - flagged as design gap, needs `lastRetentionSentAt` field addition to M2's schema