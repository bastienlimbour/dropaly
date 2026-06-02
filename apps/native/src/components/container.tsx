import { ScrollView, type ScrollViewProps } from "react-native";
import {
  SafeAreaView,
  type Edge,
  type SafeAreaViewProps,
} from "react-native-safe-area-context";
import { withUniwind } from "uniwind";

import { cn } from "@dropaly/ui-native/lib/utils";

interface AppScreenProps extends Omit<SafeAreaViewProps, "edges"> {
  edges?: Edge[] | null;
}

const StyledSafeAreaView = withUniwind(SafeAreaView);

export function ViewContainer({
  children,
  className,
  edges,
  ...props
}: AppScreenProps) {
  return (
    <StyledSafeAreaView
      className={cn("flex-1 bg-background", className)}
      edges={edges ?? []}
      {...props}
    >
      {children}
    </StyledSafeAreaView>
  );
}

interface AppScrollScreenProps extends Omit<SafeAreaViewProps, "edges"> {
  edges?: Edge[] | null;
  scrollViewProps?: ScrollViewProps;
}

export function ScrollViewContainer({
  children,
  className,
  edges,
  scrollViewProps,
  ...props
}: AppScrollScreenProps) {
  return (
    <StyledSafeAreaView
      className={cn("flex-1 bg-background", className)}
      edges={edges ?? []}
      {...props}
    >
      <ScrollView
        className={cn("bg-background", scrollViewProps?.className)}
        contentContainerStyle={{ flexGrow: 1 }}
        contentContainerClassName={cn(
          "bg-background",
          scrollViewProps?.contentContainerClassName,
        )}
        keyboardShouldPersistTaps="handled"
        contentInsetAdjustmentBehavior="automatic"
        {...scrollViewProps}
      >
        {children}
      </ScrollView>
    </StyledSafeAreaView>
  );
}
