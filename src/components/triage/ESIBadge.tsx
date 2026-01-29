import { cn } from '@/lib/utils';
import { ESILevel, ESI_LABELS } from '@/types/triage';

interface ESIBadgeProps {
  level: ESILevel;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  className?: string;
}

export function ESIBadge({ level, size = 'md', showLabel = false, className }: ESIBadgeProps) {
  const sizeClasses = {
    sm: 'h-6 min-w-6 text-xs px-2',
    md: 'h-8 min-w-8 text-sm px-3',
    lg: 'h-10 min-w-10 text-base px-4',
  };

  const badgeClass = {
    1: 'esi-badge-1',
    2: 'esi-badge-2',
    3: 'esi-badge-3',
    4: 'esi-badge-4',
    5: 'esi-badge-5',
  }[level];

  return (
    <div 
      className={cn(
        'inline-flex items-center justify-center rounded-md font-semibold',
        sizeClasses[size],
        badgeClass,
        level === 1 && 'animate-pulse-ring',
        className
      )}
    >
      <span className="font-vitals">{level}</span>
      {showLabel && (
        <span className="ml-1.5 font-medium">{ESI_LABELS[level].label}</span>
      )}
    </div>
  );
}

export function ESILevelSelector({ 
  value, 
  onChange, 
  disabled = false 
}: { 
  value: ESILevel; 
  onChange: (level: ESILevel) => void;
  disabled?: boolean;
}) {
  const levels: ESILevel[] = [1, 2, 3, 4, 5];

  return (
    <div className="flex gap-2">
      {levels.map((level) => (
        <button
          key={level}
          type="button"
          disabled={disabled}
          onClick={() => onChange(level)}
          className={cn(
            'flex flex-col items-center rounded-lg border-2 p-3 transition-all',
            'hover:scale-105 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
            value === level ? 'border-primary shadow-md' : 'border-transparent bg-muted/50',
            disabled && 'opacity-50 cursor-not-allowed'
          )}
        >
          <ESIBadge level={level} size="md" />
          <span className="mt-1.5 text-xs font-medium text-muted-foreground">
            {ESI_LABELS[level].label}
          </span>
        </button>
      ))}
    </div>
  );
}
