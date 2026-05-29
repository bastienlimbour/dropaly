import {
  IconMoon,
  IconSun,
  IconDeviceDesktop,
} from "@tabler/icons-react-native";
import { Icon } from "@dropaly/ui-native/components/icon";
import { useUiTheme, type ThemePreference } from "@dropaly/ui-native/lib/theme";
import * as Haptics from "expo-haptics";
import { Platform, Pressable } from "react-native";
import Animated, { FadeOut, ZoomIn } from "react-native-reanimated";

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
          <Icon as={IconMoon} className="text-foreground size-5" />
        </Animated.View>
      ) : nextTheme === "light" ? (
        <Animated.View key="sun" entering={ZoomIn} exiting={FadeOut}>
          <Icon as={IconSun} className="text-foreground size-5" />
        </Animated.View>
      ) : (
        <Animated.View key="system" entering={ZoomIn} exiting={FadeOut}>
          <Icon as={IconDeviceDesktop} className="text-foreground size-5" />
        </Animated.View>
      )}
    </Pressable>
  );
}
