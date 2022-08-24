import { expect, test } from '@playwright/test';
import setup from './setup';
import type { ElectronApplication, Page, Locator } from 'playwright';

let app: ElectronApplication;
let window: Page;

test.beforeEach(async () => {
  [app, window] = await setup();
});
test.beforeEach(async () => {
  await window.fill('#new-list-title', 'Hello, World!');
  await window.click('#new-list-btn');
  await window.click('a:text("Hello, World!")');
});
test.afterEach(async () => {
  await app.close();
});

test('title is viewed list title', async () => {
  await expect(window, 'App title is viewed favlist title').toHaveTitle('Hello, World! - Favlist');
});

test.describe('columns', () => {
  let newColumnLocator: Locator;
  test.beforeEach(async () => {
    await window.click('button :text("Add column")');
    newColumnLocator = window.locator('th button');
  });

  test('A column can be added', async () => {
    await expect(newColumnLocator, 'New column header does not exist').toBeVisible();
    await expect(newColumnLocator, 'New column header is not "New Column"').toHaveText('New Column');
  });
});
