require("dotenv").config();
const { listAvailableSlots } = require("../src/services/calendar.service");

async function run() {
  const businessId = "test-business-1";

  console.log("\n--- TEST: listAvailableSlots on an empty day ---");
  const slotsEmpty = await listAvailableSlots(businessId, "haircut", new Date("2026-09-23"));
  console.log("Slots:", slotsEmpty);
  console.log("Expected: 30-min slots from 10:00 to 19:30 (last slot starts by 19:30 since close is 20:00)");
}

run()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("FAILED:", err);
    process.exit(1);
  });