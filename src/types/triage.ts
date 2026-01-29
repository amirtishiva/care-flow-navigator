// Core types for the MedTriage AI system

export type ESILevel = 1 | 2 | 3 | 4 | 5;

export type PatientStatus = 
  | 'waiting' 
  | 'in-triage' 
  | 'pending-validation' 
  | 'validated' 
  | 'assigned' 
  | 'acknowledged' 
  | 'in-treatment' 
  | 'discharged';

export type EscalationStatus = 
  | 'none' 
  | 'pending' 
  | 'level-1' 
  | 'level-2' 
  | 'level-3' 
  | 'resolved';

export interface VitalSigns {
  heartRate: number;
  bloodPressure: { systolic: number; diastolic: number };
  respiratoryRate: number;
  temperature: number;
  oxygenSaturation: number;
  painLevel: number; // 0-10
  timestamp: Date;
}

export interface Patient {
  id: string;
  mrn: string; // Medical Record Number
  firstName: string;
  lastName: string;
  dateOfBirth: Date;
  age: number;
  gender: 'male' | 'female' | 'other';
  chiefComplaint: string;
  arrivalTime: Date;
  vitals: VitalSigns;
  status: PatientStatus;
  isReturning: boolean;
  allergies?: string[];
  medications?: string[];
  medicalHistory?: string[];
  uploadedDocuments?: UploadedDocument[];
}

export interface UploadedDocument {
  id: string;
  name: string;
  type: 'lab-report' | 'discharge-summary' | 'referral' | 'imaging' | 'other';
  uploadedAt: Date;
}

export interface SBARSummary {
  situation: string;
  background: string;
  assessment: string;
  recommendation: string;
}

export interface AITriageResult {
  draftESI: ESILevel;
  confidence: number; // 0-100
  sbar: SBARSummary;
  influencingFactors: InfluencingFactor[];
  extractedSymptoms: string[];
  extractedTimeline: string;
  comorbidities: string[];
  generatedAt: Date;
}

export interface InfluencingFactor {
  factor: string;
  category: 'vital' | 'symptom' | 'history' | 'age' | 'other';
  impact: 'increases' | 'decreases' | 'neutral';
  weight: number; // 0-1
}

export interface TriageValidation {
  patientId: string;
  aiDraftESI: ESILevel;
  validatedESI: ESILevel;
  isOverride: boolean;
  overrideRationale?: OverrideRationale;
  validatedBy: string;
  validatedAt: Date;
  notes?: string;
}

export type OverrideRationale = 
  | 'clinical-judgment'
  | 'additional-findings'
  | 'patient-history'
  | 'vital-change'
  | 'symptom-evolution'
  | 'family-concern'
  | 'other';

export const OVERRIDE_RATIONALE_LABELS: Record<OverrideRationale, string> = {
  'clinical-judgment': 'Clinical judgment based on experience',
  'additional-findings': 'Additional findings during assessment',
  'patient-history': 'Relevant patient history not captured',
  'vital-change': 'Vital signs changed during triage',
  'symptom-evolution': 'Symptoms evolved since AI analysis',
  'family-concern': 'Family/caregiver concern',
  'other': 'Other reason'
};

export interface TriageCase {
  id: string;
  patient: Patient;
  aiResult?: AITriageResult;
  validation?: TriageValidation;
  assignedTo?: ClinicalStaff;
  acknowledgedAt?: Date;
  escalationStatus: EscalationStatus;
  escalationHistory: EscalationEvent[];
  createdAt: Date;
  updatedAt: Date;
}

export interface EscalationEvent {
  id: string;
  fromRole: string;
  toRole: string;
  reason: 'timeout' | 'unavailable' | 'manual';
  timestamp: Date;
}

export interface ClinicalStaff {
  id: string;
  name: string;
  role: 'nurse' | 'physician' | 'senior-physician' | 'charge-nurse';
  zone?: string;
  isAvailable: boolean;
}

export interface Alert {
  id: string;
  caseId: string;
  patient: Patient;
  esiLevel: ESILevel;
  type: 'new-case' | 'escalation' | 'timeout';
  message: string;
  createdAt: Date;
  acknowledgedAt?: Date;
  acknowledgedBy?: string;
}

export const ESI_LABELS: Record<ESILevel, { label: string; description: string }> = {
  1: { label: 'Resuscitation', description: 'Immediate life-saving intervention required' },
  2: { label: 'Emergent', description: 'High risk, confused, severe pain/distress' },
  3: { label: 'Urgent', description: 'Two or more resources needed' },
  4: { label: 'Less Urgent', description: 'One resource needed' },
  5: { label: 'Non-Urgent', description: 'No resources needed' },
};

export const ESI_RESPONSE_TIMES: Record<ESILevel, string> = {
  1: 'Immediate',
  2: '< 10 minutes',
  3: '< 30 minutes',
  4: '< 60 minutes',
  5: '< 120 minutes',
};
