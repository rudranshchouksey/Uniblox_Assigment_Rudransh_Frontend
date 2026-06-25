'use client';

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
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
          <p className="text-muted-foreground mt-2">
            Overview of store performance and promotions.
          </p>
        </div>
        <Button 
          onClick={handleGenerate} 
          disabled={generateCouponMutation.isPending}
          size="lg"
        >
          {generateCouponMutation.isPending ? 'Generating...' : 'Generate Coupon'}
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
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
      </div>

      <div className="flex flex-col gap-4 mt-4">
        <h2 className="text-xl font-semibold tracking-tight">Discount Codes</h2>
        <div className="rounded-md border bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Code</TableHead>
                <TableHead>Percentage</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Generated At</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {stats.discountCodes.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="h-32 text-center text-muted-foreground">
                    No discount codes generated yet.
                  </TableCell>
                </TableRow>
              ) : (
                stats.discountCodes.map((code) => (
                  <TableRow key={code.code}>
                    <TableCell className="font-mono font-medium">{code.code}</TableCell>
                    <TableCell>{code.percentage}%</TableCell>
                    <TableCell>
                      {code.used ? (
                        <Badge variant="secondary">Used</Badge>
                      ) : (
                        <Badge variant="default" className="bg-green-600 hover:bg-green-700">Available</Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right text-muted-foreground">
                      {new Date(code.generatedAt).toLocaleString()}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>

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
