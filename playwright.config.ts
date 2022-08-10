import { PlaywrightTestConfig } from '@playwright/test';

const port = process.env.PORT || '4173';

const config: PlaywrightTestConfig = {
  testDir: './e2e-tests',
  maxFailures: 2,
  webServer: {
    command: `yarn build:dev && yarn serve:renderer --port ${port}`,
    port: Number.parseInt(port, 10),
  },
};

export default config;
