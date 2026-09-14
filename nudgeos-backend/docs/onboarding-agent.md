# Onboarding Agent — Documentation

**Type:** One-time (triggered by owner during setup)
**Trigger:** M2's settings.routes.js calls it with pasted business description text

## Purpose
Parses free-text business descriptions or WhatsApp chat dumps into strict structured JSON (services, prices, hours) for self-configuration.

## Prompt Summary
Strict JSON-only output, exact defined shape. Missing fields become `null`, never guessed/invented values.

## Tools
None.

## Status
Tested against 5 messy real-world-style inputs (clean paragraph, missing prices, informal Hinglish, WhatsApp chat dump, missing info). **Formal result: 5/5 PASS.** In every case, missing prices/hours were correctly returned as `null` rather than invented — no hallucinated values observed.

## Known Limitations
None observed in this test round. Larger/edge-case inputs (e.g. multiple locations, non-standard days) not yet tested.


## Schema Fix: 7-Day Hours (14 Sep 2026)

Replaced `mon-fri`/`sat`/`sun` grouped schema with individual `mon`
through `sun` fields. This fixes the inability to represent single-day
exceptions within a range (e.g. "open daily except Tuesday"). Re-tested
against all 4 real cases from Round 2 - now 4/4 clean, machine-readable
output, no free-text workarounds needed.

**BREAKING CHANGE:** this changes the JSON contract Member 3's
dashboard binds against. Must be communicated to M3 before their
confirm/edit UI assumes the old 3-bucket shape.