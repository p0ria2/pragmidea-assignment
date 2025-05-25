import { SORT_OPTIONS } from "@/flights/_components/FlightsFilters";
import test, { expect, Page } from "@playwright/test";
import { getDate } from "date-fns";

test.beforeEach(async ({ page }) => {
    await page.goto("/flights");

    await page.route('**/api/flights?**', async (route) => {
        const json =
            [
                {
                    id: "1",
                    duration: "16:50",
                    airline: "OMAN AIR",
                    departure: {
                        at: "2025-05-25T22:45:00",
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
                        at: "2025-05-25T20:45:00",
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
                        at: "2025-05-25T23:45:00",
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

    await page.getByRole('button', { name: 'From Select Airport' }).click();
    await page.getByPlaceholder('Search...').fill('IKA');
    await page.getByText(/IKA - /).click();
    await page.waitForTimeout(200);

    await page.getByRole('button', { name: 'To Select Airport' }).click();
    await page.getByPlaceholder('Search...').fill('KUL');
    await page.getByText(/KUL - /).click();
    await page.waitForTimeout(200);

    const today = new Date();
    await page.getByRole('button', { name: 'Departure' }).click();
    await page.getByText(`${getDate(today)}`, { exact: true }).click();
    await page.waitForTimeout(200);

    await page.getByRole('button', { name: 'Search' }).click();
    await expect(page.locator('[data-testid="spinner"]')).toBeHidden();

    await page.waitForTimeout(100);
    await expect((await page.getByText("OMAN AIR").all()).length).toBeGreaterThan(0);
});

test("should have filter button", async ({ page }) => {
    await expect(page.getByTestId('flights-filters')).toBeVisible();
});

async function filterFlightsBy(page: Page, by: (typeof SORT_OPTIONS)[number]['label']) {
    await page.getByTestId('flights-filters').click();
    await page.getByText(by).click();
    await page.waitForTimeout(100);
}

test("should filter flights by lowest price", async ({ page }) => {
    await filterFlightsBy(page, 'Least Stops');

    const flightCards = await page.locator('[data-testid="flight-card-price"]').all();

    const prices = [];
    for (const card of flightCards) {
        const textContent = await card.textContent();
        prices.push(textContent!.trim());
    }

    const expectedOrder = ['EUR 430.22', 'EUR 530.22', 'EUR 532.56'];
    expect(prices).toEqual(expectedOrder);
});

test("should filter flights by highest price", async ({ page }) => {
    await filterFlightsBy(page, 'Highest Price');

    const flightCards = await page.locator('[data-testid="flight-card-price"]').all();
    const prices = [];
    for (const card of flightCards) {
        const textContent = await card.textContent();
        prices.push(textContent!.trim());
    }

    const expectedOrder = ['EUR 532.56', 'EUR 530.22', 'EUR 430.22'];
    expect(prices).toEqual(expectedOrder);
});

test("should filter flights by shortest duration", async ({ page }) => {
    await filterFlightsBy(page, 'Shortest Duration');

    const flightCards = await page.locator('[data-testid="flight-card-duration"]').all();
    const durations = [];
    for (const card of flightCards) {
        const textContent = await card.textContent();
        durations.push(textContent!.trim());
    }

    const expectedOrder = ['00:50', '16:50', '40:50'];
    expect(durations).toEqual(expectedOrder);
});

test("should filter flights by earliest departure", async ({ page }) => {
    await filterFlightsBy(page, 'Earliest Departure');


    const flightCards = await page.locator('[data-testid="flight-card-departure-time"]').all();
    const departureTimes = [];
    for (const card of flightCards) {
        const textContent = await card.textContent();
        departureTimes.push(textContent!.trim());
    }

    const expectedOrder = ['20:45', '22:45', '23:45'];
    expect(departureTimes).toEqual(expectedOrder);
});

test("should filter flights by latest departure", async ({ page }) => {
    await filterFlightsBy(page, 'Latest Departure');

    const flightCards = await page.locator('[data-testid="flight-card-departure-time"]').all();
    const departureTimes = [];
    for (const card of flightCards) {
        const textContent = await card.textContent();
        departureTimes.push(textContent!.trim());
    }

    const expectedOrder = ['23:45', '22:45', '20:45'];
    expect(departureTimes).toEqual(expectedOrder);
});

test("should filter flights by least stops", async ({ page }) => {
    await filterFlightsBy(page, 'Least Stops');

    const flightCards = await page.locator('[data-testid="flight-card-stops"]').all();
    const stops = [];
    for (const card of flightCards) {
        const textContent = await card.textContent();
        stops.push(textContent!.trim());
    }

    const expectedOrder = ['1 stop at DOH', '2 stops at DOH, MCT', '3 stops at DOH, MCT, ABU'];
    expect(stops).toEqual(expectedOrder);
});