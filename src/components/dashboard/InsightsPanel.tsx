import { useMemo } from 'react';
import { useFinance } from '@/context/FinanceContext';
import { useCurrency } from '@/context/CurrencyContext';
import { convertCurrency, formatCurrencyDetailed } from '@/utils/currency';
import { TrendingUp, TrendingDown, BarChart3, Calendar } from 'lucide-react';

export function InsightsPanel() {
  const { transactions } = useFinance();
  const { currency } = useCurrency();

  const convertAndFormat = (amount: number) => {
    const convertedAmount = convertCurrency(amount, 'USD', currency);
    return formatCurrencyDetailed(convertedAmount, currency, 0);
  };

  const insights = useMemo(() => {
    // Highest spending category
    const catTotals: Record<string, number> = {};
    transactions.filter(t => t.type === 'expense').forEach(t => {
      catTotals[t.category] = (catTotals[t.category] || 0) + t.amount;
    });
    const topCategory = Object.entries(catTotals).sort((a, b) => b[1] - a[1])[0];

    // Monthly comparison (last 2 months)
    const now = new Date();
    const thisMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
    const prev = new Date(now.getFullYear(), now.getMonth() - 1);
    const lastMonth = `${prev.getFullYear()}-${String(prev.getMonth() + 1).padStart(2, '0')}`;

    let thisExp = 0, lastExp = 0, thisInc = 0, lastInc = 0;
    transactions.forEach(t => {
      const m = t.date.slice(0, 7);
      if (m === thisMonth) { t.type === 'expense' ? thisExp += t.amount : thisInc += t.amount; }
      if (m === lastMonth) { t.type === 'expense' ? lastExp += t.amount : lastInc += t.amount; }
    });

    const expChange = lastExp > 0 ? ((thisExp - lastExp) / lastExp * 100) : 0;
    const avgTxn = transactions.length > 0
      ? transactions.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0) / transactions.filter(t => t.type === 'expense').length
      : 0;

    return { topCategory, thisExp, lastExp, expChange, thisInc, lastInc, avgTxn };
  }, [transactions]);

  const cards = [
    {
      icon: BarChart3,
      label: 'Top Spending Category',
      value: insights.topCategory?.[0] || 'N/A',
      sub: insights.topCategory ? convertAndFormat(insights.topCategory[1]) : '',
    },
    {
      icon: insights.expChange <= 0 ? TrendingDown : TrendingUp,
      label: 'Spending vs Last Month',
      value: `${insights.expChange >= 0 ? '+' : ''}${insights.expChange.toFixed(1)}%`,
      sub: `${convertAndFormat(insights.thisExp)} vs ${convertAndFormat(insights.lastExp)}`,
      highlight: insights.expChange > 0 ? 'text-expense' : 'text-income',
    },
    {
      icon: Calendar,
      label: 'Avg. Transaction',
      value: convertAndFormat(insights.avgTxn),
      sub: 'Per expense',
    },
  ];

  return (
    <div className="glass-card rounded-xl p-5 animate-fade-in-blur" style={{ animationDelay: '0.25s', animationFillMode: 'both' }}>
      <h3 className="text-sm font-medium text-muted-foreground mb-4 animate-slide-in-left">Insights</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
        {cards.map((c, i) => (
          <div key={c.label} className="flex items-start gap-3 p-3 sm:p-4 rounded-lg bg-muted/30 transition-all duration-500 hover:bg-muted/50 hover:shadow-lg hover:scale-105 hover:-translate-y-1 group animate-bounce-in cursor-pointer"
               style={{ animationDelay: `${i * 100}ms`, animationFillMode: 'both' }}>
            <c.icon className="w-4 h-4 sm:w-5 sm:h-5 text-muted-foreground mt-0.5 flex-shrink-0 transition-all duration-300 group-hover:rotate-12 group-hover:scale-125" />
            <div className="min-w-0 flex-1">
              <p className="text-xs text-muted-foreground transition-colors duration-300">{c.label}</p>
              <p className={`text-base sm:text-lg font-semibold font-mono ${c.highlight || ''} truncate transition-all duration-300 group-hover:animate-color-shift`}>{c.value}</p>
              {c.sub && <p className="text-xs text-muted-foreground truncate transition-colors duration-300">{c.sub}</p>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
