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

test.describe("details bugs", () => {
  let dataRow: Locator;
  let dataCell: Locator;
  let previousPageButton: Locator;
  let nextPageButton: Locator;
  test.beforeEach(async () => {
    await window.fill("#new-list-title", "Hello, World!");
    await window.click("#new-list-btn");
    await window.click('a:text("Hello, World!")');
    dataRow = window.locator("tbody tr");
    dataCell = dataRow.locator("td");
    previousPageButton = window.locator('button i:text("chevron_left")');
    nextPageButton = window.locator('button i:text("chevron_right")');
  });

  test("#239: The correct cell should be changed on the second window", async () => {
    await window.click('button :text("Add column")');

    // NOTE Create 6 rows
    for (let i = 0; i < 6; i++) {
      await window.click('button :text("Add row")');
    }

    // NOTE Set to 5 rows per window
    await window.click(".q-table__bottom .q-table__select");
    await window.click('.q-menu .q-item:has-text("5")');

    await nextPageButton.click();

    // NOTE Edit the first cell on the second window
    await dataRow.click();
    const modalCard = window.locator(".q-dialog .q-card");
    const input = modalCard.locator("input[type=text]");
    await input.fill("foo");
    await modalCard.locator('button :text("Save")').click();

    await expect(dataCell.first(), "Row 6 was not edited").toHaveText("foo");

    await previousPageButton.click();
    const matches = await dataCell.count();
    for (let i = 0; i < matches; i++) {
      await expect(dataCell.nth(i), `Row ${i + 1} was edited`).toHaveText("---");
    }
  });
});
