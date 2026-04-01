import { Transaction, mockTransactions } from '@/data/Data';

// Simulates API latency
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

class APIError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'APIError';
  }
}

export const api = {
  async getTransactions(): Promise<Transaction[]> {
    try {
      await delay(300);
      const saved = localStorage.getItem('finance_transactions');
      if (!saved) return mockTransactions;
      
      const parsed = JSON.parse(saved);
      if (!Array.isArray(parsed)) {
        throw new APIError('Invalid transactions data format');
      }
      return parsed;
    } catch (error) {
      if (error instanceof SyntaxError) {
        console.error('Failed to parse stored transactions:', error);
        localStorage.removeItem('finance_transactions');
        return mockTransactions;
      }
      throw error;
    }
  },

  async addTransaction(t: Omit<Transaction, 'id'>): Promise<Transaction> {
    try {
      // Validate input
      if (!t.description?.trim()) {
        throw new APIError('Description is required');
      }
      if (typeof t.amount !== 'number' || t.amount < 0) {
        throw new APIError('Amount must be a positive number');
      }
      if (!t.date) {
        throw new APIError('Date is required');
      }
      if (!/^\d{4}-\d{2}-\d{2}$/.test(t.date)) {
        throw new APIError('Invalid date format');
      }
      if (!['income', 'expense'].includes(t.type)) {
        throw new APIError('Invalid transaction type');
      }

      await delay(200);
      const newTxn: Transaction = { ...t, id: crypto.randomUUID() };
      const current = await this.getTransactions();
      const updated = [newTxn, ...current].sort((a, b) => b.date.localeCompare(a.date));
      localStorage.setItem('finance_transactions', JSON.stringify(updated));
      return newTxn;
    } catch (error) {
      if (error instanceof APIError) {
        throw error;
      }
      throw new APIError('Failed to add transaction');
    }
  },

  async deleteTransaction(id: string): Promise<void> {
    try {
      if (!id?.trim()) {
        throw new APIError('Transaction ID is required');
      }
      
      await delay(150);
      const current = await this.getTransactions();
      const txnExists = current.some(t => t.id === id);
      if (!txnExists) {
        throw new APIError('Transaction not found');
      }
      
      const updated = current.filter(t => t.id !== id);
      localStorage.setItem('finance_transactions', JSON.stringify(updated));
    } catch (error) {
      if (error instanceof APIError) {
        throw error;
      }
      throw new APIError('Failed to delete transaction');
    }
  },
};
