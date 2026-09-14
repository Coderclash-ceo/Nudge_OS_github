// src/agents/onboarding/onboarding.agent.js

const { callAgent } = require("../../services/llm.service");

const ONBOARDING_PROMPT = `Extract structured business information from the text provided.

Respond with ONLY valid JSON, no other text, in exactly this shape:

{
  "services": [{ "name": string, "price": number|null }],
  "hours": {
    "mon": string|null,
    "tue": string|null,
    "wed": string|null,
    "thu": string|null,
    "fri": string|null,
    "sat": string|null,
    "sun": string|null
  }
}

Each day's value should be the hours (e.g. "10:00 AM - 8:00 PM") or
"closed" if that day is explicitly closed. If a range like "Mon-Fri" is
given, apply the same hours to each individual day - never group days
into a single field, since some days may have exceptions (e.g. "open
daily except Tuesday" means every day gets the same hours EXCEPT tue,
which gets "closed").

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

  if (!text) {
    return { error: "no_text_response" };
  }

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