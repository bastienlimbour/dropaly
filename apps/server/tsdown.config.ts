import { defineConfig } from "tsdown";

const isExternalDependency = (id: string) =>
  !id.startsWith("@dropzen/") &&
  !id.startsWith(".") &&
  !id.startsWith("/") &&
  !id.startsWith("\0");

export default defineConfig({
  entry: "./src/index.ts",
  format: "esm",
  outDir: "./dist",
  clean: true,
  env: {
    NODE_ENV: "production",
  },
  deps: {
    alwaysBundle: [/@dropzen\/.*/],
    neverBundle: isExternalDependency,
  },
});
