import { test, expect } from '@playwright/test';

test.describe('Emotional Tags Display', () => {
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

    for (const { tag, emoji } of [
        { tag: 'Boring', emoji: '😴' },
        { tag: 'Scary', emoji: '😰' },
        { tag: 'Fun', emoji: '🎉' },
    ]) {
        test(`should display ${tag} tag with ${emoji} emoji on card`, async ({ page }) => {
            await page.goto('/deck');
            await page.click('button[aria-label="Add a new card"]');
            await page.fill('id=card-title', `${tag} Task ${Date.now()}`);
            await page.click('button[aria-label="Small"]');
            await page.locator(`button[aria-label="${tag}"]`).click();
            await page.click('button:has-text("Create Card")');
            await expect(page.getByText(/Your card is ready/i)).toBeVisible({ timeout: 10000 });

            // Verify card appears with the emoji in the badge
            const card = page.locator('.cursor-grab').first();
            await expect(card).toContainText(`${tag} Task`);
            // The emoji should appear alongside the tag in the badge
            await expect(card.locator('text=/' + emoji + '/')).toBeVisible();
        });
    }

    test('should create task with Fun tag and verify it appears on dashboard', async ({ page }) => {
        await page.goto('/deck');
        await page.click('button[aria-label="Add a new card"]');
        await page.fill('id=card-title', `Fun Task Dashboard ${Date.now()}`);
        await page.click('button[aria-label="Tiny"]');
        await page.locator('button[aria-label="Fun"]').click();
        await page.click('button:has-text("Create Card")');
        await expect(page.getByText(/Your card is ready/i)).toBeVisible({ timeout: 10000 });

        // Go to dashboard and verify the Fun badge is visible
        await page.goto('/');
        await expect(page.getByText(/Fun Task Dashboard/)).toBeVisible();
        // The emoji 😉 should be visible in the badge
        await expect(page.locator('text=/🎉.*Fun|Fun.*🎉/')).toBeVisible();
    });

    test('should create task with Scary tag and verify it appears on dashboard', async ({ page }) => {
        await page.goto('/deck');
        await page.click('button[aria-label="Add a new card"]');
        await page.fill('id=card-title', `Scary Task Dashboard ${Date.now()}`);
        await page.click('button[aria-label="Big"]');
        await page.locator('button[aria-label="Scary"]').click();
        await page.click('button:has-text("Create Card")');
        await expect(page.getByText(/Your card is ready/i)).toBeVisible({ timeout: 10000 });

        await page.goto('/');
        await expect(page.getByText(/Scary Task Dashboard/)).toBeVisible();
        await expect(page.locator('text=/😰.*Scary|Scary.*😰/')).toBeVisible();
    });
});
