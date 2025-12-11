import { sentryVitePlugin } from "@sentry/vite-plugin";
import path from "path";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import svgr from "vite-plugin-svgr";

export default defineConfig(({ mode }) => {
  const isProdBuild = mode === "production";

  return {
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
    }),
    //only upload source maps to sentry on prod builds
    isProdBuild &&
    sentryVitePlugin({
      org: "na-h55",
      project: "javascript-react-aword-prod",
      authToken: process.env.SENTRY_AUTH_TOKEN,
      sourcemaps: {
        filesToDeleteAfterUpload: ["./dist/**/*.map"],
      }
    })
  ].filter(Boolean),
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },

    build: {
      sourcemap: true
    }
  }
});
