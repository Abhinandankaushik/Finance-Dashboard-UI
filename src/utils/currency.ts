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
  // Validate inputs
  if (typeof amount !== 'number' || !isFinite(amount)) {
    console.error('Invalid amount for conversion:', amount);
    return 0;
  }
  
  if (fromCurrency === toCurrency) return amount;
  
  const fromRate = CURRENCY_RATES[fromCurrency];
  const toRate = CURRENCY_RATES[toCurrency];
  
  // Validate rates exist and are valid
  if (!fromRate || !toRate || fromRate <= 0 || toRate <= 0) {
    console.error(`Invalid conversion rates: ${fromCurrency}=${fromRate}, ${toCurrency}=${toRate}`);
    return amount; // Return original amount as fallback
  }
  
  // Convert to USD first, then to target currency
  const amountInUSD = amount / fromRate;
  const convertedAmount = amountInUSD * toRate;
  
  return isFinite(convertedAmount) ? convertedAmount : amount;
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
