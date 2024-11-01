'use client';

import {
  createContext,
  Dispatch,
  SetStateAction,
  useContext,
  useState,
} from 'react';

interface PortDataContextType {
  locations: AppTypes.Location[];
  setLocations: Dispatch<SetStateAction<AppTypes.Location[]>>;
}

const PortDataContext = createContext<PortDataContextType | null>(null);

export function usePortDataContext() {
  const context = useContext(PortDataContext);
  if (!context) {
    throw new Error(
      `usePortDataContext must be used within a PortDataProvider.`
    );
  }
  return context;
}

export function PortDataProvider({
  children,
  initialLocations,
}: {
  children: React.ReactNode;
  initialLocations: AppTypes.Location[];
}) {
  const [locations, setLocations] = useState(initialLocations);

  return (
    <PortDataContext.Provider value={{ locations, setLocations }}>
      {children}
    </PortDataContext.Provider>
  );
}
