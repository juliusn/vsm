'use client';

import { createContext, useContext } from 'react';

type ContextType = {
  vessels: AppTypes.Vessel[];
  locations: AppTypes.Location[];
  portAreas: AppTypes.PortArea[];
  berths: AppTypes.Berth[];
};

type PortDataProviderProps = {
  children: React.ReactNode;
} & ContextType;

const PortDataContext = createContext<ContextType | null>(null);

export const PortDataProvider = ({
  children,
  vessels,
  locations,
  portAreas,
  berths,
}: PortDataProviderProps) => {
  return (
    <PortDataContext.Provider value={{ vessels, locations, portAreas, berths }}>
      {children}
    </PortDataContext.Provider>
  );
};

export const usePortData = () => {
  const context = useContext(PortDataContext);

  if (!context) {
    throw new Error('usePortData must be used within PortDataProvider.');
  }

  return context;
};
