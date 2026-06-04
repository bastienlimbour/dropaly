import { ActivityIndicator } from "react-native";
import type { ActivityIndicatorProps } from "react-native";

import { cn } from "../lib/utils";

type SpinnerProps = Omit<ActivityIndicatorProps, "size" | "color"> & {
  size?: "sm" | "lg" | ActivityIndicatorProps["size"];
  color?: "default" | "primary" | "muted";
};

function Spinner({ size = "sm", color = "primary", ...props }: SpinnerProps) {
  const indicatorSize = size === "sm" ? "small" : size === "lg" ? "large" : size;
  const indicatorColorClassName =
    color === "default"
      ? "accent-foreground"
      : color === "primary"
        ? "accent-primary"
        : "accent-muted-foreground";

  return (
    <ActivityIndicator
      colorClassName={cn(indicatorColorClassName)}
      size={indicatorSize}
      {...props}
    />
  );
}

export { Spinner };
