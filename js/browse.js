// js/browse.js – claim pop-up (WBS 1.3.1). Saving the claim is WBS 1.3.2.
// A card needs data-item-id, an img, .item-category, and a .claim-button.

import { saveClaim } from "./claims.js";

const dialog = document.querySelector("#claim-dialog");
const form = document.querySelector("#claim-form");
const message = document.querySelector("#claim-message");
const photo = document.querySelector("#claim-photo");
const category = document.querySelector("#claim-category");
const nameInput = document.querySelector("#claim-name");
const emailInput = document.querySelector("#claim-email");
const detailInput = document.querySelector("#claim-detail");

let activeItemId = "";

document.querySelector("#item-list").addEventListener("click", (event) => {
  const button = event.target.closest(".claim-button");
  if (!button) return;
  openClaim(button.closest(".item-card"));
});

document.querySelector("#claim-close").addEventListener("click", () => {
  dialog.close();
});

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  const claim = {
    itemId: activeItemId,
    name: nameInput.value.trim(),
    email: emailInput.value.trim(),
    detail: detailInput.value.trim(),
  };

  // Check that all required information is valid.
  const errors = validateClaim(claim);

  if (errors.length > 0) {
    showMessage(errors.join(" "), "error");
    return;
  }

  // Prevent the user from submitting more than once.
  const submitButton = form.querySelector('button[type="submit"]');

  if (submitButton) {
    submitButton.disabled = true;
  }

  try {
    // Save the claim to Firebase.
    await saveClaim(
      claim.itemId,
      claim.name,
      claim.email,
      claim.detail
    );

    showMessage(
      "Your claim has been submitted successfully!",
      "ready"
    );

    form.reset();

  } catch (error) {
    console.error("Error saving claim:", error);

    showMessage(
      "Sorry, your claim could not be submitted. Please try again.",
      "error"
    );

  } finally {
    if (submitButton) {
      submitButton.disabled = false;
    }
  }
});

function openClaim(card) {
  const image = card.querySelector("img");
  activeItemId = card.dataset.itemId;
  photo.src = image.src;
  photo.alt = image.alt;
  category.textContent = card.querySelector(".item-category").textContent;
  form.reset();
  message.hidden = true;
  dialog.showModal();
}

function validateClaim(claim) {
  const errors = [];
  if (!claim.name) errors.push("Enter your name.");
  if (!claim.email) {
    errors.push("Enter your contact email.");
  } else if (!isValidEmail(claim.email)) {
    errors.push("Enter a valid email address.");
  }
  if (!claim.detail) errors.push("Enter a specific detail about the item.");
  return errors;
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function showMessage(text, kind) {
  message.hidden = false;
  message.textContent = text;
  message.className = `form-message ${kind}`;
}


