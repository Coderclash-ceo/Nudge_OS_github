const { db } = require("../config/firebase");

async function resolveBusinessId(whatsappNumber) {
  const snap = await db.collection("businesses")
    .where("whatsappNumber", "==", whatsappNumber)
    .limit(1)
    .get();

  if (snap.empty) return { found: false, businessId: null };
  return { found: true, businessId: snap.docs[0].id };
}

module.exports = { resolveBusinessId };