import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ESIBadge } from '@/components/triage/ESIBadge';
import { StatCard } from '@/components/dashboard/StatCard';
import { EscalationCard } from '@/components/dashboard/EscalationCard';
import { ZoneFilters } from '@/components/dashboard/ZoneFilters';
import { mockPatients, mockTriageCases, getWaitingPatients, getInTriagePatients } from '@/data/mockData';
import { 
  Users, 
  UserPlus,
  Stethoscope,
  Clock,
  Activity,
  Columns,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { ESILevel } from '@/types/triage';

export default function NurseDashboard() {
  const navigate = useNavigate();
  const waitingPatients = getWaitingPatients();
  const inTriagePatients = getInTriagePatients();
  const [activeZone, setActiveZone] = useState('All Zones');

  // Get ESI level for display
  const getPatientESI = (patientId: string): ESILevel | undefined => {
    const triageCase = mockTriageCases.find(c => c.patient.id === patientId);
    return triageCase?.validation?.validatedESI || triageCase?.aiResult?.draftESI;
  };

  return (
    <div className="space-y-4">
      {/* Stats Row */}
      <div className="grid grid-cols-4 gap-3">
        <StatCard
          title="Total Census"
          value="54"
          icon={<Users className="h-4 w-4" />}
          trend={{ value: 12, direction: 'up' }}
        />
        <StatCard
          title="Waiting Triage"
          value={waitingPatients.length + inTriagePatients.length}
          subtitle="1 High"
          icon={<Stethoscope className="h-4 w-4" />}
          variant="warning"
        />
        <StatCard
          title="Active Resus (ESI 1)"
          value="3"
          subtitle="Beds: 01, 04, 12"
          icon={<Activity className="h-4 w-4" />}
          variant="critical"
        />
        <StatCard
          title="Avg. Wait (Min)"
          value="42m"
          icon={<Clock className="h-4 w-4" />}
          trend={{ value: 4, direction: 'down' }}
          trendLabel="vs last hour"
        />
      </div>

      {/* Main Content - 3 Column Layout */}
      <div className="grid grid-cols-12 gap-4">
        {/* Left Column - Patient Table (9 cols) */}
        <div className="col-span-9 space-y-3">
          {/* Filter Bar */}
          <Card className="clinical-card">
            <CardContent className="p-3">
              <div className="flex items-center justify-between">
                <ZoneFilters activeZone={activeZone} onZoneChange={setActiveZone} />
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" className="h-7 gap-1.5 text-xs">
                    <Columns className="h-3.5 w-3.5" />
                    Columns
                  </Button>
                  <Button size="sm" className="h-7 gap-1.5 text-xs">
                    <UserPlus className="h-3.5 w-3.5" />
                    Add Patient
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Patient Table */}
          <Card className="clinical-card overflow-hidden">
            {/* Table Header */}
            <div className="grid grid-cols-12 gap-2 px-4 py-2 bg-muted/40 border-b border-border">
              <div className="col-span-1 section-label">St.</div>
              <div className="col-span-2 section-label">Patient / MRN</div>
              <div className="col-span-1 section-label">ESI</div>
              <div className="col-span-1 section-label">Location</div>
              <div className="col-span-3 section-label">Chief Complaint</div>
              <div className="col-span-2 section-label">Staff (MD/RN)</div>
              <div className="col-span-2 section-label text-right">LOS / Wait</div>
            </div>

            {/* Table Body */}
            <div className="divide-y divide-border/50">
              {mockPatients.slice(0, 6).map((patient, i) => {
                const esiLevel = getPatientESI(patient.id) || (i === 0 ? 1 : i === 1 ? 2 : i === 2 ? 3 : i === 3 ? 4 : 5) as ESILevel;
                const isCritical = esiLevel <= 2;
                const waitMins = Math.floor((Date.now() - patient.arrivalTime.getTime()) / 60000);
                
                return (
                  <div 
                    key={patient.id}
                    className={cn(
                      'grid grid-cols-12 gap-2 px-4 py-3 items-center table-row-hover',
                      isCritical && 'table-row-critical'
                    )}
                    onClick={() => navigate(`/triage/${patient.id}`)}
                  >
                    {/* Status Dot */}
                    <div className="col-span-1">
                      <div className={cn(
                        'status-dot',
                        isCritical && 'status-dot-critical',
                        esiLevel === 3 && 'bg-[hsl(var(--esi-3))]',
                        esiLevel >= 4 && 'status-dot-stable'
                      )} />
                    </div>

                    {/* Patient Name & MRN */}
                    <div className="col-span-2">
                      <p className="font-semibold text-sm">
                        {patient.lastName.toUpperCase()}, {patient.firstName.toUpperCase()}
                      </p>
                      <p className="text-xs text-muted-foreground font-mono">
                        MRN: {patient.mrn.split('-')[2]} • {patient.age}Y {patient.gender.charAt(0).toUpperCase()}
                      </p>
                    </div>

                    {/* ESI Badge */}
                    <div className="col-span-1">
                      <ESIBadge level={esiLevel} size="sm" />
                    </div>

                    {/* Location */}
                    <div className="col-span-1">
                      <span className={cn(
                        'text-xs',
                        i < 2 ? 'text-foreground font-medium' : 'text-muted-foreground'
                      )}>
                        {i < 2 ? `Bed ${String(i + 4).padStart(2, '0')}` : 'Waiting Room'}
                      </span>
                      <p className="text-[10px] text-muted-foreground">
                        {i < 2 ? `POD ${i === 0 ? 'A' : 'B'}` : 'Lobby'}
                      </p>
                    </div>

                    {/* Chief Complaint */}
                    <div className="col-span-3">
                      <p className={cn(
                        'text-sm font-medium truncate',
                        isCritical && 'text-[hsl(var(--esi-1))]'
                      )}>
                        {patient.chiefComplaint.split(',')[0]}
                      </p>
                      <p className="text-xs text-muted-foreground truncate">
                        {patient.chiefComplaint.split(',').slice(1).join(',') || 'Details pending'}
                      </p>
                    </div>

                    {/* Staff */}
                    <div className="col-span-2">
                      {i < 3 ? (
                        <>
                          <p className="text-xs font-medium">Dr. {['Smith', 'Lee', 'Wilson'][i]}</p>
                          <p className="text-[10px] text-muted-foreground">RN {['Jones', 'Davis', 'Triage'][i]}</p>
                        </>
                      ) : (
                        <button className="text-xs text-primary font-medium flex items-center gap-1 hover:underline">
                          <span>+</span> Assign MD
                        </button>
                      )}
                    </div>

                    {/* Wait Time */}
                    <div className="col-span-2 text-right">
                      <span className={cn(
                        'font-vitals text-sm font-semibold',
                        waitMins > 30 && 'text-[hsl(var(--esi-2))]',
                        waitMins > 60 && 'text-[hsl(var(--esi-1))]'
                      )}>
                        {waitMins}m
                      </span>
                      <p className="text-[10px] text-muted-foreground">
                        Total LOS: {Math.floor(waitMins * 1.5)}m
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
        </div>

        {/* Right Column - Active Escalations (3 cols) */}
        <div className="col-span-3 space-y-3">
          {/* Escalations Header */}
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold flex items-center gap-2">
              ACTIVE ESCALATIONS
              <Badge className="h-5 w-5 p-0 flex items-center justify-center bg-[hsl(var(--esi-1))] text-[10px]">
                3
              </Badge>
            </h3>
          </div>
          <p className="text-xs text-muted-foreground -mt-2">Unacknowledged items needing action</p>

          {/* Escalation Cards */}
          <div className="space-y-3">
            <EscalationCard
              type="critical"
              title="Stat Lab Results"
              subtitle="Critical Troponin"
              patientName="DOE, JOHN"
              patientLocation="Bed 04"
              provider="Dr. Smith (Unacknowledged)"
              timeLabel="12m OVER"
              actionLabel="NOTIFY PROVIDER"
            />
            <EscalationCard
              type="warning"
              title="Unsigned Orders"
              subtitle="Pain Medication (PRN)"
              patientName="SMITH, JANE"
              patientLocation="Bed 09"
              provider="Dr. Lee (Unacknowledged)"
              timeLabel="8m OVER"
              actionLabel="NOTIFY PROVIDER"
            />
            <EscalationCard
              type="info"
              title="Triage Alert"
              subtitle="Wait Time Threshold"
              patientName="WILSON, SARAH"
              patientLocation="Waiting Room"
              provider="ESI 4 • Total Wait: 1h 15m"
              timeLabel="2m AGO"
              actionLabel="ASSIGN BED"
            />
          </div>

          {/* Acknowledge All Button */}
          <Button className="w-full gap-2 bg-[hsl(var(--esi-2))] hover:bg-[hsl(var(--esi-2)/0.9)] text-foreground">
            <span>✓</span>
            Acknowledge All
          </Button>
        </div>
      </div>
    </div>
  );
}
