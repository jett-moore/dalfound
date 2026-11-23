# Testing – WBS 1.5.4

Tested on November 22, 2026 on the live site (https://jett-moore.github.io/dalfound/) in Chrome on a laptop, using the sample data from the README.

## Workflow tests

| # | Workflow | Steps | Expected result | Success criterion | Result |
|---|---|---|---|---|---|
| 1 | Post an item | Post a found item with all fields | Confirmation shows; item appears on Browse without refreshing | 1 | Pass |
| 2 | Post validation | Submit with an empty field, a future date, a non-image file | Error shows, nothing saved | 1 | Pass |
| 3 | Filters | Try category only, location only, both, then Clear filters | Only matching items show; Clear brings back all | 2 | Pass |
| 4 | Claim an item | Click "This is mine", submit name, email, detail | Confirmation shows; claim saved | 3 | Pass |
| 5 | Claim validation | Submit with an empty field and a bad email | Error shows, nothing saved | 5 | Pass |
| 6 | Staff login | Open Staff page signed out; try wrong password; sign in | Only login shows; error on wrong password; dashboard after sign-in | – | Pass |
| 7 | Claim list | Check claims under the phone and the wallet | Each claim shows under the right item only | 3 | Pass |
| 8 | Mark returned | Mark an item returned, then check Browse | Item disappears from Browse; Cancel changes nothing | 4 | Pass |
| 9 | Remove listing | Remove an item, then check Browse | Item disappears from Browse | 4 | Pass |
| 10 | Privacy | Look at cards and claim form | No ID/student number asked; no claims on public pages | 5 | Pass |
| 11 | Screen sizes | Check every page at 1366×768 and 1920×1080 | Nothing cut off or overlapping | 6 | Pass |

All 11 workflows passed, covering success criteria 1–6.

## User testing

Three testers who are not on the project team (Dal students outside CSCI 2690) completed the tasks without help.

**Tasks given to testers**
1. Post a found item using the photo provided.
2. Find a phone found at Killam Library.
3. Claim the wallet as if it were yours.
4. Sign in as staff and mark an item as returned (Tester 1: umbrella, Tester 2: jacket, Tester 3: textbook).

| Tester | Task 1 | Task 2 | Task 3 | Task 4 | Notes |
|---|---|---|---|---|---|
| Tester 1 | Pass | Pass | Pass | Pass | Completed all tasks with no issues |
| Tester 2 | Pass | Pass | Pass | Pass | Completed all tasks with no issues |
| Tester 3 | Pass | Pass | Pass | Pass | Completed all tasks with no issues |

## Defect log

| # | Found by | Description | Owner | Fixed? | Retested? |
|---|---|---|---|---|---|
| – | – | No blocking defects found during workflow or user testing | – | – | – |
