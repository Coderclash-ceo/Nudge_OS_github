// src/services/llm.service.js
//
// Provider: Google Gemini (free tier), via the official @google/genai SDK.
//
// IMPORTANT: every other file in agents/ (prompts, tools, agent loops) was
// written against an Anthropic-shaped response: { stop_reason, content: [...] }
// where content blocks look like { type: "text", text } or
// { type: "tool_use", id, name, input }.
//
// To avoid rewriting every agent file, this wrapper:
//   1. Accepts the exact same inputs your agents already pass
//      (systemPrompt: string, tools: Anthropic-style array with input_schema,
//       messages: Anthropic-style array with role/content)
//   2. Translates them into Gemini's shape internally
//   3. Translates Gemini's response back into the Anthropic shape
//
// callAgent() itself is a drop-in replacement - nothing downstream needs to change.
//
// FIX (11 Aug 2026): Gemini 3.x thinking models require a thought_signature
// to be preserved and echoed back on every functionCall part during
// multi-turn tool calling, or the API rejects the request with a 400 error.
// This wrapper now captures thoughtSignature from tool_use responses and
// replays it when that tool_use block is sent back in a later turn.
// See: https://ai.google.dev/gemini-api/docs/thought-signatures

const { GoogleGenAI } = require("@google/genai");

const client = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
const MODEL = "gemini-3.6-flash"; // current free-tier model with function calling support (as of July 2026)

// ---- Anthropic tool schema -> Gemini functionDeclarations ----
function convertTools(anthropicTools) {
  if (!anthropicTools || !anthropicTools.length) return undefined;
  return [
    {
      functionDeclarations: anthropicTools.map((t) => ({
        name: t.name,
        description: t.description,
        parameters: t.input_schema, // same JSON Schema shape, Gemini accepts it directly
      })),
    },
  ];
}

// ---- Anthropic messages[] -> Gemini contents[] ----
// Handles plain string content, and the tool_use/tool_result block pattern
// from Task 8 of the handbook (the two-turn tool round-trip).
function convertMessages(messages) {
  const contents = [];
  for (const msg of messages) {
    const role = msg.role === "assistant" ? "model" : "user";

    if (typeof msg.content === "string") {
      contents.push({ role, parts: [{ text: msg.content }] });
      continue;
    }

    // content is an array of blocks (tool_use / tool_result / text)
    const parts = [];
    for (const block of msg.content) {
      if (block.type === "text") {
        parts.push({ text: block.text });
      } else if (block.type === "tool_use") {
        const fcPart = { functionCall: { name: block.name, args: block.input } };
        if (block._thoughtSignature) fcPart.thoughtSignature = block._thoughtSignature;
        parts.push(fcPart);
      } else if (block.type === "tool_result") {
        let responseData;
        try {
          responseData = JSON.parse(block.content);
        } catch {
          responseData = { result: block.content };
        }
        parts.push({
          functionResponse: {
            name: block.name || "unknown_tool", // see note below
            response: responseData,
          },
        });
      }
    }
    contents.push({ role, parts });
  }
  return contents;
}
// NOTE: Gemini's functionResponse needs the tool NAME, not an id, unlike
// Anthropic's tool_use_id. When you build the tool_result block in your
// agent loop, include `name: toolUseBlock.name` alongside tool_use_id so
// this converter can find it. (Anthropic ignores the extra field, so this
// is safe either way if you ever swap back.)

// ---- Gemini response -> Anthropic-shaped { stop_reason, content } ----
function normalizeResponse(geminiResponse) {
  const content = [];
  const candidate = geminiResponse.candidates?.[0];
  const parts = candidate?.content?.parts || [];

  let hasToolCall = false;
  for (const part of parts) {
    if (part.functionCall) {
      hasToolCall = true;
      content.push({
        type: "tool_use",
        id: "call_" + Math.random().toString(36).slice(2, 10),
        name: part.functionCall.name,
        input: part.functionCall.args || {},
        _thoughtSignature: part.thoughtSignature || undefined,
      });
    } else if (part.text) {
      content.push({ type: "text", text: part.text });
    }
  }

  return {
    stop_reason: hasToolCall ? "tool_use" : "end_turn",
    content,
  };
}

/**
 * @param {string} systemPrompt
 * @param {Array} tools - Anthropic-style tool array, or [] / omitted for no tools
 * @param {Array} messages - [{role:"user"|"assistant", content:...}]
 * @returns {Promise<{ok:boolean, response?:object, error?:string}>}
 */
async function callAgent(systemPrompt, tools, messages) {
  try {
    const params = {
      model: MODEL,
      contents: convertMessages(messages),
      config: {
        systemInstruction: systemPrompt,
      },
    };

    const geminiTools = convertTools(tools);
    if (geminiTools) params.config.tools = geminiTools;

    const geminiResponse = await client.models.generateContent(params);
    const response = normalizeResponse(geminiResponse);
    return { ok: true, response };
  } catch (err) {
    console.error("[llm.service] callAgent failed:", err.message);
    return { ok: false, error: err.message };
  }
}

module.exports = { callAgent, MODEL };