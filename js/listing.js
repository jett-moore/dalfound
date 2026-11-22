// Browse page: item listing (WBS 1.2.1) and filters (WBS 1.2.2)

import { firebaseConfig, FIREBASE_VERSION } from "./firebase-config.js";
import { CATEGORIES, CAMPUS_LOCATIONS } from "./lists.js";

// Load Firebase using the same version as the rest of the project.
const FIREBASE_URL = `https://www.gstatic.com/firebasejs/${FIREBASE_VERSION}`;
const { initializeApp, getApps, getApp } = await import(`${FIREBASE_URL}/firebase-app.js`);
const { getFirestore, collection, query, where, onSnapshot } = await import(
  `${FIREBASE_URL}/firebase-firestore.js`
);

// Reuse the Firebase app if another script already started it.
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
const db = getFirestore(app);

// Field names for item records.
const FIELDS = {
  photo: "photoUrl",
  category: "category",
  location: "locationFound",
  dateFound: "dateFound",
  dropOff: "dropOff",
  postedAt: "postedAt",
};

const listEl = document.querySelector("#item-list");
const emptyEl = document.querySelector("#empty-message");
const categorySelect = document.querySelector("#filter-category");
const locationSelect = document.querySelector("#filter-location");
const clearButton = document.querySelector("#clear-filters");

let allItems = []; // every available item, newest first

// Filters (1.2.2)

function fillSelect(select, values) {
  for (const value of values) {
    const option = document.createElement("option");
    option.value = value;
    option.textContent = value;
    select.append(option);
  }
}

fillSelect(categorySelect, CATEGORIES);
fillSelect(locationSelect, CAMPUS_LOCATIONS);

categorySelect.addEventListener("change", render);
locationSelect.addEventListener("change", render);

clearButton.addEventListener("click", () => {
  categorySelect.value = "";
  locationSelect.value = "";
  render();
});

function matchesFilters(item) {
  const category = categorySelect.value;
  const location = locationSelect.value;
  return (
    (!category || item[FIELDS.category] === category) &&
    (!location || item[FIELDS.location] === location)
  );
}

// Item listing (1.2.1)

function toMillis(value) {
  if (!value) return 0;
  if (typeof value.toMillis === "function") return value.toMillis(); // Firestore Timestamp
  return new Date(value).getTime() || 0;
}

function formatDate(value) {
  if (!value) return "";
  if (typeof value.toDate === "function") {
    return value.toDate().toLocaleDateString("en-CA");
  }
  return String(value); // already a "YYYY-MM-DD" string
}

// Builds <p>Label: <span class="className">value</span></p>
function detailLine(label, className, value) {
  const p = document.createElement("p");
  const span = document.createElement("span");
  span.className = className;
  span.textContent = value;
  p.append(`${label}: `, span);
  return p;
}

function createCard(item) {
  const card = document.createElement("article");
  card.className = "item-card";
  card.dataset.itemId = item.id;

  const img = document.createElement("img");
  img.src = item.photoUrl || item.photo;
  img.alt = `Found item: ${item[FIELDS.category]}`;
  img.loading = "lazy";

  const details = document.createElement("div");
  details.className = "item-details";

  const title = document.createElement("h3");
  title.className = "item-category";
  title.textContent = item[FIELDS.category];

  details.append(
    title,
    detailLine("Found at", "item-location", item[FIELDS.location]),
    detailLine("Date found", "item-date", formatDate(item[FIELDS.dateFound])),
    detailLine("Pick up at", "item-dropoff", item[FIELDS.dropOff])
  );

  const button = document.createElement("button");
  button.type = "button";
  button.className = "claim-button"; // browse.js (1.3.1) listens for this
  button.textContent = "This is mine";

  card.append(img, details, button);
  return card;
}

function render() {
  const shown = allItems.filter(matchesFilters);
  listEl.replaceChildren(...shown.map(createCard));

  if (shown.length === 0) {
    emptyEl.textContent =
      allItems.length === 0
        ? "No items have been posted yet."
        : "No items match these filters.";
    emptyEl.hidden = false;
  } else {
    emptyEl.hidden = true;
  }
}

// Live updates on only "available" items. Sorting happens here instead of in
// Firestore so no extra database index is needed
const availableItems = query(
  collection(db, "items"),
  where("status", "==", "available")
);

onSnapshot(
  availableItems,
  (snapshot) => {
    allItems = snapshot.docs
      .map((doc) => ({ id: doc.id, ...doc.data({ serverTimestamps: "estimate" }) }))
      .sort((a, b) => toMillis(b[FIELDS.postedAt]) - toMillis(a[FIELDS.postedAt]));
    render();
  },
  (error) => {
    console.error("Could not load items:", error);
    emptyEl.textContent = "Couldn't load items. Please refresh the page.";
    emptyEl.hidden = false;
  }
);
