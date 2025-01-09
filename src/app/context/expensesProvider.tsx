"use client";

import { createContext, useContext, useRef } from "react";
import { createStore, StoreApi, useStore } from "zustand";
import { Expenses } from "@prisma/client";

type ExpenseStore = {
  changedExpenses: Partial<Expenses>[];
  addExpense: (expense: Partial<Expenses>) => void;
  changeExpense: (expense: Partial<Expenses>) => void;
  removeChangedExpense: () => void;
};

const ExpensesContext = createContext<StoreApi<ExpenseStore> | undefined>(
  undefined
);

export interface ExpensesProviderProps {
  children: React.ReactNode;
  expenses: Expenses[];
}

export const ExpensesProvider = ({ children }: ExpensesProviderProps) => {
  const expensesRef = useRef<StoreApi<ExpenseStore>>();
  if (!expensesRef.current) {
    expensesRef.current = createStore<ExpenseStore>(() => ({
      changedExpenses: [],
      addExpense: (expense) => {
        expensesRef.current?.setState((state) => ({
          changedExpenses: [...state.changedExpenses, expense],
        }));
      },
      changeExpense: (expense) => {
        expensesRef.current?.setState((state) => ({
          changedExpenses: state.changedExpenses.map((i) =>
            i.name === expense.name ? { ...i, ...expense } : i
          ),
        }));
      },
      removeChangedExpense: () => {
        expensesRef.current?.setState({ changedExpenses: [] });
      },
    }));
  }
  return (
    <ExpensesContext.Provider value={expensesRef.current}>
      {children}
    </ExpensesContext.Provider>
  );
};

export const useExpenses = <T,>(selector: (store: ExpenseStore) => T): T => {
  const expensesContext = useContext(ExpensesContext);

  if (!expensesContext) {
    throw new Error(`useExpenses must be used within useExpensesProvider`);
  }

  return useStore(expensesContext, selector);
};
