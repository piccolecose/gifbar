import { spawn, spawnSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { PORT, startStubServer } from "./stub-server.js";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
let stubServer;
let tauriDriver;

export const config = {
  runner: "local",
  specs: ["./specs/*.js"],
  maxInstances: 1,
  hostname: "127.0.0.1",
  port: 4444,
  capabilities: [
    {
      maxInstances: 1,
      "tauri:options": {
        application: path.join(root, "src-tauri/target/debug/gifbar"),
      },
    },
  ],
  framework: "mocha",
  reporters: ["spec"],
  mochaOpts: { timeout: 60000 },
  waitforTimeout: 15000,

  onPrepare: async () => {
    stubServer = await startStubServer();
    const build = spawnSync(
      "npx",
      ["tauri", "build", "--debug", "--no-bundle", "--config", "e2e/tauri.e2e.conf.json"],
      {
        cwd: root,
        stdio: "inherit",
        env: { ...process.env, VITE_GIF_API_BASE: `http://127.0.0.1:${PORT}` },
      },
    );
    if (build.status !== 0) throw new Error("tauri build failed");
  },

  onComplete: () => stubServer.close(),

  beforeSession: () => {
    tauriDriver = spawn("tauri-driver", [], {
      stdio: [null, process.stdout, process.stderr],
    });
  },

  // The app starts hidden behind the tray icon, and WebDriver cannot type
  // into a hidden window.
  before: () => browser.execute(() => window.__TAURI__.window.getCurrentWindow().show()),

  afterSession: () => tauriDriver.kill(),
};
