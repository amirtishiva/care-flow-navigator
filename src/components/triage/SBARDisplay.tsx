import { SBARSummary } from '@/types/triage';
import { FileText, ClipboardList, Brain, Lightbulb } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SBARDisplayProps {
  sbar: SBARSummary;
  compact?: boolean;
}

interface SectionProps {
  letter: string;
  title: string;
  content: string;
  icon: React.ReactNode;
  sectionClass: string;
  compact?: boolean;
}

function SBARSection({ letter, title, content, icon, sectionClass, compact }: SectionProps) {
  if (compact) {
    return (
      <div className={cn('rounded-md p-2 border-l-2', sectionClass)}>
        <div className="flex items-center gap-1.5 mb-0.5">
          <span className="font-bold text-xs">{letter}</span>
          <span className="text-xs font-medium opacity-70">{title}</span>
        </div>
        <p className="text-xs leading-relaxed">{content}</p>
      </div>
    );
  }

  return (
    <div className={cn('rounded-lg p-4 border-l-4', sectionClass)}>
      <div className="flex items-center gap-2 mb-2">
        {icon}
        <span className="font-bold text-lg">{letter}</span>
        <span className="text-sm font-medium opacity-70">— {title}</span>
      </div>
      <p className="text-sm leading-relaxed">{content}</p>
    </div>
  );
}

export function SBARDisplay({ sbar, compact = false }: SBARDisplayProps) {
  const iconClass = compact ? 'h-3 w-3' : 'h-4 w-4';
  
  const sections = [
    {
      letter: 'S',
      title: 'Situation',
      content: sbar.situation,
      icon: <FileText className={iconClass} />,
      sectionClass: 'sbar-situation',
    },
    {
      letter: 'B',
      title: 'Background',
      content: sbar.background,
      icon: <ClipboardList className={iconClass} />,
      sectionClass: 'sbar-background',
    },
    {
      letter: 'A',
      title: 'Assessment',
      content: sbar.assessment,
      icon: <Brain className={iconClass} />,
      sectionClass: 'sbar-assessment',
    },
    {
      letter: 'R',
      title: 'Recommendation',
      content: sbar.recommendation,
      icon: <Lightbulb className={iconClass} />,
      sectionClass: 'sbar-recommendation',
    },
  ];

  return (
    <div className={cn('space-y-2', compact ? 'space-y-1.5' : 'space-y-3')}>
      {sections.map((section) => (
        <SBARSection key={section.letter} {...section} compact={compact} />
      ))}
    </div>
  );
}
