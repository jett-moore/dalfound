// WBS 1.4.1 - Staff Login

import { auth, db } from "./firebase-config.js";

import {
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/13.4.0/firebase-auth.js";

import {
  doc,
  getDoc,
  collection,
  query,
  where,
  onSnapshot,
  updateDoc
} from "https://www.gstatic.com/firebasejs/13.4.0/firebase-firestore.js";


console.log("staff.js loaded");

// Login
document.getElementById("login-form").addEventListener("submit", async (event) => {
  event.preventDefault();

  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const error = document.getElementById("login-error");

  error.textContent = "";

  try {
    await signInWithEmailAndPassword(auth, email, password);
  } catch {
    error.textContent = "Incorrect email or password.";
  }
});

// Check if user is staff
onAuthStateChanged(auth, async (user) => {
  const login = document.getElementById("login-view");
  const staff = document.getElementById("staff-view");

  login.hidden = false;
  staff.hidden = true;
  stopDashboard();

  if (!user) return;

  try {
    const staffDoc = await getDoc(doc(db, "staff", user.uid));

    if (auth.currentUser?.uid !== user.uid) return;

    if (staffDoc.exists()) {
      document.getElementById("signed-in-as").textContent =
        "Signed in as " + user.email;

      login.hidden = true;
      staff.hidden = false;
      startDashboard();
    } else {
      await signOut(auth);
      document.getElementById("login-error").textContent =
        "Staff access required.";
    }
  } catch {
    document.getElementById("login-error").textContent =
      "Unable to verify staff access.";
  }
});

// Sign out
document.getElementById("signout-btn").addEventListener("click", async () => {
  try {
    await signOut(auth);
  } catch {
    alert("Unable to sign out.");
  }
});

// WBS 1.4.2 - Ishaan Datta new feature: Staff Dashboard

// Staff dashboard

let foundItems = [];
let allClaims = [];
let stopItems = null;
let stopClaims = null;
let gotItems = false;
let gotClaims = false;

function stopDashboard() {
  if (stopItems) stopItems();
  if (stopClaims) stopClaims();

  stopItems = null;
  stopClaims = null;
  foundItems = [];
  allClaims = [];
  gotItems = false;
  gotClaims = false;

  document.getElementById("staff-item-list").replaceChildren();
  document.getElementById("staff-message").textContent = "";
}

function startDashboard() {
  const message = document.getElementById("staff-message");
  message.textContent = "Loading items...";

  const availableItems = query(
    collection(db, "items"),
    where("status", "==", "available")
  );

  stopItems = onSnapshot(availableItems, (snapshot) => {
    foundItems = snapshot.docs.map((item) => ({
      ...item.data(),
      id: item.id
    }));

    gotItems = true;
    drawDashboard();
  }, (error) => {
    message.textContent = "Could not load items: " + error.message;
  });

  stopClaims = onSnapshot(collection(db, "claims"), (snapshot) => {
    allClaims = snapshot.docs.map((claim) => claim.data());

    gotClaims = true;
    drawDashboard();
  }, (error) => {
    message.textContent = "Could not load claims: " + error.message;
  });
}

function drawDashboard() {
  if (!gotItems || !gotClaims) return;

  const list = document.getElementById("staff-item-list");
  const message = document.getElementById("staff-message");

  list.replaceChildren();
  message.textContent = "";

  if (foundItems.length === 0) {
    message.textContent = "No available items.";
    return;
  }

  foundItems.forEach((item) => {
    const card = document.createElement("div");
    card.className = "item-card";

    if (item.photoUrl || item.photo) {
      const photo = document.createElement("img");
      photo.className = "staff-item-photo";
      photo.src = item.photoUrl || item.photo;
      photo.alt = `Found item: ${item.category || "Unknown category"}`;
      photo.loading = "lazy";
      photo.addEventListener("error", () => photo.remove());
      card.appendChild(photo);
    }

    const category = document.createElement("h3");
    category.textContent = item.category || "Found item";
    card.appendChild(category);

    const pickup = document.createElement("p");
    pickup.textContent = "Drop-off: " + (item.dropOff || "Unknown");
    card.appendChild(pickup);

    const requests = allClaims.filter((claim) => claim.itemId === item.id);

    const requestsTitle = document.createElement("h4");
    requestsTitle.textContent = "Claim Requests (" + requests.length + ")";
    card.appendChild(requestsTitle);

    requests.forEach((claim) => {
      const request = document.createElement("div");

      const name = document.createElement("p");
      name.textContent = "Name: " + (claim.name || "");
      request.appendChild(name);

      const email = document.createElement("a");
      email.href = "mailto:" + (claim.email || "");
      email.textContent = claim.email || "";
      request.appendChild(email);

      const description = document.createElement("p");
      description.textContent = "Detail: " + (claim.detail || "");
      request.appendChild(description);

      const submitted = document.createElement("p");
      const submittedDate = claim.submittedAt?.toDate?.();
      submitted.textContent = "Submitted: " +
        (submittedDate ? submittedDate.toLocaleString() : "Not available");
      request.appendChild(submitted);

      card.appendChild(request);
    });

    const returnedButton = document.createElement("button");
    returnedButton.type = "button";
    returnedButton.textContent = "Mark returned";

    const removeButton = document.createElement("button");
    removeButton.type = "button";
    removeButton.textContent = "Remove listing";

    returnedButton.addEventListener("click", async () => {
      if (!confirm("Mark this item as returned?")) return;

      returnedButton.disabled = true;
      removeButton.disabled = true;

      try {
        await updateDoc(doc(db, "items", item.id), {
          status: "returned"
        });
      } catch (error) {
        alert("Unable to mark returned: " + error.message);
        returnedButton.disabled = false;
        removeButton.disabled = false;
      }
    });

    removeButton.addEventListener("click", async () => {
      if (!confirm("Remove this item from the listing?")) return;

      returnedButton.disabled = true;
      removeButton.disabled = true;

      try {
        await updateDoc(doc(db, "items", item.id), {
          status: "removed"
        });
      } catch (error) {
        alert("Unable to remove listing: " + error.message);
        returnedButton.disabled = false;
        removeButton.disabled = false;
      }
    });

    card.appendChild(returnedButton);
    card.appendChild(removeButton);
    list.appendChild(card);
  });
}

