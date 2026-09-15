require("dotenv").config();
const { createEvent, rescheduleEvent, cancelEvent, listEvents } = require("../src/services/calendar.service");

const CALENDAR_ID = "46cc968c243eab24b320c445c4fc5760b2cda84ba1ed6f148a1830a3c2ab97b2@group.calendar.google.com";

async function run() {
  console.log("\n--- Creating event at 09:00-09:30 ---");
  const event = await createEvent(CALENDAR_ID, {
    summary: "Test rescheduleEvent",
    description: "edge case test",
    startTime: new Date("2026-09-24T09:00:00+05:30"),
    endTime: new Date("2026-09-24T09:30:00+05:30"),
  });
  console.log("Created:", event.id);

  console.log("\n--- Rescheduling to 16:00-16:30 ---");
  const updated = await rescheduleEvent(CALENDAR_ID, event.id, {
    newStartTime: new Date("2026-09-24T16:00:00+05:30"),
    newEndTime: new Date("2026-09-24T16:30:00+05:30"),
  });
  console.log("Updated event start:", updated.start);
  console.log("Updated event end:", updated.end);
  console.log("Expected start ~10:30 UTC (16:00 IST), end ~11:00 UTC (16:30 IST)");

  console.log("\n--- Cleaning up ---");
  await cancelEvent(CALENDAR_ID, event.id);
  console.log("Done.");
}

run()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("FAILED:", err);
    process.exit(1);
  });