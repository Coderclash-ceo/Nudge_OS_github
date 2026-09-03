// src/agents/revenue/revenue.agent.js

const { callAgent } = require("../../services/llm.service");

const REVENUE_PROMPT = `You write short, specific alerts for a business owner about underbooked time slots.

Rules:
- Be concrete: name the day/time pattern.
- Suggest one practical action (e.g. a promo for that slot).
- Max 2 sentences.
- This is an internal owner-facing alert, never sent to customers directly.`;

// TEMPORARY mock - replace with Member 2's getCalendarGaps(businessId) once Calendar service is ready
function mockGetCalendarGaps() {
  return [
    { day: "Thursday", window: "14:00-17:00", weeksObserved: 3 },
  ];
}

async function runRevenueAgent(business) {
  const gaps = mockGetCalendarGaps();
  if (!gaps.length) return null;

  const result = await callAgent(REVENUE_PROMPT, [], [
    {
      role: "user",
      content: `Business: ${business.name}. Gap pattern: ${JSON.stringify(gaps)}`
    }
  ]);

  if (!result.ok) return { error: result.error };

  const text = result.response.content.find((b) => b.type === "text");
  return text ? { alert: text.text } : null;
}

module.exports = { runRevenueAgent };