// src/agents/insight/insight.agent.js

const { callAgent } = require("../../services/llm.service");
const { getBusinessStatsRaw } = require("../../services/firestore.service");

const INSIGHT_PROMPT = `You receive pre-computed business statistics as JSON.

Summarise them into exactly this structure, using ONLY the numbers provided - never invent or estimate a number that isn't given:

{
  "totalBookingsThisMonth": number,
  "busiestHour": string,
  "atRiskCustomerCount": number,
  "headline": string
}

Respond with ONLY the JSON.`;

// Aggregation happens in code, NOT in the LLM - per handbook Task 29/33 design principle.
function computeStats(raw) {
  const { bookings = [], customers = [] } = raw;

  const now = new Date();
  const thisMonth = now.getMonth();
  const thisYear = now.getFullYear();
  const totalBookingsThisMonth = bookings.filter((b) => {
    if (!b.date) return false;
    const d = new Date(b.date);
    return d.getMonth() === thisMonth && d.getFullYear() === thisYear;
  }).length;

  const hourCounts = {};
  bookings.forEach((b) => {
    if (b.time) hourCounts[b.time] = (hourCounts[b.time] || 0) + 1;
  });
  let busiestHour = "unknown";
  let maxCount = 0;
  for (const [hour, count] of Object.entries(hourCounts)) {
    if (count > maxCount) {
      maxCount = count;
      busiestHour = hour;
    }
  }

  const cutoff = new Date(Date.now() - 25 * 86400000);
  const atRiskCustomerCount = customers.filter((c) => {
    if (!c.lastVisit) return false;
    return new Date(c.lastVisit) < cutoff;
  }).length;

  return { totalBookingsThisMonth, busiestHour, atRiskCustomerCount };
}

async function runInsightAgent(businessId) {
  const raw = await getBusinessStatsRaw(businessId);
  const computed = computeStats(raw);

  const result = await callAgent(INSIGHT_PROMPT, [], [
    { role: "user", content: JSON.stringify(computed) }
  ]);

  if (!result.ok) return { error: result.error };

  const text = result.response.content.find((b) => b.type === "text");
  try {
    return JSON.parse(text.text);
  } catch (e) {
    return { error: "invalid_json" };
  }
}

module.exports = { runInsightAgent, computeStats };