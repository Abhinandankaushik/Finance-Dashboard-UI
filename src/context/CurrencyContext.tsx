import React, { createContext, useContext, useState, useEffect } from 'react';
import { DEFAULT_CURRENCY, CURRENCY_RATES } from '@/utils/currency';

interface CurrencyContextType {
  currency: string;
  setCurrency: (currency: string) => void;
}

const CurrencyContext = createContext<CurrencyContextType | null>(null);

export function useCurrency() {
  const ctx = useContext(CurrencyContext);
  if (!ctx) throw new Error('useCurrency must be inside CurrencyProvider');
  return ctx;
}

export function CurrencyProvider({ children }: { children: React.ReactNode }) {
  const [currency, setCurrencyState] = useState<string>(() => {
    try {
      const saved = localStorage.getItem('selected_currency');
      if (saved && CURRENCY_RATES[saved]) {
        return saved;
      }
    } catch (error) {
      console.error('Error reading currency from localStorage:', error);
    }
    return DEFAULT_CURRENCY;
  });

  const setCurrency = (newCurrency: string) => {
    // Validate currency is supported
    if (!CURRENCY_RATES[newCurrency]) {
      console.warn(`Unsupported currency: ${newCurrency}, using default`);
      setCurrencyState(DEFAULT_CURRENCY);
      try {
        localStorage.setItem('selected_currency', DEFAULT_CURRENCY);
      } catch (error) {
        console.error('Error saving currency to localStorage:', error);
      }
      return;
    }
    
    setCurrencyState(newCurrency);
    try {
      localStorage.setItem('selected_currency', newCurrency);
    } catch (error) {
      console.error('Error saving currency to localStorage:', error);
    }
  };

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency }}>
      {children}
    </CurrencyContext.Provider>
  );
}
