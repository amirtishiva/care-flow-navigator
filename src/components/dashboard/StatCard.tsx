import { ReactNode } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: ReactNode;
  trend?: { value: number; direction: 'up' | 'down' };
  trendLabel?: string;
  variant?: 'default' | 'warning' | 'critical' | 'success';
}

export function StatCard({ 
  title, 
  value, 
  subtitle, 
  icon, 
  trend, 
  trendLabel, 
  variant = 'default' 
}: StatCardProps) {
  return (
    <Card className={cn(
      'stat-card',
      variant === 'default' && 'stat-card-default',
      variant === 'warning' && 'stat-card-warning',
      variant === 'critical' && 'stat-card-critical',
      variant === 'success' && 'stat-card-success',
    )}>
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-2">
          <span className="section-label">{title}</span>
          <span className="text-muted-foreground/60">{icon}</span>
        </div>
        <div className="flex items-baseline gap-2">
          <span className={cn(
            'font-vitals text-2xl font-bold',
            variant === 'critical' && 'text-[hsl(var(--esi-1))]',
            variant === 'warning' && 'text-[hsl(var(--esi-2))]',
          )}>
            {value}
          </span>
          {subtitle && (
            <span className="text-xs text-muted-foreground">{subtitle}</span>
          )}
        </div>
        {trend && (
          <div className="flex items-center gap-1 mt-2">
            {trend.direction === 'up' ? (
              <TrendingUp className="h-3 w-3 text-[hsl(var(--esi-2))]" />
            ) : (
              <TrendingDown className="h-3 w-3 text-[hsl(var(--confidence-high))]" />
            )}
            <span className={cn(
              'text-xs font-medium',
              trend.direction === 'up' ? 'text-[hsl(var(--esi-2))]' : 'text-[hsl(var(--confidence-high))]'
            )}>
              {trend.direction === 'up' ? '+' : ''}{trend.value}%
            </span>
            {trendLabel && (
              <span className="text-xs text-muted-foreground">{trendLabel}</span>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
