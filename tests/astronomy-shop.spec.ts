import { test, expect } from "@playwright/test";
import { applyShipyardCookie } from "./helpers";

test.beforeEach(async ({ page }) => {
  await applyShipyardCookie(page);
});

test("1. home returns Otel Demo", async ({ page }) => {
  const res = await page.goto("/", { waitUntil: "domcontentloaded" });
  expect(res?.status()).toBe(200);
  await expect(page).toHaveTitle(/Otel Demo/i);
});

test("2. catalog via /api/products", async ({ request }) => {
  const token = process.env.SHIPYARD_TOKEN || process.env.SHIPYARD_BYPASS_TOKEN;
  const headers = token ? { Cookie: `shipyard_token=${token}` } : {};
  const res = await request.get("/api/products", { headers });
  expect(res.status()).toBe(200);
  const products = await res.json();
  expect(Array.isArray(products)).toBeTruthy();
  expect(products.length).toBeGreaterThan(0);
  expect(products[0].id).toBeTruthy();
  expect(products[0].name).toBeTruthy();
});

test("3. product detail page loads", async ({ page, request }) => {
  const token = process.env.SHIPYARD_TOKEN || process.env.SHIPYARD_BYPASS_TOKEN;
  const headers = token ? { Cookie: `shipyard_token=${token}` } : {};
  const res = await request.get("/api/products", { headers });
  const products = await res.json();
  const id = products[0].id as string;
  await applyShipyardCookie(page);
  const detail = await page.goto(`/product/${id}`, {
    waitUntil: "domcontentloaded",
  });
  expect(detail?.status()).toBe(200);
  await expect(page).toHaveURL(new RegExp(`/product/${id}`));
});

test("4. cart page loads", async ({ page }) => {
  const res = await page.goto("/cart", { waitUntil: "domcontentloaded" });
  expect(res?.ok() || res?.status() === 200 || res?.status() === 304).toBeTruthy();
  await expect(page.locator("body")).toBeVisible();
  await expect(page.locator("body")).toContainText(/cart|empty|shopping/i);
});

test("5. frontend-proxy API products smoke", async ({ request }) => {
  const token = process.env.SHIPYARD_TOKEN || process.env.SHIPYARD_BYPASS_TOKEN;
  const headers = token ? { Cookie: `shipyard_token=${token}` } : {};
  const res = await request.get("/api/products", { headers });
  if (res.status() === 404) {
    const home = await request.get("/", { headers });
    expect(home.status()).toBe(200);
    const text = await home.text();
    expect(text.length).toBeGreaterThan(200);
    expect(text).toMatch(/otel|product|astronomy/i);
    return;
  }
  expect(res.status()).toBe(200);
  const body = await res.text();
  expect(body.length).toBeGreaterThan(2);
});

test("6. second product detail loads", async ({ page, request }) => {
  const token = process.env.SHIPYARD_TOKEN || process.env.SHIPYARD_BYPASS_TOKEN;
  const headers = token ? { Cookie: `shipyard_token=${token}` } : {};
  const res = await request.get("/api/products", { headers });
  const products = await res.json();
  expect(products.length).toBeGreaterThan(1);
  const id = products[1].id as string;
  await applyShipyardCookie(page);
  const detail = await page.goto(`/product/${id}`, {
    waitUntil: "domcontentloaded",
  });
  expect(detail?.status()).toBe(200);
});

test("7. cart is reachable after home navigation", async ({ page }) => {
  await page.goto("/", { waitUntil: "domcontentloaded" });
  const res = await page.goto("/cart", { waitUntil: "domcontentloaded" });
  expect(res?.status()).toBe(200);
  await expect(page.locator("body")).toContainText(/cart|empty|shopping/i);
});

test("8. product API returns priced items", async ({ request }) => {
  const token = process.env.SHIPYARD_TOKEN || process.env.SHIPYARD_BYPASS_TOKEN;
  const headers = token ? { Cookie: `shipyard_token=${token}` } : {};
  const res = await request.get("/api/products", { headers });
  expect(res.status()).toBe(200);
  const products = await res.json();
  const priced = products.filter(
    (p: { priceUsd?: { units?: number } }) => p?.priceUsd?.units != null
  );
  expect(priced.length).toBeGreaterThan(0);
});
