import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { viteSingleFile } from "vite-plugin-singlefile";

// `vite build --mode single` bundles everything into one HTML file (used for the shareable preview).
export default defineConfig(({ mode }) => ({
  plugins: [react(), ...(mode === "single" ? [viteSingleFile()] : [])],
  build: mode === "single" ? { outDir: "dist-single" } : {},
  server: {
    // Dev: forward /api calls to the Node server
    proxy: { "/api": "http://localhost:4000" },
  },
}));
