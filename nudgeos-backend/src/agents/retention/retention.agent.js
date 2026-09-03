// src/agents/retention/retention.agent.js

const { callAgent } = require("../../services/llm.service");

const RETENTION_PROMPT = `You write short, warm WhatsApp win-back messages for a local service business.

Rules:
- Mention the customer's name and their last service if known.
- No discount promises unless explicitly told to include one.
- One short paragraph, no more than 3 sentences.
- Do not sound like a mass marketing blast - make it feel personal.`;

// TEMPORARY mock - replace with Member 2's getInactiveCustomers(businessId, 25, 30) once Firestore is ready
function mockGetInactiveCustomers() {
  return [
    { id: "cust1", name: "Raj", lastService: "haircut", lastVisit: "2026-08-05" },
    { id: "cust2", name: "Priya", lastService: "facial", lastVisit: "2026-08-03" },
    { id: "cust3", name: "Aman", lastService: null, lastVisit: "2026-08-01" },
  ];
}

async function runRetentionAgent(business) {
  const customers = mockGetInactiveCustomers();
  const drafts = [];

  for (const customer of customers) {
    const result = await callAgent(RETENTION_PROMPT, [], [
      {
        role: "user",
        content: `Customer: ${customer.name}, last service: ${customer.lastService || "unknown"}, business: ${business.name}`
      }
    ]);

    if (result.ok) {
      const text = result.response.content.find((b) => b.type === "text");
      drafts.push({ customerId: customer.id, message: text ? text.text : null });
    } else {
      drafts.push({ customerId: customer.id, message: null, error: result.error });
    }
  }

  return drafts; // logged only for now - sending is a later task, per handbook Task 19/20 split
}

module.exports = { runRetentionAgent };