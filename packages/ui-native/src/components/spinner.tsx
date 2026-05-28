import { ActivityIndicator, type ActivityIndicatorProps } from "react-native";

type SpinnerProps = Omit<ActivityIndicatorProps, "size" | "color"> & {
  size?: "sm" | "lg" | ActivityIndicatorProps["size"];
  color?: "default" | "primary" | "muted" | ActivityIndicatorProps["color"];
};

function Spinner({ size = "sm", color = "primary", ...props }: SpinnerProps) {
  const indicatorSize =
    size === "sm" ? "small" : size === "lg" ? "large" : size;
  const indicatorColorClassName =
    color === "default"
      ? "accent-foreground"
      : color === "primary"
        ? "accent-primary"
        : color === "muted"
          ? "accent-muted-foreground"
          : undefined;

  return (
    <ActivityIndicator
      color={indicatorColorClassName ? undefined : color}
      colorClassName={indicatorColorClassName}
      size={indicatorSize}
      {...props}
    />
  );
}

export { Spinner };
