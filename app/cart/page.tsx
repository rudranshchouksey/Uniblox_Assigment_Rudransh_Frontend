export default function CartPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Your Cart</h1>
        <p className="text-muted-foreground mt-2">
          Review your items before proceeding to checkout.
        </p>
      </div>
      <div className="rounded-xl border bg-card text-card-foreground shadow p-6">
        <p className="text-muted-foreground text-center py-12">Your cart is currently empty.</p>
      </div>
    </div>
  );
}
