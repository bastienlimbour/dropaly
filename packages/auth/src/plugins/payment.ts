import { checkout, polar, portal } from "@polar-sh/better-auth";
import { Polar } from "@polar-sh/sdk";

interface PaymentPluginOptions {
  accessToken: string;
  successUrl: string;
}

export function paymentPlugin(
  options: PaymentPluginOptions,
): ReturnType<typeof polar> {
  const polarClient = new Polar({
    accessToken: options.accessToken,
    server: "sandbox",
  });

  return polar({
    client: polarClient,
    createCustomerOnSignUp: true,
    enableCustomerPortal: true,
    use: [
      checkout({
        products: [{ productId: "your-product-id", slug: "pro" }],
        successUrl: options.successUrl,
        authenticatedUsersOnly: true,
      }),
      portal(),
    ],
  });
}
