import { useFinance } from '@/context/FinanceContext';
import { TrendingUp, TrendingDown, Wallet } from 'lucide-react';

export function SummaryCards() {
  const { totalBalance, totalIncome, totalExpenses, loading } = useFinance();

  const fmt = (n: number) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(n);

  const cards = [
    {
      label: 'Total Balance',
      value: fmt(totalBalance),
      icon: Wallet,
      color: 'text-primary',
      bg: 'bg-primary/10',
    },
    {
      label: 'Income',
      value: fmt(totalIncome),
      icon: TrendingUp,
      color: 'text-income',
      bg: 'bg-income/10',
    },
    {
      label: 'Expenses',
      value: fmt(totalExpenses),
      icon: TrendingDown,
      color: 'text-expense',
      bg: 'bg-expense/10',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
      {cards.map((c, i) => (
        <div
          key={c.label}
          className="glass-card rounded-xl p-4 sm:p-5 flex items-start gap-3 sm:gap-4 transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 animate-count-up"
          style={{ animationDelay: `${i * 80}ms`, animationFillMode: 'both' }}
        >
          <div className={`${c.bg} ${c.color} p-2 sm:p-3 rounded-lg transition-transform duration-200 hover:scale-110 flex-shrink-0`}>
            <c.icon className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs sm:text-sm text-muted-foreground truncate">{c.label}</p>
            {loading ? (
              <div className="h-6 sm:h-8 w-20 sm:w-28 bg-muted rounded animate-pulse mt-1" />
            ) : (
              <p className="text-lg sm:text-2xl font-semibold tracking-tight font-mono mt-1 truncate">{c.value}</p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
