import { expect, test } from '@playwright/test';
import setup from './setup';
import type { ElectronApplication, Page } from 'playwright';

let app = null as ElectronApplication;
let window = null as Page;

test.beforeEach(async () => {
  [app, window] = await setup();
});
test.afterEach(async () => {
  await app.close();
});

test('App title is viewed favlist title', async () => {
  await window.fill('#new-list-title', 'My list');
  await window.click('#new-list-btn');
  await window.click('a:text("My list")');
  await expect(window).toHaveTitle('My list - Favlist');
});
