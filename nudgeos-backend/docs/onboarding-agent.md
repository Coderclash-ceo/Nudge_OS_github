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