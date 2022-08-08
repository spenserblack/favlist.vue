import { resolve } from 'path';
import { _electron as electron } from 'playwright';
import { test } from '@playwright/test';

test('placeholder test', async () => {
  const electronApp = await electron.launch({ args: [resolve(__dirname, '../build-test/main.js')] });

  const appPath = await electronApp.evaluate(({ app }) => app.getAppPath());
  console.log(appPath);

  const window = await electronApp.firstWindow();

  console.log(await window.title());

  // Redirect console.log to the terminal.
  window.on('console', console.log);

  await window.click('input[type=text]');

  await electronApp.close();
});
