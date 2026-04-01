import { useMemo } from 'react';
import { useFinance } from '@/context/FinanceContext';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

const COLORS = [
  'hsl(220,70%,45%)', 'hsl(152,60%,40%)', 'hsl(4,80%,58%)',
  'hsl(38,92%,50%)', 'hsl(270,60%,55%)', 'hsl(190,70%,45%)',
  'hsl(340,65%,50%)', 'hsl(160,45%,55%)', 'hsl(30,80%,55%)',
];

export function SpendingBreakdown() {
  const { transactions } = useFinance();

  const data = useMemo(() => {
    const byCategory: Record<string, number> = {};
    transactions.filter(t => t.type === 'expense').forEach(t => {
      byCategory[t.category] = (byCategory[t.category] || 0) + t.amount;
    });
    return Object.entries(byCategory)
      .map(([name, value]) => ({ name, value: Math.round(value) }))
      .sort((a, b) => b.value - a.value);
  }, [transactions]);

  const total = data.reduce((s, d) => s + d.value, 0);

  return (
    <div className="glass-card rounded-xl p-4 sm:p-5 lg:p-6">
      <h3 className="text-sm sm:text-base font-semibold text-foreground mb-4 sm:mb-5">Spending Breakdown</h3>
      
      <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
        {/* Chart Section */}
        <div className="flex justify-center lg:justify-start flex-shrink-0">
          <div className="h-40 w-40 sm:h-48 sm:w-48 lg:h-56 lg:w-56">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={data} dataKey="value" cx="50%" cy="50%" outerRadius={60} innerRadius={35} paddingAngle={2}>
                  {data.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(v: number) => [`$${v.toLocaleString()}`, '']} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Legend Section */}
        <div className="flex-1 min-w-0">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
            {data.map((d, i) => {
              const percentage = ((d.value / total) * 100).toFixed(1);
              return (
                <div key={d.name} className="flex items-center gap-3 p-2 sm:p-2.5 rounded-lg bg-secondary/30 hover:bg-secondary/50 transition-colors">
                  <span 
                    className="w-3 h-3 sm:w-3.5 sm:h-3.5 rounded-full flex-shrink-0" 
                    style={{ background: COLORS[i % COLORS.length] }} 
                  />
                  <div className="flex-1 min-w-0">
                    <div className="text-sm sm:text-base font-medium text-foreground break-words">{d.name}</div>
                    <div className="text-xs sm:text-sm text-muted-foreground">
                      ${d.value.toLocaleString()} ({percentage}%)
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
