import { useFinance } from '@/context/FinanceContext';
import { useCurrency } from '@/context/CurrencyContext';
import { convertCurrency, formatCurrencyDetailed } from '@/utils/currency';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { AddTransactionDialog } from './AddTransactionDialog';
import { Search, ArrowUpDown, Trash2, Download, Calendar } from 'lucide-react';
import { useState } from 'react';

const categories = [
  'all', 'Salary', 'Freelance', 'Investments', 'Food & Dining', 'Shopping',
  'Transport', 'Entertainment', 'Utilities', 'Healthcare', 'Education', 'Rent', 'Other',
];

function exportCSV(data: any[]) {
  const headers = ['Date', 'Description', 'Category', 'Type', 'Amount'];
  const rows = data.map(t => [t.date, t.description, t.category, t.type, t.amount]);
  const csv = [headers, ...rows].map(r => r.map((c: any) => `"${c}"`).join(',')).join('\n');
  downloadFile(csv, 'transactions.csv', 'text/csv');
}

function exportJSON(data: any[]) {
  downloadFile(JSON.stringify(data, null, 2), 'transactions.json', 'application/json');
}

function downloadFile(content: string, filename: string, type: string) {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export function TransactionsTable() {
  const { filteredTransactions, filters, setFilters, role, deleteTransaction } = useFinance();
  const { currency } = useCurrency();
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [groupBy, setGroupBy] = useState<'none' | 'category' | 'type'>('none');

  const convertAndFormat = (amount: number) => {
    const convertedAmount = convertCurrency(amount, 'USD', currency);
    return formatCurrencyDetailed(convertedAmount, currency, 2);
  };

  const toggleSort = (key: 'date' | 'amount') => {
    setFilters(p => ({
      ...p,
      sortBy: key,
      sortDir: p.sortBy === key && p.sortDir === 'desc' ? 'asc' : 'desc',
    }));
  };

  // Advanced date filter
  let dateFiltered = filteredTransactions;
  if (dateFrom) dateFiltered = dateFiltered.filter(t => t.date >= dateFrom);
  if (dateTo) dateFiltered = dateFiltered.filter(t => t.date <= dateTo);

  // Grouping
  const grouped = groupBy !== 'none'
    ? dateFiltered.reduce<Record<string, typeof dateFiltered>>((acc, t) => {
        const key = groupBy === 'category' ? t.category : t.type;
        (acc[key] = acc[key] || []).push(t);
        return acc;
      }, {})
    : { 'All': dateFiltered };

  return (
    <div className="glass-card rounded-xl p-5 animate-fade-in" style={{ animationDelay: '0.3s', animationFillMode: 'both' }}>
      <div className="flex flex-col gap-3 mb-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <h3 className="text-sm font-medium text-muted-foreground">Transactions</h3>
          <div className="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-2 w-full sm:w-auto">
            <div className="relative flex-1 sm:flex-initial">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                value={filters.search}
                onChange={e => setFilters(p => ({ ...p, search: e.target.value }))}
                placeholder="Search…"
                className="pl-8 h-8 text-sm w-full sm:w-40 md:w-44"
              />
            </div>
            <Select value={filters.type} onValueChange={v => setFilters(p => ({ ...p, type: v as any }))}>
              <SelectTrigger className="h-8 text-sm flex-1 sm:flex-initial sm:w-24"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="income">Income</SelectItem>
                <SelectItem value="expense">Expense</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filters.category} onValueChange={v => setFilters(p => ({ ...p, category: v }))}>
              <SelectTrigger className="h-8 text-sm flex-1 sm:flex-initial sm:w-28"><SelectValue /></SelectTrigger>
              <SelectContent>
                {categories.map(c => <SelectItem key={c} value={c}>{c === 'all' ? 'All' : c}</SelectItem>)}
              </SelectContent>
            </Select>
            {role === 'admin' && <div className="flex-1 sm:flex-initial"><AddTransactionDialog /></div>}
          </div>
        </div>

        {/* Advanced filters row */}
        <div className="flex flex-col sm:flex-row flex-wrap items-start sm:items-center gap-2">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Calendar className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">From</span>
          </div>
          <Input type="date" value={dateFrom} onChange={e => setDateFrom(e.target.value)} className="h-8 text-sm flex-1 sm:flex-initial sm:w-32" />
          <span className="text-xs text-muted-foreground hidden sm:inline">to</span>
          <Input type="date" value={dateTo} onChange={e => setDateTo(e.target.value)} className="h-8 text-sm flex-1 sm:flex-initial sm:w-32" />

          <Select value={groupBy} onValueChange={v => setGroupBy(v as any)}>
            <SelectTrigger className="h-8 text-sm flex-1 sm:flex-initial sm:w-28"><SelectValue placeholder="Group" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="none">No Grouping</SelectItem>
              <SelectItem value="category">By Category</SelectItem>
              <SelectItem value="type">By Type</SelectItem>
            </SelectContent>
          </Select>

          <div className="ml-0 sm:ml-auto flex gap-1 w-full sm:w-auto">
            <Button variant="outline" size="sm" className="h-8 text-xs gap-1 flex-1 sm:flex-initial" onClick={() => exportCSV(dateFiltered)}>
              <Download className="w-3.5 h-3.5" /> <span className="hidden sm:inline">CSV</span>
            </Button>
            <Button variant="outline" size="sm" className="h-8 text-xs gap-1 flex-1 sm:flex-initial" onClick={() => exportJSON(dateFiltered)}>
              <Download className="w-3.5 h-3.5" /> <span className="hidden sm:inline">JSON</span>
            </Button>
          </div>
        </div>
      </div>

      {Object.entries(grouped).map(([group, txns]) => (
        <div key={group} className="mb-4 last:mb-0">
          {groupBy !== 'none' && (
            <div className="flex flex-col sm:flex-row sm:items-center gap-1 mb-2">
              <h4 className="text-sm font-medium capitalize">{group}</h4>
              <span className="text-xs text-muted-foreground">({txns.length})</span>
              <span className="text-xs font-mono text-muted-foreground sm:ml-auto">
                {convertAndFormat(txns.reduce((s, t) => s + t.amount, 0))}
              </span>
            </div>
          )}
          <div className="overflow-x-auto -mx-5 px-5">
            <table className="w-full text-xs sm:text-sm">
              {group === Object.keys(grouped)[0] && (
                <thead>
                  <tr className="border-b text-muted-foreground">
                    <th className="text-left py-2 px-2 font-medium text-xs cursor-pointer whitespace-nowrap" onClick={() => toggleSort('date')}>
                      <span className="inline-flex items-center gap-1">Date <ArrowUpDown className="w-3 h-3" /></span>
                    </th>
                    <th className="text-left py-2 px-2 font-medium text-xs">Desc</th>
                    <th className="text-left py-2 px-2 font-medium text-xs hidden sm:table-cell">Category</th>
                    <th className="text-right py-2 px-2 font-medium text-xs cursor-pointer whitespace-nowrap" onClick={() => toggleSort('amount')}>
                      <span className="inline-flex items-center gap-1 justify-end">Amt <ArrowUpDown className="w-3 h-3" /></span>
                    </th>
                    {role === 'admin' && <th className="w-8 px-2" />}
                  </tr>
                </thead>
              )}
              <tbody>
                {txns.length === 0 ? (
                  <tr><td colSpan={5} className="text-center py-8 sm:py-12 text-xs sm:text-sm text-muted-foreground">No transactions</td></tr>
                ) : (
                  txns.slice(0, 50).map((t, i) => (
                    <tr key={t.id} className="border-b border-border/50 hover:bg-muted/30 transition-all duration-200"
                        style={{ animationDelay: `${i * 20}ms` }}>
                      <td className="py-2 px-2 font-mono text-xs text-muted-foreground whitespace-nowrap">{t.date}</td>
                      <td className="py-2 px-2 truncate max-w-xs text-xs">{t.description}</td>
                      <td className="py-2 px-2 hidden sm:table-cell">
                        <span className="text-xs bg-secondary px-2 py-0.5 rounded-full whitespace-nowrap">{t.category}</span>
                      </td>
                      <td className={`py-2 px-2 text-right font-mono font-medium text-xs whitespace-nowrap ${t.type === 'income' ? 'text-income' : 'text-expense'}`}>
                        {t.type === 'income' ? '+' : '-'}{convertAndFormat(t.amount).replace(/^-?/, '')}
                      </td>
                      {role === 'admin' && (
                        <td className="py-2 px-2 text-right">
                          <Button variant="ghost" size="icon" className="h-6 w-6 transition-colors" onClick={() => deleteTransaction(t.id)}>
                            <Trash2 className="w-3.5 h-3.5 text-muted-foreground hover:text-expense" />
                          </Button>
                        </td>
                      )}
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      ))}
      {dateFiltered.length > 50 && groupBy === 'none' && (
        <p className="text-xs text-muted-foreground mt-3 text-center">Showing 50 of {dateFiltered.length} transactions</p>
      )}
    </div>
  );
}
