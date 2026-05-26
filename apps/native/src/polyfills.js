import structuredClone from "@ungap/structured-clone";
import {
  TextDecoderStream,
  TextEncoderStream,
} from "@stardazed/streams-text-encoding";
import { polyfillGlobal } from "react-native/Libraries/Utilities/PolyfillFunctions";
import { Platform } from "react-native";

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

export {};
