import { test, expect } from '@playwright/test';
import { mockApi } from './fixtures';

test.describe('Blog-Detail', () => {
  test.beforeEach(async ({ page }) => {
    await mockApi(page);
  });

  test('AK1: Klick auf einen Eintrag öffnet dessen Detailseite', async ({ page }) => {
    await page.goto('/');
    await page.locator('app-blog-card').filter({ hasText: 'Playwright Basics' }).click();

    await expect(page).toHaveURL(/\/blog\/2$/);
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('Playwright Basics');
  });

  test('AK2: zeigt Autor und vollständigen Inhalt', async ({ page }) => {
    await page.goto('/blog/1');

    await expect(page.locator('.blog-meta')).toContainText('alice');
    await expect(page.locator('.blog-content')).toHaveText(
      'Signals im Überblick – vollständiger Inhalt.',
    );
  });

  test('AK3: listet die Kommentare mit Anzahl auf', async ({ page }) => {
    await page.goto('/blog/1');

    const comments = page.getByTestId('comments');
    await expect(comments.getByRole('heading', { level: 2 })).toHaveText('Kommentare (2)');
    await expect(comments.locator('.comment')).toHaveCount(2);
    await expect(comments).toContainText('Sehr hilfreich!');
  });

  test('AK4: Blog ohne Kommentare zeigt einen Hinweis', async ({ page }) => {
    await page.goto('/blog/2');

    await expect(page.getByTestId('comments')).toContainText('Noch keine Kommentare.');
  });

  test('AK5: unbekannte ID zeigt „nicht gefunden“', async ({ page }) => {
    await page.goto('/blog/999');

    await expect(page.getByText('Blog-Post nicht gefunden.')).toBeVisible();
  });
});
