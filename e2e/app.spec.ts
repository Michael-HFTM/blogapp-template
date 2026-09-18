import { test, expect } from '@playwright/test';

test('should display the welcome page', async ({ page }) => {
  await page.goto('/');

  await expect(page.locator('.app-toolbar')).toContainText('HFTM Web Applications');
});
