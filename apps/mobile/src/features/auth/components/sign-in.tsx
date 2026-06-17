import { useForm } from "@tanstack/react-form";
import { useRef } from "react";
import type { TextInput } from "react-native";
import { View } from "react-native";
import z from "zod";

import { toUserMessage } from "@dropaly/api-client";
import { Button } from "@dropaly/ui-mobile/components/button";
import { FieldError } from "@dropaly/ui-mobile/components/field-error";
import { Input } from "@dropaly/ui-mobile/components/input";
import { Label } from "@dropaly/ui-mobile/components/label";
import { Spinner } from "@dropaly/ui-mobile/components/spinner";
import { Surface } from "@dropaly/ui-mobile/components/surface";
import { Text } from "@dropaly/ui-mobile/components/text";

import { authClient } from "@/lib/auth-client";
import { queryClient } from "@/lib/query-client";
import { showToast } from "@/lib/toast";

const signInSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, "Email is required")
    .email("Enter a valid email address"),
  password: z
    .string()
    .min(1, "Password is required")
    .min(8, "Use at least 8 characters"),
});

function getErrorMessage(error: unknown): string | null {
  if (!error) return null;

  if (typeof error === "string") {
    return error;
  }

  if (Array.isArray(error)) {
    for (const issue of error) {
      const message = getErrorMessage(issue);
      if (message) {
        return message;
      }
    }
    return null;
  }

  if (typeof error === "object") {
    const maybeError = error as { message?: unknown };
    if (typeof maybeError.message === "string") {
      return maybeError.message;
    }
  }

  return null;
}

function SignIn() {
  const passwordInputRef = useRef<TextInput>(null);

  const form = useForm({
    defaultValues: { email: "", password: "" },
    validators: { onSubmit: signInSchema },
    onSubmit: async ({ value, formApi }) => {
      await authClient.signIn.email(
        { email: value.email.trim(), password: value.password },
        {
          onError(error) {
            showToast({
              variant: "danger",
              label: toUserMessage(error),
            });
          },
          onSuccess() {
            formApi.reset();
            showToast({ variant: "success", label: "Signed in successfully" });
            void queryClient.refetchQueries();
          },
        },
      );
    },
  });

  return (
    <Surface variant="secondary" className="rounded-lg p-4">
      <Text className="text-foreground mb-4 font-medium">Sign In</Text>

      <form.Subscribe
        selector={(state) => ({
          isSubmitting: state.isSubmitting,
          validationError: getErrorMessage(state.errorMap.onSubmit),
        })}
      >
        {({ isSubmitting, validationError }) => {
          const formError = validationError;

          return (
            <>
              <FieldError isInvalid={!!formError} className="mb-3">
                {formError}
              </FieldError>

              <View className="gap-3">
                <form.Field name="email">
                  {(field) => (
                    <View className="gap-1.5">
                      <Label>Email</Label>
                      <Input
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChangeText={field.handleChange}
                        placeholder="email@example.com"
                        keyboardType="email-address"
                        autoCapitalize="none"
                        autoComplete="email"
                        textContentType="emailAddress"
                        returnKeyType="next"
                        blurOnSubmit={false}
                        onSubmitEditing={() => {
                          passwordInputRef.current?.focus();
                        }}
                      />
                    </View>
                  )}
                </form.Field>

                <form.Field name="password">
                  {(field) => (
                    <View className="gap-1.5">
                      <Label>Password</Label>
                      <Input
                        ref={passwordInputRef}
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChangeText={field.handleChange}
                        placeholder="••••••••"
                        secureTextEntry
                        autoComplete="password"
                        textContentType="password"
                        returnKeyType="go"
                        onSubmitEditing={() => void form.handleSubmit()}
                      />
                    </View>
                  )}
                </form.Field>

                <Button
                  onPress={() => void form.handleSubmit()}
                  disabled={isSubmitting}
                  className="mt-1"
                >
                  {isSubmitting ? (
                    <Spinner size="sm" color="default" />
                  ) : (
                    <Text>Sign In</Text>
                  )}
                </Button>
              </View>
            </>
          );
        }}
      </form.Subscribe>
    </Surface>
  );
}

export { SignIn };
