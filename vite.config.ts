import { sentryVitePlugin } from "@sentry/vite-plugin";
import path from "path";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import svgr from "vite-plugin-svgr";

export default defineConfig({
  plugins: [react(), tailwindcss(), svgr({
    // Only transform when you opt in with ?react
    include: "**/*.svg?react",
    svgrOptions: {
      // SVGO is on by default, but we pass config to keep viewBox
      svgo: true,
      svgoConfig: {
        plugins: [
          {
            name: "preset-default",
            params: { overrides: { removeViewBox: false } },
          },
        ],
      },
    },
  }), sentryVitePlugin({
    org: "na-h55",
    project: "javascript-react-aword",
    authToken: process.env.SENTRY_AUTH_TOKEN,
    sourcemaps: {
      filesToDeleteAfterUpload: ["./dist/**/*.map"],
    }
  })],

  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },

  build: {
    sourcemap: true
  }
});
