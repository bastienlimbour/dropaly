import { defineConfig } from "tsdown";

export default defineConfig({
  entry: "./src/index.ts",
  format: "esm",
  outDir: "./dist",
  clean: true,
  env: { NODE_ENV: "production" },
  deps: { alwaysBundle: [/@dropaly\/.*/] },
});
