
 // WBS 1.3.2 - Save Claim Request

import { db } from "./firebase-config.js";

import {
  addDoc,
  collection,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/13.4.0/firebase-firestore.js";

// Save a claim to Firestore
export async function saveClaim(itemId, name, email, detail) {

  if (!itemId || !name.trim() || !email.trim() || !detail.trim()) {
    throw new Error("All claim fields are required.");
  }

  await addDoc(collection(db, "claims"), {
    itemId: itemId,
    name: name.trim(),
    email: email.trim(),
    detail: detail.trim(),
    submittedAt: serverTimestamp()
  });

}
