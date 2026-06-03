import * as React from "react";
import { withUniwind } from "uniwind";

import { cn } from "../lib/utils";
import { TextClassContext } from "./text";

type IconBaseProps = {
  className?: string;
  color?: string;
  size?: number;
  strokeWidth?: number;
};

type IconComponent = React.ComponentType<IconBaseProps>;

type IconProps = IconBaseProps & { as: IconComponent };

function IconImpl({ as: IconComponent, ...props }: IconProps) {
  return <IconComponent {...props} />;
}

const StyledIcon = withUniwind(IconImpl, {
  size: { fromClassName: "className", styleProperty: "width" },
  color: { fromClassName: "className", styleProperty: "color" },
});

/**
 * A wrapper component for Tabler icons with Uniwind `className` support via `withUniwind`.
 *
 * This component allows you to render any Tabler icon while applying utility classes
 * using `uniwind`. It avoids the need to wrap or configure each icon individually.
 *
 * @component
 * @example
 * ```tsx
 * import { IconArrowRight } from '@tabler/icons-react-native';
 * import { Icon } from '@dropaly/ui-native/components/icon';
 *
 * <Icon as={IconArrowRight} className="text-red-500 size-4" />
 * ```
 *
 * @param {TablerIcon} as - The Tabler icon component to render.
 * @param {string} className - Utility classes to style the icon using Uniwind.
 * @param {number} size - Icon size (overrides the size class).
 * @param {...TablerIconProps} ...props - Additional Tabler icon props passed to the "as" icon.
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
