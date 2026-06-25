'use client';

import { LucideIcon } from 'lucide-react';
import { motion } from 'framer-motion';

interface EmptyStateProps {
  title: string;
  description: string;
  icon?: React.ReactNode;
  action?: React.ReactNode;
}

export function EmptyState({ title, description, icon, action }: EmptyStateProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="flex flex-col gap-6 max-w-[1600px] w-full"
    >
      <h1 className="text-4xl font-extrabold tracking-tight">{title}</h1>
      <div className="rounded-3xl border border-border/40 bg-card/60 text-card-foreground shadow-sm hover:shadow-xl hover:shadow-primary/5 transition-all duration-500 p-16 flex flex-col items-center justify-center text-center gap-6 mt-6 backdrop-blur-xl">
        {icon && (
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5, type: 'spring' }}
            className="bg-primary/10 text-primary p-6 rounded-3xl shadow-inner ring-1 ring-primary/20"
          >
            {icon}
          </motion.div>
        )}
        <div className="space-y-3 max-w-lg">
          <h2 className="text-3xl font-extrabold tracking-tight">{title}</h2>
          <p className="text-muted-foreground text-lg leading-relaxed font-medium">
            {description}
          </p>
        </div>
        {action && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="mt-6"
          >
            {action}
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}
