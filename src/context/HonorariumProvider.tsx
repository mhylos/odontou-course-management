"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

interface HonorariumEntry {
  honorarium_id: number;
  rut: number;
  amount: number;
}

interface HonorariumAmountContextType {
  academics: HonorariumEntry[];
  administrative: HonorariumEntry[];
  addOrUpdateAdministrative: (value: HonorariumEntry) => void;
  addOrUpdateAcademic: (value: HonorariumEntry) => void;
}

const HonorariumAmountContext = createContext<
  HonorariumAmountContextType | undefined
>(undefined);

interface HonorariumAmountProviderProps {
  children: ReactNode;
}

export function HonorariumAmountProvider({
  children,
}: HonorariumAmountProviderProps) {
  const [academics, setAcademics] = useState<HonorariumEntry[]>([]);
  const [administrative, setAdministrative] = useState<HonorariumEntry[]>([]);

  function addOrUpdateAdministrative(value: HonorariumEntry) {
    setAdministrative((prev) => {
      const index = prev.findIndex(
        (item) => item.honorarium_id === value.honorarium_id
      );
      if (index === -1) {
        return [...prev, value];
      }
      const updated = [...prev];
      updated[index] = value;
      return updated;
    });
  }

  function addOrUpdateAcademic(value: HonorariumEntry) {
    setAcademics((prev) => {
      const index = prev.findIndex(
        (item) => item.honorarium_id === value.honorarium_id
      );
      if (index === -1) {
        return [...prev, value];
      }
      const updated = [...prev];
      updated[index] = value;
      return updated;
    });
  }

  return (
    <HonorariumAmountContext.Provider
      value={{
        academics,
        administrative,
        addOrUpdateAdministrative,
        addOrUpdateAcademic,
      }}
    >
      {children}
    </HonorariumAmountContext.Provider>
  );
}

export const useHonorariumAmount = (): HonorariumAmountContextType => {
  const context = useContext(HonorariumAmountContext);
  if (!context) {
    throw new Error(
      "useHonorariumAmount must be used within a HonorariumAmountProvider"
    );
  }
  return context;
};
