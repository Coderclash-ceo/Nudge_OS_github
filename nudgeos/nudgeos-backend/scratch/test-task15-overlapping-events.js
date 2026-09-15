require("dotenv").config();
const { createEvent, cancelEvent, listEvents, getCalendarGaps } = require("../src/services/calendar.service");

const CALENDAR_ID = "46cc968c243eab24b320c445c4fc5760b2cda84ba1ed6f148a1830a3c2ab97b2@group.calendar.google.com";

async function run() {
  const testDate = new Date("2026-09-21");

  console.log("\n--- Creating two overlapping events ---");
  // Event A: 12:00 - 13:00
  const eventA = await createEvent(CALENDAR_ID, {
    summary: "Test Overlap A",
    description: "edge case test",
    startTime: new Date("2026-09-21T12:00:00+05:30"),
    endTime: new Date("2026-09-21T13:00:00+05:30"),
  });
  console.log("Created Event A:", eventA.id);

  // Event B: 12:30 - 14:00 (overlaps with A)
  const eventB = await createEvent(CALENDAR_ID, {
    summary: "Test Overlap B",
    description: "edge case test",
    startTime: new Date("2026-09-21T12:30:00+05:30"),
    endTime: new Date("2026-09-21T14:00:00+05:30"),
  });
  console.log("Created Event B:", eventB.id);

  console.log("\n--- TEST: getCalendarGaps with overlapping events ---");
  const gaps = await getCalendarGaps(CALENDAR_ID, testDate, "10:00", "20:00");
  console.log("Gaps found:", gaps);
  console.log("Expected: TWO gaps — one 10:00-12:00, one 14:00-20:00. NOT three gaps, and no gap between 12:00-14:00.");

  console.log("\n--- Cleaning up: deleting both test events ---");
  await cancelEvent(CALENDAR_ID, eventA.id);
  await cancelEvent(CALENDAR_ID, eventB.id);
  console.log("Cleanup done.");
}

run()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("FAILED:", err);
    process.exit(1);
  });