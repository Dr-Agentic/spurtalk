import { test, expect } from '@playwright/test';

test.describe('Task Creation Workflow (Daisy Design)', () => {
    test.beforeEach(async ({ page }) => {
        // Log browser console errors/warnings for easier debugging
        page.on('console', msg => {
            if (msg.type() === 'error' || msg.type() === 'warning') {
                console.log(`BROWSER [${msg.type()}]: ${msg.text()}`);
            }
        });

        // Login first
        await page.goto('/login');
        await page.fill('id=email', 'test@example.com');
        await page.fill('id=password', 'password123');
        await page.click('button:has-text("Let\'s go!")');

        // Wait for landing
        await expect(page).toHaveURL(/\/deck$|\/$/, { timeout: 15000 });
    });

    test('should show empty dashboard state if no tasks exist', async ({ page }) => {
        await page.goto('/');
        // Wait for loading to finish
        await expect(page.getByText(/loading/i)).toBeHidden({ timeout: 10000 });

        await expect(page.getByText(/all caught up/i)).toBeVisible();
        await expect(page.getByRole('button', { name: /add a new task/i })).toBeVisible();
    });

    test('should open modal via Deck FAB', async ({ page }) => {
        await page.goto('/deck');

        // Wait for loading to finish
        await expect(page.getByText(/loading/i)).toBeHidden({ timeout: 10000 });

        // FAB exists
        const fab = page.locator('button[aria-label="Add a new card"]');
        await expect(fab).toBeVisible();

        // Click opens modal
        await fab.click();
        await expect(page.getByText('Add a new card')).toBeVisible();
        await expect(page.getByPlaceholder("What's on your mind?")).toBeFocused();
    });

    test('should validate the title and effort requirements', async ({ page }) => {
        await page.goto('/deck');
        await page.click('button[aria-label="Add a new card"]');

        const submitBtn = page.locator('button:has-text("Create Card")');

        // Initially disabled
        await expect(submitBtn).toBeDisabled();

        // Valid title but no effort -> still disabled
        await page.fill('id=card-title', 'Valid Title');
        await expect(submitBtn).toBeDisabled();

        // Character count check
        await expect(page.getByText('11/500')).toBeVisible();

        // Select effort -> enabled
        await page.click('button[aria-label="Small"]');
        await expect(submitBtn).toBeEnabled();

        // Clear title -> disabled and show error
        await page.fill('id=card-title', '');
        await page.locator('id=card-title').blur();
        await expect(page.getByText(/This one needs a title to get started/i)).toBeVisible();
        await expect(submitBtn).toBeDisabled();
    });

    test('should handle mutual exclusivity of Fuzzy vs Hard deadlines', async ({ page }) => {
        await page.goto('/deck');
        await page.click('button[aria-label="Add a new card"]');

        // 1. Select Fuzzy
        await page.click('button[aria-label="Soon"]');
        await expect(page.locator('button[aria-label="Soon"][data-state="on"]')).toBeVisible();

        // 2. Select Hard (future date)
        const futureDate = new Date();
        futureDate.setDate(futureDate.getDate() + 10);
        const futureStr = futureDate.toISOString().split('T')[0];

        await page.fill('id=card-hard-deadline', futureStr);

        // Fuzzy should be cleared automatically
        await expect(page.locator('button[aria-label="Soon"][data-state="on"]')).not.toBeVisible();
        await expect(page.locator('id=card-hard-deadline')).toHaveValue(futureStr);

        // 3. Reselect Fuzzy
        await page.click('button[aria-label="Eventually"]');

        // Hard deadline should be cleared
        await expect(page.locator('id=card-hard-deadline')).toHaveValue('');
        await expect(page.locator('button[aria-label="Eventually"][data-state="on"]')).toBeVisible();
    });

    test('should create a complete task and confirm on Dashboard', async ({ page }) => {
        // Start on Dashboard (empty state)
        await page.goto('/');
        await expect(page.getByText(/all caught up/i)).toBeVisible();

        // Click the dashboard trigger
        await page.click('button:has-text("Add a new task")');
        await expect(page.getByText('Add a new card')).toBeVisible();

        // Fill all fields
        await page.fill('id=card-title', 'Daisy Test Task');
        await page.click('button[aria-label="Tiny"]');
        await page.fill('id=card-description', 'Verifying full Daisy design integration.');
        await page.click('button[aria-label="Fun"]');
        await page.click('button[aria-label="Soon"]');
        await page.fill('id=card-tags', 'robot, testing, cool');

        // Submit
        await page.click('button:has-text("Create Card")');

        // Modal closes, toast appears
        await expect(page.getByText('Add a new card')).not.toBeVisible();
        await expect(page.getByText(/Your card is ready/i)).toBeVisible();

        // Dashboard should now show the new task in the Hero area
        await expect(page.getByText('Daisy Test Task')).toBeVisible();
        await expect(page.getByText('Tiny')).toBeVisible();
        await expect(page.getByText('Fun')).toBeVisible();

        // Check Deck as well
        await page.goto('/deck');
        await expect(page.locator('h3').first()).toContainText('Daisy Test Task');
    });
});
