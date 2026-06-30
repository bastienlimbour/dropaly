import { Platform } from "react-native";

export async function setupPolyfills() {
  if (Platform.OS !== "web") {
    const { polyfillGlobal } =
      await import("react-native/Libraries/Utilities/PolyfillFunctions");

    if (!("structuredClone" in globalThis)) {
      const structuredClone = await import("@ungap/structured-clone");
      polyfillGlobal("structuredClone", () => structuredClone);
    }
    if (!("TextEncoderStream" in globalThis)) {
      const { TextEncoderStream } = await import("@stardazed/streams-text-encoding");
      polyfillGlobal("TextEncoderStream", () => TextEncoderStream);
    }
    if (!("TextDecoderStream" in globalThis)) {
      const { TextDecoderStream } = await import("@stardazed/streams-text-encoding");
      polyfillGlobal("TextDecoderStream", () => TextDecoderStream);
    }
  }
}
