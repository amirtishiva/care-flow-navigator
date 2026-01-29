import { 
  Patient, 
  TriageCase, 
  AITriageResult, 
  ClinicalStaff, 
  Alert,
  ESILevel
} from '@/types/triage';

// Helper to create dates relative to now
const minutesAgo = (minutes: number) => new Date(Date.now() - minutes * 60 * 1000);
const yearsAgo = (years: number) => new Date(Date.now() - years * 365 * 24 * 60 * 60 * 1000);

export const mockStaff: ClinicalStaff[] = [
  { id: 'nurse-1', name: 'Sarah Chen, RN', role: 'nurse', zone: 'A', isAvailable: true },
  { id: 'nurse-2', name: 'Michael Torres, RN', role: 'nurse', zone: 'B', isAvailable: true },
  { id: 'nurse-3', name: 'Emily Watson, RN', role: 'charge-nurse', isAvailable: true },
  { id: 'doc-1', name: 'Dr. James Wilson', role: 'physician', zone: 'A', isAvailable: true },
  { id: 'doc-2', name: 'Dr. Priya Sharma', role: 'physician', zone: 'B', isAvailable: true },
  { id: 'doc-3', name: 'Dr. Robert Kim', role: 'senior-physician', isAvailable: true },
];

export const mockPatients: Patient[] = [
  {
    id: 'p-001',
    mrn: 'MRN-2024-001',
    firstName: 'John',
    lastName: 'Martinez',
    dateOfBirth: yearsAgo(67),
    age: 67,
    gender: 'male',
    chiefComplaint: 'Severe chest pain radiating to left arm, shortness of breath',
    arrivalTime: minutesAgo(5),
    vitals: {
      heartRate: 112,
      bloodPressure: { systolic: 165, diastolic: 95 },
      respiratoryRate: 24,
      temperature: 98.6,
      oxygenSaturation: 92,
      painLevel: 9,
      timestamp: minutesAgo(3),
    },
    status: 'in-triage',
    isReturning: false,
    allergies: ['Penicillin'],
    medications: ['Lisinopril', 'Metformin'],
    medicalHistory: ['Hypertension', 'Type 2 Diabetes', 'Hyperlipidemia'],
  },
  {
    id: 'p-002',
    mrn: 'MRN-2024-002',
    firstName: 'Sarah',
    lastName: 'Johnson',
    dateOfBirth: yearsAgo(34),
    age: 34,
    gender: 'female',
    chiefComplaint: 'Difficulty breathing, wheezing, using accessory muscles',
    arrivalTime: minutesAgo(12),
    vitals: {
      heartRate: 105,
      bloodPressure: { systolic: 128, diastolic: 82 },
      respiratoryRate: 28,
      temperature: 99.2,
      oxygenSaturation: 89,
      painLevel: 4,
      timestamp: minutesAgo(10),
    },
    status: 'validated',
    isReturning: true,
    allergies: [],
    medications: ['Albuterol inhaler', 'Fluticasone'],
    medicalHistory: ['Asthma - severe persistent'],
  },
  {
    id: 'p-003',
    mrn: 'MRN-2024-003',
    firstName: 'Michael',
    lastName: 'Brown',
    dateOfBirth: yearsAgo(45),
    age: 45,
    gender: 'male',
    chiefComplaint: 'Abdominal pain, nausea, vomiting for 2 days',
    arrivalTime: minutesAgo(25),
    vitals: {
      heartRate: 88,
      bloodPressure: { systolic: 135, diastolic: 85 },
      respiratoryRate: 18,
      temperature: 100.4,
      oxygenSaturation: 97,
      painLevel: 7,
      timestamp: minutesAgo(22),
    },
    status: 'validated',
    isReturning: false,
    allergies: ['Sulfa drugs'],
    medications: [],
    medicalHistory: ['Appendectomy (2015)'],
  },
  {
    id: 'p-004',
    mrn: 'MRN-2024-004',
    firstName: 'Emily',
    lastName: 'Davis',
    dateOfBirth: yearsAgo(28),
    age: 28,
    gender: 'female',
    chiefComplaint: 'Ankle injury from fall, swelling, unable to bear weight',
    arrivalTime: minutesAgo(45),
    vitals: {
      heartRate: 78,
      bloodPressure: { systolic: 118, diastolic: 72 },
      respiratoryRate: 16,
      temperature: 98.4,
      oxygenSaturation: 99,
      painLevel: 6,
      timestamp: minutesAgo(40),
    },
    status: 'validated',
    isReturning: false,
    allergies: [],
    medications: ['Birth control'],
    medicalHistory: [],
  },
  {
    id: 'p-005',
    mrn: 'MRN-2024-005',
    firstName: 'Robert',
    lastName: 'Wilson',
    dateOfBirth: yearsAgo(52),
    age: 52,
    gender: 'male',
    chiefComplaint: 'Sore throat, mild fever for 3 days',
    arrivalTime: minutesAgo(60),
    vitals: {
      heartRate: 82,
      bloodPressure: { systolic: 122, diastolic: 78 },
      respiratoryRate: 16,
      temperature: 100.1,
      oxygenSaturation: 98,
      painLevel: 3,
      timestamp: minutesAgo(55),
    },
    status: 'validated',
    isReturning: false,
    allergies: [],
    medications: [],
    medicalHistory: [],
  },
  {
    id: 'p-006',
    mrn: 'MRN-2024-006',
    firstName: 'Lisa',
    lastName: 'Anderson',
    dateOfBirth: yearsAgo(71),
    age: 71,
    gender: 'female',
    chiefComplaint: 'Sudden confusion, slurred speech, facial droop',
    arrivalTime: minutesAgo(2),
    vitals: {
      heartRate: 98,
      bloodPressure: { systolic: 185, diastolic: 105 },
      respiratoryRate: 20,
      temperature: 98.8,
      oxygenSaturation: 95,
      painLevel: 2,
      timestamp: minutesAgo(1),
    },
    status: 'waiting',
    isReturning: false,
    allergies: ['Aspirin'],
    medications: ['Warfarin', 'Atorvastatin', 'Metoprolol'],
    medicalHistory: ['Atrial fibrillation', 'Previous TIA', 'Hypertension'],
  },
];

