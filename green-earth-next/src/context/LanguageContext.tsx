'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

interface LanguageContextType {
  isBangla: boolean;
  setIsBangla: (value: boolean) => void;
  t: (en: string, bn: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [isBangla, setIsBanglaState] = useState<boolean>(false);

  useEffect(() => {
    // Load preference from local storage if available
    const saved = localStorage.getItem('isBangla');
    if (saved) {
      setIsBanglaState(saved === 'true');
    }
  }, []);

  const setIsBangla = (value: boolean) => {
    setIsBanglaState(value);
    localStorage.setItem('isBangla', String(value));
  };

  const t = (en: string, bn: string) => {
    return isBangla ? (bn || en) : (en || bn);
  };

  return (
    <LanguageContext.Provider value={{ isBangla, setIsBangla, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
