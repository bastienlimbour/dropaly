import { checkout, polar, portal } from "@polar-sh/better-auth";
import { Polar } from "@polar-sh/sdk";

import type { ServerEnv } from "@dropaly/env/server";

interface PaymentsPluginOptions {
  accessToken: ServerEnv["POLAR_ACCESS_TOKEN"];
  successUrl: ServerEnv["POLAR_SUCCESS_URL"];
}

export function paymentsPlugin({ accessToken, successUrl }: PaymentsPluginOptions) {
  if (!accessToken) {
    throw new Error(
      "POLAR_ACCESS_TOKEN is required when payments are enabled (PAYMENTS_ENABLED environment variable)",
    );
  }

  if (!successUrl) {
    throw new Error(
      "POLAR_SUCCESS_URL is required when payments are enabled (PAYMENTS_ENABLED environment variable)",
    );
  }

  const polarClient = new Polar({
    accessToken: accessToken,
    server: "sandbox",
  });

  return polar({
    client: polarClient,
    createCustomerOnSignUp: true,
    enableCustomerPortal: true,
    use: [
      checkout({
        products: [{ productId: "your-product-id", slug: "pro" }],
        successUrl: successUrl,
        authenticatedUsersOnly: true,
      }),
      portal(),
    ],
  });
}
