import { AppError } from "@/errors/app-error";
import type { Actor } from "@/plugins/auth-context";

export const capabilities = ["ai.chat"] as const;

export type Capability = (typeof capabilities)[number];

export interface BillingState {
  plan: "free" | "pro";
  entitlements: Capability[];
}

export async function getBillingState(_actor: Actor): Promise<BillingState> {
  return Promise.resolve({ plan: "free", entitlements: ["ai.chat"] });
}

export async function requireEntitlement(actor: Actor, capability: Capability) {
  const billingState = await getBillingState(actor);

  if (!billingState.entitlements.includes(capability)) {
    throw new AppError({
      statusCode: 403,
      code: "FORBIDDEN",
      message: "Missing required entitlement.",
    });
  }

  return billingState;
}
