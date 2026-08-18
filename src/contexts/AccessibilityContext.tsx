import React, { createContext, useContext, useState, useEffect } from 'react';
import { TextSize, AccessibilitySettings } from '../types';

interface AccessibilityContextType {
  settings: AccessibilitySettings;
  textSize: TextSize;
  highContrast: boolean;
  isSpeaking: boolean;
  isSpeechAvailable: boolean;
  setTextSize: (size: TextSize) => void;
  toggleHighContrast: () => void;
  cycleTextSize: () => void;
  speakText: (text: string) => void;
  stopSpeaking: () => void;
}

const AccessibilityContext = createContext<AccessibilityContextType | undefined>(undefined);

const STORAGE_KEY = 'everease_accessibility_settings';

export const AccessibilityProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<AccessibilitySettings>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // Fallback
    }
    return {
      textSize: 'normal', // 18px base for seniors
      highContrast: false,
      readAloudEnabled: false,
    };
  });

  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isSpeechAvailable, setIsSpeechAvailable] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      setIsSpeechAvailable(true);
    }
  }, []);

  // Update HTML root classes and styles for accessibility
  useEffect(() => {
    const root = document.documentElement;
    
    // Remove previous text size classes
    root.classList.remove('text-size-normal', 'text-size-large', 'text-size-xlarge');
    root.classList.add(`text-size-${settings.textSize}`);

    if (settings.highContrast) {
      root.classList.add('high-contrast');
    } else {
      root.classList.remove('high-contrast');
    }

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    } catch {
      // ignore
    }
  }, [settings]);

  const setTextSize = (textSize: TextSize) => {
    setSettings((prev) => ({ ...prev, textSize }));
  };

  const cycleTextSize = () => {
    setSettings((prev) => {
      let nextSize: TextSize = 'normal';
      if (prev.textSize === 'normal') nextSize = 'large';
      else if (prev.textSize === 'large') nextSize = 'xlarge';
      else nextSize = 'normal';
      return { ...prev, textSize: nextSize };
    });
  };

  const toggleHighContrast = () => {
    setSettings((prev) => ({ ...prev, highContrast: !prev.highContrast }));
  };

  const speakText = (text: string) => {
    if (!('speechSynthesis' in window)) return;
    
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.9; // Slower, clearer cadence for seniors
    utterance.pitch = 1.0;
    
    // Try to find a British English voice
    const voices = window.speechSynthesis.getVoices();
    const gbVoice = voices.find(v => v.lang.includes('en-GB') || v.lang.includes('en_GB'));
    if (gbVoice) {
      utterance.voice = gbVoice;
    }

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
  };

  const stopSpeaking = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  return (
    <AccessibilityContext.Provider
      value={{
        settings,
        textSize: settings.textSize || 'normal',
        highContrast: settings.highContrast,
        isSpeaking,
        isSpeechAvailable,
        setTextSize,
        toggleHighContrast,
        cycleTextSize,
        speakText,
        stopSpeaking,
      }}
    >
      {children}
    </AccessibilityContext.Provider>
  );
};

export const useAccessibility = () => {
  const context = useContext(AccessibilityContext);
  if (!context) {
    throw new Error('useAccessibility must be used within an AccessibilityProvider');
  }
  return context;
};
