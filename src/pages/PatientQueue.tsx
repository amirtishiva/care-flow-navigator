import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { PatientCard } from '@/components/triage/PatientCard';
import { mockPatients, mockTriageCases, getWaitingPatients } from '@/data/mockData';
import { Patient, ESILevel } from '@/types/triage';
import { Search, Users, Filter, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function PatientQueue() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'waiting' | 'in-triage' | 'validated'>('all');

  const waitingPatients = getWaitingPatients();
  
  // Get all patients with their ESI levels from triage cases
  const patientsWithESI = mockPatients.map(patient => {
    const triageCase = mockTriageCases.find(c => c.patient.id === patient.id);
    return {
      patient,
      esiLevel: triageCase?.validation?.validatedESI || triageCase?.aiResult?.draftESI,
    };
  });

  const filteredPatients = patientsWithESI
    .filter(({ patient }) => {
      if (statusFilter === 'all') return true;
      return patient.status === statusFilter;
    })
    .filter(({ patient }) => {
      if (!searchQuery) return true;
      const name = `${patient.firstName} ${patient.lastName}`.toLowerCase();
      return name.includes(searchQuery.toLowerCase()) || 
             patient.mrn.toLowerCase().includes(searchQuery.toLowerCase());
    });

  return (
    <div className="space-y-6 animate-fade-in-up">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Patient Queue</h1>
          <p className="text-muted-foreground">
            All patients in the emergency department
          </p>
        </div>
        <Button onClick={() => navigate('/intake')}>
          Add New Patient
        </Button>
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
              />
            </div>

            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Status:</span>
              <div className="flex gap-1">
                {(['all', 'waiting', 'in-triage', 'validated'] as const).map((status) => (
                  <Button
                    key={status}
                    variant={statusFilter === status ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setStatusFilter(status)}
                  >
                    {status === 'all' ? 'All' : 
                     status === 'waiting' ? 'Waiting' :
                     status === 'in-triage' ? 'In Triage' : 'Validated'}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <Card className="clinical-card">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-3 rounded-lg bg-status-pending/10">
              <Clock className="h-5 w-5 text-status-pending" />
            </div>
            <div>
              <p className="text-2xl font-bold font-vitals">
                {patientsWithESI.filter(p => p.patient.status === 'waiting').length}
              </p>
              <p className="text-sm text-muted-foreground">Waiting</p>
            </div>
          </CardContent>
        </Card>
        <Card className="clinical-card">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-3 rounded-lg bg-status-active/10">
              <Users className="h-5 w-5 text-status-active" />
            </div>
            <div>
              <p className="text-2xl font-bold font-vitals">
                {patientsWithESI.filter(p => p.patient.status === 'in-triage').length}
              </p>
              <p className="text-sm text-muted-foreground">In Triage</p>
            </div>
          </CardContent>
        </Card>
        <Card className="clinical-card">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-3 rounded-lg bg-status-completed/10">
              <Users className="h-5 w-5 text-status-completed" />
            </div>
            <div>
              <p className="text-2xl font-bold font-vitals">
                {patientsWithESI.filter(p => p.patient.status === 'validated').length}
              </p>
              <p className="text-sm text-muted-foreground">Validated</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Patient List */}
      <div className="space-y-3">
        {filteredPatients.length === 0 ? (
          <Card className="clinical-card">
            <CardContent className="p-8 text-center">
              <Users className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
              <p className="text-muted-foreground">No patients match your filters</p>
            </CardContent>
          </Card>
        ) : (
          filteredPatients.map(({ patient, esiLevel }) => (
            <PatientCard
              key={patient.id}
              patient={patient}
              esiLevel={esiLevel}
              showVitals
              showActions
              actionLabel={
                patient.status === 'waiting' ? 'Start Triage' :
                patient.status === 'in-triage' ? 'Continue Triage' : 'View Details'
              }
              onAction={() => navigate(`/triage/${patient.id}`)}
            />
          ))
        )}
      </div>
    </div>
  );
}
