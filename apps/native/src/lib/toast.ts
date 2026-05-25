import { toast } from "sonner-native";

type ToastOptions = {
  variant?: "success" | "danger" | "error" | "info" | "warning";
  label: string;
};

export function showToast({ variant = "info", label }: ToastOptions) {
  if (variant === "success") {
    toast.success(label);
    return;
  }

  if (variant === "danger" || variant === "error") {
    toast.error(label);
    return;
  }

  if (variant === "warning") {
    toast.warning(label);
    return;
  }

  toast.info(label);
}
