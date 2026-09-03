// src/agents/retention/retention.agent.js

const { callAgent } = require("../../services/llm.service");
const { getInactiveCustomers } = require("../../services/firestore.service");

const RETENTION_PROMPT = `You write short, warm WhatsApp win-back messages for a local service business.

Rules:
- Mention the customer's name and their last service if known.
- No discount promises unless explicitly told to include one.
- One short paragraph, no more than 3 sentences.
- Do not sound like a mass marketing blast - make it feel personal.`;

async function runRetentionAgent(business) {
  const customers = await getInactiveCustomers(business.businessId, 25, 30);
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