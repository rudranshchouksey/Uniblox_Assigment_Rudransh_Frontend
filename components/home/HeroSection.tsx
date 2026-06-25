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
    <div className="relative overflow-hidden rounded-3xl bg-card/60 backdrop-blur-xl border border-border/40 shadow-sm mt-4 mb-12 group">
      {/* Background gradients */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background/50 to-background/20 pointer-events-none" />
      <div className="absolute -top-32 -right-32 w-[500px] h-[500px] bg-primary/20 rounded-full blur-[120px] opacity-60 pointer-events-none group-hover:opacity-80 transition-opacity duration-1000" />
      <div className="absolute -bottom-32 -left-32 w-[400px] h-[400px] bg-primary/10 rounded-full blur-[100px] opacity-40 pointer-events-none" />

      <div className="grid lg:grid-cols-2 gap-8 md:gap-12 items-center relative z-10 p-8 md:p-12 lg:p-16">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col gap-6"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-primary/10 text-primary w-fit border border-primary/20 text-sm font-bold tracking-tight shadow-sm">
            <Sparkles className="w-4 h-4 text-primary" />
            New Arrivals Available
          </div>
          
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-black tracking-tight leading-[1.05]">
            Premium Workspace <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary/60">Essentials</span>
          </h1>
          
          <p className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-lg font-medium">
            Discover curated professional equipment and accessories designed to elevate your productivity and workspace aesthetics.
          </p>

          <div className="flex flex-wrap items-center gap-4 mt-4">
            <Button size="lg" className="rounded-2xl px-8 h-14 text-base font-bold shadow-xl shadow-primary/25 hover:shadow-primary/40 transition-all active:scale-95">
              Shop Now
            </Button>
            <Button size="lg" variant="outline" className="rounded-2xl px-8 h-14 text-base font-bold bg-background/50 backdrop-blur-md border-border/50 hover:bg-muted/50 transition-all active:scale-95">
              Explore Collections <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full h-[300px] md:h-[400px] lg:h-[450px]"
        >
          {featuredProducts.length > 0 && (
            <div className="absolute inset-0 rounded-3xl overflow-hidden shadow-2xl shadow-primary/10 border border-border/30 group/img">
              <img
                src={featuredProducts[0].image || `https://picsum.photos/seed/${featuredProducts[0].id}/800/800`}
                alt={featuredProducts[0].name}
                className="object-cover w-full h-full transition-transform duration-1000 ease-out group-hover/img:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent opacity-80" />
              <div className="absolute bottom-0 left-0 right-0 p-8 text-white translate-y-4 group-hover/img:translate-y-0 transition-transform duration-500 ease-out">
                <div className="text-xs font-black uppercase tracking-widest text-primary mb-3">Featured Product</div>
                <h3 className="text-3xl md:text-4xl font-extrabold tracking-tight">{featuredProducts[0].name}</h3>
                <p className="text-white/80 mt-3 text-sm md:text-base line-clamp-2 max-w-md leading-relaxed font-medium">{featuredProducts[0].description}</p>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
