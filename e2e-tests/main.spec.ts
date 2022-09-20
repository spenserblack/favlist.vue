import { expect, test } from "@playwright/test";
import setup from "./setup";
import type { ElectronApplication, Page, Locator } from "playwright";

let app: ElectronApplication;
let window: Page;

test.beforeEach(async () => {
  [app, window] = await setup();
});
test.afterEach(async () => {
  await app.close();
});

test("Initial title is app page", async () => {
  await expect(window).toHaveTitle("Favlist");
});

test("Submit button disabled until form filled", async () => {
  const submitButton = window.locator("#new-list-btn");
  await expect(submitButton).toBeDisabled();
  await window.fill("#new-list-title", "My list");
  await expect(submitButton).toBeEnabled();
});

test.describe("New lists", () => {
  let listLink: Locator;

  test.beforeEach(async () => {
    await window.fill("#new-list-title", "My list");
    await window.click("#new-list-btn");
    listLink = window.locator(".favlist-link");
  });

  test("A list is created with the correct text", async () => {
    await expect(listLink, "The list should have been created").toHaveText("My list");
  });

  test.describe("Deleting a list", () => {
    let dialog: Locator;
    let modalCard: Locator;
    test.beforeEach(async () => {
      await window.click(".delete-list-btn");
      dialog = window.locator(".q-dialog");
      modalCard = dialog.locator(".q-card");
    });

    test("Warning dialog pops up when deleting a list", async () => {
      await expect(
        modalCard,
        "Clicking the delete button should show the confirmation",
      ).toBeVisible();
    });

    test("Canceling a delete keeps the list", async () => {
      await modalCard.locator("text=Cancel").click();
      await expect(dialog, "Cancel should hide the confirmation").toBeHidden();
      await expect(listLink, "The list should still be there").toBeVisible();
    });

    test("Deleting a list removes it", async () => {
      await modalCard.locator('button :text("Delete")').click();
      await expect(dialog, "Delete should hide the modal").toBeHidden();
      await expect(listLink, "The list should be gone").toBeHidden();
    });
  });
});
