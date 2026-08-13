const { db } = require("../config/firebase");

async function getDoc(collection, businessId, docId) {
  const ref = docId
    ? db.collection("businesses").doc(businessId).collection(collection).doc(docId)
    : db.collection(collection).doc(businessId);
  const snap = await ref.get();
  return snap.exists ? { id: snap.id, ...snap.data() } : null;
}

async function setDoc(collection, businessId, docId, data) {
  const ref = db.collection("businesses").doc(businessId).collection(collection).doc(docId);
  await ref.set(data, { merge: true });
  return { id: docId, ...data };
}

async function queryCollection(collection, businessId, filters = []) {
  let ref = db.collection("businesses").doc(businessId).collection(collection);
  filters.forEach(([field, op, value]) => {
    ref = ref.where(field, op, value);
  });
  const snap = await ref.get();
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

async function getInactiveCustomers(businessId, minDays, maxDays) {
  const cutoffMin = new Date(Date.now() - maxDays * 86400000).toISOString();
  const cutoffMax = new Date(Date.now() - minDays * 86400000).toISOString();
  return queryCollection("customers", businessId, [
    ["lastVisit", ">=", cutoffMin],
    ["lastVisit", "<=", cutoffMax],
  ]);
}

async function getBusinessStatsRaw(businessId) {
  const bookings = await queryCollection("bookings", businessId);
  const customers = await queryCollection("customers", businessId);
  return { bookings, customers };
}

async function writeBooking(businessId, booking) {
  const id = booking.id || db.collection("businesses").doc(businessId).collection("bookings").doc().id;
  return setDoc("bookings", businessId, id, booking);
}

module.exports = { getDoc, setDoc, queryCollection, getInactiveCustomers, getBusinessStatsRaw, writeBooking };