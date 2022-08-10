import { resolve } from 'path';
import { _electron as electron } from 'playwright';
import { expect, test } from '@playwright/test';
import type { ElectronApplication, Page } from 'playwright';

let app = null as ElectronApplication;
let window = null as Page;

test.beforeEach(async () => {
  app = await electron.launch({ args: [resolve(__dirname, '../build-test/main.js')] });
  window = await app.firstWindow();
});
test.afterEach(async () => {
  await app.close();
});

test('Initial title is app page', async () => {
  await expect(window).toHaveTitle('Favlist');
});

test('Creating a new list', async () => {
  const submitButton = window.locator('#new-list-btn');
  expect(submitButton).toBeDisabled();
  await window.fill('#new-list-title', 'My list');
  expect(submitButton).toBeEnabled();
  await window.click('#new-list-btn');
  const listLink = window.locator('.favlist-link');
  expect(listLink).toHaveText('My list');
});
