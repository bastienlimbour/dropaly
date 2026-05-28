import { NativeTabs } from "expo-router/unstable-native-tabs";

import { useThemeColors } from "@dropaly/ui-native/lib/theme";

export default function TabLayout() {
  const colors = useThemeColors();

  return (
    <NativeTabs
      disableTransparentOnScrollEdge
      tabBarRespectsIMEInsets
      tintColor={colors.primary}
      labelStyle={{ color: colors.foreground }}
    >
      <NativeTabs.Trigger name="(home)">
        <NativeTabs.Trigger.Icon
          sf={{ default: "house", selected: "house.fill" }}
          md={{ default: "home", selected: "home_filled" }}
        />
        <NativeTabs.Trigger.Label>Home</NativeTabs.Trigger.Label>
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="test">
        <NativeTabs.Trigger.Icon
          sf={{ default: "testtube.2", selected: "testtube.2" }}
          md={{ default: "experiment", selected: "experiment" }}
        />
        <NativeTabs.Trigger.Label>Test</NativeTabs.Trigger.Label>
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="todos">
        <NativeTabs.Trigger.Icon
          sf={{ default: "checklist", selected: "checklist.checked" }}
          md={{ default: "checklist", selected: "checklist_rtl" }}
        />
        <NativeTabs.Trigger.Label>Tasks</NativeTabs.Trigger.Label>
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="ai">
        <NativeTabs.Trigger.Icon
          sf={{ default: "sparkles", selected: "sparkles" }}
          md={{ default: "auto_awesome", selected: "auto_awesome" }}
        />
        <NativeTabs.Trigger.Label>AI</NativeTabs.Trigger.Label>
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="settings">
        <NativeTabs.Trigger.Icon
          sf={{ default: "gearshape", selected: "gearshape.fill" }}
          md={{ default: "settings", selected: "settings" }}
        />
        <NativeTabs.Trigger.Label>Settings</NativeTabs.Trigger.Label>
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}
