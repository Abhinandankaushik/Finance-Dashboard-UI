import React from 'react';
import { useCurrency } from '@/context/CurrencyContext';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { CURRENCY_SYMBOLS, CURRENCY_NAMES } from '@/utils/currency';
import { Globe } from 'lucide-react';

export function CurrencySelector() {
  const { currency, setCurrency } = useCurrency();

  return (
    <div className="flex items-center gap-2">
      <Globe className="w-4 h-4 text-muted-foreground" />
      <Select value={currency} onValueChange={setCurrency}>
        <SelectTrigger className="w-32 bg-background/50 border-border/50 hover:bg-background/80 transition-colors duration-200">
          <SelectValue placeholder="Select currency" />
        </SelectTrigger>
        <SelectContent className="bg-background border-border/50">
          {Object.entries(CURRENCY_NAMES).map(([code, name]) => (
            <SelectItem key={code} value={code}>
              <span className="font-medium">{code}</span>
              <span className="text-xs text-muted-foreground ml-2">
                {CURRENCY_SYMBOLS[code]}
              </span>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
