import { useState, useEffect, useCallback } from 'react';

export interface PhysicianSettings {
  pushAlertsEnabled: boolean;
  silentRoutingEnabled: boolean;
  soundAlertsEnabled: boolean;
  esi1Timeout: number;
  esi2Timeout: number;
  aiDraftingEnabled: boolean;
  showConfidenceIndicators: boolean;
  generateSBARSummaries: boolean;
}

const DEFAULT_SETTINGS: PhysicianSettings = {
  pushAlertsEnabled: true,
  silentRoutingEnabled: true,
  soundAlertsEnabled: true,
  esi1Timeout: 2,
  esi2Timeout: 5,
  aiDraftingEnabled: true,
  showConfidenceIndicators: true,
  generateSBARSummaries: true,
};

const STORAGE_KEY = 'physician_settings';

export function usePhysicianSettings() {
  const [settings, setSettings] = useState<PhysicianSettings>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        return { ...DEFAULT_SETTINGS, ...JSON.parse(stored) };
      }
    } catch (e) {
      console.error('Failed to load settings:', e);
    }
    return DEFAULT_SETTINGS;
  });

  const [hasChanges, setHasChanges] = useState(false);
  const [initialSettings, setInitialSettings] = useState<PhysicianSettings>(settings);

  // Track changes
  useEffect(() => {
    const changed = JSON.stringify(settings) !== JSON.stringify(initialSettings);
    setHasChanges(changed);
  }, [settings, initialSettings]);

  const updateSetting = useCallback(<K extends keyof PhysicianSettings>(
    key: K,
    value: PhysicianSettings[K]
  ) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  }, []);

  const saveSettings = useCallback(async () => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
      setInitialSettings(settings);
      setHasChanges(false);
      return true;
    } catch (e) {
      console.error('Failed to save settings:', e);
      return false;
    }
  }, [settings]);

  const resetSettings = useCallback(() => {
    setSettings(DEFAULT_SETTINGS);
    localStorage.removeItem(STORAGE_KEY);
    setInitialSettings(DEFAULT_SETTINGS);
    setHasChanges(false);
  }, []);

  return {
    settings,
    updateSetting,
    saveSettings,
    resetSettings,
    hasChanges,
  };
}
