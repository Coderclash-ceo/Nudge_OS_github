// src/agents/reception/reception.mocks.js
// TEMPORARY - delete once Member 2's real calendar.service.js / firestore.service.js exist

function mockCheckAvailability({ service, date }) {
  // Pretend every day has these 3 slots free
  return ["10:00 AM", "02:00 PM", "04:30 PM"];
}

module.exports = { mockCheckAvailability };