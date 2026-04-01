import { FinanceProvider } from '@/context/FinanceContext';
import { CurrencyProvider } from '@/context/CurrencyContext';
import { SummaryCards } from '@/components/dashboard/SummaryCards';
import { BalanceTrend } from '@/components/dashboard/BalanceTrend';
import { SpendingBreakdown } from '@/components/dashboard/SpendingBreakdown';
import { TransactionsTable } from '@/components/dashboard/TransactionsTable';
import { InsightsPanel } from '@/components/dashboard/InsightsPanel';
import { MobileNav } from '@/components/MobileNav';
import { BarChart3 } from 'lucide-react';

const Index = () => {
  return (
    <CurrencyProvider>
      <FinanceProvider>
        <div className="min-h-screen bg-gradient-to-b from-background via-background/95 to-background/90">
        {/* Header */}
        <header className="border-b border-border/50 bg-card/40 backdrop-blur-xl sticky top-0 z-10 transition-all duration-300 shadow-sm hover:shadow-md animate-slide-in-down">
          <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 py-3 sm:py-4 flex items-center justify-between gap-2">
            <div className="flex items-center gap-3 group">
              <div className="bg-gradient-to-br from-primary to-primary/80 text-primary-foreground p-2 rounded-lg shadow-lg transition-all duration-300 group-hover:scale-110 group-hover:shadow-xl group-hover:-rotate-3 group-hover:animate-bounce-in">
                <BarChart3 className="w-5 h-5 sm:w-6 sm:h-6 group-hover:animate-rotate" />
              </div>
              <div className="flex flex-col">
                <h1 className="text-lg sm:text-xl font-bold tracking-tight bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent animate-slide-in-left">FinDash</h1>
                <p className="text-xs text-muted-foreground animate-fade-in-scale" style={{ animationDelay: '100ms' }}>Smart Finance Dashboard</p>
              </div>
            </div>
            <MobileNav />
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 py-6 sm:py-8 space-y-6 sm:space-y-8">
          <div className="animate-slide-up-bounce animate-stagger-1">
            <SummaryCards />
          </div>

          <div className="animate-slide-up-bounce animate-stagger-2">
            <BalanceTrend />
          </div>

          <div className="animate-slide-up-bounce animate-stagger-3">
            <SpendingBreakdown />
          </div>

          <div className="animate-slide-up-bounce animate-stagger-4">
            <InsightsPanel />
          </div>

          <div className="animate-slide-up-bounce animate-stagger-5">
            <TransactionsTable />
          </div>
        </main>
      </div>
      </FinanceProvider>
    </CurrencyProvider>
  );
};

export default Index;
