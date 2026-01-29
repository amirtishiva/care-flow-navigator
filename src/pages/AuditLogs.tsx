import { useState, useMemo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ESIBadge } from '@/components/triage/ESIBadge';
import { ESILevel } from '@/types/triage';
import { 
  Search, 
  Calendar,
  Download,
  Filter,
  FileText,
  CheckCircle2,
  Edit3,
  AlertTriangle,
  Clock
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { format, subHours, subDays, isToday, isThisWeek, isThisMonth } from 'date-fns';
import { toast } from 'sonner';

interface AuditLogEntry {
  id: string;
  timestamp: Date;
  eventType: 'ai-draft' | 'validation' | 'override' | 'escalation' | 'acknowledgment';
  patientMRN: string;
  patientName: string;
  esiLevel: ESILevel;
  performedBy: string;
  details: string;
}

// Mock audit log data
const mockAuditLogs: AuditLogEntry[] = [
  {
    id: 'log-1',
    timestamp: subHours(new Date(), 0.5),
    eventType: 'validation',
    patientMRN: 'MRN-2024-006',
    patientName: 'Anderson, Lisa',
    esiLevel: 1,
    performedBy: 'Sarah Chen, RN',
    details: 'AI draft ESI 1 confirmed. Stroke protocol initiated.',
  },
  {
    id: 'log-2',
    timestamp: subHours(new Date(), 1),
    eventType: 'ai-draft',
    patientMRN: 'MRN-2024-006',
    patientName: 'Anderson, Lisa',
    esiLevel: 1,
    performedBy: 'AI System',
    details: 'Draft ESI generated. Confidence: 96%. Key factors: Acute neurological changes, BP 185/105.',
  },
  {
    id: 'log-3',
    timestamp: subHours(new Date(), 1.5),
    eventType: 'acknowledgment',
    patientMRN: 'MRN-2024-002',
    patientName: 'Johnson, Sarah',
    esiLevel: 2,
    performedBy: 'Dr. James Wilson',
    details: 'Case acknowledged. Respiratory workup initiated.',
  },
  {
    id: 'log-4',
    timestamp: subHours(new Date(), 2),
    eventType: 'override',
    patientMRN: 'MRN-2024-003',
    patientName: 'Brown, Michael',
    esiLevel: 3,
    performedBy: 'Michael Torres, RN',
    details: 'AI suggested ESI 4, upgraded to ESI 3. Reason: Clinical judgment - fever with abdominal pain warrants higher acuity.',
  },
  {
    id: 'log-5',
    timestamp: subHours(new Date(), 3),
    eventType: 'validation',
    patientMRN: 'MRN-2024-002',
    patientName: 'Johnson, Sarah',
    esiLevel: 2,
    performedBy: 'Sarah Chen, RN',
    details: 'AI draft ESI 2 confirmed. SpO2 89% requires urgent intervention.',
  },
  {
    id: 'log-6',
    timestamp: subHours(new Date(), 4),
    eventType: 'escalation',
    patientMRN: 'MRN-2024-002',
    patientName: 'Johnson, Sarah',
    esiLevel: 2,
    performedBy: 'System',
    details: 'Escalated to senior physician after 5-minute timeout. Original assignee: Dr. Priya Sharma.',
  },
  {
    id: 'log-7',
    timestamp: subDays(new Date(), 1),
    eventType: 'validation',
    patientMRN: 'MRN-2024-004',
    patientName: 'Davis, Emily',
    esiLevel: 4,
    performedBy: 'Emily Watson, RN',
    details: 'AI draft ESI 4 confirmed. Ankle X-ray ordered.',
  },
  {
    id: 'log-8',
    timestamp: subDays(new Date(), 1),
    eventType: 'validation',
    patientMRN: 'MRN-2024-005',
    patientName: 'Wilson, Robert',
    esiLevel: 5,
    performedBy: 'Sarah Chen, RN',
    details: 'AI draft ESI 5 confirmed. Throat culture and symptomatic treatment.',
  },
];

const eventTypeConfig = {
  'ai-draft': { 
    label: 'AI Draft', 
    icon: FileText, 
    color: 'bg-primary/10 text-primary border-primary/20' 
  },
  'validation': { 
    label: 'Validation', 
    icon: CheckCircle2, 
    color: 'bg-confidence-high/10 text-confidence-high border-confidence-high/20' 
  },
  'override': { 
    label: 'Override', 
    icon: Edit3, 
    color: 'bg-esi-2/10 text-esi-2 border-esi-2/20' 
  },
  'escalation': { 
    label: 'Escalation', 
    icon: AlertTriangle, 
    color: 'bg-esi-1/10 text-esi-1 border-esi-1/20' 
  },
  'acknowledgment': { 
    label: 'Acknowledgment', 
    icon: CheckCircle2, 
    color: 'bg-status-active/10 text-status-active border-status-active/20' 
  },
};

export default function AuditLogs() {
  const [searchQuery, setSearchQuery] = useState('');
  const [eventTypeFilter, setEventTypeFilter] = useState<string>('all');
  const [dateRange, setDateRange] = useState('all');

  // Filter logs based on all criteria including date range
  const filteredLogs = useMemo(() => {
    return mockAuditLogs
      .filter(log => {
        // Event type filter
        if (eventTypeFilter !== 'all' && log.eventType !== eventTypeFilter) return false;
        
        // Date range filter
        if (dateRange === 'today' && !isToday(log.timestamp)) return false;
        if (dateRange === 'week' && !isThisWeek(log.timestamp)) return false;
        if (dateRange === 'month' && !isThisMonth(log.timestamp)) return false;
        
        // Search filter
        if (!searchQuery) return true;
        const searchLower = searchQuery.toLowerCase();
        return (
          log.patientName.toLowerCase().includes(searchLower) ||
          log.patientMRN.toLowerCase().includes(searchLower) ||
          log.performedBy.toLowerCase().includes(searchLower) ||
          log.details.toLowerCase().includes(searchLower)
        );
      });
  }, [searchQuery, eventTypeFilter, dateRange]);

  // Stats - calculate from filtered logs
  const allLogs = mockAuditLogs;
  const validationAndOverrideLogs = allLogs.filter(l => l.eventType === 'validation' || l.eventType === 'override');
  const overrideCount = allLogs.filter(l => l.eventType === 'override').length;
  const overrideRate = validationAndOverrideLogs.length > 0 
    ? ((overrideCount / validationAndOverrideLogs.length) * 100).toFixed(1)
    : '0.0';
  const escalationCount = allLogs.filter(l => l.eventType === 'escalation').length;

  const handleExport = () => {
    toast.success('Audit logs exported successfully');
  };

  return (
    <div className="space-y-6 animate-fade-in-up">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Audit Logs</h1>
          <p className="text-muted-foreground">
            Complete record of AI drafts, validations, overrides, and escalations
          </p>
        </div>
        <Button variant="outline" className="gap-2" onClick={handleExport}>
          <Download className="h-4 w-4" />
          Export Logs
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="clinical-card">
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Total Events</p>
            <p className="text-2xl font-bold font-vitals mt-1">{allLogs.length}</p>
          </CardContent>
        </Card>
        <Card className="clinical-card">
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">AI Confirmations</p>
            <p className="text-2xl font-bold font-vitals mt-1 text-confidence-high">
              {allLogs.filter(l => l.eventType === 'validation').length}
            </p>
          </CardContent>
        </Card>
        <Card className="clinical-card">
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Override Rate</p>
            <p className="text-2xl font-bold font-vitals mt-1 text-esi-2">{overrideRate}%</p>
          </CardContent>
        </Card>
        <Card className="clinical-card">
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Escalations</p>
            <p className="text-2xl font-bold font-vitals mt-1 text-esi-1">{escalationCount}</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="clinical-card">
        <CardContent className="p-4">
          <div className="flex flex-wrap items-center gap-4">
            <div className="relative flex-1 min-w-[200px] max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search logs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
                aria-label="Search audit logs"
              />
            </div>

            <Select value={eventTypeFilter} onValueChange={setEventTypeFilter}>
              <SelectTrigger className="w-[180px]" aria-label="Filter by event type">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Event Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Events</SelectItem>
                <SelectItem value="ai-draft">AI Drafts</SelectItem>
                <SelectItem value="validation">Validations</SelectItem>
                <SelectItem value="override">Overrides</SelectItem>
                <SelectItem value="escalation">Escalations</SelectItem>
                <SelectItem value="acknowledgment">Acknowledgments</SelectItem>
              </SelectContent>
            </Select>

            <Select value={dateRange} onValueChange={setDateRange}>
              <SelectTrigger className="w-[150px]" aria-label="Filter by date range">
                <Calendar className="h-4 w-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="today">Today</SelectItem>
                <SelectItem value="week">This Week</SelectItem>
                <SelectItem value="month">This Month</SelectItem>
                <SelectItem value="all">All Time</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Logs Table - with horizontal scroll for mobile */}
      <Card className="clinical-card">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead>Timestamp</TableHead>
                <TableHead>Event</TableHead>
                <TableHead>Patient</TableHead>
                <TableHead>ESI</TableHead>
                <TableHead className="hidden md:table-cell">Performed By</TableHead>
                <TableHead className="hidden lg:table-cell max-w-md">Details</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredLogs.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-32 text-center">
                    <p className="text-muted-foreground">
                      {searchQuery || eventTypeFilter !== 'all' || dateRange !== 'all'
                        ? 'No logs match your filters'
                        : 'No audit logs available'}
                    </p>
                  </TableCell>
                </TableRow>
              ) : (
                filteredLogs.map((log) => {
                  const config = eventTypeConfig[log.eventType];
                  const Icon = config.icon;
                  
                  return (
                    <TableRow key={log.id}>
                      <TableCell className="whitespace-nowrap">
                        <div className="flex items-center gap-1.5 text-sm">
                          <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                          <span>{format(log.timestamp, 'MMM d, h:mm a')}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className={cn('gap-1.5', config.color)}>
                          <Icon className="h-3 w-3" />
                          <span className="hidden sm:inline">{config.label}</span>
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium text-sm">{log.patientName}</p>
                          <p className="text-xs text-muted-foreground font-mono">{log.patientMRN}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <ESIBadge level={log.esiLevel} size="sm" />
                      </TableCell>
                      <TableCell className="text-sm hidden md:table-cell">{log.performedBy}</TableCell>
                      <TableCell className="max-w-md hidden lg:table-cell">
                        <p className="text-sm text-muted-foreground truncate">{log.details}</p>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>
      </Card>
    </div>
  );
}
