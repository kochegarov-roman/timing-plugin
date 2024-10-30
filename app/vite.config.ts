import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import cssInjectedByJsPlugin from "vite-plugin-css-injected-by-js";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), cssInjectedByJsPlugin()],
  build: {
    rollupOptions: {
      output: {
        entryFileNames: `schedule.js`,
        manualChunks: undefined,
      },
    },
  },
  server: {
    port: 3000,
    host: "0.0.0.0",
  },
});
