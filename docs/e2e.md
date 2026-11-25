# E2E tests (#318)

WebdriverIO drives the real debug app through `tauri-driver`. Linux only: tauri-driver does not support macOS.

Run locally on Linux:

1. Install the Tauri Linux deps (see `.github/workflows/ci.yml`) plus `webkit2gtk-driver` and `xvfb`.
2. `cargo install tauri-driver --locked`
3. `npm ci` at the repo root.
4. `cd e2e && npm ci && npm test` (prefix `npm test` with `xvfb-run -a` if headless).

`npm test` starts a stub GIF API (`e2e/stub-server.js`), builds the app with `VITE_GIF_API_BASE` pointing at it and `--config e2e/tauri.e2e.conf.json`, then runs `e2e/specs/`.
The override widens the CSP and points the updater at the stub, for the E2E build only, so tests make no real network calls.
