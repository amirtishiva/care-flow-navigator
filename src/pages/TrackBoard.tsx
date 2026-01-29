import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ESIBadge } from '@/components/triage/ESIBadge';
import { VitalsDisplay } from '@/components/triage/VitalsDisplay';
import { SBARDisplay } from '@/components/triage/SBARDisplay';
import { useEmergency } from '@/contexts/EmergencyContext';
import { mockTriageCases } from '@/data/mockData';
import { TriageCase, ESILevel, ESI_RESPONSE_TIMES } from '@/types/triage';
import { 
  Search, 
  Clock, 
  CheckCircle2, 
  AlertTriangle, 
  Bell,
  Filter,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Loader2,
  Play
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { formatDistanceToNow } from 'date-fns';

export default function TrackBoard() {
  const navigate = useNavigate();
  const { activateEmergencyMode, deactivateEmergencyMode, checkCriticalState } = useEmergency();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterESI, setFilterESI] = useState<ESILevel | 'all'>('all');
  const [sortBy, setSortBy] = useState<'esi' | 'time'>('esi');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [selectedCase, setSelectedCase] = useState<TriageCase | null>(null);
  const [isAcknowledging, setIsAcknowledging] = useState(false);

  // Filter and sort cases
  const filteredCases = mockTriageCases
    .filter(c => c.validation) // Only show validated cases
    .filter(c => {
      if (filterESI === 'all') return true;
      return c.validation?.validatedESI === filterESI;
    })
    .filter(c => {
      if (!searchQuery) return true;
      const name = `${c.patient.firstName} ${c.patient.lastName}`.toLowerCase();
      return name.includes(searchQuery.toLowerCase()) || 
             c.patient.mrn.toLowerCase().includes(searchQuery.toLowerCase());
    })
    .sort((a, b) => {
      if (sortBy === 'esi') {
        const esiA = a.validation?.validatedESI || 5;
        const esiB = b.validation?.validatedESI || 5;
        return sortOrder === 'asc' ? esiA - esiB : esiB - esiA;
      } else {
        const timeA = a.patient.arrivalTime.getTime();
        const timeB = b.patient.arrivalTime.getTime();
        return sortOrder === 'asc' ? timeA - timeB : timeB - timeA;
      }
    });

  const toggleSort = (column: 'esi' | 'time') => {
    if (sortBy === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortOrder('asc');
    }
  };

  const handleSelectCase = (triageCase: TriageCase) => {
    setSelectedCase(triageCase);
    const esiLevel = triageCase.validation?.validatedESI;
    if (esiLevel && checkCriticalState(esiLevel)) {
      activateEmergencyMode(triageCase.patient.id);
    }
  };

  const handleCloseDialog = () => {
    setSelectedCase(null);
    deactivateEmergencyMode();
  };

  const handleAcknowledge = () => {
    setIsAcknowledging(true);
    setTimeout(() => {
      setIsAcknowledging(false);
      handleCloseDialog();
      // In real app, this would update the case status
    }, 1500);
  };

  // Stats
  const pendingCount = filteredCases.filter(c => !c.acknowledgedAt).length;
  const criticalCount = filteredCases.filter(c => (c.validation?.validatedESI || 5) <= 2).length;

  const SortIcon = ({ column }: { column: 'esi' | 'time' }) => {
    if (sortBy !== column) return null;
    return sortOrder === 'asc' ? 
      <ChevronUp className="h-4 w-4 ml-1" /> : 
      <ChevronDown className="h-4 w-4 ml-1" />;
  };

  const selectedEsiLevel = selectedCase?.validation?.validatedESI;
  const isSelectedCritical = selectedEsiLevel ? checkCriticalState(selectedEsiLevel) : false;

  return (
    <div className="space-y-6 animate-fade-in-up">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Physician Track Board</h1>
          <p className="text-muted-foreground">
            Manage and acknowledge patient cases by priority
          </p>
        </div>
        <div className="flex items-center gap-4">
          <Badge variant="outline" className="gap-2 py-1.5">
            <Bell className="h-3.5 w-3.5" />
            {pendingCount} Pending
          </Badge>
          {criticalCount > 0 && (
            <Badge className="gap-2 py-1.5 bg-esi-1 text-white pulse-critical">
              <AlertTriangle className="h-3.5 w-3.5" />
              {criticalCount} Critical
            </Badge>
          )}
        </div>
      </div>

      {/* Filters */}
      <Card className="clinical-card">
        <CardContent className="p-4">
          <div className="flex flex-wrap items-center gap-4">
            <div className="relative flex-1 min-w-[200px] max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name or MRN..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
                aria-label="Search patients"
              />
            </div>

            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">ESI Level:</span>
              <div className="flex gap-1" role="group" aria-label="Filter by ESI level">
                <Button
                  variant={filterESI === 'all' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setFilterESI('all')}
                  aria-pressed={filterESI === 'all'}
                >
                  All
                </Button>
                {([1, 2, 3, 4, 5] as ESILevel[]).map((level) => (
                  <Button
                    key={level}
                    variant={filterESI === level ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setFilterESI(level)}
                    aria-pressed={filterESI === level}
                    aria-label={`ESI Level ${level}`}
                    className={cn(
                      filterESI === level && level === 1 && 'bg-esi-1 hover:bg-esi-1/90',
                      filterESI === level && level === 2 && 'bg-esi-2 hover:bg-esi-2/90',
                      filterESI === level && level === 3 && 'bg-esi-3 hover:bg-esi-3/90 text-foreground',
                      filterESI === level && level === 4 && 'bg-esi-4 hover:bg-esi-4/90',
                      filterESI === level && level === 5 && 'bg-esi-5 hover:bg-esi-5/90',
                    )}
                  >
                    {level}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Track Board Table - with horizontal scroll for mobile */}
      <Card className="clinical-card">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead 
                  className="cursor-pointer hover:text-foreground"
                  onClick={() => toggleSort('esi')}
                >
                  <div className="flex items-center">
                    ESI
                    <SortIcon column="esi" />
                  </div>
                </TableHead>
                <TableHead>Patient</TableHead>
                <TableHead className="hidden md:table-cell">Chief Complaint</TableHead>
                <TableHead 
                  className="cursor-pointer hover:text-foreground"
                  onClick={() => toggleSort('time')}
                >
                  <div className="flex items-center">
                    Wait Time
                    <SortIcon column="time" />
                  </div>
                </TableHead>
                <TableHead className="hidden sm:table-cell">Target Response</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCases.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="h-32 text-center">
                    <p className="text-muted-foreground">No cases match your filters</p>
                  </TableCell>
                </TableRow>
              ) : (
                filteredCases.map((triageCase) => {
                  const esiLevel = triageCase.validation?.validatedESI || 3;
                  const waitTime = formatDistanceToNow(triageCase.patient.arrivalTime, { addSuffix: false });
                  const isAcknowledged = !!triageCase.acknowledgedAt;
                  const isCritical = esiLevel <= 2;

                  return (
                    <TableRow 
                      key={triageCase.id}
                      className={cn(
                        'cursor-pointer transition-colors focus-within:bg-accent',
                        isCritical && !isAcknowledged && 'table-row-critical',
                      )}
                      onClick={() => handleSelectCase(triageCase)}
                      tabIndex={0}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          handleSelectCase(triageCase);
                        }
                      }}
                    >
                      <TableCell>
                        <ESIBadge level={esiLevel} size="sm" />
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">
                            {triageCase.patient.lastName}, {triageCase.patient.firstName}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {triageCase.patient.age}yo {triageCase.patient.gender} • {triageCase.patient.mrn}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell className="max-w-xs hidden md:table-cell">
                        <p className="text-sm truncate">{triageCase.patient.chiefComplaint}</p>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1.5">
                          <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                          <span className="font-vitals">{waitTime}</span>
                        </div>
                      </TableCell>
                      <TableCell className="hidden sm:table-cell">
                        <Badge 
                          variant="outline"
                          className={cn(
                            'text-xs',
                            isCritical && 'border-esi-1/30 text-esi-1'
                          )}
                        >
                          {ESI_RESPONSE_TIMES[esiLevel]}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {isAcknowledged ? (
                          <Badge className="bg-confidence-high gap-1">
                            <CheckCircle2 className="h-3 w-3" />
                            <span className="hidden sm:inline">Acknowledged</span>
                            <span className="sm:hidden">Ack</span>
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="gap-1 border-status-pending/30 text-status-pending">
                            <Clock className="h-3 w-3" />
                            Pending
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          size="sm"
                          variant={isAcknowledged ? 'ghost' : 'default'}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleSelectCase(triageCase);
                          }}
                        >
                          {isAcknowledged ? 'View' : 'Review'}
                          <ExternalLink className="h-3.5 w-3.5 ml-1.5" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>
      </Card>

      {/* Case Detail Dialog */}
      <Dialog open={!!selectedCase} onOpenChange={handleCloseDialog}>
        <DialogContent className={cn(
          "max-w-3xl",
          isSelectedCritical && "border-esi-1/50"
        )}>
          <ScrollArea className="max-h-[80vh]">
            {selectedCase && (
              <div className="pr-4">
                <DialogHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <ESIBadge level={selectedCase.validation?.validatedESI || 3} size="lg" />
                      <div>
                        <DialogTitle className="text-xl">
                          {selectedCase.patient.lastName}, {selectedCase.patient.firstName}
                        </DialogTitle>
                        <DialogDescription>
                          {selectedCase.patient.age}yo {selectedCase.patient.gender} • {selectedCase.patient.mrn}
                        </DialogDescription>
                      </div>
                    </div>
                  </div>
                </DialogHeader>

                {/* Critical Alert */}
                {isSelectedCritical && !selectedCase.acknowledgedAt && (
                  <div className="alert-banner-critical mt-4">
                    <AlertTriangle className="h-5 w-5" />
                    <div className="flex-1">
                      <p className="font-semibold">Critical Case - Immediate Action Required</p>
                      <p className="text-sm opacity-80">
                        Target response: {ESI_RESPONSE_TIMES[selectedEsiLevel!]}
                      </p>
                    </div>
                  </div>
                )}

                <div className="space-y-6 py-4">
                  {/* Chief Complaint */}
                  <div className={cn(
                    "p-3 rounded-lg",
                    isSelectedCritical ? "bg-esi-1-bg border border-[hsl(var(--esi-1-border))]" : "bg-muted/50"
                  )}>
                    <p className="text-sm">
                      <span className="font-semibold">Chief Complaint: </span>
                      {selectedCase.patient.chiefComplaint}
                    </p>
                  </div>

                  {/* Vitals */}
                  <div>
                    <h4 className="text-sm font-medium mb-2">Vital Signs</h4>
                    <VitalsDisplay vitals={selectedCase.patient.vitals} layout="compact" />
                  </div>

                  {/* SBAR */}
                  {selectedCase.aiResult && (
                    <div>
                      <h4 className="text-sm font-medium mb-2">SBAR Summary</h4>
                      <SBARDisplay sbar={selectedCase.aiResult.sbar} layout="compact" />
                    </div>
                  )}

                  {/* Allergies & Meds */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <h4 className="text-sm font-medium mb-1">Allergies</h4>
                      {selectedCase.patient.allergies?.length ? (
                        <div className="flex flex-wrap gap-1">
                          {selectedCase.patient.allergies.map((a, i) => (
                            <Badge key={i} variant="destructive" className="text-xs">{a}</Badge>
                          ))}
                        </div>
                      ) : (
                        <p className="text-sm text-muted-foreground">NKDA</p>
                      )}
                    </div>
                    <div>
                      <h4 className="text-sm font-medium mb-1">Current Medications</h4>
                      {selectedCase.patient.medications?.length ? (
                        <p className="text-sm">{selectedCase.patient.medications.join(', ')}</p>
                      ) : (
                        <p className="text-sm text-muted-foreground">None reported</p>
                      )}
                    </div>
                  </div>
                </div>

                <DialogFooter className="mt-4">
                  <Button variant="outline" onClick={handleCloseDialog}>
                    Close
                  </Button>
                  {!selectedCase.acknowledgedAt && (
                    <Button 
                      onClick={handleAcknowledge} 
                      disabled={isAcknowledging} 
                      className={cn("gap-2", isSelectedCritical && "bg-esi-1 hover:bg-esi-1/90")}
                    >
                      {isAcknowledging ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          Acknowledging...
                        </>
                      ) : (
                        <>
                          <Play className="h-4 w-4" />
                          Acknowledge & Start Workup
                        </>
                      )}
                    </Button>
                  )}
                </DialogFooter>
              </div>
            )}
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </div>
  );
}
