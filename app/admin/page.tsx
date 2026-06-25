'use client';

import { motion } from 'framer-motion';
import { useMemo } from 'react';
import { useAdminStatsQuery } from '@/features/admin/useAdmin';
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
import { ProductManagement } from '@/components/admin/ProductManagement';
import { CouponManagement } from '@/components/admin/CouponManagement';
import { 
  DollarSign, Package, Tag, 
  TrendingUp, Activity, Plus, ShoppingBag 
} from 'lucide-react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer,
  BarChart, Bar
} from 'recharts';
import { format, subDays, startOfDay, isSameDay } from 'date-fns';

function KpiCard({ title, value, icon, trend, trendLabel }: { title: string, value: string | number, icon: React.ReactNode, trend: string, trendLabel: string }) {
  const isPositive = trend.startsWith('+');
  return (
    <div className="rounded-3xl border border-border/50 bg-card/80 backdrop-blur-xl p-6 shadow-sm flex flex-col gap-4">
      <div className="flex justify-between items-start">
        <p className="text-sm font-medium text-muted-foreground">{title}</p>
        <div className="p-2.5 bg-primary/10 text-primary rounded-xl">
          {icon}
        </div>
      </div>
      <div>
        <h3 className="text-3xl font-extrabold tracking-tight">{value}</h3>
        <div className="flex items-center gap-2 mt-2">
          <span className={`text-xs font-bold px-2 py-1 rounded-md ${isPositive ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
            {trend}
          </span>
          <span className="text-xs text-muted-foreground font-medium">{trendLabel}</span>
        </div>
      </div>
    </div>
  );
}

export default function AdminPage() {
  const { data: stats, isLoading, isError } = useAdminStatsQuery();

  // Mock time-series data based on raw orders if they exist
  // We'll group the last 7 days of revenue
  const chartData = useMemo(() => {
    if (!stats || !stats.orders) return [];
    
    const data = [];
    for (let i = 6; i >= 0; i--) {
      const date = subDays(new Date(), i);
      const start = startOfDay(date);
      
      const dayOrders = stats.orders.filter((o: any) => isSameDay(new Date(o.createdAt), start));
      const revenue = dayOrders.reduce((sum: number, o: any) => sum + o.totalAmount, 0);
      
      data.push({
        name: format(date, 'MMM dd'),
        revenue: revenue,
        orders: dayOrders.length
      });
    }
    return data;
  }, [stats]);

  if (isLoading) {
    return <LoadingState title="Admin Dashboard" type="cards" />;
  }

  if (isError || !stats) {
    return <ErrorState title="Dashboard Error" message="Unable to load analytics." />;
  }

  const averageOrderValue = stats.totalOrders > 0 ? (stats.totalRevenue / stats.totalOrders).toFixed(2) : '0.00';
  const activeCoupons = stats.discountCodes.filter(c => c.status === 'ACTIVE').length;

  return (
    <div className="flex flex-col gap-10 w-full pb-16 max-w-[1600px] mx-auto">
      {/* Header & Quick Actions */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-6 border-b border-border/50">
        <div>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">Overview</h1>
          <p className="text-lg text-muted-foreground mt-2">
            Monitor store performance, analytics, and active promotions.
          </p>
        </div>
        <div className="flex items-center gap-3 w-full md:w-auto">
          <Button variant="outline" className="rounded-xl h-12 px-4 shadow-sm border-border/50 w-full md:w-auto">
            <Plus className="w-4 h-4 mr-2" /> New Product
          </Button>
        </div>
      </div>

      {/* KPIs */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
      >
        <KpiCard 
          title="Total Revenue" 
          value={`$${stats.totalRevenue.toFixed(2)}`} 
          icon={<DollarSign className="h-5 w-5" />} 
          trend="+14.2%" 
          trendLabel="vs last month" 
        />
        <KpiCard 
          title="Total Orders" 
          value={stats.totalOrders} 
          icon={<ShoppingBag className="h-5 w-5" />} 
          trend="+5.4%" 
          trendLabel="vs last month" 
        />
        <KpiCard 
          title="Average Order Value" 
          value={`$${averageOrderValue}`} 
          icon={<TrendingUp className="h-5 w-5" />} 
          trend="+2.1%" 
          trendLabel="vs last month" 
        />
        <KpiCard 
          title="Items Sold" 
          value={stats.itemsPurchased} 
          icon={<Package className="h-5 w-5" />} 
          trend="+12.5%" 
          trendLabel="vs last month" 
        />
        <KpiCard 
          title="Total Discounts" 
          value={`$${stats.totalDiscountGiven.toFixed(2)}`} 
          icon={<Activity className="h-5 w-5" />} 
          trend="-1.2%" 
          trendLabel="vs last month" 
        />
        <KpiCard 
          title="Active Coupons" 
          value={activeCoupons} 
          icon={<Tag className="h-5 w-5" />} 
          trend="+3" 
          trendLabel="new this week" 
        />
      </motion.div>

      {/* Analytics Charts */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="grid lg:grid-cols-[2fr_1fr] gap-6"
      >
        <div className="rounded-3xl border border-border/50 bg-card/50 backdrop-blur-sm p-6 shadow-sm">
          <h2 className="text-xl font-bold mb-6">Revenue Over Time</h2>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" opacity={0.5} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }} tickFormatter={(val) => `$${val}`} />
                <RechartsTooltip 
                  contentStyle={{ backgroundColor: 'hsl(var(--card))', borderRadius: '12px', border: '1px solid hsl(var(--border))', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                  itemStyle={{ color: 'hsl(var(--foreground))', fontWeight: 'bold' }}
                  formatter={(value: any) => [`$${Number(value).toFixed(2)}`, 'Revenue']}
                />
                <Area type="monotone" dataKey="revenue" stroke="hsl(var(--primary))" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-3xl border border-border/50 bg-card/50 backdrop-blur-sm p-6 shadow-sm">
          <h2 className="text-xl font-bold mb-6">Order Volume</h2>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" opacity={0.5} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }} />
                <RechartsTooltip 
                  cursor={{ fill: 'hsl(var(--muted)/0.3)' }}
                  contentStyle={{ backgroundColor: 'hsl(var(--card))', borderRadius: '12px', border: '1px solid hsl(var(--border))' }}
                />
                <Bar dataKey="orders" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} barSize={30} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </motion.div>

      {/* Data Tables */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="grid gap-6"
      >
        {/* Recent Orders Table */}
        <div className="rounded-3xl border border-border/50 bg-card/50 backdrop-blur-sm shadow-sm overflow-hidden flex flex-col">
          <div className="p-6 border-b border-border/50 flex justify-between items-center bg-muted/10">
            <h2 className="text-xl font-bold tracking-tight">Recent Orders</h2>
            <Button variant="ghost" size="sm" className="text-primary font-semibold">View All</Button>
          </div>
          <div className="overflow-auto flex-1 max-h-[400px] custom-scrollbar">
            <Table>
              <TableHeader className="sticky top-0 bg-card z-10 shadow-sm">
                <TableRow className="hover:bg-transparent">
                  <TableHead className="font-semibold text-xs uppercase tracking-wider">Order ID</TableHead>
                  <TableHead className="font-semibold text-xs uppercase tracking-wider">Customer</TableHead>
                  <TableHead className="font-semibold text-xs uppercase tracking-wider text-right">Total</TableHead>
                  <TableHead className="font-semibold text-xs uppercase tracking-wider text-right">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {!stats.orders || stats.orders.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="h-32 text-center text-muted-foreground font-medium">
                      No orders yet.
                    </TableCell>
                  </TableRow>
                ) : (
                  stats.orders.slice(0, 10).map((order: any) => (
                    <TableRow key={order.id} className="hover:bg-muted/30 transition-colors">
                      <TableCell className="font-mono text-xs font-bold">{order.id.slice(0, 8)}</TableCell>
                      <TableCell className="text-sm font-medium">{order.userId}</TableCell>
                      <TableCell className="text-right font-bold">${order.totalAmount.toFixed(2)}</TableCell>
                      <TableCell className="text-right">
                        <Badge className="bg-green-500/10 text-green-600 hover:bg-green-500/20 border-0">{order.status}</Badge>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </motion.div>

      {/* Coupon Management Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.25 }}
      >
        <CouponManagement />
      </motion.div>

      {/* Product Management Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <ProductManagement />
      </motion.div>
    </div>
  );
}
