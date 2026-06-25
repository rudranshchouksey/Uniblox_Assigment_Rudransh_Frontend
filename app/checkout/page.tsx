export default function CheckoutPage() {
  return (
    <div className="flex flex-col gap-6 max-w-3xl mx-auto w-full">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Checkout</h1>
        <p className="text-muted-foreground mt-2">
          Complete your purchase securely.
        </p>
      </div>
      <div className="rounded-xl border bg-card text-card-foreground shadow p-6">
        <p className="text-muted-foreground text-center py-12">Checkout form will be rendered here.</p>
      </div>
    </div>
  );
}
