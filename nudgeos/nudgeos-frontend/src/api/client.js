// TODO (M3-10, Day 19) — BLOCKED on M2's backend. See PENDING_TASKS.md
import {
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
} from "firebase/firestore";
import { db } from "../firebase";

// Get all documents from a collection
export async function getAll(collectionName) {
  const snapshot = await getDocs(collection(db, collectionName));
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
}

// Get a single document by ID
export async function getById(collectionName, id) {
  const docRef = doc(db, collectionName, id);
  const docSnap = await getDoc(docRef);
  if (!docSnap.exists()) return null;
  return { id: docSnap.id, ...docSnap.data() };
}

// Add a new document
export async function addItem(collectionName, data) {
  const docRef = await addDoc(collection(db, collectionName), data);
  return docRef.id;
}

// Update an existing document
export async function updateItem(collectionName, id, data) {
  const docRef = doc(db, collectionName, id);
  await updateDoc(docRef, data);
}

// Delete a document
export async function deleteItem(collectionName, id) {
  const docRef = doc(db, collectionName, id);
  await deleteDoc(docRef);
}

// Query documents with a filter (e.g., where("status", "==", "confirmed"))
export async function queryItems(collectionName, field, operator, value) {
  const q = query(
    collection(db, collectionName),
    where(field, operator, value),
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
}
