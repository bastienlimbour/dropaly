import {
  TextDecoderStream,
  TextEncoderStream,
} from "@stardazed/streams-text-encoding";
import structuredClone from "@ungap/structured-clone";
import { Platform } from "react-native";
// @ts-ignore
import { polyfillGlobal } from "react-native/Libraries/Utilities/PolyfillFunctions";

if (Platform.OS !== "web") {
  if (!("structuredClone" in globalThis)) {
    polyfillGlobal("structuredClone", () => structuredClone);
  }

  if (!("TextEncoderStream" in globalThis)) {
    polyfillGlobal("TextEncoderStream", () => TextEncoderStream);
  }

  if (!("TextDecoderStream" in globalThis)) {
    polyfillGlobal("TextDecoderStream", () => TextDecoderStream);
  }
}
