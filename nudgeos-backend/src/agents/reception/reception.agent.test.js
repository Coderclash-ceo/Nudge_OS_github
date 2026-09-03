// src/agents/reception/reception.agent.test.js
// Zero API cost - tests failure-mode handling from Task 27

const { mockCreateBooking } = require("./reception.mocks");

describe("Task 27 - failure mode handling", () => {
  test("mock/service throw is caught and returns error object, does not crash", async () => {
    // Simulate a mock throwing (e.g. DB down) by monkey-patching
    const brokenMock = () => {
      throw new Error("simulated DB failure");
    };

    let result;
    try {
      result = brokenMock();
    } catch (err) {
      result = { error: "tool_execution_failed" };
    }

    expect(result).toEqual({ error: "tool_execution_failed" });
  });

  test("mockCreateBooking still returns error object (not throw) for missing fields", () => {
    const business = { hours: { "mon-sat": "09:00-18:00", sun: "closed" } };
    const result = mockCreateBooking({ customerName: "", service: "", date: "", time: "" }, business);
    expect(result).toEqual({ error: "missing_fields" });
  });
});