
// Zero API cost - mocks llm.service so no real API call happens
jest.mock("../../services/llm.service", () => ({
  callAgent: jest.fn(),
}));

const { callAgent } = require("../../services/llm.service");
const { handleReceptionMessage } = require("./reception.agent");

describe("Task 27 - LLM API failure handling", () => {
  test("returns friendly fallback reply when callAgent fails", async () => {
    callAgent.mockResolvedValue({ ok: false });

    const business = { hours: { "mon-sat": "09:00-18:00", sun: "closed" } };
    const result = await handleReceptionMessage(business, [], "book me a haircut tomorrow");

    expect(result.reply).toBe(
      "Sorry, I'm having trouble right now - please try again in a moment."
    );
    expect(callAgent).toHaveBeenCalledTimes(1);
  });
});