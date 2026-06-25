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
      <div className="rounded-3xl border border-border/50 bg-card/50 text-card-foreground shadow-sm p-16 flex flex-col items-center justify-center text-center gap-6 mt-6 backdrop-blur-sm">
        {icon && (
          <div className="bg-primary/5 text-primary p-6 rounded-full shadow-inner ring-1 ring-primary/10">
            {icon}
          </div>
        )}
        <div className="space-y-2">
          <h2 className="text-2xl font-bold tracking-tight">{title}</h2>
          <p className="text-muted-foreground max-w-md mx-auto text-base">
            {description}
          </p>
        </div>
        {action && <div className="mt-4">{action}</div>}
      </div>
    </div>
  );
}
