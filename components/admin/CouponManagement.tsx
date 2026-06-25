'use client';

import { useState, useMemo } from 'react';
import { 
  useCouponsQuery, 
  useGenerateCouponMutation, 
  useDisableCouponMutation, 
  useDeleteCouponMutation 
} from '@/features/admin/useAdmin';
import { DiscountStatus } from '@/types/admin';
import { CouponFormDialog } from './CouponFormDialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { 
  MoreVertical, Search, Tag, Plus, CheckCircle2, 
  Clock, Ban, Trash2 
} from 'lucide-react';
import { format } from 'date-fns';

export function CouponManagement() {
  const { data: coupons = [], isLoading } = useCouponsQuery();
  const generateMutation = useGenerateCouponMutation();
  const disableMutation = useDisableCouponMutation();
  const deleteMutation = useDeleteCouponMutation();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<DiscountStatus | 'ALL'>('ALL');

  const filteredCoupons = useMemo(() => {
    return coupons.filter(c => {
      const matchesSearch = c.code.toLowerCase().includes(search.toLowerCase());
      const matchesStatus = statusFilter === 'ALL' || c.status === statusFilter;
      return matchesSearch && matchesStatus;
    }).sort((a, b) => new Date(b.generatedAt).getTime() - new Date(a.generatedAt).getTime());
  }, [coupons, search, statusFilter]);

  const handleDisable = (code: string) => {
    if (confirm(`Are you sure you want to disable coupon ${code}?`)) {
      disableMutation.mutate(code);
    }
  };

  const handleDelete = (code: string) => {
    if (confirm(`Are you sure you want to permanently delete coupon ${code}?`)) {
      deleteMutation.mutate(code);
    }
  };

  const StatusBadge = ({ status }: { status: DiscountStatus }) => {
    switch (status) {
      case 'ACTIVE':
        return <Badge className="bg-green-500/10 text-green-600 hover:bg-green-500/20 border-0 rounded-md"><CheckCircle2 className="w-3 h-3 mr-1" /> Active</Badge>;
      case 'USED':
        return <Badge variant="secondary" className="rounded-md opacity-80"><CheckCircle2 className="w-3 h-3 mr-1" /> Used</Badge>;
      case 'EXPIRED':
        return <Badge className="bg-yellow-500/10 text-yellow-600 hover:bg-yellow-500/20 border-0 rounded-md"><Clock className="w-3 h-3 mr-1" /> Expired</Badge>;
      case 'DISABLED':
        return <Badge className="bg-red-500/10 text-red-600 hover:bg-red-500/20 border-0 rounded-md"><Ban className="w-3 h-3 mr-1" /> Disabled</Badge>;
    }
  };

  return (
    <div className="rounded-3xl border border-border/50 bg-card/50 backdrop-blur-sm shadow-sm overflow-hidden flex flex-col">
      <div className="p-6 border-b border-border/50 flex flex-col gap-4 bg-muted/10">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold tracking-tight">Coupon Management</h2>
          <div className="flex items-center gap-3">
            <Button 
              variant="outline" 
              onClick={() => generateMutation.mutate(undefined)}
              disabled={generateMutation.isPending}
              className="rounded-xl font-semibold border-primary/20 hover:bg-primary/5"
            >
              {generateMutation.isPending ? 'Generating...' : <><Tag className="w-4 h-4 mr-2" /> Auto Generate</>}
            </Button>
            <Button 
              onClick={() => setIsFormOpen(true)}
              className="rounded-xl shadow-md font-bold"
            >
              <Plus className="w-4 h-4 mr-2" /> New Coupon
            </Button>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 items-center">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search by code..." 
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="pl-9 bg-background/50 border-border/50 rounded-xl"
            />
          </div>
          <div className="flex gap-2 bg-background/50 p-1 rounded-xl border border-border/50 overflow-x-auto">
            {['ALL', 'ACTIVE', 'USED', 'EXPIRED', 'DISABLED'].map(status => (
              <button
                key={status}
                onClick={() => setStatusFilter(status as any)}
                className={`px-4 py-1.5 rounded-lg text-sm font-semibold transition-colors ${statusFilter === status ? 'bg-primary text-primary-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'}`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="overflow-auto flex-1 min-h-[400px] max-h-[600px] custom-scrollbar relative">
        {isLoading ? (
          <div className="absolute inset-0 flex items-center justify-center bg-background/50 backdrop-blur-sm z-10">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : null}

        <Table>
          <TableHeader className="sticky top-0 bg-card z-10 shadow-sm">
            <TableRow className="hover:bg-transparent">
              <TableHead className="font-semibold text-xs uppercase tracking-wider">Code</TableHead>
              <TableHead className="font-semibold text-xs uppercase tracking-wider">Discount</TableHead>
              <TableHead className="font-semibold text-xs uppercase tracking-wider">Status</TableHead>
              <TableHead className="font-semibold text-xs uppercase tracking-wider">Usage</TableHead>
              <TableHead className="font-semibold text-xs uppercase tracking-wider">Created</TableHead>
              <TableHead className="font-semibold text-xs uppercase tracking-wider">Expires</TableHead>
              <TableHead className="text-right font-semibold text-xs uppercase tracking-wider"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredCoupons.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="h-48 text-center text-muted-foreground font-medium">
                  {search || statusFilter !== 'ALL' ? 'No coupons match your filters.' : 'No coupons found. Create one to get started!'}
                </TableCell>
              </TableRow>
            ) : (
              filteredCoupons.map((coupon) => (
                <TableRow key={coupon.code} className="hover:bg-muted/30 transition-colors group">
                  <TableCell className="font-mono font-bold text-sm">{coupon.code}</TableCell>
                  <TableCell className="font-extrabold text-primary">{coupon.percentage}% OFF</TableCell>
                  <TableCell>
                    <StatusBadge status={coupon.status} />
                  </TableCell>
                  <TableCell className="text-sm font-medium">
                    {coupon.usageCount} {coupon.usageLimit ? `/ ${coupon.usageLimit}` : ''}
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground font-medium">
                    {format(new Date(coupon.generatedAt), 'MMM dd, yyyy')}
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground font-medium">
                    {coupon.expiryDate ? format(new Date(coupon.expiryDate), 'MMM dd, yyyy') : 'Never'}
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger render={<Button variant="ghost" className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity" />}>
                        <span className="sr-only">Open menu</span>
                        <MoreVertical className="h-4 w-4" />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="rounded-xl shadow-xl">
                        <DropdownMenuItem onClick={() => navigator.clipboard.writeText(coupon.code)}>
                          Copy Code
                        </DropdownMenuItem>
                        {coupon.status === 'ACTIVE' && (
                          <DropdownMenuItem onClick={() => handleDisable(coupon.code)} className="text-yellow-600 focus:bg-yellow-50 focus:text-yellow-700">
                            <Ban className="h-4 w-4 mr-2" /> Disable
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => handleDelete(coupon.code)} className="text-red-600 focus:bg-red-50 focus:text-red-700">
                          <Trash2 className="h-4 w-4 mr-2" /> Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
      
      <CouponFormDialog open={isFormOpen} onOpenChange={setIsFormOpen} />
    </div>
  );
}
