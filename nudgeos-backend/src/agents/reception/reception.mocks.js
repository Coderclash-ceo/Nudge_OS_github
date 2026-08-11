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

module.exports = { mockCheckAvailability, mockCreateBooking };