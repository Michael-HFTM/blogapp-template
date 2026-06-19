import { test, expect } from '@playwright/test';

test('should display the welcome page', async ({ page }) => {
  await page.goto('/');

  await expect(page.locator('mat-toolbar')).toContainText('HFTM Web Applications');
});
