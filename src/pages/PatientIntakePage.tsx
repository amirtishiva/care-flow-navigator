import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { VitalsDisplay } from '@/components/triage/VitalsDisplay';
import { 
  ArrowLeft, 
  User, 
  Heart, 
  FileUp, 
  Search, 
  CheckCircle2,
  Loader2,
  X,
  File,
  FileText
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { VitalSigns } from '@/types/triage';

interface UploadedFile {
  id: string;
  name: string;
  type: string;
  size: number;
}

export default function PatientIntakePage() {
  const navigate = useNavigate();
  const [step, setStep] = useState<'demographics' | 'vitals' | 'complaint' | 'documents'>('demographics');
  const [isSearching, setIsSearching] = useState(false);
  const [patientFound, setPatientFound] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  
  // Form state
  const [formData, setFormData] = useState({
    mrn: '',
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    gender: '',
    chiefComplaint: '',
    allergies: '',
    medications: '',
    medicalHistory: '',
  });

  const [vitals, setVitals] = useState<VitalSigns>({
    heartRate: 0,
    bloodPressure: { systolic: 0, diastolic: 0 },
    respiratoryRate: 0,
    temperature: 0,
    oxygenSaturation: 0,
    painLevel: 0,
    timestamp: new Date(),
  });

  const handleMRNSearch = () => {
    if (!formData.mrn) return;
    setIsSearching(true);
    
    setTimeout(() => {
      setIsSearching(false);
      if (formData.mrn === 'MRN-2024-002') {
        setPatientFound(true);
        setFormData(prev => ({
          ...prev,
          firstName: 'Sarah',
          lastName: 'Johnson',
          dateOfBirth: '1991-05-15',
          gender: 'female',
          allergies: '',
          medications: 'Albuterol inhaler, Fluticasone',
          medicalHistory: 'Asthma - severe persistent',
        }));
      }
    }, 1000);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    
    const newFiles: UploadedFile[] = Array.from(files).map((file, i) => ({
      id: `file-${Date.now()}-${i}`,
      name: file.name,
      type: file.type,
      size: file.size,
    }));
    
    setUploadedFiles(prev => [...prev, ...newFiles]);
  };

  const removeFile = (id: string) => {
    setUploadedFiles(prev => prev.filter(f => f.id !== id));
  };

  const handleStartTriage = () => {
    navigate('/triage/new-patient');
  };

  const steps = [
    { id: 'demographics', label: 'Demographics', icon: User },
    { id: 'vitals', label: 'Vital Signs', icon: Heart },
    { id: 'complaint', label: 'Chief Complaint', icon: FileText },
    { id: 'documents', label: 'Documents', icon: FileUp },
  ];

  const currentStepIndex = steps.findIndex(s => s.id === step);

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)} className="h-8 w-8">
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-xl font-bold">New Patient Intake</h1>
          <p className="text-sm text-muted-foreground">Register patient and capture initial information</p>
        </div>
      </div>

      {/* Progress Steps */}
      <div className="flex items-center justify-between relative px-4">
        <div className="absolute top-4 left-8 right-8 h-px bg-border" />
        <div 
          className="absolute top-4 left-8 h-px bg-primary transition-all duration-500"
          style={{ width: `calc(${(currentStepIndex / (steps.length - 1)) * 100}% - 2rem)` }}
        />
        
        {steps.map((s, i) => {
          const isActive = s.id === step;
          const isComplete = i < currentStepIndex;
          
          return (
            <button
              key={s.id}
              onClick={() => i <= currentStepIndex && setStep(s.id as typeof step)}
              className="flex flex-col items-center gap-2 z-10"
            >
              <div className={cn(
                'w-8 h-8 rounded-full flex items-center justify-center transition-all text-sm',
                isComplete && 'bg-primary text-primary-foreground',
                isActive && 'bg-primary text-primary-foreground ring-2 ring-primary/30 ring-offset-2 ring-offset-background',
                !isActive && !isComplete && 'bg-muted text-muted-foreground'
              )}>
                {isComplete ? (
                  <CheckCircle2 className="h-4 w-4" />
                ) : (
                  <s.icon className="h-4 w-4" />
                )}
              </div>
              <span className={cn(
                'text-xs font-medium',
                isActive ? 'text-foreground' : 'text-muted-foreground'
              )}>
                {s.label}
              </span>
            </button>
          );
        })}
      </div>

      {/* Step Content */}
      <Card className="clinical-card">
        <CardContent className="p-6">
          {/* Demographics Step */}
          {step === 'demographics' && (
            <div className="space-y-6">
              {/* MRN Search */}
              <div className="p-4 bg-muted/40 rounded-lg border border-border/50">
                <Label className="section-label mb-2 block">Search Existing Patient (Optional)</Label>
                <div className="flex gap-2">
                  <Input
                    placeholder="Enter MRN..."
                    value={formData.mrn}
                    onChange={(e) => setFormData(prev => ({ ...prev, mrn: e.target.value }))}
                    className="max-w-xs input-clinical"
                  />
                  <Button 
                    variant="secondary" 
                    onClick={handleMRNSearch}
                    disabled={isSearching || !formData.mrn}
                    className="gap-2"
                  >
                    {isSearching ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Search className="h-4 w-4" />
                    )}
                    Search
                  </Button>
                </div>
                {patientFound && (
                  <div className="mt-3 flex items-center gap-2 text-sm text-[hsl(var(--confidence-high))]">
                    <CheckCircle2 className="h-4 w-4" />
                    Patient found - data auto-populated
                  </div>
                )}
              </div>

              {/* Patient Info Form */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName" className="text-sm">First Name <span className="text-[hsl(var(--esi-1))]">*</span></Label>
                  <Input
                    id="firstName"
                    value={formData.firstName}
                    onChange={(e) => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
                    placeholder="Enter first name"
                    className="input-clinical"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName" className="text-sm">Last Name <span className="text-[hsl(var(--esi-1))]">*</span></Label>
                  <Input
                    id="lastName"
                    value={formData.lastName}
                    onChange={(e) => setFormData(prev => ({ ...prev, lastName: e.target.value }))}
                    placeholder="Enter last name"
                    className="input-clinical"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dob" className="text-sm">Date of Birth <span className="text-[hsl(var(--esi-1))]">*</span></Label>
                  <Input
                    id="dob"
                    type="date"
                    value={formData.dateOfBirth}
                    onChange={(e) => setFormData(prev => ({ ...prev, dateOfBirth: e.target.value }))}
                    className="input-clinical"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="gender" className="text-sm">Gender <span className="text-[hsl(var(--esi-1))]">*</span></Label>
                  <Select 
                    value={formData.gender} 
                    onValueChange={(v) => setFormData(prev => ({ ...prev, gender: v }))}
                  >
                    <SelectTrigger className="input-clinical">
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Allergies */}
              <div className="space-y-2">
                <Label htmlFor="allergies" className="text-sm">Known Allergies</Label>
                <Input
                  id="allergies"
                  value={formData.allergies}
                  onChange={(e) => setFormData(prev => ({ ...prev, allergies: e.target.value }))}
                  placeholder="e.g., Penicillin, Sulfa drugs (or NKDA)"
                  className="input-clinical"
                />
              </div>

              {/* Navigation */}
              <div className="flex justify-end pt-2">
                <Button onClick={() => setStep('vitals')}>
                  Continue to Vitals
                </Button>
              </div>
            </div>
          )}

          {/* Vitals Step */}
          {step === 'vitals' && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label className="section-label">Heart Rate (bpm)</Label>
                  <Input
                    type="number"
                    value={vitals.heartRate || ''}
                    onChange={(e) => setVitals(prev => ({ ...prev, heartRate: +e.target.value }))}
                    placeholder="72"
                    className="input-vitals"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="section-label">Systolic BP (mmHg)</Label>
                  <Input
                    type="number"
                    value={vitals.bloodPressure.systolic || ''}
                    onChange={(e) => setVitals(prev => ({ 
                      ...prev, 
                      bloodPressure: { ...prev.bloodPressure, systolic: +e.target.value }
                    }))}
                    placeholder="120"
                    className="input-vitals"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="section-label">Diastolic BP (mmHg)</Label>
                  <Input
                    type="number"
                    value={vitals.bloodPressure.diastolic || ''}
                    onChange={(e) => setVitals(prev => ({ 
                      ...prev, 
                      bloodPressure: { ...prev.bloodPressure, diastolic: +e.target.value }
                    }))}
                    placeholder="80"
                    className="input-vitals"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="section-label">Respiratory Rate (/min)</Label>
                  <Input
                    type="number"
                    value={vitals.respiratoryRate || ''}
                    onChange={(e) => setVitals(prev => ({ ...prev, respiratoryRate: +e.target.value }))}
                    placeholder="16"
                    className="input-vitals"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="section-label">SpO2 (%)</Label>
                  <Input
                    type="number"
                    value={vitals.oxygenSaturation || ''}
                    onChange={(e) => setVitals(prev => ({ ...prev, oxygenSaturation: +e.target.value }))}
                    placeholder="98"
                    className="input-vitals"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="section-label">Temperature (°F)</Label>
                  <Input
                    type="number"
                    step="0.1"
                    value={vitals.temperature || ''}
                    onChange={(e) => setVitals(prev => ({ ...prev, temperature: +e.target.value }))}
                    placeholder="98.6"
                    className="input-vitals"
                  />
                </div>
              </div>

              {/* Pain Level Slider */}
              <div className="space-y-3">
                <Label className="section-label">Pain Level (0-10)</Label>
                <div className="flex items-center gap-4">
                  <input
                    type="range"
                    min="0"
                    max="10"
                    value={vitals.painLevel}
                    onChange={(e) => setVitals(prev => ({ ...prev, painLevel: +e.target.value }))}
                    className="flex-1 h-2 rounded-full appearance-none bg-muted cursor-pointer accent-primary"
                  />
                  <span className={cn(
                    'font-vitals text-2xl font-bold w-10 text-center',
                    vitals.painLevel >= 7 && 'text-[hsl(var(--esi-1))]',
                    vitals.painLevel >= 4 && vitals.painLevel < 7 && 'text-[hsl(var(--esi-2))]'
                  )}>
                    {vitals.painLevel}
                  </span>
                </div>
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>No Pain</span>
                  <span>Worst Pain</span>
                </div>
              </div>

              {/* Preview */}
              {vitals.heartRate > 0 && (
                <div className="p-4 bg-muted/30 rounded-lg border border-border/50">
                  <Label className="section-label mb-3 block">Vitals Preview</Label>
                  <VitalsDisplay vitals={vitals} />
                </div>
              )}

              {/* Navigation */}
              <div className="flex justify-between pt-2">
                <Button variant="outline" onClick={() => setStep('demographics')}>
                  Back
                </Button>
                <Button onClick={() => setStep('complaint')}>
                  Continue to Chief Complaint
                </Button>
              </div>
            </div>
          )}

          {/* Chief Complaint Step */}
          {step === 'complaint' && (
            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="chiefComplaint" className="text-sm">Chief Complaint <span className="text-[hsl(var(--esi-1))]">*</span></Label>
                <Textarea
                  id="chiefComplaint"
                  value={formData.chiefComplaint}
                  onChange={(e) => setFormData(prev => ({ ...prev, chiefComplaint: e.target.value }))}
                  placeholder="Describe the patient's primary reason for visit, symptoms, and relevant history..."
                  rows={4}
                  className="input-clinical resize-none"
                />
                <p className="text-xs text-muted-foreground">
                  Include onset, duration, severity, and any associated symptoms
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="medications" className="text-sm">Current Medications</Label>
                <Textarea
                  id="medications"
                  value={formData.medications}
                  onChange={(e) => setFormData(prev => ({ ...prev, medications: e.target.value }))}
                  placeholder="List current medications, dosages, and frequency..."
                  rows={2}
                  className="input-clinical resize-none"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="medicalHistory" className="text-sm">Relevant Medical History</Label>
                <Textarea
                  id="medicalHistory"
                  value={formData.medicalHistory}
                  onChange={(e) => setFormData(prev => ({ ...prev, medicalHistory: e.target.value }))}
                  placeholder="Previous conditions, surgeries, chronic illnesses..."
                  rows={2}
                  className="input-clinical resize-none"
                />
              </div>

              {/* Navigation */}
              <div className="flex justify-between pt-2">
                <Button variant="outline" onClick={() => setStep('vitals')}>
                  Back
                </Button>
                <Button onClick={() => setStep('documents')}>
                  Continue to Documents
                </Button>
              </div>
            </div>
          )}

          {/* Documents Step */}
          {step === 'documents' && (
            <div className="space-y-6">
              <div className="border border-dashed border-border/70 rounded-lg p-8 text-center bg-muted/20">
                <FileUp className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
                <h3 className="font-medium mb-1">Upload Medical Documents</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Lab reports, discharge summaries, referrals, imaging results
                </p>
                <label>
                  <input
                    type="file"
                    multiple
                    accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                  <Button variant="secondary" asChild>
                    <span>Choose Files</span>
                  </Button>
                </label>
              </div>

              {/* Uploaded Files */}
              {uploadedFiles.length > 0 && (
                <div className="space-y-2">
                  <Label className="section-label">Uploaded Files</Label>
                  <div className="space-y-2">
                    {uploadedFiles.map((file) => (
                      <div 
                        key={file.id} 
                        className="flex items-center justify-between p-3 bg-muted/30 rounded-lg border border-border/50"
                      >
                        <div className="flex items-center gap-3">
                          <File className="h-4 w-4 text-muted-foreground" />
                          <div>
                            <p className="text-sm font-medium">{file.name}</p>
                            <p className="text-xs text-muted-foreground">
                              {(file.size / 1024).toFixed(1)} KB
                            </p>
                          </div>
                        </div>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => removeFile(file.id)}
                          className="h-7 w-7 text-muted-foreground hover:text-foreground"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Navigation */}
              <div className="flex justify-between pt-2">
                <Button variant="outline" onClick={() => setStep('complaint')}>
                  Back
                </Button>
                <Button onClick={handleStartTriage} className="gap-2">
                  <CheckCircle2 className="h-4 w-4" />
                  Complete & Start Triage
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
