import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { 
  Settings as SettingsIcon, 
  Bell, 
  Clock, 
  Shield, 
  Server,
  CheckCircle2,
  AlertTriangle,
  Info,
  Database
} from 'lucide-react';

export default function Settings() {
  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in-up">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">Settings</h1>
        <p className="text-muted-foreground">
          Configure system preferences and integrations
        </p>
      </div>

      {/* System Status */}
      <Card className="clinical-card border-confidence-high/30 bg-confidence-high/5">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-full bg-confidence-high/10">
                <CheckCircle2 className="h-5 w-5 text-confidence-high" />
              </div>
              <div>
                <p className="font-medium">All Systems Operational</p>
                <p className="text-sm text-muted-foreground">FHIR connection active • AI models healthy</p>
              </div>
            </div>
            <Badge className="bg-confidence-high">Online</Badge>
          </div>
        </CardContent>
      </Card>

      {/* Notification Settings */}
      <Card className="clinical-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Alert Configuration
          </CardTitle>
          <CardDescription>
            Configure when and how alerts are triggered
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>ESI Level 1-2 Push Alerts</Label>
              <p className="text-sm text-muted-foreground">
                Send immediate push notifications for critical cases
              </p>
            </div>
            <Switch defaultChecked />
          </div>
          
          <Separator />
          
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>ESI Level 3-5 Silent Routing</Label>
              <p className="text-sm text-muted-foreground">
                Route lower acuity cases to track board without alerts
              </p>
            </div>
            <Switch defaultChecked />
          </div>
          
          <Separator />
          
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Sound Alerts</Label>
              <p className="text-sm text-muted-foreground">
                Play audio notification for critical alerts
              </p>
            </div>
            <Switch defaultChecked />
          </div>
        </CardContent>
      </Card>

      {/* Escalation Settings */}
      <Card className="clinical-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Escalation Timeouts
          </CardTitle>
          <CardDescription>
            Configure automatic escalation timers for unacknowledged cases
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>ESI Level 1 Timeout</Label>
              <div className="flex items-center gap-2">
                <Input type="number" defaultValue="2" className="w-20 font-vitals" />
                <span className="text-sm text-muted-foreground">minutes</span>
              </div>
            </div>
            <div className="space-y-2">
              <Label>ESI Level 2 Timeout</Label>
              <div className="flex items-center gap-2">
                <Input type="number" defaultValue="5" className="w-20 font-vitals" />
                <span className="text-sm text-muted-foreground">minutes</span>
              </div>
            </div>
          </div>
          
          <div className="p-3 bg-muted/50 rounded-lg flex items-start gap-2">
            <Info className="h-4 w-4 text-muted-foreground mt-0.5" />
            <p className="text-sm text-muted-foreground">
              Unacknowledged cases will automatically escalate to the next provider 
              in the chain after the timeout period expires.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* AI Model Settings */}
      <Card className="clinical-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            AI Model Configuration
          </CardTitle>
          <CardDescription>
            Configure AI triage model behavior
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Enable AI Drafting</Label>
              <p className="text-sm text-muted-foreground">
                Allow AI to generate draft ESI recommendations
              </p>
            </div>
            <Switch defaultChecked />
          </div>
          
          <Separator />
          
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Show Confidence Indicators</Label>
              <p className="text-sm text-muted-foreground">
                Display AI confidence levels and influencing factors
              </p>
            </div>
            <Switch defaultChecked />
          </div>
          
          <Separator />
          
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Generate SBAR Summaries</Label>
              <p className="text-sm text-muted-foreground">
                Automatically generate structured handoff summaries
              </p>
            </div>
            <Switch defaultChecked />
          </div>

          <div className="p-3 bg-esi-2-bg border border-esi-2/20 rounded-lg flex items-start gap-2">
            <AlertTriangle className="h-4 w-4 text-esi-2 mt-0.5" />
            <p className="text-sm">
              <strong>Human-in-the-loop required:</strong> AI cannot finalize triage decisions. 
              Nurse validation is mandatory for all cases.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Integration Status */}
      <Card className="clinical-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Server className="h-5 w-5" />
            Integration Status
          </CardTitle>
          <CardDescription>
            SMART on FHIR and external system connections
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
            <div className="flex items-center gap-3">
              <Database className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="font-medium">FHIR Server</p>
                <p className="text-xs text-muted-foreground">https://fhir.hospital.example/r4</p>
              </div>
            </div>
            <Badge className="bg-confidence-high">Connected</Badge>
          </div>
          
          <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
            <div className="flex items-center gap-3">
              <Server className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="font-medium">EHR Integration</p>
                <p className="text-xs text-muted-foreground">SMART on FHIR v2.0</p>
              </div>
            </div>
            <Badge className="bg-confidence-high">Active</Badge>
          </div>
          
          <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
            <div className="flex items-center gap-3">
              <Shield className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="font-medium">Clinical Extraction Model</p>
                <p className="text-xs text-muted-foreground">Gemini Pro (LLM)</p>
              </div>
            </div>
            <Badge className="bg-confidence-high">Healthy</Badge>
          </div>
          
          <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
            <div className="flex items-center gap-3">
              <Shield className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="font-medium">Acuity Scoring Model</p>
                <p className="text-xs text-muted-foreground">XGBoost Classifier v2.1</p>
              </div>
            </div>
            <Badge className="bg-confidence-high">Healthy</Badge>
          </div>
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button size="lg">Save Settings</Button>
      </div>
    </div>
  );
}
