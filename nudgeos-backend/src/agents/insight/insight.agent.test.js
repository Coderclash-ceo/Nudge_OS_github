// src/agents/insight/insight.agent.test.js
const { computeStats } = require("./insight.agent");

describe("Insight Agent - computeStats (code-side aggregation, Task 33)", () => {
  test("counts only bookings from the current month", () => {
    const now = new Date();
    const thisMonthDate = new Date(now.getFullYear(), now.getMonth(), 15).toISOString().split("T")[0];
    const lastMonthDate = new Date(now.getFullYear(), now.getMonth() - 1, 15).toISOString().split("T")[0];

    const raw = {
      bookings: [
        { date: thisMonthDate, time: "10:00 AM" },
        { date: thisMonthDate, time: "10:00 AM" },
        { date: lastMonthDate, time: "10:00 AM" },
      ],
      customers: [],
    };

    const result = computeStats(raw);
    expect(result.totalBookingsThisMonth).toBe(2);
  });

  test("finds the busiest hour correctly", () => {
    const raw = {
      bookings: [
        { date: "2026-09-01", time: "10:00 AM" },
        { date: "2026-09-02", time: "02:00 PM" },
        { date: "2026-09-03", time: "02:00 PM" },
        { date: "2026-09-04", time: "02:00 PM" },
      ],
      customers: [],
    };

    const result = computeStats(raw);
    expect(result.busiestHour).toBe("02:00 PM");
  });

  test("counts at-risk customers (no visit in 25+ days)", () => {
    const oldDate = new Date(Date.now() - 30 * 86400000).toISOString();
    const recentDate = new Date(Date.now() - 5 * 86400000).toISOString();

    const raw = {
      bookings: [],
      customers: [
        { name: "Old Customer", lastVisit: oldDate },
        { name: "Recent Customer", lastVisit: recentDate },
      ],
    };

    const result = computeStats(raw);
    expect(result.atRiskCustomerCount).toBe(1);
  });

  test("handles empty raw data without crashing", () => {
    expect(() => computeStats({ bookings: [], customers: [] })).not.toThrow();
  });

  test("handles missing bookings/customers keys gracefully", () => {
    expect(() => computeStats({})).not.toThrow();
  });
});