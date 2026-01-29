import { cn } from '@/lib/utils';
import { InfluencingFactor } from '@/types/triage';
import { TrendingUp, TrendingDown, Minus, Info, Sparkles } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface ConfidenceIndicatorProps {
  confidence: number;
  factors?: InfluencingFactor[];
  showFactors?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export function ConfidenceIndicator({ 
  confidence, 
  factors = [], 
  showFactors = true,
  size = 'md'
}: ConfidenceIndicatorProps) {
  const getConfidenceColor = () => {
    if (confidence >= 90) return 'bg-confidence-high';
    if (confidence >= 75) return 'bg-confidence-medium';
    return 'bg-confidence-low';
  };

  const getConfidenceLabel = () => {
    if (confidence >= 90) return { text: 'High', color: 'text-confidence-high bg-confidence-high/10 border-confidence-high/30' };
    if (confidence >= 75) return { text: 'Medium', color: 'text-confidence-medium bg-confidence-medium/10 border-confidence-medium/30' };
    return { text: 'Low', color: 'text-confidence-low bg-confidence-low/10 border-confidence-low/30' };
  };

  const label = getConfidenceLabel();

  return (
    <div className="space-y-3">
      {/* Confidence Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-primary" />
          <span className={cn(
            'font-medium',
            size === 'sm' && 'text-xs',
            size === 'md' && 'text-sm',
            size === 'lg' && 'text-base'
          )}>
            Model Confidence
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className={cn(
            'px-2 py-0.5 rounded-full text-xs font-semibold border',
            label.color
          )}>
            {label.text}
          </span>
          <span className="font-mono font-bold text-foreground">
            {confidence}%
          </span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="confidence-bar">
        <div 
          className={cn('confidence-fill', getConfidenceColor())}
          style={{ width: `${confidence}%` }}
        />
      </div>

      {/* Influencing Factors */}
      {showFactors && factors.length > 0 && (
        <div className="space-y-2 pt-2">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
              Rationale Factors
            </h4>
            <Tooltip>
              <TooltipTrigger asChild>
                <button className="p-1 rounded hover:bg-muted transition-colors">
                  <Info className="h-3.5 w-3.5 text-muted-foreground" />
                </button>
              </TooltipTrigger>
              <TooltipContent side="left" className="max-w-xs">
                <p className="text-xs">
                  These factors influenced the AI's ESI recommendation. 
                  Clinical judgment should always take precedence.
                </p>
              </TooltipContent>
            </Tooltip>
          </div>
          <div className="flex flex-wrap gap-2">
            {factors.map((factor, index) => (
              <FactorBadge key={index} factor={factor} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function FactorBadge({ factor }: { factor: InfluencingFactor }) {
  const ImpactIcon = {
    increases: TrendingUp,
    decreases: TrendingDown,
    neutral: Minus,
  }[factor.impact];

  const impactStyles = {
    increases: 'text-esi-2 bg-esi-2-bg border-esi-2-border',
    decreases: 'text-esi-4 bg-esi-4-bg border-esi-4-border',
    neutral: 'text-muted-foreground bg-muted border-border',
  }[factor.impact];

  const categoryLabel = {
    vital: 'Vital',
    symptom: 'Symptom',
    history: 'History',
    age: 'Demo',
    other: 'Other',
  }[factor.category];

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <div className={cn(
          'inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1 text-xs font-medium cursor-help transition-colors hover:opacity-80',
          impactStyles
        )}>
          <ImpactIcon className="h-3 w-3" />
          <span>{factor.factor}</span>
        </div>
      </TooltipTrigger>
      <TooltipContent>
        <div className="text-xs space-y-1">
          <p className="font-medium">{categoryLabel} Factor</p>
          <p className="text-muted-foreground">
            {factor.impact === 'increases' ? 'Increases' : factor.impact === 'decreases' ? 'Decreases' : 'Neutral impact on'} severity
          </p>
          <p className="text-muted-foreground">
            Weight: {(factor.weight * 100).toFixed(0)}%
          </p>
        </div>
      </TooltipContent>
    </Tooltip>
  );
}

// Compact badge for confidence display
export function ConfidenceBadge({ confidence }: { confidence: number }) {
  const getStyle = () => {
    if (confidence >= 90) return 'bg-confidence-high/10 text-confidence-high border-confidence-high/30';
    if (confidence >= 75) return 'bg-confidence-medium/10 text-confidence-medium border-confidence-medium/30';
    return 'bg-confidence-low/10 text-confidence-low border-confidence-low/30';
  };

  return (
    <span className={cn(
      'inline-flex items-center gap-1 px-2 py-0.5 rounded-full border text-xs font-semibold font-mono',
      getStyle()
    )}>
      <span className="w-1.5 h-1.5 rounded-full bg-current" />
      {confidence}%
    </span>
  );
}
