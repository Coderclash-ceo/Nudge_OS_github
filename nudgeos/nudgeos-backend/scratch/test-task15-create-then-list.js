require("dotenv").config();
const { createEvent, cancelEvent, listEvents } = require("../src/services/calendar.service");

const CALENDAR_ID = "46cc968c243eab24b320c445c4fc5760b2cda84ba1ed6f148a1830a3c2ab97b2@group.calendar.google.com";

async function run() {
  console.log("\n--- Creating one event ---");
  const event = await createEvent(CALENDAR_ID, {
    summary: "Test Immediate Consistency",
    description: "edge case test",
    startTime: new Date("2026-09-22T11:00:00+05:30"),
    endTime: new Date("2026-09-22T11:30:00+05:30"),
  });
  console.log("Created event:", event.id);

  console.log("\n--- Immediately listing events for that day ---");
  const dayStart = new Date("2026-09-22T00:00:00+05:30");
  const dayEnd = new Date("2026-09-22T23:59:59+05:30");
  const events = await listEvents(CALENDAR_ID, dayStart, dayEnd);

  const found = events.find((e) => e.id === event.id);
  console.log("Found immediately after create?", !!found);
  console.log("Expected: true");

  console.log("\n--- Cleaning up ---");
  await cancelEvent(CALENDAR_ID, event.id);
  console.log("Cleanup done.");
}

run()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("FAILED:", err);
    process.exit(1);
  });