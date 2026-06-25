interface ErrorStateProps {
  title: string;
  message: string;
}

export function ErrorState({ title, message }: ErrorStateProps) {
  return (
    <div className="flex flex-col gap-6 max-w-5xl mx-auto w-full">
      <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
      <div className="rounded-xl border border-destructive bg-destructive/10 p-6 text-center text-destructive">
        {message}
      </div>
    </div>
  );
}
