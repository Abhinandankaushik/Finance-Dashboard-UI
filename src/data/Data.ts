export type TransactionType = 'income' | 'expense';
export type Category =
  | 'Salary'
  | 'Freelance'
  | 'Food & Dining'
  | 'Shopping'
  | 'Transport'
  | 'Entertainment'
  | 'Utilities'
  | 'Healthcare'
  | 'Education'
  | 'Rent'
  | 'Investments'
  | 'Other';

export interface Transaction {
  id: string;
  date: string;
  description: string;
  amount: number;
  type: TransactionType;
  category: Category;
}

export type Role = 'admin' | 'viewer';

const categories: Category[] = [
  'Food & Dining', 'Shopping', 'Transport', 'Entertainment',
  'Utilities', 'Healthcare', 'Education', 'Rent', 'Other',
];

const incomeCategories: Category[] = ['Salary', 'Freelance', 'Investments'];

const descriptions: Record<string, string[]> = {
  'Food & Dining': ['Starbucks Coffee', 'Whole Foods Market', 'Chipotle', 'Uber Eats Order', 'DoorDash Delivery'],
  Shopping: ['Amazon Purchase', 'Nike Store', 'Apple Store', 'Target', 'Best Buy'],
  Transport: ['Uber Ride', 'Gas Station', 'Metro Card', 'Lyft Ride', 'Parking Fee'],
  Entertainment: ['Netflix Subscription', 'Spotify Premium', 'Movie Tickets', 'Concert Tickets', 'Steam Game'],
  Utilities: ['Electric Bill', 'Water Bill', 'Internet Service', 'Phone Bill', 'Gas Bill'],
  Healthcare: ['Pharmacy', 'Doctor Visit', 'Gym Membership', 'Dental Checkup'],
  Education: ['Udemy Course', 'Book Purchase', 'Online Certification', 'Workshop Fee'],
  Rent: ['Monthly Rent', 'Parking Space Rent'],
  Other: ['ATM Withdrawal', 'Bank Fee', 'Donation', 'Gift'],
  Salary: ['Monthly Salary', 'Bonus Payment'],
  Freelance: ['Client Payment', 'Project Milestone', 'Consulting Fee'],
  Investments: ['Dividend Income', 'Stock Sale', 'Interest Income'],
};

function randomBetween(min: number, max: number) {
  return Math.round((Math.random() * (max - min) + min) * 100) / 100;
}

function generateTransactions(): Transaction[] {
  const txns: Transaction[] = [];
  const now = new Date();

  for (let i = 0; i < 120; i++) {
    const daysAgo = Math.floor(Math.random() * 180);
    const date = new Date(now);
    date.setDate(date.getDate() - daysAgo);

    const isIncome = Math.random() < 0.25;
    const type: TransactionType = isIncome ? 'income' : 'expense';
    const catList = isIncome ? incomeCategories : categories;
    const category = catList[Math.floor(Math.random() * catList.length)];
    const descList = descriptions[category] || ['Transaction'];
    const description = descList[Math.floor(Math.random() * descList.length)];
    const amount = isIncome ? randomBetween(500, 8000) : randomBetween(5, 500);

    txns.push({
      id: crypto.randomUUID(),
      date: date.toISOString().split('T')[0],
      description,
      amount,
      type,
      category,
    });
  }

  return txns.sort((a, b) => b.date.localeCompare(a.date));
}

export const mockTransactions: Transaction[] = generateTransactions();
