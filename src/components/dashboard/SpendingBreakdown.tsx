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

    transactions
      .filter(t => t.type === 'expense')
      .forEach(t => {
        byCategory[t.category] = (byCategory[t.category] || 0) + t.amount;
      });

    return Object.entries(byCategory)
      .map(([name, value]) => ({ name, value: Math.round(value) }))
      .sort((a, b) => b.value - a.value);
  }, [transactions]);

  const total = data.reduce((s, d) => s + d.value, 0);

  return (
    <div className="glass-card rounded-xl p-4 sm:p-5 lg:p-6">
      <h3 className="text-sm sm:text-base font-semibold text-foreground mb-4 sm:mb-5">
        Spending Breakdown
      </h3>

      {/* 🔥 Responsive Layout */}
      <div className="flex flex-col sm:flex-row gap-6 sm:gap-8 lg:gap-10 items-center sm:items-start">

        {/* ================= Chart ================= */}
        <div className="flex justify-center w-full sm:w-auto">
          <div className="w-[clamp(240px,45vw,380px)] h-[clamp(240px,45vw,380px)]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  dataKey="value"
                  nameKey="name"
                  outerRadius={85}
                  innerRadius={50}
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

        {/* ================= Legend ================= */}
        <div className="flex-1 w-full">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">

            {data.map((d, i) => {
              const percentage = ((d.value / total) * 100).toFixed(1);

              return (
                <div
                  key={d.name}
                  className="flex items-center gap-3 p-3 sm:p-3.5 rounded-lg bg-secondary/30 hover:bg-secondary/50 transition-all duration-300 hover:shadow-md hover:scale-[1.02]"
                >
                  {/* Color Dot */}
                  <span
                    className="w-4 h-4 flex-shrink-0 rounded-full"
                    style={{ background: COLORS[i % COLORS.length] }}
                  />

                  {/* Name */}
                  <div className="flex-1 min-w-0">
                    <div className="text-sm sm:text-base font-medium text-foreground truncate">
                      {d.name}
                    </div>
                  </div>

                  {/* Value + % */}
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span className="text-xs sm:text-sm font-semibold text-blue-600 dark:text-blue-400">
                      {convertAndFormat(d.value)}
                    </span>
                    <span className="text-xs text-muted-foreground bg-secondary/50 px-2 py-0.5 rounded">
                      {percentage}%
                    </span>
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