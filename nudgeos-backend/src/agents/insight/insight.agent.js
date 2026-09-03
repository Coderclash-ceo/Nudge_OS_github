// src/agents/insight/insight.agent.js

const { callAgent } = require("../../services/llm.service");
const { getBusinessStatsRaw } = require("../../services/firestore.service");

const INSIGHT_PROMPT = `You receive raw aggregated business statistics as JSON.

Summarise them into exactly this structure, using ONLY the numbers provided — never invent or estimate a number that isn't given:

{
  "totalBookingsThisMonth": number,
  "busiestHour": string,
  "atRiskCustomerCount": number,
  "headline": string
}

Respond with ONLY the JSON.`;

async function runInsightAgent(businessId) {
  const raw = await getBusinessStatsRaw(businessId);

  const result = await callAgent(
    INSIGHT_PROMPT,
    [],
    [
      {
        role: "user",
        content: JSON.stringify(raw)
      }
    ]
  );

  if (!result.ok) {
    return { error: result.error };
  }

  const text = result.response.content.find(
    (b) => b.type === "text"
  );

  try {
    return JSON.parse(text.text);
  } catch (e) {
    return {
      error: "invalid_json"
    };
  }
}

module.exports = { runInsightAgent };