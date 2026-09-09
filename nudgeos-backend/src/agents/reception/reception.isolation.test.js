// src/agents/reception/reception.isolation.test.js
// Task 28 - Multi-tenancy isolation test (mock-level, zero API cost)

const {
  mockCreateBooking,
  mockCancelBooking,
  mockRescheduleBooking,
} = require("./reception.mocks");

const businessA = {
  businessId: "business-A",
  hours: { "mon-sat": "09:00-18:00", sun: "closed" },
};

const businessB = {
  businessId: "business-B",
  hours: { "mon-sat": "09:00-18:00", sun: "closed" },
};

describe("Task 28 - multi-tenancy isolation", () => {
  test("booking created under Business A cannot be cancelled via Business B", () => {
    const created = mockCreateBooking(
      { customerName: "Raj", service: "haircut", date: "2026-08-17", time: "10:00 AM" },
      businessA
    );
    expect(created.success).toBe(true);

    const cancelAttempt = mockCancelBooking(
      { bookingId: created.bookingId },
      businessB
    );

    expect(cancelAttempt.error).toBe("not_found");
  });

  test("booking created under Business A cannot be rescheduled via Business B", () => {
    const created = mockCreateBooking(
      { customerName: "Priya", service: "facial", date: "2026-08-18", time: "02:00 PM" },
      businessA
    );
    expect(created.success).toBe(true);

    const rescheduleAttempt = mockRescheduleBooking(
      { bookingId: created.bookingId, newDate: "2026-08-19", newTime: "11:00 AM" },
      businessB
    );

    expect(rescheduleAttempt.error).toBe("not_found");
  });

  test("booking created and cancelled under the SAME business succeeds normally", () => {
    const created = mockCreateBooking(
      { customerName: "Aman", service: "haircut", date: "2026-08-20", time: "10:00 AM" },
      businessA
    );
    expect(created.success).toBe(true);

    const cancelled = mockCancelBooking(
      { bookingId: created.bookingId },
      businessA
    );

    expect(cancelled.success).toBe(true);
  });

  test("create_booking without businessId is rejected", () => {
    const result = mockCreateBooking(
      { customerName: "Raj", service: "haircut", date: "2026-08-17", time: "10:00 AM" },
      {}
    );
    expect(result.error).toBe("missing_business_context");
  });
});