import { ActivityIndicator, type ActivityIndicatorProps } from "react-native";

import { useThemeColors } from "@/lib/theme";

type SpinnerProps = Omit<ActivityIndicatorProps, "size" | "color"> & {
  size?: "sm" | "lg" | ActivityIndicatorProps["size"];
  color?: "default" | "primary" | "muted" | ActivityIndicatorProps["color"];
};

function Spinner({ size = "sm", color = "primary", ...props }: SpinnerProps) {
  const colors = useThemeColors();
  const indicatorSize =
    size === "sm" ? "small" : size === "lg" ? "large" : size;
  const indicatorColor =
    color === "default"
      ? colors.foreground
      : color === "primary"
        ? colors.primary
        : color === "muted"
          ? colors.mutedForeground
          : color;

  return (
    <ActivityIndicator color={indicatorColor} size={indicatorSize} {...props} />
  );
}

export { Spinner };
