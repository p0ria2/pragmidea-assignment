import { getMonthName } from "@/_lib/date-utils";
import test, { expect } from "@playwright/test";
import { format, getDate } from "date-fns";

test.describe('Flights Search', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto("/flights");

        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        const tomorrowDate = tomorrow.toISOString().split('T')[0];
        await page.route('**/api/flights?**', async (route) => {
            const json =
                [
                    {
                        id: "1",
                        duration: "16:50",
                        airline: "OMAN AIR",
                        departure: {
                            at: `${tomorrowDate}T22:45:00`,
                            iata: "IKA"
                        },
                        arrival: {
                            at: "2025-05-26T20:05:00",
                            iata: "KUL"
                        },
                        stops: [
                            "DOH",
                        ],
                        price: "530.22",
                        currency: "EUR"
                    },
                    {
                        id: "2",
                        duration: "00:50",
                        airline: "OMAN AIR",
                        departure: {
                            at: `${tomorrowDate}T20:45:00`,
                            iata: "IKA"
                        },
                        arrival: {
                            at: "2025-05-27T20:05:00",
                            iata: "KUL"
                        },
                        stops: [
                            "DOH",
                            "MCT"
                        ],
                        price: "430.22",
                        currency: "EUR"
                    },
                    {
                        "id": "3",
                        "duration": "40:50",
                        "airline": "OMAN AIR",
                        departure: {
                            at: `${tomorrowDate}T23:45:00`,
                            iata: "IKA"
                        },
                        arrival: {
                            at: "2025-05-27T20:05:00",
                            iata: "KUL"
                        },
                        stops: [
                            "DOH",
                            "MCT",
                            "ABU"
                        ],
                        price: "532.56",
                        currency: "EUR"
                    },
                ];

            await route.fulfill({ json });
        });
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
        await page.getByRole('button', { name: 'From Select Airport' }).click();
        await page.getByPlaceholder('Search...').fill('LAX');
        await page.getByText(/LAX - /).click();
        await expect(page.getByRole('button', { name: /LAX - Los Angeles International Airport/ })).toBeVisible();
    });

    test("should be able to select destination iata", async ({ page }) => {
        await page.getByRole('button', { name: 'To Select Airport' }).click();
        await page.getByPlaceholder('Search...').fill('LAX');
        await page.getByText(/LAX - Los Angeles International Airport/).click();
        await expect(page.getByRole('button', { name: /LAX - Los Angeles International Airport/ })).toBeVisible();
    });

    test("should be able to select departure date", async ({ page }) => {
        const today = new Date();
        await page.getByRole('button', { name: 'Departure' }).click();
        await page.locator(`abbr[aria-label*="${getMonthName(today, 'long')} ${getDate(today)}"]`).click();
        await expect(page.getByRole('button', { name: format(today, 'EEE, dd MMM') })).toBeVisible();
    });

    test("should be able to select return date", async ({ page }) => {
        const today = new Date();
        await page.getByRole('button', { name: 'Return' }).click();
        await page.locator(`abbr[aria-label*="${getMonthName(today, 'long')} ${getDate(today)}"]`).click();
        await expect(page.getByRole('button', { name: format(today, 'EEE, dd MMM') })).toBeVisible();
    });

    test("return date should be after departure date", async ({ page }) => {
        const today = new Date();
        await page.getByRole('button', { name: 'Return' }).click();
        await expect(page.getByTestId('flight-date-search-popover')).toBeVisible();
        await page.locator(`abbr[aria-label*="${getMonthName(today, 'long')} ${getDate(today)}"]`).click();
        await expect(page.getByTestId('flight-date-search-popover')).toBeHidden();
        await page.getByRole('button', { name: 'Departure' }).click();
        await expect(page.getByTestId('flight-date-search-popover')).toBeVisible();
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        await page.locator(`abbr[aria-label*="${getMonthName(tomorrow, 'long')} ${getDate(tomorrow)}"]`).click();
        await expect(page.getByTestId('flight-date-search-popover')).toBeHidden();
        await page.getByRole('button', { name: 'Search' }).click();
        await expect(page.getByText('Return date must be after departure date')).toBeVisible();
    });

    test("should be able to search flights", async ({ page }) => {
        await page.getByRole('button', { name: 'From Select Airport' }).click();
        await page.getByPlaceholder('Search...').fill('IKA');
        await page.getByText(/IKA - /).click();
        await expect(page.getByTestId('airport-search-popover')).toBeHidden();

        await page.getByRole('button', { name: 'To Select Airport' }).click();
        await page.getByPlaceholder('Search...').fill('KUL');
        await page.getByText(/KUL - /).click();
        await expect(page.getByTestId('airport-search-popover')).toBeHidden();

        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        await page.getByRole('button', { name: 'Departure' }).click();
        await page.locator(`abbr[aria-label*="${getMonthName(tomorrow, 'long')} ${getDate(tomorrow)}"]`).click();
        await expect(page.getByTestId('flight-date-search-popover')).toBeHidden();

        await page.getByRole('button', { name: 'Search' }).click();
        await expect(page.locator('[data-testid="spinner"]')).toBeHidden();

        await page.waitForRequest('**/api/flights?**');

        await page.waitForTimeout(100);
        await expect((await page.getByText("OMAN AIR").all()).length).toBeGreaterThan(0);
    })
});
