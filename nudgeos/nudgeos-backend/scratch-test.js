require("dotenv").config();
const { getDoc, getInactiveCustomers, getBusinessStatsRaw } = require("./src/services/firestore.service");
const { resolveBusinessId } = require("./src/middleware/tenantResolver");
const { sendMessage } = require("./src/services/whatsapp.service");

async function main() {
  const business = await getDoc("businesses", "test-business-1");
  console.log("Business:", business);

  const stats = await getBusinessStatsRaw("test-business-1");
  console.log("Stats:", stats);

  const wrongBusiness = await getDoc("businesses", "does-not-exist");
  console.log("Wrong business (should be null):", wrongBusiness);

  const known = await resolveBusinessId("919594652052");
  console.log("Known number resolves to:", known);

  const unknown = await resolveBusinessId("911111111111");
  console.log("Unknown number resolves to:", unknown);

  const sendResult = await sendMessage("919594652052", "Test from whatsapp.service.js");
  console.log("Send result:", sendResult);
}

main().catch(console.error);