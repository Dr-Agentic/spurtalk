import { test, expect } from '@playwright/test';

test.describe('Focus Mode Full Journey', () => {
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

    test('should open Focus Mode via "Let\'s do these!" from Unblocker', async ({ page }) => {
        // Mock AI decomposition to return predictable nano-steps
        await page.route('**/api/unblocker/*/decompose', async (route) => {
            await route.fulfill({
                json: [
                    { id: 'n1', text: 'Open the document', estimatedSeconds: 60, emotionalEffort: 'zero', isCompleted: false, parentTaskId: '', generatedByAI: true },
                    { id: 'n2', text: 'Write one sentence', estimatedSeconds: 60, emotionalEffort: 'minimal', isCompleted: false, parentTaskId: '', generatedByAI: true },
                    { id: 'n3', text: 'Review what you wrote', estimatedSeconds: 60, emotionalEffort: 'minimal', isCompleted: false, parentTaskId: '', generatedByAI: true },
                ]
            });
        });

        // Mock garden completion
        await page.route('**/api/garden/complete/*', async (route) => {
            await route.fulfill({
                json: {
                    success: true,
                    elements: [],
                    sunBrightness: 0.6,
                    currentStreak: 1,
                    longestStreak: 1,
                    totalFlowers: 1,
                    totalTrees: 0,
                    lastUpdated: new Date().toISOString()
                }
            });
        });

        // Create task
        await page.goto('/deck');
        await page.click('button[aria-label="Add a new card"]');
        await page.fill('id=card-title', `Focus Mode Test ${Date.now()}`);
        await page.click('button[aria-label="Medium"]');
        await page.click('button:has-text("Create Card")');
        await expect(page.getByText(/Your card is ready/i)).toBeVisible({ timeout: 10000 });

        // Swipe down to trigger Unblocker
        const card = page.locator('.cursor-grab').first();
        const box = await card.boundingBox();
        if (box) {
            await page.mouse.move(box.x + box.width / 2, box.y + 20);
            await page.mouse.down();
            await page.mouse.move(box.x + box.width / 2, box.y + 400, { steps: 20 });
            await page.mouse.up();
        }

        // Verify Unblocker opens
        await expect(page.getByText(/Stuck\? Let's break it down/i)).toBeVisible({ timeout: 10000 });

        // Accept nano-steps
        await page.click('button:has-text("Let\'s do these!")');

        // Should now be in Focus Mode
        await expect(page).toHaveURL(/\/focus\/.+/, { timeout: 10000 });
    });

    test('should display task title, timer, and nano-step checkboxes', async ({ page }) => {
        await page.route('**/api/unblocker/*/decompose', async (route) => {
            await route.fulfill({
                json: [
                    { id: 'n1', text: 'Open the document', estimatedSeconds: 60, emotionalEffort: 'zero', isCompleted: false, parentTaskId: '', generatedByAI: true },
                    { id: 'n2', text: 'Write one sentence', estimatedSeconds: 60, emotionalEffort: 'minimal', isCompleted: false, parentTaskId: '', generatedByAI: true },
                    { id: 'n3', text: 'Review what you wrote', estimatedSeconds: 60, emotionalEffort: 'minimal', isCompleted: false, parentTaskId: '', generatedByAI: true },
                ]
            });
        });
        await page.route('**/api/garden/complete/*', async (route) => {
            await route.fulfill({ json: { success: true } });
        });

        await page.goto('/deck');
        await page.click('button[aria-label="Add a new card"]');
        await page.fill('id=card-title', `Focus UI Test ${Date.now()}`);
        await page.click('button[aria-label="Small"]');
        await page.click('button:has-text("Create Card")');
        await expect(page.getByText(/Your card is ready/i)).toBeVisible({ timeout: 10000 });

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

        // Task title visible
        await expect(page.getByText(`Focus UI Test`)).toBeVisible();

        // Timer visible (MM:SS format)
        const timerText = page.locator('text=/\\d{1,2}:\\d{2}/').first();
        await expect(timerText).toBeVisible();

        // 3 nano-step checkboxes visible
        const checkboxes = page.locator('input[type="checkbox"]');
        await expect(checkboxes).toHaveCount(3);

        // Nano-step text visible
        await expect(page.getByText('Open the document')).toBeVisible();
        await expect(page.getByText('Write one sentence')).toBeVisible();
        await expect(page.getByText('Review what you wrote')).toBeVisible();
    });

    test('should update progress bar as nano-steps are checked', async ({ page }) => {
        await page.route('**/api/unblocker/*/decompose', async (route) => {
            await route.fulfill({
                json: [
                    { id: 'n1', text: 'Open the document', estimatedSeconds: 60, emotionalEffort: 'zero', isCompleted: false, parentTaskId: '', generatedByAI: true },
                    { id: 'n2', text: 'Write one sentence', estimatedSeconds: 60, emotionalEffort: 'minimal', isCompleted: false, parentTaskId: '', generatedByAI: true },
                    { id: 'n3', text: 'Review what you wrote', estimatedSeconds: 60, emotionalEffort: 'minimal', isCompleted: false, parentTaskId: '', generatedByAI: true },
                ]
            });
        });
        await page.route('**/api/garden/complete/*', async (route) => {
            await route.fulfill({ json: { success: true } });
        });

        await page.goto('/deck');
        await page.click('button[aria-label="Add a new card"]');
        await page.fill('id=card-title', `Progress Test ${Date.now()}`);
        await page.click('button[aria-label="Tiny"]');
        await page.click('button:has-text("Create Card")');
        await expect(page.getByText(/Your card is ready/i)).toBeVisible({ timeout: 10000 });

        const card = page.locator('.cursor-grab').first();
        const box = await card.boundingBox();
        if (box) {
            await page.mouse.move(box.x + box.width / 2, box.y + 20);
            await page.mouse.down();
            await page.mouse.move(box.x + box.width / 2, box.y + 400, { steps: 20 });
            await page.mouse.up();
        }

        await page.click('button:has-text("Let\'s do these!")');
        await expect(page).toHaveURL(/\/focus\/.+/, { timeout: 10000 });

        const checkboxes = page.locator('input[type="checkbox"]');

        // Check step 1
        await checkboxes.nth(0).check();
        await expect(page.getByText('1 / 3')).toBeVisible({ timeout: 5000 });

        // Check step 2
        await checkboxes.nth(1).check();
        await expect(page.getByText('2 / 3')).toBeVisible({ timeout: 5000 });

        // Check step 3
        await checkboxes.nth(2).check();
        await expect(page.getByText('3 / 3')).toBeVisible({ timeout: 5000 });
    });

    test('should uncheck nano-step and revert progress', async ({ page }) => {
        await page.route('**/api/unblocker/*/decompose', async (route) => {
            await route.fulfill({
                json: [
                    { id: 'n1', text: 'Open the document', estimatedSeconds: 60, emotionalEffort: 'zero', isCompleted: false, parentTaskId: '', generatedByAI: true },
                    { id: 'n2', text: 'Write one sentence', estimatedSeconds: 60, emotionalEffort: 'minimal', isCompleted: false, parentTaskId: '', generatedByAI: true },
                ]
            });
        });
        await page.route('**/api/garden/complete/*', async (route) => {
            await route.fulfill({ json: { success: true } });
        });

        await page.goto('/deck');
        await page.click('button[aria-label="Add a new card"]');
        await page.fill('id=card-title', `Uncheck Test ${Date.now()}`);
        await page.click('button[aria-label="Tiny"]');
        await page.click('button:has-text("Create Card")');
        await expect(page.getByText(/Your card is ready/i)).toBeVisible({ timeout: 10000 });

        const card = page.locator('.cursor-grab').first();
        const box = await card.boundingBox();
        if (box) {
            await page.mouse.move(box.x + box.width / 2, box.y + 20);
            await page.mouse.down();
            await page.mouse.move(box.x + box.width / 2, box.y + 400, { steps: 20 });
            await page.mouse.up();
        }

        await page.click('button:has-text("Let\'s do these!")');
        await expect(page).toHaveURL(/\/focus\/.+/, { timeout: 10000 });

        const checkboxes = page.locator('input[type="checkbox"]');

        await checkboxes.nth(0).check();
        await expect(page.getByText('1 / 2')).toBeVisible({ timeout: 5000 });

        await checkboxes.nth(1).check();
        await expect(page.getByText('2 / 2')).toBeVisible({ timeout: 5000 });

        await checkboxes.nth(0).uncheck();
        await expect(page.getByText('1 / 2')).toBeVisible({ timeout: 5000 });
    });

    test('should complete task, show celebration, and redirect to deck', async ({ page }) => {
        await page.route('**/api/unblocker/*/decompose', async (route) => {
            await route.fulfill({
                json: [
                    { id: 'n1', text: 'Open the document', estimatedSeconds: 60, emotionalEffort: 'zero', isCompleted: false, parentTaskId: '', generatedByAI: true },
                    { id: 'n2', text: 'Write one sentence', estimatedSeconds: 60, emotionalEffort: 'minimal', isCompleted: false, parentTaskId: '', generatedByAI: true },
                ]
            });
        });
        await page.route('**/api/garden/complete/*', async (route) => {
            await route.fulfill({
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

        await page.goto('/deck');
        await page.click('button[aria-label="Add a new card"]');
        await page.fill('id=card-title', `Complete Test ${Date.now()}`);
        await page.click('button[aria-label="Tiny"]');
        await page.click('button:has-text("Create Card")');
        await expect(page.getByText(/Your card is ready/i)).toBeVisible({ timeout: 10000 });

        const card = page.locator('.cursor-grab').first();
        const box = await card.boundingBox();
        if (box) {
            await page.mouse.move(box.x + box.width / 2, box.y + 20);
            await page.mouse.down();
            await page.mouse.move(box.x + box.width / 2, box.y + 400, { steps: 20 });
            await page.mouse.up();
        }

        await page.click('button:has-text("Let\'s do these!")');
        await expect(page).toHaveURL(/\/focus\/.+/, { timeout: 10000 });

        const checkboxes = page.locator('input[type="checkbox"]');
        await checkboxes.nth(0).check();
        await checkboxes.nth(1).check();

        await page.click('button:has-text("Mark Complete")');

        // Celebration overlay appears (one of the 5 messages)
        const celebrationMessages = [
            'You did it!', 'Amazing work!', 'One step closer!',
            'Look at you go!', "That's a win!"
        ];
        let celebrationFound = false;
        for (const msg of celebrationMessages) {
            if (await page.getByText(msg, { exact: false }).isVisible({ timeout: 3000 }).catch(() => false)) {
                celebrationFound = true;
                break;
            }
        }
        expect(celebrationFound).toBe(true);

        // Redirect to deck after celebration
        await expect(page).toHaveURL(/\/deck/, { timeout: 5000 });
    });

    test('should pause and resume timer', async ({ page }) => {
        await page.route('**/api/unblocker/*/decompose', async (route) => {
            await route.fulfill({
                json: [
                    { id: 'n1', text: 'Open the document', estimatedSeconds: 60, emotionalEffort: 'zero', isCompleted: false, parentTaskId: '', generatedByAI: true },
                ]
            });
        });
        await page.route('**/api/garden/complete/*', async (route) => {
            await route.fulfill({ json: { success: true } });
        });

        await page.goto('/deck');
        await page.click('button[aria-label="Add a new card"]');
        await page.fill('id=card-title', `Timer Test ${Date.now()}`);
        await page.click('button[aria-label="Small"]');
        await page.click('button:has-text("Create Card")');
        await expect(page.getByText(/Your card is ready/i)).toBeVisible({ timeout: 10000 });

        const card = page.locator('.cursor-grab').first();
        const box = await card.boundingBox();
        if (box) {
            await page.mouse.move(box.x + box.width / 2, box.y + 20);
            await page.mouse.down();
            await page.mouse.move(box.x + box.width / 2, box.y + 400, { steps: 20 });
            await page.mouse.up();
        }

        await page.click('button:has-text("Let\'s do these!")');
        await expect(page).toHaveURL(/\/focus\/.+/, { timeout: 10000 });

        const getTimerText = async () => page.locator('text=/\\d{1,2}:\\d{2}/').first().textContent();
        const timerBefore = await getTimerText();

        // Pause
        const pauseBtn = page.locator('button[aria-label*="pause" i], button:has-text("Pause")').first();
        await pauseBtn.click();

        await page.waitForTimeout(2000);
        const timerWhilePaused = await getTimerText();
        expect(timerWhilePaused).toBe(timerBefore);

        // Resume
        const playBtn = page.locator('button[aria-label*="play" i], button:has-text("Play")').first();
        await playBtn.click();

        await page.waitForTimeout(1500);
        const timerAfterResume = await getTimerText();
        expect(timerAfterResume).not.toBe(timerBefore);
    });
});
