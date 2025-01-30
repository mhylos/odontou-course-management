"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

interface Honorarium {
  honorarium_id: number;
  rut: number;
  amount: number;
  type: "academic" | "administrative";
}

interface HonorariumContextType {
  setHonorarium: (honorarium: Honorarium) => void;
  honorarium: Honorarium | undefined;
}

const HonorariumContext = createContext<HonorariumContextType | undefined>(
  undefined
);

interface HonorariumProviderProps {
  children: ReactNode;
}

export function HonorariumAmountProvider({
  children,
}: HonorariumProviderProps) {
  const [honorarium, setHonorarium] = useState<Honorarium>();

  return (
    <HonorariumContext.Provider value={{ setHonorarium, honorarium }}>
      {children}
    </HonorariumContext.Provider>
  );
}

export const useHonorariumAmount = (): HonorariumContextType => {
  const context = useContext(HonorariumContext);
  if (!context) {
    throw new Error(
      "useHonorariumAmount must be used within a HonorariumAmountProvider"
    );
  }
  return context;
};
