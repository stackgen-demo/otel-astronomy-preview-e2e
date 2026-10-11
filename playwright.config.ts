import { defineConfig } from "@playwright/test";

const token = process.env.SHIPYARD_TOKEN || process.env.SHIPYARD_BYPASS_TOKEN || "";

export default defineConfig({
  testDir: "tests",
  timeout: 45_000,
  retries: 1,
  reporter: [
    ["list"],
    ["json", { outputFile: "test-results/results.json" }],
  ],
  use: {
    baseURL:
      process.env.PREVIEW_BASE_URL ||
      "https://ephimeral-env-demo.dev.stackgen-demo.shipyard.host",
    trace: "on-first-retry",
    // Never log the token; cookie only for SSO-gated Shipyard hosts.
    extraHTTPHeaders: {},
    storageState: undefined,
    ...(token
      ? {
          contextOptions: {
            // Playwright applies cookies via beforeEach in the spec helper.
          },
        }
      : {}),
  },
});
