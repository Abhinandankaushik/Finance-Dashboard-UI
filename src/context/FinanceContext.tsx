import React, { createContext, useContext, useState, useCallback, useMemo, useEffect } from 'react';
import { Transaction, Role, mockTransactions } from '@/data/Data';
import { api } from '@/services/api';

interface Filters {
  search: string;
  type: 'all' | 'income' | 'expense';
  category: string;
  sortBy: 'date' | 'amount';
  sortDir: 'asc' | 'desc';
}

interface FinanceContextType {
  transactions: Transaction[];
  loading: boolean;
  role: Role;
  setRole: (r: Role) => void;
  filters: Filters;
  setFilters: React.Dispatch<React.SetStateAction<Filters>>;
  filteredTransactions: Transaction[];
  addTransaction: (t: Omit<Transaction, 'id'>) => Promise<void>;
  deleteTransaction: (id: string) => Promise<void>;
  totalBalance: number;
  totalIncome: number;
  totalExpenses: number;
}

const FinanceContext = createContext<FinanceContextType | null>(null);

export function useFinance() {
  const ctx = useContext(FinanceContext);
  if (!ctx) throw new Error('useFinance must be inside FinanceProvider');
  return ctx;
}

export function FinanceProvider({ children }: { children: React.ReactNode }) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState<Role>(() => {
    return (localStorage.getItem('finance_role') as Role) || 'admin';
  });
  const [filters, setFilters] = useState<Filters>({
    search: '',
    type: 'all',
    category: 'all',
    sortBy: 'date',
    sortDir: 'desc',
  });

  // Load via mock API on mount
  useEffect(() => {
    api.getTransactions().then(txns => {
      setTransactions(txns);
      setLoading(false);
    });
  }, []);

  // Persist role
  useEffect(() => {
    localStorage.setItem('finance_role', role);
  }, [role]);

  const addTransaction = useCallback(async (t: Omit<Transaction, 'id'>) => {
    try {
      const newTxn = await api.addTransaction(t);
      setTransactions(prev => {
        const next = [newTxn, ...prev].sort((a, b) => b.date.localeCompare(a.date));
        return next;
      });
    } catch (error) {
      console.error('Error adding transaction:', error);
      const message = error instanceof Error ? error.message : 'Failed to add transaction';
      throw new Error(message);
    }
  }, []);

  const deleteTransaction = useCallback(async (id: string) => {
    try {
      await api.deleteTransaction(id);
      setTransactions(prev => prev.filter(t => t.id !== id));
    } catch (error) {
      console.error('Error deleting transaction:', error);
      const message = error instanceof Error ? error.message : 'Failed to delete transaction';
      throw new Error(message);
    }
  }, []);

  const filteredTransactions = useMemo(() => {
    let result = [...transactions];
    if (filters.search) {
      const q = filters.search.toLowerCase();
      result = result.filter(t =>
        t.description.toLowerCase().includes(q) || t.category.toLowerCase().includes(q)
      );
    }
    if (filters.type !== 'all') {
      result = result.filter(t => t.type === filters.type);
    }
    if (filters.category !== 'all') {
      result = result.filter(t => t.category === filters.category);
    }
    result.sort((a, b) => {
      const mul = filters.sortDir === 'asc' ? 1 : -1;
      if (filters.sortBy === 'date') return mul * a.date.localeCompare(b.date);
      return mul * (a.amount - b.amount);
    });
    return result;
  }, [transactions, filters]);

  const { totalIncome, totalExpenses } = useMemo(() => {
    let inc = 0, exp = 0;
    transactions.forEach(t => {
      if (t.type === 'income') inc += t.amount;
      else exp += t.amount;
    });
    return { totalIncome: inc, totalExpenses: exp };
  }, [transactions]);

  return (
    <FinanceContext.Provider value={{
      transactions, loading, role, setRole, filters, setFilters,
      filteredTransactions, addTransaction, deleteTransaction,
      totalBalance: totalIncome - totalExpenses,
      totalIncome, totalExpenses,
    }}>
      {children}
    </FinanceContext.Provider>
  );
}
