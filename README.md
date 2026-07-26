# Nudge OS — Backend

Multi-agent AI SaaS platform for local service businesses (salons, clinics,
repair shops), operating entirely through WhatsApp and Instagram.

**Team:** Algorithm Avengers
**Project:** S.V.K.M.'s Shri Bhagubhai Mafatlal Polytechnic, Mumbai — Diploma in
Computer Engineering, Final Year Capstone

## Team Roles

- **Member 1 (Agent Developer):** Owns `src/agents/` in full — the system
  prompt, tool schema, and execution loop for all five agents (Reception,
  Retention, Revenue, Insight, Onboarding), plus the shared `llm.service.js`
  wrapper every agent calls through.
- **Member 2 (Backend):** Express server, webhooks, Firestore service layer,
  calendar integration, scheduler/cron jobs.
- **Member 3 (Frontend):** React owner dashboard.

## Architecture

Nudge OS is a hosted, multi-tenant SaaS platform. Customers never see a
website — they interact purely via WhatsApp/Instagram. The only human-facing
UI is the owner's dashboard. All data is scoped by `businessId`; incoming
webhooks map a WhatsApp number to the correct business before any agent runs.

Five coordinated AI agents (an orchestrator/router pattern) handle customer
communication, booking, proactive retention, and business intelligence:

- **Reception Agent** — talks to customers directly over WhatsApp/Instagram
- **Retention Agent** — proactively re-engages customers inactive 25–30 days
- **Revenue Agent** — spots underbooked slots, alerts the owner
- **Insight Agent** — aggregates business data into dashboard statistics
- **Onboarding Agent** — turns a pasted business description into structured setup data

## Status

Early build — Week 1 of a 12-week roadmap. See the project handbook for the
full day-by-day plan.
