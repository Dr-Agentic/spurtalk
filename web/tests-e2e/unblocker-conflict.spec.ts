import { test, expect } from '@playwright/test';

test.describe('Unblocker Conflict Resolution', () => {
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

    test('should show conflict modal when task has existing sub-tasks', async ({ page }) => {
        // Create a parent task
        await page.click('button[aria-label="Add a new card"]');
        await page.fill('id=card-title', `Conflict Parent ${Date.now()}`);
        await page.click('button[aria-label="Big"]');
        await page.click('button:has-text("Create Card")');
        await expect(page.getByText(/Your card is ready/i)).toBeVisible({ timeout: 10000 });

        // Create a child task linked to parent
        await page.click('button[aria-label="Add a new card"]');
        await page.fill('id=card-title', `Existing Child ${Date.now()}`);
        await page.click('button[aria-label="Small"]');
        // Select parent in dropdown
        const parentSelect = page.locator('#parent-task');
        await parentSelect.selectOption({ label: `Conflict Parent ${Date.now()}` });
        await page.click('button:has-text("Create Card")');
        await expect(page.getByText(/Your card is ready/i)).toBeVisible({ timeout: 10000 });

        // Mock AI endpoints
        await page.route('**/api/unblocker/*/decompose', async (route) => {
            await route.fulfill({
                json: [
                    { id: 'n1', text: 'AI Step 1', estimatedSeconds: 60, emotionalEffort: 'zero', isCompleted: false, parentTaskId: '', generatedByAI: true }
                ]
            });
        });
        await page.route('**/api/tasks/*/plan', async (route) => {
            await route.fulfill({
                json: [
                    { title: 'AI Sub-task 1', description: 'Desc', effortLevel: 'Small' },
                    { title: 'AI Sub-task 2', description: 'Desc', effortLevel: 'Tiny' }
                ]
            });
        });
        await page.route('**/api/tasks/*/subtasks', async (route) => {
            await route.fulfill({ json: [] });
        });

        await page.reload();
        await page.waitForLoadState('networkidle');
        await expect(page.getByText(/loading/i)).toBeHidden({ timeout: 10000 });

        // Swipe down on parent (first card)
        const card = page.locator('.cursor-grab').first();
        const box = await card.boundingBox();
        if (box) {
            await page.mouse.move(box.x + box.width / 2, box.y + 20);
            await page.mouse.down();
            await page.mouse.move(box.x + box.width / 2, box.y + 400, { steps: 20 });
            await page.mouse.up();
        }

        // Should show conflict resolution modal (since parent already has children)
        await expect(page.getByText(/Found existing sub-tasks/i)).toBeVisible({ timeout: 10000 });
    });

    test('should send "supplement" strategy when Supplement is chosen', async ({ page }) => {
        const parentTitle = `Supplement Parent ${Date.now()}`;

        // Create parent
        await page.click('button[aria-label="Add a new card"]');
        await page.fill('id=card-title', parentTitle);
        await page.click('button[aria-label="Big"]');
        await page.click('button:has-text("Create Card")');
        await expect(page.getByText(/Your card is ready/i)).toBeVisible({ timeout: 10000 });

        // Create child
        await page.click('button[aria-label="Add a new card"]');
        await page.fill('id=card-title', `Kept Existing Child ${Date.now()}`);
        await page.click('button[aria-label="Small"]');
        await page.locator('#parent-task').selectOption({ label: parentTitle });
        await page.click('button:has-text("Create Card")');
        await expect(page.getByText(/Your card is ready/i)).toBeVisible({ timeout: 10000 });

        // Mocks
        await page.route('**/api/unblocker/*/decompose', async (route) => {
            await route.fulfill({
                json: [
                    { id: 'n1', text: 'AI Step', estimatedSeconds: 60, emotionalEffort: 'zero', isCompleted: false, parentTaskId: '', generatedByAI: true }
                ]
            });
        });
        await page.route('**/api/tasks/*/plan', async (route) => {
            await route.fulfill({
                json: [
                    { title: 'AI Sub-task 1', description: 'Desc', effortLevel: 'Small' }
                ]
            });
        });

        let capturedStrategy = '';
        await page.route('**/api/tasks/*/subtasks', async (route) => {
            const body = JSON.parse(route.request().postData() || '{}');
            capturedStrategy = body.strategy;
            await route.fulfill({ json: [] });
        });

        await page.reload();
        await page.waitForLoadState('networkidle');
        await expect(page.getByText(/loading/i)).toBeHidden({ timeout: 10000 });

        const card = page.locator('.cursor-grab').first();
        const box = await card.boundingBox();
        if (box) {
            await page.mouse.move(box.x + box.width / 2, box.y + 20);
            await page.mouse.down();
            await page.mouse.move(box.x + box.width / 2, box.y + 400, { steps: 20 });
            await page.mouse.up();
        }

        await expect(page.getByText(/Found existing sub-tasks/i)).toBeVisible({ timeout: 10000 });

        // Choose Supplement
        const supplementBtn = page.locator('button').filter({ hasText: /supplement/i }).first();
        await supplementBtn.click();

        // Wait for plan view
        await page.waitForTimeout(1000);
        await expect(page.getByText(/Review Project Roadmap/i)).toBeVisible({ timeout: 10000 });

        // Create cards
        const createBtn = page.getByTestId('create-cards-btn');
        if (await createBtn.isVisible({ timeout: 5000 }).catch(() => false)) {
            await createBtn.click();
        }

        // Give time for API call
        await page.waitForTimeout(2000);

        expect(capturedStrategy).toBe('supplement');
    });

    test('should send "replace" strategy when Fresh Start is chosen', async ({ page }) => {
        const parentTitle = `Replace Parent ${Date.now()}`;

        // Create parent
        await page.click('button[aria-label="Add a new card"]');
        await page.fill('id=card-title', parentTitle);
        await page.click('button[aria-label="Big"]');
        await page.click('button:has-text("Create Card")');
        await expect(page.getByText(/Your card is ready/i)).toBeVisible({ timeout: 10000 });

        // Create child
        await page.click('button[aria-label="Add a new card"]');
        await page.fill('id=card-title', `Old Child To Delete ${Date.now()}`);
        await page.click('button[aria-label="Small"]');
        await page.locator('#parent-task').selectOption({ label: parentTitle });
        await page.click('button:has-text("Create Card")');
        await expect(page.getByText(/Your card is ready/i)).toBeVisible({ timeout: 10000 });

        // Mocks
        await page.route('**/api/unblocker/*/decompose', async (route) => {
            await route.fulfill({
                json: [
                    { id: 'n1', text: 'AI Step', estimatedSeconds: 60, emotionalEffort: 'zero', isCompleted: false, parentTaskId: '', generatedByAI: true }
                ]
            });
        });
        await page.route('**/api/tasks/*/plan', async (route) => {
            await route.fulfill({
                json: [
                    { title: 'New Roadmap', description: 'Desc', effortLevel: 'Small' }
                ]
            });
        });

        let capturedStrategy = '';
        await page.route('**/api/tasks/*/subtasks', async (route) => {
            const body = JSON.parse(route.request().postData() || '{}');
            capturedStrategy = body.strategy;
            await route.fulfill({ json: [] });
        });

        await page.reload();
        await page.waitForLoadState('networkidle');
        await expect(page.getByText(/loading/i)).toBeHidden({ timeout: 10000 });

        const card = page.locator('.cursor-grab').first();
        const box = await card.boundingBox();
        if (box) {
            await page.mouse.move(box.x + box.width / 2, box.y + 20);
            await page.mouse.down();
            await page.mouse.move(box.x + box.width / 2, box.y + 400, { steps: 20 });
            await page.mouse.up();
        }

        await expect(page.getByText(/Found existing sub-tasks/i)).toBeVisible({ timeout: 10000 });

        // Choose Replace / Fresh Start
        const replaceBtn = page.locator('button').filter({ hasText: /fresh start|replace/i }).first();
        await replaceBtn.click();

        await page.waitForTimeout(1000);
        const createBtn = page.getByTestId('create-cards-btn');
        if (await createBtn.isVisible({ timeout: 5000 }).catch(() => false)) {
            await createBtn.click();
        }

        await page.waitForTimeout(2000);

        expect(capturedStrategy).toBe('replace');
    });
});
