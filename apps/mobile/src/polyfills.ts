import { Platform } from "react-native";

export async function setupPolyfills() {
  if (Platform.OS !== "web") {
    await setupNativePolyfills();
  }
}

async function setupNativePolyfills() {
  const { polyfillGlobal } =
    await import("react-native/Libraries/Utilities/PolyfillFunctions");

  if (!("structuredClone" in globalThis)) {
    const { default: structuredClone } = await import("@ungap/structured-clone");
    polyfillGlobal("structuredClone", () => structuredClone);
  }

  if (!("TextEncoderStream" in globalThis) || !("TextDecoderStream" in globalThis)) {
    const { TextEncoderStream, TextDecoderStream } =
      await import("@stardazed/streams-text-encoding");

    if (!("TextEncoderStream" in globalThis)) {
      polyfillGlobal("TextEncoderStream", () => TextEncoderStream);
    }

    if (!("TextDecoderStream" in globalThis)) {
      polyfillGlobal("TextDecoderStream", () => TextDecoderStream);
    }
  }
}
