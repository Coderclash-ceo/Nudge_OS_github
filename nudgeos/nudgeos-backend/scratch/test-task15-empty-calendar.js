require("dotenv").config();
const { listEvents, getCalendarGaps } = require("../src/services/calendar.service");

const CALENDAR_ID = "46cc968c243eab24b320c445c4fc5760b2cda84ba1ed6f148a1830a3c2ab97b2@group.calendar.google.com";

async function run() {
  // Pick a date you know has NO events on it — adjust if needed
  const testDate = new Date("2026-09-20");
  const dayStart = new Date("2026-09-20T00:00:00");
  const dayEnd = new Date("2026-09-20T23:59:59");

  console.log("\n--- TEST: listEvents on empty day ---");
  const events = await listEvents(CALENDAR_ID, dayStart, dayEnd);
  console.log("Events found:", events);
  console.log("Expected: [] (empty array)");

  console.log("\n--- TEST: getCalendarGaps on empty day ---");
  const gaps = await getCalendarGaps(CALENDAR_ID, testDate, "10:00", "20:00");
  console.log("Gaps found:", gaps);
  console.log("Expected: one single gap covering the full 10:00-20:00 window");
}

run()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("FAILED:", err);
    process.exit(1);
  });