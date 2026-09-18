# Security-Audit — blogapp-template

Stand: 2026-09-18 · Branch `feature/responsive-design-and-security`

Untersucht wurde das Angular-Frontend unter `src/` sowie ergänzend der BFF unter `bff/`.

---

## Aufgabe 4 — Findings

Gesucht wurde (VS Code / `grep -rn`) nach `innerHTML`, `bypassSecurityTrust`,
`DomSanitizer`, `document.write`, `eval(`, `window.location`, `redirect` und `queryParams`.

| Nr. | Datei                             | Problem                                                                                                                                                                                                                                           | Risiko        | Fix                                                                                                                                                                                                                                                                                                    |
| --- | --------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| 1   | gesamtes `src/`                   | Kein einziger Treffer für `innerHTML`, `bypassSecurityTrust`, `DomSanitizer`, `document.write` oder `eval(`. Sämtliche User-Inhalte (Titel, Autor, Preview, Kommentare) werden über `{{ }}` ausgegeben und damit von Angular automatisch escaped. | keins         | keine Massnahme nötig                                                                                                                                                                                                                                                                                  |
| 2   | `src/app/feature/login/login.ts`  | `returnUrl` wird über `withComponentInputBinding()` direkt aus dem Query-String gebunden und ging ungeprüft in den Login-Redirect. Ein Link wie `/login?returnUrl=https://phishing.example` ist damit eine Open-Redirect-Fläche.                  | mittel → tief | **Behoben:** `safeReturnUrl()` lässt nur noch same-site Pfade zu (kein `//`, kein `/\`), sonst Fallback `/`. Serverseitig prüft `safeReturnUrl()` in `bff/src/lib/keycloak.ts` dasselbe (Test in `keycloak.spec.ts`) — der Client-Check ist Defense-in-Depth, der BFF bleibt die eigentliche Schranke. |
| 3   | `src/app/core/auth/auth.store.ts` | `window.location.href = logoutUrl` — die Ziel-URL stammt aus der JSON-Antwort des eigenen BFF.                                                                                                                                                    | tief          | Keine Änderung. Die Quelle ist der eigene Backend-Endpoint, kein User-Input. Würde der BFF kompromittiert, wäre der Redirect das kleinste Problem.                                                                                                                                                     |
| 4   | `src/index.html`                  | Es war keine Content-Security-Policy gesetzt — ein erfolgreicher XSS hätte beliebige externe Skripte nachladen können.                                                                                                                            | mittel        | **Behoben:** CSP als `<meta http-equiv>` ergänzt, siehe Aufgabe 7.                                                                                                                                                                                                                                     |

### Nicht sicherheitsrelevant, aber aufgefallen

`src/app/feature/blog/blog-detail/blog-detail.resolver.ts` wandelt die Route-ID per
`Number(...)` um, ohne auf `NaN` zu prüfen. Das ist ein Robustheitsthema (die View zeigt
dann „Blog-Post nicht gefunden"), kein Sicherheitsproblem — bewusst nicht geändert.

---

## Aufgabe 5 — Auth-Guard-Review

Geprüft in `src/app/app.routes.ts`. Ergebnis: **es fehlt kein Guard.**

| Route                       | Guard                           | Bewertung                              |
| --------------------------- | ------------------------------- | -------------------------------------- |
| `''` (Blog-Übersicht)       | —                               | korrekt öffentlich                     |
| `blog/:id` (einzelner Post) | —                               | korrekt öffentlich                     |
| `blog/create`               | `canMatch: [roleGuard('user')]` | geschützt — nur mit Realm-Rolle `user` |
| `about`                     | —                               | korrekt öffentlich                     |
| `login`                     | —                               | korrekt öffentlich                     |
| `profile`                   | `canMatch: [authGuard]`         | geschützt — nur eingeloggt             |
| `**` (Error)                | —                               | korrekt öffentlich                     |

- Beide Guards leiten nicht-authentifizierte Besucher auf `/login?returnUrl=…` um
  (`auth.guard.ts`, `role.guard.ts`).
- `roleGuard` schickt eingeloggte Besucher **ohne** die Rolle bewusst auf `/` statt auf
  `/login` — ein zweites Login-Formular würde eine Lösung suggerieren, die es nicht gibt.
- Verwendet wird durchgängig `canMatch` statt `canActivate`: So lädt ein anonymer
  Besucher den Lazy-Chunk der geschützten Route gar nicht erst herunter.
- Wichtig: Die Guards sind reiner UI-Schutz. Die echte Autorisierung passiert im BFF
  (`bff/src/functions/proxy-*.ts`) bzw. im Backend — ein Guard im Browser ist umgehbar.

---

## Aufgabe 7 — Content Security Policy

Gesetzt in `src/index.html` als `<meta http-equiv="Content-Security-Policy">`:

```
default-src 'self';
script-src 'self';
style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
font-src 'self' https://fonts.gstatic.com;
img-src 'self' data: https:;
connect-src 'self' https://d-cap-blog-backend---v2.whitepond-b96fee4b.westeurope.azurecontainerapps.io;
object-src 'none';
base-uri 'self';
form-action 'self'
```

Begründung der einzelnen Direktiven:

- **`default-src 'self'`** — Grundregel: alles nur von der eigenen Domain, alles Übrige
  wird durch die folgenden Direktiven gezielt wieder geöffnet.
- **`script-src 'self'`** — kein `'unsafe-inline'`, kein `'unsafe-eval'`. Angular kommt
  ohne aus, weil Templates zur Build-Zeit kompiliert werden (AOT).
- **`style-src … 'unsafe-inline'`** — für Angular Material leider zwingend: Material
  schreibt Theme-Tokens und Component-Styles inline ins DOM. Ohne diesen Eintrag bleibt
  die App unformatiert.
- **`https://fonts.googleapis.com` / `font-src https://fonts.gstatic.com`** — `index.html`
  lädt Roboto und die Material Icons von Google Fonts; das Stylesheet kommt von
  `googleapis.com`, die eigentlichen Font-Dateien von `gstatic.com`.
- **`img-src 'self' data: https:`** — Blog-Header-Bilder kommen als beliebige externe
  URLs aus dem Backend, `data:` wird für Inline-SVGs/Platzhalter gebraucht.
- **`connect-src`** — muss die Prod-`apiUrl` aus `src/environments/environment.ts`
  enthalten, sonst blockiert die CSP sämtliche Blog-Requests im Prod-Build.
- **`object-src 'none'`, `base-uri 'self'`, `form-action 'self'`** — schliessen
  Plugin-Einbettung, `<base>`-Hijacking und Formular-Exfiltration aus.

### Einschränkung: Meta-Tag statt HTTP-Header

Ein `<meta http-equiv>` ist die einzige Möglichkeit, die hier funktioniert: Deployment-Ziel
ist eine **Azure Storage Static Website** (siehe `docs/azure-storage-deployment.md`), die
keine eigenen Response-Header setzen kann.

Im Meta-Tag **wirkungslos** sind `frame-ancestors`, `report-uri`/`report-to` und `sandbox` —
die ignoriert der Browser dort laut Spec. Als echter HTTP-Header sähe die Policy so aus:

```
Content-Security-Policy: default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https:; connect-src 'self' https://d-cap-blog-backend---v2.whitepond-b96fee4b.westeurope.azurecontainerapps.io; object-src 'none'; base-uri 'self'; form-action 'self'; frame-ancestors 'none'
```

Dafür bräuchte es Azure **Static Web Apps** (`staticwebapp.config.json` → `globalHeaders`),
Azure Front Door / CDN mit Rules Engine, oder einen vorgelagerten nginx. Solange auf
Storage deployt wird, fehlt der Clickjacking-Schutz durch `frame-ancestors` — Restrisiko
bewusst akzeptiert.

---

## Experte — `npm audit`

Ausgeführt am 2026-09-18 mit npm 11.3.0.

### Frontend (`/`) — 5 moderate, 0 high/critical

| Paket                       | Severity | Betroffene Version | Advisory                                                                                                                    | Prod-relevant                                                                                         |
| --------------------------- | -------- | ------------------ | --------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------- |
| `@angular/core`             | moderate | `>=22.0.0 <22.1.0` | [GHSA-hh8m-fm6v-7cvg](https://github.com/advisories/GHSA-hh8m-fm6v-7cvg) — Sanitization-Bypass über Directive-Host-Bindings | **ja**                                                                                                |
| `@angular/compiler`         | moderate | `>=22.0.0 <22.1.0` | dasselbe Advisory                                                                                                           | **ja**                                                                                                |
| `@angular/common`           | moderate | `22.0.0 - 22.1.0`  | Information Leak über `HttpTransferCache`-Bypass bei `withRequestsMadeViaParent`                                            | **ja**, aber nicht ausgenutzt: die App nutzt weder SSR/TransferCache noch `withRequestsMadeViaParent` |
| `vitest` / `@vitest/mocker` | moderate | `2.1.0 - 4.1.10`   | [GHSA-82fw-gwwq-j7x9](https://github.com/advisories/GHSA-82fw-gwwq-j7x9) — Path Traversal beim Redirect-Mock                | nein, reine devDependency                                                                             |

Installiert ist aktuell `@angular/core` 22.0.8, gefixt ab **22.1.0**.

Das Angular-Advisory ist das einzige mit echtem Bezug zu diesem Projekt: Ein
Sanitization-Bypass hebelt genau den Schutz aus, auf den sich Finding 1 oben stützt
(„Angular escaped automatisch"). Die hier ergänzte CSP begrenzt den Schaden, ersetzt
das Update aber nicht.

### BFF (`bff/`)

`found 0 vulnerabilities`.

### Massnahme

Bewusst **kein** `npm audit fix` in diesem Branch — der Update auf Angular 22.1.x gehört
in einen eigenen Dependency-Branch und nicht in den Responsive-/Security-Umbau, sonst
vermischen sich Layout-Regressionen mit Framework-Bumps. Empfehlung: zeitnah
`npm audit fix` (Minor-Update innerhalb 22.x, kein Breaking Change) in einem separaten
`chore(deps)`-Commit, anschliessend Unit- und E2E-Tests durchlaufen lassen.
