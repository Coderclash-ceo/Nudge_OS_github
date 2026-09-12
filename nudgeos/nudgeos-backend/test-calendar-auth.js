require("dotenv").config();
const { listAvailableSlots } = require("./src/services/calendar.service");

async function main() {
  const slots = await listAvailableSlots("test-business-1", "haircut", new Date());
  console.log("Available slots today:", slots);
}

main().catch((err) => {
  console.error("Test failed:", err.message);
});