export const generateAITriageResult = (patient: Patient): AITriageResult => {
  // Simulate AI analysis based on patient data
  let draftESI: ESILevel = 3;
  let confidence = 85;
  const factors: AITriageResult['influencingFactors'] = [];

  // Check for critical conditions
  if (patient.vitals.oxygenSaturation < 90) {
    draftESI = 2;
    confidence = 92;
    factors.push({ factor: `SpO2 ${patient.vitals.oxygenSaturation}%`, category: 'vital', impact: 'increases', weight: 0.9 });
  }
  
  if (patient.vitals.heartRate > 100) {
    factors.push({ factor: `HR ${patient.vitals.heartRate} bpm`, category: 'vital', impact: 'increases', weight: 0.6 });
  }

  if (patient.chiefComplaint.toLowerCase().includes('chest pain')) {
    draftESI = 2;
    confidence = 94;
    factors.push({ factor: 'Chest pain with radiation', category: 'symptom', impact: 'increases', weight: 0.95 });
  }

  if (patient.chiefComplaint.toLowerCase().includes('confusion') || 
      patient.chiefComplaint.toLowerCase().includes('slurred')) {
    draftESI = 1;
    confidence = 96;
    factors.push({ factor: 'Acute neurological changes', category: 'symptom', impact: 'increases', weight: 0.98 });
  }

  if (patient.vitals.bloodPressure.systolic > 180) {
    factors.push({ factor: `BP ${patient.vitals.bloodPressure.systolic}/${patient.vitals.bloodPressure.diastolic}`, category: 'vital', impact: 'increases', weight: 0.8 });
  }

  if (patient.age > 65) {
    factors.push({ factor: `Age ${patient.age}`, category: 'age', impact: 'increases', weight: 0.4 });
  }

  if (patient.vitals.painLevel >= 8) {
    factors.push({ factor: `Pain level ${patient.vitals.painLevel}/10`, category: 'symptom', impact: 'increases', weight: 0.7 });
  }

  // Lower severity conditions
  if (patient.chiefComplaint.toLowerCase().includes('sore throat')) {
    draftESI = 5;
    confidence = 88;
  }

  if (patient.chiefComplaint.toLowerCase().includes('ankle') && !patient.chiefComplaint.toLowerCase().includes('open')) {
    draftESI = 4;
    confidence = 91;
  }

  if (patient.chiefComplaint.toLowerCase().includes('abdominal pain')) {
    draftESI = 3;
    confidence = 83;
    factors.push({ factor: 'Abdominal pain with fever', category: 'symptom', impact: 'increases', weight: 0.6 });
  }

  return {
    draftESI,
    confidence,
    sbar: generateSBAR(patient, draftESI),
    influencingFactors: factors,
    extractedSymptoms: extractSymptoms(patient.chiefComplaint),
    extractedTimeline: extractTimeline(patient.chiefComplaint),
    comorbidities: patient.medicalHistory || [],
    generatedAt: new Date(),
  };
};

