import * as React from "react";
import { withUniwind } from "uniwind";

import { cn } from "../lib/utils";
import { TextClassContext } from "./text";

interface IconBaseProps {
  className?: string;
  color?: string;
  size?: number;
  strokeWidth?: number;
}

type IconComponent = React.ComponentType<IconBaseProps>;

interface IconProps extends IconBaseProps {
  as: IconComponent;
}

function IconImpl({ as: IconComponent, ...props }: IconProps) {
  return <IconComponent {...props} />;
}

const StyledIcon = withUniwind(IconImpl, {
  size: { fromClassName: "className", styleProperty: "width" },
  color: { fromClassName: "className", styleProperty: "color" },
});

/**
 * Renders an icon component with Uniwind utility-class support.
 *
 * Text color context is applied before the caller's `className`, so icons inherit
 * nearby text styling while remaining overrideable. Use this wrapper instead of
 * rendering React Native SVG icons directly when utility classes should control
 * size or color.
 *
 * @example
 * ```tsx
 * import { IconArrowRight } from "@tabler/icons-react-native";
 * import { Icon } from "@dropaly/ui-mobile/components/icon";
 *
 * <Icon as={IconArrowRight} className="text-red-500 size-4" />
 * ```
 */
function Icon({ as: IconComponent, className, ...props }: IconProps) {
  const textClass = React.useContext(TextClassContext);
  return (
    <StyledIcon
      as={IconComponent}
      className={cn("size-5 text-foreground", textClass, className)}
      {...props}
    />
  );
}

export { Icon };
