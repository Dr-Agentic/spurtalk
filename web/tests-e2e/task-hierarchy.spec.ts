import { test, expect } from '@playwright/test';

test.describe('Task Hierarchy E2E (Manual & AI)', () => {
    test.beforeEach(async ({ page }) => {
        // Mirror browser console to test output
        page.on('console', msg => console.log(`[Browser] ${msg.type()}: ${msg.text()} `));

        // 1. Seed the test user
        await page.goto('/login');
        await page.fill('id=email', 'test@example.com');
        await page.fill('id=password', 'password123');
        await page.click('button:has-text("Let\'s go!")');

        await expect(page).toHaveURL(/\/deck$|\/$/, { timeout: 15000 });
        await expect(page.locator('text=Loading...')).toBeHidden({ timeout: 15000 });
    });

    test('should allow manual sub-task creation and show breadcrumbs', async ({ page }) => {
        const timestamp = Date.now();
        const parentTitle = `Parent-${timestamp}`;
        const childTitle = `Child-${timestamp}`;

        // 1. Create Parent
        await page.click('button[aria-label="Add a new card"]');
        await page.fill('id=card-title', parentTitle);
        const mediumButton = page.locator('button[role="radio"], button[role="checkbox"], button').filter({ hasText: /^Medium$/i }).first();
        await mediumButton.click();
        const responsePromise1 = page.waitForResponse(response => response.url().includes('/api/tasks/deck') && response.status() === 200, { timeout: 15000 });
        await page.click('button:has-text("Create Card")');
        await responsePromise1;

        // Wait for parent card to appear (increase timeout for animation/render)
        await expect(page.getByRole('heading', { name: parentTitle }).first()).toBeVisible({ timeout: 30000 });

        // 2. Clear Modal (it might still be closing)
        await page.waitForTimeout(1000);

        // 3. Create Child (Wait for cache to clear by forcing a reload)
        await page.reload();
        await page.waitForLoadState('networkidle');

        await page.click('button[aria-label="Add a new card"]');
        await page.fill('id=card-title', childTitle);
        const smallButton = page.locator('button[role="radio"], button[role="checkbox"], button').filter({ hasText: /^Small$/i }).first();
        await smallButton.click();

        // Wait until Parent appears in the "Parent Task" dropdown
        const select = page.locator('#parent-task');
        await select.click(); // Open the dropdown to force options to render
        await expect(select.locator('option').filter({ hasText: parentTitle })).toBeAttached({ timeout: 20000 });

        await page.selectOption('#parent-task', { label: parentTitle });
        const responsePromise2 = page.waitForResponse(response => response.url().includes('/api/tasks/deck') && response.status() === 200, { timeout: 15000 });
        await page.click('button:has-text("Create Card")');
        await responsePromise2;

        // 4. Verify Breadcrumb on Child Card
        const childCard = page.locator('div').filter({ has: page.getByRole('heading', { name: childTitle }) }).first();
        const breadcrumb = childCard.getByTestId('task-breadcrumb');
        await expect(breadcrumb).toBeVisible({ timeout: 20000 });
        await expect(breadcrumb).toContainText(parentTitle, { ignoreCase: true });
    });

    test('should trigger AI Planning via swipe down', async ({ page }) => {
        const goalTitle = `AI-Goal-${Date.now()}`;
        await page.click('button[aria-label="Add a new card"]');
        await page.fill('id=card-title', goalTitle);
        const bigButton = page.locator('button[role="radio"], button[role="checkbox"], button').filter({ hasText: /^Big$/i }).first();
        await bigButton.click();
        const responsePromise3 = page.waitForResponse(response => response.url().includes('/api/tasks/deck') && response.status() === 200, { timeout: 15000 });
        await page.click('button:has-text("Create Card")');
        await responsePromise3;
        await expect(page.getByRole('heading', { name: goalTitle }).first()).toBeVisible({ timeout: 30000 });

        // Swipe Down on the new card
        const card = page.locator('.cursor-grab').first();
        const boundingBox = await card.boundingBox();
        if (boundingBox) {
            // Mock the AI Decomposition and Planning endpoints to guarantee deterministic fast execution in E2E
            await page.route('**/api/unblocker/*/decompose', async route => {
                await route.fulfill({
                    json: [
                        { text: "Open required tool", estimatedSeconds: 60, emotionalEffort: "zero" },
                        { text: "Identify target area", estimatedSeconds: 60, emotionalEffort: "zero" }
                    ]
                });
            });

            await page.route('**/api/tasks/*/plan', async route => {
                await route.fulfill({
                    json: [
                        { title: "Understand context", description: "Review docs", effortLevel: "Small" },
                        { title: "Write code", description: "Draft the implementation", effortLevel: "Medium" },
                        { title: "Testing phase", description: "Validate the code", effortLevel: "Big" }
                    ]
                });
            });

            // Use pointer events to simulate a downward drag
            await page.mouse.move(boundingBox.x + boundingBox.width / 2, boundingBox.y + 20);
            await page.mouse.down();
            await page.mouse.move(boundingBox.x + boundingBox.width / 2, boundingBox.y + 400, { steps: 20 }); // Drag down significantly down to trigger the decompose threshold (usually >100px)
            await page.mouse.up();
        }

        // Verify Unblocker opens
        await expect(page.getByText(/Stuck\? Let's break it down/i)).toBeVisible({ timeout: 20000 });

        // AI Planning (using robust evaluate click to bypass actionability checks)
        const planBtn = page.getByTestId('plan-subtasks-btn');
        await expect(planBtn).toBeAttached({ timeout: 20000 });
        await planBtn.evaluate((btn: HTMLElement) => btn.click());

        // Wait for AI generating state to pass and Create Cards button to appear
        // Because a new task has no subtasks, it skips the conflict resolution screen
        // and jumps directly to the "plan" state.
        const createButton = page.getByTestId('create-cards-btn');
        await expect(createButton).toBeAttached({ timeout: 60000 });
        await expect(createButton).not.toBeDisabled({ timeout: 10000 });
        await createButton.evaluate((btn: HTMLElement) => btn.click());

        // Should see breadcrumb back in deck
        const newChild = page.locator('.cursor-grab').first();
        await expect(newChild.getByTestId('task-breadcrumb')).toBeVisible({ timeout: 30000 });
        await expect(newChild.getByTestId('task-breadcrumb')).toContainText(goalTitle, { ignoreCase: true });
    });
});
