import test, { expect } from "@playwright/test";
import { format, getDate } from "date-fns";

test.beforeEach(async ({ page }) => {
    await page.goto("http://localhost:3000/flights");
});

test("should have search button", async ({ page }) => {
    await expect(page.getByRole('button', { name: 'Search' })).toBeVisible();
});

test("search without departure iata shows error", async ({ page }) => {
    await page.getByRole('button', { name: 'Search' }).click();
    await expect(page.getByText('From is required')).toBeVisible();
});

test("search without destination iata shows error", async ({ page }) => {
    await page.getByRole('button', { name: 'Search' }).click();
    await expect(page.getByText('To is required')).toBeVisible();
});

test("search without departure date shows error", async ({ page }) => {
    await page.getByRole('button', { name: 'Search' }).click();
    await expect(page.getByText('Departure date is required')).toBeVisible();
});

test("search without return date works", async ({ page }) => {
    await page.getByRole('button', { name: 'Search' }).click();
    await expect(page.getByText('Return date is required')).not.toBeVisible();
});

test("should be able to select departure iata", async ({ page }) => {
    await page.getByRole('button', { name: 'From' }).click();
    await page.getByPlaceholder('Search...').fill('LAX');
    await page.getByText(/LAX - /).click();
    await expect(page.getByRole('button', { name: /LAX - Los Angeles International Airport/ })).toBeVisible();
});

test("should be able to select destination iata", async ({ page }) => {
    await page.getByRole('button', { name: 'To' }).click();
    await page.getByPlaceholder('Search...').fill('LAX');
    await page.getByText(/LAX - Los Angeles International Airport/).click();
    await expect(page.getByRole('button', { name: /LAX - Los Angeles International Airport/ })).toBeVisible();
});

test("should be able to select departure date", async ({ page }) => {
    const today = new Date();
    await page.getByRole('button', { name: 'Departure' }).click();
    await page.getByText(`${getDate(today)}`, { exact: true }).click();
    await expect(page.getByRole('button', { name: format(today, 'EEE, dd MMM') })).toBeVisible();
});

test("should be able to select return date", async ({ page }) => {
    const today = new Date();
    await page.getByRole('button', { name: 'Return' }).click();
    await page.getByText(`${getDate(today)}`, { exact: true }).click();
    await expect(page.getByRole('button', { name: format(today, 'EEE, dd MMM') })).toBeVisible();
});

test("return date should be after departure date", async ({ page }) => {
    const today = new Date();
    await page.getByRole('button', { name: 'Return' }).click();
    await page.waitForTimeout(100);
    await page.getByText(`${getDate(today)}`, { exact: true }).click();
    await page.waitForTimeout(100);
    await page.getByRole('button', { name: 'Departure' }).click();
    await page.waitForTimeout(100);
    await page.getByText(`${getDate(today.setDate(today.getDate() + 1))}`, { exact: true }).click();
    await page.waitForTimeout(100);
    await page.getByRole('button', { name: 'Search' }).click();
    await page.waitForTimeout(100);
    await expect(page.getByText('Return date must be after departure date')).toBeVisible();
});
