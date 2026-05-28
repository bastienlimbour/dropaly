declare module "@tabler/icons-react-native" {
  import type { ComponentType } from "react";

  export type IconProps = {
    className?: string;
    color?: string;
    size?: number;
    strokeWidth?: number;
  };

  export type Icon = ComponentType<IconProps>;

  export const IconArrowUp: Icon;
  export const IconCheck: Icon;
  export const IconCheckbox: Icon;
  export const IconCircleCheck: Icon;
  export const IconCircleX: Icon;
  export const IconDeviceDesktop: Icon;
  export const IconHourglass: Icon;
  export const IconMessageChatbot: Icon;
  export const IconMoon: Icon;
  export const IconPlus: Icon;
  export const IconSun: Icon;
  export const IconTrash: Icon;
}
