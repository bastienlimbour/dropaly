import { type PropsWithChildren } from "react";
import { ScrollView, View, type ScrollViewProps, type ViewProps } from "react-native";
import Animated, { type AnimatedProps } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { cn } from "@/lib/utils";

const AnimatedView = Animated.createAnimatedComponent(View);

type ScreenViewProps = AnimatedProps<ViewProps> & {
  className?: string;
  withBottomInset?: boolean;
};

type ScreenScrollViewProps = ScrollViewProps & {
  className?: string;
  contentContainerClassName?: string;
  withBottomInset?: boolean;
};

export function ScreenView({
  children,
  className,
  withBottomInset = true,
  ...props
}: PropsWithChildren<ScreenViewProps>) {
  const insets = useSafeAreaInsets();

  return (
    <AnimatedView
      className={cn("flex-1 bg-background", className)}
      style={{
        paddingBottom: withBottomInset ? insets.bottom : 0,
      }}
      {...props}
    >
      <View className="flex-1">{children}</View>
    </AnimatedView>
  );
}

export function ScreenScrollView({
  children,
  className,
  contentContainerClassName,
  contentContainerStyle,
  withBottomInset = true,
  ...props
}: PropsWithChildren<ScreenScrollViewProps>) {
  const insets = useSafeAreaInsets();

  return (
    <ScrollView
      className={cn("flex-1 bg-background", className)}
      contentContainerClassName={cn("flex-grow", contentContainerClassName)}
      contentContainerStyle={[
        { paddingBottom: withBottomInset ? insets.bottom : 0 },
        contentContainerStyle,
      ]}
      keyboardShouldPersistTaps="handled"
      contentInsetAdjustmentBehavior="automatic"
      {...props}
    >
      {children}
    </ScrollView>
  );
}
