import { Skeleton } from '@/components/ui/skeleton';

interface LoadingStateProps {
  title: string;
  description?: string;
  type?: 'grid' | 'list' | 'cards' | 'checkout';
}

export function LoadingState({ title, description, type = 'grid' }: LoadingStateProps) {
  return (
    <div className="flex flex-col gap-8 max-w-[1600px] w-full animate-in fade-in duration-500">
      <div>
        <h1 className="text-4xl font-extrabold tracking-tight">{title}</h1>
        {description && <p className="text-lg text-muted-foreground mt-3">{description}</p>}
      </div>

      {type === 'grid' && (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="flex flex-col rounded-3xl border border-border/40 bg-card/60 backdrop-blur-sm shadow-sm h-[420px] overflow-hidden">
              <Skeleton className="w-full aspect-square rounded-none bg-muted/40" />
              <div className="p-7 flex flex-col flex-1">
                <Skeleton className="h-6 w-3/4 mb-3 rounded-md" />
                <Skeleton className="h-4 w-full mb-2 rounded-md" />
                <Skeleton className="h-4 w-2/3 mb-6 rounded-md" />
                <div className="mt-auto flex justify-between items-center mb-6">
                  <Skeleton className="h-8 w-20 rounded-lg" />
                  <Skeleton className="h-6 w-24 rounded-lg" />
                </div>
                <Skeleton className="h-12 w-full rounded-xl" />
              </div>
            </div>
          ))}
        </div>
      )}

      {type === 'list' && (
        <div className="rounded-3xl border border-border/40 bg-card/60 backdrop-blur-sm shadow-sm p-8 flex flex-col gap-6">
          <Skeleton className="h-14 w-full rounded-2xl bg-muted/40" />
          <Skeleton className="h-32 w-full rounded-2xl bg-muted/40" />
          <Skeleton className="h-32 w-full rounded-2xl bg-muted/40" />
          <div className="flex justify-end mt-4">
            <Skeleton className="h-12 w-48 rounded-2xl bg-muted/40" />
          </div>
        </div>
      )}

      {type === 'cards' && (
        <>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-32 rounded-3xl bg-muted/40" />)}
          </div>
          <Skeleton className="h-96 rounded-3xl w-full mt-6 bg-muted/40" />
        </>
      )}

      {type === 'checkout' && (
        <div className="grid lg:grid-cols-[1.5fr_1fr] gap-8 xl:gap-12">
          <Skeleton className="h-[500px] rounded-3xl bg-muted/40" />
          <Skeleton className="h-[400px] rounded-3xl bg-muted/40" />
        </div>
      )}
    </div>
  );
}
