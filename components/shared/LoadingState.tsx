import { Skeleton } from '@/components/ui/skeleton';

interface LoadingStateProps {
  title: string;
  description?: string;
  type?: 'grid' | 'list' | 'cards' | 'checkout';
}

export function LoadingState({ title, description, type = 'grid' }: LoadingStateProps) {
  return (
    <div className="flex flex-col gap-6 max-w-5xl mx-auto w-full">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
        {description && <p className="text-muted-foreground mt-2">{description}</p>}
      </div>

      {type === 'grid' && (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="flex flex-col rounded-2xl border border-border/50 bg-card shadow-sm h-[420px] overflow-hidden">
              <Skeleton className="w-full aspect-square rounded-none bg-muted/50" />
              <div className="p-6 flex flex-col flex-1">
                <Skeleton className="h-5 w-3/4 mb-3" />
                <Skeleton className="h-4 w-full mb-1" />
                <Skeleton className="h-4 w-2/3 mb-6" />
                <div className="mt-auto flex justify-between items-center mb-6">
                  <Skeleton className="h-6 w-16" />
                  <Skeleton className="h-5 w-20" />
                </div>
                <Skeleton className="h-10 w-full rounded-xl" />
              </div>
            </div>
          ))}
        </div>
      )}

      {type === 'list' && (
        <div className="rounded-xl border bg-card text-card-foreground shadow p-6 flex flex-col gap-4">
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-24 w-full" />
          <div className="flex justify-end mt-4">
            <Skeleton className="h-10 w-48" />
          </div>
        </div>
      )}

      {type === 'cards' && (
        <>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-32 rounded-xl" />)}
          </div>
          <Skeleton className="h-96 rounded-xl w-full mt-4" />
        </>
      )}

      {type === 'checkout' && (
        <div className="grid md:grid-cols-[1.5fr_1fr] gap-8">
          <Skeleton className="h-[400px] rounded-xl" />
          <Skeleton className="h-[400px] rounded-xl" />
        </div>
      )}
    </div>
  );
}
