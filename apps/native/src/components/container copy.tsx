import { ScrollView } from "react-native";
import type { ScrollViewProps } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import type { Edge, SafeAreaViewProps } from "react-native-safe-area-context";

import { cn } from "@dropaly/ui-native/lib/utils";

interface AppScreenProps extends Omit<SafeAreaViewProps, "edges"> {
  edges?: Edge[] | null;
}

export function ViewContainer({
  children,
  className,
  edges,
  ...props
}: AppScreenProps) {
  return (
    <SafeAreaView className={cn("flex-1", className)} edges={edges ?? []} {...props}>
      {children}
    </SafeAreaView>
  );
}

interface AppScrollScreenProps extends Omit<SafeAreaViewProps, "edges"> {
  edges?: Edge[] | null;
  scrollViewProps?: ScrollViewProps;
}

const DEFAULT_EDGES: Edge[] = ["top", "bottom"];

export function ScrollViewContainer({
  children,
  className,
  edges = DEFAULT_EDGES,
  scrollViewProps,
  ...props
}: AppScrollScreenProps) {
  return (
    <SafeAreaView edges={edges ?? []} className={cn("flex-1", className)} {...props}>
      <ScrollView
        className={cn("flex-1", scrollViewProps?.className)}
        contentContainerClassName={cn(
          "flex-1",
          scrollViewProps?.contentContainerClassName,
        )}
        keyboardShouldPersistTaps="handled"
        contentInsetAdjustmentBehavior="automatic"
        {...scrollViewProps}
      >
        {children}
      </ScrollView>
    </SafeAreaView>
  );
}
