// src/agents/onboarding/onboarding.agent.js

const { callAgent } = require("../../services/llm.service");

const ONBOARDING_PROMPT = `Extract structured business information from the text provided.

Respond with ONLY valid JSON, no other text, in exactly this shape:

{
  "services": [{ "name": string, "price": number|null }],
  "hours": {
    "mon-fri": string|null,
    "sat": string|null,
    "sun": string|null
  }
}

If a field cannot be determined, use null.
Never invent a price or hour that isn't stated or clearly implied.`;

async function runOnboardingAgent(rawText) {
  const result = await callAgent(
    ONBOARDING_PROMPT,
    [],
    [{ role: "user", content: rawText }]
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
      error: "invalid_json",
      raw: text.text
    };
  }
}

module.exports = { runOnboardingAgent };