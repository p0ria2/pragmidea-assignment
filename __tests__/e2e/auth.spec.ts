import test, { expect } from "@playwright/test";
import { getDate } from "date-fns";

test.describe('Sign In', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/');
    });

    test('Sign in button should be visible', async ({ page }) => {
        await expect(page.getByRole('button', { name: 'Sign In' })).toBeVisible();
    });

    test('Sign in button opens sign in modal', async ({ page }) => {
        await expect(page.getByRole('button', { name: 'Sign In' })).toBeEnabled();
        await page.getByRole('button', { name: 'Sign In' }).click();
        await expect(page.getByRole('dialog', { name: 'Sign In' })).toBeVisible();
    });
});

test.describe('Sign Up', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/');
        await expect(page.getByRole('button', { name: 'Sign In' })).toBeEnabled();
        await page.getByRole('button', { name: 'Sign In' }).click();
        await expect(page.getByRole('dialog', { name: 'Sign In' })).toBeVisible();
        await page.getByText('Register').click();
        await expect(page.getByRole('dialog', { name: 'Register' })).toBeVisible();
    });

    test('Sign up with email and password should work', async ({ page }) => {
        await page.getByLabel('Email').fill(`test${new Date().getTime()}@test.com`);
        await page.getByLabel('Password').fill('password');
        await page.getByRole('button', { name: 'Register' }).click();
        await expect(page.getByTestId('spinner')).toBeVisible();
        await expect(page.getByTestId('spinner')).toBeHidden({ timeout: 10000 });
        await expect(page.getByRole('dialog', { name: 'Register' })).toBeHidden();

        await expect(page.getByTestId('avatar-fallback')).toHaveText('T');
    });
});

test.describe('Bookmark Flight', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/');

        await page.getByRole('button', { name: 'From Select Airport' }).click();
        await page.getByPlaceholder('Search...').fill('IKA');
        await page.getByText(/IKA - /).click();
        await expect(page.getByTestId('airport-search-popover')).toBeHidden();

        await page.getByRole('button', { name: 'To Select Airport' }).click();
        await page.getByPlaceholder('Search...').fill('KUL');
        await page.getByText(/KUL - /).click();
        await expect(page.getByTestId('airport-search-popover')).toBeHidden();

        const today = new Date();
        await page.getByRole('button', { name: 'Departure' }).click();
        await page.getByText(`${getDate(today)}`, { exact: true }).click();
        await expect(page.getByTestId('flight-date-search-popover')).toBeHidden();

        await expect(page.getByTestId('flights-search-bookmark-button')).toBeEnabled();
    });

    test('Bookmark flights before login should ask for login', async ({ page }) => {
        await page.getByTestId('flights-search-bookmark-button').click();
        await expect(page.getByText('You must be signed in to bookmark flights')).toBeVisible();
    });
});
