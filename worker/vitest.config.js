import { defineConfig } from "vitest/config";

// Own config so the Worker tests do not inherit the app's jsdom environment
// and Svelte setup from the repo root.
export default defineConfig({
  test: {
    environment: "node",
    include: ["src/**/*.test.js"],
    coverage: {
      provider: "v8",
      reporter: ["text", "json-summary"],
      include: ["src/**/*.js"],
      exclude: ["src/**/*.test.js"],
      thresholds: { lines: 75 },
    },
  },
});
