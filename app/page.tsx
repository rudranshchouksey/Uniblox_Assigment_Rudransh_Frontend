export default function Home() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Products</h1>
        <p className="text-muted-foreground mt-2">
          Browse our latest collection of premium items.
        </p>
      </div>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {/* Placeholder for products */}
        <div className="rounded-xl border bg-card text-card-foreground shadow h-64 flex items-center justify-center text-muted-foreground">
          Product Card
        </div>
        <div className="rounded-xl border bg-card text-card-foreground shadow h-64 flex items-center justify-center text-muted-foreground">
          Product Card
        </div>
        <div className="rounded-xl border bg-card text-card-foreground shadow h-64 flex items-center justify-center text-muted-foreground">
          Product Card
        </div>
      </div>
    </div>
  );
}
