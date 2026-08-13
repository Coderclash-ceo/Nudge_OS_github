// src/agents/reception/reception.mocks.js
// TEMPORARY - delete once Member 2's real calendar.service.js / firestore.service.js exist

function mockCheckAvailability({ service, date }) {
  return ["10:00 AM", "02:00 PM", "04:30 PM"];
}

function mockCreateBooking({ customerName, service, date, time }) {
  if (!customerName || !service || !date || !time) {
    return { error: "missing_fields" };
  }
  console.log("[MOCK] booking created:", { customerName, service, date, time });
  return { success: true, bookingId: "mock-" + Date.now() };
}

function mockFindBooking({ customerName, roughDate, service }) {
  if (!customerName) {
    return { error: "missing_fields" };
  }
  // Stubbed: pretend we found exactly one matching booking
  console.log("[MOCK] booking found for:", customerName);
  return {
    bookingId: "mock-123",
    matchedService: service || "haircut",
    matchedDate: roughDate || "unknown",
  };
}

function mockCancelBooking({ bookingId }) {
  if (!bookingId) {
    return { error: "missing_fields" };
  }
  console.log("[MOCK] booking cancelled:", bookingId);
  return { success: true };
}

function mockRescheduleBooking({ bookingId, newDate, newTime }) {
  if (!bookingId || !newDate || !newTime) {
    return { error: "missing_fields" };
  }
  console.log("[MOCK] booking rescheduled:", bookingId, "->", newDate, newTime);
  return { success: true, newDate, newTime };
}

module.exports = {
  mockCheckAvailability,
  mockCreateBooking,
  mockFindBooking,
  mockCancelBooking,
  mockRescheduleBooking,
};