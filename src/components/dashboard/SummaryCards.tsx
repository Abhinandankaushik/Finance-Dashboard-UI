import { useFinance } from '@/context/FinanceContext';
import { useCurrency } from '@/context/CurrencyContext';
import { convertCurrency, formatCurrencyDetailed } from '@/utils/currency';
import { TrendingUp, TrendingDown, Wallet } from 'lucide-react';

export function SummaryCards() {
  const { totalBalance, totalIncome, totalExpenses, loading } = useFinance();
  const { currency } = useCurrency();

  const convertAndFormat = (amount: number) => {
    const convertedAmount = convertCurrency(amount, 'USD', currency);
    return formatCurrencyDetailed(convertedAmount, currency, 0);
  };

  const cards = [
    {
      label: 'Total Balance',
      value: convertAndFormat(totalBalance),
      icon: Wallet,
      color: 'text-primary',
      bg: 'bg-primary/10',
    },
    {
      label: 'Income',
      value: convertAndFormat(totalIncome),
      icon: TrendingUp,
      color: 'text-income',
      bg: 'bg-income/10',
    },
    {
      label: 'Expenses',
      value: convertAndFormat(totalExpenses),
      icon: TrendingDown,
      color: 'text-expense',
      bg: 'bg-expense/10',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
      {cards.map((c, i) => (
        <div
          key={c.label}
          className="glass-card rounded-xl p-5 sm:p-6 flex items-start gap-4 sm:gap-5 transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 hover:scale-105 group animate-bounce-in cursor-pointer relative overflow-hidden"
          style={{ animationDelay: `${i * 120}ms`, animationFillMode: 'both' }}
        >
          {/* Animated background gradient effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/10 to-primary/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 animate-gradient-flow" />
          
          {/* Glow effect on hover */}
          <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 group-hover:animate-glow-effect blur-xl pointer-events-none" />
          
          <div className={`${c.bg} ${c.color} p-3 sm:p-4 rounded-lg transition-all duration-500 group-hover:scale-130 group-hover:rotate-12 group-hover:shadow-2xl flex-shrink-0 shadow-md relative z-10`}>
            <c.icon className="w-5 h-5 sm:w-6 sm:h-6 transition-transform duration-500 group-hover:animate-rotate" />
          </div>
          <div className="min-w-0 flex-1 relative z-10">
            <p className="text-xs sm:text-sm text-muted-foreground/80 font-medium uppercase tracking-widest truncate transition-colors duration-300 group-hover:text-muted-foreground">{c.label}</p>
            {loading ? (
              <div className="h-7 sm:h-9 w-24 sm:w-32 bg-gradient-to-r from-muted to-muted/50 rounded-lg animate-shimmer-effect mt-2" />
            ) : (
              <p className="text-xl sm:text-3xl font-bold tracking-tight font-mono mt-2 truncate bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent group-hover:animate-color-shift transition-all duration-300">{c.value}</p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
