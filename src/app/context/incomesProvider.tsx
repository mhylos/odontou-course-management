"use client";

import { createContext, useContext, useRef } from "react";
import { createStore, StoreApi, useStore } from "zustand";
import { IncomeUpdateBody } from "@/lib/definitions";

type IncomesStore = {
  changedIncomes: IncomeUpdateBody[];
  addIncome: (income: IncomeUpdateBody) => void;
  changeIncome: (income: IncomeUpdateBody) => void;
  removeChangedIncomes: () => void;
};

const IncomesContext = createContext<StoreApi<IncomesStore> | undefined>(
  undefined
);

export interface IncomesProviderProps {
  children: React.ReactNode;
}

export const IncomesProvider = ({ children }: IncomesProviderProps) => {
  const incomesRef = useRef<StoreApi<IncomesStore>>();
  if (!incomesRef.current) {
    incomesRef.current = createStore<IncomesStore>(() => ({
      changedIncomes: [],
      addIncome: (income) => {
        incomesRef.current?.setState((state) => ({
          changedIncomes: [...state.changedIncomes, income],
        }));
      },
      changeIncome: (income) => {
        incomesRef.current?.setState((state) => ({
          changedIncomes: state.changedIncomes.map((i) =>
            i.name === income.name ? { ...i, ...income } : i
          ),
        }));
      },
      removeChangedIncomes: () => {
        incomesRef.current?.setState({ changedIncomes: [] });
      },
    }));
  }
  return (
    <IncomesContext.Provider value={incomesRef.current}>
      {children}
    </IncomesContext.Provider>
  );
};

export const useIncomes = <T,>(selector: (store: IncomesStore) => T): T => {
  const incomesContext = useContext(IncomesContext);

  if (!incomesContext) {
    throw new Error(`useIncomes must be used within useIncomesProvider`);
  }

  return useStore(incomesContext, selector);
};
