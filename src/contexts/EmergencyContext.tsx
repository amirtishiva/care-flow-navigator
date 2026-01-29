import { createContext, useContext, useState, ReactNode } from 'react';
import { ESILevel } from '@/types/triage';

interface EmergencyContextType {
  isEmergencyMode: boolean;
  criticalPatientId: string | null;
  activateEmergencyMode: (patientId: string) => void;
  deactivateEmergencyMode: () => void;
  checkCriticalState: (esiLevel: ESILevel, isOverdue?: boolean) => boolean;
}

const EmergencyContext = createContext<EmergencyContextType | undefined>(undefined);

export function EmergencyProvider({ children }: { children: ReactNode }) {
  const [isEmergencyMode, setIsEmergencyMode] = useState(false);
  const [criticalPatientId, setCriticalPatientId] = useState<string | null>(null);

  const activateEmergencyMode = (patientId: string) => {
    setIsEmergencyMode(true);
    setCriticalPatientId(patientId);
  };

  const deactivateEmergencyMode = () => {
    setIsEmergencyMode(false);
    setCriticalPatientId(null);
  };

  // Check if a patient state should trigger critical visual mode
  const checkCriticalState = (esiLevel: ESILevel, isOverdue?: boolean): boolean => {
    return esiLevel === 1 || (esiLevel === 2 && isOverdue === true);
  };

  return (
    <EmergencyContext.Provider 
      value={{ 
        isEmergencyMode, 
        criticalPatientId, 
        activateEmergencyMode, 
        deactivateEmergencyMode,
        checkCriticalState 
      }}
    >
      <div className={isEmergencyMode ? 'emergency-state transition-theme' : 'transition-theme'}>
        {children}
      </div>
    </EmergencyContext.Provider>
  );
}

export function useEmergency() {
  const context = useContext(EmergencyContext);
  if (context === undefined) {
    throw new Error('useEmergency must be used within an EmergencyProvider');
  }
  return context;
}
