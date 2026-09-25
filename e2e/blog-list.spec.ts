import { test, expect } from '@playwright/test';
import { blogs, mockApi } from './fixtures';

test.describe('Blog-Liste', () => {
  test.beforeEach(async ({ page }) => {
    await mockApi(page);
    await page.goto('/');
  });

  test('AK1: zeigt Blog-Einträge beim Laden der Seite', async ({ page }) => {
    await expect(page.locator('app-blog-card')).toHaveCount(blogs.length);
  });

  test('AK2: jeder Blog-Eintrag zeigt Titel und Zusammenfassung', async ({ page }) => {
    const cards = page.locator('app-blog-card');
    await expect(cards).toHaveCount(blogs.length);

    for (const [i, blog] of blogs.entries()) {
      await expect(cards.nth(i).locator('mat-card-title')).toHaveText(blog.title);
      await expect(cards.nth(i).locator('mat-card-content')).toHaveText(blog.contentPreview);
    }
  });

  test('AK3: Autorenfilter zeigt nur Einträge des gewählten Autors', async ({ page }) => {
    await page.getByLabel('Autor').selectOption('bob');

    const cards = page.locator('app-blog-card');
    await expect(cards).toHaveCount(1);
    await expect(cards.locator('mat-card-subtitle')).toHaveText('bob');

    await page.getByLabel('Autor').selectOption('all');
    await expect(cards).toHaveCount(blogs.length);
  });
});