const generateSBAR = (patient: Patient, esi: ESILevel): AITriageResult['sbar'] => {
  const situation = `${patient.age}yo ${patient.gender} presenting with ${patient.chiefComplaint.toLowerCase()}. Arrived ${getMinutesAgo(patient.arrivalTime)} minutes ago via ${Math.random() > 0.5 ? 'ambulance' : 'walk-in'}.`;
  
  const background = patient.medicalHistory?.length 
    ? `PMH: ${patient.medicalHistory.join(', ')}. Current medications: ${patient.medications?.join(', ') || 'None reported'}. Allergies: ${patient.allergies?.length ? patient.allergies.join(', ') : 'NKDA'}.`
    : `No significant past medical history. Allergies: ${patient.allergies?.length ? patient.allergies.join(', ') : 'NKDA'}.`;

  const assessment = `Vital signs: HR ${patient.vitals.heartRate}, BP ${patient.vitals.bloodPressure.systolic}/${patient.vitals.bloodPressure.diastolic}, RR ${patient.vitals.respiratoryRate}, SpO2 ${patient.vitals.oxygenSaturation}%, Temp ${patient.vitals.temperature}°F. Pain ${patient.vitals.painLevel}/10. Draft ESI Level ${esi} based on ${esi <= 2 ? 'high-risk presentation' : esi === 3 ? 'moderate resource needs' : 'low resource needs'}.`;

  const recommendations: Record<ESILevel, string> = {
    1: 'Immediate resuscitation team activation. Prepare for critical intervention. Notify attending physician stat.',
    2: 'Urgent physician evaluation within 10 minutes. Initiate cardiac monitoring. Prepare for possible intervention.',
    3: 'Physician evaluation within 30 minutes. Consider labs, imaging as indicated by presentation.',
    4: 'Standard evaluation. Single resource anticipated (X-ray, simple laceration repair, etc.).',
    5: 'Non-urgent evaluation. Reassurance, prescription, or simple procedure anticipated.',
  };

  return {
    situation,
    background,
    assessment,
    recommendation: recommendations[esi],
  };
};

const extractSymptoms = (complaint: string): string[] => {
  const symptoms: string[] = [];
  const lower = complaint.toLowerCase();
  
  if (lower.includes('chest pain')) symptoms.push('Chest pain');
  if (lower.includes('shortness of breath') || lower.includes('difficulty breathing')) symptoms.push('Dyspnea');
  if (lower.includes('radiating')) symptoms.push('Radiating pain');
  if (lower.includes('nausea')) symptoms.push('Nausea');
  if (lower.includes('vomiting')) symptoms.push('Vomiting');
  if (lower.includes('wheezing')) symptoms.push('Wheezing');
  if (lower.includes('confusion')) symptoms.push('Altered mental status');
  if (lower.includes('slurred')) symptoms.push('Slurred speech');
  if (lower.includes('facial droop')) symptoms.push('Facial asymmetry');
  if (lower.includes('fever')) symptoms.push('Fever');
  if (lower.includes('swelling')) symptoms.push('Swelling');
  if (lower.includes('pain')) symptoms.push('Pain');
  
  return symptoms.length ? symptoms : ['Chief complaint noted'];
};

const extractTimeline = (complaint: string): string => {
  if (complaint.includes('sudden')) return 'Acute onset';
  if (complaint.includes('2 days')) return 'Onset 2 days ago';
  if (complaint.includes('3 days')) return 'Onset 3 days ago';
  return 'Duration unclear - requires clarification';
};

const getMinutesAgo = (date: Date): number => {
  return Math.round((Date.now() - date.getTime()) / 60000);
};

export const mockTriageCases: TriageCase[] = mockPatients.slice(1).map((patient, index) => {
  const aiResult = generateAITriageResult(patient);
  return {
    id: `case-${index + 1}`,
    patient,
    aiResult,
    validation: patient.status === 'validated' ? {
      patientId: patient.id,
      aiDraftESI: aiResult.draftESI,
      validatedESI: aiResult.draftESI,
      isOverride: false,
      validatedBy: 'Sarah Chen, RN',
      validatedAt: new Date(),
    } : undefined,
    assignedTo: patient.status === 'validated' && aiResult.draftESI <= 3 ? mockStaff[3] : undefined,
    escalationStatus: 'none',
    escalationHistory: [],
    createdAt: patient.arrivalTime,
    updatedAt: new Date(),
  };
});

export const mockAlerts: Alert[] = [
  {
    id: 'alert-1',
    caseId: 'case-1',
    patient: mockPatients[1],
    esiLevel: 2,
    type: 'new-case',
    message: 'ESI Level 2 - Respiratory distress. Requires immediate physician evaluation.',
    createdAt: minutesAgo(8),
  },
];

export const getWaitingPatients = () => mockPatients.filter(p => p.status === 'waiting');
export const getInTriagePatients = () => mockPatients.filter(p => p.status === 'in-triage');
