import { Icon } from "@dropaly/ui-native/components/icon";
import { cn } from "@dropaly/ui-native/lib/utils";
import * as CheckboxPrimitive from "@rn-primitives/checkbox";
import Svg, { Path } from "react-native-svg";

const DEFAULT_HIT_SLOP = 24;

function CheckIcon({
  color,
  size = 12,
  strokeWidth = 3.5,
}: {
  color?: string;
  size?: number;
  strokeWidth?: number;
}) {
  return (
    <Svg fill="none" height={size} viewBox="0 0 24 24" width={size}>
      <Path
        d="M5 12l5 5l10 -10"
        stroke={color}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={strokeWidth}
      />
    </Svg>
  );
}

function Checkbox({
  className,
  checkedClassName,
  indicatorClassName,
  iconClassName,
  ...props
}: React.ComponentProps<typeof CheckboxPrimitive.Root> & {
  checkedClassName?: string;
  indicatorClassName?: string;
  iconClassName?: string;
}) {
  return (
    <CheckboxPrimitive.Root
      className={cn(
        "border-input dark:bg-input/30 size-4 shrink-0 rounded-[4px] border shadow-sm shadow-black/5",
        "overflow-hidden",
        props.checked && cn("border-primary", checkedClassName),
        props.disabled && "opacity-50",
        className,
      )}
      hitSlop={DEFAULT_HIT_SLOP}
      {...props}
    >
      <CheckboxPrimitive.Indicator
        className={cn(
          "bg-primary h-full w-full items-center justify-center",
          indicatorClassName,
        )}
      >
        <Icon
          as={CheckIcon}
          size={12}
          strokeWidth={3.5}
          className={cn("text-primary-foreground", iconClassName)}
        />
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  );
}

export { Checkbox };
