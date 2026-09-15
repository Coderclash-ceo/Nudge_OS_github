require("dotenv").config();
const {
  createCalendarBooking,
  cancelCalendarBooking,
  rescheduleCalendarBooking,
} = require("../src/services/calendar.service");

async function run() {
  const businessId = "test-business-1";

  console.log("\n--- STEP 1: createCalendarBooking ---");
  const bookingInput = {
    customerName: "Test Customer",
    service: "haircut",
    date: new Date("2026-09-16"),
    time: "15:00",
  };
  console.log("Input:", bookingInput);

  const created = await createCalendarBooking(businessId, bookingInput);
  console.log("Output:", created);
  console.log("-> Check Google Calendar UI: event should show 15:00-15:30, titled 'haircut - Test Customer'");
  console.log("-> Check Firestore: businesses/test-business-1/bookings/" + created.bookingId);

  const bookingId = created.bookingId;

  console.log("\n--- STEP 2: rescheduleCalendarBooking ---");
  const rescheduleInput = { date: new Date("2026-09-16"), time: "17:00" };
  console.log("Input:", { bookingId, ...rescheduleInput });
  const rescheduled = await rescheduleCalendarBooking(businessId, bookingId, rescheduleInput);
  console.log("Output:", rescheduled);
  console.log("-> Check Google Calendar UI: same event should now show 17:00-17:30");

  console.log("\n--- STEP 3: cancelCalendarBooking ---");
  const cancelled = await cancelCalendarBooking(businessId, bookingId);
  console.log("Output:", cancelled);
  console.log("-> Check Google Calendar UI: event should be gone entirely");
}

run()
  .then(() => {
    console.log("\nDone.");
    process.exit(0);
  })
  .catch((err) => {
    console.error("\nFAILED:", err);
    process.exit(1);
  });