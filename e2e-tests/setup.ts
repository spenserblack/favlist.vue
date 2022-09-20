import { resolve } from "path";
import { _electron as electron } from "playwright";
import type { ElectronApplication, Page } from "playwright";

process.env.NODE_ENV = "test";

export default async function setup(): Promise<[ElectronApplication, Page]> {
  const app = await electron.launch({
    args: [resolve(__dirname, "../build/main/main.js")],
  });
  const page = await app.firstWindow();
  return [app, page];
}
