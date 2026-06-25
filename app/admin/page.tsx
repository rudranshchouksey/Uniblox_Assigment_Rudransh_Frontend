'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import { useAdminStatsQuery, useGenerateCouponMutation } from '@/features/admin/useAdmin';
import { DiscountCode } from '@/types/admin';
import { StatsCard } from '@/components/shared/StatsCard';
import { LoadingState } from '@/components/shared/LoadingState';
import { ErrorState } from '@/components/shared/ErrorState';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { CreditCard, DollarSign, Package, Tag, Copy, CheckCircle2 } from 'lucide-react';

export default function AdminPage() {
  const { data: stats, isLoading, isError } = useAdminStatsQuery();
  const generateCouponMutation = useGenerateCouponMutation();

  const [generatedCoupon, setGeneratedCoupon] = useState<DiscountCode | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleGenerate = () => {
    generateCouponMutation.mutate(undefined, {
      onSuccess: (data) => {
        setGeneratedCoupon(data);
        setIsModalOpen(true);
        setCopied(false);
      }
    });
  };

  const copyToClipboard = () => {
    if (generatedCoupon) {
      navigator.clipboard.writeText(generatedCoupon.code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (isLoading) {
    return (
      <LoadingState 
        title="Admin Dashboard" 
        type="cards" 
      />
    );
  }

  if (isError || !stats) {
    return (
      <ErrorState 
        title="Error loading dashboard" 
        message="Unable to fetch administrative statistics at this time." 
      />
    );
  }

  return (
    <div className="flex flex-col gap-8 w-full">
      <div className="flex justify-between items-end pb-4 border-b border-border/50">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight">Admin Dashboard</h1>
          <p className="text-lg text-muted-foreground mt-2">
            Overview of store performance and promotions.
          </p>
        </div>
        <Button 
          onClick={handleGenerate} 
          disabled={generateCouponMutation.isPending}
          size="lg"
          className="rounded-xl shadow-md shadow-primary/20 font-semibold"
        >
          {generateCouponMutation.isPending ? 'Generating...' : 'Generate Coupon'}
        </Button>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="grid gap-6 md:grid-cols-2 lg:grid-cols-4"
      >
        <StatsCard 
          title="Total Orders"
          value={stats.totalOrders}
          subtitle="Successfully processed"
          icon={<CreditCard className="h-4 w-4 text-muted-foreground" />}
        />
        <StatsCard 
          title="Total Revenue"
          value={`$${stats.totalRevenue.toFixed(2)}`}
          subtitle="Gross income across all orders"
          icon={<DollarSign className="h-4 w-4 text-muted-foreground" />}
        />
        <StatsCard 
          title="Items Purchased"
          value={stats.itemsPurchased}
          subtitle="Individual products sold"
          icon={<Package className="h-4 w-4 text-muted-foreground" />}
        />
        <StatsCard 
          title="Total Discount Given"
          value={`$${stats.totalDiscountGiven.toFixed(2)}`}
          subtitle="Savings passed to customers"
          icon={<Tag className="h-4 w-4 text-muted-foreground" />}
        />
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="flex flex-col gap-6 mt-8"
      >
        <h2 className="text-2xl font-bold tracking-tight">Discount Codes</h2>
        <div className="rounded-3xl border border-border/50 bg-card/50 backdrop-blur-sm shadow-sm overflow-hidden">
          <Table>
            <TableHeader className="bg-muted/30">
              <TableRow className="hover:bg-transparent">
                <TableHead className="font-semibold text-muted-foreground tracking-wider uppercase text-xs">Code</TableHead>
                <TableHead className="font-semibold text-muted-foreground tracking-wider uppercase text-xs">Percentage</TableHead>
                <TableHead className="font-semibold text-muted-foreground tracking-wider uppercase text-xs">Status</TableHead>
                <TableHead className="text-right font-semibold text-muted-foreground tracking-wider uppercase text-xs">Generated At</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {stats.discountCodes.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="h-32 text-center text-muted-foreground font-medium">
                    No discount codes generated yet.
                  </TableCell>
                </TableRow>
              ) : (
                stats.discountCodes.map((code) => (
                  <TableRow key={code.code} className="hover:bg-muted/30 transition-colors">
                    <TableCell className="font-mono font-bold tracking-tight text-base">{code.code}</TableCell>
                    <TableCell className="font-medium">{code.percentage}%</TableCell>
                    <TableCell>
                      {code.used ? (
                        <Badge variant="secondary" className="rounded-md">Used</Badge>
                      ) : (
                        <Badge variant="default" className="bg-green-500/10 text-green-600 dark:text-green-400 hover:bg-green-500/20 border-0 rounded-md">Available</Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right text-sm text-muted-foreground font-medium">
                      {new Date(code.generatedAt).toLocaleString()}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </motion.div>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-md text-center flex flex-col items-center p-8">
          <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mb-4">
            <CheckCircle2 className="w-8 h-8 text-green-600 dark:text-green-500" />
          </div>
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-center">Coupon Generated!</DialogTitle>
            <DialogDescription className="text-center text-base mt-2">
              Share this code with a customer to give them {generatedCoupon?.percentage}% off their next purchase.
            </DialogDescription>
          </DialogHeader>
          <div className="flex items-center space-x-2 mt-6 p-4 bg-muted/50 rounded-lg w-full">
            <code className="text-xl font-mono font-bold flex-1 text-center select-all">
              {generatedCoupon?.code}
            </code>
            <Button size="icon" variant="outline" onClick={copyToClipboard} className="shrink-0">
              {copied ? <CheckCircle2 className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
            </Button>
          </div>
          <Button className="w-full mt-6" size="lg" onClick={() => setIsModalOpen(false)}>
            Done
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  );
}
