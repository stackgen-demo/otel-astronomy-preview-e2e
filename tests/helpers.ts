import { Page } from "@playwright/test";

/** Apply Shipyard SSO bypass cookie when SHIPYARD_TOKEN is set. Never log the value. */
export async function applyShipyardCookie(page: Page): Promise<void> {
  const token = process.env.SHIPYARD_TOKEN || process.env.SHIPYARD_BYPASS_TOKEN;
  if (!token) return;
  const base =
    process.env.PREVIEW_BASE_URL ||
    "https://ephimeral-env-demo.dev.stackgen-demo.shipyard.host";
  const { hostname } = new URL(base);
  await page.context().addCookies([
    {
      name: "shipyard_token",
      value: token,
      domain: hostname,
      path: "/",
      httpOnly: false,
      secure: true,
      sameSite: "Lax",
    },
  ]);
}
