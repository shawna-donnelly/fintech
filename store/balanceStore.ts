import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { zustandStorage } from './mmkv-storage';

export interface Transaction {
  id: string;
  amount: number;
  date: Date;
  title: string;
}

export interface BalanceState {
  transactions: Transaction[];
  balance: number;
  runTransaction: (transaction: Transaction) => void;
  clearTransactions: () => void;
}

export const useBalanceStore = create<BalanceState>()(
  persist(
    set => ({
      transactions: [],
      balance: 0,
      runTransaction: (transaction: Transaction) => {
        set(state => ({
          transactions: [...state.transactions, transaction],
          balance: state.balance + transaction.amount,
        }));
      },
      clearTransactions: () => {
        set({ transactions: [], balance: 0 });
      },
    }),
    {
      name: 'balance-storage',
      storage: createJSONStorage(() => zustandStorage),
      partialize: state => ({
        transactions: state.transactions,
        balance: state.balance,
      }),
      onRehydrateStorage: () => state => {
        // Validate and recalculate balance from transactions on rehydration
        // This ensures data consistency in case of any corruption
        if (state) {
          const calculatedBalance = state.transactions.reduce(
            (acc, transaction) => acc + transaction.amount,
            0
          );
          // Only update if there's a mismatch (tolerance for floating point errors)
          if (Math.abs(state.balance - calculatedBalance) > 0.01) {
            state.balance = calculatedBalance;
          }
        }
      },
    }
  )
);
