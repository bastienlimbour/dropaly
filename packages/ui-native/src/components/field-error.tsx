import { cn } from "../lib/utils";
import { Text } from "./text";

type FieldErrorProps = React.ComponentProps<typeof Text> & { isInvalid?: boolean };

function FieldError({ children, className, isInvalid, ...props }: FieldErrorProps) {
  if (!isInvalid || !children) {
    return null;
  }

  return (
    <Text className={cn("text-sm text-destructive", className)} {...props}>
      {children}
    </Text>
  );
}

export { FieldError };
