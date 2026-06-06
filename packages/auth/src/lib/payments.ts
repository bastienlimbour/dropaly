import { checkout, polar, portal } from "@polar-sh/better-auth";
import { Polar } from "@polar-sh/sdk";

interface PaymentsPluginOptions {
  accessToken: string;
  successUrl: string;
}

export function paymentsPlugin(options: PaymentsPluginOptions) {
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
