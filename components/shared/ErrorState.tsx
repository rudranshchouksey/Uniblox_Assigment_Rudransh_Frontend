import { AlertTriangle } from 'lucide-react';
import { motion } from 'framer-motion';

interface ErrorStateProps {
  title: string;
  message: string;
}

export function ErrorState({ title, message }: ErrorStateProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col gap-6 max-w-[1600px] w-full"
    >
      <h1 className="text-4xl font-extrabold tracking-tight">{title}</h1>
      <div className="rounded-3xl border border-destructive/20 bg-destructive/5 p-12 text-center flex flex-col items-center justify-center gap-4 mt-6 backdrop-blur-sm">
        <div className="bg-destructive/10 text-destructive p-4 rounded-2xl shadow-inner ring-1 ring-destructive/20">
          <AlertTriangle className="h-8 w-8" />
        </div>
        <div className="space-y-2 max-w-md">
          <h2 className="text-2xl font-bold tracking-tight text-destructive">Something went wrong</h2>
          <p className="text-muted-foreground text-base font-medium">
            {message}
          </p>
        </div>
      </div>
    </motion.div>
  );
}
