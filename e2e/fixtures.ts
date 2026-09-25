import { Page } from '@playwright/test';

// Die echte API liefert Live-Daten, die andere Studierende laufend ändern.
// Feste Testdaten halten die Assertions stabil.
const blog = (id: number, author: string, title: string, contentPreview: string) => ({
  id,
  title,
  contentPreview,
  author,
  likes: 0,
  comments: id === 1 ? 2 : 0,
  likedByMe: false,
  createdByMe: false,
  createdAt: '2026-01-15T10:00:00Z',
  updatedAt: '2026-01-15T10:00:00Z',
});

export const blogs = [
  blog(1, 'alice', 'Angular Signals', 'Signals im Überblick'),
  blog(2, 'bob', 'Playwright Basics', 'Erste Schritte mit E2E-Tests'),
  blog(3, 'alice', 'Vitest statt Karma', 'Warum der Wechsel lohnt'),
];

const comments = [
  {
    id: 10,
    author: 'bob',
    content: 'Sehr hilfreich!',
    createdAt: '2026-01-16T08:00:00Z',
    updatedAt: '2026-01-16T08:00:00Z',
  },
  {
    id: 11,
    author: 'carol',
    content: 'Danke für den Artikel.',
    createdAt: '2026-01-17T08:00:00Z',
    updatedAt: '2026-01-17T08:00:00Z',
  },
];

export async function mockApi(page: Page): Promise<void> {
  await page.route('**/api/auth/me', (route) =>
    route.fulfill({ json: { isAuthenticated: false, user: null } }),
  );

  // Kein /api-Präfix: der Prod-Build (CI) ruft das Backend direkt auf, der Dev-Server via /api-Proxy.
  await page.route(/\/entries$/, (route) =>
    route.fulfill({
      json: { data: blogs, totalCount: blogs.length, pageIndex: 0, pageSize: 10, maxPageSize: 100 },
    }),
  );

  await page.route(/\/entries\/\d+$/, (route) => {
    const id = Number(route.request().url().split('/').pop());
    const found = blogs.find((b) => b.id === id);
    if (!found) {
      return route.fulfill({ status: 404, json: { message: 'Not found' } });
    }
    const { contentPreview, ...rest } = found;
    return route.fulfill({
      json: {
        ...rest,
        content: `${contentPreview} – vollständiger Inhalt.`,
        comments: id === 1 ? comments : [],
      },
    });
  });
}
