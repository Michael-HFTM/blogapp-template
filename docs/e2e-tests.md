# E2E-Tests mit AI

Tests liegen in `e2e/`, ausführen mit `npx playwright test` (startet App und BFF selbst via `webServer`).
Die API wird in `e2e/fixtures.ts` per `page.route` gemockt.

## Aufgabe 4: Blog-Liste

### Akzeptanzkriterien

1. Wenn die Seite geladen wird, werden Blog-Einträge angezeigt.
2. Jeder Blog-Eintrag zeigt einen Titel und eine Zusammenfassung.
3. Wählt man im Autorenfilter einen Autor, werden nur noch dessen Einträge angezeigt; mit „all“ wieder alle.

### Prompt

```text
Schreibe einen Playwright E2E-Test für diese Akzeptanzkriterien:
1. Wenn die Seite geladen wird, werden Blog-Einträge angezeigt.
2. Jeder Blog-Eintrag zeigt einen Titel und eine Zusammenfassung.
3. Wählt man im Autorenfilter einen Autor, werden nur noch dessen Einträge angezeigt.
Die App läuft auf http://localhost:4200.
Nutze TypeScript und @playwright/test.
```

### Generierter Test (Auszug)

```ts
await page.goto('http://localhost:4200');
const posts = page.locator('.blog-post');
await expect(posts.first()).toBeVisible();
// ...
await expect(posts.nth(i).locator('h2')).not.toBeEmpty();
await expect(posts.nth(i).locator('.summary')).not.toBeEmpty();
// ...
await page.selectOption('#author-filter', { index: 1 });
```

### Review

| Problem                                                                                                          | Fix                                                                                   |
| ---------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------- |
| `.blog-post`, `h2`, `.summary`, `.author` existieren nicht, die App nutzt `app-blog-card` mit Material-Elementen | `app-blog-card`, `mat-card-title`, `mat-card-content`, `mat-card-subtitle`            |
| `#author-filter` existiert nicht                                                                                 | `getByLabel('Autor')`, das `<select>` steckt in einem `<label>`                       |
| AK2 war **falsch grün**: `count()` liefert sofort 0, die Schleife läuft nie, keine Assertion greift              | Zuerst `await expect(cards).toHaveCount(n)`, das wartet auch auf die asynchrone Liste |
| AK3 hat nicht geprüft, dass danach weniger Einträge da sind, und „all“ fehlte                                    | Anzahl vorher/nachher prüfen, zurück auf „all“                                        |
| Absolute URL statt `baseURL` aus der Config                                                                      | `page.goto('/')`                                                                      |
| Live-Daten ändern sich laufend (andere Studierende posten), `not.toBeEmpty()` ist eine schwache Assertion        | API mocken, konkrete Texte prüfen                                                     |

### Ergebnis vor dem Fix

```text
2 failed
  blog-list.spec.ts › zeigt Blog-Einträge beim Laden der Seite
    locator('.blog-post').first() – element(s) not found
  blog-list.spec.ts › Autorenfilter zeigt nur Einträge des gewählten Autors
    page.selectOption: Test timeout of 30000ms exceeded – waiting for locator('#author-filter')
1 passed   ← AK2, falsch grün
```

Nach dem Fix: 3 passed.

## Aufgabe 5: Blog-Detail

### Akzeptanzkriterien

1. Klickt man in der Liste auf einen Eintrag, öffnet sich `/blog/:id` mit dem Titel als Überschrift.
2. Die Detailseite zeigt den Autor und den vollständigen Inhalt.
3. Die Kommentare werden mit ihrer Anzahl aufgelistet.
4. Hat ein Blog keine Kommentare, steht „Noch keine Kommentare.“ da.
5. Eine unbekannte ID zeigt „Blog-Post nicht gefunden.“

Ergebnis: 5 passed (`e2e/blog-detail.spec.ts`).

### Review

- Kommentare über das vorhandene `data-testid="comments"` statt über CSS-Klassen gesucht.
- AK5 braucht einen 404 vom Mock, der Resolver liefert dann `undefined`.

### Bonus

`playwright.config.ts` speichert bei Fehlern einen Screenshot (`screenshot: 'only-on-failure'`), zu finden im HTML-Report.
