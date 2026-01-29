import { cn } from '@/lib/utils';
import { InfluencingFactor } from '@/types/triage';
import { TrendingUp, TrendingDown, Minus, Info } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface ConfidenceIndicatorProps {
  confidence: number;
  factors: InfluencingFactor[];
  showFactors?: boolean;
}

export function ConfidenceIndicator({ 
  confidence, 
  factors, 
  showFactors = true 
}: ConfidenceIndicatorProps) {
  const getConfidenceColor = () => {
    if (confidence >= 90) return 'bg-confidence-high';
    if (confidence >= 75) return 'bg-confidence-medium';
    return 'bg-confidence-low';
  };

  const getConfidenceLabel = () => {
    if (confidence >= 90) return 'High';
    if (confidence >= 75) return 'Moderate';
    return 'Low';
  };

  return (
    <div className="space-y-3">
      {/* Confidence Bar */}
      <div className="flex items-center gap-3">
        <div className="flex-1">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-sm font-medium">AI Confidence</span>
            <div className="flex items-center gap-2">
              <span className={cn(
                'text-xs font-medium px-2 py-0.5 rounded-full',
                confidence >= 90 ? 'bg-confidence-high/10 text-confidence-high' :
                confidence >= 75 ? 'bg-confidence-medium/10 text-confidence-medium' :
                'bg-confidence-low/10 text-confidence-low'
              )}>
                {getConfidenceLabel()}
              </span>
              <span className="font-vitals text-sm font-semibold">{confidence}%</span>
            </div>
          </div>
          <div className="confidence-bar">
            <div 
              className={cn('confidence-fill', getConfidenceColor())}
              style={{ width: `${confidence}%` }}
            />
          </div>
        </div>

        <Tooltip>
          <TooltipTrigger asChild>
            <button className="p-1.5 rounded-full hover:bg-muted transition-colors">
              <Info className="h-4 w-4 text-muted-foreground" />
            </button>
          </TooltipTrigger>
          <TooltipContent side="left" className="max-w-xs">
            <p className="text-xs">
              Confidence reflects how closely this case matches training patterns. 
              Clinical judgment should always take precedence.
            </p>
          </TooltipContent>
        </Tooltip>
      </div>

      {/* Influencing Factors */}
      {showFactors && factors.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
            Key Influencing Factors
          </h4>
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

  const impactColor = {
    increases: 'text-esi-2 bg-esi-2-bg border-esi-2/20',
    decreases: 'text-esi-4 bg-esi-4-bg border-esi-4/20',
    neutral: 'text-muted-foreground bg-muted border-border',
  }[factor.impact];

  const categoryLabel = {
    vital: 'Vital',
    symptom: 'Symptom',
    history: 'History',
    age: 'Demographic',
    other: 'Other',
  }[factor.category];

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <div className={cn(
          'inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium cursor-help',
          impactColor
        )}>
          <ImpactIcon className="h-3 w-3" />
          <span>{factor.factor}</span>
        </div>
      </TooltipTrigger>
      <TooltipContent>
        <p className="text-xs">
          <span className="font-medium">{categoryLabel}:</span> {factor.impact === 'increases' ? 'Increases' : factor.impact === 'decreases' ? 'Decreases' : 'No impact on'} acuity score
          <br />
          <span className="opacity-70">Weight: {(factor.weight * 100).toFixed(0)}%</span>
        </p>
      </TooltipContent>
    </Tooltip>
  );
}
