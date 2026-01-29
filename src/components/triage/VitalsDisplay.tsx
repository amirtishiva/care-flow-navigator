import { cn } from '@/lib/utils';
import { VitalSigns } from '@/types/triage';
import { Heart, Wind, Thermometer, Droplets, Activity, Gauge } from 'lucide-react';

interface VitalsDisplayProps {
  vitals: VitalSigns;
  compact?: boolean;
}

interface VitalCardProps {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  unit: string;
  status: 'normal' | 'warning' | 'critical';
  compact?: boolean;
}

function VitalCard({ icon, label, value, unit, status, compact }: VitalCardProps) {
  const statusColors = {
    normal: 'text-vitals-normal border-vitals-normal/20 bg-vitals-normal/5',
    warning: 'text-vitals-warning border-vitals-warning/20 bg-vitals-warning/5',
    critical: 'text-vitals-critical border-vitals-critical/20 bg-vitals-critical/5',
  };

  if (compact) {
    return (
      <div className={cn('flex items-center gap-2 rounded-md border px-2 py-1', statusColors[status])}>
        <span className="opacity-70">{icon}</span>
        <span className="font-vitals text-sm font-medium">{value}</span>
        <span className="text-xs opacity-60">{unit}</span>
      </div>
    );
  }

  return (
    <div className={cn('rounded-lg border p-3 transition-all', statusColors[status])}>
      <div className="flex items-center justify-between mb-1">
        <span className="text-xs font-medium opacity-70">{label}</span>
        {icon}
      </div>
      <div className="flex items-baseline gap-1">
        <span className="font-vitals text-2xl font-semibold">{value}</span>
        <span className="text-xs opacity-60">{unit}</span>
      </div>
    </div>
  );
}

function getVitalStatus(type: string, value: number): 'normal' | 'warning' | 'critical' {
  switch (type) {
    case 'hr':
      if (value < 50 || value > 120) return 'critical';
      if (value < 60 || value > 100) return 'warning';
      return 'normal';
    case 'systolic':
      if (value > 180 || value < 90) return 'critical';
      if (value > 140 || value < 100) return 'warning';
      return 'normal';
    case 'rr':
      if (value > 28 || value < 10) return 'critical';
      if (value > 22 || value < 12) return 'warning';
      return 'normal';
    case 'spo2':
      if (value < 90) return 'critical';
      if (value < 95) return 'warning';
      return 'normal';
    case 'temp':
      if (value > 103 || value < 95) return 'critical';
      if (value > 100.4 || value < 97) return 'warning';
      return 'normal';
    case 'pain':
      if (value >= 8) return 'critical';
      if (value >= 5) return 'warning';
      return 'normal';
    default:
      return 'normal';
  }
}

export function VitalsDisplay({ vitals, compact = false }: VitalsDisplayProps) {
  const iconClass = compact ? 'h-3 w-3' : 'h-4 w-4';

  const vitalsData = [
    {
      icon: <Heart className={iconClass} />,
      label: 'Heart Rate',
      value: vitals.heartRate,
      unit: 'bpm',
      status: getVitalStatus('hr', vitals.heartRate),
    },
    {
      icon: <Gauge className={iconClass} />,
      label: 'Blood Pressure',
      value: `${vitals.bloodPressure.systolic}/${vitals.bloodPressure.diastolic}`,
      unit: 'mmHg',
      status: getVitalStatus('systolic', vitals.bloodPressure.systolic),
    },
    {
      icon: <Wind className={iconClass} />,
      label: 'Respiratory Rate',
      value: vitals.respiratoryRate,
      unit: '/min',
      status: getVitalStatus('rr', vitals.respiratoryRate),
    },
    {
      icon: <Droplets className={iconClass} />,
      label: 'SpO2',
      value: vitals.oxygenSaturation,
      unit: '%',
      status: getVitalStatus('spo2', vitals.oxygenSaturation),
    },
    {
      icon: <Thermometer className={iconClass} />,
      label: 'Temperature',
      value: vitals.temperature.toFixed(1),
      unit: '°F',
      status: getVitalStatus('temp', vitals.temperature),
    },
    {
      icon: <Activity className={iconClass} />,
      label: 'Pain Level',
      value: vitals.painLevel,
      unit: '/10',
      status: getVitalStatus('pain', vitals.painLevel),
    },
  ];

  if (compact) {
    return (
      <div className="flex flex-wrap gap-2">
        {vitalsData.map((vital) => (
          <VitalCard key={vital.label} {...vital} compact />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
      {vitalsData.map((vital) => (
        <VitalCard key={vital.label} {...vital} />
      ))}
    </div>
  );
}
