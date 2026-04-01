import { FinanceProvider } from '@/context/FinanceContext';
import { SummaryCards } from '@/components/dashboard/SummaryCards';
import { BalanceTrend } from '@/components/dashboard/BalanceTrend';
import { SpendingBreakdown } from '@/components/dashboard/SpendingBreakdown';
import { TransactionsTable } from '@/components/dashboard/TransactionsTable';
import { InsightsPanel } from '@/components/dashboard/InsightsPanel';
import { RoleToggle } from '@/components/dashboard/RoleToggle';
import { DarkModeToggle } from '@/components/dashboard/DarkModeToggle';
import { BarChart3 } from 'lucide-react';

const Index = () => {
  return (
    <FinanceProvider>
      <div className="min-h-screen bg-background transition-colors duration-300">
        {/* Header */}
        <header className="border-b bg-card/60 backdrop-blur-md sticky top-0 z-10 transition-colors duration-300">
          <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 py-2.5 sm:py-3 flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <div className="bg-primary text-primary-foreground p-1.5 rounded-lg transition-transform duration-200 hover:scale-110">
                <BarChart3 className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <h1 className="text-base sm:text-lg font-semibold tracking-tight">FinDash</h1>
            </div>
            <div className="flex items-center gap-2">
              <RoleToggle />
              <DarkModeToggle />
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-6 space-y-4 sm:space-y-6">
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
          <TransactionsTable />
        </main>
      </div>
    </FinanceProvider>
  );
};

export default Index;
