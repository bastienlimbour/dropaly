import type { Actor } from "@/context";

export const capabilities = ["ai.chat"] as const;

export type Capability = (typeof capabilities)[number];

export interface BillingState {
  plan: "free" | "pro";
  entitlements: Capability[];
}

export class EntitlementRequiredError extends Error {
  constructor(capability: Capability) {
    super(`Missing entitlement: ${capability}`);
    this.name = "EntitlementRequiredError";
  }
}

export async function getBillingState(_actor: Actor): Promise<BillingState> {
  return Promise.resolve({ plan: "free", entitlements: ["ai.chat"] });
}

export async function requireEntitlement(actor: Actor, capability: Capability) {
  const billingState = await getBillingState(actor);

  if (!billingState.entitlements.includes(capability)) {
    throw new EntitlementRequiredError(capability);
  }

  return billingState;
}
