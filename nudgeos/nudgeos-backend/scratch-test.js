require("dotenv").config();
const { getDoc, getInactiveCustomers, getBusinessStatsRaw } = require("./src/services/firestore.service");

async function main() {
  const business = await getDoc("businesses", "test-business-1");
  console.log("Business:", business);

  const stats = await getBusinessStatsRaw("test-business-1");
  console.log("Stats:", stats);

  const wrongBusiness = await getDoc("businesses", "does-not-exist");
  console.log("Wrong business (should be null):", wrongBusiness);
}

main().catch(console.error);