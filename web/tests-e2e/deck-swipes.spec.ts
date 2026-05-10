import { test, expect } from '@playwright/test';

test.describe('Deck Swipe Interactions', () => {
    test.beforeEach(async ({ page }) => {
        page.on('console', msg => {
            if (msg.type() === 'error' || msg.type() === 'warning') {
                console.log(`BROWSER [${msg.type()}]: ${msg.text()}`);
            }
        });

        await page.goto('/login');
        await page.fill('id=email', 'test@spurtalk.com');
        await page.fill('id=password', 'Test1234!');
        await page.click('button:has-text("Let\'s go!")');
        await expect(page).toHaveURL(/\/deck$|\/$/, { timeout: 15000 });
    });

    test('should open Focus Mode on swipe right', async ({ page }) => {
        await page.route('**/api/garden/complete/*', async (route) => {
            await route.fulfill({
                json: {
                    success: true,
                    elements: [],
                    sunBrightness: 0.5,
                    currentStreak: 1,
                    longestStreak: 1,
                    totalFlowers: 1,
                    totalTrees: 0,
                    lastUpdated: new Date().toISOString()
                }
            });
        });

        // Create a task
        await page.click('button[aria-label="Add a new card"]');
        await page.fill('id=card-title', `Swipe Right Task ${Date.now()}`);
        await page.click('button[aria-label="Small"]');
        await page.click('button:has-text("Create Card")');
        await expect(page.getByText(/Your card is ready/i)).toBeVisible({ timeout: 10000 });

        await page.reload();
        await page.waitForLoadState('networkidle');
        await expect(page.getByText(/loading/i)).toBeHidden({ timeout: 10000 });

        const card = page.locator('.cursor-grab').first();
        const box = await card.boundingBox();
        expect(box).not.toBeNull();

        // Swipe RIGHT
        await page.mouse.move(box!.x + box!.width / 2, box!.y + box!.height / 2);
        await page.mouse.down();
        await page.mouse.move(box!.x + box!.width / 2 + 200, box!.y + box!.height / 2, { steps: 10 });
        await page.mouse.up();

        // Should redirect to Focus Mode
        await expect(page).toHaveURL(/\/focus\/.+/, { timeout: 10000 });
        await expect(page.getByText(/Swipe Right Task/)).toBeVisible();
    });

    test('should move task to bottom on swipe left', async ({ page }) => {
        // Create 3 tasks
        const taskNames = [
            `Swipe Left Task A ${Date.now()}`,
            `Swipe Left Task B ${Date.now()}`,
            `Swipe Left Task C ${Date.now()}`
        ];

        for (const name of taskNames) {
            await page.click('button[aria-label="Add a new card"]');
            await page.fill('id=card-title', name);
            await page.click('button[aria-label="Small"]');
            await page.click('button:has-text("Create Card")');
            await expect(page.getByText(/Your card is ready/i)).toBeVisible({ timeout: 10000 });
        }

        await page.reload();
        await page.waitForLoadState('networkidle');
        await expect(page.getByText(/loading/i)).toBeHidden({ timeout: 10000 });

        // Record initial top card
        const initialFirst = await page.locator('.cursor-grab h3').first().textContent();

        // Swipe LEFT on first card
        const firstCard = page.locator('.cursor-grab').first();
        const box = await firstCard.boundingBox();
        expect(box).not.toBeNull();

        await page.mouse.move(box!.x + box!.width / 2, box!.y + box!.height / 2);
        await page.mouse.down();
        await page.mouse.move(box!.x + box!.width / 2 - 200, box!.y + box!.height / 2, { steps: 10 });
        await page.mouse.up();

        await page.waitForTimeout(1000);

        // Verify the swiped task is no longer in the first position
        const afterFirst = await page.locator('.cursor-grab h3').first().textContent();
        expect(afterFirst).not.toBe(initialFirst);
    });

    test('should show task card with correct effort badge after creation', async ({ page }) => {
        await page.click('button[aria-label="Add a new card"]');
        await page.fill('id=card-title', `Effort Badge Test ${Date.now()}`);
        await page.click('button[aria-label="Big"]');
        await page.click('button:has-text("Create Card")');
        await expect(page.getByText(/Your card is ready/i)).toBeVisible({ timeout: 10000 });

        // Go to deck to verify card
        await page.goto('/deck');
        await expect(page.getByText(/Effort Badge Test/)).toBeVisible();
        await expect(page.getByText('Big')).toBeVisible();
    });
});
