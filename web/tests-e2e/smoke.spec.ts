import { test, expect } from '@playwright/test';

test.describe('Dashboard Smoke Tests', () => {
    test.beforeEach(async ({ page }) => {
        // Log browser console
        page.on('console', msg => console.log(`BROWSER [${msg.type()}]: ${msg.text()}`));

        // Navigate to login page
        await page.goto('/login');

        // Fill login form
        await page.fill('id=email', 'test@example.com');
        await page.fill('id=password', 'password123');
        await page.click('button:has-text("Let\'s go!")');

        // Wait for redirect to deck/dashboard
        await expect(page).toHaveURL(/\/deck$|\/$/, { timeout: 15000 });

        // Ensure we are on the main dashboard for stats tests
        await page.goto('/', { waitUntil: 'networkidle' });
    });

    test('should display the dashboard greeting and stats', async ({ page }) => {
        console.log('Testing dashboard stats on:', page.url());
        // Wait for loading state to finish
        await expect(page.getByText(/loading|gathering/i)).toBeHidden({ timeout: 20000 });

        // Wait for the main dashboard heading
        await page.waitForSelector('h1', { timeout: 20000 });
        await expect(page.locator('h1').first()).toContainText(/good|morning|afternoon|evening|hey|tackle/i, { timeout: 15000 });

        // Check for Quick Stats section
        await expect(page.getByText(/your streak/i)).toBeVisible({ timeout: 10000 });
        await expect(page.getByText(/small wins today/i)).toBeVisible({ timeout: 10000 });
        await expect(page.getByText(/garden growth/i)).toBeVisible({ timeout: 10000 });
    });

    test('should navigate to the river (timeline)', async ({ page }) => {
        // Click on Timeline link in navigation
        await page.click('a[href="/timeline"]');

        // Check for timeline header "Your River"
        await expect(page.locator('h1')).toContainText('Your River');
    });

    test('should navigate to the garden', async ({ page }) => {
        // Click on Garden link
        await page.click('a[href="/garden"]');

        // Check for garden header
        await expect(page.locator('h1')).toContainText('Your Garden');
    });
});
