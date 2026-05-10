import { test, expect } from '@playwright/test';

test.describe('Mood Selector Integration', () => {
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

    test.afterEach(async ({ page }) => {
        // Clean up: delete tasks created during test via API if possible
        // For now, rely on test isolation via unique task names
    });

    test('should surface Tiny task when "Need a win" mood is selected', async ({ page }) => {
        await page.goto('/deck');

        // Create Big task
        await page.click('button[aria-label="Add a new card"]');
        await page.fill('id=card-title', `Big Creative Project ${Date.now()}`);
        await page.click('button[aria-label="Big"]');
        await page.click('button:has-text("Create Card")');
        await expect(page.getByText(/Your card is ready/i)).toBeVisible({ timeout: 10000 });

        // Create Tiny task
        await page.click('button[aria-label="Add a new card"]');
        await page.fill('id=card-title', `Tiny Admin Task ${Date.now()}`);
        await page.click('button[aria-label="Tiny"]');
        await page.click('button:has-text("Create Card")');
        await expect(page.getByText(/Your card is ready/i)).toBeVisible({ timeout: 10000 });

        // Go to dashboard
        await page.goto('/');
        await expect(page.getByText(/loading/i)).toBeHidden({ timeout: 15000 });

        // Select "Need a win" mood
        await page.click('button[aria-label="Need a win"]');
        await expect(page.getByText(/Got it! Let's find a quick accomplishment/i)).toBeVisible();

        // Hero should show Tiny task, not Big task
        const heroSection = page.locator('section').first();
        await expect(heroSection.locator('h2').first()).toContainText(/Tiny Admin Task/);
    });

    test('should surface Big task when "Energized" mood is selected', async ({ page }) => {
        await page.goto('/deck');

        await page.click('button[aria-label="Add a new card"]');
        await page.fill('id=card-title', `Big Creative Project ${Date.now()}`);
        await page.click('button[aria-label="Big"]');
        await page.click('button:has-text("Create Card")');
        await expect(page.getByText(/Your card is ready/i)).toBeVisible({ timeout: 10000 });

        await page.click('button[aria-label="Add a new card"]');
        await page.fill('id=card-title', `Tiny Admin Task ${Date.now()}`);
        await page.click('button[aria-label="Tiny"]');
        await page.click('button:has-text("Create Card")');
        await expect(page.getByText(/Your card is ready/i)).toBeVisible({ timeout: 10000 });

        await page.goto('/');
        await page.click('button[aria-label="Energized"]');
        await expect(page.getByText(/Great! Let's tackle something challenging/i)).toBeVisible();

        const heroSection = page.locator('section').first();
        await expect(heroSection.locator('h2').first()).toContainText(/Big Creative Project/);
    });

    test('should deselect mood when clicked again', async ({ page }) => {
        await page.goto('/');

        await page.click('button[aria-label="Creative"]');
        await expect(page.getByText(/Perfect! Time for something expressive/i)).toBeVisible();

        // Click again to deselect
        await page.click('button[aria-label="Creative"]');
        await expect(page.getByText(/Perfect! Time for something expressive/i)).not.toBeVisible();
    });

    test('should show Low energy subtitle when mood selected', async ({ page }) => {
        await page.goto('/');
        await page.click('button[aria-label="Low energy"]');
        await expect(page.getByText(/No problem! We'll find something gentle/i)).toBeVisible();
    });
});
