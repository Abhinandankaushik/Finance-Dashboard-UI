import { useMemo } from 'react';
import { useFinance } from '@/context/FinanceContext';
import { useCurrency } from '@/context/CurrencyContext';
import { convertCurrency, formatCurrencyDetailed } from '@/utils/currency';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { TrendingUp, Wallet, ArrowUp, ArrowDown } from 'lucide-react';

export function BalanceTrend() {
  const { transactions } = useFinance();
  const { currency } = useCurrency();

  const convertAndFormat = (amount: number) => {
    const convertedAmount = convertCurrency(amount, 'USD', currency);
    return formatCurrencyDetailed(convertedAmount, currency, 0);
  };

  const abbreviateAmount = (amount: number) => {
    const convertedAmount = convertCurrency(amount, 'USD', currency);
    if (convertedAmount >= 1000000) {
      return `${(convertedAmount / 1000000).toFixed(0)}M`;
    } else if (convertedAmount >= 100000) {
      return `${(convertedAmount / 100000).toFixed(0)}L`;
    } else if (convertedAmount >= 1000) {
      return `${(convertedAmount / 1000).toFixed(0)}K`;
    }
    return convertedAmount.toFixed(0);
  };

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

  const stats = useMemo(() => {
    if (data.length === 0) return { current: 0, highest: 0, lowest: 0, change: 0 };
    const balances = data.map(d => d.balance);
    const current = balances[balances.length - 1];
    const highest = Math.max(...balances);
    const lowest = Math.min(...balances);
    const change = data.length > 1 ? current - data[0].balance : 0;
    return { current, highest, lowest, change };
  }, [data]);

  return (
    <div className="glass-card rounded-xl p-5 sm:p-6 lg:p-7 animate-fadeIn">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 sm:mb-6">
        <div className="flex items-center gap-2">
          <div className="bg-gradient-to-br from-blue-400 to-blue-600 p-2 rounded-lg">
            <TrendingUp className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-semibold">Balance Trend</h3>
            <p className="text-xs text-muted-foreground">Monthly balance overview</p>
          </div>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 mb-4 sm:mb-6">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 rounded-lg p-3 sm:p-4">
          <div className="flex items-center gap-2 mb-2">
            <Wallet className="w-4 h-4 text-blue-600 dark:text-blue-400 flex-shrink-0" />
            <p className="text-xs text-muted-foreground whitespace-nowrap truncate">Balance</p>
          </div>
          <p className="text-sm sm:text-base font-bold text-blue-600 dark:text-blue-400 truncate">{convertAndFormat(stats.current)}</p>
        </div>
        <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950 dark:to-green-900 rounded-lg p-3 sm:p-4">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-4 h-4 text-green-600 dark:text-green-400 flex-shrink-0" />
            <p className="text-xs text-muted-foreground whitespace-nowrap truncate">Highest</p>
          </div>
          <p className="text-sm sm:text-base font-bold text-green-600 dark:text-green-400 truncate">{convertAndFormat(stats.highest)}</p>
        </div>
        <div className="bg-gradient-to-br from-red-50 to-red-100 dark:from-red-950 dark:to-red-900 rounded-lg p-3 sm:p-4">
          <div className="flex items-center gap-2 mb-2">
            <ArrowDown className="w-4 h-4 text-red-600 dark:text-red-400 flex-shrink-0" />
            <p className="text-xs text-muted-foreground whitespace-nowrap truncate">Lowest</p>
          </div>
          <p className="text-sm sm:text-base font-bold text-red-600 dark:text-red-400 truncate">{convertAndFormat(stats.lowest)}</p>
        </div>
        <div className={`bg-gradient-to-br ${stats.change >= 0 ? 'from-emerald-50 to-emerald-100 dark:from-emerald-950 dark:to-emerald-900' : 'from-orange-50 to-orange-100 dark:from-orange-950 dark:to-orange-900'} rounded-lg p-3 sm:p-4`}>
          <div className="flex items-center gap-2 mb-2">
            {stats.change >= 0 ? (
              <ArrowUp className="w-4 h-4 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
            ) : (
              <ArrowDown className="w-4 h-4 text-orange-600 dark:text-orange-400 flex-shrink-0" />
            )}
            <p className="text-xs text-muted-foreground whitespace-nowrap truncate">Change</p>
          </div>
          <p className={`text-sm sm:text-base font-bold truncate ${stats.change >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-orange-600 dark:text-orange-400'}`}>
            {stats.change >= 0 ? '+' : ''} {convertAndFormat(Math.abs(stats.change)).replace(/^-?/, '')}
          </p>
        </div>
      </div>

      {/* Chart */}
      <div className="w-full flex justify-center items-center animate-fadeIn" style={{ height: 'clamp(240px, 50vh, 400px)', animationDelay: '100ms' }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 20, right: 0, bottom: 10, left: 0 }}>
            <defs>
              <linearGradient id="balGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="hsl(217,91%,60%)" stopOpacity={0.4} />
                <stop offset="100%" stopColor="hsl(217,91%,60%)" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="incomeGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="hsl(142,71%,45%)" stopOpacity={0.2} />
                <stop offset="100%" stopColor="hsl(142,71%,45%)" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="expenseGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="hsl(0,84%,60%)" stopOpacity={0.2} />
                <stop offset="100%" stopColor="hsl(0,84%,60%)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(220,13%,91%)" className="dark:stroke-border" opacity={0.5} />
            <XAxis 
              dataKey="month" 
              className="text-xs"
              tick={{ fill: 'hsl(220,10%,50%)', fontSize: 11 }}
              axisLine={{ stroke: 'hsl(220,13%,91%)' }}
              height={25}
            />
            <YAxis 
              tick={{ fill: 'hsl(220,10%,50%)', fontSize: 12 }}
              axisLine={{ stroke: 'hsl(220,13%,91%)' }}
              width={45}
              tickFormatter={v => abbreviateAmount(v)}
            />
            <Tooltip
              contentStyle={{ 
                background: 'hsl(0,0%,100%)',
                border: '2px solid hsl(217,91%,60%)',
                borderRadius: 12,
                fontSize: 12,
                boxShadow: '0 10px 25px rgba(0,0,0,0.15)',
                padding: '10px 14px'
              }}
              labelStyle={{ color: 'hsl(220,13%,13%)', fontSize: 12, fontWeight: 'bold' }}
              formatter={(value: number, name: string) => {
                const names: Record<string, string> = {
                  balance: 'Balance',
                  income: 'Income',
                  expenses: 'Expenses'
                };
                return [convertAndFormat(value), names[name] || name];
              }}
              cursor={{ stroke: 'hsl(217,91%,60%)', strokeWidth: 2, opacity: 0.1 }}
            />
            <Legend 
              wrapperStyle={{ paddingTop: '12px', fontSize: '12px', fontWeight: 500 }}
              iconType="line"
              height={20}
            />
            <Area 
              type="monotone" 
              dataKey="income" 
              stroke="hsl(142,71%,45%)" 
              fill="url(#incomeGrad)" 
              strokeWidth={2}
              isAnimationActive={true}
              animationDuration={800}
              dot={false}
            />
            <Area 
              type="monotone" 
              dataKey="expenses" 
              stroke="hsl(0,84%,60%)" 
              fill="url(#expenseGrad)" 
              strokeWidth={2}
              isAnimationActive={true}
              animationDuration={800}
              dot={false}
            />
            <Area 
              type="monotone" 
              dataKey="balance" 
              stroke="hsl(217,91%,60%)" 
              fill="url(#balGrad)" 
              strokeWidth={3}
              isAnimationActive={true}
              animationDuration={800}
              dot={false}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
