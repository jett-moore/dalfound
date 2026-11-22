// js/post.js – post form (WBS 1.1.1). Saving the item is WBS 1.1.2.
import { firebaseConfig, FIREBASE_VERSION } from "./firebase-config.js";
import {
  CATEGORIES,
  CAMPUS_LOCATIONS,
  DROP_OFF_LOCATIONS,
} from "./lists.js";

const FIREBASE_URL =
  `https://www.gstatic.com/firebasejs/${FIREBASE_VERSION}`;

const { initializeApp, getApps, getApp } = await import(
  `${FIREBASE_URL}/firebase-app.js`
);

const { getFirestore, collection, addDoc, serverTimestamp } = await import(
  `${FIREBASE_URL}/firebase-firestore.js`
);

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
const db = getFirestore(app);

const form = document.querySelector("#post-form");
const message = document.querySelector("#form-message");
const photoInput = document.querySelector("#photo");
const categorySelect = document.querySelector("#category");
const locationSelect = document.querySelector("#location-found");
const dateInput = document.querySelector("#date-found");
const dropOffSelect = document.querySelector("#drop-off");
const submitButton = form.querySelector('button[type="submit"]');

fillSelect(categorySelect, CATEGORIES);
fillSelect(locationSelect, CAMPUS_LOCATIONS);
fillSelect(dropOffSelect, DROP_OFF_LOCATIONS);

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  const photo = photoInput.files[0];
  const item = {
    photo,
    category: categorySelect.value,
    locationFound: locationSelect.value,
    dateFound: dateInput.value,
    dropOff: dropOffSelect.value,
  };

  const errors = validateItem(item);
  if (errors.length > 0) {
    showMessage(errors.join(" "), "error");
    return;
  }

  submitButton.disabled = true;
  showMessage("Saving item...", "ready");

  try {
    const compressedPhoto = await compressPhoto(item.photo);

    await addDoc(collection(db, "items"), {
      category: item.category,
      locationFound: item.locationFound,
      dateFound: item.dateFound,
      dropOff: item.dropOff,
      photo: compressedPhoto,
      status: "available",
      postedAt: serverTimestamp(),
    });

    form.reset();
    showMessage("The found item was posted successfully.", "ready");
  } catch (error) {
    console.error("Could not post item:", error);
    showMessage(
      error.message || "The item could not be posted. Please try again.",
      "error"
    );
  } finally {
    submitButton.disabled = false;
  }
});

function fillSelect(select, values) {
  const placeholder = document.createElement("option");
  placeholder.value = "";
  placeholder.textContent = "Select…";
  select.appendChild(placeholder);

  for (const value of values) {
    const option = document.createElement("option");
    option.value = value;
    option.textContent = value;
    select.appendChild(option);
  }
}

function validateItem(item) {
  const errors = [];

  if (!item.photo) {
    errors.push("Choose a photo.");
  } else if (!isJpegOrPng(item.photo)) {
    errors.push("The photo must be a JPG or PNG file.");
  }

  if (!item.category) errors.push("Choose a category.");
  if (!item.locationFound) errors.push("Choose the location where the item was found.");
  if (!item.dateFound) {
    errors.push("Enter the date the item was found.");
  } else if (item.dateFound > todayString()) {
    errors.push("The date found cannot be in the future.");
  }
  if (!item.dropOff) errors.push("Choose a drop-off location.");

  return errors;
}

function isJpegOrPng(file) {
  const type = (file.type || "").toLowerCase();
  if (type) return type === "image/jpeg" || type === "image/png";
  const name = file.name.toLowerCase();
  return name.endsWith(".jpg") || name.endsWith(".jpeg") || name.endsWith(".png");
}

function todayString() {
  const now = new Date();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${now.getFullYear()}-${month}-${day}`;
}

const MAX_IMAGE_DIMENSION = 1200;
const MAX_PHOTO_LENGTH = 700_000;

async function compressPhoto(file) {
  const image = await loadImage(file);

  const scale = Math.min(
    1,
    MAX_IMAGE_DIMENSION / Math.max(image.width, image.height)
  );

  const canvas = document.createElement("canvas");
  canvas.width = Math.round(image.width * scale);
  canvas.height = Math.round(image.height * scale);

  const context = canvas.getContext("2d");
  context.fillStyle = "#ffffff";
  context.fillRect(0, 0, canvas.width, canvas.height);
  context.drawImage(image, 0, 0, canvas.width, canvas.height);

  for (const quality of [0.8, 0.7, 0.6, 0.5, 0.4]) {
    const photo = canvas.toDataURL("image/jpeg", quality);

    if (photo.length <= MAX_PHOTO_LENGTH) {
      return photo;
    }
  }

  throw new Error("The photo is too large. Choose a smaller image.");
}

function loadImage(file) {
  return new Promise((resolve, reject) => {
    const image = new Image();
    const url = URL.createObjectURL(file);

    image.onload = () => {
      URL.revokeObjectURL(url);
      resolve(image);
    };

    image.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("The photo could not be processed."));
    };

    image.src = url;
  });
}

function showMessage(text, kind) {
  message.hidden = false;
  message.textContent = text;
  message.className = `form-message ${kind}`;
}
