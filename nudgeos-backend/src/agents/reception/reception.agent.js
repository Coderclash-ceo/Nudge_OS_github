// src/agents/reception/reception.agent.js

const { callAgent } = require("../../services/llm.service");
const { buildReceptionPrompt } = require("./reception.prompt");
const { receptionTools } = require("./reception.tools");
const {
  mockCheckAvailability,
  mockCreateBooking,
  mockFindBooking,
  mockCancelBooking,
  mockRescheduleBooking,
} = require("./reception.mocks");

function buildMessageWindow(fullHistory, incomingMessage, maxTurns = 10) {
  const recent = fullHistory.slice(-maxTurns);
  return [...recent, { role: "user", content: incomingMessage }];
}

async function executeTool(name, input, business) {
  if (name === "check_availability") {
    const slots = mockCheckAvailability(input);
    return { slots };
  }
  if (name === "create_booking") {
    return mockCreateBooking(input, business);
  }
  if (name === "find_booking") {
    return mockFindBooking(input, business);
  }
  if (name === "cancel_booking") {
    return mockCancelBooking(input, business);
  }
  if (name === "reschedule_booking") {
    return mockRescheduleBooking(input, business);
  }
  return { error: "unknown_tool" };
} 

async function handleReceptionMessage(business, conversationHistory, incomingMessage) {
  const todayDate = new Date().toISOString().split("T")[0];
  const systemPrompt = buildReceptionPrompt(business, todayDate);
 const messages = buildMessageWindow(conversationHistory, incomingMessage);
  const result = await callAgent(systemPrompt, receptionTools, messages);
  if (!result.ok) {
    return { reply: "Sorry, I'm having trouble right now - please try again in a moment." };
  }

  const toolUseBlock = result.response.content.find((b) => b.type === "tool_use");
  if (toolUseBlock) {
    let toolResult;
    try {
      toolResult = await executeTool(toolUseBlock.name, toolUseBlock.input, business);
    } catch (err) {
      console.error("[reception.agent] executeTool failed:", err.message);
      toolResult = { error: "tool_execution_failed" };
    }

    const followUp = await callAgent(systemPrompt, receptionTools, [
      ...messages,
      { role: "assistant", content: result.response.content },
      {
        role: "user",
        content: [
          {
            type: "tool_result",
            tool_use_id: toolUseBlock.id,
            name: toolUseBlock.name,
            content: JSON.stringify(toolResult),
          },
        ],
      },
    ]);

    if (!followUp.ok) {
      return { reply: "Sorry, I'm having trouble right now - please try again in a moment." };
    }

    const finalText = followUp.response.content.find((b) => b.type === "text");
    return { reply: finalText ? finalText.text : "Here's what I found." };
  }

  const textBlock = result.response.content.find((b) => b.type === "text");
  return { reply: textBlock ? textBlock.text : "Sorry, could you rephrase that?" };
}

module.exports = { handleReceptionMessage };