import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { Link } from "expo-router";
import { Drawer } from "expo-router/drawer";
import React, { useCallback } from "react";
import { Pressable, Text } from "react-native";

import { ThemeToggle } from "@/components/theme-toggle";
import { useThemeColors } from "@/lib/theme-colors";

function DrawerLayout() {
  const colors = useThemeColors();

  const renderThemeToggle = useCallback(() => <ThemeToggle />, []);

  return (
    <Drawer
      screenOptions={{
        headerTintColor: colors.foreground,
        headerStyle: { backgroundColor: colors.background },
        headerTitleStyle: {
          fontWeight: "600",
          color: colors.foreground,
        },
        headerRight: renderThemeToggle,
        drawerStyle: { backgroundColor: colors.background },
      }}
    >
      <Drawer.Screen
        name="index"
        options={{
          headerTitle: "Home",
          drawerLabel: ({ color, focused }) => (
            <Text style={{ color: focused ? color : colors.foreground }}>
              Home
            </Text>
          ),
          drawerIcon: ({ size, color, focused }) => (
            <Ionicons
              name="home-outline"
              size={size}
              color={focused ? color : colors.foreground}
            />
          ),
        }}
      />
      <Drawer.Screen
        name="(tabs)"
        options={{
          headerTitle: "Tabs",
          drawerLabel: ({ color, focused }) => (
            <Text style={{ color: focused ? color : colors.foreground }}>
              Tabs
            </Text>
          ),
          drawerIcon: ({ size, color, focused }) => (
            <MaterialIcons
              name="border-bottom"
              size={size}
              color={focused ? color : colors.foreground}
            />
          ),
          headerRight: () => (
            <Link href="/modal" asChild>
              <Pressable className="mr-4">
                <Ionicons
                  name="add-outline"
                  size={24}
                  color={colors.foreground}
                />
              </Pressable>
            </Link>
          ),
        }}
      />
      <Drawer.Screen
        name="todos"
        options={{
          headerTitle: "Todos",
          drawerLabel: ({ color, focused }) => (
            <Text style={{ color: focused ? color : colors.foreground }}>
              Todos
            </Text>
          ),
          drawerIcon: ({ size, color, focused }) => (
            <Ionicons
              name="checkbox-outline"
              size={size}
              color={focused ? color : colors.foreground}
            />
          ),
        }}
      />
      <Drawer.Screen
        name="ai"
        options={{
          headerTitle: "AI",
          drawerLabel: ({ color, focused }) => (
            <Text style={{ color: focused ? color : colors.foreground }}>
              AI
            </Text>
          ),
          drawerIcon: ({ size, color, focused }) => (
            <Ionicons
              name="chatbubble-ellipses-outline"
              size={size}
              color={focused ? color : colors.foreground}
            />
          ),
        }}
      />
    </Drawer>
  );
}

export default DrawerLayout;
