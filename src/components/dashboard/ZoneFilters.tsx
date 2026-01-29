import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface ZoneFiltersProps {
  activeZone: string;
  onZoneChange: (zone: string) => void;
}

export function ZoneFilters({ activeZone, onZoneChange }: ZoneFiltersProps) {
  const zones = ['All Zones', 'Pod A', 'Pod B', 'Fast Track', 'Pediatric'];
  
  return (
    <div className="flex items-center gap-2">
      <span className="section-label">Zone Filter:</span>
      <div className="flex gap-1">
        {zones.map((zone) => (
          <Button
            key={zone}
            variant={activeZone === zone ? 'default' : 'outline'}
            size="sm"
            className={cn(
              'h-7 px-3 text-xs',
              activeZone === zone && 'bg-primary text-primary-foreground'
            )}
            onClick={() => onZoneChange(zone)}
          >
            {zone}
          </Button>
        ))}
      </div>
    </div>
  );
}
