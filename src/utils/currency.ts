// Currency conversion rates (based on 1 USD)
export const CURRENCY_RATES: Record<string, number> = {
  USD: 1,
  EUR: 0.92,
  GBP: 0.79,
  INR: 93.47,
  JPY: 149.50,
  AUD: 1.52,
  CAD: 1.36,
  CHF: 0.88,
  CNY: 7.24,
  SEK: 10.50,
  NZD: 1.67,
  MXN: 17.05,
  SGD: 1.34,
  HKD: 7.81,
  NOK: 10.68,
};

export const CURRENCY_SYMBOLS: Record<string, string> = {
  USD: '$',
  EUR: '€',
  GBP: '£',
  INR: '₹',
  JPY: '¥',
  AUD: 'A$',
  CAD: 'C$',
  CHF: 'CHF',
  CNY: '¥',
  SEK: 'kr',
  NZD: 'NZ$',
  MXN: '$',
  SGD: 'S$',
  HKD: 'HK$',
  NOK: 'kr',
};

export const CURRENCY_NAMES: Record<string, string> = {
  USD: 'US Dollar',
  EUR: 'Euro',
  GBP: 'British Pound',
  INR: 'Indian Rupee',
  JPY: 'Japanese Yen',
  AUD: 'Australian Dollar',
  CAD: 'Canadian Dollar',
  CHF: 'Swiss Franc',
  CNY: 'Chinese Yuan',
  SEK: 'Swedish Krona',
  NZD: 'New Zealand Dollar',
  MXN: 'Mexican Peso',
  SGD: 'Singapore Dollar',
  HKD: 'Hong Kong Dollar',
  NOK: 'Norwegian Krone',
};

export function convertCurrency(
  amount: number,
  fromCurrency: string,
  toCurrency: string
): number {
  if (fromCurrency === toCurrency) return amount;
  
  // Convert to USD first, then to target currency
  const amountInUSD = amount / (CURRENCY_RATES[fromCurrency] || 1);
  const convertedAmount = amountInUSD * (CURRENCY_RATES[toCurrency] || 1);
  
  return convertedAmount;
}

export function formatCurrency(
  amount: number,
  currency: string,
  decimals: number = 0
): string {
  const symbol = CURRENCY_SYMBOLS[currency] || '$';
  const formatted = Math.abs(amount).toFixed(decimals);
  return `${symbol}${formatted}`;
}

export function formatCurrencyDetailed(
  amount: number,
  currency: string,
  decimals: number = 2
): string {
  const symbol = CURRENCY_SYMBOLS[currency] || '$';
  const isNegative = amount < 0;
  const formatted = Math.abs(amount).toFixed(decimals);
  return `${isNegative ? '-' : ''}${symbol}${formatted}`;
}

export const DEFAULT_CURRENCY = 'INR';
