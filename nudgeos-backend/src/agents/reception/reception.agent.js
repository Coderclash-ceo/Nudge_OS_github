// src/agents/reception/reception.agent.js

const { callAgent } = require("../../services/llm.service");
const { buildReceptionPrompt } = require("./reception.prompt");
const { receptionTools } = require("./reception.tools");

async function handleReceptionMessage(business, conversationHistory, incomingMessage) {
  const todayDate = new Date().toISOString().split("T")[0];
  const systemPrompt = buildReceptionPrompt(business, todayDate);
  const messages = [
    ...conversationHistory,
    { role: "user", content: incomingMessage },
  ];

  const result = await callAgent(systemPrompt, receptionTools, messages);
  if (!result.ok) {
    return { reply: "Sorry, I'm having trouble right now - please try again in a moment." };
  }

  const toolUseBlock = result.response.content.find((b) => b.type === "tool_use");
  if (toolUseBlock) {
    // Week 3 skeleton stage: log only, don't execute yet (Task 8+ adds real execution)
    console.log("[reception.agent] would call tool:", toolUseBlock.name, toolUseBlock.input);
    return { reply: "Got it, one moment while I check that for you." };
  }

  const textBlock = result.response.content.find((b) => b.type === "text");
  return { reply: textBlock ? textBlock.text : "Sorry, could you rephrase that?" };
}

module.exports = { handleReceptionMessage };