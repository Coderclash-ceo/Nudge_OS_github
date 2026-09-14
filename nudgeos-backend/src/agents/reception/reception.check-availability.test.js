// src/agents/reception/reception.check-availability.test.js
// Task 28 completeness - verifies check_availability now receives the
// business object consistently with the other 4 tools (fixed 9 Sep 2026)

const { mockCheckAvailability, mockCheckAvailabilityEmpty } = require("./reception.mocks");

describe("check_availability - business parameter consistency", () => {
  const business = {
    businessId: "business-A",
    hours: { "mon-sat": "09:00-18:00", sun: "closed" },
  };

  test("mockCheckAvailability accepts a business object without throwing", () => {
    expect(() => {
      mockCheckAvailability({ service: "haircut", date: "2026-09-15" }, business);
    }).not.toThrow();
  });

  test("mockCheckAvailability returns an array of slots", () => {
    const result = mockCheckAvailability({ service: "haircut", date: "2026-09-15" }, business);
    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBeGreaterThan(0);
  });

  test("mockCheckAvailability works even if business is undefined (defensive check)", () => {
    expect(() => {
      mockCheckAvailability({ service: "haircut", date: "2026-09-15" }, undefined);
    }).not.toThrow();
  });

  test("mockCheckAvailabilityEmpty accepts a business object without throwing", () => {
    expect(() => {
      mockCheckAvailabilityEmpty({ service: "haircut", date: "2026-09-15" }, business);
    }).not.toThrow();
  });

  test("mockCheckAvailabilityEmpty returns an empty array", () => {
    const result = mockCheckAvailabilityEmpty({ service: "haircut", date: "2026-09-15" }, business);
    expect(result).toEqual([]);
  });
});