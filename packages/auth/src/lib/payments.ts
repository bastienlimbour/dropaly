import { env } from "@dropaly/env/server";
import { checkout, polar, portal } from "@polar-sh/better-auth";
import { Polar } from "@polar-sh/sdk";

export function paymentsPlugin() {
  if (!env.POLAR_ACCESS_TOKEN) {
    throw new Error(
      "POLAR_ACCESS_TOKEN is required when PAYMENTS_ENABLED=true",
    );
  }

  if (!env.POLAR_SUCCESS_URL) {
    throw new Error("POLAR_SUCCESS_URL is required when PAYMENTS_ENABLED=true");
  }

  const polarClient = new Polar({
    accessToken: env.POLAR_ACCESS_TOKEN,
    server: "sandbox",
  });

  return polar({
    client: polarClient,
    createCustomerOnSignUp: true,
    enableCustomerPortal: true,
    use: [
      checkout({
        products: [
          {
            productId: "your-product-id",
            slug: "pro",
          },
        ],
        successUrl: env.POLAR_SUCCESS_URL,
        authenticatedUsersOnly: true,
      }),
      portal(),
    ],
  });
}
