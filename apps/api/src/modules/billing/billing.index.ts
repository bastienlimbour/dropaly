import { AppError } from "@/errors/app-error";
import type { AuthenticatedUser } from "@/modules/auth/authenticated-user";

export const capabilities = ["ai.chat"] as const;

export type Capability = (typeof capabilities)[number];

export interface BillingState {
  plan: "free" | "pro";
  entitlements: Capability[];
}

export async function getBillingState(
  _user: AuthenticatedUser,
): Promise<BillingState> {
  return Promise.resolve({ plan: "free", entitlements: ["ai.chat"] });
}

export async function requireEntitlement(
  user: AuthenticatedUser,
  capability: Capability,
) {
  const billingState = await getBillingState(user);

  if (!billingState.entitlements.includes(capability)) {
    throw new AppError({
      statusCode: 403,
      code: "FORBIDDEN",
      message: "Missing required entitlement.",
    });
  }

  return billingState;
}
