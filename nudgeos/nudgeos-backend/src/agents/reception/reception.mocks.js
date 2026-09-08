// src/agents/reception/reception.mocks.js
// TEMPORARY - delete once Member 2's real calendar.service.js / firestore.service.js exist

function mockCheckAvailability({ service, date }) {
  return ["10:00 AM", "02:00 PM", "04:30 PM"];
}
function mockCheckAvailabilityEmpty({ service, date }) {
  return []; // simulates a fully booked date
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

// --- Multi-tenancy isolation (Task 28) ---
const mockBookingOwners = new Map(); // bookingId -> businessId

function mockCreateBooking({ customerName, service, date, time }, business) {
  if (!customerName || !service || !date || !time) {
    return { error: "missing_fields" };
  }
  if (!business || !business.businessId) {
    return { error: "missing_business_context" };
  }
  if (!isWithinBusinessHours(business, date, time)) {
    return { error: "outside_business_hours" };
  }
  if (isSlotTaken(date, time)) {
    return { error: "slot_taken" };
  }
  const bookingId = "mock-" + Date.now();
  mockBookingOwners.set(bookingId, business.businessId);
  console.log("[MOCK] booking created:", { customerName, service, date, time, businessId: business.businessId });
  return { success: true, bookingId };
}

function mockFindBooking({ customerName, roughDate, service }, business) {
  if (!customerName) {
    return { error: "missing_fields" };
  }
  if (!business || !business.businessId) {
    return { error: "missing_business_context" };
  }
  console.log("[MOCK] booking found for:", customerName, "businessId:", business.businessId);
  return {
    bookingId: "mock-123",
    matchedService: service || "haircut",
    matchedDate: roughDate || "unknown",
  };
}

function mockCancelBooking({ bookingId }, business) {
  if (!bookingId) {
    return { error: "missing_fields" };
  }
  if (!business || !business.businessId) {
    return { error: "missing_business_context" };
  }
  const ownerBusinessId = mockBookingOwners.get(bookingId);
  if (ownerBusinessId && ownerBusinessId !== business.businessId) {
    console.error("[MOCK] cross-business cancel attempt blocked:", { bookingId, requestedBy: business.businessId, ownedBy: ownerBusinessId });
    return { error: "not_found" };
  }
  console.log("[MOCK] booking cancelled:", bookingId, "businessId:", business.businessId);
  return { success: true };
}

function mockRescheduleBooking({ bookingId, newDate, newTime }, business) {
  if (!bookingId || !newDate || !newTime) {
    return { error: "missing_fields" };
  }
  if (!business || !business.businessId) {
    return { error: "missing_business_context" };
  }
  const ownerBusinessId = mockBookingOwners.get(bookingId);
  if (ownerBusinessId && ownerBusinessId !== business.businessId) {
    console.error("[MOCK] cross-business reschedule attempt blocked:", { bookingId, requestedBy: business.businessId, ownedBy: ownerBusinessId });
    return { error: "not_found" };
  }
  console.log("[MOCK] booking rescheduled:", bookingId, "->", newDate, newTime, "businessId:", business.businessId);
  return { success: true, newDate, newTime };
}
module.exports = {
  mockCheckAvailability,
  mockCheckAvailabilityEmpty,
  mockCreateBooking,
  mockFindBooking,
  mockCancelBooking,
  mockRescheduleBooking,
  isWithinBusinessHours,
  isSlotTaken,
};