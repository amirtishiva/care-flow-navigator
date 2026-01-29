import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useEffect } from 'react';
import { Session } from '@supabase/supabase-js';

interface CriticalCase {
  id: string;
  patientId: string;
  patientName: string;
  mrn: string;
  esiLevel: number;
  chiefComplaint: string;
  status: string;
  escalationStatus: string;
  createdAt: string;
  waitTimeMinutes: number;
}

interface CriticalAlertsResponse {
  cases: CriticalCase[];
  count: number;
}

interface UseCriticalAlertsOptions {
  session?: Session | null;
}

export function useCriticalAlerts(options?: UseCriticalAlertsOptions) {
  const queryClient = useQueryClient();
  const isAuthenticated = !!options?.session?.access_token;

  const query = useQuery({
    queryKey: ['critical-alerts'],
    queryFn: async (): Promise<CriticalAlertsResponse> => {
      const { data, error } = await supabase
        .from('triage_cases')
        .select(`
          id,
          patient_id,
          validated_esi,
          status,
          escalation_status,
          created_at,
          patients!inner (
            first_name,
            last_name,
            mrn,
            chief_complaint
          )
        `)
        .in('validated_esi', ['1', '2'])
        .in('status', ['validated', 'assigned'])
        .neq('status', 'acknowledged')
        .order('validated_esi', { ascending: true })
        .order('created_at', { ascending: true });

      if (error) {
        throw new Error(error.message);
      }

      const now = Date.now();
      const cases: CriticalCase[] = (data || []).map((tc: any) => ({
        id: tc.id,
        patientId: tc.patient_id,
        patientName: `${tc.patients.last_name}, ${tc.patients.first_name}`,
        mrn: tc.patients.mrn,
        esiLevel: parseInt(tc.validated_esi),
        chiefComplaint: tc.patients.chief_complaint,
        status: tc.status,
        escalationStatus: tc.escalation_status,
        createdAt: tc.created_at,
        waitTimeMinutes: Math.floor((now - new Date(tc.created_at).getTime()) / 60000),
      }));

      return {
        cases,
        count: cases.length,
      };
    },
    enabled: isAuthenticated,
    refetchInterval: isAuthenticated ? 15000 : false, // Refresh every 15 seconds for critical cases
    staleTime: 5000,
  });

  // Real-time subscription for critical case updates
  useEffect(() => {
    if (!isAuthenticated) return;

    const channel = supabase
      .channel('critical-alerts-updates')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'triage_cases',
          filter: 'validated_esi=in.(1,2)',
        },
        () => {
          queryClient.invalidateQueries({ queryKey: ['critical-alerts'] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient, isAuthenticated]);

  return query;
}
