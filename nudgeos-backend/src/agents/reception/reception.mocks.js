// src/agents/reception/reception.mocks.js
// TEMPORARY - delete once Member 2's real calendar.service.js / firestore.service.js exist

function mockCheckAvailability({ service, date }) {
  return ["10:00 AM", "02:00 PM", "04:30 PM"];
}

// --- Business-hours guard (Task 25) ---
function getDayKey(dateStr) {
  const day = new Date(dateStr + "T00:00:00").getDay(); // 0=Sun, 1=Mon, ... 6=Sat
  return day === 0 ? "sun" : "mon-sat";
}

function to24Hour(time12h) {
  const [time, modifier] = time12h.split(" ");
  let [hours, minutes] = time.split(":");
  if (hours === "12") hours = "00";
  if (modifier === "PM") hours = parseInt(hours, 10) + 12;
  return `${String(hours).padStart(2, "0")}:${minutes}`;
}

function isWithinBusinessHours(business, date, time) {
  const dayKey = getDayKey(date);
  const dayHours = business.hours[dayKey];
  if (!dayHours || dayHours === "closed") return false;

  const [open, close] = dayHours.split("-");
  const time24 = to24Hour(time);
  return time24 >= open && time24 <= close;
}

// --- Double-booking guard (Task 25) ---
const mockExistingBookings = new Set([
  "2026-08-14|02:00 PM",
]);

function isSlotTaken(date, time) {
  return mockExistingBookings.has(`${date}|${time}`);
}

function mockCreateBooking({ customerName, service, date, time }, business) {
  if (!customerName || !service || !date || !time) {
    return { error: "missing_fields" };
  }
  if (!isWithinBusinessHours(business, date, time)) {
    return { error: "outside_business_hours" };
  }
  if (isSlotTaken(date, time)) {
    return { error: "slot_taken" };
  }
  console.log("[MOCK] booking created:", { customerName, service, date, time });
  return { success: true, bookingId: "mock-" + Date.now() };
}

function mockFindBooking({ customerName, roughDate, service }) {
  if (!customerName) {
    return { error: "missing_fields" };
  }
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
  isWithinBusinessHours,
  isSlotTaken,
};