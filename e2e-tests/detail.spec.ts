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

  test.describe('Edit column', () => {
    let dialog: Locator;
    let modalCard: Locator;

    test.beforeEach(async () => {
      await newColumnLocator.click();
      dialog = window.locator('.q-dialog');
      modalCard = dialog.locator('.q-card');
    });

    test('A dialog is shown', async () => {
      await expect(dialog, 'Dialog does not exist').toBeVisible();
      await expect(modalCard, 'Edit card does not exist').toBeVisible();
    });

    test.describe('new name form', () => {
      test.beforeEach(async () => {
        await modalCard.locator('input[type=text]').fill('foo');
      });

      test('Cancel hides modal and changes nothing', async () => {
        await modalCard.locator('button :text("Cancel")').click();
        await expect(dialog).toBeHidden();
        await expect(newColumnLocator).toHaveText('New Column');
      });

      test('Save hides modal and changes name', async () => {
        await modalCard.locator('button :text("Save")').click();
        await expect(dialog).toBeHidden();
        await expect(newColumnLocator).toHaveText('foo');
      });
    });

    test('Delete column', async () => {
      const deleteButton = modalCard.locator('button.text-negative');
      await deleteButton.click();
      await expect(deleteButton, 'Text has not changed to "Are you sure?"').toHaveText('Are you sure?');
      await deleteButton.click();
      await expect(dialog).toBeHidden();
      await expect(newColumnLocator).toBeHidden();
    });
  });
});
