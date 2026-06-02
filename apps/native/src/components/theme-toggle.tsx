import { IconMoon, IconSun, IconDeviceDesktop } from "@tabler/icons-react-native";
import * as Haptics from "expo-haptics";
import { Platform, Pressable } from "react-native";
import Animated, { FadeOut, ZoomIn } from "react-native-reanimated";

import { Icon } from "@dropaly/ui-native/components/icon";
import { useUiTheme, type ThemePreference } from "@dropaly/ui-native/lib/theme";

const NEXT_THEME: Record<ThemePreference, ThemePreference> = {
  light: "dark",
  dark: "system",
  system: "light",
};

export function ThemeToggle() {
  const { themePreference, setTheme } = useUiTheme();
  const nextTheme = NEXT_THEME[themePreference];

  return (
    <Pressable
      onPress={() => {
        if (Platform.OS === "ios") {
          void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        }
        setTheme(nextTheme);
      }}
      accessibilityLabel={`Switch theme to ${nextTheme}`}
      className="px-2.5"
    >
      {nextTheme === "dark" ? (
        <Animated.View key="moon" entering={ZoomIn} exiting={FadeOut}>
          <Icon as={IconMoon} className="size-5 text-foreground" />
        </Animated.View>
      ) : nextTheme === "light" ? (
        <Animated.View key="sun" entering={ZoomIn} exiting={FadeOut}>
          <Icon as={IconSun} className="size-5 text-foreground" />
        </Animated.View>
      ) : (
        <Animated.View key="system" entering={ZoomIn} exiting={FadeOut}>
          <Icon as={IconDeviceDesktop} className="size-5 text-foreground" />
        </Animated.View>
      )}
    </Pressable>
  );
}
