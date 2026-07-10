import { test, expect } from "@playwright/test";

test("login → list → view resume → schedule call → logout", async ({ page }) => {
  // 1. Auth gate is shown when not logged in
  await page.goto("/");
  await expect(page.getByRole("heading", { name: "Sign in" })).toBeVisible();

  // 2. Log in with the seeded demo user
  await page.getByLabel("Username").fill("recruiter");
  await page.getByLabel("Password").fill("waypoint123");
  await page.getByRole("button", { name: "Sign in" }).click();

  // 3. App loads live data from the API
  await expect(page.getByRole("heading", { name: "Applicants" })).toBeVisible();
  await expect(page.locator("main ul li")).toHaveCount(9);

  // 4. View resume triggers an authenticated PDF response (endpoint is JWT-protected)
  const [resumeResponse] = await Promise.all([
    page.waitForResponse((r) => /\/api\/applicants\/.+\/resume$/.test(r.url())),
    page.getByRole("button", { name: "View resume" }).click(),
  ]);
  expect(resumeResponse.status()).toBe(200);
  expect(resumeResponse.headers()["content-type"]).toContain("application/pdf");
  expect(resumeResponse.request().headers()["authorization"]).toMatch(/^Bearer /);

  // 5. Schedule a call and see it reflected in the detail panel
  await page.getByRole("button", { name: /call$/ }).click();
  await page.locator('input[type="datetime-local"]').fill("2026-08-05T10:30");
  await page.getByRole("button", { name: "Confirm" }).click();
  await expect(page.getByText("Aug 5, 10:30 AM")).toBeVisible();

  // 6. Logout returns to the sign-in screen
  await page.getByRole("button", { name: "Log out" }).click();
  await expect(page.getByRole("heading", { name: "Sign in" })).toBeVisible();
});
