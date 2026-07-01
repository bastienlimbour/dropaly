import { View } from "react-native";

import { cn } from "../lib/utils";

interface SurfaceProps extends React.ComponentProps<typeof View> {
  variant?: "default" | "secondary" | "tertiary";
}

function Surface({ className, variant = "default", ...props }: SurfaceProps) {
  return (
    <View
      className={cn(
        "rounded-xl border border-border shadow-sm shadow-black/5",
        variant === "default" && "bg-card",
        variant === "secondary" && "bg-secondary",
        variant === "tertiary" && "bg-accent",
        className,
      )}
      {...props}
    />
  );
}

export { Surface };
