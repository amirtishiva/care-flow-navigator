import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, Bell } from 'lucide-react';
import { cn } from '@/lib/utils';

interface EscalationCardProps {
  type: 'critical' | 'warning' | 'info';
  title: string;
  subtitle: string;
  patientName: string;
  patientLocation: string;
  provider: string;
  timeLabel: string;
  onAction?: () => void;
  actionLabel?: string;
}

export function EscalationCard({ 
  type, 
  title, 
  subtitle, 
  patientName, 
  patientLocation,
  provider,
  timeLabel,
  onAction,
  actionLabel = 'NOTIFY PROVIDER'
}: EscalationCardProps) {
  return (
    <div className={cn(
      'escalation-card',
      type === 'critical' && 'escalation-critical',
      type === 'warning' && 'escalation-warning',
      type === 'info' && 'escalation-info',
    )}>
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-2">
          {type === 'critical' && <div className="status-dot-critical" />}
          {type === 'warning' && <AlertTriangle className="h-3.5 w-3.5 text-[hsl(var(--esi-2))]" />}
          {type === 'info' && <Bell className="h-3.5 w-3.5 text-muted-foreground" />}
          <span className={cn(
            'text-xs font-semibold',
            type === 'critical' && 'text-[hsl(var(--esi-1))]',
            type === 'warning' && 'text-[hsl(var(--esi-2))]',
          )}>
            {title}
          </span>
        </div>
        <Badge variant="outline" className={cn(
          'text-[9px] font-medium px-1.5 py-0',
          type === 'critical' && 'border-[hsl(var(--esi-1)/0.3)] text-[hsl(var(--esi-1))]',
          type === 'warning' && 'border-[hsl(var(--esi-2)/0.3)] text-[hsl(var(--esi-2))]',
        )}>
          {timeLabel}
        </Badge>
      </div>
      
      <p className="text-[10px] text-muted-foreground">{subtitle}</p>
      
      <div className="text-xs space-y-0.5">
        <p>Patient: <span className="font-medium">{patientName} ({patientLocation})</span></p>
        <p>Provider: <span className="text-muted-foreground">{provider}</span></p>
      </div>
      
      <Button 
        size="sm" 
        className={cn(
          'w-full h-7 text-xs font-semibold mt-1',
          type === 'critical' && 'bg-[hsl(var(--esi-1))] hover:bg-[hsl(var(--esi-1)/0.9)] text-white',
          type === 'warning' && 'bg-[hsl(var(--esi-2))] hover:bg-[hsl(var(--esi-2)/0.9)] text-foreground',
          type === 'info' && 'bg-primary hover:bg-primary/90',
        )}
        onClick={onAction}
      >
        {actionLabel}
      </Button>
    </div>
  );
}
