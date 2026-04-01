import { useMemo } from 'react';
import { useFinance } from '@/context/FinanceContext';
import { TrendingUp, TrendingDown, BarChart3, Calendar } from 'lucide-react';

export function InsightsPanel() {
  const { transactions } = useFinance();

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

  const fmt = (n: number) => '$' + Math.round(n).toLocaleString();

  const cards = [
    {
      icon: BarChart3,
      label: 'Top Spending Category',
      value: insights.topCategory?.[0] || 'N/A',
      sub: insights.topCategory ? fmt(insights.topCategory[1]) : '',
    },
    {
      icon: insights.expChange <= 0 ? TrendingDown : TrendingUp,
      label: 'Spending vs Last Month',
      value: `${insights.expChange >= 0 ? '+' : ''}${insights.expChange.toFixed(1)}%`,
      sub: `${fmt(insights.thisExp)} vs ${fmt(insights.lastExp)}`,
      highlight: insights.expChange > 0 ? 'text-expense' : 'text-income',
    },
    {
      icon: Calendar,
      label: 'Avg. Transaction',
      value: fmt(insights.avgTxn),
      sub: 'Per expense',
    },
  ];

  return (
    <div className="glass-card rounded-xl p-5 sm:p-6">
      <div className="mb-6">
        <h3 className="text-lg sm:text-xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">Key Insights</h3>
        <p className="text-xs sm:text-sm text-muted-foreground mt-1">Track your spending patterns</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
        {cards.map((c, i) => (
          <div 
            key={c.label} 
            className="glass-card-sm flex items-start gap-4 p-4 sm:p-5 rounded-lg group cursor-pointer hover:scale-105 transition-transform duration-300 hover:shadow-lg"
            style={{ animationDelay: `${i * 50}ms` }}
          >
            <div className="bg-primary/15 p-3 rounded-lg group-hover:bg-primary/25 transition-colors duration-300 flex-shrink-0">
              <c.icon className="w-5 h-5 sm:w-6 sm:h-6 text-primary transition-transform duration-300 group-hover:rotate-12" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs sm:text-sm text-muted-foreground/80 font-medium uppercase tracking-wider truncate">{c.label}</p>
              <p className={`text-base sm:text-xl font-bold font-mono mt-2 truncate ${c.highlight || 'text-foreground'}`}>{c.value}</p>
              {c.sub && <p className="text-xs text-muted-foreground/70 mt-1 truncate">{c.sub}</p>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
