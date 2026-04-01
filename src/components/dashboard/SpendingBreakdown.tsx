import { useMemo } from 'react';
import { useFinance } from '@/context/FinanceContext';
import { useCurrency } from '@/context/CurrencyContext';
import { convertCurrency, formatCurrencyDetailed } from '@/utils/currency';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

const COLORS = [
  'hsl(220,70%,45%)', 'hsl(152,60%,40%)', 'hsl(4,80%,58%)',
  'hsl(38,92%,50%)', 'hsl(270,60%,55%)', 'hsl(190,70%,45%)',
  'hsl(340,65%,50%)', 'hsl(160,45%,55%)', 'hsl(30,80%,55%)',
];

export function SpendingBreakdown() {
  const { transactions } = useFinance();
  const { currency } = useCurrency();

  const convertAndFormat = (amount: number) => {
    const convertedAmount = convertCurrency(amount, 'USD', currency);
    return formatCurrencyDetailed(convertedAmount, currency, 0);
  };

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

  const isMobile = typeof window !== 'undefined' && window.innerWidth < 640;
  const chartRadius = isMobile ? 65 : 70;
  const chartInnerRadius = isMobile ? 40 : 45;

  return (
    <div className="glass-card rounded-xl p-4 sm:p-5 lg:p-6">
      <h3 className="text-sm sm:text-base font-semibold text-foreground mb-4 sm:mb-5">Spending Breakdown</h3>
      
      <div className="flex flex-col gap-4 sm:gap-6">
        {/* Chart Section */}
        <div className="flex justify-center w-full">
          <div style={{ width: 'clamp(220px, 60vw, 320px)', height: 'clamp(220px, 60vw, 320px)' }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie 
                  data={data} 
                  dataKey="value" 
                  cx="50%" 
                  cy="50%" 
                  outerRadius={chartRadius} 
                  innerRadius={chartInnerRadius} 
                  paddingAngle={2}
                >
                  {data.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(v: number) => [convertAndFormat(v), '']}
                  contentStyle={{
                    background: 'hsl(0,0%,100%)',
                    border: '2px solid hsl(217,91%,60%)',
                    borderRadius: 10,
                    fontSize: 12,
                    boxShadow: '0 10px 25px rgba(0,0,0,0.15)',
                    padding: '8px 12px',
                    fontWeight: 500
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Legend Section */}
        <div className="w-full space-y-2 sm:space-y-2.5">
          {data.map((d, i) => {
            const percentage = ((d.value / total) * 100).toFixed(1);
            return (
              <div key={d.name} className="flex items-center gap-3 p-3 sm:p-3.5 rounded-lg bg-secondary/30 hover:bg-secondary/50 transition-all duration-300 hover:shadow-md hover:scale-105">
                <span 
                  className="w-4 h-4 flex-shrink-0 rounded-full" 
                  style={{ background: COLORS[i % COLORS.length] }} 
                />
                <div className="flex-1 min-w-0">
                  <div className="text-sm sm:text-base font-medium text-foreground">{d.name}</div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <span className="text-xs sm:text-sm font-semibold text-blue-600 dark:text-blue-400">{convertAndFormat(d.value)}</span>
                  <span className="text-xs text-muted-foreground bg-secondary/50 px-2 py-0.5 rounded">{percentage}%</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
