import { View } from "react-native";

import { cn } from "@/lib/utils";

type SurfaceProps = React.ComponentProps<typeof View> & {
  variant?: "default" | "secondary" | "tertiary";
};

function Surface({ className, variant = "default", ...props }: SurfaceProps) {
  return (
    <View
      className={cn(
        "border-border rounded-xl border shadow-sm shadow-black/5",
        variant === "default" && "bg-card",
        variant === "secondary" && "bg-card",
        variant === "tertiary" && "bg-accent",
        className,
      )}
      {...props}
    />
  );
}

export { Surface };
