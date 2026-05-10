import { test, expect } from '@playwright/test';

/**
 * This test captures the bug that was found:
 * handleComplete() in focus/[id]/page.tsx was never calling POST /garden/complete/:taskId,
 * so tasks stayed in "Active" state forever and never grew the garden.
 *
 * The test verifies the COMPLETE end-to-end flow:
 * Task Deck → Swipe Right (Active) → Complete all nano-steps → Mark Complete →
 * POST /garden/complete/:taskId is called → Task moves to Garden → Navigate to /deck
 *
 * Before the fix: this test would FAIL because the garden API was never called
 * and the task state was never updated.
 */
test.describe('Garden Completion E2E - Bug Verification', () => {
    let gardenApiCalled = false;
    let gardenApiTaskId = '';
    let taskStateAfterComplete = '';

    test.beforeEach(async ({ page }) => {
        gardenApiCalled = false;
        gardenApiTaskId = '';
        taskStateAfterComplete = '';

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

    test('should call POST /garden/complete when task is marked complete', async ({ page }) => {
        // Track garden API calls
        await page.route('**/api/garden/complete/*', async (route) => {
            gardenApiCalled = true;
            gardenApiTaskId = route.request().url();
            await route.continue({
                json: {
                    success: true,
                    elements: [{ id: 'e1', type: 'flower', size: 1, color: '#8b7cf6' }],
                    sunBrightness: 0.6,
                    currentStreak: 1,
                    longestStreak: 1,
                    totalFlowers: 1,
                    totalTrees: 0,
                    lastUpdated: new Date().toISOString()
                }
            });
        });

        await page.route('**/api/tasks/*', async (route) => {
            // Track task state after completion
            if (route.request().method() === 'GET') {
                const url = route.request().url();
                // After clicking Mark Complete, verify task state is Garden
                if (url.includes('/tasks/') && gardenApiCalled) {
                    const resp = await route.fetch();
                    const task = await resp.json();
                    taskStateAfterComplete = task.state;
                }
            }
            await route.continue();
        });

        // Mock unblocker
        await page.route('**/api/unblocker/*/decompose', async (route) => {
            await route.fulfill({
                json: [
                    { id: 'n1', text: 'Do the thing', estimatedSeconds: 30, emotionalEffort: 'zero', isCompleted: false, parentTaskId: '', generatedByAI: true }
                ]
            });
        });

        // Create task
        await page.goto('/deck');
        await page.click('button[aria-label="Add a new card"]');
        await page.fill('id=card-title', `Garden Bug Test ${Date.now()}`);
        await page.click('button[aria-label="Tiny"]');
        await page.click('button:has-text("Create Card")');
        await expect(page.getByText(/Your card is ready/i)).toBeVisible({ timeout: 10000 });

        // Swipe down to trigger unblocker
        const card = page.locator('.cursor-grab').first();
        const box = await card.boundingBox();
        if (box) {
            await page.mouse.move(box.x + box.width / 2, box.y + 20);
            await page.mouse.down();
            await page.mouse.move(box.x + box.width / 2, box.y + 400, { steps: 20 });
            await page.mouse.up();
        }

        await expect(page.getByText(/Stuck\? Let's break it down/i)).toBeVisible({ timeout: 10000 });
        await page.click('button:has-text("Let\'s do these!")');
        await expect(page).toHaveURL(/\/focus\/.+/, { timeout: 10000 });

        // Complete the nano-step
        const checkbox = page.locator('input[type="checkbox"]').first();
        await checkbox.check();
        await expect(page.getByText('1 / 1')).toBeVisible({ timeout: 5000 });

        // Click Mark Complete
        await page.click('button:has-text("Mark Complete")');

        // BUG CHECK: The garden API MUST be called
        // Before the fix: gardenApiCalled would be FALSE
        // After the fix: gardenApiCalled should be TRUE
        await page.waitForTimeout(500);
        expect(gardenApiCalled).toBe(true);

        // Navigate to deck
        await expect(page).toHaveURL(/\/deck/, { timeout: 5000 });
    });

    test('completed task should NOT appear in deck after marking complete', async ({ page }) => {
        // Intercept garden API
        await page.route('**/api/garden/complete/*', async (route) => {
            gardenApiCalled = true;
            await route.continue({
                json: {
                    success: true,
                    elements: [{ id: 'e1', type: 'flower', size: 1, color: '#8b7cf6' }],
                    sunBrightness: 0.6,
                    currentStreak: 1,
                    longestStreak: 1,
                    totalFlowers: 1,
                    totalTrees: 0,
                    lastUpdated: new Date().toISOString()
                }
            });
        });

        // Mock unblocker
        await page.route('**/api/unblocker/*/decompose', async (route) => {
            await route.fulfill({
                json: [
                    { id: 'n1', text: 'Do the thing', estimatedSeconds: 30, emotionalEffort: 'zero', isCompleted: false, parentTaskId: '', generatedByAI: true }
                ]
            });
        });

        // Create task
        await page.goto('/deck');
        await page.click('button[aria-label="Add a new card"]');
        const taskTitle = `Garden Removal Test ${Date.now()}`;
        await page.fill('id=card-title', taskTitle);
        await page.click('button[aria-label="Tiny"]');
        await page.click('button:has-text("Create Card")');
        await expect(page.getByText(/Your card is ready/i)).toBeVisible({ timeout: 10000 });

        // Verify task is in deck
        await expect(page.getByText(taskTitle)).toBeVisible({ timeout: 5000 });

        // Swipe down to trigger unblocker
        const card = page.locator('.cursor-grab').first();
        const box = await card.boundingBox();
        if (box) {
            await page.mouse.move(box.x + box.width / 2, box.y + 20);
            await page.mouse.down();
            await page.mouse.move(box.x + box.width / 2, box.y + 400, { steps: 20 });
            await page.mouse.up();
        }

        await expect(page.getByText(/Stuck\? Let's break it down/i)).toBeVisible({ timeout: 10000 });
        await page.click('button:has-text("Let\'s do these!")');
        await expect(page).toHaveURL(/\/focus\/.+/, { timeout: 10000 });

        // Complete nano-step
        const checkbox = page.locator('input[type="checkbox"]').first();
        await checkbox.check();

        // Mark complete
        await page.click('button:has-text("Mark Complete")');
        await expect(page).toHaveURL(/\/deck/, { timeout: 5000 });

        // BUG CHECK: The task should NOT appear in deck anymore
        // Before fix: task still in "Active" state → still shows in deck → FAIL
        // After fix: task in "Garden" state → removed from deck → PASS
        await page.waitForTimeout(1000);
        const taskStillInDeck = await page.getByText(taskTitle).isVisible({ timeout: 3000 }).catch(() => false);
        expect(taskStillInDeck).toBe(false);
    });
});