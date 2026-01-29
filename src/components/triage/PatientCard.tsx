import { Patient, ESILevel, PatientStatus } from '@/types/triage';
import { ESIBadge } from './ESIBadge';
import { VitalsDisplay } from './VitalsDisplay';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Clock, 
  User, 
  AlertTriangle, 
  FileText, 
  ChevronRight,
  Pill,
  History
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { formatDistanceToNow } from 'date-fns';

interface PatientCardProps {
  patient: Patient;
  esiLevel?: ESILevel;
  onClick?: () => void;
  showVitals?: boolean;
  showActions?: boolean;
  actionLabel?: string;
  onAction?: () => void;
}

const statusLabels: Record<PatientStatus, { label: string; color: string }> = {
  'waiting': { label: 'Waiting', color: 'bg-status-pending/10 text-status-pending border-status-pending/20' },
  'in-triage': { label: 'In Triage', color: 'bg-status-active/10 text-status-active border-status-active/20' },
  'pending-validation': { label: 'Pending Review', color: 'bg-status-pending/10 text-status-pending border-status-pending/20' },
  'validated': { label: 'Validated', color: 'bg-status-completed/10 text-status-completed border-status-completed/20' },
  'assigned': { label: 'Assigned', color: 'bg-status-active/10 text-status-active border-status-active/20' },
  'acknowledged': { label: 'Acknowledged', color: 'bg-status-completed/10 text-status-completed border-status-completed/20' },
  'in-treatment': { label: 'In Treatment', color: 'bg-primary/10 text-primary border-primary/20' },
  'discharged': { label: 'Discharged', color: 'bg-muted text-muted-foreground border-border' },
};

export function PatientCard({ 
  patient, 
  esiLevel, 
  onClick, 
  showVitals = false,
  showActions = false,
  actionLabel = 'Start Triage',
  onAction
}: PatientCardProps) {
  const waitTime = formatDistanceToNow(patient.arrivalTime, { addSuffix: false });
  const statusInfo = statusLabels[patient.status];

  return (
    <Card 
      className={cn(
        'clinical-card cursor-pointer transition-all',
        esiLevel && esiLevel <= 2 && 'border-l-4',
        esiLevel === 1 && 'border-l-esi-1',
        esiLevel === 2 && 'border-l-esi-2',
      )}
      onClick={onClick}
    >
      <CardContent className="p-4">
        {/* Header Row */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-start gap-3">
            {esiLevel && <ESIBadge level={esiLevel} size="md" />}
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-foreground">
                  {patient.lastName}, {patient.firstName}
                </h3>
                {patient.isReturning && (
                  <Badge variant="outline" className="text-xs">
                    <History className="h-3 w-3 mr-1" />
                    Returning
                  </Badge>
                )}
              </div>
              <div className="flex items-center gap-3 mt-1 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <User className="h-3 w-3" />
                  {patient.age}yo {patient.gender}
                </span>
                <span className="font-mono text-xs">{patient.mrn}</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col items-end gap-1.5">
            <Badge variant="outline" className={cn('text-xs border', statusInfo.color)}>
              {statusInfo.label}
            </Badge>
            <span className="flex items-center gap-1 text-xs text-muted-foreground">
              <Clock className="h-3 w-3" />
              {waitTime}
            </span>
          </div>
        </div>

        {/* Chief Complaint */}
        <div className="mb-3 p-2 rounded-md bg-muted/50">
          <p className="text-sm">
            <span className="font-medium text-muted-foreground">CC: </span>
            {patient.chiefComplaint}
          </p>
        </div>

        {/* Quick Info Row */}
        <div className="flex flex-wrap items-center gap-3 text-xs">
          {patient.allergies && patient.allergies.length > 0 && (
            <span className="flex items-center gap-1 text-esi-2">
              <AlertTriangle className="h-3 w-3" />
              Allergies: {patient.allergies.join(', ')}
            </span>
          )}
          {patient.medications && patient.medications.length > 0 && (
            <span className="flex items-center gap-1 text-muted-foreground">
              <Pill className="h-3 w-3" />
              {patient.medications.length} active meds
            </span>
          )}
          {patient.uploadedDocuments && patient.uploadedDocuments.length > 0 && (
            <span className="flex items-center gap-1 text-muted-foreground">
              <FileText className="h-3 w-3" />
              {patient.uploadedDocuments.length} documents
            </span>
          )}
        </div>

        {/* Vitals Display */}
        {showVitals && (
          <div className="mt-4 pt-4 border-t">
            <VitalsDisplay vitals={patient.vitals} compact />
          </div>
        )}

        {/* Actions */}
        {showActions && (
          <div className="mt-4 pt-4 border-t flex justify-end">
            <Button 
              onClick={(e) => {
                e.stopPropagation();
                onAction?.();
              }}
              className="gap-2"
            >
              {actionLabel}
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
