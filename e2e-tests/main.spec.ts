import { resolve } from 'path';
import { _electron as electron } from 'playwright';
import { expect, test } from '@playwright/test';

test('placeholder test', async () => {
  const electronApp = await electron.launch({ args: [resolve(__dirname, '../build-test/main.js')] });

  const window = await electronApp.firstWindow();

  expect(await window.title()).toBe('Favlist');

  await electronApp.close();
});
