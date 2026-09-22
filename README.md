# Michaels Blogapp

URI: https://michaelsblogapp.z36.web.core.windows.net/

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 21.1.1.

## Development server

Local development needs **two** processes:

| Process               | Port   | Purpose                                                                |
| --------------------- | ------ | ---------------------------------------------------------------------- |
| Angular dev server    | `4200` | the UI                                                                 |
| BFF (Azure Functions) | `7071` | auth (Keycloak) + proxy to the blog backend, attaches the bearer token |

`proxy.conf.json` forwards every `/api` call from `4200` to `7071`. Running `ng serve` on its
own therefore gives you a UI whose blog list stays empty — the API calls have nowhere to go.

### One-time setup

1. **Install the Azure Functions Core Tools v4** (provides the `func` command):

   ```bash
   npm install -g azure-functions-core-tools@4 --unsafe-perm true
   # or on Windows: winget install Microsoft.Azure.FunctionsCoreTools
   ```

2. **Install dependencies** — the BFF has its own `package.json`:

   ```bash
   npm install
   cd bff && npm install && cd ..
   ```

3. **Create `bff/local.settings.json`.** The file is gitignored (it holds the client secret),
   so it does not exist after a fresh clone and the BFF refuses to start without it:

   ```json
   {
     "IsEncrypted": false,
     "Values": {
       "FUNCTIONS_WORKER_RUNTIME": "node",
       "AzureWebJobsStorage": "",
       "BACKEND_API_URL": "https://d-cap-blog-backend---v2.whitepond-b96fee4b.westeurope.azurecontainerapps.io",
       "ALLOWED_ORIGIN": "http://localhost:4200",
       "KEYCLOAK_URL": "https://<keycloak-host>/realms/<realm>",
       "KEYCLOAK_CLIENT_ID": "<client-id>",
       "KEYCLOAK_CLIENT_SECRET": "<client-secret>",
       "SESSION_SECRET": "<at least 32 random characters>"
     }
   }
   ```

   - `ALLOWED_ORIGIN` — doubles as the CORS origin and the base of the Keycloak redirect URI.
     **No trailing slash**, otherwise the redirect URI gets a double slash and Keycloak rejects
     it. `http://` here also switches the session cookie out of `Secure` mode, which plain
     `http://localhost` requires.
   - `KEYCLOAK_URL` — must already include `/realms/<realm>`; the code appends
     `/protocol/openid-connect/...`.
   - `SESSION_SECRET` — needs **≥ 32 characters**, Iron rejects anything shorter.
     Generate one with `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`.

4. **Register the redirect URI in Keycloak** for the client, otherwise login fails with
   `Invalid parameter: redirect_uri`:
   - Valid redirect URI: `http://localhost:4200/api/auth/callback`
   - Valid post logout redirect URI: `http://localhost:4200/`
   - Web origin: `http://localhost:4200`

### Starting the app

```bash
npm start
```

This runs the Angular dev server and the BFF together (via `concurrently`). Open
`http://localhost:4200/`. The UI reloads on source changes; the BFF is rebuilt by its
`prestart` hook, so **restart `npm start` after editing anything under `bff/src`**.

Individual processes, if you need them:

```bash
ng serve            # frontend only — /api calls will fail
npm run start:bff   # BFF only, on http://localhost:7071
```

### Troubleshooting

| Symptom                                                    | Cause                                                                            |
| ---------------------------------------------------------- | -------------------------------------------------------------------------------- |
| `func: command not found` / `'func' is not recognized`     | Azure Functions Core Tools not installed (step 1)                                |
| BFF exits with `Missing required environment variable ...` | `bff/local.settings.json` missing or incomplete (step 3)                         |
| Blog list empty, `/api/entries` returns 404                | BFF not running — use `npm start`, not `ng serve`                                |
| Login ends in `Invalid parameter: redirect_uri`            | redirect URI not registered in Keycloak (step 4)                                 |
| Logged out again right after login                         | `SESSION_SECRET` shorter than 32 chars, or `ALLOWED_ORIGIN` has a trailing slash |
| `Port 7071 is unavailable`                                 | an older `func` process is still running — kill it and restart                   |

Production builds do **not** use the BFF: `src/environments/environment.ts` sets
`authEnabled: false` and points `apiUrl` straight at the backend, so the deployed site is
read-only. Creating posts and liking only work locally.

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/app/browser/` directory (the output path is configured as `dist/app` in `angular.json`). By default, the production build optimizes your application for performance and speed.

## Deployment to Azure Storage (Static Website)

The app is hosted as a static website on an Azure Storage Account (`$web` container).

### One-time setup in the Azure Portal

1. **Create a Storage Account** (Standard, LRS, a permitted region such as `polandcentral`).
2. Open the account → **Static website** (under _Data management_) → **Enabled**.
   - **Index document name:** `index.html`
   - **Error document path:** `index.html` (required for Angular client-side routing — every unknown path falls back to `index.html`)
   - **Save**. The primary endpoint looks like `https://<account>.z16.web.core.windows.net`.

> Note: `staticwebapp.config.json` is only honoured by Azure **Static Web Apps**, not by Storage static-website hosting. Routing falls back via the **Error document path** instead.

### Manual deploy with the Azure CLI

```bash
ng build
az login

# Optional: clear stale (hashed) files first so $web matches the build exactly
az storage blob delete-batch --account-name <account> --source '$web'

az storage blob upload-batch \
  --account-name <account> \
  --source dist/app/browser \
  --destination '$web' \
  --overwrite
```

### Automatic deploy via GitHub Actions

`.github/workflows/azure-deploy.yml` builds and uploads to `$web` on every push to `main`.
Add these repository secrets (Settings → Secrets and variables → Actions):

- `STORAGE_ACCOUNT_NAME` — the storage account name
- `STORAGE_ACCOUNT_KEY` — an access key (Storage account → _Access keys_)

## Running unit tests

To execute unit tests with the [Vitest](https://vitest.dev/) test runner, use the following command:

```bash
ng test
```

## Running end-to-end tests

End-to-end tests run on [Playwright](https://playwright.dev/) (`playwright.config.ts`, specs in `e2e/`):

```bash
npm run e2e      # headless
npm run e2e:ui   # interactive UI mode
```

Playwright starts the app itself via `npm start` (so the BFF setup above applies) and reuses an
already running dev server on port `4200`.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.
