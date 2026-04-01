import { useMemo } from 'react';
import { useFinance } from '@/context/FinanceContext';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export function BalanceTrend() {
  const { transactions } = useFinance();

  const data = useMemo(() => {
    const monthly: Record<string, { income: number; expense: number }> = {};
    transactions.forEach(t => {
      const key = t.date.slice(0, 7); // YYYY-MM
      if (!monthly[key]) monthly[key] = { income: 0, expense: 0 };
      if (t.type === 'income') monthly[key].income += t.amount;
      else monthly[key].expense += t.amount;
    });
    const sorted = Object.entries(monthly).sort(([a], [b]) => a.localeCompare(b));
    let balance = 0;
    return sorted.map(([month, v]) => {
      balance += v.income - v.expense;
      const label = new Date(month + '-01').toLocaleDateString('en-US', { month: 'short', year: '2-digit' });
      return { month: label, income: Math.round(v.income), expenses: Math.round(v.expense), balance: Math.round(balance) };
    });
  }, [transactions]);

  return (
    <div className="glass-card rounded-xl p-5">
      <h3 className="text-sm font-medium text-muted-foreground mb-4">Balance Trend</h3>
      <div className="h-48 sm:h-56 md:h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 5, right: 5, bottom: 5, left: -20 }}>
            <defs>
              <linearGradient id="balGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="hsl(220,70%,45%)" stopOpacity={0.3} />
                <stop offset="100%" stopColor="hsl(220,70%,45%)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
            <XAxis dataKey="month" className="text-xs" tick={{ fill: 'hsl(220,10%,50%)', fontSize: 11 }} />
            <YAxis tick={{ fill: 'hsl(220,10%,50%)', fontSize: 11 }} width={40} tickFormatter={v => `$${(v/1000).toFixed(0)}k`} />
            <Tooltip
              contentStyle={{ background: 'hsl(0,0%,100%)', border: '1px solid hsl(220,15%,90%)', borderRadius: 8, fontSize: 12 }}
              formatter={(value: number) => [`$${value.toLocaleString()}`, undefined]}
            />
            <Area type="monotone" dataKey="balance" stroke="hsl(220,70%,45%)" fill="url(#balGrad)" strokeWidth={2} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
