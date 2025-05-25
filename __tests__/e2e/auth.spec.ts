import test from "@playwright/test";

test.describe('Auth', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/');
    });
});