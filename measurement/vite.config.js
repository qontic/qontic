import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { readFileSync } from "fs";
const { version } = JSON.parse(readFileSync(new URL("./package.json", import.meta.url)));

export default defineConfig({
  plugins: [react()],
  base: "./",
  build: { outDir: "dist" },
  define: { __APP_VERSION__: JSON.stringify(version) },
});
