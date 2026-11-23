# DalFound

A lost-and-found website for Dalhousie University. CSCI 2690 – Team 6.

Live site: https://jett-moore.github.io/dalfound/

## Requirements
- Google Chrome on a desktop or laptop
- An internet connection (the site uses the team's Firebase project, already configured in js/firebase-config.js)

## Running the site
- Easiest: open the live site at https://jett-moore.github.io/dalfound/
- To run locally: clone this repository and open the folder with any static web server (for example, VS Code Live Server), then open index.html in Chrome. No build step or install is needed.

## Project structure

| File | Purpose |
|---|---|
| `index.html` + `js/browse.js` | Browse page and claim pop-up |
| `post.html` + `js/post.js` | Post a found item |
| `staff.html` + `js/staff.js` | Staff login, claims, return/remove |
| `css/style.css` | Shared styles |
| `js/lists.js` | Set lists for categories, locations and drop-off points |
| `js/firebase-config.js` | Firebase connection settings |

## Database fields (Firestore)

**items**
- `category` – from `CATEGORIES`
- `locationFound` – from `CAMPUS_LOCATIONS`
- `dateFound` – date, not in the future
- `dropOff` – from `DROP_OFF_LOCATIONS`
- `photo` – shrunk image stored as a base64 string
- `status` – `available`, `returned` or `removed`
- `postedAt` – server timestamp

**claims**
- `itemId` – ID of the item being claimed
- `name`
- `email`
- `detail` – specific detail proving ownership
- `submittedAt` – server timestamp

No field stores ID numbers or student numbers.

## Firebase setup

- Firebase project ID: `dalfound-ff5ce`
- Cloud Firestore database: `(default)`
- Firestore location: `northamerica-northeast1` (Montréal)
- Firebase JavaScript SDK: `13.4.0`
- Email/password authentication is enabled for the staff login.
- The Firebase web configuration is stored in `js/firebase-config.js`.
- Firestore security rules are stored in `firestore.rules`.
- Database write/read connectivity was successfully tested on November 20, 2026.
- The initial Firestore test mode has been disabled.
- Staff read and update permissions will be added as part of WBS 1.4.1.

## How we work

- `main` is protected: create a branch per feature, open a pull request, and get one review before merging.
- Changes merged to `main` go live on GitHub Pages within a few minutes.

## Resetting sample data

Use this to return the database to a clean demo state (e.g., the morning of the demo).
Takes about 20 minutes. You need access to the `dalfound-ff5ce` Firebase project.

### 1. Clear the old data (Firebase console)

The site's security rules don't allow deleting, so this is done in the console.

1. Open the [Firebase console](https://console.firebase.google.com/) → project **dalfound-ff5ce** → **Firestore Database** → **Data**.
2. Next to the **claims** collection, open the ⋮ menu → **Delete collection** and confirm.
3. Do the same for the **items** collection. This also clears any items marked returned or removed.
4. **Do not delete the `staff` collection.** It holds the demo staff account's access record; without it the staff login shows "Staff access required."

### 2. Re-post the sample items (live site)

Post each item through the live site's **Post a found item** page so it is saved exactly like a real post.
Photos are in `images/`. Use any date found from the past week.

| # | Photo | Category | Location found | Drop-off |
|---|---|---|---|---|
| 1 | `phone.jpg` | Phones | Killam Library | Dal Security |
| 2 | `keys.jpg` | Keys | Student Union Building (SUB) | DSU Help Desk (SUB) |
| 3 | `keysWithLock.jpg` | Keys | Dalplex / Wickwire Field | Dal Security |
| 4 | `wallet.jpg` | Wallets & Cards | Goldberg Computer Science Building | Dal Security |
| 5 | `earring.jpg` | Jewellery & Watches | Residence | Howe Hall front desk |
| 6 | `blackglasses.jpg` | Glasses | Life Sciences Centre | DSU Help Desk (SUB) |
| 7 | `foundglasses.jpg` | Glasses | Killam Library | Dal Security |
| 8 | `waterbottle.jpeg` | Water Bottles & Containers | Dalplex / Wickwire Field | Dal Security |
| 9 | `foundbottle.jpg` | Water Bottles & Containers | Sexton Campus | Dal Security |
| 10 | `laptop.jpg` | Laptops & Tablets | Goldberg Computer Science Building | Dal Security |
| 11 | `headphones.jpg` | Other Electronics | Killam Library | DSU Help Desk (SUB) |
| 12 | `backpack.jpg` | Bags & Backpacks | Rowe Management Building | Dal Security |
| 13 | `jacket.jpg` | Clothing | Student Union Building (SUB) | DSU Help Desk (SUB) |
| 14 | `textbook.jpg` | Books & School Supplies | Life Sciences Centre | Dal Security |
| 15 | `basketball.jpg` | Sports Equipment | Dalplex / Wickwire Field | Dal Security |
| 16 | `umbrella.jpg` | Other | Carleton Campus | Dal Security |

### 3. Add the sample claims (live site)

On the **Browse** page, click **This is mine** and submit these three claims (three claims across two items):

| Item | Name | Email | Detail |
|---|---|---|---|
| #1 Phone | Sample Claimant A | claimant.a@example.com | Clear case with a sticker on the back; lock screen is a dog photo |
| #1 Phone | Sample Claimant B | claimant.b@example.com | Black case, crack in the top-left corner |
| #4 Wallet | Sample Claimant C | claimant.c@example.com | Brown leather, has a Halifax Transit pass inside |

### 4. Check the reset

- The Browse page shows all 16 items, newest first, and every category appears in the category filter results.
- Signed in as the demo staff account, the Staff page shows two claims under the phone and one under the wallet.
- No photo shows a name, face, card number or address.
