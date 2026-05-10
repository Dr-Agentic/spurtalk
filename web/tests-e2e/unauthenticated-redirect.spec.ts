import { test, expect } from '@playwright/test';

test.describe('Unauthenticated Redirect', () => {
    test.beforeEach(async ({ page }) => {
        page.on('console', msg => {
            if (msg.type() === 'error' || msg.type() === 'warning') {
                console.log(`BROWSER [${msg.type()}]: ${msg.text()}`);
            }
        });
    });

    test('should redirect to /login when accessing /deck without auth', async ({ page }) => {
        // Clear any existing session by going to logout
        await page.goto('/logout').catch(() => {
            // Logout route might not exist, that's ok
        });

        // Try to access /deck directly
        await page.goto('/deck');

        // Should be redirected to login
        await expect(page).toHaveURL(/\/login/, { timeout: 10000 });
    });

    test('should redirect to /login when accessing /dashboard without auth', async ({ page }) => {
        await page.goto('/').catch(() => {});
        await page.goto('/');

        // Should be redirected to login (if not logged in)
        await expect(page).toHaveURL(/\/login/, { timeout: 10000 });
    });

    test('should redirect to /login when accessing /focus/test-id without auth', async ({ page }) => {
        await page.goto('/focus/any-task-id');

        await expect(page).toHaveURL(/\/login/, { timeout: 10000 });
    });

    test('should redirect to /login when accessing /garden without auth', async ({ page }) => {
        await page.goto('/garden');

        await expect(page).toHaveURL(/\/login/, { timeout: 10000 });
    });

    test('should redirect to /login when accessing /timeline without auth', async ({ page }) => {
        await page.goto('/timeline');

        await expect(page).toHaveURL(/\/login/, { timeout: 10000 });
    });

    test('should allow access to /login without redirect', async ({ page }) => {
        await page.goto('/login');

        await expect(page).toHaveURL(/\/login/, { timeout: 10000 });
        await expect(page.getByText(/welcome back|sign in/i)).toBeVisible({ timeout: 5000 });
    });

    test('should allow access to /register without redirect', async ({ page }) => {
        await page.goto('/register');

        await expect(page).toHaveURL(/\/register/, { timeout: 10000 });
        await expect(page.getByText(/ready to start|create/i)).toBeVisible({ timeout: 5000 });
    });
});
