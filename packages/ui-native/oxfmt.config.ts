import { defineConfig } from "oxfmt";

import { oxfmtBaseConfig } from "@dropaly/config/oxfmt/oxfmt.base";

export default defineConfig({
  ...oxfmtBaseConfig,
  sortTailwindcss: {
    ...oxfmtBaseConfig.sortTailwindcss,
    stylesheet: "src/styles/globals.css",
    attributes: [
      "class",
      "className",
      "headerClassName",
      "contentContainerClassName",
      "columnWrapperClassName",
      "endFillColorClassName",
      "imageClassName",
      "tintColorClassName",
      "ios_backgroundColorClassName",
      "thumbColorClassName",
      "trackColorOnClassName",
      "trackColorOffClassName",
      "selectionColorClassName",
      "cursorColorClassName",
      "underlineColorAndroidClassName",
      "placeholderTextColorClassName",
      "selectionHandleColorClassName",
      "colorsClassName",
      "progressBackgroundColorClassName",
      "titleColorClassName",
      "underlayColorClassName",
      "colorClassName",
      "drawerBackgroundColorClassName",
      "statusBarBackgroundColorClassName",
      "backdropColorClassName",
      "backgroundColorClassName",
      "ListFooterComponentClassName",
      "ListHeaderComponentClassName",
    ],
  },
});
