import { FinanceProvider } from '@/context/FinanceContext';
import { CurrencyProvider } from '@/context/CurrencyContext';
import { SummaryCards } from '@/components/dashboard/SummaryCards';
import { BalanceTrend } from '@/components/dashboard/BalanceTrend';
import { SpendingBreakdown } from '@/components/dashboard/SpendingBreakdown';
import { TransactionsTable } from '@/components/dashboard/TransactionsTable';
import { InsightsPanel } from '@/components/dashboard/InsightsPanel';
import { RoleToggle } from '@/components/dashboard/RoleToggle';
import { DarkModeToggle } from '@/components/dashboard/DarkModeToggle';
import { CurrencySelector } from '@/components/dashboard/CurrencySelector';
import { BarChart3 } from 'lucide-react';

const Index = () => {
  return (
    <CurrencyProvider>
      <FinanceProvider>
        <div className="min-h-screen">
        {/* Header */}
        <header className="border-b border-border/50 bg-card/40 backdrop-blur-xl sticky top-0 z-10 transition-all duration-300 shadow-sm hover:shadow-md">
          <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 py-3 sm:py-4 flex items-center justify-between gap-2">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-br from-primary to-primary/80 text-primary-foreground p-2 rounded-lg shadow-lg transition-all duration-300 hover:scale-110 hover:shadow-xl hover:-rotate-3">
                <BarChart3 className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <div className="flex flex-col">
                <h1 className="text-lg sm:text-xl font-bold tracking-tight bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">FinDash</h1>
                <p className="text-xs text-muted-foreground">Smart Finance Dashboard</p>
              </div>
            </div>
            <div className="flex items-center gap-2 sm:gap-3">
              <CurrencySelector />
              <RoleToggle />
              <DarkModeToggle />
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 py-6 sm:py-8 space-y-6 sm:space-y-8">
          <div className="animate-fade-in" style={{ animationDelay: '0ms', animationFillMode: 'both' }}>
            <SummaryCards />
          </div>

          <div className="animate-fade-in" style={{ animationDelay: '100ms', animationFillMode: 'both' }}>
            <BalanceTrend />
          </div>

          <div className="animate-fade-in" style={{ animationDelay: '150ms', animationFillMode: 'both' }}>
            <SpendingBreakdown />
          </div>

          <div className="animate-fade-in" style={{ animationDelay: '250ms', animationFillMode: 'both' }}>
            <InsightsPanel />
          </div>

          <div className="animate-fade-in" style={{ animationDelay: '300ms', animationFillMode: 'both' }}>
            <TransactionsTable />
          </div>
        </main>
      </div>
      </FinanceProvider>
    </CurrencyProvider>
  );
};

export default Index;
