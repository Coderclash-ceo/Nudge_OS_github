# Insight Agent — Documentation

**Type:** On-demand (dashboard-triggered)
**Trigger:** Owner opens dashboard, or M2's insights.routes.js calls it

## Purpose
Aggregates business data into structured, dashboard-renderable statistics.

## Key Design Principle
Aggregation happens in CODE (`computeStats()`), never in the LLM - the model only phrases a natural-language headline from already-correct numbers. This prevents the LLM from silently miscounting.

## Prompt Summary
Receives pre-computed JSON stats, returns strict JSON: totalBookingsThisMonth, busiestHour, atRiskCustomerCount, headline. Never invents numbers.

## Data Source
`getBusinessStatsRaw(businessId)` from M2's firestore.service.js - returns raw `{bookings, customers}` arrays, which `computeStats()` then aggregates.

## Tools
None.

## Status
- `computeStats()` unit-verified with mock raw data, zero API cost — **5/5 correct, confirmed 8 Sep**
- LLM summarization step verified with real API call, correct JSON output
- Full end-to-end (real Firestore) NOT yet tested - blocked on M2's Firebase config

## Known Limitations
End-to-end real-data test pending M2.