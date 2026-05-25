import { Text } from "@/components/ui/text";
import { cn } from "@/lib/utils";

type FieldErrorProps = React.ComponentProps<typeof Text> & {
  isInvalid?: boolean;
};

function FieldError({ children, className, isInvalid, ...props }: FieldErrorProps) {
  if (!isInvalid || !children) {
    return null;
  }

  return (
    <Text className={cn("text-destructive text-sm", className)} {...props}>
      {children}
    </Text>
  );
}

export { FieldError };
