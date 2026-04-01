import { Transaction, mockTransactions } from '@/data/Data';

// Simulates API latency
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const api = {
  async getTransactions(): Promise<Transaction[]> {
    await delay(300);
    const saved = localStorage.getItem('finance_transactions');
    return saved ? JSON.parse(saved) : mockTransactions;
  },

  async addTransaction(t: Omit<Transaction, 'id'>): Promise<Transaction> {
    await delay(200);
    const newTxn: Transaction = { ...t, id: crypto.randomUUID() };
    const current = await this.getTransactions();
    const updated = [newTxn, ...current].sort((a, b) => b.date.localeCompare(a.date));
    localStorage.setItem('finance_transactions', JSON.stringify(updated));
    return newTxn;
  },

  async deleteTransaction(id: string): Promise<void> {
    await delay(150);
    const current = await this.getTransactions();
    const updated = current.filter(t => t.id !== id);
    localStorage.setItem('finance_transactions', JSON.stringify(updated));
  },
};
