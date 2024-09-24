'use client';

import { createContext, useContext } from 'react';
import { PortAreaFeature } from '@/lib/types/ports-api.types';

const PortAreaApiContext = createContext<PortAreaFeature[]>([]);

export const usePortAreaApi = () => useContext(PortAreaApiContext);

export const PortAreaApiProvider = ({
  children,
  value,
}: {
  children: React.ReactNode;
  value: PortAreaFeature[];
}) => {
  return (
    <PortAreaApiContext.Provider value={value}>
      {children}
    </PortAreaApiContext.Provider>
  );
};
