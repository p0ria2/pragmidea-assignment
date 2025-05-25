import test, { expect } from "@playwright/test";

test.beforeEach(async ({ page }) => {
    await page.goto("http://localhost:3000/flights");
});

test("should have filter button", async ({ page }) => {
    await expect(page.getByRole('button', { name: 'Filter' })).toBeVisible();
});