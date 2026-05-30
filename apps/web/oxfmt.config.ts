import { defineConfig } from "oxfmt";

import { oxfmtBaseConfig } from "@dropaly/config/oxfmt/oxfmt.base";

export default defineConfig({
  ...oxfmtBaseConfig,
  sortTailwindcss: {
    ...oxfmtBaseConfig.sortTailwindcss,
    stylesheet: "src/index.css",
  },
});
