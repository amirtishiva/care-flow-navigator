import { SBARSummary } from '@/types/triage';
import { FileText, ClipboardList, Brain, Lightbulb } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SBARDisplayProps {
  sbar: SBARSummary;
  layout?: 'vertical' | 'grid' | 'compact';
  showIcons?: boolean;
}

interface SectionProps {
  letter: string;
  title: string;
  content: string;
  icon: React.ReactNode;
  colorClass: string;
  layout: 'vertical' | 'grid' | 'compact';
  showIcon?: boolean;
}

function SBARSection({ letter, title, content, icon, colorClass, layout, showIcon = true }: SectionProps) {
  const letterColors = {
    S: 'text-sbar-situation',
    B: 'text-sbar-background',
    A: 'text-sbar-assessment',
    R: 'text-sbar-recommendation',
  }[letter] || 'text-primary';

  if (layout === 'compact') {
    return (
      <div className="flex gap-3">
        <div className={cn('font-bold text-sm uppercase', letterColors)}>{letter}:</div>
        <p className="text-sm text-muted-foreground flex-1">{content}</p>
      </div>
    );
  }

  if (layout === 'grid') {
    return (
      <div className={cn('rounded-xl border border-border/50 p-4 bg-card/50', colorClass)}>
        <div className="flex items-center gap-2 mb-2">
          <span className={cn('font-bold text-xs uppercase tracking-wider', letterColors)}>
            {title}
          </span>
        </div>
        <p className="text-sm leading-relaxed text-foreground/90">{content}</p>
      </div>
    );
  }

  return (
    <div className={cn('rounded-xl p-4 border-l-4 bg-card/30', colorClass)}>
      <div className="flex items-center gap-2 mb-2">
        {showIcon && <span className="opacity-70">{icon}</span>}
        <span className={cn('font-bold text-sm', letterColors)}>{letter}</span>
        <span className="text-xs font-medium text-muted-foreground">— {title}</span>
      </div>
      <p className="text-sm leading-relaxed">{content}</p>
    </div>
  );
}

export function SBARDisplay({ sbar, layout = 'vertical', showIcons = true }: SBARDisplayProps) {
  const sections = [
    {
      letter: 'S',
      title: 'Situation',
      content: sbar.situation,
      icon: <FileText className="h-4 w-4" />,
      colorClass: 'sbar-situation',
    },
    {
      letter: 'B',
      title: 'Background',
      content: sbar.background,
      icon: <ClipboardList className="h-4 w-4" />,
      colorClass: 'sbar-background-section',
    },
    {
      letter: 'A',
      title: 'Assessment',
      content: sbar.assessment,
      icon: <Brain className="h-4 w-4" />,
      colorClass: 'sbar-assessment',
    },
    {
      letter: 'R',
      title: 'Recommendation',
      content: sbar.recommendation,
      icon: <Lightbulb className="h-4 w-4" />,
      colorClass: 'sbar-recommendation',
    },
  ];

  if (layout === 'grid') {
    return (
      <div className="grid grid-cols-2 gap-3">
        {sections.map((section) => (
          <SBARSection key={section.letter} {...section} layout={layout} showIcon={showIcons} />
        ))}
      </div>
    );
  }

  if (layout === 'compact') {
    return (
      <div className="space-y-3 p-4 bg-card/50 rounded-xl border border-border/50">
        {sections.map((section) => (
          <SBARSection key={section.letter} {...section} layout={layout} showIcon={showIcons} />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {sections.map((section) => (
        <SBARSection key={section.letter} {...section} layout={layout} showIcon={showIcons} />
      ))}
    </div>
  );
}

// Inline SBAR for table rows or compact views
export function SBARInline({ sbar }: { sbar: SBARSummary }) {
  return (
    <div className="flex gap-4 text-xs">
      <span><strong className="text-sbar-situation">S:</strong> {sbar.situation.slice(0, 50)}...</span>
      <span><strong className="text-sbar-assessment">A:</strong> {sbar.assessment.slice(0, 50)}...</span>
    </div>
  );
}
