'use client';

import { createContext, useContext } from 'react';

const PortAreaDbContext = createContext<string[]>([]);

export const usePortAreaDb = () => useContext(PortAreaDbContext);

export const PortAreaDbProvider = ({
  children,
  value,
}: {
  children: React.ReactNode;
  value: string[];
}) => {
  return (
    <PortAreaDbContext.Provider value={value}>
      {children}
    </PortAreaDbContext.Provider>
  );
};
