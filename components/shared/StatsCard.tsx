import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface StatsCardProps {
  title: string;
  value: string | number;
  subtitle: string;
  icon: React.ReactNode;
}

export function StatsCard({ title, value, subtitle, icon }: StatsCardProps) {
  return (
    <Card className="rounded-3xl border-border/50 bg-card/50 backdrop-blur-sm shadow-sm hover:shadow-lg hover:shadow-primary/5 transition-all duration-300">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-semibold tracking-wide text-muted-foreground uppercase">{title}</CardTitle>
        <div className="bg-primary/10 text-primary p-2 rounded-xl">
          {icon}
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-extrabold tracking-tight mt-2">{value}</div>
        <p className="text-sm font-medium text-muted-foreground mt-1">{subtitle}</p>
      </CardContent>
    </Card>
  );
}
