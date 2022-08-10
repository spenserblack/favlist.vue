import { resolve } from 'path';
import { _electron as electron } from 'playwright';
import { expect, test } from '@playwright/test';
import type { ElectronApplication, Page } from 'playwright';

let app = null as ElectronApplication;
let window = null as Page;

test.beforeEach(async () => {
  app = await electron.launch({ args: [resolve(__dirname, '../build/main/main.js')] });
  window = await app.firstWindow();
});
test.afterEach(async () => {
  await app.close();
});

test('Initial title is app page', async () => {
  await expect(window).toHaveTitle('Favlist');
});

test('Creating and delete a list', async () => {
  const submitButton = window.locator('#new-list-btn');
  expect(submitButton).toBeDisabled();
  await window.fill('#new-list-title', 'My list');
  expect(submitButton).toBeEnabled();
  await window.click('#new-list-btn');
  const listLink = window.locator('.favlist-link');
  await expect(listLink, 'The list should have been created').toHaveText('My list');

  await window.click('.delete-list-btn');
  const dialog = window.locator('.q-dialog');
  const modalCard = dialog.locator('.q-card');
  await expect(modalCard, 'Clicking the delete button should show the confirmation').toBeVisible();
  await modalCard.locator('text=Cancel').click();
  await expect(dialog, 'Cancel should hide the confirmation').toBeHidden();
  await expect(listLink, 'The list should still be there').toBeVisible();

  await window.click('.delete-list-btn');
  await modalCard.locator('button :text("Delete")').click();
  await expect(dialog, 'Delete should hide the modal').toBeHidden();
  await expect(listLink, 'The list should be gone').toBeHidden();
});
