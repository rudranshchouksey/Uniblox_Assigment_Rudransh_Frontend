import { LucideIcon } from 'lucide-react';

interface EmptyStateProps {
  title: string;
  description: string;
  icon?: React.ReactNode;
  action?: React.ReactNode;
}

export function EmptyState({ title, description, icon, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col gap-6 max-w-5xl mx-auto w-full">
      <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
      <div className="rounded-xl border bg-card text-card-foreground shadow p-12 flex flex-col items-center justify-center text-center gap-4">
        {icon && (
          <div className="bg-muted p-4 rounded-full">
            {icon}
          </div>
        )}
        <h2 className="text-xl font-semibold">{title}</h2>
        <p className="text-muted-foreground max-w-md">
          {description}
        </p>
        {action && <div className="mt-4">{action}</div>}
      </div>
    </div>
  );
}
