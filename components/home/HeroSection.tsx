'use client';

import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ArrowRight, Sparkles } from 'lucide-react';
import { Product } from '@/types/product';

interface HeroSectionProps {
  featuredProducts: Product[];
}

export function HeroSection({ featuredProducts }: HeroSectionProps) {
  return (
    <div className="relative overflow-hidden rounded-[2rem] bg-card border border-border/50 shadow-sm mt-4 mb-12">
      {/* Background gradients */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-background pointer-events-none" />
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-primary/20 rounded-full blur-[100px] opacity-50 pointer-events-none" />

      <div className="grid lg:grid-cols-2 gap-8 md:gap-12 items-center relative z-10 p-8 md:p-12 lg:p-16">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="flex flex-col gap-6"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary w-fit border border-primary/20 text-sm font-semibold">
            <Sparkles className="w-4 h-4" />
            New Arrivals Available
          </div>
          
          <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight leading-[1.1]">
            Premium Workspace <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary/60">Essentials</span>
          </h1>
          
          <p className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-lg">
            Discover curated professional equipment and accessories designed to elevate your productivity and workspace aesthetics.
          </p>

          <div className="flex flex-wrap items-center gap-4 mt-2">
            <Button size="lg" className="rounded-xl px-8 h-14 text-base font-bold shadow-lg shadow-primary/20">
              Shop Now
            </Button>
            <Button size="lg" variant="outline" className="rounded-xl px-8 h-14 text-base font-bold bg-background/50 backdrop-blur-sm hover:bg-muted/50">
              Explore Collections <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.2, ease: 'easeOut' }}
          className="relative w-full h-[300px] md:h-[400px] lg:h-[450px]"
        >
          {featuredProducts.length > 0 && (
            <div className="absolute inset-0 rounded-2xl overflow-hidden shadow-2xl border border-border/50 group">
              <img
                src={featuredProducts[0].image}
                alt={featuredProducts[0].name}
                className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80" />
              <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8 text-white translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                <div className="text-xs font-bold uppercase tracking-wider text-primary/80 mb-2">Featured</div>
                <h3 className="text-2xl md:text-3xl font-bold">{featuredProducts[0].name}</h3>
                <p className="text-white/80 mt-2 text-sm md:text-base line-clamp-2">{featuredProducts[0].description}</p>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
