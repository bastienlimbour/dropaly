import { createFileRoute, useSearch } from "@tanstack/react-router";

export const Route = createFileRoute("/success")({
  component: SuccessPage,
  validateSearch: (search) => {
    const checkoutId = search["checkout_id"];

    return { checkout_id: typeof checkoutId === "string" ? checkoutId : undefined };
  },
});

function SuccessPage() {
  const { checkout_id } = useSearch({ from: "/success" });

  return (
    <div className="container mx-auto px-4 py-8">
      <h1>Payment Successful!</h1>
      {checkout_id && <p>Checkout ID: {checkout_id}</p>}
    </div>
  );
}
